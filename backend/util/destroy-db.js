const db = require('./raw_db');
const fs = require('fs');
const process = require('process');

db.rawConnect();
db.destroyDB();
db.rawDisconnet();

fs.unlink('test_accounts_credentials.json', (err) => {
    if (err) { console.log("test account credentials doesnt exsits, proceeding"); } else {
        console.log("test account credentials destoryed");
    };
});

process.on('exit', (code) => {
    console.log(`Program has exited with code: ${code}`)
});