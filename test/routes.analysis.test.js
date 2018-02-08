const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server/index');
const cass = require('../server/cassandra/index');

const sample = [
  '2017-03-17',
  '2017-03',
  '2017'
];

describe('routes : analysis', () => {
  before(async () => {
    //// switch keyspace to test db ////
    await cass.client.execute('USE maesters_test');
    //// wipe database of all previous data ////
    var promises = [];
    promises[0] = cass.client.execute('TRUNCATE logs');
    promises[1] = cass.client.execute('TRUNCATE count_days');
    promises[2] = cass.client.execute('TRUNCATE count_months');
    promises[3] = cass.client.execute('TRUNCATE count_years');
    [log, day, month, year] = await Promise.all(promises);
  })
  
  after(async () => {
    var promises = [];
    promises[0] = cass.client.execute('TRUNCATE logs');
    promises[1] = cass.client.execute('TRUNCATE count_days');
    promises[2] = cass.client.execute('TRUNCATE count_months');
    promises[3] = cass.client.execute('TRUNCATE count_years');
    [log, day, month, year] = await Promise.all(promises);
    await cass.client.execute('USE maesters');
  })

  describe('GET /analysis', () => {
    it ('should retrieve all data for today', async () => {
      var today = new Date().toISOString().split('T');
      //// UPDATE TODAY'S DAY COUNTERS ////
      var dayPromises = [];
      dayPromises[0] = await cass.counterDate([1, 'search', today[0]]);
      dayPromises[1] = await cass.counterDate([1, 'videoStart', today[0]]);
      dayPromises[2] = await cass.counterDate([1, 'videoComplete', today[0]]);
      dayPromises[3] = await cass.counterDate([2, 'search', today[0]]);
      dayPromises[4] = await cass.counterDate([2, 'videoStart', today[0]]);
      dayPromises[5] = await cass.counterDate([2, 'videoComplete', today[0]]);
      //// UPDATE THIS MONTH'S COUNTERS ////
      var monthPromises = [];
      monthPromises[0] = await cass.counterMonth([1, 'search', today[0].slice(0, 7)]);
      monthPromises[1] = await cass.counterMonth([1, 'videoStart', today[0].slice(0, 7)]);
      monthPromises[2] = await cass.counterMonth([1, 'videoComplete', today[0].slice(0, 7)]);
      monthPromises[3] = await cass.counterMonth([2, 'search', today[0].slice(0, 7)]);
      monthPromises[4] = await cass.counterMonth([2, 'videoStart', today[0].slice(0, 7)]);
      monthPromises[5] = await cass.counterMonth([2, 'videoComplete', today[0].slice(0, 7)]);
      //// UPDATE THIS YEAR'S COUNTERS ////
      var yearPromises = [];
      yearPromises[0] = await cass.counterYear([1, 'search', today[0].slice(0, 4)]);
      yearPromises[1] = await cass.counterYear([1, 'videoStart', today[0].slice(0, 4)]);
      yearPromises[2] = await cass.counterYear([1, 'videoComplete', today[0].slice(0, 4)]);
      yearPromises[3] = await cass.counterYear([2, 'search', today[0].slice(0, 4)]);
      yearPromises[4] = await cass.counterYear([2, 'videoStart', today[0].slice(0, 4)]);
      yearPromises[5] = await cass.counterYear([2, 'videoComplete', today[0].slice(0, 4)]);

      await Promise.all([dayPromises, monthPromises, yearPromises]);

      var response = await chai.request(server).get('/analysis');
      // there should be a 200 status code
      response.status.should.equal(200);
      // the response should be JSON
      response.type.should.equal('application/json');
      // body should have the proper keys
      response.body.should.include.keys(
        'date', 'month', 'year'
      );
      // body.date should have a length of 6
      response.body.date.length.should.eql(6);
      // body.month should have a length of 6
      response.body.month.length.should.eql(6);
      // body.year should have a length of 6
      response.body.year.length.should.eql(6);
      // date should equal today's date
      response.body.date[0]['day'].should.eql(today[0]);
      // date should equal today's date
      response.body.month[0]['month'].should.eql(today[0].slice(0, 7));
      // date should equal today's date
      response.body.year[0]['year'].should.eql(today[0].slice(0, 4));
    })
  });

  describe('GET /analysis/day', () => {
    it('should get only get the analysis for today', async () => {
      var today = new Date().toISOString().split('T');
      //// UPDATE TODAY'S DAY COUNTERS ////
      var dayPromises = [];
      dayPromises[0] = await cass.counterDate([1, 'search', today[0]]);
      dayPromises[1] = await cass.counterDate([1, 'videoStart', today[0]]);
      dayPromises[2] = await cass.counterDate([1, 'videoComplete', today[0]]);
      dayPromises[3] = await cass.counterDate([2, 'search', today[0]]);
      dayPromises[4] = await cass.counterDate([2, 'videoStart', today[0]]);
      dayPromises[5] = await cass.counterDate([2, 'videoComplete', today[0]]);
      await Promise.all(dayPromises);

      var response = await chai.request(server).get('/analysis/day');
      console.log(response.body);
      // there should be a 200 status code
      response.status.should.equal(200);
      // the response should be JSON
      response.type.should.equal('application/json');
      // body should have the proper keys
      response.body.should.include.keys('result');
      // body.date should have a length of 6
      response.body.result.length.should.eql(6);
    })
  })

  describe('GET /analysis/day/:day', () => {
    it('should get the analysis for a given date', async () => {
      //// UPDATE SAMPLE DAY COUNTERS ////
      var dayPromises = [];
      dayPromises[0] = await cass.counterDate([1, 'search', sample[0]]);
      dayPromises[1] = await cass.counterDate([1, 'videoStart', sample[0]]);
      dayPromises[2] = await cass.counterDate([1, 'videoComplete', sample[0]]);
      dayPromises[3] = await cass.counterDate([2, 'search', sample[0]]);
      dayPromises[4] = await cass.counterDate([2, 'videoStart', sample[0]]);
      dayPromises[5] = await cass.counterDate([2, 'videoComplete', sample[0]]);
      await Promise.all(dayPromises);

      var response = await chai.request(server).get(`/analysis/day/${sample[0]}`);
      console.log(response.body);
      // there should be a 200 status code
      response.status.should.equal(200);
      // the response should be JSON
      response.type.should.equal('application/json');
      // body should have the proper keys
      response.body.should.include.keys('result');
      // body.date should have a length of 6
      response.body.result.length.should.eql(6);
    })
  })

  describe('GET /analysis/month', () => {
    it('should get only get the analysis for this month', async () => {
      var today = new Date().toISOString().split('T');
      //// UPDATE THIS MONTH'S COUNTERS ////
      var monthPromises = [];
      monthPromises[0] = await cass.counterMonth([1, 'search', today[0].slice(0, 7)]);
      monthPromises[1] = await cass.counterMonth([1, 'videoStart', today[0].slice(0, 7)]);
      monthPromises[2] = await cass.counterMonth([1, 'videoComplete', today[0].slice(0, 7)]);
      monthPromises[3] = await cass.counterMonth([2, 'search', today[0].slice(0, 7)]);
      monthPromises[4] = await cass.counterMonth([2, 'videoStart', today[0].slice(0, 7)]);
      monthPromises[5] = await cass.counterMonth([2, 'videoComplete', today[0].slice(0, 7)]);
      await Promise.all(monthPromises);

      var response = await chai.request(server).get('/analysis/month');
      console.log(response.body);
      // there should be a 200 status code
      response.status.should.equal(200);
      // the response should be JSON
      response.type.should.equal('application/json');
      // body should have the proper keys
      response.body.should.include.keys('result');
      // body.date should have a length of 6
      response.body.result.length.should.eql(6);
    })
  })

  describe('GET /analysis/month/:month', () => {
    it('should get the analysis for a given month', async () => {
      var today = new Date().toISOString().split('T');
      //// UPDATE SAMPLE MONTH'S COUNTERS ////
      var monthPromises = [];
      monthPromises[0] = await cass.counterMonth([1, 'search', sample[1]]);
      monthPromises[1] = await cass.counterMonth([1, 'videoStart', sample[1]]);
      monthPromises[2] = await cass.counterMonth([1, 'videoComplete', sample[1]]);
      monthPromises[3] = await cass.counterMonth([2, 'search', sample[1]]);
      monthPromises[4] = await cass.counterMonth([2, 'videoStart', sample[1]]);
      monthPromises[5] = await cass.counterMonth([2, 'videoComplete', sample[1]]);
      await Promise.all(monthPromises);

      var response = await chai.request(server).get(`/analysis/month/${sample[1]}`);
      console.log(response.body);
      // there should be a 200 status code
      response.status.should.equal(200);
      // the response should be JSON
      response.type.should.equal('application/json');
      // body should have the proper keys
      response.body.should.include.keys('result');
      // body.date should have a length of 6
      response.body.result.length.should.eql(6);
    })
  })

  describe('GET /analysis/year', () => {
    it('should get only get the analysis for this year', async () => {
      var today = new Date().toISOString().split('T');
      //// UPDATE THIS YEAR'S COUNTERS ////
      var yearPromises = [];
      yearPromises[0] = await cass.counterYear([1, 'search', today[0].slice(0, 4)]);
      yearPromises[1] = await cass.counterYear([1, 'videoStart', today[0].slice(0, 4)]);
      yearPromises[2] = await cass.counterYear([1, 'videoComplete', today[0].slice(0, 4)]);
      yearPromises[3] = await cass.counterYear([2, 'search', today[0].slice(0, 4)]);
      yearPromises[4] = await cass.counterYear([2, 'videoStart', today[0].slice(0, 4)]);
      yearPromises[5] = await cass.counterYear([2, 'videoComplete', today[0].slice(0, 4)]);
      await Promise.all(yearPromises);

      var response = await chai.request(server).get('/analysis/year');
      console.log(response.body);
      // there should be a 200 status code
      response.status.should.equal(200);
      // the response should be JSON
      response.type.should.equal('application/json');
      // body should have the proper keys
      response.body.should.include.keys('result');
      // body.date should have a length of 6
      response.body.result.length.should.eql(6);
    })
  })

  describe('GET /analysis/year/:year', () => {
    it('should get the analysis for a given year', async () => {
      //// UPDATE SAMPLE YEAR'S COUNTERS ////
      var yearPromises = [];
      yearPromises[0] = await cass.counterYear([1, 'search', sample[2]]);
      yearPromises[1] = await cass.counterYear([1, 'videoStart', sample[2]]);
      yearPromises[2] = await cass.counterYear([1, 'videoComplete', sample[2]]);
      yearPromises[3] = await cass.counterYear([2, 'search', sample[2]]);
      yearPromises[4] = await cass.counterYear([2, 'videoStart', sample[2]]);
      yearPromises[5] = await cass.counterYear([2, 'videoComplete', sample[2]]);
      await Promise.all(yearPromises);

      var response = await chai.request(server).get(`/analysis/year/${sample[2]}`);
      console.log(response.body);
      // there should be a 200 status code
      response.status.should.equal(200);
      // the response should be JSON
      response.type.should.equal('application/json');
      // body should have the proper keys
      response.body.should.include.keys('result');
      // body.date should have a length of 6
      response.body.result.length.should.eql(6);
    })
  })
});