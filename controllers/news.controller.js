const { receiveAllTopics } = require("../modulles/news.modules");

exports.getAllTopics = (req, res) => {
  console.log("controlles");
  receiveAllTopics();
};
