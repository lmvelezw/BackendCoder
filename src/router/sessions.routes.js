import { Router } from "express";
import usersModel from "../dao/models/users.model.js";
import UsersManager from "../controllers/usersControllers.js";
import passport from "passport";
import userModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const userManager = new UsersManager();
const sessionRouter = Router();

sessionRouter.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

const User = new usersModel();

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/api/sessions/login",
    failureRedirect: "/api/sessions/failregister",
  }),
  userManager.registerUser
);

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/login",
  }),
  userManager.loginUser
);

sessionRouter.get("/logout", userManager.logoutUser);

sessionRouter.get("/fullprofile", userManager.fullProfileUser);
sessionRouter.post("/profilePicUpload", userManager.uploadProfilePic);

sessionRouter.get("/github", userManager.githubLogin);
sessionRouter.get("/githubcallback", userManager.githubCallback);

sessionRouter.get("/register", async (req, res) => {
  res.render("register");
});

sessionRouter.get("/failregister", async (req, res) => {
  res.render("failregister");
});

sessionRouter.get("/login", async (req, res) => {
  res.render("login");
});

sessionRouter.get("/premium/:userId", userManager.changeUserRole);

sessionRouter.post("/premium/:userId", userManager.updateUserRole);

sessionRouter.get("/passrecover/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect("/api/sessions/login");
    }

    return res.render("passwordReset", { token });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send("Server Error");
  }
});

sessionRouter.post("/passrecover/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const newPassword = req.body.password;
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.render("passwordResetExpired");
    }
    if (isValidPassword(user, newPassword)) {
      return res.send(
        "New password should be different from the existing one."
      );
    }

    user.password = createHash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.redirect("/api/sessions/login");
  } catch (error) {
    console.log("err", error);
    return res.status(500).send("Server Error");
  }
});

sessionRouter.get("/verifypassrecovery", async (req, res) => {
  res.render("VerifyPassRecovery");
});

sessionRouter.post(
  "/sendrecoveryemail",
  userManager.validateUser,
  async (req, res) => {
    res.redirect("/api/sessions/login");
  }
);

export default sessionRouter;
