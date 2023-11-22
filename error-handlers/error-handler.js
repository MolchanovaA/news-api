exports.error_handler = (req, res) => {
  res.status(404).send({ msg: "path is not correct" });
};
exports.psqlErrors = (error, res) => {};

exports.handle_all_errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    res.status(404).send({ msg: err.msg });
  }
};
