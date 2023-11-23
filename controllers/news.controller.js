const { response } = require("../app");
const {
  receiveAll,
  receiveAllEndpoints,
  toAddEndpointsInfo,
  writeEndpoints,
  selectArticleById,
  selectCommentsByArticleId,
  getArticlesWithCommentCounts,
  postCommentToDb,
  patchToDb,
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
    .then((rows) => {
      res.status(200).send({ article: rows[0] });
    })
    .catch(next);
};

exports.getArticleAndItsComments = (req, res, next) => {
  const { article_id } = req.params;
  const ifArticleExists = selectArticleById(article_id);

  const commentsFromArticle = selectCommentsByArticleId(article_id);

  Promise.all([ifArticleExists, commentsFromArticle])
    .then(([article, comments]) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  getArticlesWithCommentCounts().then(({ rows }) => {
    res.status(200).send({ articles: rows });
  });
};

exports.postNewComment = (req, res, next) => {
  if (!req.body.username || !req.body.body) {
    return res.status(400).send({ msg: "bad request" });
  }
  const { article_id } = req.params;

  const date = Date.now();
  const commentToPost = [
    req.body.body,
    req.body.username,
    article_id,
    0,
    new Date(date),
  ];

  postCommentToDb(commentToPost)
    .then(({ rows }) => {
      res.status(201).send({ posted_comment: rows[0] });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  selectArticleById(article_id)
    .then((article) => {
      const infoToPath = {
        table_name: "articles",
        column: "article_id",
        title: "votes",
        newValue: +article[0].votes + inc_votes,
        article_id: article_id,
      };

      return patchToDb(infoToPath);
    })
    .then(({ rows }) => {
      res.status(200).send({ article: rows[0] });
    })
    .catch((err) => next(err));
};
