import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../src/lib/supabase';

const VIBES = [
  { key: 'party',      label: '🎉 Party',      color: '#FFE0F0', description: 'nightclub, bar, pub' },
  { key: 'relax',      label: '☕ Relax',       color: '#D0F4FF', description: 'cafe, restaurant' },
  { key: 'culture',    label: '🏛️ Culture',    color: '#E3E7FF', description: 'museum, gallery' },
  { key: 'nature',     label: '🌲 Nature',      color: '#DDF7E3', description: 'park, green space' },
  { key: 'mysterious', label: '🧭 Mysterious',  color: '#EDE0FF', description: 'ruins, castle' },
  { key: 'sunset',     label: '🌅 Sunset',      color: '#FFECD2', description: 'viewpoint' },
  { key: 'sad',        label: '🕯️ Sad',         color: '#E8E8E8', description: 'historic cemetery' },
  { key: 'lonely',     label: '📚 Lonely',      color: '#E0F0FF', description: 'library' },
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
      console.log("🚀 Dashboard → Supabase, prompt:", prompt);

      const { data, error } = await supabase.functions.invoke('analyze-vibe', {
        body: { prompt }
      });

      console.log("📥 RESPONSE:", { data, error });

      if (error) throw new Error(error.message || "Błąd serwera");

      if (data && data.places && data.places.length > 0) {
        router.push({
          pathname: '/(main)/result',
          params: {
            vibe: data.vibe,
            location: data.location,
            places: JSON.stringify(data.places),
            refreshKey: Date.now().toString(),
          }
        });
      } else {
        Alert.alert(
          "Brak wyników",
          `Nie znaleziono miejsc w ${randomCity} dla vibe'u "${selectedVibe}". Spróbuj ponownie — wylosuję inne miasto.`
        );
      }
    } catch (e: any) {
      console.error("Błąd Dashboard generate:", e.message);
      Alert.alert("Błąd", "Coś poszło nie tak. Spróbuj jeszcze raz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.logo}>🌍 VibeTrip</Text>
        <Text style={styles.title}>Wybierz swój vibe</Text>
        <Text style={styles.subtitle}>
          Wylosujemy miejsce dopasowane do Twojego nastroju
        </Text>

        <View style={styles.vibesGrid}>
          {VIBES.map((vibe) => (
            <Pressable
              key={vibe.key}
              style={[
                styles.vibeChip,
                { backgroundColor: vibe.color },
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

        <Pressable
          style={[styles.generateButton, (!selectedVibe || isLoading) && styles.disabledButton]}
          onPress={handleGenerate}
          disabled={!selectedVibe || isLoading}
        >
          {isLoading ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={[styles.generateText, { marginLeft: 10 }]}>Szukam miejsca...</Text>
            </View>
          ) : (
            <Text style={styles.generateText}>🎲 Wylosuj miejsce</Text>
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
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#F7F8FA' },
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 96,
  },
  logo: { fontSize: 24, fontWeight: '700', color: '#1E2A38', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#1E2A38', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#5B6470', marginBottom: 24 },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  vibeChip: {
    width: '47%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  activeVibe: {
    borderWidth: 2,
    borderColor: '#1E2A38',
  },
  vibeLabel: { fontSize: 16, fontWeight: '700', color: '#1E2A38' },
  vibeDesc: { fontSize: 11, color: '#5B6470', marginTop: 2 },
  generateButton: {
    backgroundColor: '#2D6A8A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: { backgroundColor: '#94A3B8' },
  generateText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loaderRow: { flexDirection: 'row', alignItems: 'center' },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D9E0E6',
  },
  secondaryButtonText: { color: '#1E2A38', fontSize: 15, fontWeight: '600' },
});