const _ = require('lodash'),
  moment = require('moment'),
    RssFeed = require('../../rssFeed/index'),
  BasePoller = require('../BasePoller');

const ExtractArticle = function () {
  this.pollableQuery = async function (callback) {
    let query =  {
      deleted: false,
      isUrlRetrieved: false
    };

   const articles =  await RssFeed.extractArticle(query);
   console.log(articles);
  };

  this.emitPolledDocuments = function (polledDocuments, callback) {
    polledDocuments = _.compact(polledDocuments);
    console.log('Inside emit polled documents', polledDocuments);
    callback(null, polledDocuments);
  };

  this.poll = function (callback) {
    const self = this;
    self.getDocuments(function (err, polledDocuments) {
      if (err) {
        console.log('Failed to fetch polled documents');
        return callback(err);
      }
      self.emitPolledDocuments(polledDocuments, callback);
    });
  };
};

ExtractArticle.prototype = new BasePoller();

module.exports = ExtractArticle;
