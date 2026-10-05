import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
@Injectable()
export class SupabaseService {
  private readonly client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  async verifyToken(token: string): Promise<{ id: string; email?: string } | null> {
    const { data, error } = await this.client.auth.getUser(token);
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email };
  }
  async getSignedStorageUrl(bucket: string, path: string): Promise<string> {
    const { data, error } = await this.client.storage.from(bucket).createSignedUrl(path, 60);
    if (error) throw new ServiceUnavailableException('Storage unavailable');
    return data.signedUrl;
  }
}
