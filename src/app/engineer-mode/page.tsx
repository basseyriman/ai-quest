"use client";

import { EngineerBoard } from "@/components/engineer-mode/EngineerBoard";

export default function EngineerModePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden relative font-sans text-white">
            {/* Subtle table texture overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
            
            <div className="z-10 w-full h-full relative">
                <EngineerBoard />
            </div>
            
        </main>
    );
}
