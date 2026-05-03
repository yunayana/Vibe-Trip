import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlaceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { name, address, vibe } = params;

  const placeName =
    typeof name === 'string' ? name : 'Nieznane miejsce';
  const placeAddress =
    typeof address === 'string'
      ? address
      : 'Brak dokładnego adresu';
  const placeVibe = typeof vibe === 'string' ? vibe : 'brak';

  return (
    <LinearGradient
      colors={['#050505', '#090909', '#101114', '#161821']}
      locations={[0, 0.35, 0.72, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Wróć do listy</Text>
          </Pressable>

          <Text style={styles.label}>Szczegóły miejsca</Text>
          <Text style={styles.placeName}>{placeName}</Text>

          <View style={styles.card}>
            <View style={styles.rowHeader}>
              <Text style={styles.sectionTitle}>Lokalizacja</Text>
            </View>
            <Text style={styles.text}>
              📍 {placeAddress}
            </Text>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Twój vibe</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}># {placeVibe}</Text>
            </View>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Dlaczego to miejsce?</Text>
            <Text style={styles.text}>
              To miejsce zostało dopasowane przez AI, ponieważ pasuje
              do klimatu "{placeVibe}" w tej okolicy. Weź pod uwagę
              porę dnia, pogodę i własny nastrój, żeby wycisnąć z
              tego miejsca maksymalny vibe.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 18,
  },
  backText: {
    color: '#B9BCC8',
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    color: '#7F828E',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  placeName: {
    fontSize: 26,
    color: '#F5F3EE',
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#101114',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#23242A',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5F3EE',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: '#A3A5AE',
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#1B1D23',
    marginVertical: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#181C25',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2E3443',
  },
  badgeText: {
    color: '#89F0FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  
});