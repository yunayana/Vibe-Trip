import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../src/lib/supabase";

// Ekrany
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AISearchScreen from "../screens/AISearchScreen"; // Importujemy nową wyszukiwarkę

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    // 1. Sprawdź sesję przy starcie aplikacji
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Nasłuchuj zmian stanu autoryzacji (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Widok ładowania (np. podczas sprawdzania tokena w pamięci urządzenia)
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A8A" />
      </View>
    );
  }

  // --- LOGIKA WYŚWIETLANIA (FLOW UŻYTKOWNIKA) ---

  // KROK 1: Jeśli użytkownik widzi aplikację pierwszy raz (nie kliknął jeszcze "Start")
  // Pokazujemy ekran powitalny (niezależnie od sesji)
  if (!isStarted) {
    return <WelcomeScreen onStart={() => setIsStarted(true)} />;
  }

  // KROK 2: Jeśli użytkownik kliknął "Start", ale NIE JEST zalogowany
  if (!session) {
    return <LoginScreen />;
  }

  // KROK 3: Jeśli użytkownik kliknął "Start" i JEST zalogowany
  // Kierujemy go prosto do modułu AI Search
  return <AISearchScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
  },
});