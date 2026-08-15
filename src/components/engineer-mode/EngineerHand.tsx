"use client";

import { EngineerCard as CardType } from "@/types/engineer-mode";
import { EngineerCard } from "./EngineerCard";

interface EngineerHandProps {
    hand: CardType[];
    onPlayCard: (cardId: string) => void;
    isPlayPhase: boolean;
}

export const EngineerHand = ({ hand, onPlayCard, isPlayPhase }: EngineerHandProps) => {
    return (
        <div className="w-full relative mt-8">
            <div className="absolute -top-8 left-4 text-xs font-mono text-cyan-500/50 tracking-widest uppercase">
                YOUR HAND ({hand.length})
            </div>
            
            <div className="flex flex-wrap items-center justify-center group/hand" style={{ paddingLeft: '40px' }}>
                {hand.map((card, idx) => (
                    <div 
                        key={card.id} 
                        className="relative group transition-transform duration-300 hover:-translate-y-4 hover:z-50"
                        style={{
                            marginLeft: idx === 0 ? '0' : '-60px',
                            zIndex: idx
                        }}
                    >
                        <EngineerCard 
                            card={card} 
                            onClick={isPlayPhase ? () => onPlayCard(card.id) : undefined}
                            isPlayable={isPlayPhase}
                        />
                        {isPlayPhase && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                PLAY
                            </div>
                        )}
                    </div>
                ))}
                
                {hand.length === 0 && (
                    <div className="w-full text-center py-8 text-white/30 font-mono">
                        Hand is empty.
                    </div>
                )}
            </div>
        </div>
    );
};
