import dotenv from "dotenv";
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { produceMessage } from "./kafka"
import prismaClient from "./prisma";

dotenv.config();

const redisConfiguration = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
};

const pub = new Redis(redisConfiguration);
const sub = new Redis(redisConfiguration);

class SocketService {
    private _io: Server;

    constructor() {
        // creating a socket server and enabling CORS for our frontend
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        console.log("Socket server created✅");
        sub.subscribe("MESSAGES", (err, count) => {
            if (err) {
                // Just like other commands, subscribe() can fail for some reasons,
                // ex network issues.
                console.error("Failed to subscribe: %s", err.message);
            } else {
                // `count` represents the number of channels this client are currently subscribed to.
                console.log(
                    `Subscribed successfully! This client is currently subscribed to ${count} channel: MESSAGES.`
                );
            }
        })
    }

    public initListeners() {
        this._io.on("connect", async (socket) => {
            console.log(`🆕 New socket connected ${socket.id}`);
            socket.on("event:message", async ({ message, sender }: { message: string, sender: string }) => {
                console.log(`👉 Received '${message}' from ${sender}`);

                // publish message to redis on MESSAGES channel
                await pub.publish('MESSAGES', JSON.stringify({ message, sender }));
            });
        });

        // When a message is received in the redis server, subcriber should get the message
        sub.on("message", async (channel, message) => {
            // forward messages to clients subscribed to MESSAGES channel
            if(channel === 'MESSAGES') {
                this._io.emit("message", message);
                await produceMessage(message);
                console.log(`📨 ${message} produced to kafka broker`)
            }
        });
    }

    // getter for our socket server
    get io() {
        return this._io;
    }
}

export default SocketService;