'use strict';
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {

  console.info(`[event] ${JSON.stringify(event)}`);
  // console.info(`[executed] ${moment().format("YYYY-MM-DD HH:mm:ss")} に実行されました。`);

  await main()
  return;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

async function main() {
  const items = await getData();
  if(items.length === 0) {
    console.info("no data found");
    return;
  }

  await putData(items)
  return;
}

async function getData() {

  const params = {
    TableName : process.env.DYNAMO_DB_TABLE_NAME,
    KeyConditionExpression: "app_name = :app_name and date_time_num < :date_time_num",
    ExpressionAttributeValues : {
      ":app_name": process.env.APP_NAME,
      ":date_time_num": 20200829083000,
    },
    ScanIndexForward: true
  }

  console.log(`[params] ${JSON.stringify(params)}`);

  const data = await documentClient.query(params).promise();
  console.log(`[data] ${JSON.stringify(data)}`);

  return data.Items;
}

async function putData(items) {

  console.log(`[data] ${JSON.stringify(items)}`);
  const processes = [];

  for(let item of items) {

    const t = item.temperature;
    const h = item.humidity;

    const absH = Math.floor((6.11 * Math.pow(10, 7.5 * t / (237.3 + t)) * h) / (8.31447 * (273.15 + t)) * 18);

    const itemParam = {
      app_name : process.env.APP_NAME,
      date_time_num: item.date_time_num,
      date_time: item.date_time,
      temperature: t,
      humidity: h,
      brightness: item.brightness,
      absolute_humidity: absH,
      ttl: 1598886000
    }

    const params = {
      TableName : process.env.DYNAMO_DB_TABLE_NAME,
      Item: itemParam
    }

    console.log(`[params] ${JSON.stringify(params)}`);

    const p = documentClient.put(params).promise();
    processes.push(p)
  }

  await Promise.all(processes);
  console.log(`${items.length}件のデータを登録しました。`);

  return;
}