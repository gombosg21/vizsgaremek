const db = require('./db');
const process = require('process');


db.connect();
db.initDB();
db.disconnect();

process.on('exit', (code) => {
    console.log(`Program has exited with code: ${code}`)
});