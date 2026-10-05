import { createContext, useContext, useEffect, useState, useRef, ReactNode, FormEvent } from 'react';
import { Session } from '@supabase/supabase-js';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
const AuthContext=createContext<{session:Session|null;loading:boolean}>({session:null,loading:true});
export function AuthProvider({children}:{children:ReactNode}) {
 const [session,setSession]=useState<Session|null>(null);const [loading,setLoading]=useState(true);const cache=useQueryClient();const currentUser=useRef<string|undefined>(undefined);
 useEffect(()=>{if(!supabase){setLoading(false);return;}let active=true;
  supabase.auth.getSession().then(({data})=>{if(active){setSession(data.session);setLoading(false);}});
  const {data}=supabase.auth.onAuthStateChange((_event,next)=>{if(currentUser.current!==next?.user.id){cache.clear();currentUser.current=next?.user.id;}setSession(next);setLoading(false);});
  return()=>{active=false;data.subscription.unsubscribe();};
 },[cache]);
 return <AuthContext.Provider value={{session,loading}}>{children}</AuthContext.Provider>;
}
export function Protected({children}:{children:ReactNode}) {
 const auth=useContext(AuthContext);
 if(!supabase)return <div className="auth panel"><h1>Connect your workspace</h1><p>Set the Supabase URL and publishable key in the web environment to enable sign-in.</p></div>;
 if(auth.loading)return <div className="auth skeleton" aria-label="Loading session"/>;
 return auth.session?<>{children}</>:<Navigate to="/login" replace/>;
}
export function AuthPage() {
 const {pathname}=useLocation();const mode=pathname.slice(1);const navigate=useNavigate();const auth=useContext(AuthContext);
 const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
 if(auth.session&&mode!=='update-password')return <Navigate to="/" replace/>;
 async function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();if(!supabase){setMessage('Authentication has not been configured.');return;}setBusy(true);setMessage('');
  const form=new FormData(event.currentTarget);const email=String(form.get('email'));const password=String(form.get('password'));
  try {
   if(mode==='register'){const {error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/login'}});if(error)throw error;setMessage('Check your email to confirm your account.');}
   else if(mode==='reset-password'){const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/update-password'});if(error)throw error;setMessage('If that account exists, a reset link is on its way.');}
   else if(mode==='update-password'){const {error}=await supabase.auth.updateUser({password});if(error)throw error;navigate('/');}
   else {const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;navigate('/');}
  }catch(error){setMessage((error as Error).message);}finally{setBusy(false);}
 }
 return <main className="auth panel"><Link className="brand" to="/">Talibon Workspace</Link><h1 style={{marginTop:24}}>{mode==='register'?'Make room for your best work':mode==='reset-password'?'Reset your password':mode==='update-password'?'Choose a new password':'Welcome back'}</h1><p>Your work, your dashboard, your way.</p><form onSubmit={submit}>
 {mode!=='update-password'&&<label>Email<input name="email" type="email" required autoComplete="email"/></label>}
 {mode!=='reset-password'&&<label>Password<input name="password" type="password" minLength={8} required autoComplete={mode==='login'?'current-password':'new-password'}/></label>}
 <button className="primary" disabled={busy}>{busy?'Please wait?':mode==='register'?'Create account':mode==='reset-password'?'Send reset link':mode==='update-password'?'Save password':'Sign in'}</button>{message&&<p role="status">{message}</p>}</form><nav><Link to="/login">Sign in</Link><Link to="/register">Register</Link><Link to="/reset-password">Forgot password?</Link></nav></main>;
}
