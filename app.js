const express = require("express");
const {
  getAllTopics,
  getAvailableEndpoints,
  getArticleById,
} = require("./controllers/news.controller");
const {
  error_handler,
  handle_custom_errors,
} = require("./error-handlers/error-handler");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAvailableEndpoints);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", error_handler);
app.use(handle_custom_errors);
module.exports = app;
