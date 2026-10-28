"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Trophy,
  Lock,
  Unlock,
  RotateCcw,
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Music,
  Eye,
  Layers,
  ArrowRight,
  Cpu,
  HelpCircle,
} from "lucide-react";
import { soundEngine } from "@/lib/soundEngine";
import { EngineerCard, EngineerPipeline } from "@/types/engineer-mode";
import {
  getInitialDeck,
  createObjectiveDeck,
  createMilestoneDeck,
  pairMilestoneFromDeck,
  RETAIL_ENGINEER_DECK_SIZE,
  FULL_GAME_SET_SIZE,
} from "@/lib/engineer-mode/cards";
import {
  PIPELINE_STAGES,
  PIPELINE_SLOT_KEYS,
  createEmptyPipeline,
  categoryToSlotKey,
  getPipelineStageIndex,
  getPipelineHeadStageIndex,
  isDuplicateInPipeline,
  isStageProgressionValid,
  isCardCompatibleWithObjective,
  getObjectiveCompatibility,
  isValidPipelinePlay,
  getTrackerPosition,
  PipelineSlotKey,
} from "@/lib/engineer-mode/rules";
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";
import { DigitalEngineerCardFace } from "./DigitalEngineerCardFace";
import { CARD_BACK_LOGO_SRC } from "@/components/print/PrintCardBack";
import { VictoryCeremony } from "./VictoryCeremony";

interface ArenaPlayer {
  id: string;
  name: string;
  isBot: boolean;
  ip: number;
  hand: EngineerCard[];
  skipNextTurn: boolean;
  avatarColor: string;
}

interface PendingAudit {
  playerId: string;
  playerName: string;
  card: EngineerCard;
  slotKey: PipelineSlotKey;
  isValid: boolean;
  invalidReason?: "DUPLICATE" | "INVALID_STAGE" | "DOMAIN_MISMATCH";
}

interface MoveLogItem {
  id: string;
  playerName: string;
  cardName: string;
  category: string;
  ipEarned: number;
  status: "VALID" | "CHALLENGED" | "FALSE_CHALLENGE";
  note?: string;
}

const STAGE_IP_MAP: Record<string, number> = {
  "DATA COLLECTION": ENGINEER_CATEGORY_IP["DATA COLLECTION"],
  "DATA PREPARATION": ENGINEER_CATEGORY_IP["DATA PREPARATION"],
  "FEATURE ENGINEERING": ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"],
  "MODEL SELECTION": ENGINEER_CATEGORY_IP["MODEL SELECTION"],
  "MODEL TRAINING": ENGINEER_CATEGORY_IP["MODEL TRAINING"],
  "MODEL EVALUATION": ENGINEER_CATEGORY_IP["MODEL EVALUATION"],
  DEPLOYMENT: ENGINEER_CATEGORY_IP.DEPLOYMENT,
};

