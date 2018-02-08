const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server/index');
const cass = require('../server/cassandra/index');

describe('routes : maesters', () => {
  before(async () => {
    await cass.client.execute('USE maesters_test');
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

  describe('POST /maesters', () => {
    it('should accept posts', async () => {
      chai.request(server)
        .post('/maesters')
        .send({
          bucketId: 1,
          event: 'search',
          timestamp: '2017-03-07T21:17:05Z',
          videoId: 853837,
          userId: 4267896,
          searchId: 1052615
        })
        .end(async (err, res) => {
          // there should be no errors
          should.not.exist(err);
          // there should be a 200 status code
          res.status.should.equal(201);
          // the response should be JSON
          res.type.should.equal('application/json');
        });
    });
  });
});