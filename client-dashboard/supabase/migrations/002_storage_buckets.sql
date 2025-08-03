-- Create storage buckets for file uploads

-- Create message attachments bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-attachments',
  'message-attachments',
  true,
  52428800, -- 50MB
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed'
  ]
);

-- Create project documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-documents',
  'project-documents', 
  true,
  104857600, -- 100MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif', 
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed'
  ]
);

-- Create user avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  5242880, -- 5MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
);

-- Storage policies for message attachments
CREATE POLICY "Users can upload message attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'message-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view message attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'message-attachments' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM messages m
        JOIN projects p ON m.project_id = p.id
        WHERE p.client_id = auth.uid()
        AND m.attachments::text LIKE '%' || name || '%'
      )
    )
  );

CREATE POLICY "Users can delete own message attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'message-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for project documents
CREATE POLICY "Users can upload project documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view project documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-documents' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM documents d
        JOIN projects p ON d.project_id = p.id
        WHERE p.client_id = auth.uid()
        AND d.file_path = name
      )
    )
  );

CREATE POLICY "Users can delete own project documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for user avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );