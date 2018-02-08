require('newrelic');
require('dotenv').config();
const Router = require('koa-router');
const router = new Router();
const cass = require('../cassandra/index');
// const daemons = require('../workers/events');
//// ADUBS config ////
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'maesters'});
AWS.config.credentials = credentials;
AWS.config.update({region: process.env.AWS_REGION});
AWS.config.setPromisesDependency(null);
// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var queueURL = "https://sqs.us-west-1.amazonaws.com/736880112034/TheRavens";

var params = {
 MaxNumberOfMessages: 10,
 QueueUrl: queueURL,
 VisibilityTimeout: 60,
 WaitTimeSeconds: 0
};

//// BATCH MESSAGES TEST ////
async function getRaven() {
  try {
    console.time('⚡ receive speed ⚡');
    console.time('⚡ full speed ⚡');
    var data = await sqs.receiveMessage(params).promise();
    console.timeEnd('⚡ receive speed ⚡');
    if (data.Messages) {
      var promises = [];
      var receiptHandles = [];
  
      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      console.time('⚡ all Promise speed ⚡');
      for (var i = 0; i < data.Messages.length; i++) {
        receiptHandles.push({
          Id: data.Messages[i].MessageId,
          ReceiptHandle: data.Messages[i].ReceiptHandle
        });
        promises.push(processEvent(JSON.parse(data.Messages[i].Body)));
      }
      var results = await Promise.all(promises);
      console.timeEnd('⚡ all Promise speed ⚡');

      var deleteParams = {
        QueueUrl: queueURL,
        Entries: receiptHandles
      };
      console.time('⚡ delete speed ⚡');
      sqs.deleteMessageBatch(deleteParams, function(error, data) {
        if (error) {
          console.log("Delete Error", error);
        } else {
          // console.timeEnd('⚡ query speed ⚡');
          // console.log("Message Deleted", data);
          console.timeEnd('⚡ delete speed ⚡');
          console.timeEnd('⚡ full speed ⚡');
          getRaven();
        }
      });
    } else if (!data.Messages) {
      console.log('EMPTY');
      getRaven();
    }
  } catch(error) {
    console.error('RECEIVE ERROR', error);
  };
};
// getRaven();


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
//// MULTI ////
// const getRaven = () => {
//   console.time('⚡ query speed ⚡');
//   sqs.receiveMessage(params, function(err, data) {
//     if (err) {
//       console.log("Receive Error", err);
//     } else if (data.Messages) {
//       console.log('RECEIVED MESSAGE', data.Messages);
//       var parsed = JSON.parse(data.Messages[0].Body);
//       var logData = [
//         parsed.bucketId, 
//         parsed.event, 
//         parsed.day, 
//         parsed.time, 
//         parsed.videoId, 
//         parsed.userId, 
//         parsed.searchId
//       ];

//       cass.insertLog(logData)
//         .catch(error => console.error('Error Inserting into Log', error))
//         .then(result => {
//           var deleteParams = {
//             QueueUrl: queueURL,
//             ReceiptHandle: data.Messages[0].ReceiptHandle
//           };
//           sqs.deleteMessage(deleteParams, function(err, data) {
//             if (err) {
//               console.log("Delete Error", err);
//             } else {
//               console.timeEnd('⚡ query speed ⚡');
//               console.log("Message Deleted", data);
//               // getRaven();
//             }
//           });
//       });
//     //// IF NO RAVENS ////
//     } else if (!data.Messages) {
//       console.log('EMPTY');
//       getRaven(); 
//     }
//   });
// };
// getRaven();

async function removeFromQueue(ReceiptHandle) {
  console.log('ReceiptHandle', ReceiptHandle);
  var deleteParams = {
    QueueUrl: queueURL,
    ReceiptHandle: ReceiptHandle
  };

  sqs.deleteMessage(deleteParams, function(error, data) {
    if (err) {
      console.log("Delete Error", err);
    } else {
      console.timeEnd('⚡ query speed ⚡');
      console.log("Message Deleted", data);
      // getRaven();
    }
  });
}

module.exports = {
  removeFromQueue
};