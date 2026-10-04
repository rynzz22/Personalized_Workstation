import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { StudentRecord, TrendStatus } from '../../types/workspace';
import {
  GraduationCap,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  Search,
  Plus,
  CheckCircle,
  FileEdit,
  UserCheck
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, students, activeWorkspace, updateStudentNotes, updateStudentTrend } = useWorkspace();
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const wsClasses = classes.filter(c => c.workspaceId === activeWorkspace.id);
  const wsStudents = students.filter(s => s.workspaceId === activeWorkspace.id);

  const filteredStudents = wsStudents.filter(st => {
    if (selectedClassId !== 'all' && st.classId !== selectedClassId) return false;
    if (
      searchStudent &&
      !st.name.toLowerCase().includes(searchStudent.toLowerCase()) &&
      !st.gradeLevel.toLowerCase().includes(searchStudent.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getTrendBadge = (trend: TrendStatus) => {
    switch (trend) {
      case 'improving':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            Improving
          </span>
        );
      case 'consistent':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Consistent
          </span>
        );
      case 'needs_attention':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Needs Attention
          </span>
        );
      case 'declining':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <TrendingDown className="w-3 h-3 text-rose-600" />
            Significant Decline
          </span>
        );
    }
  };

  const handleSaveNote = (studentId: string) => {
    updateStudentNotes(studentId, noteText);
    setEditingStudentId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Classes & Gradebook</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section schedules, student performance trends, and intervention tracking.
          </p>
        </div>
      </div>

      {/* Class Sections Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {wsClasses.map(cls => (
          <div
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id === selectedClassId ? 'all' : cls.id)}
            className={`p-4 rounded-xl border bg-white cursor-pointer transition-all ${
              selectedClassId === cls.id
                ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{cls.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{cls.subject}</p>
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                {cls.averageGrade}%
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{cls.schedule}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{cls.room}</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5" />
                  <span>{cls.studentsCount} students</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Filter Section:</span>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
          >
            <option value="all">All Sections ({wsStudents.length} Students)</option>
            {wsClasses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.subject})
              </option>
            ))}
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchStudent}
            onChange={e => setSearchStudent(e.target.value)}
            placeholder="Search student by name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Student Cards & Gradebook Table */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No students found for this filter.
          </div>
        ) : (
          filteredStudents.map(st => {
            const isEditing = editingStudentId === st.id;
            return (
              <div
                key={st.id}
                className={`p-4 rounded-xl border bg-white transition-all shadow-xs ${
                  st.needsAttention ? 'border-amber-200/90 bg-amber-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{st.gradeLevel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {getTrendBadge(st.trend)}

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block text-[10px]">Average</span>
                      <span className="text-sm font-black text-slate-900">{st.averageGrade}%</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block text-[10px]">Attendance</span>
                      <span className="text-xs font-bold text-slate-800">{st.attendanceRate}%</span>
                    </div>

                    <button
                      onClick={() =>
                        updateStudentTrend(
                          st.id,
                          st.needsAttention ? 'consistent' : 'needs_attention',
                          !st.needsAttention
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        st.needsAttention
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.needsAttention ? 'Flagged At-Risk' : 'Mark for Review'}
                    </button>
                  </div>
                </div>

                {/* Notes & Observation */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-semibold text-slate-700">Teacher Observation / Plan:</span>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingStudentId(st.id);
                          setNoteText(st.notes);
                        }}
                        className="text-blue-600 hover:underline text-[11px] font-medium flex items-center gap-1"
                      >
                        <FileEdit className="w-3 h-3" />
                        Edit Note
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-1">
                      <textarea
                        rows={2}
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingStudentId(null)}
                          className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(st.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      {st.notes || 'No teacher observations recorded yet.'}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
