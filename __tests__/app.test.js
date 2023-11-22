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
const { expect } = require("@jest/globals");

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

describe("task 5 /api/articles", () => {
  test("GET 200. should return an array of all articles, sorted by DESC (earliest if the first), has no body as property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(articleData.length);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});

describe("task 7. POST /api/articles/:article_id/comments", () => {
  test("POST 201. returns comment that has been posted", () => {
    const postBody = {
      username: "rogersop",
      body: "Hi There",
    };
    const outputComment = {
      comment_id: 19,
      body: "Hi There",
      article_id: 4,
      author: "rogersop",
      votes: 0,
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(postBody)
      .expect(201)
      .then(({ body }) => {
        expect(body.posted_comment).toMatchObject(outputComment);
        expect(typeof body.posted_comment.created_at).toBe("string");
      });
  });
  test("POST 400. if comment doesn't have user / body", () => {
    const postBody = {
      username: "rogersop",
    };

    return request(app)
      .post("/api/articles/4/comments")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });
  test("POST 404 if user doesn't exist", () => {
    const postBody = {
      username: "not_registered",
      body: "Hi There",
    };

    return request(app)
      .post("/api/articles/4/comments")
      .send(postBody)
=======

describe("Task 6 /api/articles/:article_id/comments", () => {
  test("GET 200, returns array of comments of passed as article_id article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 404, returns error msg as no such article exists", () => {
    return request(app)
      .get("/api/articles/99/comments")

      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });

  test("POST 400 bad article_id", () => {
    const postBody = {
      username: "rogersop",
      body: "Hi There",
    };
    return request(app)
      .post("/api/articles/bad_art_id/comments")
      .send(postBody)

  test("GET 400, article id is not correct", () => {
    return request(app)
      .get("/api/articles/1dd/comments")

      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request");
      });
  });

  test("Status 404: valid article_id that doesn't exist e.g. 683", () => {
    const postBody = {
      username: "rogersop",
      body: "Hi There",
    };
    return request(app)
      .post("/api/articles/444/comments")
      .send(postBody)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("Status 201: Ignores extra unnecessary keys on request body", () => {
    const postBody = {
      username: "rogersop",
      body: "Hi There",
      additionalKey: "info",
    };
    const outputComment = {
      comment_id: 19,
      body: "Hi There",
      article_id: 4,
      author: "rogersop",
      votes: 0,
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(postBody)
      .expect(201)
      .then(({ body }) => {
        expect(body.posted_comment).toMatchObject(outputComment);
        expect(typeof body.posted_comment.created_at).toBe("string");

  test("GET 200, and empty [] in no comments in existing article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);

      });
  });
});
