-- Run against each approved Supabase project after Prisma migrations.
-- Documents can only be accessed through server-issued signed URLs.
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('documents','documents',false,20971520,ARRAY['application/pdf','image/png','image/jpeg','text/plain']),
       ('avatars','avatars',true,2097152,ARRAY['image/png','image/jpeg','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

DROP POLICY IF EXISTS avatar_owner_select ON storage.objects;
CREATE POLICY avatar_owner_select ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='avatars' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
DROP POLICY IF EXISTS avatar_owner_insert ON storage.objects;
CREATE POLICY avatar_owner_insert ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='avatars' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
DROP POLICY IF EXISTS avatar_owner_update ON storage.objects;
CREATE POLICY avatar_owner_update ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id='avatars' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text)
WITH CHECK (bucket_id='avatars' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
DROP POLICY IF EXISTS avatar_owner_delete ON storage.objects;
CREATE POLICY avatar_owner_delete ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='avatars' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
