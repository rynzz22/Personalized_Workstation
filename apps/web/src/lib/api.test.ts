import { describe,it,expect,vi,beforeEach } from 'vitest';
vi.mock('./supabase',()=>({supabase:{auth:{getSession:vi.fn()}}}));
import { supabase } from './supabase';import { api } from './api';
describe('authenticated API client',()=>{
 beforeEach(()=>vi.restoreAllMocks());
 it('does not send a request without a session',async()=>{vi.mocked(supabase!.auth.getSession).mockResolvedValue({data:{session:null},error:null});const fetch=vi.spyOn(globalThis,'fetch');await expect(api('/me')).rejects.toThrow('sign in');expect(fetch).not.toHaveBeenCalled();});
 it('surfaces structured API validation errors',async()=>{vi.mocked(supabase!.auth.getSession).mockResolvedValue({data:{session:{access_token:'valid'} as any},error:null});vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(JSON.stringify({error:{message:['Invalid title']}}),{status:400}));await expect(api('/tasks','POST',{title:''})).rejects.toThrow('Invalid title');});
});
