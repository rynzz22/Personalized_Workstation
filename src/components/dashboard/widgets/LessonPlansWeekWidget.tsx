import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { FileText, Calendar, ArrowUpRight } from 'lucide-react';

export const LessonPlansWeekWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { lessonPlans, setActiveView } = useWorkspace();
  const wsPlans = lessonPlans.filter(lp => lp.workspaceId === workspaceId);
  return <div>
    <div className="widget-summary"><span>{wsPlans.length} lesson plans · A little preparation, a better week</span><button className="text-action" onClick={() => setActiveView('lesson_plans')}>Lesson Planner <ArrowUpRight size={15} /></button></div>
    {wsPlans.length === 0 ? <div className="widget-empty"><FileText size={30} /><p>No lesson plans yet. Click Lesson Planner to create one.</p></div> : <div className="lesson-list">{wsPlans.map(plan => (
      <button key={plan.id} className="lesson-preview" onClick={() => setActiveView('lesson_plans')}>
        <div className="document-icon" aria-hidden="true"><FileText size={27} strokeWidth={1.4} /></div>
        <div className="lesson-details"><div className="lesson-eyebrow">{plan.templateType}</div><h4>{plan.title}</h4><p>{plan.classSubject}</p><span className="lesson-date"><Calendar size={13} />{plan.date}</span></div>
        <span className={`lesson-status ${plan.status === 'ready' ? 'is-ready' : ''}`}>{plan.status}</span>
        <ArrowUpRight className="row-arrow" size={18} />
      </button>
    ))}</div>}
  </div>;
};
