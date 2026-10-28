import express, { Request, Response } from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { 
    EngineerGameState, EngineerPlayer, EngineerCard
} from "./src/types";
import { getInitialDeck, createObjectiveDeck, createMilestoneDeck, pairMilestoneFromDeck } from "./src/lib/engineer-mode/cards";
import {
    createEmptyPipeline,
    categoryToSlotKey,
    isValidPipelinePlay,
    integratePipelineCard,
    advanceActivePlayer,
    PipelineSlotKey,
} from "./src/lib/engineer-mode/rules";
import { drawCards, resolveCardEffect } from "./src/lib/gameLogic";
import { assignWinnerIfNeeded } from "./src/lib/winCondition";
import { runBotTurn, evaluatePendingPlay } from "./src/lib/aiBot";
import {
    createExportJob,
    getActiveExportJob,
    getExportJob,
    getJobsForScope,
    runExportJob,
} from "./src/lib/print/exportJobManager";
import { preflightPrintExportBrowser } from "./src/lib/print/exportPrintPdfBundle";

// Robust Fisher-Yates (Knuth) Shuffle for mathematically uniform card distributions
function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

const rooms: Record<string, EngineerGameState> = {};

app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("join-room", (data: { roomId: string, playerName: string }) => {
            const { roomId, playerName } = data || { roomId: "default" };
            if (!roomId) return;

            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId} as ${playerName}`);

            if (!rooms[roomId]) {
                const fullDeck = getInitialDeck();

                rooms[roomId] = {
                    id: roomId,
                    players: {},
                    deck: fullDeck,
                    objectiveDeck: createObjectiveDeck(),
                    milestoneDeck: createMilestoneDeck(),
                    discardPile: [],
                    communityPool: [],
                    sharedObjective: null,
                    pairedMilestone: null,
                    milestoneUnlocked: false,
                    sharedMilestone: null,
                    sharedPipeline: createEmptyPipeline(),
                    pendingPlay: null,
                    activePlayerId: socket.id,
                    phase: 'SETUP',
                    turnActionCount: 0,
                    winner: null,
                    logs: [],
                    history: []
                };

                // Inject Single Player AI Bot
                if (roomId.startsWith('SP-')) {
                    rooms[roomId].players["bot"] = {
                        id: "bot",
                        name: "VANGUARD AI",
                        ip: 0,
                        hand: [],
                        isBot: true,
                        pipeline: createEmptyPipeline()
                    };
                }

                console.log(`[TRACTION TRACKER] 🚀 NEW ENGINEER MATCH: ${roomId}`);
            }

            const gameState = rooms[roomId];

            // Backfill deck fields for rooms created before side-deck support
            if (!gameState.objectiveDeck) {
                gameState.objectiveDeck = createObjectiveDeck();
            }
            if (!gameState.milestoneDeck) {
                gameState.milestoneDeck = createMilestoneDeck();
            }
            if (gameState.pairedMilestone === undefined) {
                gameState.pairedMilestone = null;
            }
            if (gameState.milestoneUnlocked === undefined) {
                gameState.milestoneUnlocked = false;
            }

            // Handle Single Player Reconnections
            if (roomId.startsWith('SP-')) {
                const humanPlayerId = Object.keys(gameState.players).find(id => id !== 'bot');
                if (humanPlayerId && humanPlayerId !== socket.id) {
                    // Transfer state from old socket to new socket
                    gameState.players[socket.id] = { ...gameState.players[humanPlayerId], id: socket.id };
                    delete gameState.players[humanPlayerId];
                    if (gameState.activePlayerId === humanPlayerId) {
                        gameState.activePlayerId = socket.id;
                    }
                }
            }

            // Add player if not exists
            if (!gameState.players[socket.id]) {
                const newPlayer: EngineerPlayer = {
                    id: socket.id,
                    name: playerName || "Operator",
                    ip: 0,
                    hand: [],
                    pipeline: createEmptyPipeline()
                };

                gameState.players[socket.id] = newPlayer;
            }

            // If we are the first player, we are active
            if (Object.keys(gameState.players).length === 1 && !roomId.startsWith('SP-')) {
                 gameState.activePlayerId = socket.id;
            }

            io.to(roomId).emit("gameState-updated", gameState);
        });

        socket.on("draw-objective", (roomId: string) => {
            require('fs').appendFileSync('debug.log', `\n[${new Date().toISOString()}] draw-objective hit for room ${roomId} by ${socket.id}`);
            const gameState = rooms[roomId];
            if (!gameState) {
                require('fs').appendFileSync('debug.log', `\n  -> FAILED: Room not found`);
                return;
            }
            const player = gameState.players[socket.id];
            if (!player) {
                console.log(`[DRAW OBJECTIVE] FAILED: Player ${socket.id} not found in room ${roomId}`);
                return;
            }
            console.log(`[DRAW OBJECTIVE] SUCCESS: Player ${player.name} drawing objective in room ${roomId}`);

            try {
                require('fs').appendFileSync('debug.log', `\n  -> Player ${player.name} verified`);
                // Lock objective once any cards are picked/drawn from the main deck
                const isObjectiveLocked = gameState.phase !== 'SETUP' && Object.values(gameState.players).some(p => p.hand.length > 0);
                if (isObjectiveLocked) {
                    require('fs').appendFileSync('debug.log', `\n  -> FAILED: Objective Locked. Deck drawing has already started.`);
                    gameState.logs.push(`[SYSTEM ERROR] Objective is locked because cards have already been drawn from the deck!`);
                    io.to(roomId).emit("gameState-updated", gameState);
                    return;
                }

                require('fs').appendFileSync('debug.log', `\n  -> Drawing from objective deck (${gameState.objectiveDeck.length} left)...`);
                if (gameState.objectiveDeck.length === 0) {
                    gameState.logs.push(`[SYSTEM ERROR] Objective deck is empty!`);
                    io.to(roomId).emit("gameState-updated", gameState);
                    return;
                }

                // Return previously drawn cards to their decks during setup (before lock)
                if (gameState.sharedObjective && !isObjectiveLocked) {
                    gameState.objectiveDeck.push(gameState.sharedObjective);
                    if (gameState.pairedMilestone) {
                        gameState.milestoneDeck.push(gameState.pairedMilestone);
                        gameState.pairedMilestone = null;
                        gameState.milestoneUnlocked = false;
                        gameState.sharedMilestone = null;
                    }
                }

                const objectiveDeck = [...gameState.objectiveDeck];
                const newObjective = objectiveDeck.shift()!;
                gameState.objectiveDeck = objectiveDeck;

                const paired = pairMilestoneFromDeck(gameState.milestoneDeck, newObjective.name);
                gameState.milestoneDeck = paired.deck;
                gameState.sharedObjective = newObjective;
                gameState.sharedPipeline.objective = newObjective;
                gameState.pairedMilestone = paired.milestone;
                gameState.milestoneUnlocked = false;
                gameState.sharedMilestone = null;

                Object.values(gameState.players).forEach(p => {
                    if (p.pipeline) {
                        p.pipeline.objective = newObjective;
                    }
                });
                
                gameState.logs.push(`🎯 System Objective drawn: ${newObjective.name}`);
                if (gameState.pairedMilestone) {
                    gameState.logs.push(`🔒 Milestone paired (locked until Deployment): ${gameState.pairedMilestone.name}`);
                }
                require('fs').appendFileSync('debug.log', `\n  -> Emitting state updated`);
                io.to(roomId).emit("gameState-updated", gameState);
            } catch (error: any) {
                require('fs').appendFileSync('debug.log', `\n  -> EXCEPTION: ${error.message}\n${error.stack}`);
                console.error("[DRAW OBJECTIVE ERROR]", error);
                gameState.logs.push(`[CRASH] Backend Error: ${error.message}`);
                io.to(roomId).emit("gameState-updated", gameState);
            }
        });

        socket.on("shuffle-objective-deck", (roomId: string) => {
            const gameState = rooms[roomId];
            if (!gameState) return;
            const player = gameState.players[socket.id];
            if (!player) return;

            const isObjectiveLocked =
                gameState.phase !== "SETUP" &&
                Object.values(gameState.players).some((p) => p.hand.length > 0);
            if (isObjectiveLocked) return;

            if (gameState.sharedObjective) {
                gameState.objectiveDeck.push(gameState.sharedObjective);
                gameState.sharedObjective = null;
                gameState.sharedPipeline.objective = null;
                Object.values(gameState.players).forEach((p) => {
                    if (p.pipeline) p.pipeline.objective = null;
                });
            }
            if (gameState.pairedMilestone) {
                gameState.milestoneDeck.push(gameState.pairedMilestone);
                gameState.pairedMilestone = null;
                gameState.milestoneUnlocked = false;
                gameState.sharedMilestone = null;
            }

            gameState.objectiveDeck = shuffleArray(gameState.objectiveDeck);
            gameState.milestoneDeck = shuffleArray(gameState.milestoneDeck);
            gameState.logs.push(`${player.name} shuffled the Objective and Milestone decks.`);

            io.to(roomId).emit("gameState-updated", gameState);
        });

        socket.on("draw-card", (data: { roomId: string, source: 'deck' | number }) => {
            const { roomId, source } = data;
            const gameState = rooms[roomId];
            if (!gameState) return;
            const player = gameState.players[socket.id];
            if (!player || gameState.activePlayerId !== socket.id) return;
            if (gameState.phase !== 'DRAW' && gameState.phase !== 'SETUP') return;

            if (source === 'deck') {
                const drawn = drawCards(gameState.deck, 1);
                if (drawn.length > 0) {
                    player.hand.push(drawn[0]);
                    gameState.logs.push(`${player.name} drew a card from the databank.`);
                }
            } else if (typeof source === 'number' && gameState.communityPool[source]) {
                const card = gameState.communityPool[source];
                if (card) {
                    player.hand.push(card);
                    gameState.logs.push(`${player.name} drafted ${card.name} from the shared cache.`);
                    gameState.communityPool[source] = drawCards(gameState.deck, 1)[0] || null;
                }
            }

            if (gameState.phase === 'SETUP') {
                const playerIds = Object.keys(gameState.players);
                const allPlayersHave4 = playerIds.every(id => gameState.players[id].hand.length >= 4);

                if (!allPlayersHave4) {
                    // Pass turn to next player
                    const currentIndex = playerIds.indexOf(gameState.activePlayerId);
                    const nextIndex = (currentIndex + 1) % playerIds.length;
                    gameState.activePlayerId = playerIds[nextIndex];
                    
                    io.to(roomId).emit("gameState-updated", gameState);
                    
                    if (gameState.players[gameState.activePlayerId].isBot) {
                        runBotTurn(roomId, io, rooms);
                    }
                    return;
                } else {
                    // Everyone has 4 cards, setup is over!
                    gameState.phase = 'DRAW'; // Next phase is standard draw phase for the active player
                    gameState.logs.push(`⚠️ STARTUP COMPLETE. Normal operations resume.`);
                    io.to(roomId).emit("gameState-updated", gameState);
                    return;
                }
            }

            // In normal gameplay, drawing a card consumes your action and passes the turn
            advanceActivePlayer(gameState);
            gameState.phase = 'DRAW';
            
            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);
            
            if (gameState.activePlayerId === "bot") {
                runBotTurn(roomId, io, rooms);
            }
        });

        socket.on("play-card", (data: { roomId: string, cardId: string, slotKey?: string }) => {
            const { roomId, cardId } = data;
            let { slotKey } = data;
            let gameState = rooms[roomId];
            if (!gameState) return;
            if (gameState.winner) return;
            const player = gameState.players[socket.id];
            if (!player || gameState.activePlayerId !== socket.id) return;

            if (gameState.pendingPlay) {
                return; // Cannot play while a card is pending!
            }

            const cardIndex = player.hand.findIndex(c => c.id === cardId);
            if (cardIndex === -1) return;
            const card = player.hand[cardIndex];

            let isValid = true;
            let playedIntoPipeline = false;

            const pipelineSlot = categoryToSlotKey(card.category);
            if (pipelineSlot) {
                if (!slotKey) slotKey = pipelineSlot;
                playedIntoPipeline = true;
                isValid = isValidPipelinePlay(card, gameState.sharedPipeline);
            }

            // --- EXECUTE PLAY ---
            if (playedIntoPipeline && slotKey) {
                // Remove from hand immediately
                player.hand.splice(cardIndex, 1);
                
                // Put into pending play
                gameState.pendingPlay = {
                    card,
                    playerId: player.id,
                    slotKey,
                    timestamp: Date.now(),
                    isValidSequence: isValid
                };
                
                gameState.logs.push(`⏳ ${player.name} played ${card.name}. Waiting for challenges (5s)...`);
                
                rooms[roomId] = gameState;
                io.to(roomId).emit("gameState-updated", gameState);

                // Let the Vanguard AI evaluate the play and potentially challenge
                evaluatePendingPlay(roomId, io, rooms);

                // Set a timeout to resolve it if not challenged
                setTimeout(() => {
                    const currentRoom = rooms[roomId];
                    if (currentRoom && currentRoom.pendingPlay && currentRoom.pendingPlay.timestamp === gameState.pendingPlay?.timestamp) {
                        // Timer expired without challenge!
                        const pPlay = currentRoom.pendingPlay;
                        const p = currentRoom.players[pPlay.playerId];

                        integratePipelineCard(
                            currentRoom,
                            pPlay.playerId,
                            pPlay.card,
                            pPlay.slotKey as PipelineSlotKey
                        );

                        if (p) {
                            currentRoom.logs.push(`✅ ${p.name}'s ${pPlay.card.name} was successfully integrated for +${pPlay.card.ipValue} IP.`);
                            currentRoom.history = currentRoom.history || [];
                            currentRoom.history.push({
                                id: Math.random().toString(),
                                cardName: pPlay.card.name,
                                category: pPlay.card.category,
                                playerName: p.name,
                                isValid: true,
                                timestamp: Date.now()
                            });
                        }
                        currentRoom.pendingPlay = null;

                        // Auto-draw to replenish hand up to 7 if needed
                        if (p && p.hand.length < 7 && currentRoom.deck.length > 0) {
                            const autoDrawn = drawCards(currentRoom.deck, 1);
                            if (autoDrawn.length > 0) {
                                p.hand.push(autoDrawn[0]);
                                currentRoom.logs.push(`System auto-replenished ${p.name}'s hand.`);
                            }
                        }
                        
                        io.to(roomId).emit("gameState-updated", currentRoom);
                        
                        if (currentRoom.activePlayerId === "bot") {
                            runBotTurn(roomId, io, rooms);
                        }
                    }
                }, 5000);
                return; // Do not broadcast yet, already done above
            } else {
                // Play as immediate effect (Challenge / Milestone / Ethics)
                player.hand.splice(cardIndex, 1);
                gameState.logs.push(`${player.name} deployed ${card.name}.`);
                gameState = resolveCardEffect(card, gameState, socket.id);
                gameState.discardPile.unshift(card);
                
                // Log valid immediate play in science history
                gameState.history = gameState.history || [];
                gameState.history.push({
                    id: Math.random().toString(),
                    cardName: card.name,
                    category: card.category,
                    playerName: player.name,
                    isValid: true,
                    timestamp: Date.now()
                });
            }

            assignWinnerIfNeeded(gameState);

            // Auto-draw to replenish hand up to 7 if needed
            if (player.hand.length < 7 && gameState.deck.length > 0) {
                const autoDrawn = drawCards(gameState.deck, 1);
                if (autoDrawn.length > 0) {
                    player.hand.push(autoDrawn[0]);
                    gameState.logs.push(`System auto-replenished ${player.name}'s hand.`);
                }
            }

            // Removed auto pass turn here so players can play multiple events or end cycle manually

            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);
            
            if (gameState.activePlayerId === "bot") {
                runBotTurn(roomId, io, rooms);
            }
        });

        socket.on("challenge-play", (roomId: string) => {
            let gameState = rooms[roomId];
            if (!gameState || !gameState.pendingPlay) return;
            const challenger = gameState.players[socket.id];
            if (!challenger) return;

            const pPlay = gameState.pendingPlay;
            const targetPlayer = gameState.players[pPlay.playerId];
            if (!targetPlayer) return;

            // Cannot challenge your own play
            if (pPlay.playerId === socket.id) return;

            if (!pPlay.isValidSequence) {
                // Successful Challenge!
                gameState.logs.push(`🚨 CHALLENGE SUCCESSFUL! ${challenger.name} caught ${targetPlayer.name} playing an invalid or logically irrelevant card (${pPlay.card.name})!`);
                
                // 1. Discard the card permanently
                gameState.discardPile.unshift(pPlay.card);
                
                // 2. Turn immediately ends
                advanceActivePlayer(gameState);
                gameState.phase = 'DRAW';

                gameState.logs.push(`❌ ${targetPlayer.name}'s card is discarded and their turn immediately ends!`);

                // Log wrong move in history thread
                gameState.history = gameState.history || [];
                gameState.history.push({
                    id: Math.random().toString(),
                    cardName: pPlay.card.name,
                    category: pPlay.card.category,
                    playerName: targetPlayer.name,
                    isValid: false,
                    timestamp: Date.now()
                });
            } else {
                // Failed challenge — challenger loses next turn; card integrates
                gameState.logs.push(`❌ FAILED CHALLENGE! ${targetPlayer.name}'s play was perfectly valid!`);
                challenger.skipNextTurn = true;
                gameState.logs.push(`⚠️ ${challenger.name} loses their next turn for a false challenge!`);

                integratePipelineCard(
                    gameState,
                    pPlay.playerId,
                    pPlay.card,
                    pPlay.slotKey as PipelineSlotKey
                );
                gameState.logs.push(`✅ ${targetPlayer.name}'s ${pPlay.card.name} was successfully integrated for +${pPlay.card.ipValue} IP.`);

                // Log valid move in history thread
                gameState.history = gameState.history || [];
                gameState.history.push({
                    id: Math.random().toString(),
                    cardName: pPlay.card.name,
                    category: pPlay.card.category,
                    playerName: targetPlayer.name,
                    isValid: true,
                    timestamp: Date.now()
                });
            }

            gameState.pendingPlay = null;

            // Turn does not automatically pass if the challenge fails.
            // The active player keeps their turn!

            // Auto-draw for target player if they played successfully
            if (pPlay.isValidSequence && targetPlayer.hand.length < 7 && gameState.deck.length > 0) {
                const autoDrawn = drawCards(gameState.deck, 1);
                if (autoDrawn.length > 0) {
                    targetPlayer.hand.push(autoDrawn[0]);
                    gameState.logs.push(`System auto-replenished ${targetPlayer.name}'s hand.`);
                }
            }

            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);

            if (gameState.activePlayerId === "bot") {
                runBotTurn(roomId, io, rooms);
            }
        });

        socket.on("end-turn", (roomId: string) => {
            const gameState = rooms[roomId];
            if (!gameState) return;
            if (gameState.activePlayerId !== socket.id) return;

            const playerIds = Object.keys(gameState.players);
            if (playerIds.length === 0) return;
            
            const activePlayer = gameState.players[socket.id];
            if (activePlayer) {
                gameState.logs.push(`${activePlayer.name} manually ended their cycle.`);
            }

            advanceActivePlayer(gameState);
            gameState.phase = 'DRAW';

            io.to(roomId).emit("gameState-updated", gameState);

            if (gameState.activePlayerId === "bot") {
                runBotTurn(roomId, io, rooms);
            }
        });

        socket.on("shuffle-deck", (roomId: string) => {
            const gameState = rooms[roomId];
            if (!gameState) return;
            const player = gameState.players[socket.id];
            if (!player) return;

            // Shuffle only the remaining deck (not distributed cards) using Fisher-Yates
            gameState.deck = shuffleArray(gameState.deck);
            gameState.logs.push(`${player.name} shuffled the remaining deck.`);

            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);
        });

        socket.on("purge-card", (data: { roomId: string, cardId: string }) => {
            const { roomId, cardId } = data;
            const gameState = rooms[roomId];
            if (!gameState) return;
            const player = gameState.players[socket.id];
            if (!player || gameState.activePlayerId !== socket.id) return;

            const cardIndex = player.hand.findIndex(c => c.id === cardId);
            if (cardIndex === -1) return;
            const card = player.hand[cardIndex];

            // Remove from hand, push to discard
            player.hand.splice(cardIndex, 1);
            gameState.discardPile.unshift(card);

            // Draw a new card from deck
            const drawn = drawCards(gameState.deck, 1);
            if (drawn.length > 0) {
                player.hand.push(drawn[0]);
                gameState.logs.push(`♻️ ${player.name} purged ${card.name} and recycled a new asset.`);
            } else {
                gameState.logs.push(`♻️ ${player.name} purged ${card.name}, but the databank is dry!`);
            }

            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);
        });

        socket.on("request-state", (roomId: string) => {
            if (rooms[roomId]) {
                assignWinnerIfNeeded(rooms[roomId]);
                socket.emit("gameState-updated", rooms[roomId]);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            for (const [roomId, gameState] of Object.entries(rooms)) {
                if (gameState.players[socket.id]) {
                    delete gameState.players[socket.id];
                    if (Object.keys(gameState.players).length === 0) {
                        delete rooms[roomId];
                    } else {
                        // Pass turn if disconnected player was active
                        if (gameState.activePlayerId === socket.id) {
                             const playerIds = Object.keys(gameState.players);
                             if (playerIds.length > 0) {
                                 gameState.activePlayerId = playerIds[0];
                             }
                        }
                        io.to(roomId).emit("gameState-updated", gameState);
                    }
                }
            }
        });
    });

    server.post("/api/print/export/start", async (req: Request, res: Response) => {
        if (getActiveExportJob()) {
            res.status(429).json({
                error: "An export is already running. Please wait for it to finish.",
            });
            return;
        }

        try {
            const browser = await preflightPrintExportBrowser();
            await browser.close();
        } catch {
            res.status(503).json({
                error:
                    "PDF export browser is not installed. In the ai-quest folder run: npm run setup:print — then try again.",
            });
            return;
        }

        const scope = req.query.scope === "decks" ? "decks" : "all";
        const jobList = getJobsForScope(scope);
        const job = createExportJob(scope);
        const baseUrl = `http://${hostname}:${port}`;

        runExportJob(job, baseUrl, jobList).catch((err) => {
            console.error("[print-export] background job failed:", err);
        });

        res.json({
            jobId: job.id,
            total: jobList.length,
            scope,
        });
    });

    server.get("/api/print/export/status/:jobId", (req: Request, res: Response) => {
        const job = getExportJob(String(req.params.jobId));
        if (!job) {
            res.status(404).json({ error: "Export job not found." });
            return;
        }

        res.json({
            jobId: job.id,
            status: job.status,
            progress: job.progress,
            error: job.error,
            downloadReady: job.status === "done",
        });
    });

    server.get("/api/print/export/download/:jobId", (req: Request, res: Response) => {
        const job = getExportJob(String(req.params.jobId));
        if (!job || job.status !== "done" || !job.filePath) {
            res.status(404).json({ error: "Export file is not ready yet." });
            return;
        }

        const zipName =
            job.scope === "decks" ? "ai-quest-card-decks.zip" : "ai-quest-print-pack.zip";

        res.download(job.filePath, zipName, (err) => {
            if (err) {
                console.error("[print-export] download error:", err);
            }
        });
    });

    server.use((req: Request, res: Response) => {
        return handle(req, res);
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
        console.log(`> Socket.io server running`);
    });
});
