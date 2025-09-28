# Aktywacja dostępu IAM użytkowników do Cost Explorer

## 🚨 Problem
Mimo poprawnych uprawnień IAM, użytkownicy nie mają dostępu do Cost Explorer w panelu AWS.

## 🔍 Przyczyna
Dostęp IAM użytkowników do Cost Explorer musi być **osobno aktywowany** przez root account na poziomie konta AWS.

## ✅ Rozwiązanie - Krok po kroku

### 1. Zaloguj się jako Root User
⚠️ **WAŻNE**: Ten proces może wykonać tylko **root user** konta AWS!

1. Idź do [AWS Console](https://console.aws.amazon.com/)
2. Zaloguj się jako **Root user** (nie IAM user)
3. Użyj głównego adresu email konta AWS

### 2. Przejdź do ustawień Cost Explorer

1. W panelu AWS przejdź do **Billing and Cost Management**
2. W menu po lewej stronie znajdź **Cost Explorer**
3. Kliknij **Cost Explorer**

### 3. Aktywuj dostęp IAM użytkowników

1. W Cost Explorer znajdź opcję **"IAM User and Role Access to Billing Information"**
2. Lub przejdź bezpośrednio do: **Account Settings** → **IAM User and Role Access to Billing Information**
3. **Zaznacz opcję**: "Activate IAM Access"
4. Kliknij **"Update"**

### 4. Alternatywna ścieżka przez Account Settings

1. Przejdź do **Account Settings** (w prawym górnym rogu → Account)
2. Znajdź sekcję **"IAM User and Role Access to Billing Information"**
3. Kliknij **"Edit"**
4. Zaznacz **"Activate IAM Access"**
5. Kliknij **"Update"**

## 🔧 Weryfikacja przez CLI

Po aktywacji sprawdź dostęp:

```bash
# Test podstawowy
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-02 \
  --granularity DAILY \
  --metrics UnblendedCost

# Test z naszym skryptem
./scripts/get-month-to-date-costs.sh
```

## 📋 Wymagane uprawnienia IAM

Po aktywacji upewnij się, że użytkownik ma te uprawnienia w polityce IAM:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ce:GetCostAndUsage",
                "ce:GetDimensionValues",
                "ce:GetReservationCoverage",
                "ce:GetReservationPurchaseRecommendation",
                "ce:GetReservationUtilization",
                "ce:GetUsageReport",
                "ce:DescribeCostCategoryDefinition",
                "ce:GetRightsizingRecommendation"
            ],
            "Resource": "*"
        }
    ]
}
```

## ⚠️ Ważne uwagi

1. **Tylko root user może aktywować dostęp**
2. **Aktywacja dotyczy całego konta AWS**
3. **Po aktywacji wszyscy IAM użytkownicy z odpowiednimi uprawnieniami będą mieli dostęp**
4. **Zmiany mogą potrwać kilka minut**

## 🔍 Rozwiązywanie problemów

### Problem: Nadal brak dostępu po aktywacji
1. Sprawdź czy jesteś zalogowany jako IAM user (nie root)
2. Sprawdź uprawnienia IAM użytkownika
3. Wyloguj się i zaloguj ponownie
4. Poczekaj 5-10 minut na propagację zmian

### Problem: Nie widzę opcji aktywacji
1. Upewnij się, że jesteś zalogowany jako root user
2. Sprawdź czy jesteś w odpowiednim regionie
3. Sprawdź Account Settings zamiast Cost Explorer

## 📚 Przydatne linki

- [AWS Documentation - Controlling Access](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/control-access-billing.html)
- [Cost Explorer User Guide](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html)

## 🎯 Po aktywacji

Po pomyślnej aktywacji będziesz mógł:
- ✅ Używać Cost Explorer w panelu AWS
- ✅ Wykonywać komendy CLI bez błędów
- ✅ Tworzyć raporty kosztów
- ✅ Ustawiać budżety i alerty

---
*Utworzono: $(date)*
*Status: Instrukcja do wykonania*