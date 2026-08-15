import os

filepath = r'c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\src\components\game\GameBoard.tsx'
if not os.path.exists(filepath):
    print("GameBoard.tsx not found!")
    exit(1)

content = open(filepath, encoding='utf-8').read()

# Let's find the unique mark
mark = 'socket.emit("purge-card", { roomId, cardId: inspectingCard.id });\n                                                setPurgesRemaining(prev => Math.max(0, prev - 1));\n                                                setInspectingCard(null);\n                                            }}'

idx = content.find(mark)
if idx == -1:
    print("Unique mark not found!")
    exit(1)

cutoff = idx + len(mark)
before_part = content[:cutoff]

# Now let's construct the rest of the file
after_part = """
                                            disabled={purgesRemaining <= 0}
                                            className={`w-full py-4 rounded-2xl font-bold text-sm tracking-[0.2em] uppercase border transition-all flex items-center justify-center gap-3 ${
                                                purgesRemaining > 0 
                                                ? 'bg-red-950/40 border-red-500/50 text-red-400 hover:bg-red-900/60 hover:border-red-400 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 cursor-pointer' 
                                                : 'bg-black/40 border-white/10 text-white/20 cursor-not-allowed'
                                            }`}
                                        >
                                            <Layers className="w-5 h-5 animate-pulse" />
                                            <span>PURGE ASSET ({purgesRemaining} LEFT)</span>
                                        </button>
                                        <span className="text-[10px] text-white/40 tracking-wider text-center font-mono">
                                            RECYCLES REDUNDANT CARD FOR NEW DRAW. MAX 3/CYCLE.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- HOW TO PLAY GUIDE MODAL (FULL SCREEN HUD CONSOLE) --- */}
            <AnimatePresence>
                {isGuideOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 1.02 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.02 }} 
                        className="fixed inset-0 z-[4000] bg-[#02050d]/98 backdrop-blur-3xl flex flex-col w-screen h-screen overflow-hidden text-left pt-24 pb-8 px-8 md:px-12 lg:px-20 pointer-events-auto border-0"
                    >
                        {/* ABSOLUTE CLOSE BUTTON - HIGHLY VISIBLE & PREVENTING CLIPPING */}
                        <button 
                            onClick={() => setIsGuideOpen(false)} 
                            className="absolute top-6 right-6 lg:top-8 lg:right-8 text-cyan-400 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] z-[4010] select-none"
                            title="Close Operations Manual"
                        >
                            <span className="text-2xl font-bold font-mono">✕</span>
                        </button>

                        {/* HEADER (FIXED TOP - PUSHED DOWN FOR SAFE AREA) */}
                        <div className="shrink-0 pb-6 border-b border-cyan-500/25 mb-8 flex items-center justify-between select-none">
                            <div className="flex items-center gap-3.5">
                                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.9)] shrink-0" />
                                <span className="text-cyan-400 font-display font-black tracking-[0.3em] uppercase text-xl lg:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                    System Operations Manual
                                </span>
                            </div>
                        </div>
                        
                        {/* TWO-COLUMN CONTENT GRID (SCROLLABLE SPLIT-PANEL) */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 overflow-y-auto custom-scrollbar pr-3 pb-4">
                            
                            {/* LEFT SIDE: INSTRUCTIONS & GOALS (5 COLUMNS) */}
                            <div className="lg:col-span-5 flex flex-col gap-12 text-left font-sans">
                                {/* STEP 1 */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4 select-none">
                                        <span className="text-xs font-bold font-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-3.5 py-1.5 rounded border border-cyan-500/30">PHASE 01</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Start the Project Setup
                                        </h3>
                                    </div>
                                    <p className="text-slate-200 leading-relaxed text-base lg:text-lg">
                                        Look at the HUD control panel on the far left—it will say <span className="text-cyan-400 font-extrabold uppercase">YOUR TURN / SETUP</span>. You are in the initial setup phase.
                                    </p>
                                    <ul className="mt-5 text-slate-300 text-sm lg:text-base leading-relaxed flex flex-col gap-4">
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>Click on the <span className="text-white font-bold underline decoration-cyan-500/40 underline-offset-4">SYSTEM OBJECTIVE</span> card deck on the left to draw and reveal the target AI system you are both building (e.g., <span className="text-cyan-400 italic font-bold">Fraud Detection System</span>).</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>Once the objective is revealed, draw cards from the <span className="text-white font-bold underline decoration-cyan-500/40 underline-offset-4">MAIN DECK</span> until your starting hand is full. (You can click the round chevron button at the bottom center of the screen to expand your Hand tray!).</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* STEP 2 */}
                                <div className="border-t border-white/5 pt-10">
                                    <div className="flex items-center gap-3 mb-4 select-none">
                                        <span className="text-xs font-bold font-mono tracking-widest text-red-500 bg-red-950/40 px-3.5 py-1.5 rounded border border-red-500/30">PHASE 02</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Spotting & Challenging the AI
                                        </h3>
                                    </div>
                                    <p className="text-slate-200 leading-relaxed text-base lg:text-lg">
                                        Once setup is complete and normal operations resume, the Vanguard AI will take its turn.
                                    </p>
                                    <ul className="mt-5 text-slate-300 text-sm lg:text-base leading-relaxed flex flex-col gap-4">
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>If the AI plays a card (like <span className="text-red-400 italic font-bold">Feedback Loop</span> out of sequence or without a matching objective), <span className="text-red-400 font-bold">a giant, glowing red alert banner will drop down at the top center of your screen</span>!</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>You will have a <span className="text-red-400 font-bold">5-second window</span> while that banner is flashing to click the big <span className="text-red-400 font-black">🚨 Raise Hand / Challenge!</span> button inside it.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>If you click it in time, you will catch the AI's bluff, discard its card, and record a successful <span className="text-red-400 font-bold">🛑 BLUFF CATCH</span> on your Science Timeline!</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* WINNING CONDITION */}
                                <div className="border-t border-white/5 pt-10">
                                    <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl tracking-wider mb-4 uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.25)] select-none">
                                        Winning Condition
                                    </h3>
                                    <p className="text-slate-200 leading-relaxed text-base lg:text-lg">
                                        Earn Intelligence Points (IP) by successfully integrating cards into the Shared Pipeline. Reach <span className="text-yellow-400 font-bold">100 Innovation Points (IP)</span> while completing and deploying the shared pipeline to achieve Singularity and win the game!
                                    </p>
                                </div>
                            </div>
                            
                            {/* RIGHT SIDE: PIPELINE CATEGORIES (7 COLUMNS) */}
                            <div className="lg:col-span-7 flex flex-col text-left font-sans">
                                <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl tracking-wider mb-4 uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.25)] select-none">
                                    ML Pipeline Stages
                                </h3>
                                <p className="text-slate-200 leading-relaxed text-base lg:text-lg mb-8">
                                    To build the AI system, you must play cards matching the sequential stages of the ML Pipeline:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-sm lg:text-base font-mono text-slate-300">
                                    {[
                                        { num: '1', title: 'DATA SOURCE', desc: 'Raw dataset streams (SQL, APIs, Transaction History).' },
                                        { num: '2', title: 'DATA CLEANING', desc: 'Imputing missing values, duplicates, outliers, class imbalances.' },
                                        { num: '3', title: 'EXPLORATORY ANALYSIS', desc: 'Correlation matrices & data distribution checks.' },
                                        { num: '4', title: 'FEATURE ENG.', desc: 'Vectorization, scaling, date expansions, PCA reduction.' },
                                        { num: '5', title: 'MODEL', desc: 'Core machine learning models (XGBoost, CNNs, Transformers, DQN).' },
                                        { num: '6', title: 'VALIDATION', desc: 'Robust pipeline validation checks (K-Fold, ROC AUC, F1).' },
                                        { num: '7', title: 'DEPLOYMENT', desc: 'Operational APIs (FastAPI, Flask, Cloud, Edge Devices).' },
                                        { num: '8', title: 'MONITORING', desc: 'Data drift detection, performance logging, retraining loops.' },
                                    ].map(stage => (
                                        <div key={stage.num} className="flex gap-5 bg-cyan-950/25 border border-cyan-500/20 rounded-[24px] p-6 lg:p-7 hover:border-cyan-500/40 hover:bg-cyan-900/15 transition-all duration-300 shadow-xl">
                                            <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 font-mono font-bold text-base shrink-0 border border-cyan-500/40">{stage.num}</span>
                                            <div>
                                                <div className="text-[14px] lg:text-[16px] font-extrabold tracking-widest text-cyan-400 uppercase">{stage.title}</div>
                                                <div className="text-[13px] lg:text-[14px] text-slate-300 leading-relaxed mt-2">{stage.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* FOOTER (FIXED BOTTOM) */}
                        <div className="shrink-0 pt-6 border-t border-cyan-500/20 mt-8 w-full select-none">
                            <button 
                                onClick={() => setIsGuideOpen(false)}
                                className="w-full py-5 bg-[#0a1226] border-2 border-cyan-500/50 hover:bg-cyan-900/40 hover:border-cyan-400 active:scale-99 text-cyan-300 hover:text-white font-bold tracking-[0.4em] rounded-[20px] transition-all cursor-pointer uppercase text-sm shadow-lg shadow-cyan-950/50"
                            >
                                CLOSE OPERATIONS MANUAL
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
 
         </div>
     );
 };
"""

open(filepath, 'w', encoding='utf-8').write(before_part + after_part)
print("Successfully restored and polished GameBoard.tsx!")
