const db = require("../db/connection");

exports.receiveAllTopics = (req, res) => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};
