const express = require('express');
const router = express.Router();
const { query } = require('../db/personal_database');

// GET /api/stations
router.get('/', async (req, res) => {
  try {
    const { search, causeError } = req.query;
    if (causeError === 'true') {
      throw new Error('Simulated Error');
    }
    const q = String(search || '').trim().toLowerCase();
    let rows = await query("SELECT * FROM stations");
    if (q) {
      rows = rows.filter((s) => {
        const name = String(s.name || '').toLowerCase();
        const code = String(s.code || '').toLowerCase();
        const city = String(s.city || '').toLowerCase();
        const pinyin = String(s.pinyin || '').toLowerCase();
        const pabbr = String(s.pinyin_abbr || '').toLowerCase();
        const cpinyin = String(s.city_pinyin || '').toLowerCase();
        const cpabbr = String(s.city_pinyin_abbr || '').toLowerCase();
        const aliases = String(s.aliases || '').toLowerCase();
        return name.includes(q) || code.includes(q) || city.includes(q) || pinyin.includes(q) || pabbr.includes(q) || cpinyin.includes(q) || cpabbr.includes(q) || aliases.includes(q);
      });
    }
    const shaped = rows.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code || '',
      city: s.city || '',
      city_pinyin: s.city_pinyin || '',
      province: s.province || '',
      district: s.district || '',
      type: s.type || 'rail',
      is_hot: !!s.is_hot,
      is_hub: !!s.is_hub,
      status: s.status || 'active'
    }));
    return res.json(shaped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 城市-车站分级数据：/api/stations/cities
router.get('/cities', async (req, res) => {
  try {
    const rows = await query("SELECT * FROM stations");
    const provinces = {};
    rows.forEach((s) => {
      const prov = s.province || '未知省份';
      const city = s.city || '未知城市';
      if (!provinces[prov]) provinces[prov] = {};
      if (!provinces[prov][city]) {
        provinces[prov][city] = {
          pinyin: s.city_pinyin || '',
          stations: [],
        };
      }
      provinces[prov][city].stations.push({
        name: s.name,
        code: s.code || '',
        type: s.type || 'rail',
        district: s.district || '',
        isHot: !!s.is_hot,
        isHub: !!s.is_hub,
        status: s.status || 'active',
      });
    });
    const idIndex = new Map(rows.map((r) => [r.id, r]));
    const data = Object.keys(provinces).map((prov) => ({
      province: prov,
      cities: Object.keys(provinces[prov]).map((city) => {
        const list = provinces[prov][city].stations;
        const hasRail = list.some((st) => st.type === 'highspeed' || st.type === 'normal' || st.type === 'rail');
        let nearest = null;
        if (!hasRail) {
          const anyRaw = rows.find((r) => (r.city || '') === city && (r.province || '') === prov);
          if (anyRaw && anyRaw.closest_station_id && idIndex.get(anyRaw.closest_station_id)) {
            const ref = idIndex.get(anyRaw.closest_station_id);
            nearest = { name: ref.name, code: ref.code || '' };
          }
        }
        return {
          city,
          pinyin: provinces[prov][city].pinyin,
          hasRail,
          nearestStation: nearest ? { name: nearest.name, code: nearest.code } : null,
          stations: list,
        };
      }),
    }));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
