import Products from "../dao/classes/product.dao.js";

const productsDao = new Products();

class ProductManager {
  constructor() {}

  async getAllProducts(req, res) {
    try {
      let { productsInfo, query } = await productsDao.getAllProducts(req);
      const user = req.session.user || null;

      return res.render("home", {
        productsInfo,
        query: req.query,
        user: user,
      });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async getProductByID(req, res) {
    try {
      let product = await productsDao.getProductByID(req);
      return res.send({ result: "success", payload: product });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async createProduct(req, res) {
    try {
      let result = await productsDao.createProduct(req);
      return res.redirect("/api/products");
    } catch (error) {
      return console.log(error);
    }
  }

  async updateProduct(req, res) {
    let updateProduct = req.body;
    if (
      !updateProduct.title ||
      !updateProduct.description ||
      !updateProduct.code ||
      !updateProduct.price ||
      !updateProduct.stock ||
      !updateProduct.category
    ) {
      return res.send({ status: "error", error: "Missing data for product" });
    }

    try {
      let result = await productsDao.updateProduct(req, updateProduct);
      return res.send({ result: "success", payload: result });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async deleteProduct(req, res) {
    try {
      let result = await productsDao.deleteProduct(req);
      return res.redirect("/api/products");
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }
  async newProduct(req, res) {
    try {
      return res.render("createProduct");
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }
}

export default ProductManager;
