import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.subtitle}>Dane użytkownika i ustawienia konta</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>user@vibetrip.com</Text>

        <Text style={styles.label}>Ulubione miejsca</Text>
        <Text style={styles.value}>3 zapisane lokalizacje</Text>

        <Text style={styles.label}>Ostatni vibe</Text>
        <Text style={styles.value}>🎉 Party</Text>
      </View>

      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutText}>Wyloguj się</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E2A38',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#5B6470',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1E5EC',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#7A8494',
    marginBottom: 4,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#1E2A38',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#E84855',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});