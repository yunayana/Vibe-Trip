import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { supabase } from "../src/lib/supabase";
import WelcomeScreen from "../screens/WelcomeScreen";
<<<<<<< HEAD
import LoginScreen from "../screens/LoginScreen";
import AISearchScreen from "../screens/AISearchScreen"; // Importujemy nową wyszukiwarkę
=======
>>>>>>> main

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    // 1. Sprawdź sesję przy starcie aplikacji
=======
>>>>>>> main
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

<<<<<<< HEAD
    // 2. Nasłuchuj zmian stanu autoryzacji (login/logout)
=======
>>>>>>> main
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

<<<<<<< HEAD
  // Widok ładowania (np. podczas sprawdzania tokena w pamięci urządzenia)
=======
  useEffect(() => {
    if (!loading && isStarted) {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [loading, isStarted, session]);

>>>>>>> main
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A8A" />
      </View>
    );
  }

<<<<<<< HEAD
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
=======
  return <WelcomeScreen onStart={() => setIsStarted(true)} />;
>>>>>>> main
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
  },
});