import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ACTIVE_CATEGORY_TEXT_COLOR, CATEGORIES, PROMO_CATEGORY_NAME } from '@/constants/categories';

export function CategoryBar({
  activePath,
  onSelect,
  insetLeft = 0,
  insetRight = 0,
}: {
  activePath: string;
  onSelect: (path: string) => void;
  insetLeft?: number;
  insetRight?: number;
}) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, { paddingLeft: insetLeft + 16, paddingRight: insetRight + 16 }]}>
        {CATEGORIES.map((category) => {
          const isPromo = category.name === PROMO_CATEGORY_NAME;
          const isActive = category.path === activePath;

          if (isPromo) {
            return (
              <Pressable key={category.path} onPress={() => onSelect(category.path)} style={styles.promoPill}>
                <Text style={styles.promoText}>M:TEL</Text>
                <Text style={styles.promoText}>TEHNOLOGIJA</Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={category.path}
              onPress={() => onSelect(category.path)}
              style={[
                styles.pill,
                isActive && { backgroundColor: `${category.color}26`, borderColor: category.color },
              ]}>
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{category.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#F7F7FB',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E2E2',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    textTransform: 'uppercase',
  },
  pillTextActive: {
    color: ACTIVE_CATEGORY_TEXT_COLOR,
  },
  promoPill: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
});
