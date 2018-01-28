const Koa = require('koa');
const parser = require('koa-bodyparser');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(parser());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})