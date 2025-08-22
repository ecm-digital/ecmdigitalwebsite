# Instrukcje wysłania na GitHub

## Krok 1: Utwórz repozytorium na GitHub

1. Idź na https://github.com
2. Kliknij "New repository" (zielony przycisk)
3. Nazwa repozytorium: `agency-management-panel`
4. Opis: `Comprehensive management system for digital agency operations`
5. Ustaw jako **Private** (zalecane dla kodu firmowego)
6. **NIE** zaznaczaj "Add a README file" (już mamy)
7. Kliknij "Create repository"

## Krok 2: Połącz lokalne repozytorium z GitHub

Po utworzeniu repozytorium na GitHub, skopiuj URL (powinien wyglądać jak: `https://github.com/twoja-nazwa/agency-management-panel.git`)

Następnie wykonaj te komendy w terminalu:

```bash
# Dodaj remote origin (zastąp URL swoim)
git remote add origin https://github.com/twoja-nazwa/agency-management-panel.git

# Wyślij kod na GitHub
git push -u origin main
```

## Krok 3: Sprawdź czy wszystko działa

1. Odśwież stronę repozytorium na GitHub
2. Powinieneś zobaczyć wszystkie pliki
3. README.md powinien się wyświetlać na stronie głównej

## Opcjonalnie: Skonfiguruj GitHub Pages (dla dokumentacji)

1. W repozytorium idź do Settings
2. Scroll w dół do "Pages"
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Kliknij "Save"

## Struktura repozytorium

Po wysłaniu na GitHub będziesz mieć:

```
agency-management-panel/
├── .gitignore                    # Pliki do ignorowania
├── README.md                     # Dokumentacja główna
├── docker-compose.yml           # Konfiguracja Docker
├── frontend/                    # Aplikacja Next.js
├── backend/                     # API Node.js
└── supabase/                   # Migracje bazy danych
```

## Następne kroki

1. **Skonfiguruj CI/CD** - GitHub Actions dla automatycznego deploymentu
2. **Dodaj Issues** - Zaplanuj kolejne funkcjonalności
3. **Utwórz Projects** - Zarządzaj zadaniami w GitHub Projects
4. **Dodaj collaborators** - Zaproś członków zespołu

## Bezpieczeństwo

⚠️ **WAŻNE**: Nigdy nie commituj:
- Kluczy API w kodzie
- Haseł do bazy danych
- Tokenów dostępu
- Plików `.env` z danymi produkcyjnymi

Używaj GitHub Secrets dla zmiennych środowiskowych w CI/CD.