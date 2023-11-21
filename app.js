const express = require("express");
const {
  getAllTopics,
  getAvailableEndpoints,
  getArticleById,
  getArticleAndItsComments,
} = require("./controllers/news.controller");
const {
  error_handler,
  handle_all_errors,
} = require("./error-handlers/error-handler");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAvailableEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleAndItsComments);

app.all("*", error_handler);
app.use(handle_all_errors);
module.exports = app;
