const db = require('../src/db/personal_database');

(async () => {
  try {
    await db.waitForInit();
    const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
    console.log('Found orders:', orders.length);
    
    orders.forEach((order, index) => {
      console.log(`\n--- Order ${index + 1} ---`);
      console.log('ID:', order.id);
      console.log('Train Number (Column):', order.train_number);
      console.log('Train Info (Raw):', order.train_info);
      
      try {
        const trainInfo = JSON.parse(order.train_info);
        console.log('Train Info (Parsed):', JSON.stringify(trainInfo, null, 2));
      } catch (e) {
        console.error('Failed to parse train_info JSON:', e.message);
      }
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
