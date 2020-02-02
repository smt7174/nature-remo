const cryptoJs = require("crypto-js");

module.exports.getDecriptedAccessToken = () => {

    const salt = 'SrdPayDEN1x4Jw9YYM2V';
    // const planeText = 'ejFZm2306Qct5Q-n7oLH3waqsewKB1K03b1VPZ8RYSw.dmDN3aVZz0XrYgiJvquMr0UxZ1xliEd5pb5VSjSHFzA';

    // console.log('暗号化するテキスト : ' + planeText);
    // console.log('暗号化キー        : ' + salt);

    // 暗号化
    // const encryptedTextdText = cryptoJs.AES.encrypt(planeText, salt).toString();
    const encryptedTextdText = "U2FsdGVkX1/Og05qN2hGJ/7qX/Y1f9sfjufrULiCbun93qhANdzc+DFgptNYuZk+4OB4hAFle9iJP0v73ROqRpSpHQ2kxMEP7RdCjuMEpOBWXUSXv3PjmtkYLt7mVSi+m+ysBxVIHLD/W6u/WbzcCQ==";
    console.log('暗号化(AES) : ' + encryptedTextdText);

    // 復号
    const decryptedTextdText = cryptoJs.AES.decrypt(encryptedTextdText, salt).toString(cryptoJs.enc.Utf8);
    console.log('復号化(AES192) : ' + decryptedTextdText);

};