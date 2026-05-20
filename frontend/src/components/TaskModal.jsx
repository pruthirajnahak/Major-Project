import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      
      // Format due date to YYYY-MM-DD for date input
      if (task.dueDate) {
        const d = new Date(task.dueDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setDueDate(`${year}-${month}-${day}`);
      } else {
        setDueDate('');
      }
      setCompleted(task.completed || false);
    } else {
      // Clear for new task mode
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      setCompleted(false);
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    if (title.length > 100) {
      setError('Title cannot exceed 100 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const taskData = {
        title,
        description,
        priority,
        dueDate: dueDate || null,
        completed,
      };

      await onSave(taskData);
      onClose();
    } catch (err) {
      console.error('Save task error:', err);
      setError(err.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3 className="modal-title">
            {task ? 'Edit Workspace Task' : 'Create New Task'}
          </h3>
          <button onClick={onClose} className="modal-close" title="Close Modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ marginBottom: '16px', background: 'rgba(244,63,94,0.1)', padding: '10px 14px', borderRadius: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className={`form-input form-inputWithoutIcon ${error && !title.trim() ? 'form-input-error' : ''}`}
              placeholder="e.g. Design application layout mockup"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-inputWithoutIcon"
              style={{ minHeight: '100px', resize: 'vertical' }}
              placeholder="Add details about this workspace task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input form-inputWithoutIcon"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
                style={{ cursor: 'pointer' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <div className="input-container">
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={loading}
                  style={{ cursor: 'pointer' }}
                />
                <Calendar size={16} />
              </div>
            </div>
          </div>

          {/* Completion Status (Only show when editing task) */}
          {task && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <input
                type="checkbox"
                id="modal-completed"
                className="task-checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="modal-completed" className="form-label" style={{ margin: 0, textTransform: 'none', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Mark this task as completed
              </label>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '120px' }}
            >
              {loading ? <div className="loading-spinner"></div> : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
