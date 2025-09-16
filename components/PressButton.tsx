import React, { PropsWithChildren, useRef } from "react";
import { Animated, Easing, GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

type Props = PropsWithChildren<{
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}>;

export default function PressButton({ children, onPress, style, disabled }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const to = (s: number, o: number) =>
    Animated.parallel([
      Animated.timing(scale,   { toValue: s, duration: 90,  easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: o, duration: 90,  easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();

  return (
    <Animated.View
      style={[style, { transform: [{ scale }], opacity }]}
      // アクセシビリティ的に押下領域として扱う
      accessible accessibilityRole="button"
      // タップ挙動
      onTouchStart={() => !disabled && to(0.98, 0.9)}
      onTouchEnd={() => !disabled && to(1, 1)}
      onTouchCancel={() => !disabled && to(1, 1)}
      // 実際の onPress はここ
      onStartShouldSetResponder={() => true}
      onResponderRelease={(e) => {
        if (!disabled) {
          to(1, 1);
          onPress?.(e);
        }
      }}
    >
      {children}
    </Animated.View>
  );
}
