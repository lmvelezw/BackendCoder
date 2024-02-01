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

  async getAllUsers() {
    try {
      let allUsers = await userModel.find();

      let users = allUsers.map((user) => user.toObject());
      return users;
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

  async findInactiveUsers() {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    return await userModel.find({
      last_connection: { $lt: twoDaysAgo },
    });
  }

  async deleteInactiveUsers() {
    try {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const result = await userModel.deleteMany({
        last_connection: { $lt: twoDaysAgo },
      });
      return result;
    } catch (error) {
      console.log("DAO error in deleteInactiveUsers:", error);
      throw error;
    }
  }
}

export default Users;
