import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { EXERCISES } from "@/constants/exercises";

export default function ExercisesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>種目を選択</Text>

      <FlatList
        data={EXERCISES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/exercises/[id]", params: { id: item.id } }} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.bodyPart}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  card: { backgroundColor: "#f3f4f6", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardSub: { marginTop: 4, color: "#6b7280" },
});
