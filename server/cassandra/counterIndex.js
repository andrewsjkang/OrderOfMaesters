const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'clickers' });

const updateCounter = (params) => {
  console.time('⚡ click speed ⚡'); 
  const query = `UPDATE aggregates \
                  SET counter_value = counter_value + 1 \
                  WHERE bucketId = ? \
                  AND event = ? \
                  AND day = ?`;
  return client.execute(query, params, { prepare: true })
    .then(result => {
      console.timeEnd('⚡ click speed ⚡'); 
      return result;
    });
};

module.exports = {
  updateCounter
}