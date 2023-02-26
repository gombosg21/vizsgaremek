exports.getBase64 = (fileBlob) => {
    var reader = new FileReader();
    reader.readAsBinaryString(fileBlob);
    reader.onloadend() = () => {
        return reader.result;
    };
    reader.onerror() = (error) => {
        console.error(error);
        return;
    };
};

exports.getBlob = (fileData) => {

};