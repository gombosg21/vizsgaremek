const webp = require('webp-converter');

exports.IMGToWebP = (img) => {
    webp.grant_permission();
    output = webp.cwebp(img,output)
    return output;
}
