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

describe("task 2. GET /api/topics", () => {
  test("GET 200 /api/topics. Has to return an arr of objs.  The length of topics array should be same as in data file. Each obj has to have description and slug properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(topicData.length);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });

  test("GET: 404 if path is not correct send status 404 and error msg", () => {
    return request(app)
      .get("/api/not-correct")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path is not correct");
      });
  });
});

describe("task 3. GET /api", () => {
  test("GET 200 /api. Has to return a JSON file. Each obj has to have description property", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { listOfEndpoints } }) => {
        let isJson;
        try {
          JSON.parse(listOfEndpoints);
          isJson = true;
        } catch {
          isJson = false;
        }

        expect(isJson).toBe(true);
      });
  });

  test("GET 200 /api. Each obj has to have description,  property", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { listOfEndpoints } }) => {
        const parsedEndpoints = JSON.parse(listOfEndpoints);

        for (key in parsedEndpoints) {
          expect(parsedEndpoints[key]).toHaveProperty("description");
          expect(parsedEndpoints[key]).toHaveProperty("queries");
          expect(parsedEndpoints[key]).toHaveProperty("exampleResponse");
        }
      });
  });
});

describe("task 4. /api/articles/:article_id", () => {
  test("GET 200 /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });

  test("GET 404  /api/articles/:article_id if provided wrong id", () => {
    return request(app)
      .get("/api/articles/wrong-id")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
});
