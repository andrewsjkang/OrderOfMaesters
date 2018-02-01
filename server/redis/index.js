const redis = require('redis');
const client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

const increment = (video_id) => {
  client.incr(`${video_id}`)
}

module.exports = {
  increment
}