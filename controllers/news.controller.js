const { receiveAllTopics } = require("../modulles/news.modules");

exports.getAllTopics = (req, res) => {
  receiveAllTopics().then((topics) => {
    return res.status(200).send({ topics: topics });
  });
};
