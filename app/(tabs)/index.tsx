// app/(tabs)/index.tsx
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Kintore v4!</Text>

      <Link href="/(tabs)/exercises" asChild>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>種目を選ぶ</Text>
        </TouchableOpacity>
      </Link>

      <View style={{ height: 12 }} />

      <Link href="/(tabs)/records" asChild>
        <TouchableOpacity style={styles.btnOutline}>
          <Text style={styles.btnOutlineText}>記録画面へ</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center", padding: 16 },
  title: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 24 },
  btn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  btnText: { color: "#1f2937", fontSize: 16, fontWeight: "700" },
  btnOutline: { borderWidth: 2, borderColor: "#fff", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12 },
  btnOutlineText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
