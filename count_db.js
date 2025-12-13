
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'backend/data/12306.db'));

db.serialize(() => {
    // Infrastructure
    db.get('SELECT COUNT(*) as count FROM rf_stations', (err, row) => {
        console.log(`Stations: ${row.count}`);
    });
    db.get('SELECT COUNT(*) as count FROM rf_trains', (err, row) => {
        console.log(`Trains: ${row.count}`);
    });
    db.get('SELECT COUNT(*) as count FROM rf_trains WHERE train_type="G"', (err, row) => {
        console.log(`G Trains: ${row.count}`);
    });
    db.get('SELECT COUNT(*) as count FROM rf_trains WHERE train_type="D"', (err, row) => {
        console.log(`D Trains: ${row.count}`);
    });
    
    // Identity
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        console.log(`Users: ${row.count}`);
    });
    db.get('SELECT COUNT(*) as count FROM users WHERE role="admin"', (err, row) => {
        console.log(`Admin Users: ${row.count}`);
    });
    db.get('SELECT COUNT(*) as count FROM users WHERE phone_number="13800138000"', (err, row) => {
        console.log(`Duplicate Phone Users: ${row.count}`);
    });

    // Passengers
    db.get('SELECT COUNT(*) as count FROM passengers', (err, row) => {
        console.log(`Passengers: ${row.count}`);
    });

    // Orders & Transactions
    db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
        console.log(`Orders: ${row.count}`);
    });
    db.get('SELECT status, COUNT(*) as count FROM orders GROUP BY status', (err, rows) => {
        // sqlite3 .get returns only one row. Use .all for GROUP BY
    });
    db.all('SELECT status, COUNT(*) as count FROM orders GROUP BY status', (err, rows) => {
        console.log('Order Statuses:');
        rows.forEach(r => console.log(`  ${r.status}: ${r.count}`));
    });

    // Inventory check
    db.get('SELECT COUNT(*) as count FROM rf_inventories WHERE second_remaining = 0', (err, row) => {
        console.log(`Sold Out Records (Second Class): ${row.count}`);
    });
});

db.close();
