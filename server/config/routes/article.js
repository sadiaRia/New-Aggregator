const Article = require("../../article");
const utils = require("../../utils");


app.get('/article/search', utils.wrapAsync(Article.filterArticles));

