import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function AISearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Search</Text>
      <Text style={styles.subtitle}>
        Opisz klimat podróży, a aplikacja znajdzie miejsce pasujące do Twojego vibe
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Np. chcę ciepłe miejsce z plażą i imprezami"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.sectionTitle}>Szybkie pomysły</Text>

      <View style={styles.promptList}>
        <Pressable style={styles.promptChip}>
          <Text style={styles.promptText}>Chcę spokojne jezioro i naturę</Text>
        </Pressable>

        <Pressable style={styles.promptChip}>
          <Text style={styles.promptText}>Szukam miasta na weekend i nocne życie</Text>
        </Pressable>

        <Pressable style={styles.promptChip}>
          <Text style={styles.promptText}>Chcę ukryte miejsce, mało turystów</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.searchButton}
        onPress={() => router.push('/main/results')}
      >
        <Text style={styles.searchButtonText}>🔎 Szukaj miejsca</Text>
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
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E0E6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    minHeight: 120,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2A38',
    marginBottom: 12,
  },
  promptList: {
    marginBottom: 28,
  },
  promptChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EC',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  promptText: {
    color: '#1E2A38',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#2D6A8A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});