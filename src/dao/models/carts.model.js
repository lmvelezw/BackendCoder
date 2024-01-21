import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "products",
        },
        quantity: { type: Number },
      },
    ],
    default: [],
  },
  total: { type: Number },
});

const cartsModel = mongoose.model(cartCollection, cartSchema);

export default cartsModel;
