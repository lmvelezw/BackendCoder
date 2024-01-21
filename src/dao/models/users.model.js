import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profilePic: {
    filename: String,
    originalname: String,
  },
  cart: {
    type: mongoose.Types.ObjectId,
    ref: "carts",
  },
  documents: [
    {
      doc_name: String,
      doc_reference: String,
    },
  ],
  last_connection: {
    type: Date,
    default: null,
  },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
