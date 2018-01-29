process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server/index');

describe('routes : index', () => {

  describe('GET /', () => {
    it('should return json', (done) => {
      chai.request(server)
        .get('/')
        .end((error, response) => {
          // there should be no errors
          should.not.exist(error);
          // there should be a 200 status code
          response.status.should.equal(200);
          // the response should be JSON
          response.type.should.equal('application/json');
          // the JSON response should be a
          // key-value pair of {"status": "success"}
          response.body.status.should.eql('success');
          // the JSON response should be a
          // key-value pair of {"message": "Hello, world!"}
          response.body.message.should.eql('Hello, world!');
          done();
        });
    });
  });
  // Add additional tests here
});