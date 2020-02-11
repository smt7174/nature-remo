'use strict';
const AWS = require('aws-sdk');
const moment = require("moment");

module.exports.handler = async event => {

  console.info(`[event] ${JSON.stringify(event)}`);
  console.info(`[invoked] ${moment().format("YYYY-MM-DD HH:mm:ss")} に実行されました。`);

  const nowHour = moment().hour();
  if(nowHour !== 7 && nowHour !== 19) {
    console.info(`[canceled] 7時でも19時でもないため、処理を終了します。`);
    return;
  }

  const allEventData = await getAllEventsData();
  console.log(`[allEventData] ${JSON.stringify(allEventData)}`);

  await writeJsonStringtoFile(allEventData)
  return;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

async function getAllEventsData() {

  const momentDateTime = moment().add(-1, "M").format("YYYYMMDD");

  const lambda = new AWS.Lambda();

  const params = {
    FunctionName:"getAllEvents",
    InvocationType:"RequestResponse",
    Payload: JSON.stringify({"date": momentDateTime})
  }

  const response = await lambda.invoke(params).promise();
  // console.log(`[response] ${JSON.stringify(response)}`);
  console.log(`[event_log_mapped] ${JSON.stringify(JSON.parse(JSON.parse(response.Payload).body).event_log_mapped)}`);

  const event_log_mapped = JSON.parse(JSON.parse(response.Payload).body).event_log_mapped;
  return event_log_mapped;
}

async function writeJsonStringtoFile(allEventData) {

  console.log(`[writeJsonStringtoFile allEventData] ${JSON.stringify(allEventData)}`);

  const s3 = new AWS.S3();
  const jsonData = {
    events: allEventData
  };

  console.log(`[writeJsonStringtoFile jsonData] ${JSON.stringify(jsonData)}`);

  const params = {
    Body: JSON.stringify(jsonData),
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${process.env.APP_NAME}.json`
  }

  await s3.putObject(params).promise();
  return;
}