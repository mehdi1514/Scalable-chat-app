import { Kafka, Producer } from "kafkajs";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import prismaClient from "./prisma";

dotenv.config();

const kafka = new Kafka({
    brokers: ['chat-app-kafka-mehdi-chat-app.e.aivencloud.com:22514'],
    ssl: {
        ca: [fs.readFileSync(path.resolve('./src/services/ca.pem'), "utf-8")]
    },
    sasl: {
        username: process.env.KAFKA_USERNAME as string,
        password: process.env.KAFKA_PASSWORD as string,
        mechanism: 'plain'
    }
});


// we do not want to create a producer each time we send a message
// so we implement a simple caching mechanism by storing the producer in a variable
let producer: null | Producer = null;

async function createProducer() {
    if (producer) return producer; // give cached producer if it is not null
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer
    return producer;
}

export async function produceMessage(message: string) {
    const _producer = createProducer();
    (await _producer).send({
        messages: [
            {
                key: `message-${Date.now()}`,
                value: message
            }
        ],
        topic: "MESSAGES"
    })
}

export async function startConsumerService() {
    const consumer = kafka.consumer({ groupId: 'default' });
    await consumer.connect();
    await consumer.subscribe({topic: "MESSAGES", fromBeginning: true});

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message, pause}) => {
            if (!message.value) return;
            console.log(`📦Consumer is inserting ${message.value} into the postgres database`);
            try {
                await prismaClient.message.create({
                    data: {
                        text: message.value.toString(),
                    }
                })
            } catch (error) {
                console.log("🚨Postgres server maybe down. Pausing consumer service...");
                pause();
                setTimeout(() => {
                    consumer.resume([{topic: "MESSAGES"}]);
                }, 60*1000);
            }
        }
    });
}