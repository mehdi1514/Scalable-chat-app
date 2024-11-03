import http from 'http';
import SocketService from './services/socket';
import { startConsumerService } from './services/kafka';
import express, { Express, Request, Response } from 'express';
import prismaClient from './services/prisma';
import cors from 'cors';

const app: Express = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000' // Update this to match your client's origin
}));

app.get('/api/messages', async (req: Request, res: Response) => {
    try {
        const messages = await prismaClient.message.findMany({
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                text: true,
            }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

function init() {
    startConsumerService();
    const socketService: SocketService = new SocketService();
    const httpServer = http.createServer(app);
    const PORT = process.env.PORT ? process.env.PORT : 8000;

    // attach socketService to httpService
    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => console.log(`Sever started at port ${PORT}`));

    socketService.initListeners();
}

init();