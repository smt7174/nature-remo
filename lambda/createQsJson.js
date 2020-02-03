'use strict';
const AWS = require('aws-sdk');
const moment = require("moment");

module.exports.handler = async event => {

  console.info(`[event] ${JSON.stringify(event)}`);
  const momentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");

  const allEventData = await getAllEventsData();
  console.info(`[invoked] ${momentDateTime} に実行されました。`);
  return;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

async function getAllEventsData() {
  const lambda = new AWS.Lambda();

  const params = {
    FunctionName:"getAllEvents",
    InvocationType:"RequestResponse"
  }

  const response = await lambda.invoke(params).promise();
  console.log(`[response] ${JSON.parse(JSON.parse(response.Payload).body).events_history}`);
  return response;
}
