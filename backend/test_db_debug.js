const { findAllStations } = require('./src/db/operations');

(async () => {
  try {
    console.log('Calling findAllStations...');
    const stations = await findAllStations();
    console.log('Stations found:', stations.length);
    console.log('First station:', stations[0]);
  } catch (err) {
    console.error('Error:', err);
  }
})();
