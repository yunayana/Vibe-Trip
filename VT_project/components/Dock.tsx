import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type DockItem = {
  label: string;
  icon: string;      // na razie emoji
  href: string;      // np. '/dashboard'
};

type Props = {
  items: DockItem[];
};

export default function Dock({ items }: Props) {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        // Check if current path matches (handle both absolute and relative paths)
        const isActive = pathname.includes(item.href);

        return (
          <Pressable
            key={item.href}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => {
              if (!isActive) router.push(`/(main)/${item.href}` as any);
            }}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#120F17',
    borderWidth: 1,
    borderColor: '#222',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 16,
  },
  itemActive: {
    backgroundColor: '#1D1A25',
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    color: '#9BA0B0',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});