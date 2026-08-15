import { Server } from "socket.io";
import { EngineerGameState, EngineerCard } from "../types";
import { assignWinnerIfNeeded } from "./winCondition";
import { drawCards } from "./gameLogic";
import {
    categoryToSlotKey,
    isValidPipelinePlay,
    integratePipelineCard,
    advanceActivePlayer,
    PipelineSlotKey,
} from "./engineer-mode/rules";

export const evaluatePendingPlay = (roomId: string, io: Server, rooms: Record<string, EngineerGameState>) => {
    const gameState = rooms[roomId];
    if (!gameState || !gameState.pendingPlay) return;
    const bot = gameState.players["bot"];
    if (!bot) return;

    const pPlay = gameState.pendingPlay;
    if (pPlay.playerId === "bot") return;

    // Only challenge genuinely invalid plays — never false-challenge valid moves.
    if (!pPlay.isValidSequence) {
        const reactionTime = 1500 + Math.random() * 1500;
        setTimeout(() => {
            const currentRoom = rooms[roomId];
            if (currentRoom && currentRoom.pendingPlay && currentRoom.pendingPlay.timestamp === pPlay.timestamp) {
                const targetPlayer = currentRoom.players[pPlay.playerId];
                if (!targetPlayer) return;

                currentRoom.logs.push(`🚨 CHALLENGE SUCCESSFUL! VANGUARD AI caught ${targetPlayer.name} playing out of sequence!`);
                currentRoom.discardPile.unshift(pPlay.card);
                advanceActivePlayer(currentRoom);
                currentRoom.phase = "DRAW";
                currentRoom.logs.push(`💥 ${targetPlayer.name}'s card is discarded and their turn immediately ends!`);
                currentRoom.history = currentRoom.history || [];
                currentRoom.history.push({
                    id: Math.random().toString(),
                    cardName: pPlay.card.name,
                    category: pPlay.card.category,
                    playerName: targetPlayer.name,
                    isValid: false,
                    timestamp: Date.now()
                });

                currentRoom.pendingPlay = null;
                io.to(roomId).emit("gameState-updated", currentRoom);

                if (currentRoom.activePlayerId === "bot") {
                    runBotTurn(roomId, io, rooms);
                }
            }
        }, reactionTime);
    }
};

export const runBotTurn = (roomId: string, io: Server, rooms: Record<string, EngineerGameState>) => {
    setTimeout(() => {
        const gameState = rooms[roomId];
        if (!gameState) return;

        const bot = gameState.players["bot"];
        if (!bot) return;
        if (gameState.pendingPlay) return;
        if (gameState.winner) return;

        if (gameState.phase === 'SETUP') {
            if (bot.hand.length < 4) {
                const drawn = drawCards(gameState.deck, 1);
                if (drawn.length > 0) {
                    bot.hand.push(drawn[0]);
                    gameState.logs.push(`VANGUARD AI drew a card from the deck.`);
                }
            }

            const playerIds = Object.keys(gameState.players);
            const allPlayersHave4 = playerIds.every(id => gameState.players[id].hand.length >= 4);

            if (!allPlayersHave4) {
                advanceActivePlayer(gameState);
            } else {
                gameState.phase = 'DRAW';
                advanceActivePlayer(gameState);
                gameState.logs.push(`⚠️ STARTUP COMPLETE. Normal operations resume. Operator's turn.`);
            }

            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);
            return;
        }

        const sp = gameState.sharedPipeline;

        interface PossiblePlay {
            card: EngineerCard;
            cardIndex: number;
            slotKey: PipelineSlotKey;
        }

        const possiblePlays: PossiblePlay[] = [];

        bot.hand.forEach((card, idx) => {
            const slotKey = categoryToSlotKey(card.category);
            if (!slotKey) return;

            if (isValidPipelinePlay(card, sp)) {
                possiblePlays.push({
                    card,
                    cardIndex: idx,
                    slotKey,
                });
            }
        });

        const alignedPlays = possiblePlays;

        const chosenPlay =
            alignedPlays.length > 0
                ? alignedPlays[Math.floor(Math.random() * alignedPlays.length)]
                : null;

        if (chosenPlay) {
            const { card, cardIndex, slotKey } = chosenPlay;
            bot.hand.splice(cardIndex, 1);

            const botPlayTimestamp = Date.now();
            gameState.pendingPlay = {
                card,
                playerId: "bot",
                slotKey,
                timestamp: botPlayTimestamp,
                isValidSequence: true,
            };

            gameState.logs.push(
                `⏳ VANGUARD AI played ${card.name}. Waiting for Operator challenge (5s)...`
            );

            if (gameState.deck.length > 0) {
                const drawn = gameState.deck.splice(0, 1);
                bot.hand.push(...drawn);
                gameState.logs.push(`VANGUARD AI replenished its hand asset.`);
            }

            advanceActivePlayer(gameState);
            gameState.phase = 'DRAW';

            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);

            setTimeout(() => {
                const currentRoom = rooms[roomId];
                if (currentRoom && currentRoom.pendingPlay && currentRoom.pendingPlay.timestamp === botPlayTimestamp) {
                    const pPlay = currentRoom.pendingPlay;
                    const botPlayer = currentRoom.players["bot"];

                    if (botPlayer) {
                        integratePipelineCard(
                            currentRoom,
                            "bot",
                            pPlay.card,
                            pPlay.slotKey as PipelineSlotKey
                        );
                        currentRoom.logs.push(`✅ VANGUARD AI's ${pPlay.card.name} was successfully integrated for +${pPlay.card.ipValue} IP.`);
                        currentRoom.history = currentRoom.history || [];
                        currentRoom.history.push({
                            id: Math.random().toString(),
                            cardName: pPlay.card.name,
                            category: pPlay.card.category,
                            playerName: "VANGUARD AI",
                            isValid: true,
                            timestamp: Date.now()
                        });
                        assignWinnerIfNeeded(currentRoom);
                    }
                    currentRoom.pendingPlay = null;
                    io.to(roomId).emit("gameState-updated", currentRoom);
                }
            }, 5000);

        } else {
            if (gameState.deck.length > 0) {
                const drawn = drawCards(gameState.deck, 1);
                if (drawn.length > 0) {
                    bot.hand.push(drawn[0]);
                    gameState.logs.push(
                        `VANGUARD AI had no valid pipeline card and drew from the databank.`
                    );
                }
            } else {
                gameState.logs.push(`VANGUARD AI had no valid play and the databank is empty.`);
            }

            advanceActivePlayer(gameState);
            gameState.phase = 'DRAW';

            rooms[roomId] = gameState;
            io.to(roomId).emit("gameState-updated", gameState);
        }

    }, 2000);
};
