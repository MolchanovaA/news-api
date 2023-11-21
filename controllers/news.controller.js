// const { end } = require("../db/connection");
const {
  receiveAll,
  receiveAllEndpoints,
  toAddEndpointsInfo,
  writeEndpoints,
  countComments,
} = require("../modulles/news.modules");

exports.getAllTopics = (req, res) => {
  const table = "topics";
  receiveAll(table).then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.getAvailableEndpoints = (req, res) => {
  receiveAllEndpoints().then((endpoints) => {
    const parsedListOfEndpoints = JSON.parse(endpoints);
    const toCorrectPathsIsNeed = checkPropertiesOfEndpoints(
      parsedListOfEndpoints
    );

    if (toCorrectPathsIsNeed) {
      const updatedEndpoints = toAddEndpointsInfo(
        JSON.parse(endpoints),
        toCorrectPathsIsNeed
      );
      writeEndpoints(updatedEndpoints).then(() => {
        res.status(200).send({ listOfEndpoints: updatedEndpoints });
      });
    } else {
      res.status(200).send({ listOfEndpoints: endpoints });
    }
  });
};

const checkPropertiesOfEndpoints = (endpointsObject) => {
  const necessaryProperties = ["description", "queries", "exampleResponse"];
  const pathsNeedToUpdate = [];

  for (key in endpointsObject) {
    const currentPath = {};
    currentPath[key] = [];

    necessaryProperties.forEach((property) => {
      if (!endpointsObject[key][property]) {
        currentPath[key].push(property);
      }
    });
    if (currentPath[key].length) pathsNeedToUpdate.push(currentPath);
  }

  return !pathsNeedToUpdate.length ? false : pathsNeedToUpdate;
};

exports.getAllArticles = (req, res, next) => {
  const titles = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const promiseCountedComments = countComments().then(({ rows }) => {
    return rows;
  });

  const promiseArticles = receiveAll("articles");

  Promise.all([promiseCountedComments, promiseArticles]).then(
    ([comments, articles]) => {
      // console.log(comments, articles);
      const commentsObj = comments.reduce((acc, item) => {
        acc[item.article_id] = { comment_count: item.comment_count };
        return acc;
      }, {});
      console.log(commentsObj, "LLL");
      const updatedWithCommentsCountArticleArray = [];
      articles.forEach((item) => {});
    }
  );
};
