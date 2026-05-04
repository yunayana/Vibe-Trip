# VibeTrip

VibeTrip to mobilna aplikacja stworzona w React Native z wykorzystaniem Expo, której celem jest odkrywanie miejsc dopasowanych do nastroju, preferencji użytkownika i kontekstu podróży. Projekt łączy wyszukiwanie miejsc, personalizację, zapis ulubionych lokalizacji oraz moduł AI wspierający rekomendacje i analizę „vibe” użytkownika.

## Opis projektu

Aplikacja została zaprojektowana jako nowoczesny mobilny przewodnik po miejscach, który nie ogranicza się do klasycznego wyszukiwania. Użytkownik może eksplorować lokalizacje poprzez szybkie wyszukiwanie, rekomendacje oparte na klimacie podróży oraz zapisane miejsca, a główny dashboard prezentuje spersonalizowane informacje i skróty do najważniejszych funkcji. 

VibeTrip rozwijany jest jako projekt edukacyjno-projektowy, skupiony na budowie kompletnej aplikacji mobilnej z autoryzacją, backendem, routingiem, stanem globalnym oraz integracją z usługami zewnętrznymi. Architektura aplikacji została oparta o podejście modułowe, z rozdzieleniem warstwy UI, ekranów, store’ów oraz serwisów biznesowych. 

## Aktualny zakres funkcji

Aktualnie projekt obejmuje:

- rejestrację i logowanie użytkownika,
- dashboard aplikacji z personalizacją,
- ekran AI Search do wyszukiwania miejsc według vibe,
- ekran wyników rekomendacji,
- ekran szczegółów miejsca,
- zapisane miejsca użytkownika,
- profil użytkownika i ustawienia podróżnicze,
- historię wyszukiwań,
- integrację z backendem Supabase,
- globalne zarządzanie stanem z użyciem Zustand.

W warstwie UX aplikacja korzysta z układu wieloekranowego, w którym główne widoki są rozdzielone na logiczne moduły: wyszukiwanie, wyniki, szczegóły miejsca, zapisane lokalizacje i profil. Routing został oparty o Expo Router, co upraszcza strukturę nawigacji i pozwala utrzymywać spójny podział tras na podstawie plików w katalogu `app/`. 

## Stack technologiczny

Projekt wykorzystuje następujące technologie:

- **React Native**
- **Expo**
- **TypeScript**
- **Expo Router**
- **Supabase**
- **Zustand**
- **Tailwind / NativeWind**
- **ESLint**
- **react-native-maps** (integracja map w aplikacji mobilnej)

## Architektura projektu

Projekt został podzielony na kilka głównych warstw:

- `app/` – routing aplikacji oparty o Expo Router,
- `screens/` – logika i implementacje ekranów,
- `components/` – współdzielone komponenty UI,
- `store/` – globalny stan aplikacji w Zustand,
- `src/services/` – logika biznesowa i komunikacja z backendem,
- `src/lib/` – konfiguracje bibliotek zewnętrznych, np. klient Supabase,
- `supabase/functions/` – funkcje serwerowe, w tym analiza vibe. 

Takie rozdzielenie ułatwia rozwój projektu, testowanie i dalsze rozszerzanie aplikacji o nowe funkcje, np. statystyki, mapy, personalizację czy dodatkowe moduły AI. Lekka architektura Zustand dobrze wspiera React Native, ponieważ pozwala ograniczyć zbędne re-renderingi i utrzymać prosty model zarządzania stanem. 

## Główne moduły

### Autoryzacja
Aplikacja obsługuje podstawowy przepływ logowania i rejestracji użytkownika z wykorzystaniem Supabase Authentication. Ekrany autoryzacyjne są wydzielone jako osobne widoki i stanowią część głównego flow aplikacji. 

### AI Search
Moduł AI Search umożliwia wyszukiwanie miejsc na podstawie opisu, nastroju lub kontekstu podróży. Wyniki są następnie prezentowane na osobnym ekranie rekomendacji, z możliwością przejścia do szczegółów konkretnego miejsca.

