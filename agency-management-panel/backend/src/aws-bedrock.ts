// Minimal stubs for AWS Bedrock-related helpers

export async function testBedrockConnection(): Promise<boolean> {
  return true;
}

export async function generateAIResponse(
  question: string,
  language: string,
  context?: unknown
): Promise<{ answer: string; language: string; sources?: any[] }> {
  return {
    answer: `Stubbed AI response for: ${question}`,
    language,
    sources: [],
  };
}

export async function searchFAQ(
  query: string,
  language: 'pl' | 'en',
  category?: string
): Promise<Array<{ id: string; question: string; answer: string; category?: string }>> {
  const all = await getFAQFromS3(language);
  return all.filter((f) =>
    f.question.toLowerCase().includes(query.toLowerCase()) ||
    f.answer.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getFAQFromS3(
  language: 'pl' | 'en'
): Promise<Array<{ id: string; question: string; answer: string; category?: string }>> {
  return [
    {
      id: 'faq-1',
      question: language === 'pl' ? 'Jak długo trwa projekt?' : 'How long does a project take?',
      answer:
        language === 'pl'
          ? 'Zwykle od 2 do 12 tygodni, zależnie od zakresu.'
          : 'Typically 2–12 weeks, depending on scope.',
      category: 'general',
    },
  ];
}

export async function getServicesFromS3(
  language: 'pl' | 'en'
): Promise<Array<{ id: string; name: string; description: string; category?: string }>> {
  return [
    {
      id: 'srv-1',
      name: language === 'pl' ? 'Strony WWW' : 'Websites',
      description:
        language === 'pl'
          ? 'Projektowanie i wdrożenia nowoczesnych stron internetowych.'
          : 'Design and delivery of modern websites.',
      category: 'web',
    },
  ];
}

export async function uploadServicesToS3(
  services: any[],
  language: 'pl' | 'en'
): Promise<boolean> {
  // Accept and pretend success in local stub
  return true;
}


