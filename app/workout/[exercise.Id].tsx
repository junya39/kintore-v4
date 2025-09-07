import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ready, insertSet } from "@/lib/db";

export default function WorkoutScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [dbReady, setDbReady] = useState(false);

  // DB準備が完了したらフラグをtrueに
  useEffect(() => {
    ready.then(() => setDbReady(true));
  }, []);

  const saveAll = async () => {
    try {
      // ここでは仮に workoutId=1, setIndex=1 としている
      // あなたのコードに合わせて引数を調整してね
      await insertSet(Number(exerciseId), 1, Number(weight), Number(reps));
      Alert.alert("保存しました！");
      router.back(); // 保存後に戻るなら
    } catch (err: any) {
      console.error(err);
      Alert.alert("保存に失敗しました", String(err));
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>重量 (kg)</Text>
      <TextInput
        placeholder="重量"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text>回数</Text>
      <TextInput
        placeholder="回数"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />

      <Button title="保存" disabled={!dbReady} onPress={saveAll} />
      <Button title="戻る" onPress={() => router.back()} />
    </View>
  );
}
