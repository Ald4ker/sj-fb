import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useSettingsStore } from "@/store/settings-store";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const { darkMode } = useSettingsStore();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StatusBar 
          barStyle={darkMode ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        <RootLayoutNav />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        orientation: "landscape",
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Trivia Challenge",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="team-setup" 
        options={{ 
          title: "Team Setup",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="category-selection" 
        options={{ 
          title: "Select Categories",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="question-board" 
        options={{ 
          title: "Question Board",
          animation: "slide_from_right",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="question" 
        options={{ 
          title: "Question",
          animation: "slide_from_bottom",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="answer" 
        options={{ 
          title: "Answer",
          animation: "slide_from_bottom",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="wager" 
        options={{ 
          title: "Wager",
          animation: "slide_from_bottom",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="game-over" 
        options={{ 
          title: "Game Over",
          animation: "slide_from_bottom",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="store" 
        options={{ 
          title: "Token Store",
          animation: "slide_from_right"
        }} 
      />
    </Stack>
  );
}