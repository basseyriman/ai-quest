import { EngineerCard, EngineerGameState, EngineerPlayer } from "../types";

export const drawCards = (deck: EngineerCard[], count: number): EngineerCard[] => {
    return deck.splice(0, count);
};

export const resolveCardEffect = (
    card: EngineerCard,
    gameState: EngineerGameState,
    playerId: string
): EngineerGameState => {
    // For Engineer Mode MVP, we mainly handle building the pipeline.
    // The actual "play" logic is handled in the server socket event.
    // But if a CHALLENGE or ETHICS card has an immediate effect:
    
    if (card.category === 'CHALLENGE') {
        const oppId = Object.keys(gameState.players).find(id => id !== playerId);
        if (oppId) {
            gameState.players[oppId].ip = Math.max(0, gameState.players[oppId].ip - (card.ipValue || 10));
            gameState.logs.push(`Challenge ${card.name} reduced ${gameState.players[oppId].name}'s IP by ${card.ipValue || 10}`);
        }
    } else if (card.category === 'ETHICS' || card.category === 'MILESTONE') {
        gameState.players[playerId].ip += card.ipValue || 0;
        gameState.logs.push(`${gameState.players[playerId].name} applied ${card.name} for +${card.ipValue} IP.`);
    }

    return gameState;
};
