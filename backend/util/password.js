const crypto = require('crypto');

exports.generatePassword = async (password) => {

    if (!password) { throw new Error("attribute password missing"); };
    if (typeof password != "string") { throw new TypeError("password must be a string"); };

    const salt = crypto.randomBytes(256).toString('hex');

    return new Promise((resolve, rejects) => {
        crypto.scrypt(password, salt, 256, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve({
                salt: salt,
                hash: derivedKey.toString('hex')
            });
        });
    });
};

exports.validatePassword = (password, salt, hash) => {
    const regexCharMap = /[0-9a-fA-F]+/;

    if (!password) { throw new Error("attribute password missing"); };
    if (typeof password != "string") { throw new TypeError("password must be a string"); };

    if (!salt) { throw new Error("attribute salt missing"); };
    if (typeof salt != "string") { throw new TypeError("salt must be a string"); };
    if (salt.length != 512) { throw new RangeError("salt must be 512 characters long") };
    if (salt.match(regexCharMap)[0] != salt) { throw new TypeError("salt must be a hexadecimal string"); };

    if (!hash) { throw new Error("attribute hash missing"); };
    if (typeof hash != "string") { throw new TypeError("hash must be a string"); };
    if (hash.length != 512) { throw new RangeError("hash must be 512 characters long") };
    if (hash.match(regexCharMap)[0] != hash) { throw new TypeError("hash must be a hexadecimal string"); };

    return new Promise((resolve, rejects) => {
        crypto.scrypt(password, salt, 256, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve(hash == derivedKey.toString('hex'));
        });
    });
};