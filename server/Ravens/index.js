//// ADUBS config ////
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'maesters'});
AWS.config.credentials = credentials;
AWS.config.update({region: process.env.AWS_REGION});
AWS.config.setPromisesDependency(null);
// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var queueURL = "https://sqs.us-west-1.amazonaws.com/736880112034/TheRavens";

module.exports = sqs;