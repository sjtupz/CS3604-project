const { generateTicketsInDb } = require('../src/services/ticketGenerator');

(async () => {
  try {
    // Generate tickets with configuration
    // Use environment variables or default arguments
    const days = process.env.DAYS ? parseInt(process.env.DAYS) : 15;
    const min = process.env.MIN ? parseInt(process.env.MIN) : 50;
    const max = process.env.MAX ? parseInt(process.env.MAX) : 100;
    const clear = process.env.CLEAR === 'true';

    await generateTicketsInDb({
      days,
      minTrainsPerDay: min,
      maxTrainsPerDay: max,
      clearExisting: clear
    });
    
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to generate tickets:', err);
    process.exit(1);
  }
})();
