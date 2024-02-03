import productModel from "../models/products.model.js";
import nodemailer from "nodemailer";
import config from "../../config/config.js";
import userModel from "../models/users.model.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 8080,
  auth: {
    user: config.gmailUser,
    pass: config.gmailPass,
  },
});

class Products {
  constructor() {}

  async getAllProducts(req) {
    try {
      let limit = req.query.limit || 10;
      let page = req.query.page || 1;
      let sort = req.query.sort || "none";
      let category = req.query.category || null;

      let query = {};

      if (category) {
        query.category = category;
      }

      let options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort !== "none" ? sort : undefined,
      };

      if (sort === "asc" || sort === "desc") {
        options.sort = { price: sort === "asc" ? 1 : -1 };
      }

      let productsToShow = await productModel.paginate(query, options);

      const productsInfo = {
        docs: productsToShow.docs.map((doc) => doc.toObject()),
        hasNextPage: productsToShow.hasNextPage,
        nextPage: productsToShow.nextPage,
        hasPrevPage: productsToShow.hasPrevPage,
        prevPage: productsToShow.prevPage,
      };

      return {
        productsInfo: productsInfo,
        query: req.query,
      };
    } catch (error) {
      console.log("err", error);
    }
  }

  async getProductByID(id) {
    try {
      let product = await productModel.find({ _id: id });
      return product;
    } catch (error) {
      console.log("err", error);
    }
  }

  async createProduct(req) {
    let { title, description, code, price, stock, category, image } = req.body;

    if (
      req.session.user.role !== "premium" &&
      req.session.user.role !== "admin"
    ) {
      throw new Error("User has no permissions");
    }

    const owner = req.session.user.userId;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Incomplete data");
    }
    try {
      let result = await productModel.create({
        title,
        description,
        code,
        price,
        stock,
        category,
        image,
        owner: owner,
      });
      return result;
    } catch (error) {
      return console.log(error);
    }
  }

  async updateProduct(id, updateProduct) {
    try {
      let result = await productModel.updateOne({ _id: id }, updateProduct);
      return result;
    } catch (error) {
      console.log("err", error);
    }
  }
  async deleteProduct(req) {
    let { id } = req.params;
    const { role, email } = req.session.user;
    let product = await productModel.findById(id);
    let ownerId = product.owner;

    try {
      const ownerUser = await userModel.findById(ownerId);
      if (!ownerUser) {
        throw new Error("Owner not found");
      }
      let ownerEmail = ownerUser.email;
      let ownerRole = ownerUser.role;

      if (role === "admin" || (role === "premium" && email === ownerEmail)) {
        let result = await productModel.deleteOne({ _id: id });

        if (ownerRole === "premium") {
          await transport.sendMail({
            from: config.gmailUser,
            to: ownerEmail,
            subject: "Product Deletion Notification",
            text: `Your product titled "${product.title}" has been successfully deleted.`,
          });
        }

        return result;
      } else {
        throw new Error("Unauthorized to delete this product");
      }
    } catch (error) {
      console.log("err", error);
    }
  }
}

export default Products;
