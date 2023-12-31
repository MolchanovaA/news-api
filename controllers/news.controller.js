const {
  receiveAll,
  receiveAllEndpoints,
  selectCommentsByArticleId,
  getArticlesWithCommentCounts,
  postCommentToDb,
  getArticleByIdDB,
  patchToDb,
  deleteCommentById,
} = require("../modules/news.modules");

exports.getAllTopics = (req, res) => {
  const table = "topics";
  receiveAll(table).then((data) => {
    res.status(200).send({ [table]: data });
  });
};

exports.getAvailableEndpoints = (req, res) => {
  receiveAllEndpoints().then((endpoints) => {
    res.status(200).send({ listOfEndpoints: JSON.parse(endpoints) });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  getArticleByIdDB(article_id)
    .then((rows) => {
      res.status(200).send({ article: rows[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleAndItsComments = (req, res, next) => {
  const { article_id } = req.params;
  const ifArticleExists = getArticleByIdDB(article_id);
  const commentsFromArticle = selectCommentsByArticleId(article_id);

  Promise.all([ifArticleExists, commentsFromArticle])
    .then(([article, comments]) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const query = req.query;
  const queriesEntries = Object.entries(query);
  const promises = [];
  const pendingArticles = getArticlesWithCommentCounts(query);
  promises.push(pendingArticles);

  if (query.topics) {
    const ifTopicExists = receiveAll("topics", queriesEntries);
    promises.push(ifTopicExists);
  }

  Promise.all(promises)
    .then(([articleCheck, topicCheck]) => {
      res.status(200).send({ articles: articleCheck });
    })
    .catch((err) => {
      next(err);
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
  getArticleByIdDB(article_id)
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res) => {
  const table = "users";
  receiveAll(table)
    .then((data) => {
      res.status(200).send({ [table]: data });
    })
    .catch((err) => {
      next(err);
    });
};
