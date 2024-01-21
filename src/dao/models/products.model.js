import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, max: 20, required: true },
  description: { type: String, require: true },
  code: { type: String, require: true },
  price: { type: Number, require: true },
  stock: { type: Number, require: true },
  category: { type: String, max: 20, require: true },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    default: "admin",
    require: true,
  },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
