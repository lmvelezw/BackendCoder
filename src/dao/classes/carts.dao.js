import cartsModel from "../models/carts.model.js";
import Products from "./product.dao.js";
import ticketModel from "../models/ticket.model.js";
import { nanoid } from "nanoid";
import productModel from "../models/products.model.js";

const products = new Products();

class Carts {
  async getCarts() {
    try {
      let carts = await cartsModel.find();
      return carts;
    } catch (error) {
      console.log("err", error);
    }
  }

  async getCartByID(id) {
    try {
      let cart = await cartsModel.findById(id).populate("products.product");
      let cartsInfo = cart.toObject();
      return cartsInfo;
    } catch (error) {
      console.log("err", error);
    }
  }

  async createCart() {
    try {
      let result = cartsModel.create({});
      return result;
    } catch (error) {
      console.log("err", error);
    }
  }

  async createProductInCart(cid, pid, quantity, role, email) {
    try {
      // const { role, email } = req.session.user;
      let product = await productModel.findById(pid);
      let owner = product.owner;

      if (role === "premium" && email === owner) {
        throw new Error("You can't add your own product to the shopping cart!");
      }

      let updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": parseInt(quantity) } },
        { new: true }
      );

      if (!updatedCart) {
        let cartExists = await cartsModel.findById({ _id: cid });

        if (!cartExists) {
          throw new Error("Cart not found");
        }

        cartExists.products.push({ product: pid, quantity: quantity });
        updatedCart = await cartExists.save();
      }

      return updatedCart;
    } catch (error) {
      console.log("err", error);
    }
  }

  async addMultipleProductsToCart(cid, products) {
    try {
      let cartExists = await cartsModel.findById({ _id: cid });

      if (!cartExists) {
        return res.send({ result: "error", error: "Cart not found" });
      }
      cartExists.products.push(...products);
      let updatedCart = await cartExists.save();
      return updatedCart;
    } catch (error) {
      console.log("err", error);
    }
  }

  async deleteCart(id) {
    try {
      let result = await cartsModel.updateOne(
        { _id: id },
        { $set: { products: [] } }
      );
      return result;
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async deleteProductInCart(cid, pid) {
    try {
      let cartExists = await cartsModel.findById(cid);
      if (!cartExists) {
        throw new Error("Cart not found");
      }

      cartExists.products = cartExists.products.filter(
        (prod) => prod.product.toString() !== pid
      );

      let updatedCart = await cartExists.save();

      return updatedCart;
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async closedPurchase(cid, req) {
    try {
      let cartExists = await this.getCartByID(cid);
      if (!cartExists) {
        throw new Error("Cart not found");
      }

      let purchaseList = [];

      for (const cartProduct of cartExists.products) {
        let productId = cartProduct.product._id.toString();
        let productCartQty = cartProduct.quantity;

        let productData = await products.getProductByID(productId);
        let productStock = productData[0].stock;
        let productTitle = productData[0].title;
        let productPrice = productData[0].price;
        let totalPricePerProduct = productPrice * productCartQty;

        if (!productData) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        if (productCartQty <= productStock) {
          purchaseList.push({
            productId,
            productCartQty,
            productTitle,
            productPrice,
            totalPricePerProduct,
          });
          let newQuantity = productStock - productCartQty;

          await products.updateProduct(productId, { stock: newQuantity });
          await this.deleteProductInCart(cid, productId);
        }
      }

      if (purchaseList.length <= 0) {
        return new Error("No items available for purchase");
      }

      let totalAmount = 0;
      for (const purchaseItem of purchaseList) {
        totalAmount += purchaseItem.totalPricePerProduct;
      }

      let user = req.session.user.email.toString();

      const consolidatedTicketData = {
        code: nanoid(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: user,
      };

      const consolidatedTicket = await ticketModel.create(
        consolidatedTicketData
      );

      return consolidatedTicket;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to process purchase");
    }
  }

  async createTicket() {
    try {
      let result = await ticketModel.create({
        code,
        purchase_datetime,
        amount,
        purchaser,
      });
      return result;
    } catch (error) {
      return console.log(error);
    }
  }
}

export default Carts;
