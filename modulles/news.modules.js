const db = require("../db/connection");
const fs = require("fs/promises");

exports.receiveAll = (tableName) => {
  return db.query(`SELECT * FROM ${tableName};`).then(({ rows }) => {
    return rows;
  });
};

exports.receiveAllEndpoints = () => {
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
  return fs.writeFile(endpointsFile, JSON.stringify(endpoints, 2));
};

exports.countComments = () => {
  return db.query(
    `SELECT articles.article_id, articles.author , articles.title, articles.topic,
    articles.created_at, articles.votes, articles.article_img_url
    , COUNT(comments.comment_id) as comment_count
FROM articles
FULL JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id ORDER BY articles.created_at DESC;
`
  );
};
