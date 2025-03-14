
const apiKey = "c6ff1da700c20847888e18b1521abc7d"; // Your API key
let currentUser = null; // Track logged-in user

function showAuth() {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('auth').classList.remove('hidden');
}

function loginUser() {
    let email = document.getElementById("login-email").value;
    if (!email) {
        alert("Please enter a valid email!");
        return;
    }

    currentUser = email;
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('navbar').classList.remove('hidden');
    document.getElementById('todo').classList.add('hidden'); // Hide todo initially
    loadTasks();
}

function logoutUser() {
    currentUser = null;
    document.getElementById('navbar').classList.add('hidden');
    document.getElementById('todo').classList.add('hidden');
    document.getElementById('auth').classList.remove('hidden');
}

function showSection(sectionId) {
    document.getElementById('todo').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
}

function addTask() {
    if (!currentUser) return;

    let taskInput = document.getElementById('todo-input');
    let taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    let taskList = document.getElementById('task-list');
    let li = document.createElement('li');
    li.innerHTML = `<span onclick="toggleTask(this)">${taskText}</span> <button onclick="removeTask(this)">❌</button>`;
    taskList.appendChild(li);
    
    saveTasks();
    taskInput.value = "";
}

function toggleTask(task) {
    task.parentElement.classList.toggle('completed');
    saveTasks();
}

function removeTask(task) {
    task.parentElement.remove();
    saveTasks();
}

function saveTasks() {
    if (!currentUser) return;

    let tasks = [];
    document.querySelectorAll('#task-list li').forEach(task => {
        tasks.push(task.textContent.replace('❌', '').trim());
    });
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
}

function loadTasks() {
    if (!currentUser) return;

    let tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
    let taskList = document.getElementById('task-list');
    taskList.innerHTML = "";
    tasks.forEach(task => {
        let li = document.createElement('li');
        li.innerHTML = `<span onclick="toggleTask(this)">${task}</span> <button onclick="removeTask(this)">❌</button>`;
        taskList.appendChild(li);
    });
}

function fetchWeather(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherInfo = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
            document.getElementById('weather-widget').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"> <b>${weatherInfo}</b>`;
        })
        .catch(() => {
            document.getElementById('weather-widget').innerHTML = "Unable to fetch weather.";
        });
}

navigator.geolocation.getCurrentPosition(
    position => fetchWeather(position.coords.latitude, position.coords.longitude),
    () => document.getElementById('weather-widget').innerHTML = "Location access denied."
);
