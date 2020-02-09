const cryptoJs = require("crypto-js");

/*
 @sample of returning decrypted value.
*/

module.exports.getDecryptedAccessToken = () => {

    // set your original phrese for encryption and decription to salt.
    const salt = 'your-salt-phrase';

    // encryption.
    // if you don't know encrypted value, you can confirm it to uncomment and execute sources of line 16 and 17.
    // (Encrypted value is displayed at your console as a log)
    // set password value you want to encrypt and decript to planeText.
    // const planeText = 'your-original-password-value';
    // console.log(`[encryptedText] ${cryptoJs.AES.encrypt(planeText, salt).toString()}`)

    // decription
    // set encrypted value to encryptedText
    const encryptedText = "encrypted-value";

    // the decrypted value(=unencrypted one) is set to decryptedText.
    const decryptedText = cryptoJs.AES.decrypt(encryptedText, salt).toString(cryptoJs.enc.Utf8);
    // console.log(`[decryptedText] ${decryptedText}`);

    return decryptedText;

};