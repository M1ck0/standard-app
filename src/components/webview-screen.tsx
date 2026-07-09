import { useCallback, useEffect, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHandler, Image, Platform, Pressable, Share, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { SITE_HOST, siteUrl } from '@/constants/site';
import { CategoryBar } from '@/components/category-bar';
import { ArticleSkeleton } from '@/components/article-skeleton';

const ICON_SIZE = 22;
const ICON_COLOR = '#111';

const LOGO_ASPECT_RATIO = 2986 / 699;
const LOGO_HEIGHT = 34;

// Appended to the WebView's User-Agent so the website knows it's rendered inside
// the native app and hides its own header/bottom nav/footer/ads (see the site's
// `_document.js` `in-app` detection), which the native chrome + tab bar replace.
const IN_APP_USER_AGENT = 'standard-mobile-app';

// Hermes doesn't reliably implement the URL global without a polyfill, so these
// parse the host/pathname with regexes instead of relying on `new URL(...)`.
function pathnameOf(url: string) {
  const path = url.match(/^[a-zA-Z][\w+.-]*:\/\/[^/]+(\/[^?#]*)?/)?.[1] || '/';
  return path.replace(/\/$/, '') || '/';
}

function hostOf(url: string) {
  return url.match(/^[a-zA-Z][\w+.-]*:\/\/([^/?#]+)/)?.[1] || '';
}

// An article is a same-site URL with a category + slug (2+ path segments), e.g.
// `/politika/some-slug`. Category/listing pages have a single segment (`/politika`).
function isArticleUrl(url: string) {
  if (!hostOf(url).endsWith(SITE_HOST)) return false;
  return pathnameOf(url).split('/').filter(Boolean).length >= 2;
}

export function WebViewScreen({ homeUrl, onBack }: { homeUrl: string; onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(homeUrl);
  const [loading, setLoading] = useState(true);
  // WKWebView sometimes reports `canGoBack: true` after the very first load
  // (e.g. an https/trailing-slash redirect adds a phantom history entry), which
  // made the back button silently no-op instead of leaving the article — it
  // called the WebView's own internal goBack() into that redirect instead of
  // popping the native screen. Ignore canGoBack until the first load actually
  // finishes, so only *real* in-page navigations afterward count.
  const hasLoadedOnce = useRef(false);
  // react-native-webview's native pull-to-refresh (iOS) occasionally hands the
  // underlying WKWebView an empty URL to reload, which fails immediately with
  // NSURLErrorDomain -1004 "Could not connect to the server" even though the
  // page had already loaded fine. Recover by asking the page's own JS to
  // reload itself, which goes through the normal web navigation path instead
  // of the native reload() call that misfired. Guarded to retry once per
  // failure so a genuine connectivity problem doesn't loop forever.
  const didAttemptReloadRecovery = useRef(false);

  const handleError = useCallback((event: WebViewErrorEvent) => {
    const { code, url, domain } = event.nativeEvent;
    if (hasLoadedOnce.current && !didAttemptReloadRecovery.current && domain === 'NSURLErrorDomain' && code === -1004 && !url) {
      didAttemptReloadRecovery.current = true;
      webViewRef.current?.injectJavaScript('window.location.reload(); true;');
    }
  }, []);

  // When `onBack` is set this screen is a pushed article: it shows a back button
  // (which pops the native route) and a share action. Category listing pages
  // (browsing within a tab) show neither — only the post/article screen does.
  const isArticle = !!onBack;
  const isDetailPage = pathnameOf(currentUrl) !== pathnameOf(homeUrl);
  const showBack = isArticle;
  const showActions = isArticle;
  const showCategories = !isArticle;

  const goHome = useCallback(() => {
    webViewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(homeUrl)}; true;`);
  }, [homeUrl]);

  const navigateToPath = useCallback((path: string) => {
    webViewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(siteUrl(path))}; true;`);
  }, []);

  const handleBack = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    } else if (onBack) {
      onBack();
    } else {
      goHome();
    }
  }, [canGoBack, onBack, goHome]);

  const share = useCallback(() => {
    Share.share({ message: currentUrl });
  }, [currentUrl]);

  // Intercept taps on article links and push them as native screens instead of
  // navigating inline, so they slide in and support the native swipe-back gesture.
  const onShouldStartLoadWithRequest = useCallback(
    (request: { url: string; isTopFrame?: boolean }) => {
      if (request.isTopFrame === false) return true;
      const isOwnPage = pathnameOf(request.url) === pathnameOf(homeUrl);
      if (!isOwnPage && isArticleUrl(request.url)) {
        router.push({ pathname: '/article', params: { url: request.url } });
        return false;
      }
      return true;
    },
    [homeUrl, router],
  );

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onAndroidBackPress = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      if (onBack) {
        onBack();
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
  }, [canGoBack, onBack, isDetailPage, goHome]);

  return (
    <View style={styles.container}>
      <Animated.View
        layout={LinearTransition.duration(220)}
        style={[
          styles.header,
          { paddingTop: insets.top + 10, paddingLeft: insets.left + 16, paddingRight: insets.right + 16 },
        ]}>
        <View style={styles.leftGroup}>
          {showBack && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
              <Pressable style={styles.circleButton} onPress={handleBack} hitSlop={8}>
                <Ionicons name="chevron-back" size={ICON_SIZE} color={ICON_COLOR} style={styles.backIcon} />
              </Pressable>
            </Animated.View>
          )}
        </View>

        <View style={styles.logoWrap}>
          <Image
            source={require('../../assets/images/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Animated.View layout={LinearTransition.duration(220)} style={styles.rightGroup}>
          {showActions && (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
              <Pressable style={styles.circleButton} onPress={share} hitSlop={8}>
                <Ionicons name="share-outline" size={ICON_SIZE} color={ICON_COLOR} />
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>

      {showCategories && (
        <CategoryBar
          activePath={pathnameOf(currentUrl)}
          onSelect={navigateToPath}
          insetLeft={insets.left}
          insetRight={insets.right}
        />
      )}

      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right },
        ]}>
        <WebView
          ref={webViewRef}
          key={homeUrl}
          source={{ uri: homeUrl }}
          style={styles.webview}
          applicationNameForUserAgent={IN_APP_USER_AGENT}
          pullToRefreshEnabled
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onNavigationStateChange={(navState) => {
            if (hasLoadedOnce.current) {
              setCanGoBack(navState.canGoBack);
            }
            setCurrentUrl(navState.url);
          }}
          onLoadEnd={() => {
            setLoading(false);
            didAttemptReloadRecovery.current = false;
            if (!hasLoadedOnce.current) {
              hasLoadedOnce.current = true;
              setCanGoBack(false);
            }
          }}
          onError={handleError}
          decelerationRate={Platform.OS === 'ios' ? 'normal' : undefined}
          allowsBackForwardNavigationGestures={!isArticle}
        />
        {isArticle && loading && <ArticleSkeleton />}
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
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E2E2',
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 40,
  },
  rightGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 40,
    gap: 10,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  logo: {
    width: Math.round(LOGO_HEIGHT * LOGO_ASPECT_RATIO),
    height: LOGO_HEIGHT,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    marginLeft: -2,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
