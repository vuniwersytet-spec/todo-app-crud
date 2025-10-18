const API_URL = 'http://127.0.0.1:5000';

const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

async function fetchAndDisplayTasks() {
    taskList.innerHTML = '';

    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = task.title;
        span.addEventListener('click', () => toggleTaskStatus(task.id, !task.completed));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = taskInput.value.trim();
    if (!title) {
        alert('Proszę wpisać treść zadania.');
        return;
    }

    await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title }),
    });

    taskInput.value = '';
    fetchAndDisplayTasks();
}

async function toggleTaskStatus(id, newStatus) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: newStatus }),
    });

    fetchAndDisplayTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
    });

    fetchAndDisplayTasks();
}

addButton.addEventListener('click', addTask);

document.addEventListener('DOMContentLoaded', fetchAndDisplayTasks);
