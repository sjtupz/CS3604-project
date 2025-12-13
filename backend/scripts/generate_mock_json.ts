
import sqlite3 from 'sqlite3';
import { fakerZH_CN as faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';

// Database configuration
const dbPath = path.resolve(__dirname, '../data/12306.db');
const db = new sqlite3.Database(dbPath);

const all = (sql: string, params: any[] = []) => {
  return new Promise<any[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const TRAIN_DISTRIBUTION = {
  'G': 0.30,
  'D': 0.25,
  'Z': 0.15,
  'T': 0.15,
  'K': 0.15
};

const TOTAL_RECORDS = 500;

// Helper to generate seat status
function getSeatStatus(seatType: string, trainType: string) {
  // Logic: 
  // swz/yd/ed only for G/D (mostly). 
  // rw/yw/yz only for Z/T/K (mostly).
  // actually G/D can have swz, yd, ed.
  // Z/T/K have rw, yw, yz, wz.
  // D can have rw (soft sleeper) sometimes, but for simplicity let's follow standard rules.
  
  const isHighSpeed = ['G', 'D', 'C'].includes(trainType);
  
  // Define applicable seats
  const applicable = {
    'swz': ['G', 'D'].includes(trainType), // Business
    'yd': ['G', 'D'].includes(trainType),  // First Class
    'ed': ['G', 'D', 'C'].includes(trainType), // Second Class
    'gjrw': ['Z', 'T', 'K'].includes(trainType), // Senior Soft Sleep
    'rw': ['Z', 'T', 'K'].includes(trainType), // Soft Sleep
    'yw': ['Z', 'T', 'K'].includes(trainType), // Hard Sleep
    'yz': ['Z', 'T', 'K'].includes(trainType), // Hard Seat
    'wz': true // Standing
  };

  if (!applicable[seatType as keyof typeof applicable]) {
    return '--';
  }

  const rand = Math.random();
  if (rand < 0.30) {
    // Numeric 1-20
    return faker.number.int({ min: 1, max: 20 }).toString();
  } else if (rand < 0.70) {
    // "有" (40%) -> 0.3 + 0.4 = 0.7
    return '有';
  } else if (rand < 0.90) {
    // "无" (20%) -> 0.7 + 0.2 = 0.9
    return '无';
  } else {
    // "候补" (10%)
    return '候补';
  }
}

async function generate() {
  console.log('Fetching stations...');
  const stations = await all('SELECT * FROM stations');
  
  if (stations.length < 2) {
    console.error('Not enough stations in DB. Run seed first.');
    process.exit(1);
  }

  const mockData: any[] = [];
  const generatedTrainNumbers = new Set<string>();

  console.log('Generating mock data...');

  // Ensure uniform coverage: Cycle through stations for "from"
  let stationIdx = 0;

  for (const [type, ratio] of Object.entries(TRAIN_DISTRIBUTION)) {
    const count = Math.round(TOTAL_RECORDS * ratio);
    console.log(`Generating ${count} records for type ${type}...`);

    for (let i = 0; i < count; i++) {
      // 1. Train Number
      let trainNo = '';
      do {
        trainNo = `${type}${faker.number.int({ min: 1, max: 9999 })}`;
      } while (generatedTrainNumbers.has(trainNo));
      generatedTrainNumbers.add(trainNo);

      // 2. Stations (Round robin for 'from' to ensure coverage)
      const fromStation = stations[stationIdx % stations.length];
      stationIdx++;
      
      let toStation = faker.helpers.arrayElement(stations);
      while (toStation.id === fromStation.id) {
        toStation = faker.helpers.arrayElement(stations);
      }

      // 3. Times
      const departHour = faker.number.int({ min: 6, max: 22 });
      const departMin = faker.number.int({ min: 0, max: 59 });
      const durationMins = faker.number.int({ min: 60, max: 1200 }); // 1h to 20h

      const departureTime = `${departHour.toString().padStart(2, '0')}:${departMin.toString().padStart(2, '0')}`;
      
      // Calculate arrival
      const depDate = new Date();
      // Random date within next 30 days
      const daysToAdd = faker.number.int({ min: 0, max: 29 });
      depDate.setDate(depDate.getDate() + daysToAdd);
      
      depDate.setHours(departHour, departMin, 0, 0);
      const arrDate = new Date(depDate.getTime() + durationMins * 60000);
      
      const arrivalTime = `${arrDate.getHours().toString().padStart(2, '0')}:${arrDate.getMinutes().toString().padStart(2, '0')}`;
      
      const durationStr = `${Math.floor(durationMins / 60).toString().padStart(2, '0')}:${(durationMins % 60).toString().padStart(2, '0')}`;

      // 4. Seats
      const record = {
        train_no: trainNo,
        train_type: type,
        from_station: fromStation.name,
        to_station: toStation.name,
        start_time: departureTime,
        end_time: arrivalTime,
        duration: durationStr,
        swz_num: getSeatStatus('swz', type),
        yd_num: getSeatStatus('yd', type),
        ed_num: getSeatStatus('ed', type),
        gjrw_num: getSeatStatus('gjrw', type),
        rw_num: getSeatStatus('rw', type),
        yw_num: getSeatStatus('yw', type),
        yz_num: getSeatStatus('yz', type),
        wz_num: getSeatStatus('wz', type),
        date: depDate.toISOString().split('T')[0]
      };

      mockData.push(record);
    }
  }

  // Shuffle array
  const shuffled = mockData.sort(() => 0.5 - Math.random());

  // Ensure output dir
  // Output to frontend src mocks directly
  const outDir = path.resolve(__dirname, '../../frontend/src/mocks');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, 'train_list_mock.json');
  fs.writeFileSync(outFile, JSON.stringify(shuffled, null, 2), 'utf-8');

  console.log(`Successfully generated ${shuffled.length} mock records at ${outFile}`);
  
  // Verify distributions
  const stats: any = {};
  shuffled.forEach(r => {
    stats[r.train_type] = (stats[r.train_type] || 0) + 1;
  });
  console.log('Distribution:', stats);
}

generate().catch(console.error);
