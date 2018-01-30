CREATE KEYSPACE IF NOT EXISTS maesters
  WITH REPLICATION = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  };

USE maesters;

CREATE TABLE IF NOT EXISTS logs (
  type text,
  event text,
  day date,
  time time,
  video_id int,
  user_id int,
  search_id int,
  PRIMARY KEY ((type, event, day), time)
) WITH CLUSTERING ORDER BY (time DESC);