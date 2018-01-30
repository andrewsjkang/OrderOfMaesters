const Router = require('koa-router');
const router = new Router();
const cass = require('../cassandra/index');

router.post('/maesters', async (ctx) => {
  console.log('ctx body:', ctx.request.body);
  var data = ctx.request.body;
  var params = [data.type, data.event, data.day, data.time, data.video_id, data.user_id, data.search_id];

  try {
    var result = await cass.insertLog(params);
    console.log('INSERT RESULT!!!', result);
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: result
    };
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;