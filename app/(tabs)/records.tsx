// app/(tabs)/records.tsx
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { getSessionsWithCounts, debugDump } from "@/lib/db";

type Row = Awaited<ReturnType<typeof getSessionsWithCounts>>[number];

export default function RecordScreen() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    await debugDump("records-open");
    const data = await getSessionsWithCounts(50);
    setRows(data);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <FlatList
      contentContainerStyle={styles.wrap}
      data={rows}
      keyExtractor={(x) => String(x.id)}
      ListEmptyComponent={<Text style={styles.empty}>まだ記録がありません</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.exercise_name ?? "（不明な種目）"}</Text>
          <Text>開始: {new Date(item.started_at).toLocaleString()}</Text>
          <Text>セット数: {item.set_count}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  card: { backgroundColor: "#fff", borderColor: "#e5e7eb", borderWidth: 1, borderRadius: 12, padding: 14 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  empty: { textAlign: "center", marginTop: 40, color: "#6b7280" },
});
