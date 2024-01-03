document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function addTask() {
    var titleInput = document.getElementById('titleInput');
    var descriptionInput = document.getElementById('descriptionInput');
    var dueDateInput = document.getElementById('dueDate');

    var title = titleInput.value.trim();
    var description = descriptionInput.value.trim();
    var dueDate = dueDateInput.value;

    var currentDate = new Date();
    var selectedDueDate = new Date(dueDate);

    if (title !== '' && description !== '' && selectedDueDate >= currentDate) {
        var task = {
            title: title,
            description: description,
            dueDate: dueDate,
            completed: false,
            timestamp: new Date().toLocaleString()
        };

        var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        loadTasks();
        titleInput.value = '';
        descriptionInput.value = '';
        dueDateInput.value = '';
    } else {
        alert('Please enter valid task details, and make sure the due date is not earlier than the current date.');
    }
}

function loadTasks() {
    var completedTasksList = document.getElementById('completedTasksList');
    var pendingTasksList = document.getElementById('pendingTasksList');
    var tasksList = document.getElementById('tasksList');

    completedTasksList.innerHTML = '';
    pendingTasksList.innerHTML = '';
    tasksList.innerHTML = '';

    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(function (task, index) {
        var li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        var timeRemaining = getTimeRemaining(task.dueDate);

        li.innerHTML = `
            <span>${task.title} - ${task.description}</span>
            <div>Due Date: ${formatDate(task.dueDate)}</div>
            <div>Time Remaining: ${timeRemaining}</div>
            <div>Added on: ${formatDate(task.timestamp)}</div>
            ${!task.completed ? `<button class="edit" onclick="editTask(${index})">Edit</button>` : ''}
            ${!task.completed ? `<button onclick="toggleCompletion(${index})">Complete</button>` : ''}
            <button onclick="deleteTask(${index})">Delete</button>
        `;

        tasksList.appendChild(li);

        if (task.completed) {
            completedTasksList.appendChild(li.cloneNode(true));
        } else {
            pendingTasksList.appendChild(li.cloneNode(true));
        }
    });
}

function toggleCompletion(index) {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function editTask(index) {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    var newTitle = prompt('Edit Task Title:', tasks[index].title);
    var newDescription = prompt('Edit Task Description:', tasks[index].description);
    var newDueDate = prompt('Edit Due Date:', tasks[index].dueDate);

    if (newTitle !== null && newDescription !== null && newDueDate !== null) {
        tasks[index].title = newTitle;
        tasks[index].description = newDescription;
        tasks[index].dueDate = newDueDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function getTimeRemaining(dueDate) {
    var now = new Date();
    var due = new Date(dueDate);
    var timeDiff = due - now;

    var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
}

function formatDate(dateString) {
    var date = new Date(dateString);
    var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
