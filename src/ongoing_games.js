var AWS = require('aws-sdk'), util = require('util');
var config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});
var sns = new AWS.SNS(config);
var sqs = new AWS.SQS(config);
const id = createUuid();
const topicArn = 'arn:aws:sns:eu-west-1:549374948510:tic-tac-toe';

function getQueueUrl(id) {
  return "https://sqs.eu-west-1.amazonaws.com/549374948510/".concat(id);
}

function getEndpoint(id) {
  return 'arn:aws:sqs:eu-west-1:549374948510:'.concat(id)
}

export function createAndSubscribe(id) {
  sqs.createQueue({
    'QueueName': id
  }, function (err, result) {
    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }
    createSubscription(id);
    addPermissions(id);
  })
}

function createSubscription(id) {
  var params = {
    'TopicArn': topicArn,
    'Protocol': 'sqs',
    'Endpoint': getEndpoint(id),
  }
  sns.subscribe(params, function (err, result) {
    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }
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
      "Action": ["sqs:SendMessage","sqs:DeleteMessage"],
      "Resource": getEndpoint(id),
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
  });
}

export function receiveMessages(id, game, callback) {
  var params = {
    QueueUrl: getQueueUrl(id),
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
  };
  sqs.receiveMessage(params, function(err, data) {
    if (data.Messages.length > 0) {
      var parsed = parseData(data)
      // removeFromQueue(data.Messages[0], id) TODO Put this back in
      game.push(parsed);
      callback()
    }
  });
}

var parseData = function(data) {
  var boardState = JSON.parse(JSON.parse(data.Messages[0].Body).Message)
  return boardState;
}

var removeFromQueue = function(message, id) {
  sqs.deleteMessage({
    QueueUrl: getQueueUrl(id),
    ReceiptHandle: message.ReceiptHandle
  }, function(err, data) {
    err && console.log(err);
  });
};

export function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


