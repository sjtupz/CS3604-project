const { findAllStations } = require('../db/operations');

const getAllStations = async (req, res) => {
  try {
    const stations = await findAllStations();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStations };