import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseTurn, type TurnState } from "./turn";

const KEY = "who-goes-first-v1";

export async function loadTurn(): Promise<TurnState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseTurn(raw);
}

export async function saveTurn(state: TurnState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
