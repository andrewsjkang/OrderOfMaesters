const faker = require('faker');
const fs = require('fs');
const file = fs.createWriteStream('./dataGen/dataFiles/big10m_05.txt');


//// TXT DATA GENERATOR ////
const generateDataLine = () => {
  // bucketId generator
  const bucketId = Math.ceil(Math.random() * 2);

  // event generator
  const events = ['start', 'videoStart', 'videoComplete'];
  const eIndex = Math.floor(Math.random() * 3);

  // date generator
  // const dates = [/*'2018-01-28',*/ '2018-01-29', '2018-01-30', '2018-01-31'];
  // const dIndex = Math.floor(Math.random() * 3);
  const year = '2017';
  const month = Math.ceil(Math.random() * 3) + 3;
  const day = Math.ceil(Math.random() * 30);
  const date = year + '-' + month + '-' + day;

  // time generator
  const hour = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);

  // id generators
  const videoId = Math.ceil(Math.random() * 10000000);
  const userId = Math.ceil(Math.random() * 10000000);
  const searchId = 5;
  


  return [
    bucketId,
    events[eIndex],
    // dates[dIndex],
    date,
    hour + ':' + minutes + ':' + seconds,
    videoId,
    userId,
    searchId
  ];
}

const writeToFile = (quantity) => {
  for (var i = 0; i < quantity; i++) {
    file.write(generateDataLine() + '\n');
  }
}

writeToFile(2000000);