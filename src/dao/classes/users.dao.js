import userModel from "../models/users.model.js";

class Users {
  async getUserByID(id) {
    try {
      let user = await userModel.find({ _id: id });
      return user;
    } catch (error) {
      console.log("err", error);
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      let result = await userModel.updateOne(
        { _id: userId },
        { role: newRole }
      );
      return result;
    } catch (error) {
      console.log("err", error);
    }
  }
}

export default Users;
