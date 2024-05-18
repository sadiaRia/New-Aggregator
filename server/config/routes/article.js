const Article = require("../../article");
const utils = require("../../utils");

module.exports = (app) => {

    app.get('/article/search', utils.wrapAsync(Article.filterArticles));

}