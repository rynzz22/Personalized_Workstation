import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { Clock, MapPin, Users, ArrowUpRight, GraduationCap } from 'lucide-react';

export const ClassesTodayWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { classes, setActiveView } = useWorkspace();
  const wsClasses = classes.filter(c => c.workspaceId === workspaceId);
  return <div className="schedule-widget">
    <div className="widget-summary">
      <span>{wsClasses.length} scheduled sections · Your classroom at a glance</span>
      <button className="text-action" onClick={() => setActiveView('classes')}>View Gradebook <ArrowUpRight size={15} /></button>
    </div>
    <div className="schedule-list">
      {wsClasses.length === 0 ? <div className="widget-empty"><GraduationCap size={30} /><p>No classes configured for this workspace.</p></div> : wsClasses.map((cls, index) => (
        <button key={cls.id} className="schedule-row" onClick={() => setActiveView('classes')}>
          <div className="schedule-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
          <div className="schedule-details">
            <span className="schedule-time"><Clock size={13} />{cls.schedule}</span>
            <h4>{cls.name}</h4>
            <p>{cls.subject}</p>
            <div className="schedule-meta"><span><MapPin size={13} />{cls.room}</span><span><Users size={13} />{cls.studentsCount} students</span></div>
          </div>
          <div className="schedule-grade"><strong>{cls.averageGrade}<small>%</small></strong><span>Class average</span></div>
          <ArrowUpRight className="row-arrow" size={18} />
        </button>
      ))}
    </div>
  </div>;
};
