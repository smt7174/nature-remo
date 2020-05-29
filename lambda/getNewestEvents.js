'use strict';
const AWS = require('aws-sdk');

module.exports.handler = async event => {

  console.info(`[event] ${JSON.stringify(event)}`);

  const accessToken = await getNatureRemoAccessToken();
  const eventsData = await getNewestEventsData(accessToken);
  await putEventsData(eventsData);

  console.info(`[info] Serverless Framework monitor CI/CD ran`);

  const response = {
    statusCode: 200,
    body: JSON.stringify(eventsData)
  };

  return response;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

async function getNatureRemoAccessToken() {
  const client = new AWS.SecretsManager({
    region: "ap-northeast-1"
  });

  const secretObj = await client.getSecretValue({
    SecretId: process.env.SECRET_MANAGER_NAME
  }).promise();
  // console.info(`secretObj: ${JSON.stringify(secretObj)}`);

  const accessToken = JSON.parse(secretObj["SecretString"])[process.env.SECRET_MANAGER_SECRET_ID];
  // console.info(`accessToken: ${accessToken}`);
  return accessToken;
}

async function getNewestEventsData(token) {
  const axiosBase = require("axios");
  const axios = axiosBase.create({
    baseURL: 'https://api.nature.global/1', // バックエンドB のURL:port を指定する
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const response = await axios.get("/devices");
  console.log(`[response] ${JSON.stringify(response.data)}`);
  const newestEvents = response.data[0]['newest_events'];
  console.log(`[newestEvents] ${JSON.stringify(newestEvents)}`);

  const moment = require("moment");
  const timestamp = moment();

  const newestValues = {
    app_name : process.env.APP_NAME,
    date_time_num: parseInt(timestamp.format("YYYYMMDDHHmmss")),
    date_time: timestamp.format("YYYY-MM-DD HH:mm:ss"),
    temperature: newestEvents['te']['val'],
    humidity: newestEvents['hu']['val'],
    brightness: newestEvents['il']['val']
  }

  console.log(`[newestValues] ${JSON.stringify(newestValues)}`);
  return newestValues;
}

async function putEventsData(data) {

  console.log(`[data] ${JSON.stringify(data)}`);
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName : process.env.DYNAMO_DB_TABLE_NAME,
    Item: data
  }

  console.log(`[params] ${JSON.stringify(params)}`);

  await documentClient.put(params).promise();
  console.log(`${data.date_time} 1件のデータを登録しました。`);

  return;
}
