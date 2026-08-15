import os

filepath = r'c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\src\components\game\GameBoard.tsx'
if not os.path.exists(filepath):
    print("GameBoard.tsx not found!")
    exit(1)

content = open(filepath, encoding='utf-8').read()

# Replace Phase 1 title section
phase1_old = """                                    <div className="flex items-center gap-3 mb-4 select-none">
                                        <span className="text-xs font-bold font-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-3.5 py-1.5 rounded border border-cyan-500/30">PHASE 01</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Start the Project Setup
                                        </h3>
                                    </div>"""

phase1_new = """                                    <div className="flex items-center gap-4 mb-4 select-none" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span className="text-xs font-bold font-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-3.5 py-1.5 rounded border border-cyan-500/30" style={{ marginRight: '8px' }}>PHASE 01</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Start the Project Setup
                                        </h3>
                                    </div>"""

content = content.replace(phase1_old, phase1_new)

# Replace Phase 2 title section
phase2_old = """                                    <div className="flex items-center gap-3 mb-4 select-none">
                                        <span className="text-xs font-bold font-mono tracking-widest text-red-500 bg-red-950/40 px-3.5 py-1.5 rounded border border-red-500/30">PHASE 02</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Spotting & Challenging the AI
                                        </h3>
                                    </div>"""

phase2_new = """                                    <div className="flex items-center gap-4 mb-4 select-none" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span className="text-xs font-bold font-mono tracking-widest text-red-500 bg-red-950/40 px-3.5 py-1.5 rounded border border-red-500/30" style={{ marginRight: '8px' }}>PHASE 02</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Spotting & Challenging the AI
                                        </h3>
                                    </div>"""

content = content.replace(phase2_old, phase2_new)

# Replace Pipeline stages section
stages_old = """                                    ].map(stage => (
                                        <div key={stage.num} className="flex gap-5 bg-cyan-950/25 border border-cyan-500/20 rounded-[24px] p-6 lg:p-7 hover:border-cyan-500/40 hover:bg-cyan-900/15 transition-all duration-300 shadow-xl">
                                            <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 font-mono font-bold text-base shrink-0 border border-cyan-500/40">{stage.num}</span>
                                            <div>
                                                <div className="text-[14px] lg:text-[16px] font-extrabold tracking-widest text-cyan-400 uppercase">{stage.title}</div>
                                                <div className="text-[13px] lg:text-[14px] text-slate-300 leading-relaxed mt-2">{stage.desc}</div>
                                            </div>
                                        </div>
                                    ))"""

stages_new = """                                    ].map(stage => (
                                        <div key={stage.num} className="flex gap-5 bg-cyan-950/25 border border-cyan-500/20 rounded-[24px] p-6 lg:p-7 hover:border-cyan-500/40 hover:bg-cyan-900/15 transition-all duration-300 shadow-xl" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                            <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 font-mono font-bold text-base shrink-0 border border-cyan-500/40" style={{ minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>{stage.num}</span>
                                            <div style={{ flex: 1 }}>
                                                <div className="text-[14px] lg:text-[16px] font-extrabold tracking-widest text-cyan-400 uppercase">{stage.title}</div>
                                                <div className="text-[13px] lg:text-[14px] text-slate-300 leading-relaxed mt-2">{stage.desc}</div>
                                            </div>
                                        </div>
                                    ))"""

content = content.replace(stages_old, stages_new)

# Re-position close button as fixed so it stays cleanly positioned at top-right
close_button_old = """                        {/* ABSOLUTE CLOSE BUTTON - HIGHLY VISIBLE & PREVENTING CLIPPING */}
                        <button 
                            onClick={() => setIsGuideOpen(false)} 
                            className="absolute top-6 right-6 lg:top-8 lg:right-8 text-cyan-400 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] z-[4010] select-none"
                            title="Close Operations Manual"
                        >"""

close_button_new = """                        {/* FIXED CLOSE BUTTON - HIGHLY VISIBLE & PREVENTING CLIPPING */}
                        <button 
                            onClick={() => setIsGuideOpen(false)} 
                            className="text-cyan-400 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] z-[4010] select-none"
                            style={{ position: 'fixed', top: '24px', right: '24px' }}
                            title="Close Operations Manual"
                        >"""

content = content.replace(close_button_old, close_button_new)

open(filepath, 'w', encoding='utf-8').write(content)
print("Successfully ran spacing surgery on GameBoard.tsx!")
