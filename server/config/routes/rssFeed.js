"use strict";

const RssFeed = require("../../rssFeed");
const utils = require("../../utils");

module.exports = (app) => {
    app.get(
        "/rssFeed/:id",
        utils.wrapAsync(RssFeed.getRssFeed)
    );

    app.get(
        "/rssFeed/",
        utils.wrapAsync(RssFeed.listRssFeeds)
    );

    app.post(
        "/rssFeed",
        utils.wrapAsync(RssFeed.addRssFeed)
    );


    app.delete(
        "/rssFeed/:url",
        utils.wrapAsync(RssFeed.removeRssFeed)
    );

    app.get('/rssFeed/extract/article', utils.wrapAsync(RssFeed.extractArticleFromFeed))
};
