import { Stack, useLocalSearchParams, router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { EXERCISES } from "@/constants/exercises";

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = EXERCISES.find((e) => e.id === id);

  const title = exercise ? exercise.name : "種目";

  if (!exercise) {
    return (
      <>
        <Stack.Screen options={{ title }} />
        <View style={styles.center}>
          <Text>種目が見つかりませんでした。</Text>
        </View>
      </>
    );
  }

  return (
    <>
      {/* ← ここで headerShown を true にする */}
      <Stack.Screen options={{ title, headerShown: true }} />

      <View style={styles.container}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.bodyPart}>部位: {exercise.bodyPart}</Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push(`/workout/${exercise.id}`)}
        >
          <Text style={styles.btnText}>記録する</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  name: { fontSize: 22, fontWeight: "700" },
  bodyPart: { fontSize: 16, color: "#666", marginBottom: 20 },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontSize: 18, fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
