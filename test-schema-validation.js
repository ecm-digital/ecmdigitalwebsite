import Ajv from "ajv";
import fs from "fs";
import path from "path";

// Load the schema
const schemaPath = path.join(process.cwd(), "schemas", "actionplan.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

// Initialize AJV
const ajv = new Ajv({ allErrors: true });
const validateActionPlan = ajv.compile(schema);

// Test cases
const testCases = [
  {
    name: "Valid blog intent",
    data: {
      intent: "blog",
      confidence: 0.95,
      blogDraft: {
        language: "pl",
        title: "Jak zwiększyć konwersję w e-commerce",
        slug: "jak-zwiekszyc-konwersje-ecommerce",
        tags: ["e-commerce", "konwersja", "ux"],
        excerpt: "Praktyczne wskazówki zwiększenia sprzedaży online",
        sections: ["Wprowadzenie", "Analiza UX", "A/B testing", "Wnioski"],
        seo: {
          title: "Jak zwiększyć konwersję w e-commerce - ECM Digital",
          description: "Sprawdź 10 sprawdzonych sposobów na zwiększenie konwersji w Twoim sklepie internetowym",
          ogImage: "/images/blog/jak-zwiekszyc-konwersje-ecommerce-hero.jpg"
        },
        publishMode: "draft"
      },
      seoPack: {
        title: "Konwersja e-commerce",
        description: "Optymalizacja UX dla lepszej sprzedaży",
        slug: "konwersja-ecommerce",
        tags: ["e-commerce", "ux", "konwersja"]
      },
      reply: "Przygotowałem szkic bloga o optymalizacji konwersji w e-commerce. Wpis zawiera praktyczne wskazówki i jest gotowy do edycji."
    }
  },
  
  {
    name: "Valid tasks intent",
    data: {
      intent: "tasks",
      confidence: 0.88,
      linearTasks: [
        {
          title: "Przygotuj brief dla klienta",
          description: "Stwórz szczegółowy brief na podstawie rozmowy z klientem",
          teamKey: "ECM",
          labels: ["brief", "klient"],
          priority: 2,
          estimate: 4,
          dueDate: "2024-01-15"
        }
      ],
      reply: "Utworzyłem zadanie w Linear dla przygotowania briefu. Zadanie ma priorytet średni i szacowany czas 4h."
    }
  },
  
  {
    name: "Valid mix intent",
    data: {
      intent: "mix",
      confidence: 0.92,
      blogDraft: {
        language: "pl",
        title: "Automatyzacja marketingu z n8n",
        slug: "automatyzacja-marketingu-n8n",
        tags: ["automatyzacja", "n8n", "marketing"],
        excerpt: "Jak zautomatyzować procesy marketingowe i oszczędzić czas",
        sections: ["Wprowadzenie", "Narzędzia", "Przykłady", "Implementacja"],
        seo: {
          title: "Automatyzacja marketingu z n8n - ECM Digital",
          description: "Poznaj jak zautomatyzować marketing i oszczędzić 10h tygodniowo dzięki n8n",
          ogImage: "/images/blog/automatyzacja-marketingu-n8n-hero.jpg"
        },
        publishMode: "draft"
      },
      linearTasks: [
        {
          title: "Implementacja workflow n8n",
          description: "Wdrożenie automatyzacji dla klienta",
          teamKey: "ECM",
          labels: ["n8n", "automatyzacja"],
          priority: 1,
          estimate: 8
        }
      ],
      reply: "Przygotowałem kompleksowy plan: szkic bloga o automatyzacji z n8n oraz zadanie implementacyjne w Linear."
    }
  },
  
  {
    name: "Invalid - missing required fields",
    data: {
      intent: "blog",
      confidence: 0.8
      // Missing 'reply' field
    },
    shouldFail: true
  },
  
  {
    name: "Invalid - wrong intent value",
    data: {
      intent: "invalid_intent",
      confidence: 0.9,
      reply: "Test message"
    },
    shouldFail: true
  }
];

// Run tests
console.log("🧪 Testing ActionPlan JSON Schema validation...\n");

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  
  try {
    const isValid = validateActionPlan(testCase.data);
    
    if (testCase.shouldFail) {
      if (!isValid) {
        console.log("✅ PASSED - Correctly rejected invalid data");
        passedTests++;
      } else {
        console.log("❌ FAILED - Should have rejected invalid data");
        console.log("   Data:", JSON.stringify(testCase.data, null, 2));
      }
    } else {
      if (isValid) {
        console.log("✅ PASSED - Correctly validated data");
        passedTests++;
      } else {
        console.log("❌ FAILED - Should have validated data");
        console.log("   Errors:", validateActionPlan.errors);
      }
    }
  } catch (error) {
    console.log("❌ ERROR - Test failed with exception:", error.message);
  }
  
  console.log("");
});

// Summary
console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed! Schema validation is working correctly.");
} else {
  console.log("⚠️  Some tests failed. Please check the schema definition.");
  process.exit(1);
}
