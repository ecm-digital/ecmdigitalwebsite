# Setup bazy danych Supabase

## Krok 1: Uruchom migrację w Supabase Dashboard

1. Przejdź do https://supabase.com/dashboard
2. Wybierz swój projekt ECM Digital
3. Przejdź do **SQL Editor**
4. Skopiuj i wklej zawartość pliku `supabase/migrations/001_initial_schema.sql`
5. Kliknij **Run** aby wykonać migrację

## Krok 2: Dodaj przykładowe dane (opcjonalnie)

1. W SQL Editor wklej zawartość pliku `supabase/seed.sql`
2. Kliknij **Run** aby dodać przykładowe dane

## Krok 3: Sprawdź tabele

W zakładce **Table Editor** powinieneś zobaczyć nowe tabele:
- profiles
- projects  
- messages
- documents
- invoices

## Krok 4: Sprawdź RLS Policies

W zakładce **Authentication** > **Policies** sprawdź czy zostały utworzone polityki bezpieczeństwa.

## Troubleshooting

Jeśli wystąpią błędy:
1. Sprawdź czy masz uprawnienia administratora
2. Upewnij się, że projekt Supabase jest aktywny
3. Sprawdź logi w zakładce **Logs**