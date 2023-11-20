const express = require("express");
const { getAllTopics } = require("./controllers/news.controller");
const { error_handler } = require("./error-handlers/error-handler");
const app = express();

app.get("/api/topics", getAllTopics);
module.exports = app;

app.all("*", error_handler);
