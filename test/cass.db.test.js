const chai = require('chai');
const should = chai.should();

const cass = require('../server/cassandra/index');

const sample = {
  bucketId: 1,
  event: 'search',
  timestamp: '2017-03-07T21:17:05Z',
  videoId: 853837,
  userId: 4267896,
  searchId: 1052615
}

describe('cassandra : queries', () => {
  before(async () => {
    await cass.client.execute('USE maesters_test');
    // var promises = [];
    // promises[0] = cass.client.execute('TRUNCATE logs');
    // promises[1] = cass.client.execute('TRUNCATE count_days');
    // promises[2] = cass.client.execute('TRUNCATE count_months');
    // promises[3] = cass.client.execute('TRUNCATE count_years');
    // [log, day, month, year] = await Promise.all(promises);
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

  describe('Cassandra insertLog', () => {
    it('should insert event', async () => {
      const params = [
        1,
        'search',
        '2017-03-07',
        '21:17:05',
        853837,
        4267896,
        1052615
      ];
      const insertResult = await cass.insertLog(params);
      const select = await cass.client.execute('SELECT * FROM logs');
      
      // database should have 1 result
      select.rows.length.should.eql(1);
      // inserted data should have the correct keys
      select.rows[0].should.include.keys(
        'bucketid', 'event', 'day', 'time', 'searchid', 'userid', 'videoid'
      );
    });
  });

  describe('Cassandra day counter', () => {
    it('should update date counter', async () => {
      const params = [
        1,
        'search',
        '2017-03-07'
      ];

      const dateResult = await cass.counterDate(params);
      const select = await cass.client.execute('SELECT * FROM count_days');
      const counter_val = select.rows[0].counter_value.toString();

      // database should have 1 result
      select.rows.length.should.eql(1);
      // inserted data should have the correct keys
      select.rows[0].should.include.keys(
        'bucketid', 'event', 'day', 'counter_value'
      );
      // counter should equal 1
      counter_val.should.eql('1');
    });
  });

  describe('Cassandra month counter', () => {
    it('should update date counter', async () => {
      const params = [
        1,
        'search',
        '2017-03'
      ];

      const dateResult = await cass.counterMonth(params);
      const select = await cass.client.execute('SELECT * FROM count_months');
      const counter_val = select.rows[0].counter_value.toString();

      // database should have 1 result
      select.rows.length.should.eql(1);
      // inserted data should have the correct keys
      select.rows[0].should.include.keys(
        'bucketid', 'event', 'month', 'counter_value'
      );
      // counter should equal 1
      counter_val.should.eql('1');
    });
  });

  describe('Cassandra year counter', () => {
    it('should update date counter', async () => {
      const params = [
        1,
        'search',
        '2017'
      ];

      const dateResult = await cass.counterYear(params);
      const select = await cass.client.execute('SELECT * FROM count_years');
      const counter_val = select.rows[0].counter_value.toString();

      // database should have 1 result
      select.rows.length.should.eql(1);
      // inserted data should have the correct keys
      select.rows[0].should.include.keys(
        'bucketid', 'event', 'year', 'counter_value'
      );
      // counter should equal 1
      counter_val.should.eql('1');
    });
  });
});