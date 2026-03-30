import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";

type ParallaxScrollViewProps = ScrollViewProps & {
  headerImage?: React.ReactNode;
  headerBackgroundColor?: { light?: string; dark?: string };
  children: React.ReactNode;
  headerHeight?: number;
};

export default function ParallaxScrollView({
  headerImage,
  headerBackgroundColor,
  children,
  headerHeight = 200,
  style,
  ...rest
}: ParallaxScrollViewProps) {
  const theme = useColorScheme();

  const backgroundColor =
    theme === "dark"
      ? (headerBackgroundColor?.dark ?? "#111")
      : (headerBackgroundColor?.light ?? "#fff");

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <View
        className="w-full overflow-hidden relative"
        style={{ height: headerHeight }}
      >
        {headerImage}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        style={style}
        {...rest}
      >
        {children}
      </ScrollView>
    </View>
  );
}
