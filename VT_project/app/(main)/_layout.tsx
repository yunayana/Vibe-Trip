import { Stack } from 'expo-router';
import { View } from 'react-native';
import Dock from '../../components/Dock';

export default function MainLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#050505' }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Dock
        items={[
          { label: 'Home', icon: 'home-outline', activeIcon: 'home', href: 'dashboard' },
          { label: 'AI', icon: 'sparkles-outline', activeIcon: 'sparkles', href: 'ai-search' },
          { label: 'Saved', icon: 'bookmark-outline', activeIcon: 'bookmark', href: 'saved-places' },
          { label: 'Profile', icon: 'person-outline', activeIcon: 'person', href: 'profile' },
        ]}
      />
    </View>
  );
}