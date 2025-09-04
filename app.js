const { useState, useEffect, useContext, createContext, useCallback } = React;

// Theme Context
const ThemeContext = createContext();

// Sample data
const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Finalize the Q4 project proposal document and send to stakeholders",
    category: "Work",
    priority: "High",
    dueDate: "2025-01-10",
    completed: false,
    createdAt: "2025-01-01T10:00:00Z",
    order: 1
  },
  {
    id: 2,
    title: "Morning workout routine",
    description: "30 minutes cardio and strength training",
    category: "Health",
    priority: "Medium",
    dueDate: "2025-01-05",
    completed: true,
    createdAt: "2025-01-01T06:00:00Z",
    order: 2
  },
  {
    id: 3,
    title: "Review investment portfolio",
    description: "Check quarterly performance and rebalance if needed",
    category: "Finance",
    priority: "Medium",
    dueDate: "2025-01-15",
    completed: false,
    createdAt: "2025-01-02T09:00:00Z",
    order: 3
  },
  {
    id: 4,
    title: "Learn React hooks",
    description: "Complete the advanced React hooks course on online platform",
    category: "Learning",
    priority: "Low",
    dueDate: "2025-01-20",
    completed: false,
    createdAt: "2025-01-02T14:00:00Z",
    order: 4
  },
  {
    id: 5,
    title: "Plan weekend trip",
    description: "Research destinations and book accommodation for weekend getaway",
    category: "Personal",
    priority: "Low",
    dueDate: "2025-01-08",
    completed: false,
    createdAt: "2025-01-03T11:00:00Z",
    order: 5
  }
];

const initialCategories = [
  { id: 1, name: "Work", color: "#4F46E5", icon: "💼" },
  { id: 2, name: "Personal", color: "#10B981", icon: "🏠" },
  { id: 3, name: "Health", color: "#EF4444", icon: "💪" },
  { id: 4, name: "Finance", color: "#F59E0B", icon: "💰" },
  { id: 5, name: "Learning", color: "#8B5CF6", icon: "📚" }
];

// Theme Toggle Component
function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  
  const handleToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  }, [toggleTheme]);
  
  return (
    <button 
      className="theme-toggle" 
      onClick={handleToggle}
      title="Toggle theme"
      type="button"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

// Task Form Component
function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    dueDate: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        category: editingTask.category,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        dueDate: ''
      });
    }
  }, [editingTask]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;
    
    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now() + Math.random(),
      completed: editingTask ? editingTask.completed : false,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      order: editingTask ? editingTask.order : Date.now()
    };
    
    onSubmit(taskData);
    
    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        dueDate: ''
      });
    }
  }, [formData, editingTask, onSubmit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleCancel = useCallback((e) => {
    e.preventDefault();
    onCancel();
  }, [onCancel]);

  return (
    <div className="task-form">
      <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="3"
            autoComplete="off"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Learning">Learning</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          {editingTask && (
            <button 
              type="button" 
              className="btn btn--outline" 
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn--primary">
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Filter Bar Component
function FilterBar({ filters, onFilterChange, searchTerm, onSearchChange }) {
  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const createFilterHandler = useCallback((filterType, value) => {
    return (e) => {
      e.preventDefault();
      onFilterChange(filterType, value);
    };
  }, [onFilterChange]);

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <label className="filter-label">Search Tasks</label>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Status</label>
        <div className="filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
            onClick={createFilterHandler('status', 'all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.status === 'active' ? 'active' : ''}`}
            onClick={createFilterHandler('status', 'active')}
          >
            Active
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.status === 'completed' ? 'active' : ''}`}
            onClick={createFilterHandler('status', 'completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Priority</label>
        <div className="filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filters.priority === 'all' ? 'active' : ''}`}
            onClick={createFilterHandler('priority', 'all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.priority === 'High' ? 'active' : ''}`}
            onClick={createFilterHandler('priority', 'High')}
          >
            High
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.priority === 'Medium' ? 'active' : ''}`}
            onClick={createFilterHandler('priority', 'Medium')}
          >
            Medium
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.priority === 'Low' ? 'active' : ''}`}
            onClick={createFilterHandler('priority', 'Low')}
          >
            Low
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Category</label>
        <div className="filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filters.category === 'all' ? 'active' : ''}`}
            onClick={createFilterHandler('category', 'all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.category === 'Work' ? 'active' : ''}`}
            onClick={createFilterHandler('category', 'Work')}
          >
            Work
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.category === 'Personal' ? 'active' : ''}`}
            onClick={createFilterHandler('category', 'Personal')}
          >
            Personal
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.category === 'Health' ? 'active' : ''}`}
            onClick={createFilterHandler('category', 'Health')}
          >
            Health
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.category === 'Finance' ? 'active' : ''}`}
            onClick={createFilterHandler('category', 'Finance')}
          >
            Finance
          </button>
          <button
            type="button"
            className={`filter-btn ${filters.category === 'Learning' ? 'active' : ''}`}
            onClick={createFilterHandler('category', 'Learning')}
          >
            Learning
          </button>
        </div>
      </div>
    </div>
  );
}

// Task Item Component
function TaskItem({ task, onToggle, onEdit, onDelete, onDragStart, onDragEnd, onDragOver, onDrop }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    onDragStart(e, task);
  }, [onDragStart, task]);

  const handleDragEnd = useCallback((e) => {
    setIsDragging(false);
    onDragEnd(e);
  }, [onDragEnd]);

  const categoryIcon = initialCategories.find(cat => cat.name === task.category)?.icon || '📝';

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    onToggle(task.id);
  }, [onToggle, task.id]);

  const handleEdit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(task.id);
  }, [onDelete, task.id]);

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="task-header">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={handleToggle}
        />
        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`task-category ${task.category.toLowerCase()}`}>
              {categoryIcon} {task.category}
            </span>
            <span className={`task-priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                📅 Due: {formatDate(task.dueDate)}
                {isOverdue && ' (Overdue)'}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button
          type="button"
          className="task-action-btn"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          type="button"
          className="task-action-btn delete"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Task List Component
function TaskList({ tasks, onToggle, onEdit, onDelete, onReorder }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = useCallback((e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    if (!draggedTask) return;

    const dragIndex = tasks.findIndex(t => t.id === draggedTask.id);
    if (dragIndex === dropIndex) return;

    onReorder(dragIndex, dropIndex);
    setDragOverIndex(null);
  }, [draggedTask, tasks, onReorder]);

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Add a new task or adjust your filters to see tasks here.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          {dragOverIndex === index && (
            <div className="drag-placeholder visible"></div>
          )}
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

// Stats Panel Component
function StatsPanel({ tasks }) {
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const priorityStats = {
      high: tasks.filter(task => task.priority === 'High' && !task.completed).length,
      medium: tasks.filter(task => task.priority === 'Medium' && !task.completed).length,
      low: tasks.filter(task => task.priority === 'Low' && !task.completed).length
    };

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      overdueTasks,
      completionRate,
      priorityStats
    };
  }, [tasks]);

  return (
    <div className="stats-panel">
      <h3>📊 Task Statistics</h3>
      
      <div className="stat-item">
        <span className="stat-label">Total Tasks</span>
        <span className="stat-value">{stats.totalTasks}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">Active Tasks</span>
        <span className="stat-value">{stats.activeTasks}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">Completed</span>
        <span className="stat-value">{stats.completedTasks}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">Overdue</span>
        <span className="stat-value" style={{color: stats.overdueTasks > 0 ? 'var(--color-error)' : 'inherit'}}>
          {stats.overdueTasks}
        </span>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{width: `${stats.completionRate}%`}}
        ></div>
      </div>
      <div style={{fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)'}}>
        {Math.round(stats.completionRate)}% Complete
      </div>

      <h4 style={{marginTop: 'var(--space-16)', marginBottom: 'var(--space-8)', fontSize: 'var(--font-size-base)'}}>
        Priority Breakdown
      </h4>
      
      <div className="stat-item">
        <span className="stat-label">🔴 High Priority</span>
        <span className="stat-value">{stats.priorityStats.high}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">🟡 Medium Priority</span>
        <span className="stat-value">{stats.priorityStats.medium}</span>
      </div>
      
      <div className="stat-item">
        <span className="stat-label">🟢 Low Priority</span>
        <span className="stat-value">{stats.priorityStats.low}</span>
      </div>
    </div>
  );
}

