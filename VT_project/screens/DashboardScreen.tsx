import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../src/lib/supabase';

const VIBES = [
  { key: 'party', label: '🎉 Party', description: 'nightclub, bar, pub' },
  { key: 'relax', label: '☕ Relax', description: 'cafe, restaurant' },
  { key: 'culture', label: '🏛️ Culture', description: 'museum, gallery' },
  { key: 'nature', label: '🌲 Nature', description: 'park, green space' },
  { key: 'mysterious', label: '🧭 Mysterious', description: 'ruins, castle' },
  { key: 'sunset', label: '🌅 Sunset', description: 'viewpoint' },
  { key: 'sad', label: '🕯️ Sad', description: 'historic cemetery' },
  { key: 'lonely', label: '📚 Lonely', description: 'library' },
];

const CITIES = [
  'Warsaw', 'Gdansk', 'Krakow', 'Wroclaw', 'Poznan',
  'Paris', 'London', 'Berlin', 'Amsterdam', 'Barcelona',
  'Madrid', 'Rome', 'Venice', 'Monaco', 'Prague', 'Vienna', 'Lisbon',
  'Dubai', 'Singapore', 'Tokyo', 'Sydney', 'Bangkok',
  'Istanbul', 'Miami', 'Los Angeles', 'New York',
];

export default function DashboardScreen() {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedVibe) {
      Alert.alert('Wybierz vibe', 'Najpierw wybierz klimat podróży.');
      return;
    }

    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const prompt = `I want to explore ${randomCity} with a ${selectedVibe} vibe`;

    setIsLoading(true);
    try {
      console.log('🚀 Dashboard → Supabase, prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('analyze-vibe', {
        body: { prompt },
      });

      console.log('📥 RESPONSE:', { data, error });

      if (error) throw new Error(error.message || 'Błąd serwera');

      if (data && data.places && data.places.length > 0) {
        router.push({
          pathname: '/(main)/result',
          params: {
            vibe: data.vibe,
            location: data.location,
            places: JSON.stringify(data.places),
            refreshKey: Date.now().toString(),
          },
        });
      } else {
        Alert.alert(
          'Brak wyników',
          `Nie znaleziono miejsc w ${randomCity} dla vibe'u "${selectedVibe}". Spróbuj ponownie — wylosuję inne miasto.`
        );
      }
    } catch (e: any) {
      console.error('Błąd Dashboard generate:', e.message);
      Alert.alert('Błąd', 'Coś poszło nie tak. Spróbuj jeszcze raz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#050505', '#090909', '#101114', '#161821']}
      locations={[0, 0.35, 0.72, 1]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.overline}>VibeTrip</Text>
          <Text style={styles.title}>Wybierz swój vibe</Text>
          <Text style={styles.subtitle}>
            Wylosujemy miejsce dopasowane do Twojego nastroju
          </Text>

          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Dostepne klimaty</Text>

            <View style={styles.vibesGrid}>
              {VIBES.map((vibe) => (
                <Pressable
                  key={vibe.key}
                  style={[
                    styles.vibeChip,
                    selectedVibe === vibe.key && styles.activeVibe,
                  ]}
                  onPress={() => setSelectedVibe(vibe.key)}
                  disabled={isLoading}
                >
                  <Text style={styles.vibeLabel}>{vibe.label}</Text>
                  <Text style={styles.vibeDesc}>{vibe.description}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={[
              styles.primaryButton,
              (!selectedVibe || isLoading) && styles.disabledButton,
            ]}
            onPress={handleGenerate}
            disabled={!selectedVibe || isLoading}
          >
            {isLoading ? (
              <View style={styles.loaderRow}>
                <ActivityIndicator color="#F5F3EE" />
                <Text style={[styles.primaryButtonText, { marginLeft: 10 }]}>
                  Szukam miejsca...
                </Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>🎲 Wylosuj miejsce</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/(main)/ai-search')}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>🤖 Szukaj przez AI</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/(main)/saved-places')}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>❤️ Zapisane miejsca</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/(main)/profile')}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>👤 Profil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 160,
  },
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'transparent',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  overline: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8C8C92',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F5F3EE',
    marginBottom: 8,
    letterSpacing: 0.4,
    fontFamily: 'ProfileHeading',
  },
  subtitle: {
    fontSize: 15,
    color: '#9A9A9F',
    marginBottom: 28,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#101010',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#232323',
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F5F3EE',
    marginBottom: 18,
    letterSpacing: 0.3,
    fontFamily: 'ProfileHeading',
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vibeChip: {
    width: '47%',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  activeVibe: {
    backgroundColor: '#1D1D1D',
    borderColor: '#6C6C6C',
  },
  vibeLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5F3EE',
    textAlign: 'center',
  },
  vibeDesc: {
    fontSize: 11,
    color: '#8C8C92',
    marginTop: 4,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2F2F32',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A4A4E',
  },
  primaryButtonText: {
    color: '#F5F3EE',
    fontSize: 15,
    fontWeight: '800',
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#3F3F3F',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#F5F3EE',
    fontSize: 15,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.6,
  },
});