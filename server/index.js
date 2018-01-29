//// Packages ////
const Koa = require('koa');
const parser = require('koa-bodyparser');
//// Routes ////
const indexRoutes = require('./routes/index');
const maestersRoutes = require('./routes/maesters');

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(parser());
app.use(indexRoutes.routes());
app.use(maestersRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;