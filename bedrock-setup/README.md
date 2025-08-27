# 🚀 ECM Marketing Agent - Bedrock Setup Guide

## Przewodnik krok po kroku konfiguracji Amazon Bedrock Agent

### 📋 Spis treści
1. [Wymagania wstępne](#wymagania-wstępne)
2. [Konfiguracja Knowledge Base](#konfiguracja-knowledge-base)
3. [Tworzenie Agenta](#tworzenie-agenta)
4. [Konfiguracja Action Groups](#konfiguracja-action-groups)
5. [Testowanie Agenta](#testowanie-agenta)
6. [Troubleshooting](#troubleshooting)

---

## 1. Wymagania wstępne

### ✅ Co zostało już skonfigurowane:
- **S3 Buckets:** `ecm-digital-knowledge-dev`, `ecm-digital-cms-dev`
- **Lambda Functions:** CreateLinear-dev, SaveBlogDraft-dev, NotifyUser-dev
- **Knowledge Base Files:** Wszystkie pliki wgrane do S3

### 🔧 Co musisz mieć:
- **Dostęp do AWS Bedrock Console**
- **LINEAR_API_KEY** (otrzymasz od administratora Linear)
- **REVALIDATE_SECRET** (sekret do revalidacji Next.js)

---

## 2. Konfiguracja Knowledge Base

### Krok 2.1: Przejdź do Bedrock Console
1. Otwórz [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Wybierz region: **eu-central-1 (Frankfurt)**
3. W menu po lewej wybierz **Knowledge bases**

### Krok 2.2: Utwórz nową Knowledge Base
```
Name: ECM-Digital-Knowledge-Base-Dev
Description: Baza wiedzy zawierająca informacje o usługach, case studies i wytycznych brandingu
```

### Krok 2.3: Skonfiguruj źródło danych
```
Data source name: ECM-Knowledge-Data-Source
S3 URI: s3://ecm-digital-knowledge-dev/
Include folders: brand/, services/, seo/, templates/
```

### Krok 2.4: Skonfiguruj Embeddings
```
Embedding model: Titan Text Embeddings v2
Vector dimensions: 1024
Chunking strategy: Default
```

### Krok 2.5: Zapisz i rozpocznij sync
- Kliknij **Create knowledge base**
- Knowledge base zostanie utworzona i rozpocznie indeksowanie plików

---

## 3. Tworzenie Agenta

### Krok 3.1: Przejdź do sekcji Agents
1. W menu po lewej wybierz **Agents**
2. Kliknij **Create Agent**

### Krok 3.2: Podstawowe informacje
```
Agent name: ECM-Marketing-Agent-Dev
Description: Agent marketingowy ECM Digital do tworzenia treści, zarządzania zadaniami i kampaniami
Foundation model: Claude 3 Sonnet
```

### Krok 3.3: Skopiuj System Prompt
Skopiuj całą zawartość pliku `prompts/system_marketing_agent.txt`:

```text
Rola: Jesteś Agentem Marketingu ECM Digital.
Cel: Twórz plany działań, briefy, szkice treści, SEO pack i taski w Linear.
Ton: zgodnie z brand/stylecard.json (konkretnie, partnersko, bez żargonu).
Kontekst: korzystaj z wiedzy S3 (oferta, case studies, linkowanie wewn.).
Bezpieczeństwo: unikaj wrażliwych tematów, nie obiecuj gwarantowanych wyników.
Format odpowiedzi: ZWRACAJ WYŁĄCZNIE ActionPlan JSON zgodny ze schemas/actionplan.schema.json.
Zasady:
1) W przypadku treści blogowej przygotuj blogDraft (MDX template), oraz seoPack.
2) Jeśli wymagana egzekucja, dodaj linearTasks z teamKey, labels, priority.
3) Slug: kebab-case, bez polskich znaków.
4) MDX: obowiązkowo <Lead/>, sekcje H2, „Co z tego masz?", „Następne kroki".
5) Jeżeli brakuje danych, dodefiniuj rozsądnie + dodaj task „Uzupełnij dane X".
6) Linkowanie: użyj seo/internal-links.json do /services i /case-studies.
7) Domyślnie publishMode=draft.
Tools: createLinearTasks, saveBlogDraft, notifyUser. Używaj tylko przy potrzebie egzekucji.
```

### Krok 3.4: Wybierz Knowledge Base
- Wybierz utworzoną wcześniej: **ECM-Digital-Knowledge-Base-Dev**
- Ustaw **Retrieval strategy** na **Standard**

---

## 4. Konfiguracja Action Groups

### Krok 4.1: Dodaj pierwszą Action Group - CreateLinearTasks

#### Action Group Details:
```
Name: CreateLinearTasks
Description: Tworzenie zadań w systemie Linear
```

#### Function Schema (skopiuj dokładnie):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {"type": "string"},
          "description": {"type": "string"},
          "teamKey": {"type": "string"},
          "labels": {"type": "array", "items": {"type": "string"}},
          "priority": {"type": "integer", "minimum": 0, "maximum": 3},
          "estimate": {"type": "number", "minimum": 0},
          "dueDate": {"type": "string", "format": "date"}
        },
        "required": ["title", "teamKey"]
      }
    }
  },
  "required": ["tasks"]
}
```

#### Lambda Function:
```
Lambda ARN: arn:aws:lambda:eu-central-1:049164057970:function:CreateLinear-dev
```

### Krok 4.2: Dodaj drugą Action Group - SaveBlogDraft

#### Action Group Details:
```
Name: SaveBlogDraft
Description: Zapisywanie szkicu bloga do systemu CMS
```

#### Function Schema:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "blogDraft": {
      "type": "object",
      "properties": {
        "language": {"type": "string", "enum": ["pl", "en"]},
        "title": {"type": "string"},
        "slug": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "excerpt": {"type": "string"},
        "sections": {"type": "array", "items": {"type": "string"}},
        "seo": {
          "type": "object",
          "properties": {
            "title": {"type": "string"},
            "description": {"type": "string"},
            "ogImage": {"type": "string"}
          }
        },
        "publishMode": {"type": "string", "enum": ["draft", "auto"]}
      },
      "required": ["language", "title", "slug"]
    },
    "seoPack": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "description": {"type": "string"},
        "slug": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["title", "description", "slug"]
    }
  },
  "required": ["blogDraft", "seoPack"]
}
```

#### Lambda Function:
```
Lambda ARN: arn:aws:lambda:eu-central-1:049164057970:function:SaveBlogDraft-dev
```

### Krok 4.3: Dodaj trzecią Action Group - NotifyUser

#### Action Group Details:
```
Name: NotifyUser
Description: Wysyłanie powiadomień do użytkowników
```

#### Function Schema:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "userEmail": {"type": "string", "format": "email"},
    "actionType": {"type": "string"},
    "actionData": {"type": "object"},
    "message": {"type": "string"}
  },
  "required": ["userEmail", "actionType"]
}
```

#### Lambda Function:
```
Lambda ARN: arn:aws:lambda:eu-central-1:049164057970:function:NotifyUser-dev
```

---

## 5. Testowanie Agenta

### Krok 5.1: Przygotuj test
1. W panelu Agenta przejdź do zakładki **Test**
2. Wybierz **Working draft**

### Krok 5.2: Przykładowe zapytania testowe

#### Test 1: Generowanie treści bloga
```
Napisz szkic bloga o optymalizacji e-commerce dla małych firm.
```

#### Oczekiwana odpowiedź:
```json
{
  "intent": "blog",
  "confidence": 0.95,
  "blogDraft": {
    "language": "pl",
    "title": "Optymalizacja e-commerce dla małych firm",
    "slug": "optymalizacja-ecommerce-malych-firm",
    "tags": ["e-commerce", "optymalizacja", "małe-firmy"],
    "excerpt": "Jak zwiększyć sprzedaż w sklepie internetowym bez dużych inwestycji",
    "sections": ["Wprowadzenie", "Analiza obecnej sytuacji", "Kroki optymalizacji", "Wnioski"],
    "seo": {
      "title": "Optymalizacja e-commerce dla małych firm - ECM Digital",
      "description": "Sprawdź jak zwiększyć sprzedaż w Twoim sklepie internetowym o 30% bez dużych inwestycji",
      "ogImage": "/images/blog/optymalizacja-ecommerce-malych-firm-hero.jpg"
    },
    "publishMode": "draft"
  },
  "seoPack": {
    "title": "Optymalizacja e-commerce",
    "description": "Strategie zwiększania sprzedaży dla małych firm",
    "slug": "optymalizacja-ecommerce",
    "tags": ["e-commerce", "sprzedaż", "optymalizacja"]
  },
  "reply": "Przygotowałem szkic bloga o optymalizacji e-commerce dla małych firm. Wpis zawiera praktyczne wskazówki i jest gotowy do edycji."
}
```

#### Test 2: Tworzenie zadań w Linear
```
Utwórz zadania na kampanię marketingową Q1 2025
```

#### Oczekiwana odpowiedź:
```json
{
  "intent": "tasks",
  "confidence": 0.88,
  "linearTasks": [
    {
      "title": "Przygotuj strategię content marketing Q1",
      "description": "Zdefiniuj tematykę wpisów blogowych i harmonogram publikacji na pierwszy kwartał",
      "teamKey": "ECM",
      "labels": ["content", "strategia"],
      "priority": 2,
      "estimate": 8,
      "dueDate": "2025-01-10"
    },
    {
      "title": "Zaktualizuj stronę usług",
      "description": "Odśwież treści na stronie usług zgodnie z nową strategią",
      "teamKey": "ECM",
      "labels": ["strona-www", "content"],
      "priority": 1,
      "estimate": 12
    }
  ],
  "reply": "Utworzyłem 2 zadania w Linear dla kampanii marketingowej Q1. Zadania mają odpowiednie priorytety i szacowany czas."
}
```

---

## 6. Troubleshooting

### Problem: Agent nie rozpoznaje narzędzi
**Rozwiązanie:**
- Sprawdź czy wszystkie Action Groups mają prawidłowe ARN funkcji Lambda
- Upewnij się, że funkcje Lambda są aktywne
- Sprawdź uprawnienia IAM dla funkcji Lambda

### Problem: Knowledge Base nie indeksuje plików
**Rozwiązanie:**
- Sprawdź czy wszystkie pliki są w prawidłowych folderach w S3
- Uruchom ponownie synchronizację Knowledge Base
- Sprawdź uprawnienia dostępu do bucket S3

### Problem: Agent zwraca błędy formatu JSON
**Rozwiązanie:**
- Sprawdź czy System Prompt zawiera prawidłowe instrukcje formatowania
- Upewnij się, że schema JSON jest prawidłowo zdefiniowana
- Testuj z prostszymi zapytaniami

### Problem: Brak dostępu do Linear
**Rozwiązanie:**
- Skonfiguruj zmienną środowiskową `LINEAR_API_KEY`
- Sprawdź czy klucz API jest prawidłowy
- Upewnij się, że użytkownik ma dostęp do odpowiedniego zespołu

---

## 🎯 Następne kroki po skonfigurowaniu

1. **Skonfiguruj Step Functions** (jeśli uzyskałeś uprawnienia)
2. **Ustaw zmienne środowiskowe** dla funkcji Lambda
3. **Przetestuj pełny workflow** end-to-end
4. **Zintegruj z istniejącą stroną** ECM Digital

---

## 📞 Kontakt

Jeśli napotkasz problemy podczas konfiguracji, sprawdź:
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Linear API Documentation](https://developers.linear.app/)
- Logi funkcji Lambda w CloudWatch

**Powodzenia! Twój ECM Marketing Agent jest prawie gotowy!** 🚀
