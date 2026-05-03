import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

const RECOMMENDED_BY_VIBE: Record<string, string[]> = {
  party: ['Berlin', 'Barcelona', 'Miami'],
  relax: ['Lisbon', 'Vienna', 'Rome'],
  culture: ['Prague', 'Vienna', 'Paris'],
  nature: ['Sydney', 'Krakow', 'Gdansk'],
  mysterious: ['Prague', 'Edinburgh', 'Istanbul'],
  sunset: ['Barcelona', 'Lisbon', 'Monaco'],
  sad: ['Warsaw', 'Prague', 'Vienna'],
  lonely: ['Tokyo', 'Vienna', 'London'],
};

interface SearchSession {
  id: string;
  location: string;
  vibe: string;
  created_at: string;
}

export default function DashboardScreen() {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [topVibe, setTopVibe] = useState('general');
  const [recentSearches, setRecentSearches] = useState<SearchSession[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const saveSearchSession = async (location: string, vibe: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from('search_sessions').insert({
        user_id: user.id,
        location,
        vibe,
      });

      if (error) {
        console.error('Błąd zapisu sesji:', error.message);
      }
    } catch (e: any) {
      console.error('Błąd zapisu sesji:', e.message);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setDashboardLoading(false);
        return;
      }

      setEmail(user.email || '');

      const [profileRes, vibeRes, historyRes, savedRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('nickname')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('user_vibe_stats')
          .select('vibe')
          .eq('user_id', user.id)
          .order('count', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('search_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('saved_places')
          .select('id')
          .eq('user_id', user.id),
      ]);

      if (profileRes.data?.nickname) {
        setNickname(profileRes.data.nickname);
      }

      if (vibeRes.data?.vibe) {
        setTopVibe(vibeRes.data.vibe);
      }

      setRecentSearches(historyRes.data || []);
      setSavedCount(savedRes.data?.length || 0);
    } catch (e: any) {
      console.error('Błąd dashboardu:', e.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  const greetingName = useMemo(() => {
    if (nickname?.trim()) return nickname;
    if (email?.trim()) return email.split('@')[0];
    return 'Traveler';
  }, [nickname, email]);

  const recommendedCities = useMemo(() => {
    return RECOMMENDED_BY_VIBE[topVibe] || ['Prague', 'Lisbon', 'Berlin'];
  }, [topVibe]);

  const recommendationText = useMemo(() => {
    const first = recommendedCities[0];
    const second = recommendedCities[1];

    if (topVibe && topVibe !== 'general') {
      return `Because you often choose ${topVibe.toUpperCase()}, you may enjoy ${first} or ${second}.`;
    }

    return `Start with ${first} or ${second} based on your recent travel patterns.`;
  }, [topVibe, recommendedCities]);

  const handleOpenRecommendation = () => {
    router.push({
      pathname: '/(main)/ai-search',
      params: {
        vibe: topVibe,
        suggestion: recommendedCities[0],
      },
    });
  };

  const handleGenerate = async () => {
    if (!selectedVibe) {
      Alert.alert('Wybierz vibe', 'Najpierw wybierz klimat podróży.');
      return;
    }

    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const prompt = `I want to explore ${randomCity} with a ${selectedVibe} vibe`;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-vibe', {
        body: { prompt },
      });

      if (error) throw new Error(error.message || 'Błąd serwera');

      if (data && data.places && data.places.length > 0) {
        await saveSearchSession(data.location, data.vibe);

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
          `Nie znaleziono miejsc w ${randomCity} dla vibe'u "${selectedVibe}".`
        );
      }
    } catch (e: any) {
      console.error('Błąd Dashboard generate:', e.message);
      Alert.alert('Błąd', 'Coś poszło nie tak. Spróbuj jeszcze raz.');
    } finally {
      setIsLoading(false);
    }
  };

  const reopenSearch = (item: SearchSession) => {
    router.push({
      pathname: '/(main)/ai-search',
      params: {
        location: item.location,
        vibe: item.vibe,
      },
    });
  };

  if (dashboardLoading) {
    return (
      <LinearGradient
        colors={['#050505', '#090909', '#101114', '#161821']}
        locations={[0, 0.35, 0.72, 1]}
        style={styles.gradient}
      >
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color="#F5F3EE" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#050505', '#090909', '#101114', '#161821']}
      locations={[0, 0.35, 0.72, 1]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.overline}>VibeTrip</Text>
          <Text style={styles.title}>Hi, {greetingName}</Text>
          <Text style={styles.subtitle}>
            Twój podróżniczy dashboard z personalizacją i szybkimi akcjami
          </Text>

          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroEyebrow}>Twój najczęstszy vibe</Text>
                <Text style={styles.heroVibe}>{topVibe.toUpperCase()}</Text>
                <Text style={styles.heroSub}>
                  Odkrywaj miejsca dopasowane do Twojego stylu podróżowania
                </Text>
              </View>

              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{savedCount}</Text>
                <Text style={styles.heroBadgeLabel}>saved</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{savedCount}</Text>
              <Text style={styles.statLabel}>Saved places</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{recentSearches.length}</Text>
              <Text style={styles.statLabel}>Recent searches</Text>
            </View>
          </View>

          <View style={styles.recommendCard}>
            <Text style={styles.recommendEyebrow}>Recommended for you</Text>
            <Text style={styles.recommendTitle}>
              Try {recommendedCities[0]} next
            </Text>
            <Text style={styles.recommendText}>{recommendationText}</Text>

            <View style={styles.recommendTags}>
              {recommendedCities.slice(0, 3).map((city) => (
                <View key={city} style={styles.recommendTag}>
                  <Text style={styles.recommendTagText}>{city}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={styles.recommendButton}
              onPress={handleOpenRecommendation}
            >
              <Text style={styles.recommendButtonText}>Open AI Search</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Quick actions</Text>

            <View style={styles.quickActionsColumn}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => router.push('/(main)/ai-search')}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>AI Search</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() => router.push('/(main)/saved-places')}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>Saved Places</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() => router.push('/(main)/profile')}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>Profile</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionHeader}>Recent activity</Text>
              <Pressable onPress={() => router.push('/(main)/saved-places')}>
                <Text style={styles.linkText}>See more</Text>
              </Pressable>
            </View>

            {recentSearches.length > 0 ? (
              recentSearches.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.historyCard}
                  onPress={() => reopenSearch(item)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyLocation}>{item.location}</Text>
                    <Text style={styles.historyVibe}>{item.vibe}</Text>
                  </View>
                  <Text style={styles.historyDate}>
                    {new Date(item.created_at).toLocaleDateString('pl-PL')}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>Brak ostatnich wyszukiwań</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Pick your next vibe</Text>
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
              <Text style={styles.primaryButtonText}>Wylosuj miejsce</Text>
            )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 24,
    lineHeight: 22,
  },
  heroCard: {
    backgroundColor: '#111214',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#23242A',
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroEyebrow: {
    fontSize: 12,
    color: '#8C8C92',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
    fontWeight: '700',
  },
  heroVibe: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F5F3EE',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: '#9A9A9F',
    lineHeight: 20,
  },
  heroBadge: {
    width: 82,
    height: 82,
    borderRadius: 20,
    backgroundColor: '#1A1B1F',
    borderWidth: 1,
    borderColor: '#34363D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeText: {
    color: '#F5F3EE',
    fontSize: 24,
    fontWeight: '900',
  },
  heroBadgeLabel: {
    color: '#8C8C92',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#101010',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#232323',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F5F3EE',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#9A9A9F',
    fontWeight: '600',
  },
  recommendCard: {
    backgroundColor: '#121318',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2B2E38',
    marginBottom: 16,
  },
  recommendEyebrow: {
    fontSize: 12,
    color: '#8C8C92',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 6,
    fontWeight: '700',
  },
  recommendTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F5F3EE',
    marginBottom: 8,
    fontFamily: 'ProfileHeading',
  },
  recommendText: {
    fontSize: 14,
    color: '#B8B8BD',
    lineHeight: 20,
    marginBottom: 14,
  },
  recommendTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  recommendTag: {
    backgroundColor: '#1A1C24',
    borderWidth: 1,
    borderColor: '#333745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  recommendTagText: {
    color: '#F5F3EE',
    fontSize: 12,
    fontWeight: '700',
  },
  recommendButton: {
    backgroundColor: '#2F2F32',
    borderWidth: 1,
    borderColor: '#4A4A4E',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  recommendButtonText: {
    color: '#F5F3EE',
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#101010',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#232323',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F5F3EE',
    marginBottom: 16,
    letterSpacing: 0.3,
    fontFamily: 'ProfileHeading',
  },
  quickActionsColumn: {
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkText: {
    color: '#B8B8BD',
    fontSize: 13,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: '#131313',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#232323',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLocation: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5F3EE',
    marginBottom: 4,
  },
  historyVibe: {
    fontSize: 13,
    color: '#9A9A9F',
  },
  historyDate: {
    fontSize: 12,
    color: '#6F6F73',
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#6F6F73',
    fontStyle: 'italic',
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