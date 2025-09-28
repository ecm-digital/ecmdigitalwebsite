# AWS Cost Explorer - Instrukcje Aktywacji Dostępu

## Problem
Błąd: `AccessDeniedException: IAM user access not activated` przy próbie użycia AWS Cost Explorer API.

## Przyczyna
Dostęp do Cost Explorer API wymaga specjalnej aktywacji na poziomie konta AWS, niezależnie od uprawnień IAM.

## Rozwiązanie

### Krok 1: Aktywacja Cost Explorer w AWS Console

1. **Zaloguj się do AWS Console** jako użytkownik z uprawnieniami administratora
2. **Przejdź do Cost Explorer**:
   - Wyszukaj "Cost Explorer" w AWS Console
   - Lub przejdź bezpośrednio: https://console.aws.amazon.com/cost-management/home#/cost-explorer
3. **Aktywuj Cost Explorer**:
   - Przy pierwszym wejściu zobaczysz opcję "Enable Cost Explorer"
   - Kliknij "Enable Cost Explorer"
   - Proces aktywacji może potrwać do 24 godzin

### Krok 2: Sprawdzenie Uprawnień IAM

Upewnij się, że użytkownik IAM ma odpowiednie uprawnienia. Użyj polityki z pliku:
```
scripts/cost-explorer-policy.json
```

Kluczowe uprawnienia:
- `ce:GetCostAndUsage`
- `ce:GetUsageReport`
- `ce:DescribeReport` ⚠️ **Nowe wymaganie**
- `ce:CreateReport`
- `ce:ListReports`
- `ce:GetCostForecast`
- `aws-portal:ViewBilling`
- `aws-portal:ViewUsage`

### Krok 3: Zastosowanie Polityki IAM

```bash
# Utwórz politykę IAM
aws iam create-policy \
    --policy-name ECM-CostExplorer-Policy \
    --policy-document file://scripts/cost-explorer-policy.json

# Dołącz politykę do użytkownika
aws iam attach-user-policy \
    --user-name YOUR_IAM_USER \
    --policy-arn arn:aws:iam::049164057970:policy/ECM-CostExplorer-Policy
```

### Krok 4: Weryfikacja Dostępu

Przetestuj dostęp używając AWS CLI:

```bash
# Test podstawowy
aws ce get-cost-and-usage \
    --time-period Start=2024-12-01,End=2025-01-01 \
    --granularity MONTHLY \
    --metrics BlendedCost

# Test z naszego skryptu
./scripts/aws-cost-optimization.sh
```

## Ważne Informacje

### Czas Aktywacji
- **Cost Explorer**: Do 24 godzin po aktywacji
- **Dane historyczne**: Dostępne po 24-48 godzinach
- **API dostęp**: Natychmiastowy po aktywacji Cost Explorer

### Koszty
- **Cost Explorer**: Pierwsze 1000 zapytań miesięcznie - bezpłatne
- **Dodatkowe zapytania**: $0.01 za zapytanie
- **Raporty**: Bezpłatne w AWS Console

### Uprawnienia Wymagane do Aktywacji
Użytkownik aktywujący Cost Explorer musi mieć:
- `aws-portal:ModifyBilling`
- `aws-portal:ViewBilling`
- `ce:*` (pełne uprawnienia Cost Explorer)

## Rozwiązywanie Problemów

### Problem: "Access Denied" po aktywacji
**Rozwiązanie**: Sprawdź czy polityka IAM została poprawnie dołączona:
```bash
aws iam list-attached-user-policies --user-name YOUR_IAM_USER
```

### Problem: "No data available"
**Rozwiązanie**: Poczekaj 24-48 godzin na wygenerowanie danych historycznych.

### Problem: "Invalid time period"
**Rozwiązanie**: Sprawdź format dat w zapytaniach API (YYYY-MM-DD).

### Problem: "ce:DescribeReport" Access Denied
**Rozwiązanie**: Zaktualizuj politykę IAM o nowe uprawnienia raportów:
```bash
# Usuń starą politykę
aws iam detach-user-policy \
    --user-name YOUR_IAM_USER \
    --policy-arn arn:aws:iam::049164057970:policy/ECM-CostExplorer-Policy

# Usuń starą wersję polityki
aws iam delete-policy \
    --policy-arn arn:aws:iam::049164057970:policy/ECM-CostExplorer-Policy

# Utwórz nową politykę z rozszerzonymi uprawnieniami
aws iam create-policy \
    --policy-name ECM-CostExplorer-Policy \
    --policy-document file://scripts/cost-explorer-policy.json

# Dołącz nową politykę
aws iam attach-user-policy \
    --user-name YOUR_IAM_USER \
    --policy-arn arn:aws:iam::049164057970:policy/ECM-CostExplorer-Policy
```

## Pliki Projektu Używające Cost Explorer

1. **scripts/aws-cost-optimization.sh** - Główny skrypt optymalizacji kosztów
2. **scripts/aws-budget-setup.sh** - Konfiguracja budżetów i alertów
3. **scripts/cost-explorer-policy.json** - Polityka IAM dla Cost Explorer

## Kontakt
W przypadku problemów z aktywacją skontaktuj się z administratorem AWS konta 049164057970.