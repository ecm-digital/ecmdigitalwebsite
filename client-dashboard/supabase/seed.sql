-- Insert sample data for testing (only run in development)
-- UWAGA: Te dane będą działać dopiero po zarejestrowaniu użytkownika w aplikacji
-- Użytkownik musi się zarejestrować, a następnie zaktualizować client_id w projektach

-- Funkcja pomocnicza do tworzenia przykładowych projektów dla użytkownika
CREATE OR REPLACE FUNCTION create_sample_projects_for_user(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Usuń istniejące przykładowe projekty dla tego użytkownika
  DELETE FROM projects WHERE client_id = user_id AND name LIKE '%[DEMO]%';
  
  -- Dodaj nowe przykładowe projekty
  INSERT INTO projects (name, description, type, status, client_id, budget_total, budget_used, start_date, end_date, metadata) VALUES
  (
    'Strona korporacyjna TechFlow [DEMO]',
    'Nowoczesna strona internetowa dla firmy technologicznej z systemem CMS',
    'website',
    'development',
    user_id,
    15000.00,
    8500.00,
    '2024-01-15',
    '2024-03-15',
    '{"features": ["responsive_design", "cms", "seo_optimization"], "tech_stack": ["Next.js", "Tailwind CSS", "Strapi"]}'
  ),
  (
    'Sklep e-commerce FashionHub [DEMO]',
    'Sklep internetowy na Shopify z customowym designem i integracjami',
    'shopify',
    'design',
    user_id,
    25000.00,
    5000.00,
    '2024-02-01',
    '2024-04-30',
    '{"features": ["custom_theme", "payment_integration", "inventory_management"], "integrations": ["PayU", "InPost", "Baselinker"]}'
  ),
  (
    'MVP aplikacji FinTech [DEMO]',
    'Prototyp aplikacji do zarządzania finansami osobistymi',
    'mvp',
    'testing',
    user_id,
    45000.00,
    42000.00,
    '2024-01-01',
    '2024-03-01',
    '{"features": ["user_auth", "expense_tracking", "budget_planning"], "tech_stack": ["React Native", "Node.js", "PostgreSQL"]}'
  ),
  (
    'Audyt UX platformy e-learning [DEMO]',
    'Kompleksowy audyt użyteczności platformy edukacyjnej',
    'ux-audit',
    'completed',
    user_id,
    12000.00,
    12000.00,
    '2023-11-01',
    '2023-12-15',
    '{"scope": ["heuristic_evaluation", "user_testing", "accessibility_audit"], "deliverables": ["audit_report", "recommendations", "wireframes"]}'
  ),
  (
    'Automatyzacja procesów HR [DEMO]',
    'Implementacja workflow automatyzacji w n8n dla działu HR',
    'automation',
    'discovery',
    user_id,
    8000.00,
    1200.00,
    '2024-02-15',
    '2024-04-15',
    '{"processes": ["recruitment", "onboarding", "performance_review"], "integrations": ["Slack", "Google Workspace", "BambooHR"]}'
  ),
  (
    'Kampania Social Media DataDriven [DEMO]',
    'Zaawansowana kampania social media z wykorzystaniem data science',
    'social-media',
    'development',
    user_id,
    18000.00,
    9000.00,
    '2024-02-01',
    '2024-05-01',
    '{"platforms": ["Facebook", "Instagram", "LinkedIn"], "features": ["predictive_analytics", "real_time_optimization", "automated_reporting"]}'
  );

  -- Dodaj przykładowe faktury dla projektów
  INSERT INTO invoices (project_id, invoice_number, amount, currency, status, due_date, line_items, payment_data)
  SELECT 
    p.id,
    'INV-2024-' || LPAD((ROW_NUMBER() OVER())::text, 3, '0'),
    CASE 
      WHEN p.name LIKE '%TechFlow%' THEN 5000.00
      WHEN p.name LIKE '%FashionHub%' THEN 7500.00
      WHEN p.name LIKE '%FinTech%' THEN 15000.00
      WHEN p.name LIKE '%e-learning%' THEN 12000.00
      WHEN p.name LIKE '%HR%' THEN 2000.00
      WHEN p.name LIKE '%Social Media%' THEN 6000.00
      ELSE 5000.00
    END,
    'PLN',
    CASE 
      WHEN p.status = 'completed' THEN 'paid'
      WHEN p.status IN ('development', 'testing') THEN 'sent'
      ELSE 'draft'
    END,
    CURRENT_DATE + INTERVAL '30 days',
    CASE 
      WHEN p.name LIKE '%TechFlow%' THEN '[{"description": "Projekt UX/UI - 50%", "quantity": 1, "unit_price": 5000.00, "total": 5000.00}]'
      WHEN p.name LIKE '%FashionHub%' THEN '[{"description": "Shopify Development - Phase 1", "quantity": 1, "unit_price": 7500.00, "total": 7500.00}]'
      WHEN p.name LIKE '%FinTech%' THEN '[{"description": "MVP Development - 50%", "quantity": 1, "unit_price": 15000.00, "total": 15000.00}]'
      WHEN p.name LIKE '%e-learning%' THEN '[{"description": "Audyt UX - pełny zakres", "quantity": 1, "unit_price": 12000.00, "total": 12000.00}]'
      WHEN p.name LIKE '%HR%' THEN '[{"description": "Automatyzacja - Discovery", "quantity": 1, "unit_price": 2000.00, "total": 2000.00}]'
      WHEN p.name LIKE '%Social Media%' THEN '[{"description": "Kampania Social Media - Setup", "quantity": 1, "unit_price": 6000.00, "total": 6000.00}]'
      ELSE '[{"description": "Usługi projektowe", "quantity": 1, "unit_price": 5000.00, "total": 5000.00}]'
    END,
    CASE 
      WHEN p.status = 'completed' THEN '{"payment_method": "bank_transfer", "paid_date": "2024-01-10", "transaction_id": "TXN-' || FLOOR(RANDOM() * 1000000) || '"}'
      ELSE '{}'
    END
  FROM projects p 
  WHERE p.client_id = user_id AND p.name LIKE '%[DEMO]%';

  -- Dodaj przykładowe wiadomości
  INSERT INTO messages (project_id, sender_id, content, created_at)
  SELECT 
    p.id,
    user_id,
    CASE (ROW_NUMBER() OVER()) % 4
      WHEN 1 THEN 'Witam! Dziękuję za rozpoczęcie współpracy. Mam kilka pytań dotyczących projektu.'
      WHEN 2 THEN 'Przesyłam aktualizację postępów. Projekt przebiega zgodnie z planem.'
      WHEN 3 THEN 'Czy możemy umówić się na krótkie spotkanie w tym tygodniu?'
      ELSE 'Świetna robota! Jestem bardzo zadowolony z dotychczasowych rezultatów.'
    END,
    NOW() - (RANDOM() * INTERVAL '30 days')
  FROM projects p 
  WHERE p.client_id = user_id AND p.name LIKE '%[DEMO]%';

  -- Dodaj przykładowe dokumenty
  INSERT INTO documents (project_id, name, file_path, file_size, mime_type, version, uploaded_by, tags, created_at)
  SELECT 
    p.id,
    CASE 
      WHEN p.name LIKE '%TechFlow%' THEN 
        CASE (ROW_NUMBER() OVER()) % 3
          WHEN 1 THEN 'Specyfikacja techniczna TechFlow.pdf'
          WHEN 2 THEN 'Mockupy interfejsu użytkownika.fig'
          ELSE 'Logo i brand guidelines.zip'
        END
      WHEN p.name LIKE '%FashionHub%' THEN
        CASE (ROW_NUMBER() OVER()) % 3
          WHEN 1 THEN 'Katalog produktów FashionHub.xlsx'
          WHEN 2 THEN 'Zdjęcia produktowe.zip'
          ELSE 'Specyfikacja sklepu Shopify.docx'
        END
      WHEN p.name LIKE '%FinTech%' THEN
        CASE (ROW_NUMBER() OVER()) % 3
          WHEN 1 THEN 'Architektura systemu MVP.pdf'
          WHEN 2 THEN 'User Stories i wymagania.docx'
          ELSE 'Wireframes aplikacji mobilnej.fig'
        END
      WHEN p.name LIKE '%e-learning%' THEN
        CASE (ROW_NUMBER() OVER()) % 3
          WHEN 1 THEN 'Raport z audytu UX.pdf'
          WHEN 2 THEN 'Rekomendacje ulepszeń.docx'
          ELSE 'Heatmapy i analiza użytkowników.png'
        END
      WHEN p.name LIKE '%HR%' THEN
        CASE (ROW_NUMBER() OVER()) % 3
          WHEN 1 THEN 'Schemat automatyzacji procesów.pdf'
          WHEN 2 THEN 'Konfiguracja n8n workflows.json'
          ELSE 'Instrukcja wdrożenia.docx'
        END
      ELSE
        CASE (ROW_NUMBER() OVER()) % 3
          WHEN 1 THEN 'Strategia kampanii social media.pdf'
          WHEN 2 THEN 'Analiza danych i insights.xlsx'
          ELSE 'Kreacje reklamowe.zip'
        END
    END,
    -- Fake file path (since we don't have actual files)
    user_id || '/' || EXTRACT(EPOCH FROM NOW())::text || '_demo_file',
    -- Random file size between 100KB and 10MB
    (RANDOM() * 10000000 + 100000)::bigint,
    CASE 
      WHEN (ROW_NUMBER() OVER()) % 6 = 1 THEN 'application/pdf'
      WHEN (ROW_NUMBER() OVER()) % 6 = 2 THEN 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      WHEN (ROW_NUMBER() OVER()) % 6 = 3 THEN 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      WHEN (ROW_NUMBER() OVER()) % 6 = 4 THEN 'application/zip'
      WHEN (ROW_NUMBER() OVER()) % 6 = 5 THEN 'image/png'
      ELSE 'application/json'
    END,
    1,
    user_id,
    CASE 
      WHEN p.name LIKE '%TechFlow%' THEN ARRAY['specyfikacja', 'frontend', 'design']
      WHEN p.name LIKE '%FashionHub%' THEN ARRAY['ecommerce', 'produkty', 'shopify']
      WHEN p.name LIKE '%FinTech%' THEN ARRAY['mvp', 'mobile', 'fintech']
      WHEN p.name LIKE '%e-learning%' THEN ARRAY['ux', 'audyt', 'analiza']
      WHEN p.name LIKE '%HR%' THEN ARRAY['automatyzacja', 'n8n', 'hr']
      ELSE ARRAY['social-media', 'marketing', 'analityka']
    END,
    NOW() - (RANDOM() * INTERVAL '60 days')
  FROM projects p 
  WHERE p.client_id = user_id AND p.name LIKE '%[DEMO]%'
  ORDER BY p.id, RANDOM()
  LIMIT 18; -- 3 documents per project (6 projects)

END;
$$ LANGUAGE plpgsql;

-- Funkcja do automatycznego tworzenia przykładowych danych dla nowych użytkowników
CREATE OR REPLACE FUNCTION handle_new_user_with_demo_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Najpierw utwórz profil (jak wcześniej)
  INSERT INTO public.profiles (id, contact_person, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Moja Firma')
  );
  
  -- Następnie dodaj przykładowe projekty (z małym opóźnieniem)
  PERFORM create_sample_projects_for_user(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Zaktualizuj trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_with_demo_data();

-- Instrukcje dla istniejących użytkowników:
-- Aby dodać przykładowe dane dla istniejącego użytkownika, wykonaj:
-- SELECT create_sample_projects_for_user('YOUR_USER_ID_HERE');