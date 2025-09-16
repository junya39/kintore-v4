import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { insertWorkout, insertSet, getOrCreateExerciseByName } from "@/lib/db";

export default function WorkoutScreen() {
  // exerciseId でも id でも受ける（"3" か "squat" など）
  const { exerciseId, id } = useLocalSearchParams<{ exerciseId?: string; id?: string }>();
  const raw = exerciseId ?? id;
  const router = useRouter();

  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [setIndex, setSetIndex] = useState(1);
  const [creating, setCreating] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("param raw =", raw);
      if (!raw) {
        setCreating(false);
        Alert.alert("種目が取得できませんでした", "前の画面からやり直してください。", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      // 数値ならそのまま、文字列なら exercises に作成/取得して数値IDに解決
      const asNum = Number(raw);
      const numericExerciseId = Number.isFinite(asNum) && asNum > 0
        ? asNum
        : await getOrCreateExerciseByName(String(raw));

      const wid = await insertWorkout(numericExerciseId, new Date().toISOString());
      setWorkoutId(wid);
    })()
      .catch((e) => {
        console.warn("prepare workout failed:", e);
        Alert.alert("ワークアウト準備でエラー", String(e));
      })
      .finally(() => setCreating(false));
  }, [raw]);

  async function onSave() {
    if (workoutId == null) {
      Alert.alert("準備中", "ワークアウトIDの生成を待っています。");
      return;
    }
    setSaving(true);
    try {
      const weightNum = weight.trim() === "" ? null : Number(weight);
      const repsNum = reps.trim() === "" ? null : Number(reps);
      console.log("saving set", { workoutId, setIndex, weightNum, repsNum });
      await insertSet(workoutId, setIndex, weightNum, repsNum);
      setSetIndex((n) => n + 1);
      setWeight("");
      setReps("");
      Alert.alert("保存しました");
    } catch (e) {
      console.warn("insertSet failed:", e);
      Alert.alert("保存に失敗しました", String(e));
    } finally {
      setSaving(false);
    }
  }

  if (creating) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>ワークアウトを準備中…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>セットを記録</Text>
      <Text style={styles.sub}>workoutId: {workoutId ?? "-"}</Text>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>重量 (kg)</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="例) 60"
            inputMode="numeric"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>回数 (reps)</Text>
          <TextInput
            value={reps}
            onChangeText={setReps}
            placeholder="例) 8"
            inputMode="numeric"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      <Text style={{ marginBottom: 8 }}>セット番号: {setIndex}</Text>

      <View style={{ gap: 12 }}>
        <Button title={saving ? "保存中…" : "保存"} onPress={onSave} disabled={saving} />
        <Button title="終了して戻る" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  sub: { color: "#6b7280", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  field: { flex: 1 },
  label: { fontSize: 12, color: "#374151", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9fafb",
  },
});
