const {
  receiveAll,
  receiveAllEndpoints,
  toAddEndpointsInfo,
  writeEndpoints,
  selectArticleById,
  getArticlesWithCommentCounts,
  postCommentToDb,
} = require("../modulles/news.modules");

exports.getAllTopics = (req, res) => {
  const table = "topics";
  receiveAll(table).then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.getAvailableEndpoints = (req, res) => {
  receiveAllEndpoints().then((endpoints) => {
    const parsedListOfEndpoints = JSON.parse(endpoints);
    const toCorrectPathsIsNeed = checkPropertiesOfEndpoints(
      parsedListOfEndpoints
    );

    if (toCorrectPathsIsNeed) {
      const updatedEndpoints = toAddEndpointsInfo(
        JSON.parse(endpoints),
        toCorrectPathsIsNeed
      );
      writeEndpoints(updatedEndpoints).then(() => {
        res.status(200).send({ listOfEndpoints: updatedEndpoints });
      });
    } else {
      res.status(200).send({ listOfEndpoints: endpoints });
    }
  });
};

const checkPropertiesOfEndpoints = (endpointsObject) => {
  const necessaryProperties = ["description", "queries", "exampleResponse"];
  const pathsNeedToUpdate = [];

  for (key in endpointsObject) {
    const currentPath = {};
    currentPath[key] = [];

    necessaryProperties.forEach((property) => {
      if (!endpointsObject[key][property]) {
        currentPath[key].push(property);
      }
    });
    if (currentPath[key].length) pathsNeedToUpdate.push(currentPath);
  }

  return !pathsNeedToUpdate.length ? false : pathsNeedToUpdate;
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(({ rows }) => {
      if (!rows.length) {
        res.status(404).send({ msg: "not found" });
      }
      res.status(200).send({ article: rows[0] });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        res.status(400).send({ msg: "bad request" });
      }
    });
};

exports.getAllArticles = (req, res, next) => {
  getArticlesWithCommentCounts().then(({ rows }) => {
    res.status(200).send({ articles: rows });
  });
};

exports.postNewComment = (req, res, next) => {
  // console.log(req.body, "POST");
  if (!req.body.username || !req.body.body)
    res.status(400).send({ msg: "bad request" });
  const { article_id } = req.params;
  const date = Date.now();
  const commentToPost = [
    req.body.body,
    req.body.username,
    article_id,
    0,
    new Date(date),
  ];

  // console.log(commentToPost, " CMM");

  postCommentToDb(commentToPost).then(({ rows }) => {
    res.status(201).send({ posted_comment: rows[0] });
  });
};