// Category Manager Component
function CategoryManager({ categories }) {
  return (
    <div className="category-manager">
      <h3>📂 Categories</h3>
      <div className="category-list">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Confirmation Modal Component
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  const handleConfirm = useCallback((e) => {
    e.preventDefault();
    onConfirm();
  }, [onConfirm]);

  const handleClose = useCallback((e) => {
    e.preventDefault();
    onClose();
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button type="button" className="modal-close" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
          <div className="form-actions" style={{marginTop: 'var(--space-16)'}}>
            <button type="button" className="btn btn--outline" onClick={handleClose}>Cancel</button>
            <button type="button" className="btn btn--primary" onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [categories] = useState(initialCategories);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });

  // Theme management
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  // Task management functions
  const handleAddTask = useCallback((taskData) => {
    if (editingTask) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === editingTask.id ? taskData : task
      ));
      setEditingTask(null);
    } else {
      setTasks(prevTasks => [...prevTasks, taskData]);
    }
  }, [editingTask]);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  const handleToggleTask = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setDeleteModal({ isOpen: true, taskId });
  }, []);

  const confirmDelete = useCallback(() => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== deleteModal.taskId));
    setDeleteModal({ isOpen: false, taskId: null });
  }, [deleteModal.taskId]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, taskId: null });
  }, []);

  const handleReorderTasks = useCallback((dragIndex, dropIndex) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const [draggedTask] = newTasks.splice(dragIndex, 1);
      newTasks.splice(dropIndex, 0, draggedTask);
      
      // Update order values
      return newTasks.map((task, index) => ({
        ...task,
        order: index + 1
      }));
    });
  }, []);

  // Filter and search functions
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by status
    if (filters.status === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by order
    return filtered.sort((a, b) => a.order - b.order);
  }, [tasks, filters, searchTerm]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <div className="app-logo">
              <span className="app-logo-icon">✅</span>
              TaskFlow
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <TaskForm 
              onSubmit={handleAddTask}
              editingTask={editingTask}
              onCancel={handleCancelEdit}
            />
            
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <div className="main-grid">
              <TaskList
                tasks={filteredTasks}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onReorder={handleReorderTasks}
              />

              <div className="sidebar">
                <StatsPanel tasks={tasks} />
                <CategoryManager categories={categories} />
              </div>
            </div>
          </div>
        </main>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
        />
      </div>
    </ThemeContext.Provider>
  );
}

// Add missing React hooks
const { useMemo } = React;

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));