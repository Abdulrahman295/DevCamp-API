import User from "../models/User.js";

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

      const resetToken = user.getResetPasswordToken();

      return user.save();
    })
    .then((user) => {
      res.status(200).json({
        success: true,
        data: user,
      });
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
