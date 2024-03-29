import Bootcamp from "../models/Bootcamp.js";
import { parseQuery } from "../utils/parseQuery.js";
import path from "path";
export {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
};

const getBootcamps = (req, res, next) => {
  let { parsedQuery, fields, sortBy, startIndex, limit } = parseQuery(
    req.query
  );

  Bootcamp.find(parsedQuery)
    .select(fields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .populate("courses")
    .then((bootcamps) => {
      res.status(200).json({ success: true, data: bootcamps });
    })
    .catch((err) => {
      next(err);
    });
};

const getBootcamp = (req, res, next) => {
  console.log(req.params.id);
  Bootcamp.findById(req.params.id)
    .then((bootcamp) => {
      if (!bootcamp)
        return res
          .status(400)
          .json({ success: false, msg: "bootcamp doesn't exist" });

      res.status(200).json({ success: true, data: bootcamp });
    })
    .catch((err) => {
      next(err);
    });
};

const createBootcamp = (req, res, next) => {
  req.body.user = req.user.id;

  Bootcamp.create(req.body)
    .then((bootcamp) => {
      res
        .status(201)
        .json({ success: true, data: bootcamp, msg: "bootcamp created!" });
    })
    .catch((err) => {
      next(err);
    });
};

const updateBootcamp = (req, res, next) => {
  Bootcamp.findById(req.params.id)
    .then((bootcamp) => {
      if (!bootcamp) {
        return res
          .status(400)
          .json({ success: false, msg: "bootcamp doesn't exist" });
      }

      if (
        bootcamp.user.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({
          success: false,
          msg: `User ${req.user.id} is authorized to update bootcamp ${bootcamp._id}`,
        });
      }

      return Bootcamp.findByIdAndUpdate(req.params.id, req.body);
    })
    .then((bootcamp) => {
      res
        .status(200)
        .json({ success: true, data: bootcamp, msg: "bootcamp updated!" });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteBootcamp = (req, res, next) => {
  Bootcamp.findById(req.params.id)
    .then((bootcamp) => {
      if (!bootcamp) {
        return res
          .status(400)
          .json({ success: false, msg: "bootcamp doesn't exist" });
      }

      if (
        bootcamp.user.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({
          success: false,
          msg: `User ${req.user.id} is authorized to delete bootcamp ${bootcamp._id}`,
        });
      }

      return Bootcamp.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res
        .status(200)
        .json({ success: true, data: {}, msg: "bootcamp deleted!" });
    })
    .catch((err) => {
      next(err);
    });
};

const uploadBootcampPhoto = (req, res, next) => {
  if (!req.files)
    return res
      .status(400)
      .json({ success: false, msg: "No Images were uploaded" });

  const uploadedFile = req.files.file;

  if (!uploadedFile.mimetype.startsWith("image"))
    return res
      .status(400)
      .json({ success: false, msg: "Please Upload an Image!!" });

  uploadedFile.name = `${req.params.id}${path.parse(uploadedFile.name).ext}`;

  Bootcamp.findById(req.params.id)
    .then((bootcamp) => {
      if (!bootcamp) {
        return res
          .status(400)
          .json({ success: false, msg: "bootcamp doesn't exist" });
      }

      if (
        bootcamp.user.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({
          success: false,
          msg: `User ${req.user.id} is authorized to upload photo of bootcamp ${bootcamp._id}`,
        });
      }

      return Bootcamp.findByIdAndUpdate(req.params.id, {
        photo: uploadedFile.name,
      });
    })
    .then(() => {
      return uploadedFile.mv(
        `${process.env.FILE_UPLOAD_PATH}/${uploadedFile.name}`
      );
    })
    .then(() => {
      res
        .status(200)
        .json({ success: true, msg: "Image Uploaded Successfully!!" });
    })
    .catch((err) => {
      next(err);
    });
};
