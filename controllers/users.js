import User from "../models/User.js";
import { parseQuery } from "../utils/parseQuery.js";
export { getUsers, getUser, createUser, updateUser, deleteUser };

const getUsers = (req, res, next) => {
  let { parsedQuery, fields, sortBy, startIndex, limit } = parseQuery(
    req.query
  );

  User.find(parsedQuery)
    .select(fields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .then((users) => {
      res.status(200).json({ success: true, data: users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user)
        return res
          .status(400)
          .json({ success: false, msg: "user doesn't exist" });

      res.status(200).json({ success: true, data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      res
        .status(201)
        .json({ success: true, msg: "user created!!", data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ success: false, msg: "user doesn't exist" });
      }
      res
        .status(200)
        .json({ success: true, msg: "user updated!!", data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ success: false, msg: "user doesn't exist" });
      }
      res
        .status(200)
        .json({ success: true, msg: "user deleted!!", data: user });
    })
    .catch((err) => {
      next(err);
    });
};
