# Rozwiązanie błędu "IAM user access not activated" w Cost Explorer

## 🚨 Problem
```
Service: [Cost Explorer] 
Name: [AccessDeniedException] 
HTTP status code: [400] 
Context: [Error in "get-month-to-date-net-unblended-cost": "IAM user access not activated"]
```

## 🔍 Analiza problemu

**Błąd jest mylący!** Komunikat "IAM user access not activated" **NIE** oznacza problemu z aktywacją IAM, ale próbę użycia **nieistniejącej komendy**.

### Komenda, która powoduje błąd:
```bash
aws ce get-month-to-date-net-unblended-cost
```

**Ta komenda nie istnieje w AWS CLI!**

## ✅ Rozwiązanie

### 1. Poprawna komenda do pobierania kosztów od początku miesiąca:

```bash
# Koszty od początku bieżącego miesiąca
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics NetUnblendedCost
```

### 2. Alternatywne komendy:

```bash
# Koszty dzienne z ostatnich 30 dni
aws ce get-cost-and-usage \
  --time-period Start=$(date -d '30 days ago' +%Y-%m-%d),End=$(date +%Y-%m-%d) \
  --granularity DAILY \
  --metrics UnblendedCost

# Koszty pogrupowane według usług
aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%Y-%m-%d) \
  --granularity MONTHLY \
  --metrics NetUnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

### 3. Gotowy skrypt

Użyj skryptu `scripts/get-month-to-date-costs.sh`:

```bash
./scripts/get-month-to-date-costs.sh
```

## 📋 Lista wszystkich dostępnych komend Cost Explorer

```bash
aws ce help
```

**Dostępne komendy (wybrane):**
- `get-cost-and-usage` - główna komenda do pobierania kosztów
- `get-cost-forecast` - prognozy kosztów
- `get-dimension-values` - wartości wymiarów
- `get-reservation-coverage` - pokrycie rezerwacji
- `get-savings-plans-coverage` - pokrycie planów oszczędnościowych

## 🔧 Weryfikacja

Sprawdź, czy Cost Explorer działa:

```bash
# Test podstawowy
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-02 \
  --granularity DAILY \
  --metrics UnblendedCost
```

## 💡 Kluczowe wnioski

1. **Błąd "IAM user access not activated" może być mylący**
2. **Zawsze sprawdź, czy komenda istnieje**: `aws ce help`
3. **Użyj `get-cost-and-usage` zamiast nieistniejących komend**
4. **IAM dla Cost Explorer jest aktywny** - problem był tylko w nazwie komendy

## 📚 Powiązane pliki

- `scripts/get-month-to-date-costs.sh` - gotowy skrypt
- `docs/COST-EXPLORER-COMMANDS.md` - pełna dokumentacja komend
- `docs/REGIONS-PERMISSION-UPDATE.md` - dokumentacja uprawnień

---
*Utworzono: $(date)*
*Status: Rozwiązane ✅*