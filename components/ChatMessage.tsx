// components/ChatMessage.tsx

import React from 'react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    // ตรวจสอบว่าข้อความมาจากผู้ใช้หรือไม่
    const isUser = message.sender === 'user';

    // กำหนดคลาสสำหรับจัดวางตำแหน่ง (ใช้ flex)
    const containerClasses = isUser
        ? 'flex justify-end' // ข้อความผู้ใช้อยู่ด้านขวา
        : 'flex justify-start'; // ข้อความ AI/ระบบ อยู่ด้านซ้าย

    // กำหนดสไตล์ของกล่องข้อความ
    const messageClasses = isUser
        ? 'bg-blue-600 text-white rounded-tr-none' // สีฟ้าสำหรับผู้ใช้
        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-tl-none'; // สีเทาสำหรับ AI/ระบบ

    return (
        <div className={`mb-4 ${containerClasses}`}>
            <div className={`max-w-xs sm:max-w-md p-3 rounded-lg shadow-md ${messageClasses}`}>
                <p className="text-sm break-words">{message.text}</p>
                <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-400'}`}>
                    {/* แปลง timestamp เป็นเวลาไทยที่อ่านง่าย */}
                    {new Date(message.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;

// Component สำหรับแสดงข้อความแต่ละข้อความ เพื่อให้โค้ดสะอาดและง่ายต่อการบำรุงรักษา