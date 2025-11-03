import ChatContainer from '@/components/ChatContainer';

// Server Component หลัก (ใช้สำหรับการวางโครงสร้างหน้า)
export default async function Home() {
    return (
        // ใช้คลาส Tailwind CSS เพื่อจัดหน้าให้สวยงามและอยู่ตรงกลาง
        <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900">

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-6xl py-6">

                {/* ChatContainer เป็น Client Component จะถูกเรนเดอร์ในส่วนนี้
                  ส่วนที่เหลือของ Home() เป็น Server Component
                */}
                <ChatContainer />

            </main>

            {/* Footer ที่มีอยู่เดิมจากไฟล์ page.tsx */}
            <footer className="w-full max-w-6xl mt-6 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Next.js + Tailwind CSS + Vercel Boilerplate</p>
            </footer>

        </div>
    );
}