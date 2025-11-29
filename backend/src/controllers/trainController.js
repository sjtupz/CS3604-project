const { findTrains } = require('../db/operations');

const getTrains = async (req, res) => {
  const { from, to, date, isHighSpeed } = req.query;
  try {
    const trains = await findTrains(from, to, date, isHighSpeed === 'true');
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrains };