const { getDb } = require('../src/db/personal_database');

const db = getDb();

const stationsToCheck = ['北京丰台', '上海松江'];

db.all(`SELECT * FROM stations WHERE name IN (?, ?)`, stationsToCheck, (err, rows) => {
  if (err) {
    console.error('Error querying stations:', err);
    process.exit(1);
  }
  console.log('Found stations:', rows);
  
  // Also check distinct cities to see normalization
  db.all(`SELECT DISTINCT city FROM stations WHERE city LIKE '%北京%' OR city LIKE '%上海%'`, (err, cities) => {
      if(err) console.error(err);
      console.log('Cities found:', cities);
  });
});
