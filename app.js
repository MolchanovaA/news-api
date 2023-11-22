const express = require("express");
const {
  getAllTopics,
  getAvailableEndpoints,
  getAllArticles,
  getArticleById,
  getArticleAndItsComments,
} = require("./controllers/news.controller");

const {
  error_handler,

  psql_errors,
  custom_errors,
  other_errors,
} = require("./error-handlers/error-handler");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAvailableEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleAndItsComments);

app.get("/api/articles", getAllArticles);

app.all("*", error_handler);

app.use(psql_errors);

app.use(custom_errors);
app.use(other_errors);
module.exports = app;
