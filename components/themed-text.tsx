import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text, type TextProps } from "react-native";

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

  const typeClassNames: Record<NonNullable<ThemedTextProps["type"]>, string> = {
    default: "text-base leading-6",
    title: "text-2xl font-bold leading-9",
    subtitle: "text-lg font-semibold leading-7",
    link: "text-base underline",
  };

  return (
    <Text
      className={typeClassNames[type]}
      style={[type === "link" ? { color: "#0a7ea4" } : { color }, style]}
      {...rest}
    />
  );
}
