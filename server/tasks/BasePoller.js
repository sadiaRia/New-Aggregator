function BasePoller() {
  this.init = function (pollableModel, emitter) {
    this.model = pollableModel;
    this.emitter = emitter;
  };

  this.pollableQuery = function () {
    throw new Error('The pollableQuery method must be implemented!');
  };

  this.getDocuments = function (callback) {
    this.pollableQuery(callback);
  };

  this.emitPolledDocuments = function () {
    throw new Error('The emitPolledDocuments method must be implemented!');
  };

  this.poll = function () {
    throw new Error('The poll method must be implemented!');
  };
}

module.exports = BasePoller;
