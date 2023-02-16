const db = require('./db');

db.connect();
db.destroyDB();
db.disconnect();

process.on('exit', (code) => {
    console.log(`Program has exited with code: ${code}`)
});