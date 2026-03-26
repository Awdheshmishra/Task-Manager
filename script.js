const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const tasksLeftSpan = document.getElementById('tasksLeft');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

// ADD TASK
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

    const newTask = {
        id: Date.now(),
        text,
        completed: false,
        date: dateStr
    };

    tasks.push(newTask);
    taskInput.value = '';
    save();
    renderTasks();
}

// DELETE
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    renderTasks();
}

// TOGGLE
function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    t.completed = !t.completed;
    save();
    renderTasks();
}

// RENDER
function renderTasks(filter = currentFilter) {
    currentFilter = filter;
    taskList.innerHTML = '';

    let filtered = tasks;

    if (filter === 'active') filtered = tasks.filter(t => !t.completed);
    if (filter === 'completed') filtered = tasks.filter(t => t.completed);

    tasksLeftSpan.textContent = tasks.filter(t => !t.completed).length;

    if (filtered.length === 0) {
        taskList.innerHTML = `<p style="color:#aaa;text-align:center">No tasks 😴</p>`;
    }

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item ' + (task.completed ? 'completed' : '');

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
            </div>
            <button class="delete-btn">X</button>
        `;

        li.querySelector('input').addEventListener('change', () => toggleTask(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });

    generateCalendar();
}

// SAVE
function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// LOAD
function load() {
    const data = localStorage.getItem('tasks');
    if (data) tasks = JSON.parse(data);
    renderTasks();
}

// CALENDAR
function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const days = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= days; i++) {
        const div = document.createElement('div');
        div.classList.add('day');
        div.textContent = i;

        const dateStr = `${year}-${month+1}-${i}`;
        const dayTasks = tasks.filter(t => t.date === dateStr);

        if (dayTasks.length > 0) {
            const done = dayTasks.every(t => t.completed);
            div.classList.add(done ? 'completed' : 'pending');
        }

        grid.appendChild(div);
    }
}

// FILTER
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks(btn.dataset.filter);
    });
});

// EVENTS
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());

// INIT
load();