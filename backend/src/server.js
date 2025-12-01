const app = require('./app');

function listenWithFallback(startPort, maxAttempts = 20) {
  let port = Number(startPort) || 3000;
  let attempts = 0;

  function tryListen(p) {
    const server = app.listen(p, () => {
      process.stdout.write(`Server is running on port ${p}\n`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && attempts < maxAttempts) {
        attempts += 1;
        tryListen(p + 1);
      } else {
        process.stderr.write(`Failed to start server: ${err.message}\n`);
        process.exit(1);
      }
    });
  }

  tryListen(port);
}

listenWithFallback(process.env.PORT || 3000);
