import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { useUI } from '../stores/ui';
export function useResource<T=any>(path:string,enabled=true) {return useQuery<T>({queryKey:[path],queryFn:()=>api<T>(path),enabled});}
export function useWrite() {
 const cache=useQueryClient();const notify=useUI(s=>s.notify);
 return useMutation({mutationFn:({path,method='POST',body}:{path:string;method?:string;body?:unknown})=>api(path,method,body),onSuccess:()=>cache.invalidateQueries(),onError:(error:Error)=>notify(error.message)});
}
