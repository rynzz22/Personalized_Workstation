import { supabase } from './supabase';
export async function api<T=any>(path:string,method='GET',body?:unknown):Promise<T>{
 const session=await supabase?.auth.getSession();
 const token=session?.data.session?.access_token;
 if(!token) throw new Error('Please sign in to continue.');
 const response=await fetch((import.meta.env.VITE_API_URL || '/api/v1')+path,{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 const payload=await response.json();
 if(!response.ok) throw new Error(Array.isArray(payload.error?.message)?payload.error.message.join(', '):payload.error?.message || 'Request failed');
 return payload.data;
}
