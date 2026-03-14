// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const tasksLeftSpan = document.getElementById('tasksLeft');
const filterBtns = document.querySelectorAll('.filter-btn');

// Tasks array
let tasks = [];

// Add task function
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
    saveToLocalStorage();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveToLocalStorage();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        saveToLocalStorage();
    }
}

// Render tasks
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Update counter
    const activeTasks = tasks.filter(task => !task.completed).length;
    tasksLeftSpan.textContent = activeTasks;

    // Create task elements
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;

        li.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;

        // Click on task to toggle
        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                deleteTask(task.id);
            } else {
                toggleTask(task.id);
            }
        });

        taskList.appendChild(li);
    });
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load from localStorage
function loadFromLocalStorage() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        tasks = JSON.parse(stored);
        renderTasks();
    }
}

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks(btn.dataset.filter);
    });
});

// Event listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize
loadFromLocalStorage();