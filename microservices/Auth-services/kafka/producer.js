const kafka = require('../kafka/client');

const producer = kafka.producer();
const connectProducer = async () => {
    await producer.connect();
    console.log('Producer connected');
}   
const publishEvent = async (topic, message) => {
    try {
        await producer.send({
            topic: topic,
            messages: [
                { value: JSON.stringify(message) }
            ]
        });
        console.log(`Message sent to topic ${topic}: ${JSON.stringify(message)}`);
    } catch (error) {
        console.error(`Error sending message to topic ${topic}:`, error);
    }
}
const disconnectProducer = async () => {
    await producer.disconnect();
    console.log('Producer disconnected');
}   

module.exports = {
    connectProducer,
    publishEvent,
    disconnectProducer
};
