'use strict';

module.exports.startTasks = () => {
  console.log('Periodic tasks started');
  [
    'testPolling'
  ].forEach((periodicTask) => {
    require('./' + periodicTask).start();
  });
};
