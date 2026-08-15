"use client";

import { useEffect, useRef } from 'react';

export const NebulaBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Deep Base */}
            <div className="absolute inset-0 bg-[#020205]" />

            {/* Colorful Nebulas */}
            <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[120px] animate-[pulse_10s_infinite]" />
            <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[100px] animate-[pulse_15s_infinite]" />
            <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[150px] animate-[pulse_12s_infinite]" />

            {/* Stars */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
    );
};
