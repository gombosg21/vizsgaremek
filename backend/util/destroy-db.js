const db = require('./db');
const fs = require('fs');
const process = require('process');

db.connect();
db.destroyDB();
db.disconnect();

fs.unlink('test_accounts_credentials.json', (err) => {
    if (err) { throw err }
    console.log("test account credentials destoryed");
});

process.on('exit', (code) => {
    console.log(`Program has exited with code: ${code}`)
});