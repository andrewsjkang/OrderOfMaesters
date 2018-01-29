const Router = require('koa-router');
const router = new Router();

router.post('/maesters', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'You have reached the Maesters'
  };
});

module.exports = router;