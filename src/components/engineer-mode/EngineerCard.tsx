"use client";

import { EngineerCard as EngineerCardType } from '@/types/engineer-mode';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { DigitalEngineerCardFace } from '@/components/game/DigitalEngineerCardFace';

interface EngineerCardProps {
    card: EngineerCardType | null;
    onClick?: () => void;
    onInspect?: () => void;
    className?: string;
    placeholder?: string;
    isPlayable?: boolean;
}

export const EngineerCard = ({ card, onClick, onInspect, className = "", placeholder, isPlayable = false }: EngineerCardProps) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const rotateX = useMotionTemplate`${mouseY}deg`;
    const rotateY = useMotionTemplate`${mouseX}deg`;

    if (!card) {
        return (
            <div className={`w-32 h-[180px] sm:w-[200px] sm:h-[280px] rounded-2xl border border-white/5 shadow-inner flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm ${className}`}>
                <span className="text-white/20 text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase text-center px-4">{placeholder}</span>
            </div>
        );
    }

    return (
        <motion.div
            style={{ perspective: 1200 }}
            className={`relative w-32 h-[180px] sm:w-[200px] sm:h-[280px] rounded-2xl ${onClick ? 'cursor-pointer' : ''} ${className} group block shrink-0`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            onContextMenu={(e) => {
                if (onInspect) {
                    e.preventDefault();
                    onInspect();
                }
            }}
        >
            <motion.div
                whileHover={onClick ? { scale: 1.05 } : {}}
                whileTap={onClick ? { scale: 0.98 } : {}}
                style={{
                    rotateX: useMotionTemplate`calc(${rotateX} * -0.15)`,
                    rotateY: useMotionTemplate`calc(${rotateY} * 0.15)`,
                    transformStyle: "preserve-3d",
                    boxShadow: isPlayable
                        ? "0 0 20px 5px rgba(34, 211, 238, 0.45)"
                        : "0 10px 20px -5px rgba(0, 0, 0, 0.55)",
                }}
                className="w-full h-full rounded-2xl overflow-hidden relative"
            >
                <DigitalEngineerCardFace card={card} />
            </motion.div>
        </motion.div>
    );
};
