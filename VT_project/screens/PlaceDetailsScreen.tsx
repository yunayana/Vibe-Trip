import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function PlaceDetailsScreen() {
  const placeName = 'Barcelona, Hiszpania';

  return (
    <View style={styles.container}>
      <Text style={styles.placeName}>{placeName}</Text>
      <Text style={styles.vibe}>🎉 Party vibe</Text>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>[Tu będzie mapa 🌍]</Text>
      </View>

      <Text style={styles.sectionTitle}>Opis miejsca</Text>
      <Text style={styles.text}>
        Barcelona to miasto łączące plaże, unikalną architekturę Gaudiego
        i bogate życie nocne. Idealne na city break w imprezowym klimacie.
      </Text>

      <Text style={styles.sectionTitle}>Dlaczego pasuje do vibe?</Text>
      <Text style={styles.text}>
        Kluby przy plaży, bary w dzielnicy Barceloneta i liczne festiwale
        sprawiają, że to świetny kierunek dla osób szukających energii i zabawy.
      </Text>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryText}>❤️ Dodaj do ulubionych</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryText}>Wróć do wyników</Text>
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
  placeName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E2A38',
  },
  vibe: {
    fontSize: 15,
    color: '#5B6470',
    marginBottom: 16,
  },
  mapPlaceholder: {
    backgroundColor: '#DDE7F5',
    borderRadius: 20,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mapText: {
    color: '#1E2A38',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#444A55',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#E84855',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
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
    marginTop: 8,
  },
  secondaryText: {
    color: '#2D6A8A',
    fontSize: 14,
    fontWeight: '500',
  },
});