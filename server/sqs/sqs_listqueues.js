require('dotenv').config();
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the Credentials
var credentials = new AWS.SharedIniFileCredentials({profile: 'maesters'});
AWS.config.credentials = credentials;
// Set the region 
AWS.config.update({region: process.env.AWS_REGION});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {};

sqs.listQueues(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.QueueUrls);
  }
});