# pms0602.github.io

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Momentum Clone</title>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", sans-serif;
}

body {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  width: 100%;
  min-height: 100vh;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  text-align: center;
  width: 90%;
  max-width: 700px;
}

#clock {
  font-size: 5rem;
  font-weight: bold;
}

#greeting {
  margin-top: 15px;
  font-size: 2rem;
}

.hidden {
  display: none;
}

#login-form input,
#todo-form input {
  padding: 12px;
  border: none;
  border-radius: 8px;
  width: 300px;
  font-size: 1rem;
}

#login-form button,
#todo-form button {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 5px;
}

#todo-form {
  margin-top: 30px;
}

#todo-list {
  list-style: none;
  margin-top: 20px;
}

#todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.15);
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 10px;
}

.delete-btn {
  background: crimson;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

#weather {
  margin-top: 20px;
  font-size: 1.1rem;
}
</style>
</head>

<body>
<div class="overlay">
  <div class="container">

    <h1 id="clock">00:00:00</h1>

    <form id="login-form">
      <input
        type="text"
        placeholder="이름을 입력하세요"
        required
      />
      <button>로그인</button>
    </form>

    <h2 id="greeting" class="hidden"></h2>

    <div id="weather"></div>

    <form id="todo-form" class="hidden">
      <input
        type="text"
        placeholder="할 일을 입력하세요"
        required
      />
      <button>추가</button>
    </form>

    <ul id="todo-list"></ul>

  </div>
</div>

<script>


const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
];

const randomImage =
  images[Math.floor(Math.random() * images.length)];

document.body.style.backgroundImage =
  `url(${randomImage}?auto=format&fit=crop&w=1500&q=80)`;



const clock = document.querySelector("#clock");

function updateClock() {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  clock.innerText = `${h}:${m}:${s}`;
}

updateClock();
setInterval(updateClock, 1000);



const loginForm = document.querySelector("#login-form");
const loginInput = loginForm.querySelector("input");

const greeting = document.querySelector("#greeting");

const USERNAME_KEY = "username";

function paintGreeting(name) {
  greeting.innerText = `안녕하세요, ${name}님 👋`;
  greeting.classList.remove("hidden");
  loginForm.classList.add("hidden");
  todoForm.classList.remove("hidden");
}

function onLoginSubmit(e) {
  e.preventDefault();

  const username = loginInput.value;

  localStorage.setItem(USERNAME_KEY, username);

  paintGreeting(username);
}

loginForm.addEventListener("submit", onLoginSubmit);

const savedUsername =
  localStorage.getItem(USERNAME_KEY);

if (savedUsername) {
  paintGreeting(savedUsername);
}



const todoForm = document.querySelector("#todo-form");
const todoInput = todoForm.querySelector("input");
const todoList = document.querySelector("#todo-list");

const TODOS_KEY = "todos";

let todos = [];

function saveTodos() {
  localStorage.setItem(
    TODOS_KEY,
    JSON.stringify(todos)
  );
}

function deleteTodo(e) {
  const li = e.target.parentElement;

  todos = todos.filter(
    todo => todo.id !== Number(li.id)
  );

  saveTodos();
  li.remove();
}

function paintTodo(todoObj) {
  const li = document.createElement("li");
  li.id = todoObj.id;

  const span = document.createElement("span");
  span.innerText = todoObj.text;

  const button = document.createElement("button");
  button.innerText = "삭제";
  button.className = "delete-btn";

  button.addEventListener("click", deleteTodo);

  li.appendChild(span);
  li.appendChild(button);

  todoList.appendChild(li);
}

function handleTodoSubmit(e) {
  e.preventDefault();

  const newTodo = todoInput.value;

  todoInput.value = "";

  const todoObj = {
    text: newTodo,
    id: Date.now()
  };

  todos.push(todoObj);

  paintTodo(todoObj);
  saveTodos();
}

todoForm.addEventListener(
  "submit",
  handleTodoSubmit
);

const savedTodos =
  localStorage.getItem(TODOS_KEY);

if (savedTodos) {
  const parsedTodos = JSON.parse(savedTodos);

  todos = parsedTodos;

  parsedTodos.forEach(paintTodo);
}




const API_KEY = "d00ccee1dfc56e75d286e298ec8b8d86";

function onGeoSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const city = data.name;
      const temp = data.main.temp;
      const weather = data.weather[0].main;

      document.querySelector(
        "#weather"
      ).innerText =
        `📍 ${city} | 🌡️ ${temp}°C | ☁️ ${weather}`;
    })
    .catch(() => {
      document.querySelector(
        "#weather"
      ).innerText =
        "날씨 정보를 불러올 수 없습니다.";
    });
}

function onGeoError() {
  document.querySelector(
    "#weather"
  ).innerText =
    "위치 정보를 허용해주세요.";
}

navigator.geolocation.getCurrentPosition(
  onGeoSuccess,
  onGeoError
);
</script>
</body>
</html>
