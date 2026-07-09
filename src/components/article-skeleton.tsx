import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const PLACEHOLDER_COLOR = '#E4E4E8';
const GOLD = '#E9AC00';

// Above-the-fold placeholder for the article screen. The native push
// transition happens instantly (unlike a web link click), so without this
// the WebView shows a blank white screen for however long the real page
// takes to load. Mirrors the real post layout (image, category, title,
// byline, excerpt) so there's minimal visual jump once content arrives —
// stops there, matching the site's own "above the fold only" scope.
export function ArticleSkeleton() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container}>
      <Animated.View style={pulseStyle}>
        <View style={styles.image} />
        <View style={styles.card}>
          <View style={styles.categoryBar} />

          <View style={[styles.bar, styles.titleBar]} />
          <View style={[styles.bar, styles.titleBar]} />
          <View style={[styles.bar, styles.titleBar, styles.titleBarShort]} />

          <View style={styles.divider} />

          <View style={styles.bylineRow}>
            <View style={[styles.bar, styles.bylineBar]} />
            <View style={[styles.bar, styles.bylineBarShort]} />
          </View>

          <View style={styles.excerpt}>
            <View style={styles.excerptAccent} />
            <View style={[styles.bar, styles.excerptBar]} />
            <View style={[styles.bar, styles.excerptBar]} />
            <View style={[styles.bar, styles.excerptBar, styles.excerptBarShort]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Matches the card background below so any leftover space under the
    // (fixed-height) placeholder content blends in instead of showing white.
    backgroundColor: '#F7F7FB',
  },
  image: {
    width: '100%',
    height: 260,
    backgroundColor: PLACEHOLDER_COLOR,
  },
  card: {
    marginTop: -20,
    backgroundColor: '#F7F7FB',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  bar: {
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
  categoryBar: {
    width: 70,
    height: 12,
    borderRadius: 4,
    backgroundColor: PLACEHOLDER_COLOR,
    marginBottom: 14,
  },
  titleBar: {
    height: 22,
    width: '100%',
    marginBottom: 10,
  },
  titleBarShort: {
    width: '60%',
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#32323722',
    marginVertical: 20,
  },
  bylineRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bylineBar: {
    width: 96,
    height: 10,
  },
  bylineBarShort: {
    width: 56,
    height: 10,
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: 4,
  },
  excerpt: {
    marginTop: 24,
    paddingLeft: 16,
  },
  excerptAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: GOLD,
  },
  excerptBar: {
    height: 14,
    width: '100%',
    marginBottom: 8,
  },
  excerptBarShort: {
    width: '45%',
    marginBottom: 0,
  },
});
