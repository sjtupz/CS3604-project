const express = require('express');
const router = express.Router();
const { CITY_MAP } = require('../services/generator');

function toPinyin(name) {
  const dict = {
    北京: 'beijing', 北京南: 'beijingnan', 北京西: 'beijingxi', 北京丰台: 'beijingfengtai',
    上海: 'shanghai', 上海南: 'shanghainan', 上海虹桥: 'shanghaihongqiao', 上海松江: 'shanghaisongjiang',
    广州: 'guangzhou', 广州南: 'guangzhounan', 广州东: 'guangzhoudong',
    深圳: 'shenzhen', 深圳北: 'shenzhenbei', 罗湖: 'luohu',
    杭州: 'hangzhou', 杭州东: 'hangzhoudong', 杭州南: 'hangzhounan',
    南京: 'nanjing', 南京南: 'nanjingnan',
    苏州: 'suzhou', 苏州北: 'suzhoubei',
    济南: 'jinan', 济南东: 'jinandong', 济南西: 'jinanxi',
    福州: 'fuzhou', 福州南: 'fuzhounan',
    厦门: 'xiamen', 厦门北: 'xiamenbei',
    武汉: 'wuhan', 汉口: 'hankou', 武昌: 'wuchang',
    长沙: 'changsha', 长沙南: 'changshanan',
    郑州: 'zhengzhou', 郑州东: 'zhengzhoudong',
    成都: 'chengdu', 成都东: 'chengdudong', 成都南: 'chengdunan',
    重庆: 'chongqing', 重庆北: 'chongqingbei', 重庆西: 'chongqingxi',
    昆明: 'kunming', 昆明南: 'kunmingnan',
    贵阳: 'guiyang', 贵阳北: 'guiyangbei',
    西安: 'xian', 西安北: 'xianbei',
    兰州: 'lanzhou', 兰州西: 'lanzhouxi',
    乌鲁木齐: 'wulumuqi', 乌鲁木齐南: 'wulumuqinan',
    沈阳: 'shenyang', 沈阳北: 'shenyangbei',
    哈尔滨: 'haerbin', 哈尔滨西: 'haerbinxi',
    长春: 'changchun', 长春西: 'changchunxi',
    天津: 'tianjin', 天津西: 'tianjinxi',
    石家庄: 'shijiazhuang', 石家庄北: 'shijiazhuangbei',
    太原: 'taiyuan', 太原南: 'taiyuannan',
    合肥: 'hefei', 合肥南: 'hefeinan',
    宁波: 'ningbo', 宁波东: 'ningbodong',
    南宁: 'nanning', 南宁东: 'nanningdong',
    海口: 'haikou',
    青岛: 'qingdao', 青岛北: 'qingdaobei',
    大连: 'dalian', 大连北: 'dalianbei',
    佛山: 'foshan', 佛山西: 'foshanxi',
  };
  return dict[name] || '';
}

function codeFor(pinyin) {
  if (!pinyin) return '';
  return pinyin.slice(0, 3).toUpperCase();
}

function buildStations() {
  const out = [];
  Object.entries(CITY_MAP).forEach(([city, info]) => {
    info.stations.forEach((name) => {
      const pinyin = toPinyin(name);
      out.push({ name, code: codeFor(pinyin), pinyin });
    });
  });
  return out;
}

// GET /api/stations
router.get('/stations', async (req, res) => {
  try {
    if (req.query.causeError === 'true') {
      throw new Error('forced error');
    }
    const search = String(req.query.search || '').trim().toLowerCase();
    const all = buildStations();
    const filtered = search
      ? all.filter((s) =>
          s.name.toLowerCase().includes(search) || s.pinyin.toLowerCase().includes(search)
        )
      : all;
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/stations/cities
router.get('/stations/cities', (req, res) => {
  try {
    const data = [
      {
        province: '全国',
        cities: Object.entries(CITY_MAP).map(([city, info]) => ({
          city,
          stations: info.stations.map((name) => ({ name })),
        })),
      },
    ];
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/stations/groups
router.get('/stations/groups', (req, res) => {
  try {
    const all = buildStations();
    const byLetter = {};
    all.forEach((s) => {
      const letter = (s.pinyin[0] || s.name[0] || '#').toUpperCase();
      if (!byLetter[letter]) byLetter[letter] = [];
      byLetter[letter].push(s);
    });
    const hot = all.filter((s) => ['北京', '上海', '广州', '深圳'].includes(s.name)).slice(0, 10);
    res.status(200).json({ code: 200, data: { hot, byLetter } });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal Server Error' });
  }
});

module.exports = router;
