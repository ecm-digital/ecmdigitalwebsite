# Dodanie uprawnienia BCM do polityki IAM

## 🎯 Cel
Dodanie uprawnienia `bcm-recommended-actions:ListRecommendedActions` do polityki `ECM-CostExplorer-Policy` w celu uzyskania dostępu do pełnej listy rekomendowanych akcji optymalizacji kosztów w AWS Billing and Cost Management.

## ✅ Wykonane kroki

### 1. Sprawdzenie aktualnej polityki
```bash
aws iam get-policy-version \
  --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/ECM-CostExplorer-Policy \
  --version-id v1
```

**Wynik**: Polityka v1 zawierała uprawnienia Cost Explorer, Budgets, Access Analyzer, ale brakowało uprawnień BCM.

### 2. Utworzenie nowej wersji polityki
**Plik**: `scripts/ecm-policy-v2.json`

**Dodane uprawnienie**:
```json
"bcm-recommended-actions:ListRecommendedActions"
```

### 3. Wdrożenie nowej wersji
```bash
aws iam create-policy-version \
  --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/ECM-CostExplorer-Policy \
  --policy-document file://scripts/ecm-policy-v2.json \
  --set-as-default
```

**Wynik**: ✅ Utworzono wersję v2 jako domyślną (2025-09-16T06:22:22+00:00)

### 4. Weryfikacja uprawnień
```bash
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):user/ecm-digital-admin \
  --action-names bcm-recommended-actions:ListRecommendedActions
```

**Wynik**: ✅ `"EvalDecision": "allowed"` - uprawnienie zostało pomyślnie przyznane

## 📋 Pełna lista uprawnień w polityce v2

### Cost Explorer (CE)
- `ce:GetCostAndUsage`
- `ce:GetDimensionValues`
- `ce:GetReservationCoverage`
- `ce:GetReservationPurchaseRecommendation`
- `ce:GetReservationUtilization`
- `ce:GetSavingsPlansUtilization`
- `ce:GetSavingsPlansCoverage`
- `ce:GetSavingsPlansUtilizationDetails`
- `ce:GetSavingsPlansUsage`
- `ce:GetUsageReport`
- `ce:DescribeReport`
- `ce:CreateReport`
- `ce:DeleteReport`
- `ce:ModifyReport`
- `ce:ListReports`
- `ce:GetReports`

### Budgets
- `budgets:ViewBudget`
- `budgets:DescribeBudgets`
- `budgets:DescribeBudgetAction`
- `budgets:DescribeBudgetActionsForBudget`
- `budgets:DescribeBudgetActionsForAccount`
- `budgets:DescribeBudgetPerformanceHistory`
- `budgets:DescribeSubscribersForNotification`
- `budgets:DescribeNotificationsForBudget`

### Billing Portal
- `aws-portal:ViewBilling`
- `aws-portal:ViewUsage`
- `aws-portal:ViewAccount`

### Access Analyzer
- `access-analyzer:ListPolicyGenerations`
- `access-analyzer:ListAnalyzers`
- `access-analyzer:GetAnalyzer`
- `access-analyzer:ListFindings`
- `access-analyzer:GetFinding`
- `access-analyzer:CreateAnalyzer`
- `access-analyzer:DeleteAnalyzer`
- `access-analyzer:StartPolicyGeneration`
- `access-analyzer:GetGeneratedPolicy`
- `access-analyzer:CancelPolicyGeneration`
- `access-analyzer:ValidatePolicy`
- `access-analyzer:CheckAccessNotGranted`
- `access-analyzer:CheckNoNewAccess`
- `access-analyzer:GetFindingsStatistics`

### 🆕 BCM Recommended Actions
- `bcm-recommended-actions:ListRecommendedActions` ✨

## 🔍 Co to oznacza?

### BCM Recommended Actions
**AWS Billing and Cost Management Recommended Actions** to usługa, która:

1. **Analizuje wzorce użycia** zasobów AWS
2. **Identyfikuje możliwości oszczędności** kosztów
3. **Dostarcza konkretne rekomendacje** optymalizacji
4. **Priorytetyzuje akcje** według potencjalnych oszczędności

### Przykłady rekomendacji:
- Zmiana typu instancji EC2 na bardziej efektywny
- Zakup Reserved Instances lub Savings Plans
- Usunięcie nieużywanych zasobów
- Optymalizacja storage classes w S3
- Konfiguracja lifecycle policies

## 🎯 Następne kroki

1. **Sprawdź AWS Console** - sekcja "Cost Management" → "Recommended Actions"
2. **Przejrzyj rekomendacje** i oceń ich wpływ na koszty
3. **Wdróż wybrane optymalizacje** zgodnie z priorytetami biznesowymi
4. **Monitoruj efekty** za pomocą Cost Explorer

## 📊 Status polityki

| Wersja | Status | Data utworzenia | Uprawnienia |
|--------|--------|-----------------|-------------|
| v1 | Nieaktywna | 2025-09-16 05:23:48 | 31 uprawnień |
| **v2** | **✅ Aktywna** | **2025-09-16 06:22:22** | **32 uprawnienia** |

---
**Status**: ✅ **UPRAWNIENIE BCM DODANE POMYŚLNIE**  
**Ostatnia aktualizacja**: 2025-09-16 06:22:22