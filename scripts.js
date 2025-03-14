const apiKey = "c6ff1da700c20847888e18b1521abc7d"; // Your API key
let currentUser = null; // Track logged-in user
let users = JSON.parse(localStorage.getItem("users")) || {}; // Store registered users

// Show the Authentication Section (Sign-up / Login)
function showAuth() {
    // Hide the Welcome Page and Show the Auth Page
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('auth').classList.remove('hidden');
}

// Toggle between Login & Sign-Up forms
function toggleAuth() {
    document.getElementById("login").classList.toggle("hidden");
    document.getElementById("signup").classList.toggle("hidden");
}

// User Registration (Sign-Up)
function signUpUser() {
    let name = document.getElementById("signup-name").value.trim();
    let email = document.getElementById("signup-email").value.trim();
    let password = document.getElementById("signup-password").value.trim();

    // Check if all fields are filled
    if (!name || !email || !password) {
        alert("All fields are required!");
        return;
    }

    // Check if the email already exists
    if (users[email]) {
        alert("Email already exists! Please log in.");
        return;
    }

    // Save the new user to localStorage
    users[email] = { name, password };
    localStorage.setItem("users", JSON.stringify(users));

    alert("Sign-Up successful! Please log in.");
    toggleAuth(); // Switch to login
}

// User Login
function loginUser() {
    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById("login-password").value.trim();

    // Check if email and password are provided
    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    // Check if the email and password match
    if (!users[email] || users[email].password !== password) {
        alert("Invalid email or password!");
        return;
    }

    // Set currentUser and show logged-in UI
    currentUser = email;
    document.getElementById('auth').classList.add('hidden');
    document.getElementById('navbar').classList.remove('hidden');
    document.getElementById('todo').classList.add('hidden'); // Hide todo initially
    loadTasks(); // Load tasks for the logged-in user
}

// Logout
function logoutUser() {
    currentUser = null;
    document.getElementById('navbar').classList.add('hidden');
    document.getElementById('todo').classList.add('hidden');
    document.getElementById('auth').classList.remove('hidden');
}

// Show To-Do Section
function showSection(sectionId) {
    document.getElementById('todo').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
}

// Add Task
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

// Toggle Task Completion
function toggleTask(task) {
    task.parentElement.classList.toggle('completed');
    saveTasks();
}

// Remove Task
function removeTask(task) {
    task.parentElement.remove();
    saveTasks();
}

// Save Tasks to Local Storage
function saveTasks() {
    if (!currentUser) return;

    let tasks = [];
    document.querySelectorAll('#task-list li').forEach(task => {
        tasks.push(task.textContent.replace('❌', '').trim());
    });
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
}

// Load Tasks from Local Storage
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

// Fetch Weather API
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

// Get User's Location for Weather
navigator.geolocation.getCurrentPosition(
    position => fetchWeather(position.coords.latitude, position.coords.longitude),
    () => document.getElementById('weather-widget').innerHTML = "Location access denied."
);
