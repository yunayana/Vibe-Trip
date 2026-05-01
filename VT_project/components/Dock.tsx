import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

type DockItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  href: string;
};

type DockProps = {
  items: DockItem[];
};

export default function Dock({ items }: DockProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === `/(main)/${href}` || pathname.endsWith(`/${href}`);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.dock}>
        {items.map((item) => {
          const active = isActive(item.href);
          const iconName = active ? item.activeIcon || item.icon : item.icon;

          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(`/(main)/${item.href}` as any)}
              style={[styles.item, active && styles.itemActive]}
            >
              <Ionicons
                name={iconName}
                size={20}
                color={active ? '#F5F3EE' : '#8C8C92'}
              />
              <Text style={[styles.label, active && styles.labelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16,16,16,0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  item: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  itemActive: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#343434',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C8C92',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: '#F5F3EE',
  },
});