# Integracja Zarządzania Klientami

## 📋 Opis
System integruje rejestrację klientów między panelem klienta a panelem zarządzania agencji.

## 🏗️ Architektura

### 1. Tabela DynamoDB: `ecm-users`
Pola:
- `id` (UUID, Primary Key)
- `email` (String, GSI)
- `firstName` (String)
- `lastName` (String)
- `name` (String) - pełne imię i nazwisko
- `company` (String)
- `role` (String) - domyślnie 'client'
- `isEmailVerified` (Boolean)
- `createdAt` (ISO 8601)
- `lastLoginAt` (ISO 8601)

### 2. Endpointy Panelu Klienta

#### POST `/api/auth/verify`
Wywoływany po potwierdzeniu email przez klienta. Synchronizuje dane z DynamoDB.

```javascript
// Request
{
  "email": "user@example.com"
}

// Response
{
  "message": "User verified and data synchronized successfully",
  "user": { /* user data */ }
}
```

#### GET `/api/auth/users`
Pobiera wszystkich użytkowników z DynamoDB.

```javascript
// Response
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Jan",
      "lastName": "Kowalski",
      "name": "Jan Kowalski",
      "company": "Firma Sp. z o.o.",
      "role": "client",
      "isEmailVerified": true,
      "createdAt": "2024-01-01T10:00:00Z",
      "lastLoginAt": "2024-01-15T14:30:00Z"
    }
  ],
  "total": 1
}
```

### 3. Panel Zarządzania Agencji

#### GET `/api/clients`
Pobiera klientów z panelu klienta i mapuje na format panelu zarządzania.

Mapowanie pól:
- Email → `email`
- Imię → `firstName`
- Nazwisko → `lastName`
- Pełne imię i nazwisko → `name` lub `${firstName} ${lastName}`
- Firma → `company`
- Rola → `role`
- Status → `isEmailVerified` → "Zweryfikowany"/"Niezweryfikowany"
- Data utworzenia → `createdAt`
- Ostatnie logowanie → `lastLoginAt`

## 🚀 Uruchamianie

### 1. Utworzenie tabeli DynamoDB
```bash
cd /Users/tomaszgt/ECM\ Digital\ website
python aws-services-upload.py
```

### 2. Konfiguracja zmiennych środowiskowych

#### Panel Klienta (.env.local)
```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

#### Panel Zarządzania (.env)
```env
CLIENT_DASHBOARD_API_BASE_URL=http://localhost:3000
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 3. Uruchomienie serwerów

#### Terminal 1: Panel Zarządzania
```bash
cd /Users/tomaszgt/ECM\ Digital\ website/agency-management-panel
# Backend
cd backend && npm run dev
# Frontend (nowy terminal)
cd ../frontend && npm run dev
```

#### Terminal 2: Panel Klienta
```bash
cd /Users/tomaszgt/ECM\ Digital\ website/client-dashboard
npm run dev
```

## 🔄 Przepływ Rejestracji

1. **Klient rejestruje się** w panelu klienta
2. **AWS Cognito** tworzy konto i wysyła email weryfikacyjny
3. **Po rejestracji** automatycznie wywoływany jest `/api/auth/verify`
4. **Dane klienta** są synchronizowane z DynamoDB
5. **Panel zarządzania** może pobierać klientów przez `/api/clients`
6. **Klienci wyświetlani są** w tabeli w panelu zarządzania

## 📊 Wyświetlanie w Panelu Zarządzania

Tabela klientów zawiera kolumny:
- Email (z linkiem mailto)
- Imię
- Nazwisko
- Pełne imię i nazwisko
- Firma
- Rola (badge)
- Status (badge: Zielony - Zweryfikowany, Żółty - Niezweryfikowany)
- Data utworzenia (sformatowana)
- Ostatnie logowanie (sformatowana lub "Nigdy")

## 🔧 Konfiguracja AWS

### Uprawnienia IAM
Użytkownik `ecm-digital-admin` potrzebuje:
- `DynamoDBFullAccess`
- `SecretsManagerReadWrite`
- `AmazonRDSFullAccess`

### DynamoDB
- Region: `eu-west-1`
- Tabela: `ecm-users`
- GSI: `email-index`

## 🐛 Troubleshooting

### Brak klientów w panelu zarządzania
1. Sprawdź czy DynamoDB ma dane
2. Sprawdź konfigurację `CLIENT_DASHBOARD_API_BASE_URL`
3. Sprawdź logi backendu panelu zarządzania
4. Sprawdź CORS między usługami

### Błąd synchronizacji z DynamoDB
1. Sprawdź konfigurację AWS
2. Sprawdź czy tabela istnieje
3. Sprawdź uprawnienia IAM
4. Sprawdź logi panelu klienta

## 📝 TODO / Usprawnienia

- [ ] Automatyczne wywołanie `/api/auth/verify` po weryfikacji email (webhook)
- [ ] Dodanie paginacji dla listy użytkowników
- [ ] Dodanie filtrowania i wyszukiwania klientów
- [ ] Dodanie eksportu danych klientów
- [ ] Dodanie statystyk rejestracji
- [ ] Implementacja usuwania klientów
- [ ] Dodanie edycji danych klienta w panelu zarządzania

