const Router = require('koa-router');
const router = new Router();
const cass = require('../cassandra/index');

router.get('/testQuery', async (ctx) => {
  try {
    var result = await cass.testSelect();
    ctx.status = 200;
    ctx.body = {
      answer: result
    };
  } catch (error) {
    console.error(error);
  };
});

module.exports = router;