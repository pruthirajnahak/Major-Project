const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validationMiddleware');

const router = express.Router();

// Helper to sort tasks in memory if needed (specifically for priority sorting)
const sortTasksByPriority = (tasks, order = 'desc') => {
  const priorityWeight = { High: 3, Medium: 2, Low: 1 };
  return tasks.sort((a, b) => {
    const weightA = priorityWeight[a.priority] || 0;
    const weightB = priorityWeight[b.priority] || 0;
    return order === 'desc' ? weightB - weightA : weightA - weightB;
  });
};

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, validateTask, async (req, res) => {
  const { title, description, priority, dueDate, completed } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      completed: completed || false,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// @route   GET /api/tasks/completed/clear
// @desc    Clear all completed tasks of current user
// @access  Private
// NOTE: MUST place before GET /api/tasks/:id to avoid routing conflicts
router.delete('/completed/clear', protect, async (req, res) => {
  try {
    const result = await Task.deleteMany({
      user: req.user._id,
      completed: true,
    });
    res.json({ message: `Successfully deleted ${result.deletedCount} completed tasks` });
  } catch (error) {
    console.error('Clear completed tasks error:', error);
    res.status(500).json({ message: 'Server error clearing completed tasks' });
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks of logged-in user with filters & sorting
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, status, priority, sortBy } = req.query;
    
    // Build query object
    const query = { user: req.user._id };

    // Search filter (title or description match)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status === 'Completed') {
      query.completed = true;
    } else if (status === 'Pending') {
      query.completed = false;
    }

    // Priority filter
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Determine Mongo database sorting
    let sortOption = { createdAt: -1 }; // Default newest
    let customPrioritySort = false;

    if (sortBy === 'Oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'DueDate') {
      // Sort tasks by due date (tasks with no due date will be pushed to the end)
      sortOption = { dueDate: 1, createdAt: -1 };
    } else if (sortBy === 'Priority') {
      customPrioritySort = true;
    }

    let tasks = await Task.find(query).sort(sortOption);

    // Apply custom memory-based sort for complex priority weights if requested
    if (customPrioritySort) {
      tasks = sortTasksByPriority(tasks, 'desc');
    }

    res.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Server error retrieving tasks' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Fetch task details error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server error retrieving task details' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, validateTask, async (req, res) => {
  const { title, description, priority, dueDate, completed } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Perform updates
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.completed = completed !== undefined ? completed : task.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;
