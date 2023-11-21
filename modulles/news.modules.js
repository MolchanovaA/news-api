const { error } = require("console");
const db = require("../db/connection");
const fs = require("fs/promises");

exports.receiveAllTopics = (req, res) => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.receiveAllEndpoints = (req, res) => {
  const endpointsFile = "endpoints.json";
  return fs.readFile(endpointsFile, "utf-8").then((dataEndpoints) => {
    return dataEndpoints;
  });
};

exports.toAddEndpointsInfo = (listOfAllEndpoints, corrections) => {
  corrections.forEach((endpoint) => {
    const path = Object.keys(endpoint)[0];
    endpoint[path].forEach((missedProperty) => {
      listOfAllEndpoints[path][missedProperty] = "some description";
    });
  });
  return listOfAllEndpoints;
};

exports.writeEndpoints = (endpoints) => {
  const endpointsFile = "endpoints.json";
  return fs.writeFile(endpointsFile, JSON.stringify(endpoints, null, 2));
};

exports.selectArticleById = (id, comments) => {
  let queryStr = `SELECT * FROM articles WHERE article_id =$1`;
  if (comments) {
    queryStr = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id =$1 ORDER BY created_at DESC`;
  }
  return db.query(queryStr, [id]).catch((err) => {
    throw err;
  });
};
