# AWS Cost Explorer - Poprawne Komendy CLI

## Problem
Błąd: `AccessDeniedException: IAM user access not activated` w komendzie `get-month-to-date-net-unblended-cost`

## Analiza Problemu
1. **Komenda nie istnieje**: `get-month-to-date-net-unblended-cost` nie jest poprawną komendą AWS CLI
2. **IAM Access jest aktywowany**: Dostęp IAM do Cost Explorer jest już aktywowany na koncie
3. **Rozwiązanie**: Użycie poprawnych komend Cost Explorer

## Poprawne Komendy Cost Explorer

### 1. Pobieranie Kosztów Miesięcznych (Month-to-Date)
```bash
# Koszty od początku miesiąca do dziś - NetUnblendedCost
aws ce get-cost-and-usage \
  --time-period Start=2025-09-01,End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics NetUnblendedCost

# Koszty od początku miesiąca do dziś - UnblendedCost
aws ce get-cost-and-usage \
  --time-period Start=2025-09-01,End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics UnblendedCost
```

### 2. Pobieranie Kosztów Dziennych
```bash
# Koszty dzienne w bieżącym miesiącu
aws ce get-cost-and-usage \
  --time-period Start=2025-09-01,End=$(date +%Y-%m-%d) \
  --granularity DAILY \
  --metrics NetUnblendedCost
```

### 3. Pobieranie Kosztów z Grupowaniem
```bash
# Koszty pogrupowane według usług
aws ce get-cost-and-usage \
  --time-period Start=2025-09-01,End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics NetUnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

### 4. Prognoza Kosztów
```bash
# Prognoza kosztów na następny miesiąc
aws ce get-cost-forecast \
  --time-period Start=2025-10-01,End=2025-10-31 \
  --metric UNBLENDED_COST \
  --granularity MONTHLY
```

## Dostępne Metryki
- `UnblendedCost` - Koszty nieprzeliczone
- `NetUnblendedCost` - Koszty netto nieprzeliczone
- `BlendedCost` - Koszty przeliczone
- `NetBlendedCost` - Koszty netto przeliczone
- `UsageQuantity` - Ilość użycia

## Dostępne Granularności
- `DAILY` - Dzienne
- `MONTHLY` - Miesięczne
- `HOURLY` - Godzinowe (tylko dla ostatnich 14 dni)

## Przykładowe Wyniki

### Koszty Month-to-Date (2025-09-01 do 2025-09-16)
```json
{
    "ResultsByTime": [
        {
            "TimePeriod": {
                "Start": "2025-09-01",
                "End": "2025-09-16"
            },
            "Total": {
                "NetUnblendedCost": {
                    "Amount": "340.2284432201",
                    "Unit": "USD"
                }
            },
            "Groups": [],
            "Estimated": true
        }
    ]
}
```

## Skrypt Automatyczny - Month-to-Date Costs
```bash
#!/bin/bash
# get-month-to-date-costs.sh

# Pobierz pierwszy dzień bieżącego miesiąca
MONTH_START=$(date +%Y-%m-01)
# Pobierz dzisiejszą datę
TODAY=$(date +%Y-%m-%d)

echo "Pobieranie kosztów od $MONTH_START do $TODAY..."

aws ce get-cost-and-usage \
  --time-period Start=$MONTH_START,End=$TODAY \
  --granularity MONTHLY \
  --metrics NetUnblendedCost \
  --output table

echo "Koszty pogrupowane według usług:"
aws ce get-cost-and-usage \
  --time-period Start=$MONTH_START,End=$TODAY \
  --granularity MONTHLY \
  --metrics NetUnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE \
  --output table
```

## Uprawnienia IAM Wymagane
Użytkownik `ecm-digital-admin` ma już wszystkie wymagane uprawnienia:
- `ce:GetCostAndUsage` ✅
- `ce:GetCostForecast` ✅
- `ce:GetDimensionValues` ✅
- `ce:GetReservationCoverage` ✅
- `ce:GetReservationUtilization` ✅

## Status IAM Access
- **Status**: ✅ Aktywowany
- **Konto**: 049164057970
- **Użytkownik**: ecm-digital-admin
- **Polityka**: ECM-CostExplorer-Policy v5

## Rozwiązanie Błędu
Zamiast niepoprawnej komendy:
```bash
# ❌ BŁĘDNE - komenda nie istnieje
aws ce get-month-to-date-net-unblended-cost
```

Użyj poprawnej komendy:
```bash
# ✅ POPRAWNE
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics NetUnblendedCost
```

---
*Dokumentacja utworzona: 2025-09-16*
*Status: IAM Access aktywowany, komendy działają poprawnie*