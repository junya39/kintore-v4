import { View, Text, StyleSheet } from "react-native";

export default function RecordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>トレーニング記録</Text>
      <Text>あとでセット入力や保存を実装します。</Text>
    </View>
  );
}

const styles =StyleSheet.create({
  container: { flex:1, backgroundColor:"#fff", padding: 16, justifyContent:"center" },
  title: { fontSize:22, fontWeight: "800", marginBottom:8},
});