const { run } = require('./personal_database');

async function createIndexesForTrains() {
  await run("CREATE INDEX IF NOT EXISTS idx_rf_trains_type ON rf_trains(train_type)");
  await run("CREATE INDEX IF NOT EXISTS idx_rf_inventories_date ON rf_inventories(travel_date)");
  await run("CREATE INDEX IF NOT EXISTS idx_rf_inventories_train ON rf_inventories(train_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_rf_timetables_train ON rf_timetables(train_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_rf_timetables_departure_time ON rf_timetables(departure_time)");
  await run("CREATE INDEX IF NOT EXISTS idx_rf_timetables_arrival_time ON rf_timetables(arrival_time)");
  await run("CREATE INDEX IF NOT EXISTS idx_rf_trains_duration_minutes ON rf_trains(duration_minutes)");
  await run("CREATE INDEX IF NOT EXISTS idx_rf_fares_base_price ON rf_fares(base_price)");
}

module.exports = { createIndexesForTrains };
