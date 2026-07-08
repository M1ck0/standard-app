import { useEffect } from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { Platform } from 'react-native';

import { NotificationPermissionPrompt } from '@/components/notification-permission-prompt';

const GOLD = '#DAA520';

SplashScreen.preventAutoHideAsync();

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize('adc74647-9b00-4b2e-bcb3-a3f2b54f4975');

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const listener = (event: any) => {
      const link =
        Platform.OS === 'android'
          ? JSON.parse(JSON.parse(event.notification.rawPayload).custom).a.novost
          : event.notification.rawPayload.custom.a.novost;

      router.navigate({ pathname: '/', params: { link } });
    };

    OneSignal.Notifications.addEventListener('click', listener);
    return () => OneSignal.Notifications.removeEventListener('click', listener);
  }, [router]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <NativeTabs
        backgroundColor="#ffffff"
        disableTransparentOnScrollEdge
        iconColor={{ default: '#000000', selected: GOLD }}
        indicatorColor={GOLD}
        labelStyle={{
          default: { color: '#000000', fontSize: 11 },
          selected: { color: GOLD, fontSize: 11, fontWeight: '700' },
        }}>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Naslovna</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="istaknuto">
          <NativeTabs.Trigger.Label>Istaknuto</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'star', selected: 'star.fill' }} md="star" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="najnovije">
          <NativeTabs.Trigger.Label>Najnovije</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="clock" md="schedule" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="video">
          <NativeTabs.Trigger.Label>Video</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: 'play.rectangle', selected: 'play.rectangle.fill' }} md="play_circle" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="pretraga">
          <NativeTabs.Trigger.Label>Pretraga</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
        </NativeTabs.Trigger>
      </NativeTabs>
      <NotificationPermissionPrompt />
    </>
  );
}
