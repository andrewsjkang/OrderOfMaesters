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
  videoId bigint,
  userId bigint,
  searchId bigint,
  PRIMARY KEY ((bucketId, event, day), time)
) WITH CLUSTERING ORDER BY (time DESC);

CREATE TABLE IF NOT EXISTS count_days (
  bucketId int,
  event text,
  day date,
  counter_value counter,
  PRIMARY KEY (day, bucketId, event)
) WITH CLUSTERING ORDER BY (bucketId ASC);

CREATE TABLE IF NOT EXISTS count_months (
  bucketId int,
  event text,
  month text,
  counter_value counter,
  PRIMARY KEY (month, bucketId, event)
) WITH CLUSTERING ORDER BY (bucketId ASC);

CREATE TABLE IF NOT EXISTS count_years (
  bucketId int,
  event text,
  year text,
  counter_value counter,
  PRIMARY KEY (year, bucketId, event)
) WITH CLUSTERING ORDER BY (bucketId ASC);