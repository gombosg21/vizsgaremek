const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const fs = require('fs/promises');

/**
 * 
 * @param {String} password - the password to hash
 * @returns {Object Promise Base64Encoded} returns a two part base64 string, separated by a single ':', first part is the salt, second is the hash
 */

exports.generatePassword = async (password) => {

    if (!password) { throw new Error("attribute password missing"); };
    if (typeof password != "string") { throw new TypeError("password must be a string"); };

    const salt = crypto.randomBytes(256).toString('hex');

    return new Promise((resolve, rejects) => {
        crypto.scrypt(password, salt, 256, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve(
                salt + ":" + derivedKey.toString('hex')
            );
        });
    });
};


/**
 * 
 * @param {String} password - the password to validate
 * @param {String Base64Encoded} encryptedPassword - the passwords salt:hash combination to validate against
 * @returns {Object Promise Boolean} true if validation is successfull, else false. may also return an error if something goes horribly wrong
 */

exports.validatePassword = (password, encryptedPassword) => {
    const regexCharMap = /[A-Za-z0-9]+:[A-Za-z0-9]+/;

    if (!password) { throw new Error("attribute password missing"); };
    if (typeof password != "string") { throw new TypeError("password must be a string"); };

    if (!encryptedPassword) { throw new Error("attribute encryptedPassword missing"); };
    if (typeof encryptedPassword != "string") { throw new TypeError("encryptedPassword must be a string"); };
    if (encryptedPassword.length != 1025) { throw new RangeError("salt must be 1025 characters long") };
    if (encryptedPassword.match(regexCharMap)[0] != encryptedPassword) { throw new TypeError("encryptedPassword must be a hexadecimal string"); };


    return new Promise((resolve, rejects) => {
        const salt = encryptedPassword.split(":")[0];
        const hash = encryptedPassword.split(":")[1];
        crypto.scrypt(password, salt, 256, (error, derivedKey) => {
            if (error) {
                rejects(error);
            };
            resolve(hash == derivedKey.toString('hex'));
        });
    });
};

/**
 * 
 * @returns {Object Promise String Base64UrlEncoded} a unique token. 
 */

exports.generateToken = () => {

    return new Promise((rejects, resolve) => {
        crypto.randomBytes(4096, (err, buff) => {
            if (err) {
                rejects(err);
            };
            resolve(buff.toString('base64url'))
        });
    });
};


exports.readPublicJWT = async () => {
    try {

        const key = await fs.readFile("../keys/id_rsa_public.pem", "utf-8");

        return key;
    } catch (error) {
        console.log(error)
    };
};

exports.readPriavteJWT = async () => {
    try {

        const key = await fs.readFile("../keys/id_rsa_private.pem", "utf-8");
        return key;
    } catch (error) {
        console.log(error)
    };
};

/**
 *  
 * @property {Number}  user_ID - The ID of a valid, exsisting user
 * 
 * @returns {Object String Token Number} an object containing a Bearer:token and the expiration date
 */

exports.generateJWT = async (user_ID) => {

    if (!user_ID) { throw new Error("attribute user_ID missing"); };
    if (typeof user_ID != "number") { throw new TypeError("user_ID must be a number"); };
    if (user_ID < 1) { throw new RangeError("user_ID must be a non-zero number"); };
    if (user_ID % 1 != 0) { throw new TypeError("user_ID must be a whole number"); };

    const payload = {
        sub: user_ID,
        iat: Date.now()
    };

    const expires = '3d';

    const privateKey = await this.readPriavteJWT()

    const token = JWT.sign(payload, privateKey, { expiresIn: expires, algorithm: 'RS256' });

    return {
        token: "Bearer:" + token,
        expires: expires
    };
};

const JWTKeyGen = async () => {

    return new Promise((resolve, rejects) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }, privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        }, (err, publicKey, privateKey) => {
            if (err) {
                rejects(err);
            };
            if (publicKey && privateKey) {
                resolve({
                    publicKey,
                    privateKey
                });
            };
        });
    });
};

exports.writeJWTKeys = async () => {
    try {
        const keys = await JWTKeyGen();

        await fs.writeFile("../keys/id_rsa_public.pem", keys.publicKey);
        await fs.writeFile("../keys/id_rsa_private.pem", keys.privateKey);
    } catch (error) {
        console.log(error)
    };
};