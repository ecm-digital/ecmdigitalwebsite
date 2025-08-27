# 🎯 ECM Marketing Agent - Setup Summary

## ✅ Status: Infrastruktura gotowa!

### Co zostało już skonfigurowane:
- ✅ **AWS Lambda Functions** (3 funkcje działają)
- ✅ **S3 Buckets** (Knowledge Base + CMS)
- ✅ **Knowledge Base Files** (wszystkie pliki wgrane)
- ✅ **IAM Roles** (dla Lambda functions)

---

## 🚀 Następne kroki:

### 1. **Konfiguracja Bedrock Agent** (10-15 minut)

#### Szybki przewodnik:
1. Otwórz [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Wybierz region **eu-central-1 (Frankfurt)**
3. Przejdź do **Knowledge bases** → **Create knowledge base**
4. Skonfiguruj jak w `bedrock-setup/README.md` (sekcja 2)
5. Przejdź do **Agents** → **Create Agent**
6. Skonfiguruj jak w `bedrock-setup/README.md` (sekcja 3)
7. Dodaj Action Groups jak w `bedrock-setup/README.md` (sekcja 4)

### 2. **Testowanie infrastruktury** (opcjonalne)

```bash
# Sprawdź status środowiska
node bedrock-setup/check-environment.js

# Przetestuj funkcje Lambda
node bedrock-setup/test-lambda-functions.js
```

### 3. **Konfiguracja zmiennych środowiskowych**

#### Dla funkcji CreateLinear-dev:
```bash
aws lambda update-function-configuration \
  --function-name CreateLinear-dev \
  --environment "Variables={LINEAR_API_KEY=your_linear_api_key}"
```

#### Dla funkcji SaveBlogDraft-dev:
```bash
aws lambda update-function-configuration \
  --function-name SaveBlogDraft-dev \
  --environment "Variables={REVALIDATE_SECRET=your_secret,REVALIDATE_URL=https://your-domain.com/api/revalidate}"
```

---

## 📋 Lista kontrolna przed uruchomieniem:

### Wymagane dane:
- [ ] **LINEAR_API_KEY** - klucz API z Linear
- [ ] **REVALIDATE_SECRET** - sekret do Next.js revalidation
- [ ] **Dostęp do AWS Bedrock Console**

### Opcjonalne:
- [ ] **REVALIDATE_URL** - URL do revalidacji strony
- [ ] **EMAIL_FROM_ADDRESS** - adres email do powiadomień

---

## 🎯 Pierwszy test po skonfigurowaniu:

### W konsoli Bedrock Agent wpisz:
```
Napisz szkic bloga o optymalizacji SEO dla małych firm.
```

### Oczekiwana odpowiedź (JSON):
```json
{
  "intent": "blog",
  "confidence": 0.95,
  "blogDraft": {
    "language": "pl",
    "title": "...",
    "slug": "...",
    "tags": ["..."],
    "excerpt": "...",
    "sections": ["...", "..."],
    "seo": {
      "title": "...",
      "description": "...",
      "ogImage": "..."
    },
    "publishMode": "draft"
  },
  "seoPack": {
    "title": "...",
    "description": "...",
    "slug": "...",
    "tags": ["..."]
  },
  "reply": "..."
}
```

---

## 🔧 Troubleshooting:

### Problem: "Access Denied" przy tworzeniu Knowledge Base
**Rozwiązanie:** Sprawdź uprawnienia IAM dla Bedrock

### Problem: Funkcje Lambda nie mają dostępu do zmiennych środowiskowych
**Rozwiązanie:** Skonfiguruj zmienne środowiskowe jak pokazano powyżej

### Problem: Linear API zwraca błędy
**Rozwiązanie:** Sprawdź czy klucz API jest prawidłowy i ma dostęp do zespołu "ECM"

---

## 📚 Dokumentacja:

- **`bedrock-setup/README.md`** - Szczegółowy przewodnik konfiguracji
- **`bedrock-setup/agent-config.json`** - Konfiguracja JSON dla automatyzacji
- **`prompts/system_marketing_agent.txt`** - System Prompt dla Agenta
- **`schemas/actionplan.schema.json`** - Schemat walidacji odpowiedzi

---

## 🎉 Gratulacje!

**ECM Marketing Agent jest prawie gotowy!**

Po wykonaniu powyższych kroków będziesz mieć w pełni funkcjonalnego agenta AI, który potrafi:

- ✍️ **Tworzyć treści blogowe** w formacie MDX
- 📋 **Zarządzać zadaniami** w Linear
- 📧 **Wysyłać powiadomienia** email
- 🎯 **Planować kampanie** marketingowe
- 📊 **Optymalizować SEO** zgodnie z wytycznymi

**Powodzenia! Twój inteligentny asystent marketingowy czeka na pierwsze zadania!** 🚀

---

*Data utworzenia: $(date)*
*Wersja: 1.0.0*
*Autor: ECM Digital Team*
