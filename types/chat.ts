// types/chat.ts

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'system'; // ผู้ส่ง: ผู้ใช้, AI, หรือ ระบบ
    timestamp: string; // เวลาของข้อความ (ใช้ ISO String)
}