var AWS = require('aws-sdk'), util = require('util');
AWS.config.loadFromPath('./config.json');
var sns = new AWS.SNS();
var sqs = new AWS.SQS();

const id = createUuid();
const topicArn = 'arn:aws:sns:eu-west-1:549374948510:tic-tac-toe';

function getQueueUrl(id) {
  return "https://sqs.eu-west-1.amazonaws.com/549374948510/".concat(id);
}

function getEndpoint(id) {
  return 'arn:aws:sqs:eu-west-1:549374948510:demo'.concat(id)
}


function createQueue() {
  sqs.createQueue({
    'QueueName': 'demo'
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }
    return result.QueueUrl;
  });
}

function getQueueInfo(id) {

  sqs.getQueueAttributes({
    QueueUrl: "https://sqs.eu-west-1.amazonaws.com/549374948510/".concat(id),
    AttributeNames: ["QueueArn"]
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }
    console.log(util.inspect(result));
  });
}

function createSubscription(id) {
  sns.subscribe({
    'TopicArn': topicArn,
    'Protocol': 'sqs',
    'Endpoint': getEndpoint(id),
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }

    console.log(util.inspect(result));

  });
}

function addPermissions(id) {
  var attributes = {
    "Version": "2008-10-17",
    "Id": getEndpoint(id) + "/SQSDefaultPolicy",
    "Statement": [{
      "Sid": "Sid" + new Date().getTime(),
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "SQS:SendMessage",
      "Resource": getEndpoint(id),
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": topicArn
        }
      }
    }
    ]
  };

  sqs.setQueueAttributes({
    QueueUrl: getQueueUrl(id),
    Attributes: {
      'Policy': JSON.stringify(attributes)
    }
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }

    console.log(util.inspect(result));
  });
}

function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

addPermissions("demo");
