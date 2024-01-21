import Carts from "../dao/classes/carts.dao.js";
import Products from "../dao/classes/product.dao.js";
import config from '../config/config.js'
import nodemailer from 'nodemailer'
import customError from "../services/errors/CustomError.js"

const specificError = new customError()

//Nodemailer
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 8080,
  auth:{
    user: config.gmailUser,
    pass: config.gmailPass
  }
})

const carts = new Carts();
const products = new Products();

class CartManager {
  constructor() {}

  async readCarts(req, res) {
    try {
      let cartsAvailable = await carts.getCarts();
      return res.send({ result: "success", payload: cartsAvailable });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async getCartByID(req, res) {
    let { id } = req.params;
    try {
      let cartsInfo = await carts.getCartByID(id);
      let cart = req.session.user.cart.toString();
      return res.render("cartProducts", { cartsInfo, cart });
    } catch (error) {
      console.log("err", error);
      specificError({statusCode: 500, causeKey: 'SERVER_ERROR', message: 'Error occurred while fetching carts' })
      return res.status(500).send("Server Error");
    }
  }

  async createCart(req, res) {
    try {
      let result = carts.createCart();
      return res.send({ result: "success", payload: result });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async createProductInCart(req, res) {
    let { cid, pid } = req.params;
    let quantity = req.body.quantity;

    try {
      if (!cid || !pid || !quantity) {
        return res.send({
          status: "error",
          error: "Missing product, cart, or quantity",
        });
      }

      let updatedCart = await carts.createProductInCart(cid, pid, quantity);

      return res.redirect("/api/products");
    } catch (error) {
      console.log("err", error.message);
      return res.status(500).send("Server Error");
    }
  }

  async addMultipleProductsToCart(req, res) {
    let { cid } = req.params;
    let products = req.body;

    try {
      let updatedCart = await carts.addMultipleProductsToCart(cid, products);
      return res.send({
        result: "success",
        payload: updatedCart,
      });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async deleteCart(req, res) {
    try {
      let { id } = req.params;
      let result = await carts.deleteCart(id);
      return res.send({ result: "success", payload: result });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async deleteProductInCart(req, res) {
    let { cid, pid } = req.params;

    try {
      if (!cid || !pid) {
        return res.send({
          status: "error",
          error: "Invalid cart or product ID",
        });
      }

      let updatedCart = await carts.deleteProductInCart(cid, pid);

      return res.send({ result: "success", payload: updatedCart });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }

  async closedPurchase(req, res) {
    try {
      let { cid } = req.params;
      let user = req.session.user.email.toString()

      let result = await carts.closedPurchase(cid, req);

      await transport.sendMail({
        from: config.gmailUser,
        to: user,
        subject: `Ticket de compra`,
        text: JSON.stringify(result),
      })


      return res.send({ result: "success", payload: result });
    } catch (error) {
      console.log("err", error);
      return res.status(500).send("Server Error");
    }
  }
  // async readClosedPurchase(req, res) {
  //   try {
  //     let purchase = await carts.getPurchase();
  //     return res.render("purchase", purchase);
  //   } catch (error) {
  //     console.log("err", error);
  //     return res.status(500).send("Server Error");
  //   }
  // }
}

export default CartManager;
