'use strict';

const schedule = require('node-schedule');

let started = false;
let extractArticlePollJob;

const ExtractArticle = require('./pollers/ExtractArticle');

const extractArticle = new ExtractArticle();
const start = () => {
  console.log('Test polling start method called');
  if (started) { return; }
  started = true;

  const pollingIntervalInMinutes = 59;
  // const cronRule = '00 19 13 * * *'; //running this task 13:1
  const cronRule = '0 0 */12 * * *'; //running this task every twelve hours

  extractArticlePollJob = schedule.scheduleJob(cronRule, _extractArticle((err) => {
    if (err) { console.log('Polling failed', err); }
    console.log('Polling successfully started');
  }));

};

const stop = () => {
  extractArticlePollJob.cancel();
  started = false;
};

function _extractArticle(callback) {
  return () => { extractArticle.poll(callback); };
}


module.exports = {
  start,
  stop
};
