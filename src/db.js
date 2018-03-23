const AWS = require('aws-sdk')

const IS_OFFLINE = process.env.IS_OFFLINE

let dynamoDb
// AWS
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient()
}

module.exports = dynamoDb