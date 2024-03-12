import User from "../models/User.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail.js";
export const register = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      sendToken(user, res, 200);
    })
    .catch((err) => {
      next(err);
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, msg: "Please provide an email or password" });

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user)
        return res.status(400).json({
          success: false,
          msg: "User is not registered, please register first!",
        });

      const isValidPassword = user.validatePassword(password);

      if (!isValidPassword)
        return res
          .status(400)
          .json({ success: false, msg: "Invalid credentials" });

      sendToken(user, res, 200);
    })
    .catch((err) => {
      next(err);
    });
};

export const logout = (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
  });

  res.status(200).json({ success: true, msg: "Logged out successfully" });
};

export const getCurrentUser = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user)
        return res.status(400).json({
          success: false,
          msg: "User is not registered, please register first!",
        });

      res.status(200).json({
        success: true,
        data: user,
      });
    })
    .catch((err) => {
      next(err);
    });
};

export const forgotPassword = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ success: false, msg: "There is no user with that email" });
      }

      sendResetPasswordEmail(user, req);

      return user.save();
    })
    .then((user) => {
      res.status(200).json({
        success: true,
        data: user,
        msg: "Reset Password Email sent",
      });
    })
    .catch((err) => {
      next(err);
    });
};

export const resetPassword = (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ success: false, msg: "Invalid Token" });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      return user.save();
    })
    .then((user) => {
      sendToken(user, res, 200);
    })
    .catch((err) => {
      next(err);
    });
};

export const updateEmail = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body, { new: true })
    .then((user) => {
      return res
        .status(200)
        .json({ success: true, data: user, msg: "Email Updated!!" });
    })
    .catch((err) => {
      next(err);
    });
};

export const updatePassword = (req, res, next) => {
  User.findById(req.user.id)
    .select("+password")
    .then((user) => {
      console.log(req.body.currentPassword);
      if (!user.validatePassword(req.body.currentPassword)) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Password" });
      }

      user.password = req.body.newPassword;
      return user.save();
    })
    .then((user) => {
      res
        .status(200)
        .json({ success: true, data: user, msg: "Password Updated!!" });
    })
    .catch((err) => {
      next(err);
    });
};

const sendToken = (user, res, statusCode) => {
  const token = user.getSignedJwtToken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE)),
    secure: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};
