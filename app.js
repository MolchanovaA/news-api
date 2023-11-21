const express = require("express");
const {
  getAllTopics,
  getAvailableEndpoints,
  getAllArticles,
} = require("./controllers/news.controller");
const { error_handler } = require("./error-handlers/error-handler");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api", getAvailableEndpoints);

app.get("/api/articles", getAllArticles);

app.all("*", error_handler);

module.exports = app;
