import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ResultsScreen() {
  // Na razie dane na sztywno – później zastąpimy je AI / logiką.
  const placeName = 'Barcelona, Hiszpania';
  const vibe = '🎉 Party';
  const reason =
    'Barcelona pasuje do vibe party dzięki plażom, klubom i nocnej atmosferze.';
  const shortInfo = 'Śródziemnomorskie miasto z plażą, architekturą Gaudiego i tętniącym życiem nocnym.';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Twoje wylosowane miejsce</Text>
      <Text style={styles.placeName}>{placeName}</Text>

      <View style={styles.card}>
        <Text style={styles.vibeLabel}>Vibe</Text>
        <Text style={styles.vibeValue}>{vibe}</Text>

        <Text style={styles.sectionTitle}>Dlaczego to miejsce?</Text>
        <Text style={styles.text}>{reason}</Text>

        <Text style={styles.sectionTitle}>Krótki opis</Text>
        <Text style={styles.text}>{shortInfo}</Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push('/place_details')}
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
  },
  text: {
    fontSize: 14,
    color: '#444A55',
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