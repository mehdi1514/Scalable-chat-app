'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';

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
    messages: {sender: string, message: string}[];
    userId: string | null;
}

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error("🛑State is undefined");

    return state;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

// The provider that will provide our socket context which has our socket client
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<{sender: string, message: string}[]>([]);
    const userIdRef = useRef<string | null>(null);

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg: string) => {
        console.log(`Sending msg: ${msg} with userId ${userIdRef.current}`);
        // if socket is created, emit the msg
        if(socket) {
            socket.emit("event:message", { message: msg, sender: userIdRef.current });
        }
    }, [socket]);

    const onMessageReceived = useCallback((msg: string) => {
        console.log(`Message Received from redis: ${msg}`);
        const { message, sender } = JSON.parse(msg) as { message: string , sender: string };
        setMessages((prev) => [...prev, {sender: sender, message: message}]);
    }, []);

    useEffect(() => {
        const _socket = io("http://localhost:8000");
        setSocket(_socket);
        _socket.on("connect", () => {
            userIdRef.current = _socket.id || null;
            console.log("Connected with userId:", userIdRef.current);
        });
        _socket.on("message", onMessageReceived);

        return () => {
            _socket.disconnect();
            _socket.off('messages', onMessageReceived);
            setSocket(undefined);
        }
    }, []);

    return (
        <SocketContext.Provider value={{ sendMessage, messages, userId: userIdRef.current }}>
            {children}
        </SocketContext.Provider>
    );
}