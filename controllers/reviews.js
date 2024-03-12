import Review from "../models/Review.js";
import Bootcamp from "../models/Bootcamp.js";
import { parseQuery } from "../utils/parseQuery.js";
export { getReviews, getReview, createReview, updateReview, deleteReview };

const getReviews = (req, res, next) => {
  let reviewPromise;
  let { parsedQuery, fields, sortBy, startIndex, limit } = parseQuery(
    req.query
  );

  if (req.params.bootcampId) {
    reviewPromise = Review.find({
      bootcamp: req.params.bootcampId,
      ...parsedQuery,
    });
  } else {
    reviewPromise = Review.find(parsedQuery).populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  reviewPromise
    .select(fields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .then((reviews) => {
      res.status(200).json({ success: true, data: reviews });
    })
    .catch((err) => {
      next(err);
    });
};

const getReview = (req, res, next) => {
  Review.findById(req.params.id)
    .populate({
      path: "bootcamp",
      select: "name description",
    })
    .then((review) => {
      if (!review)
        return res
          .status(400)
          .json({ success: false, msg: "review doesn't exist" });

      res.status(200).json({ success: true, data: review });
    })
    .catch((err) => {
      next(err);
    });
};

const createReview = (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user;

  Bootcamp.findById(req.params.bootcampId)
    .then((bootcamp) => {
      if (!bootcamp)
        return res
          .status(400)
          .json({ success: false, msg: "bootcamp doesn't exist" });

      return Review.create(req.body);
    })
    .then((review) => {
      res
        .status(201)
        .json({ success: true, msg: "review created!!", data: review });
    })
    .catch((err) => {
      next(err);
    });
};

const updateReview = (req, res, next) => {
  Review.findById(req.params.id)
    .then((review) => {
      if (!review)
        return res
          .status(400)
          .json({ success: false, msg: "review doesn't exist" });

      if (review.user.toString() !== req.user.id && req.user.role !== "admin")
        return res.status(401).json({
          success: false,
          msg: `User ${req.user.id} is not authorized to update this review`,
        });

      return Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    })
    .then((review) => {
      res
        .status(200)
        .json({ success: true, msg: "review updated!!", data: review });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteReview = (req, res, next) => {
  Review.findById(req.params.id)
    .then((review) => {
      if (!review)
        return res
          .status(400)
          .json({ success: false, msg: "review doesn't exist" });

      if (review.user.toString() !== req.user.id && req.user.role !== "admin")
        return res.status(401).json({
          success: false,
          msg: `User ${req.user.id} is not authorized to delete this review`,
        });

      return Review.findByIdAndDelete(req.params.id);
    })
    .then((review) => {
      res
        .status(200)
        .json({ success: true, msg: "review deleted!!", data: {} });
    })
    .catch((err) => {
      next(err);
    });
};
