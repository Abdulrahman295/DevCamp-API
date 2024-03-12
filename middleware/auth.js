import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }

  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(new Error("Token verification failed"));
      } else {
        resolve(decoded.id);
      }
    });
  })
    .then((userId) => {
      return User.findById(userId);
    })
    .then((user) => {
      if (!user) {
        throw new Error("User doesn't exist!!");
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      res.status(401).json({ success: false, message: err.message });
    });
};

export const checkUserRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `User role ${req.user.role} is not authorized to access this route`
      );
      error.status = 403;
      return next(error);
    }
    next();
  };
};
