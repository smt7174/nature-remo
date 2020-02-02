const cryptoJs = require("crypto-js");

module.exports.getDecriptedAccessToken = () => {

    const salt = '';
    // const planeText = '';

    // console.log('暗号化するテキスト : ' + planeText);
    // console.log('暗号化キー        : ' + salt);

    // 暗号化
    // const encryptedTextdText = cryptoJs.AES.encrypt(planeText, salt).toString();
    const encryptedTextdText = "";
    console.log('暗号化(AES) : ' + encryptedTextdText);

    // 復号
    const decryptedTextdText = cryptoJs.AES.decrypt(encryptedTextdText, salt).toString(cryptoJs.enc.Utf8);
    console.log('復号化(AES192) : ' + decryptedTextdText);

};