"use client";

import { EngineerCard } from '@/types';
import { motion } from 'framer-motion';
import { DigitalEngineerCardFace } from './DigitalEngineerCardFace';

interface CardProps {
    card: EngineerCard;
    onClick?: () => void;
    onInspect?: () => void;
    className?: string;
}

export const Card = ({ card, onClick, onInspect, className = "w-64 h-[350px] sm:w-[280px] sm:h-[390px]" }: CardProps) => {
    return (
        <motion.div
            className={`relative rounded-[20px] overflow-hidden cursor-pointer ${className} group block shrink-0`}
            onClick={onClick}
            onContextMenu={(e) => {
                if (onInspect) {
                    e.preventDefault();
                    onInspect();
                }
            }}
        >
            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-full rounded-[20px] transition-all duration-300 relative overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.65)]"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30 mix-blend-overlay rounded-[20px]" />
                <DigitalEngineerCardFace card={card} className="z-10" />
            </motion.div>
        </motion.div>
    );
};
