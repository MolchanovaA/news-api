exports.error_handler = (req, res) => {
  res.status(404).send({ msg: "path is not correct" });
};

exports.handle_custom_errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(404).send({ msg: "bad request" });
  }
};
