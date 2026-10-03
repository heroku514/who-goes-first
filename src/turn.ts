export type Seat = "none" | "kid" | "grandpa";

export type TurnState = {
  seat: Seat;
};

export const EMPTY_TURN: TurnState = { seat: "none" };

export function turnLine(state: TurnState): string {
  if (state.seat === "kid") return "The kid goes.";
  if (state.seat === "grandpa") return "Grandpa goes.";
  return "Nobody yet.";
}

export function whoLine(state: TurnState): string {
  if (state.seat === "kid") return "Kid now.";
  if (state.seat === "grandpa") return "Grandpa now.";
  return "Waiting.";
}

export function hasProgress(state: TurnState): boolean {
  return state.seat !== "none";
}

export function parseTurn(raw: string | null): TurnState {
  if (!raw) return EMPTY_TURN;
  try {
    const value = JSON.parse(raw) as { seat?: unknown };
    if (value.seat !== "none" && value.seat !== "kid" && value.seat !== "grandpa") return EMPTY_TURN;
    return { seat: value.seat };
  } catch {
    return EMPTY_TURN;
  }
}

export function kidTurn(state: TurnState): { state: TurnState; note: string } {
  if (state.seat === "kid") return { state, note: "Already the kid." };
  return { state: { seat: "kid" }, note: "Kid's turn." };
}

export function grandpaTurn(state: TurnState): { state: TurnState; note: string } {
  if (state.seat === "grandpa") return { state, note: "Already Grandpa." };
  return { state: { seat: "grandpa" }, note: "Grandpa's turn." };
}

export function resetTurn(): { state: TurnState; note: string } {
  return { state: EMPTY_TURN, note: "Who goes first?" };
}
