import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../src/lib/supabase";

// Ekrany
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";

export default function Index() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false); // Nowy stan kontrolujący start

  useEffect(() => {
    // 1. Sprawdź sesję przy starcie
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Nasłuchuj zmian sesji
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A8A" />
      </View>
    );
  }

  // LOGIKA WYŚWIETLANIA:
  
  // 1. Jeśli użytkownik jeszcze nie kliknął "Start", pokazujemy ekran powitalny
  if (!isStarted) {
    return <WelcomeScreen onStart={() => setIsStarted(true)} />;
  }

  // 2. Po kliknięciu "Start": 
  // Jeśli jest zalogowany -> idzie do właściwej apki (tu WelcomeScreen pełni rolę Dashboardu na razie)
  // Jeśli nie jest zalogowany -> idzie do logowania
  return session ? <WelcomeScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
  },
});