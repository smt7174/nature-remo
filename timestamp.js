const moment = require("moment");

module.exports.getTimeStamp = () => {

    const timeStamp = moment().format("YYYYMMDDHHmmss");
    console.log(timeStamp);
    return timeStamp;
};