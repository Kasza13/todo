import { useColorScheme } from "@/hooks/use-color-scheme";
import { View, type ViewProps } from "react-native";

type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const theme = useColorScheme();

  const backgroundColor =
    theme === "dark" ? (darkColor ?? "#151718") : (lightColor ?? "#ffffff");

  return (
    <View
      className="flex-1"
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
