import React from 'react';
import { Calendar, Edit, Trash, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onEditClick, onDeleteClick }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
      default:
        return 'priority-low';
    }
  };

  const isOverdue = () => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="task-card glass-panel">
      <div className="task-card-header">
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          title={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
        />
      </div>

      <h4 className={`task-title ${task.completed ? 'completed' : ''}`}>
        {task.title}
      </h4>

      <p className="task-desc">
        {task.description || <em style={{ color: 'var(--text-muted)' }}>No description provided.</em>}
      </p>

      <div className="task-card-footer">
        {task.dueDate ? (
          <div className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
            {isOverdue() ? <AlertCircle size={14} /> : <Calendar size={14} />}
            <span>{formatDate(task.dueDate)}</span>
            {isOverdue() && <span style={{ fontSize: '0.7rem', fontWeight: 700, marginLeft: '4px' }}>OVERDUE</span>}
          </div>
        ) : (
          <div className="due-date">
            <Calendar size={14} style={{ opacity: 0.3 }} />
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No due date</span>
          </div>
        )}

        <div className="task-actions">
          <button
            onClick={() => onEditClick(task)}
            className="task-action-btn"
            title="Edit Task"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => onDeleteClick(task._id)}
            className="task-action-btn delete-btn"
            title="Delete Task"
          >
            <Trash size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
