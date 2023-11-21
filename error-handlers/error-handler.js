exports.error_handler = (req, res) => {
  res.status(404).send({ msg: "path is not correct" });
};
exports.psqlErrors = (error, res) => {
  console.log("PPSLS");
  console.log(error);
  //  if (err.code === "22P02") {
  //    console.log("PASSED");
  //    res.status(400).send({ msg: "bad request" });
  //  }
};

exports.handle_custom_errors = (err, req, res, next) => {
  console.log("CUSTOM ERROR");
};
