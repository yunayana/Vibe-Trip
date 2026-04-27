import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useVibeStore } from '../store/vibeStore';

export default function ResultsScreen() {
  const { selectedVibe } = useVibeStore();

  const placesByVibe = {
    chill: {
      placeName: 'Santorini, Grecja',
      vibe: '🌴 Chill',
      reason:
        'Santorini pasuje do vibe chill dzięki spokojnym widokom, zachodom słońca i relaksującej atmosferze.',
      shortInfo:
        'Grecka wyspa znana z białej architektury, morza i spokojnego wypoczynku.',
    },
    party: {
      placeName: 'Barcelona, Hiszpania',
      vibe: '🎉 Party',
      reason:
        'Barcelona pasuje do vibe party dzięki plażom, klubom i nocnej atmosferze.',
      shortInfo:
        'Śródziemnomorskie miasto z plażą, architekturą Gaudiego i tętniącym życiem nocnym.',
    },
    nature: {
      placeName: 'Zakopane, Polska',
      vibe: '🌲 Nature',
      reason:
        'Zakopane pasuje do vibe nature dzięki górom, szlakom i bliskości przyrody.',
      shortInfo:
        'Popularne górskie miasto idealne na wypoczynek w naturze i aktywne wyjazdy.',
    },
    city: {
      placeName: 'Amsterdam, Holandia',
      vibe: '🏙️ City',
      reason:
        'Amsterdam pasuje do vibe city dzięki miejskiej energii, kanałom, muzeom i klimatowi europejskiej stolicy.',
      shortInfo:
        'Nowoczesne, klimatyczne miasto pełne rowerów, kultury i życia miejskiego.',
    },
    mystery: {
      placeName: 'Sintra, Portugalia',
      vibe: '🧭 Mystery',
      reason:
        'Sintra pasuje do vibe mystery dzięki zamkom, mglistym wzgórzom i baśniowemu klimatowi.',
      shortInfo:
        'Malownicze portugalskie miasteczko pełne tajemniczych pałaców i niezwykłej atmosfery.',
    },
  };

  const fallbackPlace = {
    placeName: 'Brak wybranego miejsca',
    vibe: 'Nie wybrano vibe',
    reason: 'Najpierw wróć do dashboardu i wybierz klimat podróży.',
    shortInfo: 'Po wybraniu vibe aplikacja pokaże dopasowany kierunek podróży.',
  };

  const result =
    selectedVibe && placesByVibe[selectedVibe]
      ? placesByVibe[selectedVibe]
      : fallbackPlace;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Twoje wylosowane miejsce</Text>
      <Text style={styles.placeName}>{result.placeName}</Text>

      <View style={styles.card}>
        <Text style={styles.vibeLabel}>Vibe</Text>
        <Text style={styles.vibeValue}>{result.vibe}</Text>

        <Text style={styles.sectionTitle}>Dlaczego to miejsce?</Text>
        <Text style={styles.text}>{result.reason}</Text>

        <Text style={styles.sectionTitle}>Krótki opis</Text>
        <Text style={styles.text}>{result.shortInfo}</Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push('/place-details')}
      >
        <Text style={styles.primaryText}>Zobacz szczegóły i mapę</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryText}>🎲 Wylosuj ponownie (wróć)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  label: {
    fontSize: 14,
    color: '#5B6470',
    marginBottom: 4,
  },
  placeName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E2A38',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E1E5EC',
  },
  vibeLabel: {
    fontSize: 13,
    color: '#7A8494',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  vibeValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#1E2A38',
  },
  text: {
    fontSize: 14,
    color: '#444A55',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#2D6A8A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#2D6A8A',
    fontSize: 14,
    fontWeight: '500',
  },
});