// utils/supabase/client.ts

import { createClient } from '@supabase/supabase-js';

// ตรวจสอบว่า environment variables ถูกตั้งค่าหรือไม่
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // ควรตั้งค่า error handling ที่เหมาะสมกว่านี้ใน production
  console.error("Supabase Environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing.");
}

// สร้าง Supabase Client สำหรับฝั่ง Client Component
// ใช้ singleton pattern เพื่อให้แน่ใจว่าสร้าง client เพียงครั้งเดียว
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const createClientComponentClient = () => {
    if (!supabaseClient) {
        // As long as the env vars are available (as checked above), create the client
        if (supabaseUrl && supabaseAnonKey) {
            supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        } else {
            // หาก env vars หายไป ให้ส่ง null หรือ throw error เพื่อหยุดการทำงาน
            throw new Error("Cannot create Supabase client: missing environment variables.");
        }
    }
    return supabaseClient;
};

// **Note:** ในการใช้งานจริง, ควรตั้งค่าไฟล์ `.env.local` ก่อนรันโปรเจกต์
// ตัวอย่าง:
// NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
// NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"