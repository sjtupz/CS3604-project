const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://www.12306.cn/index/images/logo.jpg';
const dest = path.join(__dirname, 'frontend/src/assets/logo_12306.jpg');

const file = fs.createWriteStream(dest);
https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close(() => {
      console.log('Download completed.');
    });
  });
}).on('error', function(err) {
  fs.unlink(dest);
  console.error('Error downloading file:', err.message);
});
