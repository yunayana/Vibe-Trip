import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useVibeStore } from '../store/vibeStore';

export default function DashboardScreen() {
  const { selectedVibe, setSelectedVibe } = useVibeStore();

  const handleGenerate = () => {
    if (!selectedVibe) {
      Alert.alert('Wybierz vibe', 'Najpierw wybierz klimat podróży.');
      return;
    }

    router.push('/results');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.logo}>🌍 VibeTrip</Text>
        <Text style={styles.title}>Wybierz swój vibe</Text>
        <Text style={styles.subtitle}>
          Wylosujemy miejsce w Europie dopasowane do Twojego nastroju
        </Text>

        <View style={styles.vibesRow}>
          <Pressable
            style={[
              styles.vibeChip,
              styles.vibeChill,
              selectedVibe === 'chill' && styles.activeVibe,
            ]}
            onPress={() => setSelectedVibe('chill')}
          >
            <Text style={styles.vibeText}>🌴 Chill</Text>
          </Pressable>

          <Pressable
            style={[
              styles.vibeChip,
              styles.vibeParty,
              selectedVibe === 'party' && styles.activeVibe,
            ]}
            onPress={() => setSelectedVibe('party')}
          >
            <Text style={styles.vibeText}>🎉 Party</Text>
          </Pressable>
        </View>

        <View style={styles.vibesRow}>
          <Pressable
            style={[
              styles.vibeChip,
              styles.vibeNature,
              selectedVibe === 'nature' && styles.activeVibe,
            ]}
            onPress={() => setSelectedVibe('nature')}
          >
            <Text style={styles.vibeText}>🌲 Nature</Text>
          </Pressable>

          <Pressable
            style={[
              styles.vibeChip,
              styles.vibeCity,
              selectedVibe === 'city' && styles.activeVibe,
            ]}
            onPress={() => setSelectedVibe('city')}
          >
            <Text style={styles.vibeText}>🏙️ City</Text>
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.vibeChipWide,
            selectedVibe === 'mystery' && styles.activeVibe,
          ]}
          onPress={() => setSelectedVibe('mystery')}
        >
          <Text style={styles.vibeText}>🧭 Mystery</Text>
        </Pressable>

        <Pressable style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateText}>🎲 Wylosuj miejsce</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/saved-places')}
        >
          <Text style={styles.secondaryButtonText}>❤️ Zapisane miejsca</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.secondaryButtonText}>👤 Profil</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/ai-search')}
        >
          <Text style={styles.secondaryButtonText}>🤖 AI Search</Text>
        </Pressable>

        <Text style={styles.selectedInfo}>
          Wybrany vibe: {selectedVibe ? selectedVibe : 'brak'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 96,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2A38',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E2A38',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#5B6470',
    marginBottom: 28,
  },
  vibesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  vibeChip: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  vibeChipWide: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 32,
    backgroundColor: '#3D2A5F',
  },
  vibeChill: {
    backgroundColor: '#D0F4FF',
  },
  vibeParty: {
    backgroundColor: '#FFE0F0',
  },
  vibeNature: {
    backgroundColor: '#DDF7E3',
  },
  vibeCity: {
    backgroundColor: '#E3E7FF',
  },
  activeVibe: {
    borderWidth: 2,
    borderColor: '#1E2A38',
  },
  vibeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2A38',
  },
  generateButton: {
    backgroundColor: '#2D6A8A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  generateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#D9E0E6',
  },
  secondaryButtonText: {
    color: '#1E2A38',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedInfo: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 14,
    color: '#5B6470',
  },
});