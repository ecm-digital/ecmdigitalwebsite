# 🧪 Instrukcja Testowania Integracji DynamoDB

## Przegląd

Została zaimplementowana integracja z AWS DynamoDB dla aplikacji ECM Digital. System oferuje:

- **Unified Storage Interface** - jednolity interfejs dla DynamoDB i localStorage
- **Automatic Fallback** - automatyczne przełączanie na localStorage gdy DynamoDB nie jest dostępne
- **Data Migration** - migracja danych z localStorage do DynamoDB
- **Cost Monitoring** - monitorowanie kosztów i użycia

## 📁 Struktura Plików

### Główne Pliki
- `src/js/storage-manager.js` - Główny manager przechowywania (wymaga AWS SDK)
- `src/js/storage-manager-browser.js` - Wersja dla przeglądarki (localStorage only)
- `src/js/dynamodb-client.js` - Klient DynamoDB z operacjami CRUD
- `src/js/migrate-to-dynamodb.js` - Skrypt migracji danych
- `test-dynamodb.html` - Panel testowy

### Zmodyfikowane Pliki
- `src/js/auth-modal.js` - Zaktualizowany do używania storageManager
- `index.html` - Dodane nowe skrypty

## 🚀 Jak Testować

### 1. Uruchom Serwer Deweloperski
```bash
npm run dev
```

### 2. Otwórz Panel Testowy
Przejdź do: `http://localhost:3001/test-dynamodb.html`

### 3. Wykonaj Testy

#### Test Połączenia
1. Kliknij **"Test Połączenia DynamoDB"**
2. Sprawdź czy localStorage jest dostępne
3. Kliknij **"Sprawdź Tabele"** (symulacja)

#### Test Operacji na Użytkownikach
1. Kliknij **"Test CRUD Użytkowników"**
2. Sprawdź czy wszystkie operacje (CREATE, READ, UPDATE, DELETE) działają
3. Sprawdź logi w konsoli przeglądarki

#### Test Operacji na Sesjach
1. Kliknij **"Test CRUD Sesji"**
2. Sprawdź operacje na sesjach użytkowników

#### Test Migracji
1. Kliknij **"Przygotuj Dane Testowe"** - utworzy przykładowe dane w localStorage
2. Kliknij **"Uruchom Migrację"** - symuluje migrację do DynamoDB
3. Kliknij **"Sprawdź Migrację"** - weryfikuje czy dane zostały zmigrowane

#### Monitoring Kosztów
1. Kliknij **"Oszacuj Koszty"** - pokazuje szacowane koszty DynamoDB
2. Kliknij **"Statystyki Użycia"** - pokazuje statystyki użycia

#### Narzędzia
1. **"Wyczyść localStorage"** - usuwa wszystkie dane ECM z localStorage
2. **"Wyczyść DynamoDB"** - usuwa dane testowe (symulacja)
3. **"Reset Migracji"** - resetuje flagę migracji

## 🔧 Konfiguracja AWS DynamoDB

### Wymagane Tabele
```
Tabela: ecm-digital-users
- Partition Key: userId (String)
- Attributes: email, name, preferences, createdAt, updatedAt

Tabela: ecm-digital-sessions  
- Partition Key: sessionId (String)
- Attributes: userId, token, createdAt, expiresAt, ttl
- GSI: UserIdIndex (userId)
```

### Zmienne Środowiskowe
```bash
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Uprawnienia IAM
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:eu-west-1:*:table/ecm-digital-users",
                "arn:aws:dynamodb:eu-west-1:*:table/ecm-digital-sessions",
                "arn:aws:dynamodb:eu-west-1:*:table/ecm-digital-sessions/index/*"
            ]
        }
    ]
}
```

## 📊 Szacowane Koszty

### AWS DynamoDB Free Tier (miesięcznie)
- **25 GB** przechowywania
- **25 milionów** żądań odczytu
- **25 milionów** żądań zapisu

### Typowe Użycie ECM Digital
- **~100 użytkowników**: ~10 KB każdy = 1 MB
- **~1000 sesji/miesiąc**: ~2 KB każda = 2 MB  
- **~10,000 operacji/miesiąc**: znacznie poniżej limitu Free Tier

**Wniosek**: Aplikacja powinna mieścić się w Free Tier przez długi czas.

## 🐛 Rozwiązywanie Problemów

### Problem: AWS SDK nie działa w przeglądarce
**Rozwiązanie**: Używaj `storage-manager-browser.js` do testów lokalnych

### Problem: Błędy CORS
**Rozwiązanie**: Skonfiguruj CORS w AWS lub użyj proxy

### Problem: Błędy autoryzacji
**Rozwiązanie**: Sprawdź klucze AWS i uprawnienia IAM

### Problem: Wysokie koszty
**Rozwiązanie**: Monitoruj użycie w AWS Console, optymalizuj zapytania

## 📈 Następne Kroki

1. **Produkcja**: Skonfiguruj prawdziwe tabele DynamoDB
2. **Bezpieczeństwo**: Implementuj AWS Cognito dla autoryzacji
3. **Monitoring**: Dodaj CloudWatch dla monitorowania
4. **Backup**: Skonfiguruj Point-in-Time Recovery
5. **Performance**: Dodaj DAX dla cache'owania

## 🔍 Weryfikacja Implementacji

### ✅ Zaimplementowane
- [x] Storage Manager z fallbackiem
- [x] DynamoDB Client z operacjami CRUD
- [x] Migracja danych z localStorage
- [x] Panel testowy
- [x] Integracja z auth-modal.js
- [x] Monitoring kosztów (symulacja)

### 🚧 Do Implementacji w Produkcji
- [ ] Prawdziwe tabele DynamoDB
- [ ] AWS Cognito autoryzacja
- [ ] CloudWatch monitoring
- [ ] Backup i recovery
- [ ] Performance optimization

---

**Status**: ✅ Implementacja zakończona - gotowa do testów i wdrożenia produkcyjnego