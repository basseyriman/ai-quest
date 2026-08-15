import os

filepath = r'c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\src\components\game\GameBoard.tsx'
if not os.path.exists(filepath):
    print("GameBoard.tsx not found!")
    exit(1)

content = open(filepath, encoding='utf-8').read()

# Locate the whole guide modal block starting from {isGuideOpen && (
# up to the end of the header

guide_start = '                {isGuideOpen && (\n                    <motion.div \n                        initial={{ opacity: 0, scale: 1.02 }} \n                        animate={{ opacity: 1, scale: 1 }} \n                        exit={{ opacity: 0, scale: 1.02 }} \n                        className="fixed inset-0 z-[4000] bg-[#02050d]/98 backdrop-blur-3xl flex flex-col w-screen h-screen overflow-hidden text-left pt-24 pb-8 px-8 md:px-12 lg:px-20 pointer-events-auto border-0"\n                    >'

guide_start_idx = content.find(guide_start)
if guide_start_idx == -1:
    # Try finding with double quotes or slight variations
    print("Guide start not found!")
    exit(1)

print("Found guide start at index:", guide_start_idx)

# Let's find the end of the header (which ends with the header div close)
# The header section has header comment
header_comment = '{/* HEADER (FIXED TOP - PUSHED DOWN FOR SAFE AREA) */}'
header_idx = content.find(header_comment, guide_start_idx)
if header_idx == -1:
    print("Header comment not found!")
    exit(1)

header_close_idx = content.find('</div>', header_idx)
if header_close_idx == -1:
    print("Header close tag not found!")
    exit(1)

end_of_header_idx = header_close_idx + len('</div>')

# Now let's print out what we found
print("Context of old block:")
print(repr(content[guide_start_idx:end_of_header_idx]))

# Let's replace the block from guide_start to end_of_header_idx with the clean header that includes the close button inside it
new_header_block = """                {isGuideOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 1.02 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.02 }} 
                        className="fixed inset-0 z-[4000] bg-[#02050d]/98 backdrop-blur-3xl flex flex-col w-screen h-screen overflow-hidden text-left pt-24 pb-8 px-8 md:px-12 lg:px-20 pointer-events-auto border-0"
                    >
                        {/* HEADER (FIXED TOP - PUSHED DOWN FOR SAFE AREA) */}
                        <div className="shrink-0 pb-6 border-b border-cyan-500/25 mb-8 flex items-center justify-between select-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="flex items-center gap-3.5" style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.9)] shrink-0" />
                                <span className="text-cyan-400 font-display font-black tracking-[0.3em] uppercase text-xl lg:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                    System Operations Manual
                                </span>
                            </div>
                            
                            {/* CLOSE EXIT BUTTON - PERFECTLY ALIGNED INSIDE THE HEADER CELL */}
                            <button 
                                onClick={() => setIsGuideOpen(false)} 
                                className="hover:scale-105 active:scale-95 transition-all select-none"
                                style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    minWidth: '44px', 
                                    minHeight: '44px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    backgroundColor: '#050c18', 
                                    border: '2px solid rgba(0, 240, 255, 0.6)', 
                                    borderRadius: '12px', 
                                    color: '#00f0ff', 
                                    cursor: 'pointer', 
                                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
                                }}
                                title="Close Operations Manual"
                            >
                                <svg 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ width: '20px', height: '20px', display: 'block' }}
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={3.5} 
                                        d="M6 18L18 6M6 6l12 12" 
                                    />
                                </svg>
                            </button>
                        </div>"""

new_content = content[:guide_start_idx] + new_header_block + content[end_of_header_idx:]
open(filepath, 'w', encoding='utf-8').write(new_content)
print("Successfully aligned close button inside the header cell!")
