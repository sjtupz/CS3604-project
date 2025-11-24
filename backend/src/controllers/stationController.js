const { findAllStations } = require('../db/operations');

const getAllStations = async (req, res) => {
  console.log('Request received for getAllStations');
  try {
    const stations = await findAllStations();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStations };