-- Create clients table for agency management panel
-- This table will store client data from client dashboard registrations

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  contact_person TEXT NOT NULL,
  phone TEXT,
  address JSONB DEFAULT '{}',
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  source TEXT DEFAULT 'registration', -- 'registration', 'manual', 'import'
  supabase_user_id UUID, -- Link to client dashboard user
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_supabase_user_id ON public.clients(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_clients_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_clients_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Policy for agency staff to view all clients
CREATE POLICY "Agency staff can view all clients" ON public.clients
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for agency staff to insert clients
CREATE POLICY "Agency staff can insert clients" ON public.clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for agency staff to update clients
CREATE POLICY "Agency staff can update clients" ON public.clients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for agency staff to delete clients
CREATE POLICY "Agency staff can delete clients" ON public.clients
    FOR DELETE USING (auth.role() = 'authenticated');


