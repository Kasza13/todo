import { Text, type TextProps, type TextStyle } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const theme = useColorScheme();

  const color =
    theme === "dark" ? (darkColor ?? "#ECEDEE") : (lightColor ?? "#11181C");

  return <Text style={[{ color }, typeStyles[type], style]} {...rest} />;
}

const typeStyles: Record<NonNullable<ThemedTextProps["type"]>, TextStyle> = {
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  link: {
    fontSize: 16,
    color: "#0a7ea4",
    textDecorationLine: "underline",
  },
};
