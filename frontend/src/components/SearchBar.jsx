import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

const SearchBar = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  onNewTaskClick,
  onClearCompleted,
  hasCompletedTasks,
}) => {
  return (
    <div className="control-panel glass-panel">
      <div className="search-wrapper">
        <Search size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filters-wrapper">
        {/* Status Filter */}
        <select
          className="select-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          title="Filter by completion status"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending Only</option>
          <option value="Completed">Completed Only</option>
        </select>

        {/* Priority Filter */}
        <select
          className="select-filter"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          title="Filter by priority level"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        {/* Sort Controls */}
        <select
          className="select-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Sort by criteria"
        >
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
          <option value="Priority">Priority (High → Low)</option>
          <option value="DueDate">Due Date (Soonest First)</option>
        </select>

        {/* Action Buttons */}
        {hasCompletedTasks && (
          <button
            onClick={onClearCompleted}
            className="btn btn-outline-danger"
            style={{ padding: '10px 16px', fontSize: '0.85rem' }}
            title="Clear all completed tasks"
          >
            <Trash2 size={16} />
            <span>Clear Completed</span>
          </button>
        )}

        <button
          onClick={onNewTaskClick}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
