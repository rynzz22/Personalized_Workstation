import React from 'react';
import { useWorkspace } from '../../../context/WorkspaceContext';
import { AlertCircle, ArrowUpRight, UserCheck } from 'lucide-react';

export const StudentsAttentionWidget: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { students, setActiveView } = useWorkspace();
  const flagged = students.filter(s => s.workspaceId === workspaceId && s.needsAttention);
  return <div>
    <div className="widget-summary"><span className="attention-label"><AlertCircle size={14} />{flagged.length} students flagged for a check-in</span><button className="text-action" onClick={() => setActiveView('classes')}>View roster <ArrowUpRight size={15} /></button></div>
    {flagged.length === 0 ? <div className="widget-empty"><UserCheck size={30} /><h4>All Students on Track</h4><p>No active student alerts or severe score declines.</p></div> : <div className="student-list">{flagged.map(st => (
      <button key={st.id} onClick={() => setActiveView('classes')} className="student-row">
        <span className="student-avatar" aria-hidden="true">{st.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span>
        <div className="student-details"><h4>{st.name}</h4><span>{st.gradeLevel}</span><p>{st.notes}</p></div>
        <div className="student-grade"><strong>{st.averageGrade}%</strong><span>Current average</span></div>
        <ArrowUpRight className="row-arrow" size={18} />
      </button>
    ))}</div>}
  </div>;
};
