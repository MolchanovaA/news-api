const db = require("../db/connection");
const fs = require("fs/promises");
const format = require("pg-format");

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
  return fs.writeFile(endpointsFile, JSON.stringify(endpoints, null, 2));
};

exports.selectArticleById = (id) => {
  let queryStr = `SELECT * FROM articles WHERE article_id =$1`;

  return db.query(queryStr, [id]).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ code: 404, msg: "not found" });
    }
    return data.rows;
  });
};

exports.selectCommentsByArticleId = (id) => {
  const queryStr = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id =$1 ORDER BY created_at DESC`;

  return db.query(queryStr, [id]).then((data) => {
    return data.rows;
  });
};

exports.getArticlesWithCommentCounts = (queries) => {
  let psqlStr = `SELECT articles.article_id, articles.author , articles.title, articles.topic,
    articles.created_at, articles.votes, articles.article_img_url
    , COUNT(comments.comment_id) as comment_count
FROM articles
FULL JOIN comments
ON articles.article_id = comments.article_id 
`;
  const queriesKeys = Object.keys(queries);
  const additionalInfo = [];

  if (queriesKeys.length) {
    additionalInfo.push(queries[queriesKeys[0]]);
    psqlStr = `SELECT articles.article_id, articles.author , articles.title, articles.topic,
    articles.created_at, articles.votes, articles.article_img_url
    , COUNT(comments.comment_id) as comment_count
FROM articles
FULL JOIN comments
ON articles.article_id = comments.article_id
WHERE articles.topic = $1`;
  }

  psqlStr += `
GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;

  return db.query(psqlStr, additionalInfo).then(({ rows }) => {
    if (!rows.length) return Promise.reject({ code: 404, msg: "not found" });
    return rows;
  });
};

exports.postCommentToDb = (comment) => {
  const queryStr =
    "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L  RETURNING *;";
  return db.query(format(queryStr, [comment]));
};

exports.deleteCommentById = (id) => {
  const queryPsql = `DELETE FROM comments WHERE comment_id = $1 RETURNING*;`;
  return db.query(queryPsql, [id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ code: 404, msg: "not found" });
    }
  });
};

exports.patchToDb = ({ table_name, title, newValue, article_id, column }) => {
  // console.log(table_name, title, newValue, article_id, "jj");
  const queryPsql = `UPDATE ${table_name} SET ${title} = $1 WHERE ${column} = $2 RETURNING *;`;

  return db.query(queryPsql, [newValue, article_id]);
};
