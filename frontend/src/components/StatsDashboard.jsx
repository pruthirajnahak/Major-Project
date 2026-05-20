import React from 'react';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const StatsDashboard = ({ tasks }) => {
  // Real-time calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  
  const overdueTasks = tasks.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  }).length;

  return (
    <div className="stats-grid">
      <div className="stat-card glass-panel stat-total">
        <div className="stat-info">
          <h3>Total Tasks</h3>
          <div className="stat-value">{totalTasks}</div>
        </div>
        <div className="stat-icon">
          <ClipboardList size={22} />
        </div>
      </div>

      <div className="stat-card glass-panel stat-completed">
        <div className="stat-info">
          <h3>Completed</h3>
          <div className="stat-value">{completedTasks}</div>
        </div>
        <div className="stat-icon">
          <CheckCircle2 size={22} />
        </div>
      </div>

      <div className="stat-card glass-panel stat-pending">
        <div className="stat-info">
          <h3>Pending</h3>
          <div className="stat-value">{pendingTasks}</div>
        </div>
        <div className="stat-icon">
          <Clock size={22} />
        </div>
      </div>

      <div className="stat-card glass-panel stat-overdue">
        <div className="stat-info">
          <h3>Overdue</h3>
          <div className="stat-value">{overdueTasks}</div>
        </div>
        <div className="stat-icon">
          <AlertTriangle size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
