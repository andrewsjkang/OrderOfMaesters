const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'maesters' });

const insertLog = (params) => {
  const query = 'INSERT INTO logs (bucketId, event, day, time, videoId, userId, searchId) \
                 VALUES (?, ?, ?, ?, ?, ?, ?)';
  return client.execute(query, params, { prepare: true })
    .then(result => result)
    .throw(error);
};

const testSelect = () => {
  console.time('⚡ query speed ⚡');
  const query = `SELECT * FROM logs \
                   WHERE bucketId=1 \
                     AND event='start' \
                     AND day='2017-5-19' \
                     AND time>'23:55:00'`;
  
  return client.execute(query, { prepare: true })
            .then(result => {
              console.timeEnd('⚡ query speed ⚡');
              return result;
            });
}

module.exports = {
  insertLog,
  testSelect
}

// const query = 'SELECT name, email FROM users WHERE key = ?';
// client.execute(query, [ 'someone' ])
//   .then(result => console.log('User with email %s', result.rows[0].email));