"use client";

import React, { useEffect, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useSocket } from '../../context/SocketProvider';

export default function ChatScreen() {
    const { sendMessage, messages, userId } = useSocket();
    const [message, setMessage] = useState('');

    // // hardcoded messages
    // const messages = [
    //     { id: 1, text: "Hey there! How's it going?", sender: 'user' },
    //     { id: 2, text: "Hi! I'm doing great, thanks for asking. How about you?", sender: 'other' },
    //     { id: 3, text: "I'm doing well too. Just working on some new projects.", sender: 'user' },
    //     { id: 4, text: "That sounds exciting! What kind of projects are you working on?", sender: 'other' },
    //     { id: 5, text: "I'm building a new chat application with React and Tailwind CSS. It's been really fun so far!", sender: 'user' },
    //     { id: 6, text: "That's awesome! I'd love to hear more about it.", sender: 'other' },
    //     { id: 7, text: "It's a responsive design that works well on both desktop and mobile.", sender: 'user' },
    //     { id: 8, text: "Are you using any specific libraries or frameworks?", sender: 'other' },
    //     { id: 9, text: "Yes, I'm using React for the frontend and Tailwind CSS for styling.", sender: 'user' },
    //     { id: 10, text: "That's a great combination. How's the progress so far?", sender: 'other' },
    // ]

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    useEffect(()=>{
        console.log(userId);
    }, [userId]);

    useEffect(()=>{
        console.log(messages);
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`min-w-16 md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                                    msg.sender === userId
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-800'
                                }`}
                            >
                                <p className='flex text-[8px] justify-end'>~{msg.sender.slice(0,4)}</p>
                                <p className='flex text-base justify-start'>{msg.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-gray-200 px-4 pt-4 pb-4 sm:pb-6 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <PaperAirplaneIcon className="h-6 w-6" />
                        <span className="sr-only">Send message</span>
                    </button>
                </form>
            </div>
        </div>
    )
}