import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { supabase } from '../src/lib/supabase';
import { getProfile, upsertProfile } from '../src/services/profileService';
import { useProfileStore } from '../store/profileStore';

interface SearchSession {
  id: string;
  location: string;
  vibe: string;
  created_at: string;
}

export default function ProfileScreen() {
  const { profile, updateProfile, resetProfile } = useProfileStore();

  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string | undefined>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [nickname, setNickname] = useState(profile.nickname);
  const [homeLocation, setHomeLocation] = useState(profile.homeLocation);
  const [travelStyle, setTravelStyle] = useState(profile.travelStyle);
  const [budget, setBudget] = useState(profile.budget);

  const [nicknameError, setNicknameError] = useState('');
  const [locationError, setLocationError] = useState('');

  const [isEditing, setIsEditing] = useState(
    !profile.nickname && !profile.homeLocation
  );

  const [history, setHistory] = useState<SearchSession[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [topVibe, setTopVibe] = useState<string>("Brak danych");

  const fetchMyVibe = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("USER ID:", user?.id);
    if (!user) return;

    const { data, error } = await supabase
      .from('user_vibe_stats')
      .select('vibe')
      .eq('user_id', user.id)
      .order('count', { ascending: false })
      .limit(1)
      .single();

    console.log("VIBE DATA:", data);
    console.log("VIBE ERROR:", error);

    if (data) {
      setTopVibe(data.vibe);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchMyVibe();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      setEmail(user.email);

      const profileData = await getProfile(user.id);

      if (profileData) {
        const localProfile = {
          nickname: profileData.nickname ?? '',
          homeLocation: profileData.home_location ?? '',
          travelStyle:
            (profileData.travel_style as 'solo' | 'friends' | 'couple' | '') ?? '',
          budget: (profileData.budget as 'low' | 'medium' | 'high' | '') ?? '',
        };

        updateProfile(localProfile);
        setNickname(localProfile.nickname);
        setHomeLocation(localProfile.homeLocation);
        setTravelStyle(localProfile.travelStyle);
        setBudget(localProfile.budget);

        if (localProfile.nickname || localProfile.homeLocation) {
          setIsEditing(false);
        }
      }

      await fetchHistory(user.id);
    } catch (error: any) {
      console.error('Błąd pobierania danych profilu:', error.message);
      Alert.alert('Błąd', 'Nie udało się pobrać profilu.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistory(userId: string) {
    try {
      setHistoryLoading(true);

      const historyRes = await supabase
        .from('search_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (historyRes.error) console.error('Błąd historii:', historyRes.error.message);
      else setHistory(historyRes.data || []);

    } catch (error) {
      console.error('Błąd pobierania historii:', error);
    } finally {
      setHistoryLoading(false);
    }
  }

  const validateForm = () => {
    let isValid = true;

    setNicknameError('');
    setLocationError('');

    if (!nickname.trim()) {
      setNicknameError('Podaj nickname.');
      isValid = false;
    }

    if (!homeLocation.trim()) {
      setLocationError('Podaj miasto lub kraj.');
      isValid = false;
    }

    return isValid;
  };

  const confirmSaveProfile = () => {
    if (!validateForm()) return;

    Alert.alert(
      'Potwierdzenie',
      'Czy na pewno chcesz zapisać dane profilu?',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Zapisz', onPress: handleSaveProfile },
      ]
    );
  };

  const handleSaveProfile = async () => {
    try {
      if (!userId) {
        Alert.alert('Błąd', 'Brak zalogowanego użytkownika.');
        return;
      }

      setSaving(true);

      await upsertProfile({
        id: userId,
        email: email ?? null,
        nickname,
        home_location: homeLocation,
        travel_style: travelStyle || null,
        budget: budget || null,
      });

      updateProfile({
        nickname,
        homeLocation,
        travelStyle,
        budget,
      });

      setIsEditing(false);
      Alert.alert('Sukces', 'Profil został zapisany w Supabase.');
    } catch (error: any) {
      console.error('Błąd zapisu profilu:', error.message);
      Alert.alert('Błąd', 'Nie udało się zapisać profilu.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const confirmLogout = () => {
    Alert.alert(
      'Potwierdzenie',
      'Czy na pewno chcesz się wylogować?',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Wyloguj', style: 'destructive', onPress: handleLogout },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert('Błąd', 'Nie udało się wylogować.');
        return;
      }

      resetProfile();
      setNickname('');
      setHomeLocation('');
      setTravelStyle('');
      setBudget('');
      setIsEditing(true);

      router.replace('/login');
    } catch (error) {
      Alert.alert('Błąd', 'Wystąpił problem podczas wylogowania.');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#050505', '#050505', '#111111', '#2A2A2A']}
        locations={[0, 0.55, 0.82, 1]}
        style={{ flex: 1 }}
      >
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color="#F5F3EE" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#050505', '#050505', '#111111', '#2A2A2A']}
      locations={[0, 0.55, 0.82, 1]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Profil</Text>
          <Text style={styles.subtitle}>Zarządzaj swoimi danymi konta</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email || 'Brak danych'}</Text>
          </View>

          <Text style={styles.sectionHeader}>Dane profilu</Text>

          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nickname"
                placeholderTextColor="#666666"
                value={nickname}
                onChangeText={setNickname}
              />
              {nicknameError ? (
                <Text style={styles.errorText}>{nicknameError}</Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Miasto lub kraj"
                placeholderTextColor="#666666"
                value={homeLocation}
                onChangeText={setHomeLocation}
              />
              {locationError ? (
                <Text style={styles.errorText}>{locationError}</Text>
              ) : null}

              <Text style={styles.fieldLabel}>Styl podróżowania</Text>
              <View style={styles.row}>
                <Pressable
                  style={[
                    styles.optionButton,
                    travelStyle === 'solo' && styles.optionActive,
                  ]}
                  onPress={() => setTravelStyle('solo')}
                >
                  <Text style={styles.optionText}>Solo</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.optionButton,
                    travelStyle === 'friends' && styles.optionActive,
                  ]}
                  onPress={() => setTravelStyle('friends')}
                >
                  <Text style={styles.optionText}>Friends</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.optionButton,
                    travelStyle === 'couple' && styles.optionActive,
                  ]}
                  onPress={() => setTravelStyle('couple')}
                >
                  <Text style={styles.optionText}>Couple</Text>
                </Pressable>
              </View>

              <Text style={styles.fieldLabel}>Budżet</Text>
              <View style={styles.row}>
                <Pressable
                  style={[
                    styles.optionButton,
                    budget === 'low' && styles.optionActive,
                  ]}
                  onPress={() => setBudget('low')}
                >
                  <Text style={styles.optionText}>Low</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.optionButton,
                    budget === 'medium' && styles.optionActive,
                  ]}
                  onPress={() => setBudget('medium')}
                >
                  <Text style={styles.optionText}>Medium</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.optionButton,
                    budget === 'high' && styles.optionActive,
                  ]}
                  onPress={() => setBudget('high')}
                >
                  <Text style={styles.optionText}>High</Text>
                </Pressable>
              </View>

              <Pressable
                style={[styles.saveButton, saving && styles.disabledButton]}
                onPress={confirmSaveProfile}
                disabled={saving}
              >
                <Text style={styles.saveText}>
                  {saving ? 'Zapisywanie...' : 'Zapisz profil'}
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.label}>Nickname</Text>
              <Text style={styles.value}>{profile.nickname}</Text>

              <Text style={styles.label}>Miasto lub kraj</Text>
              <Text style={styles.value}>{profile.homeLocation}</Text>

              <Text style={styles.label}>Styl podróżowania</Text>
              <Text style={styles.value}>
                {profile.travelStyle || 'Brak danych'}
              </Text>

              <Text style={styles.label}>Budżet</Text>
              <Text style={styles.value}>{profile.budget || 'Brak danych'}</Text>

              <Pressable style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editText}>Edytuj profil</Text>
              </Pressable>
            </View>
          )}

          <Pressable
              style={[styles.logoutButton, loggingOut && styles.disabledButton]}
              onPress={confirmLogout}
              disabled={loggingOut}
            >
              <Text style={styles.logoutText}>
                {loggingOut ? 'Wylogowywanie...' : 'Wyloguj się'}
              </Text>
            </Pressable>


        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  },
  card: {
    backgroundColor: '#101010',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#232323',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#8C8C92',
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  value: {
    fontSize: 16,
    color: '#F5F3EE',
    fontWeight: '600',
  },
  sectionHeader: {
  fontSize: 28,
  fontWeight: '900',
  color: '#F5F3EE',
  marginBottom: 18,
  marginTop: 28,
  letterSpacing: 0.3,
  fontFamily: 'ProfileHeading',
  },
  input: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 10,
    fontSize: 15,
    color: '#F5F3EE',
  },
  errorText: {
    color: '#D96B6B',
    fontSize: 13,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D8D8DB',
    marginTop: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  optionActive: {
    backgroundColor: '#1D1D1D',
    borderColor: '#6C6C6C',
  },
  optionText: {
    color: '#F5F3EE',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2F2F32',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A4A4E',
  },
  saveText: {
    color: '#F5F3EE',
    fontSize: 15,
    fontWeight: '800',
  },
  editButton: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#3F3F3F',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  editText: {
    color: '#F5F3EE',
    fontSize: 15,
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#343434',
    marginBottom: 24,
  },
  logoutText: {
    color: '#F5F3EE',
    fontSize: 15,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  historyCard: {
    backgroundColor: '#101010',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#232323',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyLocation: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F3EE',
    marginBottom: 4,
  },
  historyVibe: {
    fontSize: 13,
    color: '#9A9A9F',
    fontWeight: '500',
  },
  historyDate: {
    fontSize: 12,
    color: '#6F6F73',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#6F6F73',
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },
  statsContainer: {
    backgroundColor: '#161616',
    padding: 20,
    borderRadius: 20,
    marginVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  statsTitle: {
    color: '#9A9A9F',
    fontSize: 14,
    marginBottom: 10,
  },
  vibeBadge: {
    backgroundColor: '#2D6A8A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  vibeText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
  },
});