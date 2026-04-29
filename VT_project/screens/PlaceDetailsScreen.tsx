import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PlaceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Pobieramy dane przesłane z poprzedniego ekranu
  const { name, address, vibe } = params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Wróć do listy</Text>
        </Pressable>

        <Text style={styles.label}>Szczegóły miejsca</Text>
        <Text style={styles.placeName}>{name || "Nieznane miejsce"}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lokalizacja</Text>
          <Text style={styles.text}>📍 {address || "Brak dokładnego adresu"}</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Twój wybrany Vibe</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}># {vibe || "brak"}</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Dlaczego to miejsce?</Text>
          <Text style={styles.text}>
            To miejsce zostało dopasowane przez AI, ponieważ pasuje do klimatu "{vibe}" w tej lokalizacji.
          </Text>
        </View>

        <Pressable 
          style={styles.mapButton} 
          onPress={() => alert('Tu w przyszłości dodasz mapę Google!')}
        >
          <Text style={styles.mapButtonText}>🗺️ Zobacz na mapie</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { padding: 24, paddingTop: 40 },
  backButton: { marginBottom: 20 },
  backText: { color: '#2D6A8A', fontWeight: 'bold', fontSize: 16 },
  label: { fontSize: 14, color: '#64748B', marginBottom: 4, textTransform: 'uppercase' },
  placeName: { fontSize: 28, fontWeight: '800', color: '#1E2A38', marginBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1E2A38', marginBottom: 8 },
  text: { fontSize: 15, color: '#475569', lineHeight: 22, marginBottom: 16 },
  separator: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgeText: { color: '#0369A1', fontSize: 12, fontWeight: '800' },
  mapButton: { backgroundColor: '#1E2A38', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 24 },
  mapButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});