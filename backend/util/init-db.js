const db = require('./raw_db');
const process = require('process');


db.rawConnect();
db.initDB();
db.rawDisconnet();

process.on('exit', (code) => {
    console.log(`Program has exited with code: ${code}`)
});