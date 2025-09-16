// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true, // タブ配下の画面にヘッダーを表示
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      {/* タブ1: ホーム（例） */}
      <Tabs.Screen
        name="index"
        options={{ title: "ホーム", tabBarLabel: "ホーム" }}
      />

      {/* タブ2: 記録（ファイルが app/(tabs)/records.tsx 等にあることを想定） */}
      <Tabs.Screen
        name="records"
        options={{ title: "記録", tabBarLabel: "記録" }}
      />

      {/* タブ3: 種目（ファイルが app/(tabs)/exercises/index.tsx なら name は "exercises/index" でもOK） */}
      <Tabs.Screen
        name="exercises"
        options={{ title: "種目", tabBarLabel: "種目" }}
      />
    </Tabs>
  );
}
