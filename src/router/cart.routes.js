import { Router } from "express";
import CartManager from "../controllers/cartsControllers.js";
import { checkAccess } from "../controllers/accessControl.js";

const cartManager = new CartManager();

const cartRouter = Router();

cartRouter.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

cartRouter.get("/", cartManager.readCarts);
cartRouter.get("/:id", checkAccess(["user"]), cartManager.getCartByID);
cartRouter.post("/", cartManager.createCart);
cartRouter.post("/:cid/product/:pid",
  checkAccess(["user"]),
  cartManager.createProductInCart
);
cartRouter.post(
  "/:cid",
  checkAccess(["user"]),
  cartManager.addMultipleProductsToCart
);
cartRouter.delete("/:id", checkAccess(["user"]), cartManager.deleteCart);
cartRouter.delete(
  "/:cid/product/:pid",
  checkAccess(["user"]),
  cartManager.deleteProductInCart
);

// cartRouter.get("/:cid/purchase", checkAccess(["user"]), cartManager.readClosedPurchase)
cartRouter.post("/:cid/purchase", checkAccess(["user"]), cartManager.closedPurchase)
cartRouter.get("/:cid/purchase", checkAccess(["user"]), cartManager.closedPurchase)


export default cartRouter;
