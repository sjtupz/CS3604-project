const express = require('express');
const router = express.Router();
const { findAllStations } = require('../db/operations');

router.get('/api/stations/groups', async (req, res, next) => {
  try {
    const stations = await findAllStations();
    
    // Hardcoded hot stations for now, or derive from logic
    const hotStations = stations.filter(s => ['北京', '上海', '广州', '深圳'].some(city => s.name.includes(city))).slice(0, 10);
    
    const groups = {
      hot: hotStations.map(s => ({ name: s.name, code: s.pinyin })), // Assuming pinyin as code for now
      byLetter: {}
    };

    // Group by first letter of pinyin
    stations.forEach(s => {
      const firstLetter = (s.pinyin || '').charAt(0).toUpperCase();
      if (firstLetter >= 'A' && firstLetter <= 'Z') {
        if (!groups.byLetter[firstLetter]) {
          groups.byLetter[firstLetter] = [];
        }
        groups.byLetter[firstLetter].push({ name: s.name, code: s.pinyin });
      }
    });

    res.status(200).json({ code: 200, data: groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 50000, message: 'Internal Server Error' });
  }
});

module.exports = router;
