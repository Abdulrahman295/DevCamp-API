import Course from "../models/Course.js";
import { parseQuery } from "../utils/parseQuery.js";

export const getCourses = (req, res, next) => {
  let coursesPromise;
  let { parsedQuery, fields, sortBy, startIndex, limit } = parseQuery(
    req.query
  );

  if (req.params.bootcampId) {
    coursesPromise = Course.find({
      bootcamp: req.params.bootcampId,
      ...parsedQuery,
    });
  } else {
    coursesPromise = Course.find(parsedQuery).populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  coursesPromise
    .select(fields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .then((courses) => {
      res.status(200).json({ success: true, data: courses });
    })
    .catch((err) => {
      next(err);
    });
};

export const getCourse = (req, res, next) => {
  Course.findById(req.params.id)
    .populate({
      path: "bootcamp",
      select: "name description",
    })
    .then((course) => {
      if (!course)
        return res
          .status(400)
          .json({ success: false, msg: "course doesn't exist" });

      res.status(200).json({ success: true, data: course });
    })
    .catch((err) => {
      next(err);
    });
};

export const createCourse = (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  Course.create(req.body)
    .then((course) => {
      res
        .status(201)
        .json({ success: true, data: course, msg: "course created!" });
    })
    .catch((err) => {
      next(err);
    });
};

export const updateCourse = (req, res, next) => {
  console.log(req.body);
  Course.findByIdAndUpdate(req.params.id, req.body)
    .then((course) => {
      if (!course) {
        return res
          .status(400)
          .json({ success: false, msg: "course doesn't exist" });
      }
      res.status(200).json({ success: true, data: course });
    })
    .catch((err) => {
      next(err);
    });
};

export const deleteCourse = (req, res, next) => {
  Course.findByIdAndDelete(req.params.id)
    .then((course) => {
      if (!course) {
        return res
          .status(400)
          .json({ success: false, msg: "course doesn't exist" });
      }
      res.status(200).json({ success: true, data: {} });
    })
    .catch((err) => {
      next(err);
    });
};