### Dashboard i personalizacja
Dashboard pełni rolę głównego ekranu aplikacji i prezentuje użytkownikowi szybkie akcje, statystyki oraz spersonalizowane sekcje, takie jak ostatnia aktywność i rekomendacje. Taki układ jest zgodny z podejściem do mobilnych dashboardów, gdzie najważniejsze informacje powinny być zebrane w jednym miejscu i prowadzić do dalszych działań. 

### Saved Places
Użytkownik może zapisywać interesujące miejsca i wracać do nich później. Sekcja zapisanych miejsc pełni funkcję prywatnej kolekcji lokalizacji, która może być dalej rozbudowywana o statusy, filtrowanie lub planowanie podróży.

### Place Details
Ekran szczegółów miejsca zbiera podstawowe informacje o lokalizacji i stanowi punkt wejścia do dalszej eksploracji danego miejsca. To tutaj naturalnie rozwija się integracja map, opisu miejsca, przyczyn dopasowania do vibe i akcji użytkownika.

## Routing

Routing oparto na Expo Router, czyli systemie file-based routing, w którym struktura folderów odpowiada strukturze nawigacji w aplikacji. Każdy ekran jest reprezentowany przez osobny plik w katalogu `app/`, a pliki `_layout.tsx` definiują wspólne layouty i grupy tras. 

Przykładowe widoki aplikacji obejmują:
- `login`
- `register`
- `dashboard`
- `ai-search`
- `result`
- `place-details`
- `saved-places`
- `profile`

## Backend i dane

Backend projektu został oparty o Supabase. Platforma odpowiada za uwierzytelnianie, przechowywanie danych użytkownika oraz obsługę logiki serwerowej przez functions. W projekcie wykorzystywane są także tabele związane z profilami użytkowników, historią wyszukiwania oraz zapisanymi miejscami. 

Przykładowe obszary danych w projekcie:
- użytkownicy i autoryzacja,
- profile użytkowników,
- zapisane miejsca,
- sesje wyszukiwania,
- statystyki vibe użytkownika.

## Uruchomienie projektu

### Wymagania
- Node.js
- npm
- Expo CLI / `npx expo`
- konto Supabase
- plik środowiskowy z kluczami projektu

### Instalacja
```bash
npm install
```

### Start projektu
```bash
npm start
```

### Uruchomienie platform
```bash
npm run android
npm run ios
npm run web
```

### Lint
```bash
npm run lint
```

## Status projektu

Projekt znajduje się na etapie aktywnego rozwoju. Zaimplementowane zostały podstawowe ekrany aplikacji, routing, autoryzacja, zapis miejsc, profil użytkownika, dashboard, AI Search oraz warstwa backendowa oparta o Supabase. Aktualny rozwój obejmuje dopracowanie statystyk, personalizacji oraz dalszą integrację map i rekomendacji. [web:1][web:62]

## Kierunki rozwoju

Planowane lub możliwe dalsze rozszerzenia projektu:

- bardziej zaawansowane statystyki użytkownika,
- personalizowane rekomendacje oparte na historii i profilu,
- pełniejsza integracja map i markerów,
- statusy miejsc typu `want_to_visit` / `visited` / `favorite`,
- filtrowanie i sortowanie zapisanych miejsc,
- planowanie podróży,
- rekomendacje zależne od budżetu i stylu podróży,
- rozbudowa modułu AI o bardziej szczegółowe uzasadnienia rekomendacji.

## Cel projektu

VibeTrip rozwijany jest jako projekt edukacyjny i praktyczny, którego celem jest połączenie nowoczesnego mobile UX z realną architekturą aplikacji: routingiem, backendem, stanem globalnym, personalizacją oraz integracjami zewnętrznymi. Projekt koncentruje się nie tylko na warstwie wizualnej, ale także na logicznej strukturze aplikacji i dobrych praktykach organizacji kodu.

## Autorzy

Yana Trotsenko 
Valeriia Khylchenko 
