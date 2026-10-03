import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  EMPTY_TURN,
  grandpaTurn,
  hasProgress,
  kidTurn,
  resetTurn,
  turnLine,
  whoLine,
  type TurnState,
} from "./src/turn";
import { loadTurn, saveTurn } from "./src/store";

export default function App() {
  const [state, setState] = useState<TurnState>(EMPTY_TURN);
  const [note, setNote] = useState("Who goes first?");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadTurn()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved turn loaded." : "Who goes first?");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the turn.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveTurn(state).catch(() => setNote("Could not save the turn."));
  }, [ready, state]);

  if (!ready && note === "Who goes first?") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the turn</Text>
        </View>
      </SafeAreaView>
    );
  }

  function apply(result: { state: TurnState; note: string }) {
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Who Goes First</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{whoLine(state)}</Text>
        <Text style={styles.line}>{turnLine(state)}</Text>
        <BigButton label="Kid's turn" onPress={() => apply(kidTurn(state))} />
        <BigButton label="Grandpa's turn" onPress={() => apply(grandpaTurn(state))} />
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New turn" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetTurn();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New turn canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F7E8" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#243018" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#243018" },
  note: { fontSize: 18, color: "#4E5C3A", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#243018" },
  line: { fontSize: 34, fontWeight: "800", color: "#1D4E89", lineHeight: 40 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#243018",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#243018" },
  buttonText: { fontSize: 22, fontWeight: "800", color: "#243018", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
