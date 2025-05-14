const inputBox = document.getElementById('input-box');
const taskList = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    tasks.forEach(task => renderTask(task));
});

function addTask() {
    const taskText = inputBox.value.trim();
    const reminderTime = document.getElementById('reminder-time').value;

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        reminder: reminderTime || null,
        notified: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    inputBox.value = "";
    document.getElementById('reminder-time').value = '';
}

function renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.addEventListener('click', () => toggleTask(task.id));

    if (task.reminder) {
        const reminderTag = document.createElement('small');
        reminderTag.textContent = `⏰ ${task.reminder}`;
        reminderTag.style.color = "#ff1493";
        reminderTag.style.marginLeft = "10px";
        span.appendChild(reminderTag);
    }

    const icons = document.createElement('span');
    icons.classList.add('icons');
    icons.innerHTML = `
        <i class="fas fa-edit" onclick="editTask(${task.id})"></i>
        <i class="fas fa-trash" onclick="deleteTask(${task.id})"></i>
    `;

    li.appendChild(span);
    li.appendChild(icons);
    taskList.appendChild(li);
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    refreshList();
}

function editTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const taskText = taskElement.querySelector('span');
    const currentText = taskText.childNodes[0].textContent;

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;
    taskElement.replaceChild(inputField, taskText);

    inputField.focus();

    inputField.addEventListener('blur', () => saveEdit(id, inputField.value));
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEdit(id, inputField.value);
        }
    });
}

function saveEdit(id, newText) {
    const task = tasks.find(task => task.id === id);
    if (newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        refreshList();
    } else {
        alert("Task text cannot be empty!");
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    refreshList();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function refreshList() {
    taskList.innerHTML = '';
    tasks.forEach(task => renderTask(task));
}

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

setInterval(() => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    tasks.forEach(task => {
        if (task.reminder === currentTime && !task.notified) {
            alert(`Reminder: ${task.text}`);
            task.notified = true;
            saveTasks();
        }
    });
}, 60000);
