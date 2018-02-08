const Router = require('koa-router');
const router = new Router();
const daemons = require('../workers/events');
const cass = require('../cassandra/index');

//// OLD ROUTE ////
//// ONLY FOR USE WITHOUT BUS ////
router.post('/maesters', async (ctx) => {
  // console.log('ctx body:', ctx.request.body);
  console.time('⚡ route speed ⚡');
  // var data = ctx.request.body;
  // var dateTime = data.timestamp.slice(0, data.timestamp.length - 1).split('T');

  // var params = [
  //   data.bucketId, 
  //   data.event, 
  //   dateTime[0],
  //   dateTime[1],
  //   data.videoId, 
  //   data.userId, 
  //   data.searchId
  // ];

  try {
    // console.log(params);
    // const logPromise = cass.insertLog(params);
    // const countDayPromise = cass.counterDate(params.slice(0, 3));
    // const countMonthPromise = cass.counterMonth([params[0], params[1], params[2].slice(0, 7)]);
    // const countYearPromise = cass.counterYear([params[0], params[1], params[2].slice(0, 4)]);
    // const [log, countDay, countMonth, countYear] = await Promise.all([logPromise, countDayPromise, countMonthPromise, countYearPromise]);
    console.time('⚡ daemon speed ⚡');
    const result = await daemons.processEvent(ctx.request.body);
    console.timeEnd('⚡ daemon speed ⚡');

    ctx.status = 201;
    console.timeEnd('⚡ route speed ⚡'); 
    ctx.body = {
      status: 'success',
      // data: [log, countDay, countMonth, countYear]
      data: result
    };
  } catch(error) {
    console.error(error);
  }

  //// without clicker ////
  // try {
  //   var result = await cass.insertLog(params);
  //   // console.log('INSERT RESULT!!!', result);
  //   console.timeEnd('⚡ route speed ⚡');    
  //   ctx.status = 201;
  //   ctx.body = {
  //     status: 'success',
  //     data: result
  //   };
  // } catch (error) {
  //   console.log(error);
  // }
});

module.exports = router;