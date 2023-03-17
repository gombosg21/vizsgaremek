const password = require("../util/password");


let returnData;
let secondReturnData;

beforeAll(async () => {
    returnData = await password.generatePassword("asdafaweger");
    secondReturnData = await password.generatePassword("hsndjsbgnhasb")
});


test('password hashing callable', async () => {
    expect(password.generatePassword instanceof Function).toBe(true);
});

test('password hashing is an async function', async () => {
    const AsyncFunction = (async () => { }).constructor;
    expect(password.generatePassword instanceof AsyncFunction).toBe(true);
});

test('password hashing returns something', async () => {
    expect(returnData).toBeTruthy();
});

test('password hashing returns an object', async () => {
    expect(returnData instanceof Object).toBe(true);
});

test('password hashing retruns a JSON object', async () => {
    expect(Object.prototype.toString.call(returnData)).toBe('[object Object]');
});

test('password hashing retruns a JSON object with 2 fields', async () => {
    expect(Object.keys(returnData).length).toBe(2);
});


test('password hashing returns with one field called "hash"', () => {
    expect(returnData.hasOwnProperty('hash')).toBe(true);
});
test('password hashing returns with one field called "salt"', () => {
    expect(returnData.hasOwnProperty('salt')).toBe(true);
});


test('password hashings field salt is string', async () => {
    expect(typeof returnData.salt).toBe('string');
});
test('password hashings field hash is string', async () => {
    expect(typeof returnData.hash).toBe('string');
});


test('password hashings field hash is hexadecimal', async () => {
    const regexCharMap = /[0-9a-fA-F]+/;
    expect(returnData.hash.match(regexCharMap)[0]).toEqual(returnData.hash);
});

test('password hashings field salt is hexadecimal', async () => {
    const regexCharMap = /[0-9a-fA-F]+/;
    expect(returnData.salt.match(regexCharMap)[0]).toEqual(returnData.salt);
});



test('password hashings salt field is 512 long', async () => {
    expect(returnData.salt.length).toBe(512);
});
test('password hashings hash field is 512 long', async () => {
    expect(returnData.hash.length).toBe(512);
});



test('password hashing retruns different outputs w different inputs, salt field', async () => {
    expect(returnData.salt).not.toStrictEqual(secondReturnData.salt);
});
test('password hashing retruns different outputs w different inputs, hash field', async () => {
    expect(returnData.hash).not.toStrictEqual(secondReturnData.hash);
});

test('password cheker returns', async () => {
    expect(await password.validatePassword("asdafaweger", returnData.salt, returnData.hash)).toBeTruthy();
});

test('password cheker returns with type boolean', async () => {
    expect(typeof (await password.validatePassword("asdafaweger", returnData.salt, returnData.hash))).toBe("boolean");
});

test('password cheker returns true on matching password', async () => {
    expect(await password.validatePassword("asdafaweger", returnData.salt, returnData.hash)).toBe(true);
});

test('password cheker returns false on mismatching password', async () => {
    expect(await password.validatePassword("asdager", returnData.salt, returnData.hash)).toBe(false);
});

