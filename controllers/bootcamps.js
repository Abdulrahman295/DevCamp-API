export {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};

const getBootcamps = (req, res) => {
  res.status(200).json({ success: true, msg: "getting all bootcamps" });
};

const getBootcamp = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `getting bootcamp with id ${req.params.id}` });
};

const createBootcamp = (req, res) => {
  res.status(200).json({ success: true, msg: "creating bootcamp" });
};

const updateBootcamp = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `updating bootcamp with id ${req.params.id}` });
};

const deleteBootcamp = (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `deleting bootcamp with id ${req.params.id}` });
};
