import { StrictMode } from 'react';import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthPage, Protected } from './app/Auth';
import { Home, Shell, Dashboard, Tasks, Notes, Calendar, Goals, Analytics, Settings } from './app/Shell';
import { Toast } from './components/ui/Toast';import { ErrorBoundary } from './components/ui/Feedback';
import './styles/tokens.css';import 'react-grid-layout/css/styles.css';import 'react-resizable/css/styles.css';
const client=new QueryClient({defaultOptions:{queries:{retry:1,staleTime:30000}}});
createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><QueryClientProvider client={client}><BrowserRouter><AuthProvider><Routes>
{['login','register','reset-password','update-password'].map(path=><Route key={path} path={'/'+path} element={<AuthPage/>}/>)}
<Route path="/" element={<Protected><Home/></Protected>}/><Route path="/w/:workspaceId" element={<Protected><Shell/></Protected>}>
<Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<Dashboard/>}/><Route path="tasks" element={<Tasks/>}/><Route path="notes" element={<Notes/>}/><Route path="calendar" element={<Calendar/>}/><Route path="goals" element={<Goals/>}/><Route path="analytics" element={<Analytics/>}/><Route path="settings" element={<Settings/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes><Toast/></AuthProvider></BrowserRouter></QueryClientProvider></ErrorBoundary></StrictMode>);
