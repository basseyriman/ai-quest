import { EngineerGameState } from "../types";

export { assignWinnerIfNeeded, resolveWinner } from "./engineer-mode/rules";

/** @deprecated No fixed winning score — highest IP after Deployment wins. */
export function isSoloRoom(roomId: string): boolean {
  return roomId.startsWith("SP-");
}

/** @deprecated Use assignWinnerIfNeeded from rules.ts */
export function playerMeetsWinCondition(
  _roomId: string,
  gameState: EngineerGameState,
  _playerId: string
): boolean {
  return !!gameState.winner;
}
