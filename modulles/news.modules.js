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

// exports.receiveAllAndSort = (tableName, query) => {
//   let queryStr = `SELECT * FROM ${tableName} ORDER BY created_at DESC`;
//   return db.query();
// };

exports.countComments = () => {
  return db.query(
    `SELECT articles.article_id 
    , COUNT(comments.comment_id) as comment_count
FROM articles
INNER JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id;
`
  );
};
