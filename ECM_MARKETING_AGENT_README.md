# ECM Marketing Agent — Starter Pack

Komplet startowych plików do uruchomienia **Agenta Marketingu** na Amazon Bedrock + integracje.

## 📁 Struktura plików

```
schemas/
  actionplan.schema.json          # JSON Schema dla ActionPlan
templates/mdx/
  blog.mdx                       # Szablon MDX dla bloga
prompts/
  system_marketing_agent.txt     # System Prompt dla Bedrock Agent
  social_ab.txt                  # Generator A/B dla social media
```

## 🚀 Wdrożenie

### 1. S3 (Knowledge Base)

```
/ecm-digital-knowledge/
  brand/stylecard.json
  services/services.json
  seo/internal-links.json
  templates/mdx/blog.mdx
```

### 2. Environment Variables (Lambda/Step Functions)

```bash
AWS_REGION=eu-central-1
CMS_BUCKET=ecm-digital-cms
REVALIDATE_URL=https://www.ecm-digital.com/api/revalidate
REVALIDATE_SECRET=***
LINEAR_API_KEY=***
LINEAR_TEAM_KEY=ECM
```

### 3. Kolejność wdrożenia

1. **Wgraj pliki do S3** (stylecard, template)
2. **Utwórz Agenta w Bedrock** i wklej System Prompt
3. **Wdróż Lambdy**: `CreateLinear`, `SaveBlogDraft`, `NotifyUser`
4. **Zdefiniuj Step Functions** i test end-to-end

## 🔧 Walidacja JSON Schema

```js
import Ajv from "ajv";
import schema from "./schemas/actionplan.schema.json" assert { type: "json" };

const ajv = new Ajv({ allErrors: true });
export const validateActionPlan = ajv.compile(schema);
```

## 📋 Funkcje Agenta

- **blog**: Generowanie szkiców bloga + SEO pack
- **calendar**: Planowanie kalendarza contentu
- **campaign**: Strategie kampanii marketingowych
- **tasks**: Tworzenie tasków w Linear
- **mix**: Kombinacja powyższych

## 🎯 Przykład użycia

```
User: "Potrzebuję wpis blogowy o optymalizacji UX dla e-commerce"

Agent: [ActionPlan JSON z blogDraft, seoPack, linearTasks]
```

## 🔗 Integracje

- **Amazon Bedrock**: Agent AI
- **Linear**: Zarządzanie taskami
- **S3**: Knowledge Base + CMS
- **Step Functions**: Orchestracja workflow
- **ECM Website**: Revalidacja contentu

## 📚 Dokumentacja

- [Bedrock Agent Guide](https://docs.aws.amazon.com/bedrock/)
- [Linear API](https://developers.linear.app/)
- [JSON Schema](https://json-schema.org/)
- [MDX](https://mdxjs.com/)
