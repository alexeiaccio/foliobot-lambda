import { successResponse, runWarm } from './utils';
import request from 'request';
import https from 'https';

const hello = (event, context, callback) => {

  function sendMessage(chat_id, text) {
    request({
      url: `https://api.telegram.org/bot473619591:AAFKB-SZYTZzpRuyGL6JUirpNipBSNg-Xmo/sendMessage?chat_id=${chat_id}&text=${text}`,
      metod: 'POST'
    }, (error, response, body) => {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    })
  }

  request({
    url: 'https://api.telegram.org/bot473619591:AAFKB-SZYTZzpRuyGL6JUirpNipBSNg-Xmo/getUpdates',
    pool: { maxSockets: Infinity }
  }, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body.result); // Print the HTML for the Google homepage.
    const lastUpdate = body.result[body.result.length-1]
    const chat_id = lastUpdate.chat.id
    const text = lastUpdate.message.text
    sendMessage(chat_id, text)
  });
  // successResponse handles wrapping the response in an API Gateway friendly
  // format (see other responses, including CORS, in `./utils/lambda-response.js)
  const response = successResponse({
    message: 'Go Serverless v1.0! Your function executed successfully!',
    input: event,
    context
  });

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(hello);
