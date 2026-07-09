import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { Appearance, Platform } from "react-native";

import { NotificationPermissionPrompt } from "@/components/notification-permission-prompt";

SplashScreen.preventAutoHideAsync();

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize("adc74647-9b00-4b2e-bcb3-a3f2b54f4975");

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const listener = (event: any) => {
      const url =
        Platform.OS === "android"
          ? JSON.parse(JSON.parse(event.notification.rawPayload).custom).a
              .novost
          : event.notification.rawPayload.custom.a.novost;

      router.push({ pathname: "/article", params: { url } });
    };

    OneSignal.Notifications.addEventListener("click", listener);
    return () => OneSignal.Notifications.removeEventListener("click", listener);
  }, [router]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Forces the native layer to respect your internal theme
    Appearance.setColorScheme("light");
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="article" />
      </Stack>
      <NotificationPermissionPrompt />
    </>
  );
}
