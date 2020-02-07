'use strict';

module.exports.handler = async event => {

  console.info(`[event] ${JSON.stringify(event)}`);

  let date = -1;

  if(event) {
    if(event.date) {
     date = parseInt(event.date);
    } else if(event.queryStringParameters && event.queryStringParameters.date) {
      date = parseInt(event.queryStringParameters.date);
    }
  }

  if(date === -1) throw new Error("date: invalid parameter value.");

  const events_log = await getAllEvents(date);
  console.log(`[events_log] ${JSON.stringify(events_log)}`);

  const event_log_mapped = mapEventLog(events_log);
  console.log(`[event_log_mapped] ${JSON.stringify(event_log_mapped)}`);

  return {
    statusCode: 200,
    body: JSON.stringify({event_log_mapped: event_log_mapped})
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

async function getAllEvents(date) {
  const AWS = require('aws-sdk');
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName : process.env.DYNAMO_DB_TABLE_NAME,
    KeyConditionExpression: "app_name = :app_name and date_time_num >= :date_time_num",
    ExpressionAttributeValues : {
      ":app_name": process.env.APP_NAME,
      ":date_time_num": date,
    }
  }

  console.log(`[params] ${JSON.stringify(params)}`);

  const events_log = await documentClient.query(params).promise();
  console.log(`[events_log] ${JSON.stringify(events_log)}`);

  return events_log.Items;
}

function mapEventLog(event_log) {

  const mapped_event_log = event_log.map(item => ({
    date_time:　item.date_time,
    temperature: item.temperature,
    humidity:item.humidity,
    brightness:item.brightness
  }));

  return mapped_event_log;
}