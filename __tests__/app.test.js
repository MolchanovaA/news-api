const app = require("../app");
const request = require("supertest");

const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData }).then(() => {});
});

afterAll(() => {
  return db.end();
});

xdescribe("task 2. GET /api/topics", () => {
  test("GET /api/topics. Has to return", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        console.log("BODY");
      });
  });
});
