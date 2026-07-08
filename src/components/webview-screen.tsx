import { useCallback, useEffect, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHandler, Image, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

const LOGO_ASPECT_RATIO = 2986 / 699;

// The site renders its own bottom nav (Naslovna/Istaknuto/.../Pretraga), which now
// duplicates the native tab bar. Hide it until that's removed on the website side.
const HIDE_SITE_BOTTOM_NAV_JS = `
(function () {
  function hideBottomNav() {
    var requiredHrefs = ['/istaknuto', '/video', '/pretraga'];
    var anchor = document.querySelector('a[href="/istaknuto"]');
    var el = anchor;
    for (var i = 0; i < 6 && el; i++) {
      var hasAll = requiredHrefs.every(function (href) {
        return el.querySelector('a[href="' + href + '"]');
      });
      if (hasAll) {
        el.style.setProperty('display', 'none', 'important');
        return;
      }
      el = el.parentElement;
    }
  }
  hideBottomNav();
})();
true;
`;

function pathnameOf(url: string) {
  // Hermes doesn't reliably implement the URL global without a polyfill, so this
  // extracts the pathname with a regex instead of relying on `new URL(...)`.
  const path = url.match(/^[a-zA-Z][\w+.-]*:\/\/[^/]+(\/[^?#]*)?/)?.[1] || '/';
  return path.replace(/\/$/, '') || '/';
}

export function WebViewScreen({ homeUrl, initialUrl }: { homeUrl: string; initialUrl?: string }) {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const startUrl = initialUrl || homeUrl;
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(startUrl);

  const isDetailPage = pathnameOf(currentUrl) !== pathnameOf(homeUrl);

  const goHome = useCallback(() => {
    webViewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(homeUrl)}; true;`);
  }, [homeUrl]);

  const goBack = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    } else {
      goHome();
    }
  }, [canGoBack, goHome]);

  const refresh = useCallback(() => {
    webViewRef.current?.reload();
  }, []);

  const share = useCallback(() => {
    Share.share({ message: currentUrl });
  }, [currentUrl]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onAndroidBackPress = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      if (isDetailPage) {
        goHome();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => subscription.remove();
  }, [canGoBack, isDetailPage, goHome]);

  return (
    <View style={styles.container}>
      <Animated.View
        layout={LinearTransition.duration(220)}
        style={[
          styles.header,
          { paddingTop: insets.top + 10, paddingLeft: insets.left + 12, paddingRight: insets.right + 12 },
        ]}>
        <View style={styles.sideGroup}>
          {isDetailPage && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
              <Pressable style={styles.iconButton} onPress={goBack} hitSlop={8}>
                <Text style={styles.icon}>‹</Text>
              </Pressable>
            </Animated.View>
          )}
        </View>

        <View style={styles.logoWrap}>
          <Image source={require('../../assets/images/splash-icon.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Animated.View layout={LinearTransition.duration(220)} style={[styles.sideGroup, styles.rightGroup]}>
          <Pressable style={styles.iconButton} onPress={refresh} hitSlop={8}>
            <Text style={styles.icon}>⟳</Text>
          </Pressable>
          {isDetailPage && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
              <Pressable style={styles.iconButton} onPress={share} hitSlop={8}>
                <Text style={styles.icon}>↗</Text>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>

      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right },
        ]}>
        <WebView
          ref={webViewRef}
          key={startUrl}
          source={{ uri: startUrl }}
          style={styles.webview}
          injectedJavaScript={HIDE_SITE_BOTTOM_NAV_JS}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setCurrentUrl(navState.url);
            if (!navState.loading) {
              webViewRef.current?.injectJavaScript(HIDE_SITE_BOTTOM_NAV_JS);
            }
          }}
          decelerationRate="normal"
          allowsBackForwardNavigationGestures
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E2E2',
  },
  sideGroup: {
    flexDirection: 'row',
    minHeight: 36,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: 26,
    aspectRatio: LOGO_ASPECT_RATIO,
  },
  rightGroup: {
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    color: '#000',
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
