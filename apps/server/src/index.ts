import http from 'http';
import SocketService from './services/socket';
import { startConsumerService } from './services/kafka';
import express, { Express, Request, Response } from 'express';
import prismaClient from './services/prisma';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

// Types
interface UserRequest extends Request {
    body: {
        fullname: string,
        email: string;
        password: string;
    };
}

const app: Express = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

// Registration endpoint
app.post('/register', async (req: UserRequest, res: Response) => {
    const { fullname, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prismaClient.user.create({
            data: { fullname, email, password: hashedPassword },
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'User already exists' });
    }
});

// Login endpoint
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user.id }, process.env.AUTH_SECRET as string);
        console.log("successful");
        res.status(200).json({ token: token, email: user.email, fullname: user.fullname, id: user.id });
    } else {
        console.log("failed");
        res.status(401).json({ error: 'Invalid email or password' });
    }
});

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