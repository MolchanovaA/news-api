exports.error_handler = (req, res) => {
  res.status(404).send({ msg: "path is not correct" });
};

exports.psql_errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.custom_errors = (err, req, res, next) => {
  if (err.msg && err.code) {
    res.status(err.code).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.other_errors = (err, req, res, next) => {
  res.status(500).send({ msg: "something went wrong" });
};
