exports.error_handler = (req, res) => {
  res.status(404).send({ msg: "path is not correct" });
};
