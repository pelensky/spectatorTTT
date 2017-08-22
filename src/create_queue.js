var AWS = require('aws-sdk'), util = require('util');
AWS.config.loadFromPath('./config.json');
var sns = new AWS.SNS();
var sqs = new AWS.SQS();

const id = createUuid();
let url

function createQueue() {
  sqs.createQueue({
    'QueueName': 'demo'
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }

    url = result.QueueUrl;
    console.log (url);
  });
}

function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

createQueue()
