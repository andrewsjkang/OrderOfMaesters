CREATE KEYSPACE IF NOT EXISTS maesters
  WITH REPLICATION = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  };

USE maesters;

CREATE TABLE IF NOT EXISTS logs (
  bucketId int,
  event text,
  day date,
  time time,
  videoId int,
  userId int,
  searchId int,
  PRIMARY KEY ((bucketId, event, day), time)
) WITH CLUSTERING ORDER BY (time DESC);