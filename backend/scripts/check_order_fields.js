const db = require('../src/db/orders');
const personalDb = require('../src/db/personal_database');

(async () => {
  try {
    await personalDb.waitForInit();
    
    // 1. Simulate dbGetOrdersByUser
    // We need a user ID first. Let's find Kinvae.
    const user = await personalDb.get('SELECT id FROM users WHERE username = ?', ['Kinvae']);
    if (!user) {
        console.log('User Kinvae not found');
        process.exit(0);
    }
    console.log('User ID:', user.id);

    const orders = await db.dbGetOrdersByUser(user.id);
    console.log(`Found ${orders.length} orders for user.`);
    
    if (orders.length > 0) {
        const o = orders[0];
        console.log('--- Top Order Fields ---');
        console.log('id:', o.id);
        console.log('trainNumber:', o.trainNumber);
        console.log('travelDate:', o.travelDate);
        console.log('date:', o.date);
        console.log('departureTime:', o.departureTime);
        console.log('trainInfo (keys):', o.trainInfo ? Object.keys(o.trainInfo) : 'null');
    }

    // 2. Simulate dbGetOrderDetails if we have an order
    if (orders.length > 0) {
        const orderId = orders[0].id;
        console.log(`\nFetching details for order ${orderId}...`);
        const details = await db.dbGetOrderDetails(orderId);
        console.log('--- Order Details Fields ---');
        console.log('trainNumber:', details.trainNumber);
        console.log('travelDate:', details.travelDate);
        console.log('date:', details.date);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
