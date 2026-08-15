import { useState, useCallback } from "react";
import { EngineerGameState, EngineerPlayer, EngineerCard, EngineerGamePhase } from "@/types/engineer-mode";
import { getInitialDeck, createObjectiveDeck, createMilestoneDeck, pairMilestoneFromDeck } from "@/lib/engineer-mode/cards";
import {
  createEmptyPipeline,
  categoryToSlotKey,
  isValidPipelinePlay,
  integratePipelineCard,
  resolveWinner,
  PipelineSlotKey,
} from "@/lib/engineer-mode/rules";

export function useEngineerGame() {
  const [gameState, setGameState] = useState<EngineerGameState | null>(null);

  const initGame = useCallback(() => {
    const deck = getInitialDeck();
    const p1Hand = deck.splice(0, 7);
    const p2Hand = deck.splice(0, 7);
    const empty = createEmptyPipeline();

    const initialPlayers: Record<string, EngineerPlayer> = {
      p1: { id: "p1", name: "Player 1", ip: 0, hand: p1Hand, pipeline: { ...empty } },
      p2: { id: "p2", name: "AI Bot", ip: 0, hand: p2Hand, pipeline: { ...empty }, isBot: true },
    };

    setGameState({
      id: "local-game",
      players: initialPlayers,
      activePlayerId: "p1",
      phase: "DRAW",
      sharedObjective: null,
      sharedMilestone: null,
      pairedMilestone: null,
      milestoneUnlocked: false,
      sharedPipeline: createEmptyPipeline(),
      pendingPlay: null,
      deck,
      objectiveDeck: createObjectiveDeck(),
      milestoneDeck: createMilestoneDeck(),
      discardPile: [],
      communityPool: [],
      turnActionCount: 0,
      winner: null,
      logs: ["Game initialized. System Objective is waiting to be drawn."],
      history: [],
    });
  }, []);

  const drawCard = () => {
    setGameState((prev) => {
      if (!prev || prev.phase !== "DRAW") return prev;

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop();
      if (!drawnCard) return prev;

      const newPlayers = { ...prev.players };
      const currentPlayer = newPlayers[prev.activePlayerId];
      currentPlayer.hand.push(drawnCard);

      return {
        ...prev,
        deck: newDeck,
        players: newPlayers,
        phase: "PLAY",
        logs: [...prev.logs, `${currentPlayer.name} drew a card.`],
      };
    });
  };

  const drawObjective = () => {
    setGameState((prev) => {
      if (!prev || prev.sharedObjective) return prev;

      const sharedObjective = prev.objectiveDeck[0]
        ? { ...prev.objectiveDeck[0] }
        : null;
      if (!sharedObjective) return prev;

      const objectiveDeck = prev.objectiveDeck.slice(1);
      const paired = pairMilestoneFromDeck(prev.milestoneDeck, sharedObjective.name);
      const newPlayers = { ...prev.players };
      newPlayers.p1.pipeline.objective = sharedObjective;
      if (newPlayers.p2) newPlayers.p2.pipeline.objective = sharedObjective;

      const pipeline = { ...prev.sharedPipeline, objective: sharedObjective };

      return {
        ...prev,
        sharedObjective,
        pairedMilestone: paired.milestone,
        milestoneUnlocked: false,
        sharedMilestone: null,
        objectiveDeck,
        milestoneDeck: paired.deck,
        sharedPipeline: pipeline,
        players: newPlayers,
        logs: [
          ...prev.logs,
          `System Objective drawn: ${sharedObjective.name}`,
          ...(paired.milestone
            ? [`Milestone paired (locked until Deployment): ${paired.milestone.name}`]
            : []),
        ],
      };
    });
  };

  const playCard = (cardId: string) => {
    setGameState((prev) => {
      if (!prev || prev.phase !== "PLAY" || prev.winner) return prev;

      const newPlayers = { ...prev.players };
      const currentPlayer = newPlayers[prev.activePlayerId];
      const cardIndex = currentPlayer.hand.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;

      const card = currentPlayer.hand[cardIndex];
      const slotKey = categoryToSlotKey(card.category);

      if (slotKey) {
        if (!isValidPipelinePlay(card, prev.sharedPipeline)) {
          currentPlayer.hand.splice(cardIndex, 1);
          return {
            ...prev,
            players: newPlayers,
            discardPile: [...prev.discardPile, card],
            phase: "END",
            logs: [
              ...prev.logs,
              `${currentPlayer.name} played ${card.name} out of order! Card rejected. Turn ends.`,
            ],
          };
        }

        currentPlayer.hand.splice(cardIndex, 1);
        const nextState: EngineerGameState = {
          ...prev,
          players: newPlayers,
          logs: [...prev.logs, `${currentPlayer.name} played ${card.name} (+${card.ipValue} IP).`],
        };
        integratePipelineCard(nextState, prev.activePlayerId, card, slotKey as PipelineSlotKey);
        resolveWinner(nextState);
        return { ...nextState, phase: nextState.winner ? "END" : prev.phase };
      }

      if (card.category === "MILESTONE") {
        currentPlayer.ip += card.ipValue;
      }

      currentPlayer.hand.splice(cardIndex, 1);
      return {
        ...prev,
        players: newPlayers,
        logs: [...prev.logs, `${currentPlayer.name} played ${card.name}.`],
      };
    });
  };

  const endTurn = () => {
    setGameState((prev) => {
      if (!prev) return prev;

      const nextPlayerId = prev.activePlayerId === "p1" ? "p2" : "p1";
      return {
        ...prev,
        activePlayerId: nextPlayerId,
        phase: "DRAW",
        turnActionCount: 0,
        logs: [...prev.logs, `--- Turn ended. ${prev.players[nextPlayerId].name}'s turn. ---`],
      };
    });
  };

  const aiPlayTurn = useCallback(() => {
    if (!gameState || gameState.players[gameState.activePlayerId].isBot !== true) return;

    setTimeout(() => {
      if (gameState.phase === "DRAW") {
        drawCard();
      } else if (gameState.phase === "PLAY") {
        const bot = gameState.players[gameState.activePlayerId];
        const validCards = bot.hand.filter((c) => {
          const key = categoryToSlotKey(c.category);
          if (!key) return false;
          return isValidPipelinePlay(c, gameState.sharedPipeline);
        });

        if (validCards.length > 0) {
          playCard(validCards[0].id);
        } else if (gameState.deck.length > 0) {
          drawCard();
        } else {
          endTurn();
        }
      } else if (gameState.phase === "END") {
        endTurn();
      }
    }, 1000);
  }, [gameState]);

  return {
    gameState,
    initGame,
    drawCard,
    drawObjective,
    playCard,
    endTurn,
    aiPlayTurn,
  };
}
