//// Packages ////
const Koa = require('koa');
const parser = require('koa-bodyparser');
//// Routes ////
const indexRoutes = require('./routes/index');
const maestersRoutes = require('./routes/maesters');
const testRoutes = require('./routes/testQuery');

const app = new Koa();
const PORT = process.env.PORT || 1337;

// X-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// Logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} \n⤷ Response time is: ${ms}ms`);
});

app.use(parser());
app.use(indexRoutes.routes());
app.use(maestersRoutes.routes());
app.use(testRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;