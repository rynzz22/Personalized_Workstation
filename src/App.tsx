import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { CustomizeDrawer } from './components/dashboard/CustomizeDrawer';
import { TasksView } from './components/views/TasksView';
import { NotesView } from './components/views/NotesView';
import { CalendarView } from './components/views/CalendarView';
import { GoalsView } from './components/views/GoalsView';
import { ClassesView } from './components/views/ClassesView';
import { LessonPlansView } from './components/views/LessonPlansView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { BusinessView } from './components/views/BusinessView';
import { FinanceView } from './components/views/FinanceView';
import { TrackersView } from './components/views/TrackersView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { CreateWorkspaceModal } from './components/modals/CreateWorkspaceModal';
import { OnboardingModal } from './components/modals/OnboardingModal';

const AppContent: React.FC = () => {
  const { activeView } = useWorkspace();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'notes':
        return <NotesView />;
      case 'calendar':
        return <CalendarView />;
      case 'goals':
        return <GoalsView />;
      case 'classes':
        return <ClassesView />;
      case 'lesson_plans':
        return <LessonPlansView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'sales_inventory':
        return <BusinessView />;
      case 'finance':
        return <FinanceView />;
      case 'trackers':
        return <TrackersView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="workspace-shell flex h-dvh w-full overflow-hidden font-sans text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-hidden flex flex-col">
          {renderActiveView()}
        </main>
      </div>

      <CustomizeDrawer />
      <CreateWorkspaceModal />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
