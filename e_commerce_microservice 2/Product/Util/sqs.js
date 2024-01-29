let AWS = require('aws-sdk');
AWS.config.update({ region: process.env.sqsregion });
const sqs = new AWS.SQS({
    apiVersion: process.env.sqsapiVersion,
    credentials: new AWS.SharedIniFileCredentials({ profile: 'sx-sqs' })
});


const readMessages = async (queueURL, numMessages = 1) => {
    try {

        const params = {
            AttributeNames: [
                "SentTimestamp"
            ],
            MaxNumberOfMessages: numMessages,
            MessageAttributeNames: [
                "All"
            ],
            QueueUrl: queueURL,
            VisibilityTimeout: 30,
            WaitTimeSeconds: 3
        };

        let res = await sqs.receiveMessage(params).promise()
        return res?.Messages
    }
    catch (err) {
        console.error(err)
        return null
    }
}

const deleteMessages = async (response, queueURL) => {
    try {
        let receiptHandle = response?.[0]?.ReceiptHandle ?? response
        let deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: receiptHandle
        };
        if (receiptHandle)
            await sqs.deleteMessage(deleteParams).promise();
    }
    catch (err) {
        console.log(err)
    }

}

const sendMessage = async (queue, body) => {

    const params = {
        MessageBody: typeof (body) == 'string' ? body : JSON.stringify(body),
        QueueUrl: queue,
    }

    await sqs.sendMessage(params).promise();
}

module.exports = { deleteMessages, readMessages, sendMessage }