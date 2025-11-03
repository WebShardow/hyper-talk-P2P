// components/ChatContainer.tsx
'use client';
// *** สำคัญมาก: ต้องระบุว่าเป็น Client Component เพื่อใช้ useState/useEffect ***

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';

// ข้อมูลจำลองเริ่มต้นสำหรับทดสอบ UI
const initialMessages: Message[] = [
    { id: '1', text: 'สวัสดีครับ! ยินดีต้อนรับสู่ Web Chat ที่สร้างด้วย Next.js, TypeScript, และ Tailwind CSS!', sender: 'ai', timestamp: new Date().toISOString() },
    { id: '2', text: 'ฉันคือ User: นี่คือข้อความทดสอบจากฝั่งผู้ใช้', sender: 'user', timestamp: new Date(Date.now() - 5000).toISOString() },
];

const ChatContainer: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        // 1. อัพเดท UI ทันที
        setMessages((prev) => [...prev, newMessage]);
        setInput('');

        // 2. *** จุดเชื่อมต่อ Real-time ***
        // ในขั้นตอนนี้ โค้ดสำหรับส่งข้อความไปยัง Backend (เช่น WebSockets, Server Action, หรือ AI SDK) จะถูกเพิ่มเข้ามา
        console.log("ส่งข้อความไปยัง Real-time Backend:", newMessage.text);
    };

    return (
        <div className="flex flex-col h-[85vh] max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl bg-white dark:bg-gray-800">

            {/* ส่วนหัว */}
            <header className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Web Chat Powered by Next.js & Tailwind CSS</h1>
            </header>

            {/* ส่วนแสดงข้อความ (ใช้ flex-1 และ overflow-y-auto เพื่อให้ข้อความเลื่อนได้) */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>

            {/* ส่วนป้อนข้อมูล */}
            <footer className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
                <form onSubmit={handleSend} className="flex space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="พิมพ์ข้อความของคุณ..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 outline-none"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50"
                        disabled={input.trim() === ''}
                    >
                        ส่ง
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatContainer;

// Client Component หลักที่ใช้จัดการ State ของข้อความและการส่งข้อความ