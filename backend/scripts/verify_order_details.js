const db = require('../src/db/orders');
const personalDb = require('../src/db/personal_database');

(async () => {
  try {
    await personalDb.waitForInit();
    
    // Get an order ID
    const rawOrder = await personalDb.get('SELECT id FROM orders LIMIT 1');
    if (!rawOrder) {
        console.log('No orders found');
        process.exit(0);
    }
    const orderId = rawOrder.id;
    console.log('Testing with Order ID:', orderId);

    const details = await db.dbGetOrderDetails(orderId);
    console.log('--- Order Details ---');
    console.log('trainNumber:', details.trainNumber);
    console.log('travelDate:', details.travelDate);
    console.log('date:', details.date);
    console.log('trainInfo.date:', details.trainInfo?.date);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
