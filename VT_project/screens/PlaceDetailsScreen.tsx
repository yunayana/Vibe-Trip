import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useVibeStore } from '../store/vibeStore';

export default function PlaceDetailsScreen() {
  const { selectedVibe } = useVibeStore();

  const detailsByVibe = {
    chill: {
      placeName: 'Santorini, Grecja',
      vibe: '🌴 Chill vibe',
      description:
        'Santorini to wyspa idealna na spokojny wypoczynek z widokiem na morze i zachody słońca.',
      reason:
        'Kawiarnie z widokiem na klify, baseny infinity i spokojny rytm życia sprawiają, że to świetne miejsce na totalny chill.',
    },
    party: {
      placeName: 'Barcelona, Hiszpania',
      vibe: '🎉 Party vibe',
      description:
        'Barcelona łączy plaże, unikalną architekturę Gaudiego i bogate życie nocne. Idealna na city break w imprezowym klimacie.',
      reason:
        'Kluby przy plaży, bary w dzielnicy Barceloneta i liczne festiwale sprawiają, że to świetny kierunek dla osób szukających energii i zabawy.',
    },
    nature: {
      placeName: 'Zakopane, Polska',
      vibe: '🌲 Nature vibe',
      description:
        'Zakopane to stolica polskich Tatr z górskimi szlakami i bliskością dzikiej natury.',
      reason:
        'Szlaki w Tatrach, doliny, hale i widok na góry sprawiają, że to idealne miejsce dla miłośników natury i trekkingu.',
    },
    city: {
      placeName: 'Amsterdam, Holandia',
      vibe: '🏙️ City vibe',
      description:
        'Amsterdam to miasto kanałów, rowerów i muzeów, idealne na intensywny city break.',
      reason:
        'Klimatyczne uliczki, kawiarnie, kultura i nocne życie sprawiają, że to świetny wybór dla osób lubiących energię miasta.',
    },
    mystery: {
      placeName: 'Sintra, Portugalia',
      vibe: '🧭 Mystery vibe',
      description:
        'Sintra to baśniowe miasteczko z zamkami, mgłą na wzgórzach i tajemniczym klimatem.',
      reason:
        'Kolorowe pałace, ukryte ogrody i mglista atmosfera tworzą wrażenie miejsca z innego świata – idealne dla mystery vibe.',
    },
  };

  const fallbackDetails = {
    placeName: 'Brak wybranego miejsca',
    vibe: 'Brak vibe',
    description:
      'Najpierw wybierz vibe i miejsce, a potem wróć do szczegółów. Wtedy pokażemy dokładniejszy opis.',
    reason:
      'Aby zobaczyć dopasowane szczegóły miejsca, wróć do ekranu głównego i wybierz klimat podróży.',
  };

  const details =
    selectedVibe && detailsByVibe[selectedVibe]
      ? detailsByVibe[selectedVibe]
      : fallbackDetails;

  return (
    <View style={styles.container}>
      <Text style={styles.placeName}>{details.placeName}</Text>
      <Text style={styles.vibe}>{details.vibe}</Text>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>[Tu będzie mapa 🌍]</Text>
      </View>

      <Text style={styles.sectionTitle}>Opis miejsca</Text>
      <Text style={styles.text}>{details.description}</Text>

      <Text style={styles.sectionTitle}>Dlaczego pasuje do vibe?</Text>
      <Text style={styles.text}>{details.reason}</Text>

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
    lineHeight: 22,
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