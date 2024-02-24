import Bootcamp from "../models/Bootcamp.js";

export {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};

const getBootcamps = (req, res) => {
  Bootcamp.find()
    .then((bootcamps) => {
      res.status(200).json({ success: true, data: bootcamps });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: err.message });
    });
};

const getBootcamp = (req, res) => {
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
      res.status(400).json({ success: false, msg: err.message });
    });
};

const createBootcamp = (req, res) => {
  Bootcamp.create(req.body)
    .then((bootcamp) => {
      res
        .status(201)
        .json({ success: true, data: bootcamp, msg: "bootcamp created!" });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: err.message });
    });
};

const updateBootcamp = (req, res) => {
  Bootcamp.findByIdAndUpdate(req.params.id, req.body)
    .then((bootcamp) => {
      if (!bootcamp) {
        res.status(400).json({ success: false, msg: "bootcamp doesn't exist" });
        return;
      }
      res.status(200).json({ success: true, data: bootcamp });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: err.message });
    });
};

const deleteBootcamp = (req, res) => {
  Bootcamp.findByIdAndDelete(req.params.id)
    .then((bootcamp) => {
      if (!bootcamp) {
        res.status(400).json({ success: false, msg: "bootcamp doesn't exist" });
        return;
      }

      res.status(200).json({ success: true, data: {} });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: err.message });
    });
};
