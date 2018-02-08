require('dotenv').config();
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: process.env.KEYSPACE });

const insertLog = (params) => {
  // console.time('⚡ insert query speed ⚡');
  const query = 'INSERT INTO logs (bucketId, event, day, time, videoId, userId, searchId) \
                 VALUES (?, ?, ?, ?, ?, ?, ?)';
  return client.execute(query, params, { prepare: true })
    .then(result => {
      // console.timeEnd('⚡ insert query speed ⚡');
      return result
    });
};

// const testSelect = (params) => {
//   // console.time('⚡ query speed ⚡');
//   const query = `SELECT COUNT(*) FROM logs`;
  
//   return client.execute(query, params, { prepare: true })
//             .then(result => {
//               // console.timeEnd('⚡ query speed ⚡');
//               console.log(result.rows.length);
//               return result.rows;
//             });
// }

const counterDate = (params) => {
  // console.time('⚡ update date speed ⚡'); 
  const query = `UPDATE count_days \
                  SET counter_value = counter_value + 1 \
                  WHERE bucketId = ? \
                  AND event = ? \
                  AND day = ?`;
  return client.execute(query, params, { prepare: true })
    .then(result => {
      // console.timeEnd('⚡ update date speed ⚡'); 
      return result;
    });
};

const counterMonth = (params) => {
  // console.time('⚡ update month speed ⚡'); 
  const query = `UPDATE count_months \
                  SET counter_value = counter_value + 1 \
                  WHERE bucketId = ? \
                  AND event = ? \
                  AND month = ?`;
  return client.execute(query, params, { prepare: true })
    .then(result => {
      // console.timeEnd('⚡ update month speed ⚡'); 
      return result;
    });
};

const counterYear = (params) => {
  // console.time('⚡ update year speed ⚡'); 
  const query = `UPDATE count_years \
                  SET counter_value = counter_value + 1 \
                  WHERE bucketId = ? \
                  AND event = ? \
                  AND year = ?`;
  return client.execute(query, params, { prepare: true })
    .then(result => {
      // console.timeEnd('⚡ update year speed ⚡'); 
      return result;
    });
};

const dayStats = (params) => {
  console.time('⚡ dayStats speed ⚡');
  const query = `SELECT * FROM count_days \
                 WHERE day = ?`;
  
  return client.execute(query, params, { prepare: true })
    .then(result => {
      console.timeEnd('⚡ dayStats speed ⚡');
      return result;
    });
};

const monthStats = (params) => {
  console.time('⚡ monthStats speed ⚡');
  const query = `SELECT * FROM count_months \
                 WHERE month = ?`;
  
  return client.execute(query, params, { prepare: true })
    .then(result => {
      console.timeEnd('⚡ monthStats speed ⚡');
      return result;
    });
};

const yearStats = (params) => {
  console.time('⚡ yearStats speed ⚡');
  const query = `SELECT * FROM count_years \
                 WHERE year = ?`;
  
  return client.execute(query, params, { prepare: true })
    .then(result => {
      console.timeEnd('⚡ yearStats speed ⚡');
      return result;
    });
};

module.exports = {
  client,
  insertLog,
  counterDate,
  counterMonth,
  counterYear,
  dayStats,
  monthStats,
  yearStats
}

// const query = 'SELECT name, email FROM users WHERE key = ?';
// client.execute(query, [ 'someone' ])
//   .then(result => console.log('User with email %s', result.rows[0].email));