const openModalBtn = document.querySelector("#openModalBtn");
const closeModalBtn = document.querySelector("#closeModalBtn");
const todoModal = document.querySelector(".modalOverlay");
const taskList = document.querySelector(".taskList");
const taskDescInput = document.querySelector("#taskDescInput");
const taskDateInput = document.querySelector("#taskDateInput");
const saveTaskBtn = document.querySelector("#saveTaskBtn");
const dayOfWeek = document.querySelector(".dayOfWeek");
const currentDate = document.querySelector(".currentDate");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "все";

openModalBtn.addEventListener("click", function () {
  todoModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", function () {
  todoModal.style.display = "none";
});

todoModal.addEventListener("click", function (event) {
  if (event.target === todoModal) {
    todoModal.style.display = "none";
  }
});

saveTaskBtn.addEventListener("click", function () {
  const text = taskDescInput.value.trim();
  let date = taskDateInput.value.trim();

  if (date) {
    const parsedDate = new Date(date);
    date = parsedDate.toLocaleDateString("ru-RU");
  }

  if (text === "") {
    alert("Пожалуйста, введите описание задачи!");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    date: date,
    completed: false,
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();

  taskDescInput.value = "";
  taskDateInput.value = "";
  taskDateInput.type = "text";
  todoModal.style.display = "none";
});

function updateHeaderDate() {
  const today = new Date();
  const dayName = today.toLocaleDateString("ru-RU", { weekday: "long" });
  const dateName = today.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  dayOfWeek.textContent = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  currentDate.textContent = dateName;
}

updateHeaderDate();

function renderTasks() {
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter(function (task) {
    if (currentFilter === "активные") {
      return !task.completed;
    }
    if (currentFilter === "завершенные") {
      return task.completed;
    }
    return true;
  });

  filteredTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.classList.add("taskItem");
    if (task.completed) {
      li.classList.add("isCompleted");
    }

    li.innerHTML = `
            <div class="checkboxWrapper">
                <input type="checkbox" class="realCheckbox" ${task.completed ? "checked" : ""} />
                <span class="customCheckbox"></span>
            </div>
            <div class="taskContent">
                <span class="taskDate">${task.date || "Без даты"}</span>
                <p class="taskText">${task.text}</p>
            </div>
        `;

    const checkbox = li.querySelector(".realCheckbox");
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

renderTasks();

const filterButtons = document.querySelectorAll(".filterBtn");
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    document
      .querySelector(".filterBtn.dynamicActive")
      .classList.remove("dynamicActive");
    btn.classList.add("dynamicActive");
    const btnText = btn.textContent.trim().toLowerCase();

    if (btnText.includes("активные")) {
      currentFilter = "активные";
    } else if (btnText.includes("завершенные")) {
      currentFilter = "завершенные";
    } else {
      currentFilter = "все";
    }
    renderTasks();
  });
});

taskDateInput.addEventListener("focus", function () {
  taskDateInput.type = "date";
  try {
    taskDateInput.showPicker();
  } catch (e) {}
});

taskDateInput.addEventListener("blur", function () {
  if (taskDateInput.value === "") {
    taskDateInput.type = "text";
  }
});
