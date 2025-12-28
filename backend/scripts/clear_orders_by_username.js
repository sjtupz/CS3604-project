const db = require('../src/db/personal_database');

(async () => {
  const username = process.argv[2] || 'Kinvae';
  try {
    await db.waitForInit();
    const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (!user) {
      console.log(`User ${username} not found. Nothing to delete.`);
      process.exit(0);
    }
    const before = await db.get('SELECT COUNT(1) AS c FROM orders WHERE user_id = ?', [user.id]);
    const res = await db.run('DELETE FROM orders WHERE user_id = ?', [user.id]);
    const after = await db.get('SELECT COUNT(1) AS c FROM orders WHERE user_id = ?', [user.id]);
    console.log(`Deleted changes: ${res.changes}`);
    console.log(`Orders before: ${before?.c ?? 0} after: ${after?.c ?? 0}`);
    process.exit(0);
  } catch (err) {
    console.error('Error clearing orders:', err);
    process.exit(1);
  }
})();

