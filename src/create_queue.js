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
  return 'arn:aws:sqs:eu-west-1:549374948510:'.concat(id)
}


function createQueue(id, callback) {
  sqs.createQueue({
    'QueueName': id
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return;
    }
    callback();
    return result.QueueUrl;
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
      "Action": "sqs:SendMessage",
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

function receiveMessages(id) {
  var params = {
    QueueUrl: getQueueUrl(id),
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
  };

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    }
    var bodies = data.Messages.map(function(message) {
      return JSON.parse(message.Body);
    });
    var boardStates = bodies.map(function(message) {
     return message.Message
    });
    console.log(boardStates);
  });
}

function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createAndSubscribe(id) {
  createQueue(id, function() {
    createSubscription(id);
    addPermissions(id);
  })
}
//createAndSubscribe('id');
receiveMessages('id');
