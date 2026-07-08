import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';

const STORAGE_KEY = 'notificationPromptLastShown';
const REPROMPT_INTERVAL_MS = 90 * 24 * 60 * 60 * 1000;

export function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const hasPermission = await OneSignal.Notifications.getPermissionAsync();
      if (hasPermission) return;

      const lastShown = await AsyncStorage.getItem(STORAGE_KEY);
      const dueForReprompt = !lastShown || Date.now() - Number(lastShown) >= REPROMPT_INTERVAL_MS;

      if (!cancelled && dueForReprompt) {
        setVisible(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    AsyncStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  const enable = () => {
    AsyncStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
    OneSignal.Notifications.requestPermission(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Uključi obavještenja</Text>
          <Text style={styles.body}>
            Omogućite obavještenja da biste na vrijeme dobijali najnovije vijesti sa Standarda.
          </Text>
          <View style={styles.actions}>
            <Pressable style={styles.secondaryButton} onPress={dismiss}>
              <Text style={styles.secondaryButtonText}>Ne sada</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={enable}>
              <Text style={styles.primaryButtonText}>Uključi</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
