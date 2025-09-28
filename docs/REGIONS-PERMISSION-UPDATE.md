# Aktualizacja Uprawnień AWS - Dostęp do Regionów

## Cel
Dodanie uprawnień do listowania regionów AWS dla użytkownika `ecm-digital-admin` w celu rozwiązania błędu: "You don't have the permissions required to list AWS Regions."

## Wykonane Kroki

### 1. Identyfikacja Problemu
- **Błąd**: Brak uprawnień do listowania regionów AWS
- **Potrzebne uprawnienie**: `ec2:DescribeRegions`

### 2. Weryfikacja Aktualnych Uprawnień
```bash
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::049164057970:user/ecm-digital-admin \
  --action-names ec2:DescribeRegions
```
**Wynik**: `implicitDeny` - brak uprawnień

### 3. Utworzenie Nowej Wersji Polityki
- **Plik**: `scripts/ecm-policy-v5.json`
- **Dodane uprawnienia**:
  - `ec2:DescribeRegions`
  - `ec2:DescribeAvailabilityZones`

### 4. Wdrożenie Polityki v5
```bash
aws iam create-policy-version \
  --policy-arn arn:aws:iam::049164057970:policy/ECM-CostExplorer-Policy \
  --policy-document file://scripts/ecm-policy-v5.json \
  --set-as-default
```

### 5. Weryfikacja Uprawnień
- **Symulacja IAM**: `allowed` ✅
- **Test rzeczywisty**: `aws ec2 describe-regions` - działa poprawnie ✅

## Pełna Lista Uprawnień w Wersji v5

### Cost Explorer & Billing
- `ce:*` (wszystkie operacje Cost Explorer)
- `budgets:*` (operacje odczytu budżetów)
- `aws-portal:View*` (dostęp do portalu rozliczeniowego)

### Access Analyzer
- `access-analyzer:*` (wszystkie operacje Access Analyzer)

### Billing and Cost Management
- `bcm-recommended-actions:ListRecommendedActions`

### Service Catalog
- `servicecatalog:ListApplications`
- `servicecatalog-appregistry:*` (operacje App Registry)

### EC2 (Nowe)
- `ec2:DescribeRegions` ✅
- `ec2:DescribeAvailabilityZones` ✅

## Opis Nowych Uprawnień

### ec2:DescribeRegions
- **Cel**: Umożliwia listowanie wszystkich dostępnych regionów AWS
- **Zastosowanie**: Potrzebne do wyświetlania listy regionów w aplikacjach i skryptach
- **Zasób**: `*` (globalne)

### ec2:DescribeAvailabilityZones
- **Cel**: Umożliwia listowanie stref dostępności w regionach
- **Zastosowanie**: Dodatkowe informacje o infrastrukturze AWS
- **Zasób**: `*` (wszystkie regiony)

## Test Funkcjonalności

### Dostępne Regiony AWS
Komenda `aws ec2 describe-regions` zwraca listę 17 regionów:
- us-east-1, us-east-2, us-west-1, us-west-2
- eu-west-1, eu-west-2, eu-west-3, eu-central-1, eu-north-1
- ap-northeast-1, ap-northeast-2, ap-northeast-3
- ap-southeast-1, ap-southeast-2, ap-south-1
- ca-central-1, sa-east-1

## Status Polityki
- **Aktualna wersja**: v5
- **Status**: Aktywna (IsDefaultVersion: true)
- **Data utworzenia**: 2025-09-16T06:27:06+00:00
- **Użytkownik**: ecm-digital-admin
- **ARN polityki**: arn:aws:iam::049164057970:policy/ECM-CostExplorer-Policy

## Następne Kroki
1. Monitorowanie wykorzystania nowych uprawnień
2. Regularne przeglądy uprawnień w ramach security audit
3. Dokumentowanie wszelkich przyszłych zmian w uprawnieniach

---
*Dokumentacja utworzona: 2025-09-16*
*Ostatnia aktualizacja: v5 polityki IAM*