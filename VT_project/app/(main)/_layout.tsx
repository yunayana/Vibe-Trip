import { Stack } from "expo-router";
import { View } from "react-native";
import Dock from "../../components/Dock";

export default function MainLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Dock
        items={[
          { label: "Home", icon: "🏠", href: "dashboard" },
          { label: "AI", icon: "🤖", href: "ai-search" },
          { label: "Saved", icon: "❤️", href: "saved-places" },
          { label: "Profile", icon: "👤", href: "profile" },
        ]}
      />
    </View>
  );
}