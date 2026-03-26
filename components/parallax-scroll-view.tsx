import React from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    type ScrollViewProps
} from "react-native";

type ParallaxScrollViewProps = ScrollViewProps & {
  headerImage?: React.ReactNode;
  headerBackgroundColor?: { light?: string; dark?: string };
  children: React.ReactNode;
  headerHeight?: number;
};

import { useColorScheme } from "@/hooks/use-color-scheme";

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
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { height: headerHeight }]}>
        {headerImage}
      </View>

      <ScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={styles.contentContainer}
        {...rest}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});
