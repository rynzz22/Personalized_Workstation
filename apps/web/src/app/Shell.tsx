import { useState, FormEvent, lazy, Suspense } from 'react';
import { Navigate, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useResource, useWrite } from '../lib/queries';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/ui/Modal';
import { QueryState } from '../components/ui/QueryState';
export function WorkspaceForm({close,onboarding=false}:{close:()=>void;onboarding?:boolean}) {
 const templates=useResource<any[]>('/templates');const write=useWrite();const navigate=useNavigate();const [selected,setSelected]=useState('personal');
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);const body={name:String(form.get('name')),template:selected,...(onboarding?{primaryRole:selected}:{})};
  const ws=await write.mutateAsync({path:onboarding?'/me/onboarding':'/workspaces',body});close();navigate('/w/'+ws.id+'/dashboard');
 }
 const template=templates.data?.find(t=>t.key===selected);
 return <form onSubmit={e=>void submit(e).catch(()=>{})} className="stack"><label>Workspace name<input name="name" placeholder="My workspace" required maxLength={120}/></label><label>Your role<select value={selected} onChange={e=>setSelected(e.target.value)}>{templates.data?.map(t=><option key={t.key} value={t.key}>{t.name}</option>)}</select></label><QueryState query={templates}/>{template&&<div className="panel"><h3>{template.name}</h3><p>{template.description}</p><p className="muted">Starting modules: {template.defaultModules.join(', ')}</p></div>}<button className="primary" disabled={write.isPending||!template}>Create workspace</button></form>;
}
export function Home() {
 const me=useResource<any>('/me');
 if(me.isPending||me.error)return <main className="auth"><QueryState query={me}/></main>;
 const first=me.data?.workspaces?.[0];if(first)return <Navigate to={'/w/'+first.id+'/dashboard'} replace/>;
 return <main className="auth panel"><h1>Your workspace starts here</h1><p>Choose a starting point. You can customize everything later.</p><WorkspaceForm close={()=>{}} onboarding/></main>;
}
export function Shell(){
 const {workspaceId}=useParams();const navigate=useNavigate();const [create,setCreate]=useState(false);const workspaces=useResource<any[]>('/workspaces');const current=workspaces.data?.find(w=>w.id===workspaceId);
 return <div className="shell"><aside className="sidebar"><NavLink className="brand" to="/">Talibon Workspace</NavLink><div className="stack"><label>Workspace<select aria-label="Switch workspace" value={workspaceId} onChange={e=>navigate('/w/'+e.target.value+'/dashboard')}>{workspaces.data?.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select></label><button className="secondary" onClick={()=>setCreate(true)}>+ New workspace</button></div><nav aria-label="Main navigation">{['dashboard','tasks','notes','calendar','goals','analytics','settings'].map(page=><NavLink key={page} to={'/w/'+workspaceId+'/'+page}>{page[0].toUpperCase()+page.slice(1)}</NavLink>)}</nav><button className="secondary" onClick={()=>void supabase?.auth.signOut()}>Sign out</button></aside><main className="main"><header className="topbar"><span>{current?.name || 'Workspace'}</span><span>A little more focused, every day.</span></header><QueryState query={workspaces}/>{current&&<Suspense fallback={<div className="skeleton"/>}><Outlet key={workspaceId}/></Suspense>}{!workspaces.isPending&&!workspaces.error&&!current&&<p role="alert">Workspace unavailable. <NavLink to="/">Choose another workspace</NavLink></p>}</main><Modal isOpen={create} onClose={()=>setCreate(false)} title="Create a workspace"><WorkspaceForm close={()=>setCreate(false)}/></Modal></div>;
}
export const Dashboard=lazy(()=>import('../features/Dashboard'));
export const Tasks=lazy(()=>import('../features/Tasks'));
export const Notes=lazy(()=>import('../features/Notes'));
export const Calendar=lazy(()=>import('../features/Calendar'));
export const Goals=lazy(()=>import('../features/Goals'));
export const Analytics=lazy(()=>import('../features/Analytics'));
export const Settings=lazy(()=>import('../features/Settings'));

