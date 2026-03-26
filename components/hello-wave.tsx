import { useEffect } from "react";
import { TextStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export function HelloWave() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }),
        withTiming(-15, { duration: 150 }),
        withTiming(0, { duration: 150 }),
      ),
      3,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle((): TextStyle => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return <Animated.Text style={animatedStyle}>👋</Animated.Text>;
}
