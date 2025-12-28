const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { run } = require('./db/personal_database');
const syncStations = async () => {
  try {
    await run("UPDATE stations SET is_hot = is_hot");
  } catch {
  }
};
// Use a daily interval to avoid 32-bit signed integer overflow (max ~24.8 days)
// Real production apps should use cron jobs
const ONE_DAY = 24 * 60 * 60 * 1000;
setInterval(syncStations, ONE_DAY);