export function OnlineManualGameArena() {
  // Game configuration
  const [startingHandSize, setStartingHandSize] = useState<number>(5);
  const [aiCount, setAiCount] = useState<number>(1);
  const [showHints, setShowHints] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState<boolean>(false);
  const [mobileShowCompat, setMobileShowCompat] = useState<boolean>(false);

  const mobileStageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Core game state
  const [players, setPlayers] = useState<ArenaPlayer[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number>(0);
  const [deck, setDeck] = useState<EngineerCard[]>([]);
  const [objectiveDeck, setObjectiveDeck] = useState<EngineerCard[]>([]);
  const [milestoneDeck, setMilestoneDeck] = useState<EngineerCard[]>([]);
  const [discardPile, setDiscardPile] = useState<EngineerCard[]>([]);
  const [sharedObjective, setSharedObjective] = useState<EngineerCard | null>(null);
  const [pairedMilestone, setPairedMilestone] = useState<EngineerCard | null>(null);
  const [milestoneUnlocked, setMilestoneUnlocked] = useState<boolean>(false);
  const [pipeline, setPipeline] = useState<EngineerPipeline>(createEmptyPipeline());

  // Turn & Challenge state
  const [cardsPlayedThisTurn, setCardsPlayedThisTurn] = useState<number>(0);
  const [pendingAudit, setPendingAudit] = useState<PendingAudit | null>(null);
  const [auditCountdown, setAuditCountdown] = useState<number>(4);
  const [bannerAlert, setBannerAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    text: string;
  } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveLogItem[]>([]);
  const [winner, setWinner] = useState<ArenaPlayer | null>(null);
  const [tieBreakNote, setTieBreakNote] = useState<string | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Modals
  const [inspectingCard, setInspectingCard] = useState<EngineerCard | null>(null);
  const [selectedStageModal, setSelectedStageModal] = useState<PipelineSlotKey | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  const auditTimerRef = useRef<NodeJS.Timeout | null>(null);
  const aiTurnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop ambient music on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopMusic();
    };
  }, []);

  const toggleMusic = useCallback(() => {
    if (musicEnabled) {
      soundEngine.stopMusic();
      setMusicEnabled(false);
    } else {
      soundEngine.startMusic();
      setMusicEnabled(true);
    }
  }, [musicEnabled]);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!next && musicEnabled) {
      soundEngine.stopMusic();
      setMusicEnabled(false);
    } else if (next) {
      soundEngine.playSfx("click");
    }
  }, [soundEnabled, musicEnabled]);

  // Rich tactical sound effects dispatcher
  const triggerSfx = useCallback(
    (
      type:
        | "deal"
        | "draw"
        | "valid_play"
        | "stage_advance"
        | "challenge_alert"
        | "challenge_win"
        | "challenge_fail"
        | "victory"
        | "click"
    ) => {
      if (!soundEnabled) return;
      soundEngine.playSfx(type);
    },
    [soundEnabled]
  );

  // Legacy tone helper mapped to rich soundEngine SFX
  const playTone = useCallback(
    (freq: number, type: OscillatorType = "sine", _duration = 0.14) => {
      if (!soundEnabled) return;
      if (freq >= 800) {
        soundEngine.playSfx("victory");
      } else if (freq >= 650 && type === "square") {
        soundEngine.playSfx("challenge_win");
      } else if (freq <= 220) {
        soundEngine.playSfx("challenge_fail");
      } else if (freq === 300 && type === "sawtooth") {
        soundEngine.playSfx("challenge_alert");
      } else if (freq === 520) {
        soundEngine.playSfx("deal");
      } else if (freq === 580) {
        soundEngine.playSfx("valid_play");
      } else if (freq === 420) {
        soundEngine.playSfx("draw");
      } else {
        soundEngine.playSfx("click");
      }
    },
    [soundEnabled]
  );

  const showTempAlert = useCallback(
    (type: "success" | "error" | "warning" | "info", text: string) => {
      setBannerAlert({ type, text });
      setTimeout(() => {
        setBannerAlert((prev) => (prev?.text === text ? null : prev));
      }, 4200);
    },
    []
  );

  // Helper: Draw a card from the deck that prioritizes valid progression & Objective compatibility
  const drawSmartCardFromDeck = useCallback(
    (
      deckPool: EngineerCard[],
      currentPipeline: EngineerPipeline,
      existingHand: EngineerCard[]
    ): { drawn: EngineerCard | null; remainingDeck: EngineerCard[] } => {
      if (deckPool.length === 0) return { drawn: null, remainingDeck: [] };
      const nextDeck = [...deckPool];
      const hasValidInHand = existingHand.some((c) =>
        isValidPipelinePlay(c, currentPipeline)
      );

      // If player has no valid move in hand (or 70% of the time), find a valid compatible card for current or next stage
      if (!hasValidInHand || Math.random() < 0.7) {
        const validIdx = nextDeck.findIndex(
          (c) =>
            isValidPipelinePlay(c, currentPipeline) &&
            !existingHand.some((h) => h.name === c.name)
        );
        if (validIdx !== -1) {
          const [picked] = nextDeck.splice(validIdx, 1);
          return { drawn: picked, remainingDeck: nextDeck };
        }
      }

      const picked = nextDeck.shift() || null;
      return { drawn: picked, remainingDeck: nextDeck };
    },
    []
  );

  // Helper: Deal an opening hand that guarantees at least 1 compatible Stage 1 (Data Collection) card
  // for the active System Objective, plus a Stage 2 (Data Preparation) card.
  const dealSmartOpeningHand = useCallback(
    (
      deckPool: EngineerCard[],
      handSize: number,
      objective: EngineerCard | null
    ): EngineerCard[] => {
      const hand: EngineerCard[] = [];

      // 1. Guarantee 1 compatible DATA COLLECTION card for the active System Objective
      const compatDataIdx = deckPool.findIndex(
        (c) =>
          c.category === "DATA COLLECTION" &&
          isCardCompatibleWithObjective(c, objective)
      );
      if (compatDataIdx !== -1) {
        hand.push(deckPool.splice(compatDataIdx, 1)[0]);
      }

      // 2. Guarantee 1 DATA PREPARATION card so the pipeline can smoothly advance to Stage 2
      if (hand.length < handSize) {
        const prepIdx = deckPool.findIndex(
          (c) => c.category === "DATA PREPARATION"
        );
        if (prepIdx !== -1) {
          hand.push(deckPool.splice(prepIdx, 1)[0]);
        }
      }

      // 3. Fill remaining slots from the shuffled deck
      while (hand.length < handSize && deckPool.length > 0) {
        hand.push(deckPool.shift()!);
      }

      return hand;
    },
    []
  );

  // Initialize a fresh game following Official Rules v1.0 Setup (Steps 1–8)
  const startNewGame = useCallback(
    (customHandSize = startingHandSize, customAiCount = aiCount) => {
      if (auditTimerRef.current) clearTimeout(auditTimerRef.current);
      if (aiTurnTimerRef.current) clearTimeout(aiTurnTimerRef.current);

      // Step 1-4: Shuffle Objective Deck, Draw 1 Objective face-up, Pair matching Milestone beside it
      const objDeck = createObjectiveDeck();
      const msDeck = createMilestoneDeck();
      const firstObj = objDeck.shift() || null;
      const paired = firstObj
        ? pairMilestoneFromDeck(msDeck, firstObj.name)
        : { milestone: null, deck: msDeck };

      // Step 5-8: Shuffle 210-card Engineer Deck & deal equal starting hands
      const engDeck = getInitialDeck();
      const botDefs = [
        { id: "bot-1", name: "VANGUARD AI", color: "#f43f5e" },
        { id: "bot-2", name: "NEXUS AI", color: "#a855f7" },
        { id: "bot-3", name: "SYNAPSE AI", color: "#f59e0b" },
      ].slice(0, customAiCount);

      const newPlayers: ArenaPlayer[] = [
        {
          id: "human",
          name: "YOU (LEAD ENGINEER)",
          isBot: false,
          ip: 0,
          hand: dealSmartOpeningHand(engDeck, customHandSize, firstObj),
          skipNextTurn: false,
          avatarColor: "#22d3ee",
        },
        ...botDefs.map((b) => ({
          id: b.id,
          name: b.name,
          isBot: true,
          ip: 0,
          hand: dealSmartOpeningHand(engDeck, customHandSize, firstObj),
          skipNextTurn: false,
          avatarColor: b.color,
        })),
      ];

      const initPipeline = createEmptyPipeline();
      initPipeline.objective = firstObj;

      setPlayers(newPlayers);
      setActivePlayerIdx(0);
      setDeck(engDeck);
      setObjectiveDeck(objDeck);
      setMilestoneDeck(paired.deck);
      setDiscardPile([]);
      setSharedObjective(firstObj);
      setPairedMilestone(paired.milestone);
      setMilestoneUnlocked(false);
      setPipeline(initPipeline);
      setCardsPlayedThisTurn(0);
      setPendingAudit(null);
      setWinner(null);
      setTieBreakNote(null);
      setShowVictoryModal(false);
      setMoveHistory([]);
      setLogs([
        `🎯 Setup Complete (Official Rules v1.0): Objective "${firstObj?.name}" drawn.`,
        `🔒 Paired Milestone "${paired.milestone?.name}" (+${ENGINEER_CATEGORY_IP.MILESTONE} IP) locked until Deployment.`,
        `🃏 Dealt ${customHandSize} Engineer cards to each player. Start the pipeline with a DATA COLLECTION card matching "${firstObj?.name}"!`,
      ]);
      playTone(520, "sine", 0.18);
    },
    [startingHandSize, aiCount, playTone, dealSmartOpeningHand]
  );

  useEffect(() => {
    startNewGame(5, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap Objective before any cards are played in the pipeline
  const cycleObjective = () => {
    const head = getPipelineHeadStageIndex(pipeline);
    if (head !== -1 || objectiveDeck.length === 0) return;

    const nextObjDeck = [...objectiveDeck];
    if (sharedObjective) nextObjDeck.push(sharedObjective);
    const nextObj = nextObjDeck.shift()!;

    let nextMsDeck = [...milestoneDeck];
    if (pairedMilestone) nextMsDeck.push(pairedMilestone);
    const paired = pairMilestoneFromDeck(nextMsDeck, nextObj.name);

    // Ensure every player's opening hand has at least 1 compatible Data Collection card for the new Objective
    const nextDeckPool = [...deck];
    const updatedPlayers = players.map((p) => {
      const hasCompatData = p.hand.some(
        (c) =>
          c.category === "DATA COLLECTION" &&
          isCardCompatibleWithObjective(c, nextObj)
      );
      if (hasCompatData) return p;

      const swapIdxInDeck = nextDeckPool.findIndex(
        (c) =>
          c.category === "DATA COLLECTION" &&
          isCardCompatibleWithObjective(c, nextObj)
      );
      if (swapIdxInDeck === -1) return p;

      const [compatCard] = nextDeckPool.splice(swapIdxInDeck, 1);
      const replaceIdxInHand = p.hand.findIndex(
        (c) => c.category === "DATA COLLECTION"
      );
      const nextHand = [...p.hand];
      if (replaceIdxInHand !== -1) {
        const [returnedCard] = nextHand.splice(replaceIdxInHand, 1, compatCard);
        nextDeckPool.push(returnedCard);
      } else {
        const [returnedCard] = nextHand.splice(0, 1, compatCard);
        nextDeckPool.push(returnedCard);
      }
      return { ...p, hand: nextHand };
    });

    setDeck(nextDeckPool);
    setPlayers(updatedPlayers);
    setObjectiveDeck(nextObjDeck);
    setMilestoneDeck(paired.deck);
    setSharedObjective(nextObj);
    setPairedMilestone(paired.milestone);
    setPipeline((prev) => ({ ...prev, objective: nextObj }));
    setLogs((prev) => [
      ...prev,
      `🔄 Objective switched to "${nextObj.name}" (Milestone: "${paired.milestone?.name}").`,
    ]);
    playTone(600, "triangle", 0.12);
  };

  // Advance to the next player's turn (handling skipNextTurn from failed challenges)
  const advanceTurnFrom = useCallback(
    (currentIdx: number, updatedPlayers: ArenaPlayer[], currentLogs: string[]) => {
      if (updatedPlayers.length === 0) return { nextIdx: 0, players: updatedPlayers, logs: currentLogs };
      let idx = currentIdx;
      const nextPlayers = updatedPlayers.map((p) => ({ ...p }));
      const nextLogs = [...currentLogs];

      for (let step = 0; step < nextPlayers.length; step++) {
        idx = (idx + 1) % nextPlayers.length;
        if (nextPlayers[idx].skipNextTurn) {
          nextPlayers[idx].skipNextTurn = false;
          nextLogs.push(
            `⏭️ ${nextPlayers[idx].name} loses their turn due to a previous false challenge!`
          );
          continue;
        }
        break;
      }

      return { nextIdx: idx, players: nextPlayers, logs: nextLogs };
    },
    []
  );

  // Check and resolve winner upon Deployment completion (Official Manual Page 5)
  const completeDeploymentAndResolveWinner = useCallback(
    (
      deployerId: string,
      updatedPlayers: ArenaPlayer[],
      currentPairedMilestone: EngineerCard | null,
      currentLogs: string[]
    ) => {
      const nextPlayers = updatedPlayers.map((p) => ({ ...p }));
      const deployer = nextPlayers.find((p) => p.id === deployerId);
      const nextLogs = [...currentLogs];

      if (deployer && currentPairedMilestone) {
        deployer.ip += ENGINEER_CATEGORY_IP.MILESTONE;
        setMilestoneUnlocked(true);
        nextLogs.push(
          `🏆 DEPLOYMENT COMPLETE! ${deployer.name} unlocks Milestone "${currentPairedMilestone.name}" for +${ENGINEER_CATEGORY_IP.MILESTONE} IP!`
        );
      }

      // Find highest IP
      let maxIp = -1;
      let contenders: ArenaPlayer[] = [];
      for (const p of nextPlayers) {
        if (p.ip > maxIp) {
          maxIp = p.ip;
          contenders = [p];
        } else if (p.ip === maxIp) {
          contenders.push(p);
        }
      }

      let winningPlayer = contenders[0];
      let tieMsg: string | null = null;

      // Official Manual Tie-breaker: reveal remaining hands; highest stage card wins
      if (contenders.length > 1) {
        let bestStage = -1;
        let bestCardName = "None";
        for (const cPlayer of contenders) {
          for (const card of cPlayer.hand) {
            const stIdx = getPipelineStageIndex(card.category);
            if (stIdx > bestStage) {
              bestStage = stIdx;
              winningPlayer = cPlayer;
              bestCardName = `${card.name} (${card.category})`;
            }
          }
        }
        tieMsg = `Tie-breaker at ${maxIp} IP resolved by highest stage card in hand: ${winningPlayer.name} held ${bestCardName}!`;
        nextLogs.push(`⚖️ ${tieMsg}`);
      }

      nextLogs.push(
        `🎉 ${winningPlayer.name} WINS THE AI QUEST WITH ${winningPlayer.ip} IP!`
      );

      setPlayers(nextPlayers);
      setLogs(nextLogs);
      setWinner(winningPlayer);
      setTieBreakNote(tieMsg);
      setShowVictoryModal(true);
      playTone(880, "sine", 0.35);
    },
    [playTone]
  );

  // Commit a pending card into the pipeline (when unchallenged or challenge failed)
  const commitPendingCard = useCallback(
    (audit: PendingAudit, falseChallengerId?: string) => {
      if (auditTimerRef.current) clearTimeout(auditTimerRef.current);

      const nextPipeline: EngineerPipeline = {
        ...pipeline,
        [audit.slotKey]: [...pipeline[audit.slotKey], audit.card],
      };

      let nextPlayers = players.map((p) => {
        if (p.id === audit.playerId) {
          return { ...p, ip: p.ip + (audit.card.ipValue || 0) };
        }
        if (falseChallengerId && p.id === falseChallengerId) {
          return { ...p, skipNextTurn: true };
        }
        return p;
      });

      const nextLogs = [...logs];
      if (falseChallengerId) {
        const challenger = nextPlayers.find((p) => p.id === falseChallengerId);
        nextLogs.push(
          `❌ CHALLENGE FAILED! ${audit.playerName}'s "${audit.card.name}" was a valid play! ${challenger?.name} loses their next turn.`
        );
        showTempAlert(
          "warning",
          `False Challenge! "${audit.card.name}" is valid — you lose your next turn.`
        );
      } else {
        nextLogs.push(
          `✅ ${audit.playerName} integrated "${audit.card.name}" into ${audit.card.category} (+${audit.card.ipValue} IP).`
        );
      }

      setMoveHistory((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          playerName: audit.playerName,
          cardName: audit.card.name,
          category: audit.card.category,
          ipEarned: audit.card.ipValue || 0,
          status: falseChallengerId ? "FALSE_CHALLENGE" : "VALID",
        },
        ...prev,
      ]);

      setPipeline(nextPipeline);
      setPendingAudit(null);

      // Check if Deployment was just completed!
      if (audit.slotKey === "deployment") {
        completeDeploymentAndResolveWinner(
          audit.playerId,
          nextPlayers,
          pairedMilestone,
          nextLogs
        );
        return;
      }

      // If it was a Bot's play, after committing 1-2 cards, bot draws 1 card and ends turn
      const actingPlayer = nextPlayers.find((p) => p.id === audit.playerId);
      if (actingPlayer?.isBot) {
        const { drawn, remainingDeck } = drawSmartCardFromDeck(
          deck,
          nextPipeline,
          actingPlayer.hand
        );
        if (drawn) {
          nextPlayers = nextPlayers.map((p) =>
            p.id === actingPlayer.id ? { ...p, hand: [...p.hand, drawn] } : p
          );
          nextLogs.push(
            `📥 ${actingPlayer.name} drew 1 card from the Engineer Deck and ended their turn.`
          );
        }
        setDeck(remainingDeck);
        const advanced = advanceTurnFrom(activePlayerIdx, nextPlayers, nextLogs);
        setPlayers(advanced.players);
        setActivePlayerIdx(advanced.nextIdx);
        setLogs(advanced.logs);
        setCardsPlayedThisTurn(0);
      } else {
        setPlayers(nextPlayers);
        setLogs(nextLogs);
      }
    },
    [
      pipeline,
      players,
      logs,
      deck,
      activePlayerIdx,
      pairedMilestone,
      advanceTurnFrom,
      completeDeploymentAndResolveWinner,
      showTempAlert,
      drawSmartCardFromDeck,
    ]
  );

  // Handle Player clicking "CALL CHALLENGE!" on an AI's pending play
  const handlePlayerChallengeAi = () => {
    if (!pendingAudit) return;
    if (auditTimerRef.current) clearTimeout(auditTimerRef.current);

    if (!pendingAudit.isValid) {
      // Successful Challenge! Card rejected, no IP awarded, AI turn immediately ends!
      playTone(680, "square", 0.25);
      const reasonText =
        pendingAudit.invalidReason === "DUPLICATE"
          ? "Duplicate Card already in pipeline"
          : pendingAudit.invalidReason === "DOMAIN_MISMATCH"
          ? `Domain Mismatch — incompatible with "${sharedObjective?.name}"`
          : "Invalid Pipeline Stage order";

      const nextLogs = [
        ...logs,
        `🚨 CHALLENGE SUCCESSFUL! You caught ${pendingAudit.playerName} playing "${pendingAudit.card.name}" (${reasonText})! Card rejected, 0 IP awarded, turn ends!`,
      ];

      setMoveHistory((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          playerName: pendingAudit.playerName,
          cardName: pendingAudit.card.name,
          category: pendingAudit.card.category,
          ipEarned: 0,
          status: "CHALLENGED",
          note: reasonText,
        },
        ...prev,
      ]);

      setDiscardPile((prev) => [pendingAudit.card, ...prev]);
      setPendingAudit(null);
      showTempAlert(
        "success",
        `🚨 CHALLENGE SUCCESSFUL! Caught ${pendingAudit.playerName} (${reasonText}) — Card Rejected!`
      );

      const advanced = advanceTurnFrom(activePlayerIdx, players, nextLogs);
      setPlayers(advanced.players);
      setActivePlayerIdx(advanced.nextIdx);
      setLogs(advanced.logs);
      setCardsPlayedThisTurn(0);
    } else {
      // Failed Challenge! Challenger loses next turn, card integrates!
      playTone(180, "sawtooth", 0.3);
      commitPendingCard(pendingAudit, "human");
    }
  };

  // Countdown effect when an AI play is pending challenge audit
  useEffect(() => {
    if (!pendingAudit) return;
    setAuditCountdown(4);

    const interval = setInterval(() => {
      setAuditCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 900);

    auditTimerRef.current = setTimeout(() => {
      commitPendingCard(pendingAudit);
    }, 3600);

    return () => {
      clearInterval(interval);
      if (auditTimerRef.current) clearTimeout(auditTimerRef.current);
    };
  }, [pendingAudit, commitPendingCard]);

  // Human Player plays a card from hand (Step 1 & Step 2 of Turn Structure)
  const handleHumanPlayCard = (card: EngineerCard) => {
    if (winner || pendingAudit) return;
    const currentPlayer = players[activePlayerIdx];
    if (!currentPlayer || currentPlayer.isBot) return;

    const slotKey = categoryToSlotKey(card.category);
    if (!slotKey) return;

    const isDup = isDuplicateInPipeline(pipeline, card);
    const isStageOk = isStageProgressionValid(card, pipeline);
    const isDomainOk = isCardCompatibleWithObjective(card, sharedObjective);
    const isValid = isValidPipelinePlay(card, pipeline);

    // Remove card from player's hand
    const nextPlayers = players.map((p, idx) =>
      idx === activePlayerIdx
        ? { ...p, hand: p.hand.filter((c) => c.id !== card.id) }
        : p
    );

    if (!isValid) {
      // AI Rival immediately calls "CHALLENGE!" per Official Manual Rules (Page 4)
      playTone(160, "sawtooth", 0.3);
      const challengerBot = nextPlayers.find((p) => p.isBot)?.name || "VANGUARD AI";
      const reason = isDup
        ? `Duplicate Card Challenge ("${card.name}" is already in the pipeline)`
        : !isStageOk
        ? `Invalid Move Challenge ("${card.category}" cannot be played into the current stage)`
        : !isDomainOk
        ? `Domain Mismatch Challenge ("${card.name}" cannot be used for "${sharedObjective?.name}")`
        : `Invalid Move Challenge`;

      const nextLogs = [
        ...logs,
        `🚨 "${challengerBot}" CALLED CHALLENGE! Your play "${card.name}" was rejected (${reason}). 0 IP awarded & your turn immediately ends!`,
      ];

      setMoveHistory((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          playerName: currentPlayer.name,
          cardName: card.name,
          category: card.category,
          ipEarned: 0,
          status: "CHALLENGED",
          note: reason,
        },
        ...prev,
      ]);

      setDiscardPile((prev) => [card, ...prev]);
      showTempAlert(
        "error",
        `🚨 ${challengerBot} called "CHALLENGE!" — ${reason}. Card rejected & turn ends!`
      );

      const advanced = advanceTurnFrom(activePlayerIdx, nextPlayers, nextLogs);
      setPlayers(advanced.players);
      setActivePlayerIdx(advanced.nextIdx);
      setLogs(advanced.logs);
      setCardsPlayedThisTurn(0);
      return;
    }

    // Valid play! Integrate into pipeline & award IP immediately (Flexible Pipeline / Stage Advancement)
    const prevHead = getPipelineHeadStageIndex(pipeline);
    const newStageIdx = getPipelineStageIndex(card.category);
    const advancedStage = prevHead !== -1 && newStageIdx === prevHead + 1;
    triggerSfx(advancedStage ? "stage_advance" : "valid_play");

    const nextPipeline: EngineerPipeline = {
      ...pipeline,
      [slotKey]: [...pipeline[slotKey], card],
    };

    const scoredPlayers = nextPlayers.map((p, idx) =>
      idx === activePlayerIdx ? { ...p, ip: p.ip + (card.ipValue || 0) } : p
    );

    const nextLogs = [
      ...logs,
      `✅ You played "${card.name}" into ${card.category} (+${card.ipValue} IP)${
        advancedStage ? " — Pipeline advanced to next stage!" : "!"
      }`,
    ];

    setMoveHistory((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        playerName: currentPlayer.name,
        cardName: card.name,
        category: card.category,
        ipEarned: card.ipValue || 0,
        status: "VALID",
      },
      ...prev,
    ]);

    setPipeline(nextPipeline);
    setCardsPlayedThisTurn((prev) => prev + 1);

    // Check if Deployment was just played!
    if (slotKey === "deployment") {
      completeDeploymentAndResolveWinner(
        currentPlayer.id,
        scoredPlayers,
        pairedMilestone,
        nextLogs
      );
      return;
    }

    setPlayers(scoredPlayers);
    setLogs(nextLogs);
  };

  // Human Player clicks "Draw 1 Card & End Turn" (Step 3 & Step 4 of Official Manual Turn Structure)
  const handleHumanDrawAndEndTurn = () => {
    if (winner || pendingAudit) return;
    const currentPlayer = players[activePlayerIdx];
    if (!currentPlayer || currentPlayer.isBot) return;

    playTone(420, "triangle", 0.12);
    let nextPlayers = [...players];
    const nextLogs = [...logs];

    const { drawn, remainingDeck } = drawSmartCardFromDeck(
      deck,
      pipeline,
      currentPlayer.hand
    );

    if (drawn) {
      nextPlayers = nextPlayers.map((p, idx) =>
        idx === activePlayerIdx ? { ...p, hand: [...p.hand, drawn] } : p
      );
      nextLogs.push(
        `📥 You drew "${drawn.name}" (${drawn.category}) and ended your turn.`
      );
    } else {
      nextLogs.push(`⏭️ Draw Deck is empty — you ended your turn.`);
    }

    setDeck(remainingDeck);
    const advanced = advanceTurnFrom(activePlayerIdx, nextPlayers, nextLogs);
    setPlayers(advanced.players);
    setActivePlayerIdx(advanced.nextIdx);
    setLogs(advanced.logs);
    setCardsPlayedThisTurn(0);
  };

  // AI Bot Turn Execution
  useEffect(() => {
    if (winner || pendingAudit || players.length === 0) return;
    const currentPlayer = players[activePlayerIdx];
    if (!currentPlayer || !currentPlayer.isBot) return;

    aiTurnTimerRef.current = setTimeout(() => {
      // Find valid plays in AI's hand
      const validCards = currentPlayer.hand.filter((c) =>
        isValidPipelinePlay(c, pipeline)
      );

      if (validCards.length > 0) {
        // Prefer continuing current stage first to farm IP, or advancing stage
        const head = getPipelineHeadStageIndex(pipeline);
        const sameStageCards = validCards.filter(
          (c) => getPipelineStageIndex(c.category) === head
        );
        const chosen =
          sameStageCards.length > 0 ? sameStageCards[0] : validCards[0];
        const slotKey = categoryToSlotKey(chosen.category)!;

        // Remove from AI hand & open 4s Challenge Audit window
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIdx
              ? { ...p, hand: p.hand.filter((c) => c.id !== chosen.id) }
              : p
          )
        );
        playTone(480, "sine", 0.12);
        setPendingAudit({
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          card: chosen,
          slotKey,
          isValid: true,
        });
        return;
      }

      // If AI has no valid play, 28% chance it attempts a sneaky invalid/duplicate/wrong-domain play that the player can CHALLENGE!
      const bluffCandidates = currentPlayer.hand.filter((c) =>
        Boolean(categoryToSlotKey(c.category))
      );
      if (bluffCandidates.length > 0 && Math.random() < 0.28) {
        const bluffCard = bluffCandidates[0];
        const slotKey = categoryToSlotKey(bluffCard.category)!;
        const isDup = isDuplicateInPipeline(pipeline, bluffCard);
        const isStageOk = isStageProgressionValid(bluffCard, pipeline);
        const isDomainOk = isCardCompatibleWithObjective(bluffCard, sharedObjective);

        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIdx
              ? { ...p, hand: p.hand.filter((c) => c.id !== bluffCard.id) }
              : p
          )
        );
        playTone(300, "sawtooth", 0.15);
        setPendingAudit({
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          card: bluffCard,
          slotKey,
          isValid: false,
          invalidReason: isDup
            ? "DUPLICATE"
            : isStageOk && !isDomainOk
            ? "DOMAIN_MISMATCH"
            : "INVALID_STAGE",
        });
        return;
      }

      // Otherwise AI draws 1 card and ends turn (Step 3 & Step 4)
      let nextPlayers = [...players];
      const nextLogs = [...logs];
      const { drawn, remainingDeck } = drawSmartCardFromDeck(
        deck,
        pipeline,
        currentPlayer.hand
      );

      if (drawn) {
        nextPlayers = nextPlayers.map((p, idx) =>
          idx === activePlayerIdx ? { ...p, hand: [...p.hand, drawn] } : p
        );
        nextLogs.push(
          `📥 ${currentPlayer.name} had no valid pipeline play, drew 1 card, and ended their turn.`
        );
      } else {
        nextLogs.push(
          `⏭️ ${currentPlayer.name} had no valid play and ended their turn.`
        );
      }

      setDeck(remainingDeck);
      const advanced = advanceTurnFrom(activePlayerIdx, nextPlayers, nextLogs);
      setPlayers(advanced.players);
      setActivePlayerIdx(advanced.nextIdx);
      setLogs(advanced.logs);
    }, 950);

    return () => {
      if (aiTurnTimerRef.current) clearTimeout(aiTurnTimerRef.current);
    };
  }, [
    activePlayerIdx,
    players,
    winner,
    pendingAudit,
    pipeline,
    deck,
    logs,
    sharedObjective,
    advanceTurnFrom,
    drawSmartCardFromDeck,
    playTone,
  ]);

  const humanPlayer = players.find((p) => !p.isBot) || players[0];
  const isHumanTurn =
    Boolean(humanPlayer) &&
    players[activePlayerIdx]?.id === humanPlayer?.id &&
    !pendingAudit &&
    !winner;

  const headStageIdx = getPipelineHeadStageIndex(pipeline);
  const validHandCount =
    humanPlayer?.hand.filter((c) => isValidPipelinePlay(c, pipeline)).length || 0;

  // Auto-scroll mobile pipeline track to the active stage when it advances
  useEffect(() => {
    const targetIdx = headStageIdx === -1 ? 0 : headStageIdx;
    const el = mobileStageRefs.current[targetIdx];
    if (el && typeof window !== "undefined" && window.innerWidth < 1024) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [headStageIdx]);

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed inset-0 z-[2000] overflow-y-auto bg-[#030712] p-3 sm:p-6"
          : "relative w-full max-w-[1440px] mx-auto"
      }`}
    >
      {/* OUTER LUXURY CYBER FRAME (Matches Roll-Up Banner Aesthetic) */}
      <div className="relative rounded-[28px] border-2 border-cyan-500/40 bg-gradient-to-b from-[#04091a]/95 via-[#071128]/95 to-[#030712]/98 shadow-[0_0_80px_rgba(6,182,212,0.18)] overflow-hidden">
        {/* Corner Cyber Nodes */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] pointer-events-none" />

        {/* =====================================================================
            MOBILE & TABLET SINGLE-SCREEN GAME COCKPIT (lg:hidden)
            Fits Header, Scoreboard, Objective+Milestone, Active Pipeline Stage,
            and Player Hand cleanly onto a phone screen without endless scrolling!
        ===================================================================== */}
        <div className="lg:hidden flex flex-col">
          {/* 1. Compact Mobile Top Command & Score Bar */}
          <div className="px-3 py-2.5 bg-[#02050e]/95 border-b border-cyan-500/25 flex flex-col gap-2">
            {/* Row A: Brand + Quick Action Icons */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/logo.png"
                  alt="AI Quest Shield"
                  className="w-7 h-7 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                />
                <div className="truncate">
                  <div className="text-[11px] font-black tracking-[0.14em] uppercase text-cyan-400 truncate">
                    LIVE ARENA · RULES v1.0
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowRulesModal(true)}
                  className="px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-400/50 text-amber-200 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3" />
                  Rules
                </button>
                <button
                  onClick={() => startNewGame(startingHandSize, aiCount)}
                  className="px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Deal
                </button>
                <button
                  onClick={toggleMusic}
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    musicEnabled
                      ? "bg-cyan-500/25 border-cyan-400 text-cyan-200"
                      : "bg-slate-900/80 border-slate-700 text-slate-400"
                  }`}
                  title="Toggle Music"
                >
                  <Music className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={toggleSound}
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    soundEnabled
                      ? "bg-slate-900/90 border-cyan-500/40 text-cyan-300"
                      : "bg-slate-900/80 border-slate-700 text-slate-500"
                  }`}
                  title="Toggle Sound Effects"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase cursor-pointer ${
                    mobileSettingsOpen
                      ? "bg-cyan-400 text-slate-950 border-cyan-300"
                      : "bg-slate-900/80 border-slate-700 text-slate-300"
                  }`}
                >
                  ⚙ Setup
                </button>
              </div>
            </div>

            {/* Collapsible Mobile Setup Drawer (Hand Size, AI Rivals, Hints) */}
            {mobileSettingsOpen && (
              <div className="pt-2 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1 bg-slate-900/90 border border-cyan-500/25 rounded-lg px-2 py-1">
                  <span className="text-slate-400 font-mono uppercase">Hand:</span>
                  {[4, 5, 6, 7].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        setStartingHandSize(sz);
                        startNewGame(sz, aiCount);
                      }}
                      className={`w-5 h-5 rounded font-bold ${
                        startingHandSize === sz
                          ? "bg-cyan-400 text-slate-950"
                          : "text-slate-300"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-slate-900/90 border border-cyan-500/25 rounded-lg px-2 py-1">
                  <span className="text-slate-400 font-mono uppercase">AI:</span>
                  {[1, 2, 3].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => {
                        setAiCount(cnt);
                        startNewGame(startingHandSize, cnt);
                      }}
                      className={`w-5 h-5 rounded font-bold ${
                        aiCount === cnt
                          ? "bg-cyan-400 text-slate-950"
                          : "text-slate-300"
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`px-2.5 py-1 rounded-lg border font-bold uppercase ${
                    showHints
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Hints: {showHints ? "ON" : "OFF"}
                </button>
              </div>
            )}

            {/* Row B: Compact Horizontal Score Pills + Deck & Turn Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {players.map((p, idx) => {
                const isTurn = idx === activePlayerIdx && !winner;
                return (
                  <div
                    key={p.id}
                    className={`flex-1 min-w-[115px] rounded-xl px-2.5 py-1.5 border flex items-center justify-between gap-1.5 ${
                      isTurn
                        ? "bg-cyan-950/70 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                        : "bg-slate-900/70 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isTurn ? "animate-ping" : ""
                        }`}
                        style={{ backgroundColor: p.avatarColor }}
                      />
                      <span className="text-[10px] font-extrabold uppercase text-white truncate">
                        {p.isBot ? p.name.replace(" AI", "") : "YOU"}
                      </span>
                    </div>
                    <span className="text-xs font-black text-cyan-300 font-mono shrink-0">
                      {p.ip} <span className="text-[9px] text-cyan-400">IP</span>
                    </span>
                  </div>
                );
              })}

              <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center shrink-0">
                <div className="text-[9px] font-mono text-slate-400 uppercase leading-none">
                  Deck
                </div>
                <div className="text-xs font-black text-white font-mono leading-tight">
                  {deck.length}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Mobile Challenge Audit or Status Alert */}
          {pendingAudit && (
            <div className="mx-2.5 mt-2 p-3 rounded-xl bg-red-950/95 border-2 border-red-500 shadow-lg flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-red-300">
                <span>🚨 AUDIT WINDOW ({auditCountdown}s)</span>
                <span>{pendingAudit.card.category}</span>
              </div>
              <p className="text-xs text-white">
                <strong className="text-cyan-300">{pendingAudit.playerName}</strong> played{" "}
                <strong className="text-amber-300">&ldquo;{pendingAudit.card.name}&rdquo;</strong>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => commitPendingCard(pendingAudit)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-[10px] font-bold uppercase"
                >
                  ✓ Allow Move
                </button>
                <button
                  onClick={handlePlayerChallengeAi}
                  className="flex-1 py-1.5 rounded-lg bg-red-600 border border-red-300 text-white text-[10px] font-black uppercase"
                >
                  🚨 CHALLENGE!
                </button>
              </div>
            </div>
          )}

          {bannerAlert && !pendingAudit && (
            <div
              className={`mx-2.5 mt-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-between gap-2 ${
                bannerAlert.type === "error"
                  ? "bg-red-950/90 border-red-500/70 text-red-200"
                  : bannerAlert.type === "warning"
                  ? "bg-amber-950/90 border-amber-500/70 text-amber-200"
                  : "bg-emerald-950/90 border-emerald-500/70 text-emerald-200"
              }`}
            >
              <span className="truncate">{bannerAlert.text}</span>
              <button onClick={() => setBannerAlert(null)} className="text-xs">
                ✕
              </button>
            </div>
          )}

          {/* 3. Compact Side-by-Side Objective & Paired Milestone Bar */}
          <div className="px-2.5 pt-2.5">
            <div className="rounded-xl bg-[#060e24]/90 border border-cyan-500/30 p-2.5">
              <div className="grid grid-cols-2 gap-2">
                {/* Active Objective */}
                {sharedObjective && (
                  <div className="flex items-center gap-2 min-w-0 pr-1 border-r border-cyan-500/20">
                    <div
                      onClick={() => setInspectingCard(sharedObjective)}
                      className="w-[46px] h-[64px] shrink-0 rounded-lg overflow-hidden border border-amber-400/60 shadow cursor-pointer"
                    >
                      <DigitalEngineerCardFace card={sharedObjective} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-black uppercase text-amber-400">
                          Objective
                        </span>
                        {headStageIdx === -1 && (
                          <button
                            onClick={cycleObjective}
                            className="text-[9px] font-mono text-cyan-300 underline"
                          >
                            Swap
                          </button>
                        )}
                      </div>
                      <div
                        onClick={() => setInspectingCard(sharedObjective)}
                        className="text-[11px] font-bold text-white uppercase leading-tight line-clamp-2 mt-0.5 cursor-pointer"
                      >
                        {sharedObjective.name}
                      </div>
                      <button
                        onClick={() => setInspectingCard(sharedObjective)}
                        className="text-[9px] font-mono text-cyan-400 mt-0.5 flex items-center gap-0.5"
                      >
                        <Eye className="w-2.5 h-2.5" /> Tap to Zoom
                      </button>
                    </div>
                  </div>
                )}

                {/* Paired Milestone */}
                {pairedMilestone && (
                  <div
                    onClick={() => setInspectingCard(pairedMilestone)}
                    className="flex items-center gap-2 min-w-0 pl-1 cursor-pointer"
                  >
                    <div
                      className={`w-[46px] h-[64px] shrink-0 rounded-lg overflow-hidden border shadow ${
                        milestoneUnlocked
                          ? "border-emerald-400"
                          : "border-rose-500/50 opacity-90"
                      }`}
                    >
                      <DigitalEngineerCardFace card={pairedMilestone} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-black uppercase text-rose-400">
                          Milestone
                        </span>
                        <span className="text-[9px] font-mono font-bold text-amber-300">
                          +{ENGINEER_CATEGORY_IP.MILESTONE} IP
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-white uppercase leading-tight line-clamp-2 mt-0.5">
                        {pairedMilestone.name}
                      </div>
                      <div className="text-[9px] font-mono text-amber-300/90 mt-0.5 truncate">
                        {milestoneUnlocked ? "✓ Unlocked!" : "🔒 At Stage 7"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Valid Datasets & Models Pill */}
              {sharedObjective && getObjectiveCompatibility(sharedObjective.name) && (
                <div className="mt-2 pt-1.5 border-t border-cyan-500/20">
                  <button
                    onClick={() => setMobileShowCompat(!mobileShowCompat)}
                    className="w-full flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold"
                  >
                    <span>
                      ✓ Valid Stage 1 Datasets &amp; Stage 4 Models for {sharedObjective.name}
                    </span>
                    <span className="text-xs">{mobileShowCompat ? "▴ Hide" : "▾ View"}</span>
                  </button>
                  {mobileShowCompat && (
                    <div className="mt-1.5 p-2 rounded-lg bg-[#040a1a] border border-cyan-500/25 text-[10px] space-y-1 text-left">
                      <div>
                        <strong className="text-cyan-300">Stage 1 Datasets: </strong>
                        <span className="text-slate-300">
                          {getObjectiveCompatibility(sharedObjective.name)?.datasets.join(" · ")}
                        </span>
                      </div>
                      <div>
                        <strong className="text-purple-300">Stage 4 Models: </strong>
                        <span className="text-slate-300">
                          {getObjectiveCompatibility(sharedObjective.name)?.models.join(" · ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. Compact Horizontal Swipeable 7-Stage Pipeline Track */}
          <div className="px-2.5 pt-2.5">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                7-Stage Pipeline (Swipe ↔)
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 px-2 py-0.5 rounded-md">
                Stage {headStageIdx === -1 ? 1 : headStageIdx + 1}/7 Open
              </span>
            </div>

            <div className="flex items-stretch gap-2 overflow-x-auto pb-1.5 pt-0.5 snap-x snap-mandatory custom-scrollbar">
              {PIPELINE_STAGES.map((stage, idx) => {
                const cardsInStage = pipeline[stage.slotKey];
                const isCurrentOpen =
                  (headStageIdx === -1 && idx === 0) || idx === headStageIdx;
                const isNextAdvance = headStageIdx !== -1 && idx === headStageIdx + 1;
                const isClosed = headStageIdx > idx;
                const topCard =
                  cardsInStage.length > 0
                    ? cardsInStage[cardsInStage.length - 1]
                    : null;
                const stageIp = STAGE_IP_MAP[stage.category] || 10;

                return (
                  <div
                    key={stage.slotKey}
                    ref={(el) => {
                      mobileStageRefs.current[idx] = el;
                    }}
                    onClick={() => {
                      if (cardsInStage.length > 0) {
                        setSelectedStageModal(stage.slotKey);
                      }
                    }}
                    className={`snap-center shrink-0 w-[124px] rounded-xl p-2 border flex flex-col justify-between transition-all ${
                      isCurrentOpen
                        ? "bg-cyan-950/55 border-2 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.25)]"
                        : isNextAdvance
                        ? "bg-emerald-950/35 border-2 border-dashed border-emerald-400/75"
                        : isClosed
                        ? "bg-slate-900/75 border-slate-700/70 opacity-85"
                        : "bg-slate-950/60 border-slate-800/80 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-mono mb-0.5">
                        <span className="font-black px-1 py-0.2 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30">
                          0{idx + 1}
                        </span>
                        <span className="font-bold text-amber-300">+{stageIp} IP</span>
                      </div>
                      <div className="text-[9px] font-black uppercase text-white leading-tight truncate">
                        {stage.label}
                      </div>
                    </div>

                    <div className="my-1.5 flex items-center justify-center">
                      {topCard ? (
                        <div className="relative w-[78px] h-[108px]">
                          <div className="w-full h-full rounded-lg overflow-hidden shadow border border-white/20">
                            <DigitalEngineerCardFace card={topCard} />
                          </div>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-cyan-400 text-cyan-200 text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap">
                            {cardsInStage.length} {cardsInStage.length === 1 ? "Card" : "Cards"}
                          </div>
                        </div>
                      ) : (
                        <div className="w-[74px] h-[104px] rounded-lg border border-dashed border-slate-700 flex items-center justify-center p-1.5 text-center">
                          <span className="text-[8px] font-mono uppercase text-slate-400 leading-tight">
                            {isCurrentOpen
                              ? "Open Stage"
                              : isNextAdvance
                              ? "Play to Advance"
                              : "Locked"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <span
                        className={`block w-full py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                          isCurrentOpen
                            ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/40"
                            : isNextAdvance
                            ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/40"
                            : isClosed
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-900 text-slate-500"
                        }`}
                      >
                        {isCurrentOpen
                          ? "● OPEN"
                          : isNextAdvance
                          ? "→ NEXT"
                          : isClosed
                          ? "✓ DONE"
                          : "LOCKED"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Docked Mobile Player Hand & Turn Action Bar */}
          <div className="mt-2 px-2.5 py-2.5 bg-[#020612]/95 border-t border-cyan-500/30">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <span>YOUR HAND ({humanPlayer?.hand.length || 0})</span>
                  {isHumanTurn && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400 text-cyan-200">
                      {validHandCount} Valid
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleHumanDrawAndEndTurn}
                disabled={!isHumanTurn}
                className={`px-3.5 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all ${
                  isHumanTurn
                    ? validHandCount === 0
                      ? "bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.6)] animate-pulse"
                      : "bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    : "bg-slate-800 border border-slate-700 text-slate-500"
                }`}
              >
                <span>
                  {cardsPlayedThisTurn > 0
                    ? `Draw & End (${cardsPlayedThisTurn})`
                    : "Draw 1 & End Turn"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compact Swipeable Hand Cards on Mobile */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar">
              {humanPlayer?.hand.map((card) => {
                const valid = isValidPipelinePlay(card, pipeline);
                const dup = isDuplicateInPipeline(pipeline, card);
                const stageOk = isStageProgressionValid(card, pipeline);
                const domainOk = isCardCompatibleWithObjective(card, sharedObjective);
                const stIdx = getPipelineStageIndex(card.category);
                const isAdvance = headStageIdx !== -1 && stIdx === headStageIdx + 1;

                return (
                  <div
                    key={card.id}
                    className={`relative shrink-0 flex flex-col items-center rounded-xl p-1.5 border transition-all ${
                      showHints && valid
                        ? "bg-cyan-950/55 border-2 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                        : "bg-slate-900/75 border-slate-700/80"
                    }`}
                  >
                    <div className="w-full flex items-center justify-between gap-1 mb-1 px-0.5">
                      {showHints ? (
                        valid ? (
                          <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                            {isAdvance ? "✓ Advance" : "✓ Valid"}
                          </span>
                        ) : dup ? (
                          <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                            Dup
                          </span>
                        ) : !domainOk ? (
                          <span
                            className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                              stageOk
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-slate-800 text-amber-300/80"
                            }`}
                          >
                            ⚠ Domain
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            Stg 0{stIdx + 1}
                          </span>
                        )
                      ) : (
                        <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          Stg 0{stIdx + 1}
                        </span>
                      )}

                      <button
                        onClick={() => setInspectingCard(card)}
                        className="text-[8px] font-mono text-cyan-400 px-1 py-0.5 rounded bg-slate-950/80"
                      >
                        Zoom
                      </button>
                    </div>

                    <div
                      onClick={() => {
                        if (isHumanTurn) {
                          handleHumanPlayCard(card);
                        } else {
                          setInspectingCard(card);
                        }
                      }}
                      className="w-[114px] h-[160px] rounded-lg overflow-hidden shadow-lg cursor-pointer"
                    >
                      <DigitalEngineerCardFace card={card} />
                    </div>

                    <button
                      onClick={() => handleHumanPlayCard(card)}
                      disabled={!isHumanTurn}
                      className={`mt-1.5 w-full py-1 rounded-lg font-black text-[9px] uppercase tracking-wider ${
                        !isHumanTurn
                          ? "bg-slate-800 text-slate-500"
                          : showHints && valid
                          ? "bg-cyan-400 text-slate-950"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {showHints && !valid ? "Risk Play" : `Play (+${card.ipValue} IP)`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Compact 1-Line Mobile Log */}
            <div className="mt-1.5 pt-1.5 border-t border-cyan-500/20 flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
              <div className="truncate">
                <span className="text-cyan-400 font-bold mr-1">[LOG]</span>
                <span>{logs[logs.length - 1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            DESKTOP TABLETOP VIEW (hidden lg:block — 100% UNCHANGED)
        ===================================================================== */}
        <div className="hidden lg:block">
        {/* TOP GAME COMMAND HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-7 py-3.5 bg-[#02050e]/90 border-b border-cyan-500/25">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="AI Quest Shield"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-[0.2em] uppercase text-cyan-400">
                  LIVE INTERACTIVE TABLETOP ARENA
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Official Rules v1.0
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Play the authentic 240-card ML strategy game right in your browser — or scroll down for the full showcase
              </p>
            </div>
          </div>

          {/* Controls: Hand size, AI count, Rules, Hints, Sound, New Game, Fullscreen */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-cyan-500/25 rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Hand:</span>
              {[4, 5, 6, 7].map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    setStartingHandSize(sz);
                    startNewGame(sz, aiCount);
                  }}
                  className={`w-6 h-6 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    startingHandSize === sz
                      ? "bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  title={`Deal ${sz} starting cards (Official Manual: 4–7 cards)`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-cyan-500/25 rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[10px] uppercase">AI Rivals:</span>
              {[1, 2, 3].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => {
                    setAiCount(cnt);
                    startNewGame(startingHandSize, cnt);
                  }}
                  className={`w-6 h-6 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    aiCount === cnt
                      ? "bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  title={`Play against ${cnt} AI opponent(s)`}
                >
                  {cnt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowHints(!showHints)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                showHints
                  ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-200"
                  : "bg-slate-900/80 border-slate-700 text-slate-400"
              }`}
              title="Highlight valid cards in your hand"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{showHints ? "Hints ON" : "Hints OFF"}</span>
            </button>

            <button
              onClick={() => setShowRulesModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Rules</span>
            </button>

            <button
              onClick={() => startNewGame(startingHandSize, aiCount)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-cyan-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Deal</span>
            </button>

            <button
              onClick={toggleMusic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                musicEnabled
                  ? "bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title={
                musicEnabled
                  ? "Stop Neural Command Ambient Soundtrack"
                  : "Play Neural Command Ambient Soundtrack"
              }
            >
              <Music
                className={`w-3.5 h-3.5 ${
                  musicEnabled ? "text-cyan-300 animate-pulse" : ""
                }`}
              />
              <span className="hidden md:inline">
                {musicEnabled ? "Music ON" : "Music"}
              </span>
            </button>

            <button
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-slate-900/90 border-cyan-500/40 text-cyan-300 hover:bg-slate-800"
                  : "bg-slate-900/80 border-slate-700 text-slate-500 hover:text-slate-300"
              }`}
              title={
                soundEnabled
                  ? "Mute Tactical Sound Effects (SFX)"
                  : "Enable Tactical Sound Effects (SFX)"
              }
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden lg:inline">
                {soundEnabled ? "SFX ON" : "SFX OFF"}
              </span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Expand Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* IP SCORE TRACKER BAR (0–100+ Scale from Official Manual Page 1 & 5) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 sm:px-7 py-3 bg-[#050b1c]/90 border-b border-cyan-500/20 items-center">
          <div className="md:col-span-8 flex flex-wrap items-center gap-3">
            {players.map((p, idx) => {
              const isTurn = idx === activePlayerIdx && !winner;
              const trackerPos = getTrackerPosition(p.ip);
              const laps = Math.floor(p.ip / 100);
              return (
                <div
                  key={p.id}
                  className={`flex-1 min-w-[180px] rounded-xl px-3.5 py-2 border transition-all ${
                    isTurn
                      ? "bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                      : "bg-slate-900/60 border-slate-800 opacity-85"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isTurn ? "animate-ping" : ""
                        }`}
                        style={{ backgroundColor: p.avatarColor }}
                      />
                      <span className="text-xs font-extrabold tracking-wider uppercase text-white truncate">
                        {p.name}
                      </span>
                      {p.skipNextTurn && (
                        <span className="text-[9px] font-mono bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.5 rounded uppercase">
                          Skip Turn
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {laps > 0 && (
                        <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded">
                          +{laps * 100} LAP
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                        {p.ip} <span className="text-[10px] text-cyan-400">IP</span>
                      </span>
                    </div>
                  </div>
                  {/* 0–100 IP Score Tracker Progress Bar */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (p.ip % 100) || (p.ip > 0 ? 100 : 0))}%`,
                        backgroundColor: p.avatarColor,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>Hand: {p.hand.length} cards</span>
                    <span>Tracker: {trackerPos}/100</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Turn Status & Deck Counters */}
          <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3">
            <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Draw Deck</div>
              <div className="text-sm font-black text-white font-mono">
                {deck.length} <span className="text-[10px] text-slate-400">/ {RETAIL_ENGINEER_DECK_SIZE}</span>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-950/90 to-slate-900/90 border border-cyan-400/40 text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
                Active Turn
              </div>
              <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {winner
                  ? `🏆 ${winner.name} Wins!`
                  : pendingAudit
                  ? "🚨 Challenge Window"
                  : isHumanTurn
                  ? `Your Turn (${cardsPlayedThisTurn} played)`
                  : `${players[activePlayerIdx]?.name} thinking...`}
              </div>
            </div>
          </div>
        </div>

        {/* LIVE CHALLENGE AUDIT ALERT OR STATUS BANNER */}
        <AnimatePresence>
          {pendingAudit && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mx-4 sm:mx-7 mt-4 p-4 rounded-2xl bg-gradient-to-r from-red-950/95 via-[#1a070d]/95 to-red-950/95 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4 z-30"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-400 flex items-center justify-center shrink-0 animate-pulse">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-red-300">
                      OPPONENT PLAY AUDIT WINDOW ({auditCountdown}s)
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-white font-semibold mt-0.5">
                    <strong className="text-cyan-300">{pendingAudit.playerName}</strong> played{" "}
                    <strong className="text-amber-300">&ldquo;{pendingAudit.card.name}&rdquo;</strong> into{" "}
                    <span className="underline decoration-cyan-400">{pendingAudit.card.category}</span>
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Is this card valid for the current/next stage and not already in the pipeline? False challenges cost your next turn!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => commitPendingCard(pendingAudit)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  ✓ Allow Move
                </button>
                <button
                  onClick={handlePlayerChallengeAi}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 border-2 border-red-300 text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_0_25px_rgba(239,68,68,0.8)] cursor-pointer transition-all flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  🚨 CALL &ldquo;CHALLENGE!&rdquo;
                </button>
              </div>
            </motion.div>
          )}

          {bannerAlert && !pendingAudit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mx-4 sm:mx-7 mt-3 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 ${
                bannerAlert.type === "error"
                  ? "bg-red-950/90 border-red-500/70 text-red-200"
                  : bannerAlert.type === "warning"
                  ? "bg-amber-950/90 border-amber-500/70 text-amber-200"
                  : "bg-emerald-950/90 border-emerald-500/70 text-emerald-200"
              }`}
            >
              <span>{bannerAlert.text}</span>
              <button
                onClick={() => setBannerAlert(null)}
                className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN TABLETOP WORKSPACE: OBJECTIVE + MILESTONE + 7-STAGE ML PIPELINE */}
        <div className="p-4 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (3 COLS): ACTIVE SYSTEM OBJECTIVE & PAIRED MILESTONE */}
          <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-4 bg-[#060e24]/80 border border-cyan-500/25 rounded-2xl p-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black tracking-[0.18em] uppercase text-amber-400">
                  1. System Objective
                </span>
                {headStageIdx === -1 && (
                  <button
                    onClick={cycleObjective}
                    className="text-[10px] font-mono text-cyan-300 hover:text-white underline cursor-pointer"
                    title="Swap Objective before pipeline starts"
                  >
                    Swap Objective
                  </button>
                )}
              </div>

              {sharedObjective && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => setInspectingCard(sharedObjective)}
                      className="w-[105px] h-[145px] shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-lg rounded-xl overflow-hidden border border-amber-400/50"
                      title="Click to inspect System Objective card"
                    >
                      <DigitalEngineerCardFace card={sharedObjective} />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="text-xs font-black text-white uppercase leading-snug">
                        {sharedObjective.name}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-4">
                        {sharedObjective.description}
                      </p>
                      <button
                        onClick={() => setInspectingCard(sharedObjective)}
                        className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> Inspect Card
                      </button>
                    </div>
                  </div>

                  {/* Compatible Datasets & Models Reference for Active Objective */}
                  {getObjectiveCompatibility(sharedObjective.name) && (
                    <div className="rounded-xl bg-[#040a1a] border border-cyan-500/25 p-2.5 text-[10px] space-y-1.5">
                      <div>
                        <span className="font-bold text-cyan-300 uppercase tracking-wider block">
                          ✓ Valid Stage 1 Datasets:
                        </span>
                        <span className="text-slate-300 leading-snug">
                          {getObjectiveCompatibility(sharedObjective.name)?.datasets.join(" · ")}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-1">
                        <span className="font-bold text-purple-300 uppercase tracking-wider block">
                          ✓ Valid Stage 4 Models:
                        </span>
                        <span className="text-slate-300 leading-snug">
                          {getObjectiveCompatibility(sharedObjective.name)?.models.join(" · ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t sm:border-t-0 sm:border-l lg:border-l-0 lg:border-t border-cyan-500/20 pt-3 sm:pt-0 sm:pl-4 lg:pl-0 lg:pt-3 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black tracking-[0.18em] uppercase text-rose-400 flex items-center gap-1">
                  {milestoneUnlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  2. Paired Milestone
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-400/30">
                  +{ENGINEER_CATEGORY_IP.MILESTONE} IP at Deploy
                </span>
              </div>

              {pairedMilestone && (
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setInspectingCard(pairedMilestone)}
                    className={`w-[105px] h-[145px] shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-lg rounded-xl overflow-hidden border ${
                      milestoneUnlocked
                        ? "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                        : "border-rose-500/50 opacity-90"
                    }`}
                    title="Click to inspect paired Milestone card"
                  >
                    <DigitalEngineerCardFace card={pairedMilestone} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white uppercase leading-snug">
                      {pairedMilestone.name}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {pairedMilestone.description}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-amber-300">
                      {milestoneUnlocked
                        ? "✓ UNLOCKED UPON DEPLOYMENT!"
                        : "🔒 Unlocks when Stage 7 (Deployment) is played"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (9 COLS): THE 7 SEQUENTIAL ML PIPELINE STAGES */}
          <div className="lg:col-span-9 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-black tracking-[0.18em] uppercase text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  THE 7-STAGE SHARED AI PIPELINE
                </h2>
                <p className="text-xs text-slate-300">
                  The pipeline moves strictly forward (Stage 1 → Stage 7). Once advanced to the next stage, previous stages close. No duplicate card names allowed!
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold">
                  Current Stage:{" "}
                  {headStageIdx === -1
                    ? "1. DATA COLLECTION (Start)"
                    : `${headStageIdx + 1}. ${PIPELINE_STAGES[headStageIdx].category}`}
                </span>
              </div>
            </div>

            {/* 7-Stage Pipeline Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2.5">
              {PIPELINE_STAGES.map((stage, idx) => {
                const cardsInStage = pipeline[stage.slotKey];
                const isCurrentOpen =
                  (headStageIdx === -1 && idx === 0) || idx === headStageIdx;
                const isNextAdvance = headStageIdx !== -1 && idx === headStageIdx + 1;
                const isClosed = headStageIdx > idx;
                const topCard =
                  cardsInStage.length > 0
                    ? cardsInStage[cardsInStage.length - 1]
                    : null;
                const stageIp = STAGE_IP_MAP[stage.category] || 10;

                return (
                  <div
                    key={stage.slotKey}
                    onClick={() => {
                      if (cardsInStage.length > 0) {
                        setSelectedStageModal(stage.slotKey);
                      }
                    }}
                    className={`relative rounded-2xl p-2.5 border flex flex-col justify-between min-h-[245px] transition-all ${
                      isCurrentOpen
                        ? "bg-cyan-950/45 border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)]"
                        : isNextAdvance
                        ? "bg-emerald-950/30 border-2 border-dashed border-emerald-400/70"
                        : isClosed
                        ? "bg-slate-900/75 border-slate-700/70 opacity-85"
                        : "bg-slate-950/60 border-slate-800/80 opacity-60"
                    } ${cardsInStage.length > 0 ? "cursor-pointer hover:border-white/60" : ""}`}
                  >
                    {/* Stage Header */}
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30">
                          0{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300">
                          +{stageIp} IP
                        </span>
                      </div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white leading-tight min-h-[28px]">
                        {stage.label}
                      </div>
                    </div>

                    {/* Card Stack or Empty Slot */}
                    <div className="my-2 flex-1 flex flex-col items-center justify-center relative">
                      {topCard ? (
                        <div className="relative w-[112px] h-[156px] mx-auto">
                          {cardsInStage.length > 1 && (
                            <div className="absolute -top-1.5 -left-1.5 w-full h-full rounded-xl bg-cyan-900/40 border border-cyan-400/40 -rotate-3" />
                          )}
                          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/20">
                            <DigitalEngineerCardFace card={topCard} />
                          </div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-cyan-400 text-cyan-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                            {cardsInStage.length} {cardsInStage.length === 1 ? "Card" : "Cards"}
                          </div>
                        </div>
                      ) : (
                        <div className="w-[106px] h-[148px] rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 text-center">
                          <span className="text-[10px] font-mono uppercase text-slate-400">
                            {isCurrentOpen
                              ? "Play Current Stage"
                              : isNextAdvance
                              ? "Play to Advance Stage"
                              : "Locked"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stage Status Footer Badge */}
                    <div className="text-center mt-1">
                      {isCurrentOpen ? (
                        <span className="inline-block w-full py-1 rounded-lg bg-cyan-400/20 border border-cyan-400/50 text-[9px] font-mono font-black uppercase tracking-widest text-cyan-200">
                          ● OPEN STAGE
                        </span>
                      ) : isNextAdvance ? (
                        <span className="inline-block w-full py-1 rounded-lg bg-emerald-400/20 border border-emerald-400/50 text-[9px] font-mono font-black uppercase tracking-widest text-emerald-200">
                          → NEXT STAGE
                        </span>
                      ) : isClosed ? (
                        <span className="inline-block w-full py-1 rounded-lg bg-slate-800 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                          ✓ STAGE CLOSED
                        </span>
                      ) : (
                        <span className="inline-block w-full py-1 rounded-lg bg-slate-900 text-[9px] font-mono uppercase tracking-widest text-slate-500">
                          LOCKED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PLAYER HAND & TURN ACTION DECK BAR (Official Manual Turn Structure: Play -> Score -> Draw 1 -> End Turn) */}
        <div className="px-4 sm:px-7 py-5 bg-[#020612]/95 border-t border-cyan-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
                  YOUR ENGINEER HAND ({humanPlayer?.hand.length || 0} CARDS)
                </span>
                {isHumanTurn && (
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400 text-cyan-200">
                    {validHandCount > 0
                      ? `${validHandCount} Valid Move${validHandCount === 1 ? "" : "s"} Available`
                      : "No Valid Moves — Click 'Draw 1 Card & End Turn'"}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong>Turn Rules (Manual v1.0):</strong> Step 1: Play as many valid cards as you wish · Step 2: Score IP for each card · Step 3 &amp; 4: When finished (or unable to play), <strong>Draw 1 Card &amp; End Turn</strong>.
              </p>
            </div>

            {/* Step 3 & 4 Action Button: Draw 1 Card & End Turn */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={handleHumanDrawAndEndTurn}
                disabled={!isHumanTurn}
                className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 transition-all ${
                  isHumanTurn
                    ? validHandCount === 0
                      ? "bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.7)] hover:scale-[1.02] cursor-pointer animate-pulse"
                      : "bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:scale-[1.02] cursor-pointer"
                    : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>
                  {cardsPlayedThisTurn > 0
                    ? `Draw 1 Card & End Turn (${cardsPlayedThisTurn} Played)`
                    : "Draw 1 Card & End Turn"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable / Responsive Player Hand Cards */}
          <div className="flex items-center gap-3.5 overflow-x-auto pb-3 pt-2 custom-scrollbar">
            {humanPlayer?.hand.map((card) => {
              const valid = isValidPipelinePlay(card, pipeline);
              const dup = isDuplicateInPipeline(pipeline, card);
              const stageOk = isStageProgressionValid(card, pipeline);
              const domainOk = isCardCompatibleWithObjective(card, sharedObjective);
              const stIdx = getPipelineStageIndex(card.category);
              const isAdvance = headStageIdx !== -1 && stIdx === headStageIdx + 1;

              return (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className={`relative shrink-0 flex flex-col items-center rounded-2xl p-2 border transition-all ${
                    showHints && valid
                      ? "bg-cyan-950/50 border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.3)]"
                      : "bg-slate-900/70 border-slate-700/80"
                  }`}
                >
                  {/* Status Tag on Top of Card */}
                  <div className="w-full flex items-center justify-between gap-1 mb-1.5 px-1">
                    {showHints ? (
                      valid ? (
                        <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                          {isAdvance ? "✓ Advance Stage" : "✓ Valid Play"}
                        </span>
                      ) : dup ? (
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-400/40">
                          Duplicate
                        </span>
                      ) : !domainOk ? (
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                            stageOk
                              ? "bg-amber-500/20 text-amber-300 border-amber-400/50"
                              : "bg-slate-800 text-amber-300/80 border-amber-500/30"
                          }`}
                          title={`"${card.name}" is not compatible with "${sharedObjective?.name}". Playing it risks a CHALLENGE!`}
                        >
                          ⚠ Wrong Domain
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Stage 0{stIdx + 1}
                        </span>
                      )
                    ) : (
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Stage 0{stIdx + 1}
                      </span>
                    )}

                    <button
                      onClick={() => setInspectingCard(card)}
                      className="text-[10px] font-mono text-cyan-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-950/80 cursor-pointer"
                      title="Inspect full card details"
                    >
                      Zoom
                    </button>
                  </div>

                  {/* The Card Visual */}
                  <div
                    onClick={() => {
                      if (isHumanTurn) {
                        handleHumanPlayCard(card);
                      } else {
                        setInspectingCard(card);
                      }
                    }}
                    className={`w-[156px] h-[218px] rounded-xl overflow-hidden shadow-xl ${
                      isHumanTurn ? "cursor-pointer" : "cursor-zoom-in"
                    }`}
                  >
                    <DigitalEngineerCardFace card={card} />
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => handleHumanPlayCard(card)}
                    disabled={!isHumanTurn}
                    className={`mt-2 w-full py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all ${
                      !isHumanTurn
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : showHints && valid
                        ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950 cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                        : "bg-slate-800 hover:bg-red-950/80 hover:text-red-200 text-slate-300 border border-slate-700 cursor-pointer"
                    }`}
                  >
                    {showHints && !valid
                      ? "Play (Risk Challenge)"
                      : `Play (+${card.ipValue} IP)`}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM TELEMETRY LOG & SCIENCE AUDIT TIMELINE */}
        <div className="px-4 sm:px-7 py-3 bg-[#01030a] border-t border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300 truncate max-w-full">
            <span className="text-cyan-400 font-bold uppercase shrink-0">[PIPELINE LOG]</span>
            <span className="truncate">{logs[logs.length - 1]}</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-[11px] text-slate-400">
            <span>
              Pipeline Cards:{" "}
              <strong className="text-cyan-300">
                {PIPELINE_SLOT_KEYS.reduce((acc, k) => acc + pipeline[k].length, 0)}
              </strong>
            </span>
            <span>
              Audited Moves: <strong className="text-cyan-300">{moveHistory.length}</strong>
            </span>
          </div>
        </div>
        </div>
      </div>

      {/* CARD INSPECTOR MODAL */}
      <AnimatePresence>
        {inspectingCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInspectingCard(null)}
            className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#050c1e] border-2 border-cyan-400/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_80px_rgba(34,211,238,0.3)] flex flex-col sm:flex-row items-center gap-8"
            >
              <div className="w-[240px] h-[336px] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <DigitalEngineerCardFace card={inspectingCard} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-3 py-1 rounded-full w-fit mb-3">
                  {inspectingCard.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight mb-3">
                  {inspectingCard.name}
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed border-l-2 border-cyan-400 pl-4 mb-5">
                  {inspectingCard.description}
                </p>
                {inspectingCard.ipValue > 0 && (
                  <div className="text-xl font-black text-amber-300 font-mono mb-6">
                    Reward: +{inspectingCard.ipValue} Innovation Points (IP)
                  </div>
                )}
                <button
                  onClick={() => setInspectingCard(null)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-widest w-fit cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE STACK INSPECTOR MODAL */}
      <AnimatePresence>
        {selectedStageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStageModal(null)}
            className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#050c1e] border-2 border-cyan-400/60 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-cyan-500/25">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-cyan-300">
                  Cards Integrated in{" "}
                  {PIPELINE_STAGES.find((s) => s.slotKey === selectedStageModal)?.label}
                </h3>
                <button
                  onClick={() => setSelectedStageModal(null)}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
              <div className="flex flex-wrap gap-4 justify-center max-h-[65vh] overflow-y-auto p-2">
                {pipeline[selectedStageModal].map((c, i) => (
                  <div key={`${c.id}-${i}`} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-cyan-300 mb-1">
                      #{i + 1} Played
                    </span>
                    <div className="w-[170px] h-[238px] rounded-xl overflow-hidden shadow-lg border border-white/20">
                      <DigitalEngineerCardFace card={c} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OFFICIAL RULES v1.0 MODAL */}
      <AnimatePresence>
        {showRulesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRulesModal(false)}
            className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#050c1e] border-2 border-cyan-400/60 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-[0_0_90px_rgba(34,211,238,0.3)] text-left"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/30">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                    AI QUEST · 240-CARD COLLECTOR&apos;S EDITION
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                    Official Rules Manual (v1.0)
                  </h3>
                </div>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-5 text-sm text-slate-200 leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/25">
                  <h4 className="font-black text-cyan-300 uppercase tracking-wider mb-1">
                    1. Objective &amp; Components (240 Cards)
                  </h4>
                  <p>
                    Build a complete AI system by progressing through the 7 stages of the Machine Learning Lifecycle. Earn Innovation Points (IP) for every valid card played.{" "}
                    <strong className="text-white">
                      The player with the highest IP when the AI system reaches Stage 7 (Deployment) wins!
                    </strong>
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    Retail Set: 210 Engineer Cards · 15 System Objective Cards · 15 Paired Milestone Cards.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/25">
                  <h4 className="font-black text-cyan-300 uppercase tracking-wider mb-1">
                    2. Turn Structure (4 Steps)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      <strong>Step 1 — Play:</strong> Play as many valid cards as you wish into the shared pipeline.
                    </li>
                    <li>
                      <strong>Step 2 — Score:</strong> Earn IP immediately for every valid card played.
                    </li>
                    <li>
                      <strong>Step 3 — Draw:</strong> When you can no longer continue the pipeline (or choose to stop), draw 1 card from the Engineer Deck.
                    </li>
                    <li>
                      <strong>Step 4 — End Turn:</strong> Play proceeds clockwise to the next player.
                    </li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/25">
                  <h4 className="font-black text-cyan-300 uppercase tracking-wider mb-1">
                    3. Flexible Pipeline, Stage Advancement &amp; Unique Card Rules
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Flexible Pipeline Rule:</strong> Continue playing multiple cards into the current open stage as long as they have not already been played.
                    </li>
                    <li>
                      <strong>Stage Advancement Rule:</strong> Advance the pipeline at any time by playing a valid card from the next sequential stage.{" "}
                      <em>Once advanced, the previous stage closes!</em>
                    </li>
                    <li>
                      <strong>Unique Card Rule:</strong> A card name already present in the pipeline cannot be played again.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40">
                  <h4 className="font-black text-red-300 uppercase tracking-wider mb-1">
                    4. &ldquo;CHALLENGE!&rdquo; Audits &amp; Penalties
                  </h4>
                  <p>
                    If any player attempts to play a <strong>Duplicate Card</strong> or an{" "}
                    <strong>Invalid Stage Card</strong>, any rival may call{" "}
                    <strong className="text-red-300">&ldquo;CHALLENGE!&rdquo;</strong>:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>
                      <strong>Successful Challenge:</strong> The invalid card is rejected, 0 IP is awarded, and the offending player&apos;s turn immediately ends.
                    </li>
                    <li>
                      <strong>Failed Challenge:</strong> If a player falsely challenges a valid move, the card integrates normally and the challenger <strong>loses their next turn</strong>!
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40">
                  <h4 className="font-black text-amber-300 uppercase tracking-wider mb-1">
                    5. Completing the AI System, Scoring &amp; Tie-Breaker
                  </h4>
                  <p>
                    Playing a <strong>Deployment Card (Stage 7)</strong> earns <strong>+25 IP</strong> AND unlocks the paired <strong>Milestone Card (+30 IP)</strong>, completing the AI system! If tied on final IP, tied players reveal their remaining hands and the player holding the highest-stage card wins.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VICTORY CEREMONY & CERTIFICATE MODAL */}
      <AnimatePresence>
        {showVictoryModal && winner && (
          <VictoryCeremony
            isHumanWinner={!winner.isBot}
            winnerDisplayName={winner.name}
            defaultName={winner.isBot ? "Engineer" : "Lead AI Architect"}
            finalIp={winner.ip}
            onClose={() => {
              setShowVictoryModal(false);
              startNewGame(startingHandSize, aiCount);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
