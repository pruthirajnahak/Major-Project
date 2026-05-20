import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatsDashboard from '../components/StatsDashboard';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Toast from '../components/Toast';
import { ListTodo, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const { apiRequest, user } = useContext(AuthContext);
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Debounced/delayed trigger for search input to prevent excess API queries
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch tasks action
  const fetchTasks = useCallback(async () => {
    try {
      // Build query string
      const params = new URLSearchParams();
      if (debouncedSearch.trim()) params.append('search', debouncedSearch);
      if (status !== 'All') params.append('status', status);
      if (priority !== 'All') params.append('priority', priority);
      params.append('sortBy', sortBy);

      const data = await apiRequest(`/tasks?${params.toString()}`);
      setTasks(data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
      showToast(err.message || 'Failed to retrieve tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, priority, sortBy, apiRequest]);

  // Trigger load when filters or debounced search changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Toggle single task completion status
  const handleToggleComplete = async (task) => {
    try {
      const updated = await apiRequest(`/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });

      // Update state locally
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      showToast(
        updated.completed ? 'Task marked as completed!' : 'Task set to pending.',
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to update task completion.', 'error');
    }
  };

  // Delete a single task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'DELETE',
      });

      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast('Task deleted successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to delete task.', 'error');
    }
  };

  // Clear all completed tasks
  const handleClearCompleted = async () => {
    if (
      !window.confirm(
        'Are you sure you want to permanently clear all completed tasks?'
      )
    )
      return;

    try {
      const res = await apiRequest('/tasks/completed/clear', {
        method: 'DELETE',
      });

      setTasks((prev) => prev.filter((t) => !t.completed));
      showToast(res.message || 'Cleared all completed tasks.', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to clear completed tasks.', 'error');
    }
  };

  // Create or Update task in Modal
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Edit mode
        const updated = await apiRequest(`/tasks/${editingTask._id}`, {
          method: 'PUT',
          body: JSON.stringify(taskData),
        });

        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? updated : t)));
        showToast('Task updated successfully.', 'success');
      } else {
        // Create mode
        const created = await apiRequest('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData),
        });

        // Prepend to top
        setTasks((prev) => [created, ...prev]);
        showToast('New task created successfully!', 'success');
      }
    } catch (err) {
      throw err; // Propagates to modal for handling display
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Check if any completed tasks exist to show "Clear Completed" button
  const hasCompletedTasks = tasks.some((t) => t.completed);

  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        {/* Statistics section */}
        <StatsDashboard tasks={tasks} />

        {/* Search, filters, actions controlbar */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onNewTaskClick={handleOpenCreateModal}
          onClearCompleted={handleClearCompleted}
          hasCompletedTasks={hasCompletedTasks}
        />

        {/* Task Cards Grid */}
        {loading ? (
          <div className="tasks-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-card"></div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEditClick={handleOpenEditModal}
                onDeleteClick={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel">
            <ListTodo size={54} strokeWidth={1.5} />
            <h3>No tasks match your workspace filters</h3>
            <p>
              Try clearing your search query, adjusting your category filters, or click the
              "New Task" button to add a productive milestone.
            </p>
            <button onClick={handleOpenCreateModal} className="btn btn-primary" style={{ marginTop: '8px' }}>
              Create Your First Task
            </button>
          </div>
        )}
      </main>

      {/* Task Modal Overlay */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
      />

      {/* Toast Alert */}
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;
