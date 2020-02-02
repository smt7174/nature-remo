'use strict';
const AWS = require('aws-sdk');

module.exports.handler = async event => {

  console.info(`[event] ${JSON.stringify(event)}`);

  const accessToken = await getNatureRemoAccessToken();
  const eventsData = await getNewestEventsData(accessToken);

  return {
    statusCode: 200,
    body: JSON.stringify(eventsData)
  };

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

  const natureRemoData = await axios.get("/devices");
  console.log(`[natureRemoData] ${JSON.stringify(natureRemoData.data)}`);
  const newestEvents = natureRemoData.data[0]['newest_events'];
  console.log(`[newestEvents] ${JSON.stringify(newestEvents)}`);

  const newestValues = {
    temperature: newestEvents['te']['val'],
    humidity: newestEvents['hu']['val'],
    brightness: newestEvents['il']['val']
  }

  console.log(`[newestValues] ${JSON.stringify(newestValues)}`);
  return newestValues;
}
