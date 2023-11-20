const { receiveAllTopics } = require("../modulles/news.modules");

exports.getAllTopics = (req, res) => {
  receiveAllTopics()
    .then((data) => {
      return data.rows;
    })
    .then((topics) => {
      res.status(200).send({ topics: topics });
    });
};
