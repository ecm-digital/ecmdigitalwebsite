# 🔄 Migracja z AWS na Supabase - Client Dashboard

## 📋 Przegląd zmian

Przeszliśmy z płatnych usług AWS na **100% DARMOWE** alternatywy:

| AWS Service | Supabase Alternative | Koszt |
|------------|---------------------|-------|
| AWS Cognito | Supabase Auth | **DARMOWE** (50k MAU) |
| AWS DynamoDB | Supabase PostgreSQL | **DARMOWE** (500MB) |
| AWS S3 | Supabase Storage | **DARMOWE** (1GB) |
| AWS Lambda | Supabase Edge Functions | **DARMOWE** |
| AWS SES | Resend | **DARMOWE** (3k emails/m) |

## ✅ Co zostało usunięte

### Pliki AWS:
- ❌ `aws-cli-commands.sh`
- ❌ `aws-env-example.txt`
- ❌ `lambda-functions/` (cały folder)
- ❌ `src/lib/aws-config.ts`
- ❌ `src/lib/aws-server.ts`
- ❌ `src/hooks/use-aws-auth.ts`
- ❌ `src/hooks/use-messages-aws.ts`
- ❌ `src/components/messages/*-aws.tsx`

### Zależności AWS:
- ❌ `@aws-sdk/client-cognito-identity-provider`
- ❌ `@aws-sdk/client-dynamodb`
- ❌ `@aws-sdk/client-lambda`
- ❌ `@aws-sdk/client-s3`
- ❌ `@aws-sdk/lib-dynamodb`
- ❌ `aws-sdk`
- ❌ `crypto-browserify`
- ❌ `buffer`
- ❌ `stream-browserify`
- ❌ `process`
- ❌ `util`

## ✨ Co zostało dodane

### Nowe pliki Supabase:
- ✅ `src/lib/supabase.ts` - Konfiguracja Supabase client
- ✅ `src/hooks/use-auth.ts` - Hook autentykacji z Supabase
- ✅ `.env.example` - Przykładowa konfiguracja

### Nowe zależności:
- ✅ `@supabase/supabase-js` - Supabase client

## 🚀 Jak skonfigurować Supabase

### 1. Utwórz konto Supabase (DARMOWE)

```bash
# Przejdź do https://supabase.com
# Kliknij "Start your project"
# Utwórz nowy projekt (wybierz region: eu-central-1)
```

### 2. Pobierz credentials

W Supabase Dashboard:
1. Przejdź do **Settings** > **API**
2. Skopiuj **Project URL**
3. Skopiuj **anon public** key

### 3. Skonfiguruj zmienne środowiskowe

Utwórz plik `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Utwórz schemat bazy danych

W Supabase Dashboard > **SQL Editor**, wykonaj:

```sql
-- Tabela użytkowników (profiles)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela projektów
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  type TEXT,
  budget DECIMAL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela wiadomości
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  sender_type TEXT DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela dokumentów
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela faktur
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policies - użytkownicy widzą tylko swoje dane
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = messages.project_id
    )
  );

CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM projects WHERE id = documents.project_id
    )
  );

CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);
```

### 5. Skonfiguruj Storage

W Supabase Dashboard > **Storage**:

1. Utwórz bucket `documents` (public: false)
2. Utwórz bucket `avatars` (public: true)
3. Utwórz bucket `project-files` (public: false)

### 6. Zainstaluj zależności

```bash
npm install
```

### 7. Uruchom aplikację

```bash
npm run dev
```

## 🎯 Tryb Demo (bez Supabase)

Jeśli nie skonfigurujesz Supabase, aplikacja automatycznie działa w **trybie demo**:

- ✅ Automatyczne logowanie jako użytkownik demo
- ✅ Przykładowe dane projektów
- ✅ Wszystkie funkcje UI działają
- ❌ Brak persystencji danych
- ❌ Brak real-time updates

## 📊 Porównanie kosztów

### Poprzednio (AWS):
- Cognito: ~$0.0055/MAU (po 50k)
- DynamoDB: ~$0.25/milion odczytów
- S3: ~$0.023/GB
- Lambda: ~$0.20/milion requestów
- **Szacowany koszt: $50-200/miesiąc**

### Teraz (Supabase):
- Auth: DARMOWE (50k MAU)
- Database: DARMOWE (500MB)
- Storage: DARMOWE (1GB)
- Edge Functions: DARMOWE
- **Koszt: $0/miesiąc** 🎉

## 🔧 Migracja danych (jeśli masz dane w AWS)

### 1. Export z DynamoDB

```bash
# Zainstaluj AWS CLI
aws dynamodb scan --table-name ecm-users --output json > users.json
aws dynamodb scan --table-name ecm-projects --output json > projects.json
```

### 2. Import do Supabase

```javascript
// import-to-supabase.js
const { createClient } = require('@supabase/supabase-js')
const users = require('./users.json')
const projects = require('./projects.json')

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SERVICE_ROLE_KEY' // Use service role key for admin operations
)

async function importData() {
  // Import users
  for (const item of users.Items) {
    await supabase.from('profiles').insert({
      id: item.id.S,
      email: item.email.S,
      name: item.name?.S,
      company: item.company?.S,
      role: item.role?.S || 'client'
    })
  }

  // Import projects
  for (const item of projects.Items) {
    await supabase.from('projects').insert({
      id: item.id.S,
      user_id: item.userId.S,
      name: item.name.S,
      description: item.description?.S,
      status: item.status?.S || 'active',
      type: item.type?.S,
      budget: item.budget?.N ? parseFloat(item.budget.N) : null
    })
  }

  console.log('✅ Import completed!')
}

importData()
```

## 🆘 Troubleshooting

### Problem: "Invalid API key"
**Rozwiązanie:** Sprawdź czy skopiowałeś `anon public` key (nie `service_role`)

### Problem: "Row Level Security policy violation"
**Rozwiązanie:** Upewnij się że wykonałeś wszystkie SQL policies

### Problem: "Storage bucket not found"
**Rozwiązanie:** Utwórz buckety w Supabase Dashboard > Storage

### Problem: Aplikacja nie działa
**Rozwiązanie:** Sprawdź czy plik `.env.local` jest w głównym katalogu (nie w `src/`)

## 📞 Wsparcie

Jeśli masz problemy z migracją:
1. Sprawdź logi w konsoli przeglądarki (F12)
2. Sprawdź logi w Supabase Dashboard > Logs
3. Skontaktuj się z zespołem ECM Digital

---

**🎉 Gratulacje! Twój dashboard jest teraz 100% darmowy!**
