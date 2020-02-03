'use strict';

module.exports.handler = async event => {

  console.info(`[event] ${event}`);

  return {
    statusCode: 200,
    body: JSON.stringify({events_history: 'Invoked successfully!'})
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
