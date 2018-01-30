const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'maesters' });

const insertLog = (params) => {
  const query = 'INSERT INTO logs (type, event, day, time, video_id, user_id, search_id) \
                 VALUES (?, ?, ?, ?, ?, ?, ?)';
  return client.execute(query, params, { prepare: true })
    .then(result => result );
};

module.exports = {
  insertLog
}

// const query = 'SELECT name, email FROM users WHERE key = ?';
// client.execute(query, [ 'someone' ])
//   .then(result => console.log('User with email %s', result.rows[0].email));