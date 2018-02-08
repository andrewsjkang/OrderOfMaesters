const cass = require('../cassandra/index');
const { removeFromQueue } = require('../routes/maesters');

async function processEvent(data) {
  var dateTime = data.timestamp.slice(0, data.timestamp.length - 1).split('T');

  var params = [
    data.bucketId, 
    data.event, 
    dateTime[0],
    dateTime[1],
    data.videoId, 
    data.userId, 
    data.searchId
  ];

  try {
    const logPromise = cass.insertLog(params);
    const countDayPromise = cass.counterDate(params.slice(0, 3));
    const countMonthPromise = cass.counterMonth([params[0], params[1], params[2].slice(0, 7)]);
    const countYearPromise = cass.counterYear([params[0], params[1], params[2].slice(0, 4)]);
    const [log, countDay, countMonth, countYear] = await Promise.all([logPromise, countDayPromise, countMonthPromise, countYearPromise]);
  
    return {
      log,
      countDay,
      countMonth,
      countYear
    };
  } catch (error) {
    console.error(error);
  }
};

async function batchEvents(messages) {
  try {
    var promises = [];
    var receiptHandles = [];

    // var deleteParams = {
    //   QueueUrl: queueURL,
    //   ReceiptHandle: data.Messages[0].ReceiptHandle
    // };

    for (var i = 0; i < messages.length; i++) {
      receiptHandles.push(messages[i].ReceiptHandle)
      promises.push(processEvent(messages[i].Body)
        .then(result => 
          removeFromQueue(message[i].ReceiptHandle) )
      );
    }
    var results = await Promises.all(promises);

    return results;
  } catch(error) {
    console.error(error);
  }
};

module.exports = {
  processEvent,
  batchEvents
}