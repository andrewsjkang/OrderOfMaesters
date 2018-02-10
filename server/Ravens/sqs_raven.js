// require('newrelic');
//// Packages ////
require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const parser = require('koa-bodyparser');
/// ADUBS CONFIG ////
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'maesters'});
AWS.config.credentials = credentials;
AWS.config.update({region: process.env.AWS_REGION});

const app = new Koa();
const PORT = process.env.PORT || 3000;
const router = new Router();

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const QueueUrl = "https://sqs.us-west-1.amazonaws.com/736880112034/TheRavens";

const sendRaven = (params) => {
  sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });
}

router.post('/maesters', async (ctx) => {
  var data = ctx.request.body;
  var stringData = JSON.stringify({
    bucketId: data.bucketId,
    event: data.event,
    timestamp: data.timestamp,
    videoId: data.videoId,
    userId: data.userId,
    searchId: data.searchId
  });
  var options = {
    DelaySeconds: 0,
    MessageBody: stringData,
    QueueUrl: QueueUrl
   }; 
   try {
     var confirmation = await sendRaven(options);
     ctx.status = 201;
     ctx.body = {
       "status": "success",
       "message": "Raven sent."
     }
   } catch (error) {
     console.error(error);
   }
});


app.use(parser());
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;