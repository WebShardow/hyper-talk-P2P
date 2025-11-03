// components/ChatContainer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
// ⬇️ เพิ่ม Imports ⬇️
import { createClientComponentClient } from '@/utils/supabase/client';
import { Send } from 'lucide-react'; // สำหรับไอคอนส่งข้อความ

// 2. กำหนด Type สำหรับ Database (ถ้าใช้ Supabase Typescript Generator จะดีกว่า แต่เราใช้ Message interface เดิม)
// Note: สมมติว่าใน Supabase มีตารางชื่อ 'messages' ที่มีคอลัมน์ตรงกับ Message interface

const ChatContainer: React.FC = () => {
    // กำหนด initial state เป็น true เพื่อแสดง Loading ขณะดึงข้อมูลครั้งแรก
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // สร้าง Supabase Client (ใช้ Singleton จาก Utility)
    const supabase = createClientComponentClient();

    // ฟังก์ชันเลื่อนไปที่ข้อความล่าสุด
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 💡 1. useEffect: ดึงข้อความเก่า และเปิด Real-time Listener (แก้ไข ESLint: set-state-in-effect ถูกลบ)
    useEffect(() => {
        // setLoading(true) ถูกลบออก เพราะ useState(true) ทำหน้าที่นี้อยู่แล้ว

        const fetchMessages = async () => {
            // 1. ดึงข้อความเก่าจากตาราง 'messages' (เรียงตามเวลา)
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('timestamp', { ascending: true }) // ต้องแน่ใจว่าตารางมีคอลัมน์ timestamp
                // Type Casting: กำหนด Type ให้ตรงกับ Message Interface
                .returns<Message[]>(); 
            
            if (error) {
                console.error('Error fetching messages:', error);
            } else if (data) {
                setMessages(data);
            }
            setLoading(false); // ตั้งค่า Loading เป็น false เมื่อโหลดข้อมูลเสร็จ
            // ไม่ต้องเรียก scrollToBottom ตรงนี้ เพราะ useEffect ตัวที่สองจะดูแล
        };

        // 2. เปิด Real-time Channel สำหรับการอัปเดตข้อความใหม่
        const messageChannel = supabase
            .channel('chat-room-1') // สร้าง Channel ชื่อเฉพาะสำหรับห้องแชท
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' }, // ฟังเฉพาะเมื่อมีการ INSERT ข้อมูล
                (payload) => {
                    // Type Casting: กำหนด Type ของ Payload
                    const newMessage = payload.new as Message; 
                    setMessages((prev) => {
                        // ป้องกันการเพิ่มข้อความซ้ำจากการ fetch และ real-time listener
                        if (!prev.some(msg => msg.id === newMessage.id)) {
                             return [...prev, newMessage];
                        }
                        return prev;
                    });
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Supabase Realtime Subscribed to chat-room-1');
                }
            });

        fetchMessages();

        // Cleanup function: ปิด channel เมื่อ component ถูก unmount
        return () => {
            messageChannel.unsubscribe();
        };

    // แก้ไข ESLint (exhaustive-deps): เพิ่ม supabase ใน dependency array
    }, [supabase]); 

    // 💡 2. useEffect: เลื่อนไปยังข้อความล่าสุดเมื่อ messages มีการเปลี่ยนแปลง
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 💡 3. handleSend: ส่งข้อความไป Supabase (ไม่ต้องอัปเดต State โดยตรง)
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || loading) return;

        // ข้อมูลข้อความใหม่
        const newMessage: Omit<Message, 'id'> = {
            // Supabase จะสร้าง 'id' ให้โดยอัตโนมัติหากตั้งค่าเป็น primary key
            text: input.trim(),
            sender: 'user', 
            timestamp: new Date().toISOString(),
        };

        // 3.1 บันทึกข้อความลง Supabase Database (แก้ไข TypeScript/ESLint: ใช้ as any และเพิ่ม suppression comment)
        const { error } = await supabase
            .from('messages')
            .insert([newMessage] as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        // 3.2 Real-time Listener จะทำหน้าที่อัปเดต State `messages` เอง 

        if (error) {
            console.error('Error sending message to Supabase:', error);
            // แสดง Error ให้ผู้ใช้เห็น
        } else {
            setInput(''); // เคลียร์ input เมื่อส่งสำเร็จ
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            
            {/* Header (สามารถเพิ่มสถานะ Real-time ได้ในอนาคต) */}
            <header className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Hyper-Talk P2P 💬
                    {loading && <span className="ml-2 text-sm text-blue-500">(กำลังเชื่อมต่อและโหลดข้อมูล...)</span>}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>เชื่อมต่อผ่าน Supabase Realtime</p>
            </header>

            {/* ส่วนแสดงข้อความ (ใช้ overflow-y-auto เพื่อให้ข้อความเลื่อนได้) */}
            {/* แก้ไข No-inline-styles: ใช้ min-h-0 จาก Tailwind แทน */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0"> 
                {messages.length === 0 && !loading && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                        ยังไม่มีข้อความ เริ่มพิมพ์ข้อความแรกเลย!
                    </div>
                )}
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                {/* Ref สำหรับ Scroll ล่างสุด */}
                <div ref={messagesEndRef} />
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
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center"
                        disabled={input.trim() === '' || loading}
                    >
                        <Send className="w-5 h-5 mr-1" /> {/* ใช้ Lucide Icon */}
                        ส่ง
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatContainer;