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
  test("GET 200 article with id = 1", () => {
    const article_id_1 = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(article_id_1.article_id);
        expect(article.title).toBe(article_id_1.title);
        expect(article.topic).toBe(article_id_1.topic);
        expect(article.author).toBe(article_id_1.author);
        expect(article.body).toBe(article_id_1.body);
        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(article_id_1.votes);
        expect(article.article_img_url).toBe(article_id_1.article_img_url);
      });
  });

  test("GET 400  /api/articles/:article_id if provided wrong id", () => {
    return request(app)
      .get("/api/articles/wrong-id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });

  test("GET 404 /api/articles/:article_id if provided not existing id", () => {
    return request(app)
      .get("/api/articles/99")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200. should return an array of all articles, sorted by DESC (earliest if the first), has no body as property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(articleData.length);
        expect(articles).toBeSorted("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});
