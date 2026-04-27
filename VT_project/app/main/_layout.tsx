import { Stack } from 'expo-router';
import { View } from 'react-native';
import Dock from '../../components/Dock';

export default function MainLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <Dock
        items={[
          { label: 'Home', icon: '🏠', href: '/main/dashboard' },
          { label: 'AI', icon: '🤖', href: '/main/ai-search' },
          { label: 'Saved', icon: '❤️', href: '/main/saved-places' },
          { label: 'Profile', icon: '👤', href: '/main/profile' },
        ]}
      />
    </View>
  );
}