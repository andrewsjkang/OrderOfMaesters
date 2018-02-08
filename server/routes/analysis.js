const Router = require('koa-router');
const router = new Router();
const cass = require('../cassandra/index');

//// ANALYSIS RETURNS ALL STATS USING TODAYS DATE ////
router.get('/analysis', async (ctx) => {
  var today = new Date().toISOString().split('T');

  try {
    const dateP = cass.dayStats([today[0]]);
    const monthP = cass.monthStats([today[0].slice(0, 7)]);
    const yearP = cass.yearStats([today[0].slice(0, 4)]);
    const [date, month, year] = await Promise.all([dateP, monthP, yearP]);
    ctx.status = 200;
    ctx.body = {
      date: date.rows,
      month: month.rows,
      year: year.rows
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
  }
});

//// RETURNS TODAYS STATISTICS ////
router.get('/analysis/day', async (ctx) => {
  var today = new Date().toISOString().split('T');

  try {
    const dayResult = await cass.dayStats([today[0]]);
    ctx.status = 200;
    ctx.body = {
      result: dayResult.rows
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
  }
});

//// RETURNS A GIVEN DAY'S STATISTICS ////
router.get('/analysis/day/:date', async (ctx) => {
  try {
    const dayResult = await cass.dayStats([ctx.params.date]);
    ctx.status = 200;
    ctx.body = {
      result: dayResult.rows
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
  }
})

//// RETURNS THIS MONTH'S STATISTICS ////
router.get('/analysis/month', async (ctx) => {
  var today = new Date().toISOString().split('T');

  try {
    const monthResult = await cass.monthStats([today[0].slice(0, 7)]);
    ctx.status = 200;
    ctx.body = {
      result: monthResult.rows
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
  }
})

//// RETURNS A GIVEN MONTH'S STATISTICS ////
router.get('/analysis/month/:month', async (ctx) => {
  try {
    const monthResult = await cass.monthStats([ctx.params.month]);
    ctx.status = 200;
    ctx.body = {
      result: monthResult.rows
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
  }
})

//// RETURNS THIS YEAR'S STATISTICS ////
router.get('/analysis/year', async (ctx) => {
  var today = new Date().toISOString().split('T');

  try {
    const yearResult = await cass.yearStats([today[0].slice(0, 4)]);
    ctx.status = 200;
    ctx.body = {
      result: yearResult.rows
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
  }
})

//// RETURNS A GIVEN YEAR'S STATISTICS ////
router.get('/analysis/year/:year', async (ctx) => {
  try {
    const yearResult = await cass.yearStats([ctx.params.year]);
    ctx.status = 200;
    ctx.body = {
      result: yearResult.rows
    }
  } catch (error) {
    console.error(error);
    ctx.status = 400;
  }
})

module.exports = router;