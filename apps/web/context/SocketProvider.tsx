'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';
import { useSession } from "next-auth/react";
import { User } from "next-auth";

// creating an interface for providing the type of props SockerProvider expects
// Several benefits: Type Safety, Developer Support, Error Prevention
interface SocketProviderProps {
    children?: React.ReactNode;
}

// By using this interface, TypeScript can ensure that the value provided to
// the SocketContext.Provider matches the expected shape. 
// This helps prevent errors where incorrect data type might be passed into the context.
interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages: { sender: User, message: string }[];
    userId: string | undefined;
}

interface Message {
    message: string;
    sender: User;
}


export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error("🛑State is undefined");

    return state;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

// The provider that will provide our socket context which has our socket client
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setUserId] = useState<string | undefined>();
    const { data: session } = useSession();
    

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg: string) => {
        console.log(`Sending msg: ${msg} with userId ${session?.user?.id}`);
        // if socket is created, emit the msg
        if (socket) {
            socket.emit("event:message", { message: msg, sender: session?.user });
        }
    }, [socket]);

    const onMessageReceived = useCallback((msg: string) => {
        console.log(`Message Received from redis: ${msg}`);
        const { message, sender } = JSON.parse(msg) as { message: string, sender: User };
        setMessages((prev) => [...prev, { sender: sender, message: message }]);
    }, []);

    useEffect(() => {
        setUserId(session?.user.id);
    }, [session]);
    useEffect(() => {
        const _socket = io("http://localhost:8000");
        setSocket(_socket);
        _socket.on("connect", async () => {
            try {
                const response = await fetch('http://localhost:8000/api/messages');
                const data = await response.json();
                const parsedMessages: Message[] = data.map((item: any) => {
                    const parsedValue = JSON.parse(item.text);
                    return {
                        message: parsedValue.message,
                        sender: parsedValue.sender,
                    };
                });
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        });
        _socket.on("message", onMessageReceived);

        return () => {
            _socket.disconnect();
            _socket.off('messages', onMessageReceived);
            setSocket(undefined);
        }
    }, []);

    return (
        <SocketContext.Provider value={{ sendMessage, messages, userId: userId }}>
            {children}
        </SocketContext.Provider>
    );
}