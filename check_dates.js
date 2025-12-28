const fs = require('fs');
const data = require('./frontend/src/mocks/train_list_mock.json');
console.log('Total records:', data.length);
const dates = data.map(i => i.date);
const counts = {};
dates.forEach(d => counts[d] = (counts[d] || 0) + 1);
console.log(counts);
