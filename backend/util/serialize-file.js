exports.getBase64 = async (fileBuffer) => {

    if (!fileBuffer) { throw new Error("argument fileBuffer missing") };
    if (!(fileBuffer instanceof Buffer)) { throw new TypeError("fileBuffer must be a buffer") };
    if (fileBuffer.byteLength == 0) { throw new RangeError("fileBuffer cannot be an empty buffer") };

    const base64Data = fileBuffer.toString('base64');

    return base64Data;
};

exports.getBlob = async (base64Data) => {
    if (!base64Data) { throw new Error("argument base64Data missing") };
    if (typeof base64Data != "string") { throw new TypeError("base64Data must be a string") };
    if (base64Data.length == 0) { throw new RangeError("base64Data cannot be an empty string") };

    const bufferData = await new Buffer.from(base64Data, "base64");
    const blobData = new Blob(bufferData);

    return blobData;
};