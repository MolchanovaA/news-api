const express = require("express");
const {
  getAllTopics,
  getAvailableEndpoints,
  getAllArticles,
  getArticleById,
  getArticleAndItsComments,
  postNewComment,
  patchArticle,
  deleteComment,
} = require("./controllers/news.controller");

const {
  error_handler,

  psql_errors,
  custom_errors,
  other_errors,
} = require("./error-handlers/error-handler");
const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getAvailableEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getArticleAndItsComments);

app.post("/api/articles/:article_id/comments", postNewComment);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.all("*", error_handler);

app.use(psql_errors);

app.use(custom_errors);
app.use(other_errors);
module.exports = app;
