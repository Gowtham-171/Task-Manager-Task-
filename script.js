// Selecting Elements

const inputName = document.querySelector('#name-input');
const inputEmail = document.querySelector('#email-input');
const inputUsername = document.querySelector('#username-input');
const inputDate = document.querySelector('#date-input');
const inputTime = document.querySelector('#time-input');
const selectPriority = document.querySelector('#priority-select');
const inputHours = document.querySelector('#hours-input');
const inputUrl = document.querySelector('#url-input');
const inputDescription = document.querySelector('#description-input');
const inputProgress = document.querySelector('#progress-input');
const createButton = document.querySelector('#create-button');
const resetButton = document.querySelector('#reset-button');

const taskCardContainer = document.querySelector('.task-card-container');
const taskCard = document.querySelector('.task-card');
const form = document.querySelector('#form');

// Form Validation

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const isValid = validateInputs();

    if (isValid) {
        showToast("Task created successfully ✅");

        setTimeout(() => {
            createTask();
        }, 400);
    }
});

function validateInputs() {
    const nameVal = inputName.value.trim();
    const emailVal = inputEmail.value.trim();
    const usernameVal = inputUsername.value.trim();
    const dateVal = inputDate.value;
    const timeVal = inputTime.value;
    const selectVal = selectPriority.value;
    const hoursVal = inputHours.value;
    const urlVal = inputUrl.value.trim();
    const descriptionVal = inputDescription.value.trim();
    const progressVal = Number(inputProgress.value);

    let firstError = null;

    // Validate User name
    if (usernameVal === '') {
        setError(inputUsername, 'User Name is required');
        firstError ??= inputUsername;
    }
    else {
        setSuccess(inputUsername);
    }

    // Validate Task name
    if (nameVal === '') {
        setError(inputName, 'Task Name is required');
        firstError ??= inputName;
    }
    else {
        setSuccess(inputName);
    }

    // Validate Email
    if (emailVal === '') {
        setError(inputEmail, 'Email is required');
        firstError ??= inputEmail;
    }
    else if (!validateEmail(emailVal)) {
        setError(inputEmail, 'Please enter a valid email');
        firstError ??= inputEmail;
    }
    else {
        setSuccess(inputEmail);
    }

    // Validate Date
    if (dateVal === '') {
        setError(inputDate, 'Due Date is required');
        firstError ??= inputDate;
    }
    else {
        setSuccess(inputDate)
    }

    // Validate Time
    if (timeVal === '') {
        setError(inputTime, 'Due Time is required');
        firstError ??= inputTime;
    }
    else {
        setSuccess(inputTime)
    }

    // Validate Select Priority
    if (selectVal === '') {
        setError(selectPriority, 'Priority Level is required');
        firstError ??= selectPriority;
    }
    else {
        setSuccess(selectPriority);
    }

    // Validate Estimated Hours
    if (hoursVal === '') {
        setError(inputHours, 'Estimated Hours are required');
        firstError ??= inputHours;
    }
    else {
        setSuccess(inputHours);
    }

    // Validate Project URL
    if (urlVal === '') {
        setError(inputUrl, 'Project URL is required');
        firstError ??= inputUrl;
    }
    else {
        setSuccess(inputUrl)
    }

    // Validate Task Description
    if (descriptionVal === '') {
        setError(inputDescription, 'Task Description is required');
        firstError ??= inputDescription;
    }
    else {
        setSuccess(inputDescription)
    }

    // Validate Task Progress
    if (progressVal === 0) {
        setError(inputProgress, "Task Progress is required");
        firstError ??= inputProgress;
    } else {
        setSuccess(inputProgress);
    }

    // Validate Task Type

    const inputtaskTypes = document.querySelector('.check:checked');
    const firstCheckbox = document.querySelector('.check');

    if (!inputtaskTypes) {
        setError(firstCheckbox, "Please select at least one task type");
        firstError ??= firstCheckbox;
    } else {
        setSuccess(firstCheckbox);
    }

    // Validate Task Status

    const inputRadio = document.querySelector('.radio:checked');
    const firstRadio = document.querySelector('.radio');

    if (!inputRadio) {
        setError(firstRadio, "Please select task status");
        firstError ??= firstRadio;
    } else {
        setSuccess(firstRadio);
    }

    // Auto scroll
    if (firstError) {
        firstError.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        firstError.focus();
        return false;
    }
    return true;
}

const mandatoryFields = [inputName, inputEmail, inputDate, selectPriority];

function setError(element, message) {
    const parent = element.parentElement;
    const errorElement = parent.querySelector('.error');
    errorElement.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #c0392b;"></i>  ${message}`;
    // errorElement.style.visibility = "visible";

    if (mandatoryFields.includes(element)) {
        element.style.border = "2px solid red";
    }
}

function setSuccess(element) {
    const parent = element.parentElement;
    const errorElement = parent.querySelector('.error');

    errorElement.innerText = '';
    // errorElement.style.visibility = "hidden";
    parent.classList.remove('error');
}

const validateEmail = (emailVal) => {
    return String(emailVal)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
};

const checkboxes = document.querySelectorAll('.check');
const radios = document.querySelectorAll('.radio');

const requiredFields = [inputName, inputEmail, inputUsername, inputDate, inputTime, selectPriority, inputHours, inputUrl, inputDescription, inputProgress];

requiredFields.forEach((field) => {
    field.addEventListener("input", () => clearError(field));
});

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => clearError(checkbox));
});

radios.forEach((radio) => {
    radio.addEventListener("change", () => clearError(radio));
});


function clearError(element) {
    const parent = element.parentElement;
    const errorElement = parent.querySelector(".error");

    if (errorElement) {
        errorElement.innerText = "";
    }
    element.style.border = "";
}


// Toast Message

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


// Local Storage 

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Creating new Task

const taskList = document.getElementById("taskList");

function createTask() {
    const tasks = getTasks();

    const task = {
        id: Date.now(),
        username: inputUsername.value,
        name: inputName.value,
        email: inputEmail.value,
        date: inputDate.value,
        time: inputTime.value,
        priority: selectPriority.value,
        hours: inputHours.value,
        url: inputUrl.value,
        description: inputDescription.value,
        progress: inputProgress.value,
        taskTypes: [...document.querySelectorAll('.check:checked')]
            .map((checkbox) => checkbox.value),
        status: document.querySelector('.radio:checked')?.value || "Pending"
    };

    tasks.push(task);
    saveTasks(tasks);

    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    const tasks = getTasks();

    tasks.forEach(task => {

        const newDate = new Date(task.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });

        const taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.dataset.id = task.id;                  // for Popup
        taskCard.dataset.priority = task.priority;      // for button filter

        taskCard.innerHTML = `<h4>${task.name}</h4>
        <div class="task-actions">
            <span class="action-icon-outline edit-btn">
              <i class="fa-solid fa-pen"></i>
            </span>
            <span class="action-icon-outline delete-btn" data-id="${task.id}">
              <i class="fa-solid fa-trash"></i>
            </span>
        </div>
        <p>${task.description}</p>
        <p class="task-card-date"><img src="images/Calendar-image.png" alt="Calendar-image">Due:${newDate}</p>
        <p class="task-card-person"><img src="images/Person-image.png" alt="Person-image">${task.username}</p>
        
        <div class="priority-container">
        <label class="${task.priority}"><span>&#9679;</span>${task.priority}</label>
        <label class="${task.status.toLowerCase()}"><small>&#9679;</small>${task.status}</label>
        </div>`;

        taskList.appendChild(taskCard);
    });

    toggleEmptyState();
}

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
});

// Empty Task Container 

const addTaskButton = document.querySelector('.add-task-button');
const emptyTask = document.querySelector('.empty-task');

addTaskButton.addEventListener("click", () => {
    inputUsername.focus();
});

function toggleEmptyState() {
    if (taskList.children.length === 0) {
        emptyTask.style.display = "flex";
    } else {
        emptyTask.style.display = "none";
    }
}

toggleEmptyState();

// Full Task-card Details (Popup)

const fullTaskcard = document.querySelector('.full-task-card');
const fulltaskCloseButton = document.querySelector('#fulltask-popup-close');
const popupOverlay = document.querySelector('.fulltask-overlay');

taskCardContainer.addEventListener('click', (e) => {

    if (e.target.closest(".edit-btn") || e.target.closest(".delete-btn")) {
        return;
    }

    const card = e.target.closest('.task-card');
    if (!card) return;

    const taskId = Number(card.dataset.id);
    fullTaskPopup(taskId);
});


function fullTaskPopup(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    // console.log(task)

    if (!task) return;

    document.querySelector('#popupTitle').textContent = task.name;
    document.querySelector('#popupDescription').textContent = task.description;
    document.querySelector('#popupUser').textContent = task.username;
    document.querySelector('#popupEmail').textContent = task.email;
    document.querySelector('#popupDate').textContent = task.date;
    document.querySelector('#popupTime').textContent = task.time;
    document.querySelector('#popupHours').textContent = task.hours;
    document.querySelector('#popupPriority').innerHTML = `<span>&#9679</span>${task.priority}`;
    document.querySelector('#popupStatus').innerHTML = `<small>&#9679</small>${task.status}`;
    document.querySelector('#popupUrl').href = task.url;
    document.querySelector('#popupProgressBar').style.width = task.progress + '%';
    document.querySelector('#popupProgressText').textContent = task.progress + '%';
    document.querySelector('#popupType').textContent = task.taskTypes?.join(", ");

    fullTaskcard.style.display = 'flex';
    popupOverlay.style.display = 'flex';
}

fulltaskCloseButton.addEventListener('click', () => {
    fullTaskcard.style.display = 'none';
    popupOverlay.style.display = 'none';
});


// Edit Task (Popup)

let isEditMode = false;
let editTaskId = null;

taskCardContainer.addEventListener("click", (e) => {
    if (e.target.closest(".edit-btn")) {
        const card = e.target.closest(".task-card");

        editTaskId = card.dataset.id;
        isEditMode = true;

        editTaskPopup(editTaskId);
    }
});

const editTask = document.querySelector(".edit-popup");
const usernameInput = document.querySelector("#taskUsername");
const nameInput = document.querySelector("#taskName");
const emailInput = document.querySelector("#taskEmail");
const dateInput = document.querySelector("#taskDate");
const timeInput = document.querySelector("#taskTime");
const prioritySelect = document.querySelector("#taskPriority");
const hoursInput = document.querySelector("#taskHours");
const urlInput = document.querySelector("#taskUrl");
const descriptionInput = document.querySelector("#taskDescription");
const progressInput = document.querySelector("#taskProgress");
const progressLabel = document.querySelector("#taskProgresslabel");
const taskTypeCheckboxes = document.querySelectorAll(".check");
const cancelButton = document.querySelector('#cancel-button');
const updateButton = document.querySelector("#update-button");
const taskEditCloseButton = document.querySelector("#edittask-popup-close");


function editTaskPopup(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == taskId);

    if (!task) return;

    editTask.style.display = "block";

    usernameInput.value = task.username || "";
    nameInput.value = task.name || "";
    emailInput.value = task.email || "";
    dateInput.value = task.date || "";
    timeInput.value = task.time || "";
    prioritySelect.value = task.priority || "";
    hoursInput.value = task.hours || "";
    urlInput.value = task.url || "";
    descriptionInput.value = task.description || "";
    progressInput.value = task.progress || 0;
    progressLabel.textContent = `${task.progress}%`;

    taskTypeCheckboxes.forEach(checkbox => {
        checkbox.checked = task.taskTypes?.includes(checkbox.value);
    });

    radios.forEach(r => {
        r.checked = r.value === task.status;
    });

    progressInput.addEventListener('input', () => {
        progressLabel.innerHTML = `${progressInput.value}%`;
    })
}
function closeEditPopup() {
    editTask.style.display = "none";
    popupOverlay.style.display = "none";
    editTaskId = null;
    isEditMode = false;
}

taskEditCloseButton.addEventListener('click', closeEditPopup);

cancelButton.addEventListener('click', closeEditPopup);

updateButton.addEventListener("click", (e) => {
    e.preventDefault();

    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id == editTaskId);

    if (index === -1) return;

    tasks[index] = {
        ...tasks[index], // keep id
        username: usernameInput.value.trim(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        date: dateInput.value,
        time: timeInput.value,
        priority: prioritySelect.value,
        hours: hoursInput.value,
        url: urlInput.value,
        description: descriptionInput.value,
        progress: progressInput.value,
        taskTypes: [...taskTypeCheckboxes]
            .filter(cb => cb.checked)
            .map(cb => cb.value),
        status: document.querySelector(".radio:checked")?.value || ""
    };

    localStorage.setItem("tasks", JSON.stringify(tasks));

    console.log(tasks[index]);

    closeEditPopup();
    renderTasks(); // refresh cards

    showToast("Task updated successfully ✅");

        // setTimeout(() => {
        //     ;
        // }, 400);
});


// Task card Delete button option

const deletePopup = document.querySelector('.delete-popup ');
const cancelDelete = document.querySelector('.cancel-button');
const confirmDelete = document.querySelector('.confirm-delete-button');
let taskToDeleteId = null;

taskList.addEventListener("click", (e) => {
  const deleteButton = e.target.closest(".delete-btn");
  if (!deleteButton) return;

  taskToDeleteId = deleteButton.dataset.id;

  deletePopup.style.display = 'block';
  popupOverlay.style.display = 'block';

});

function deleteTask(id) {
  let tasks = getTasks();

  tasks = tasks.filter(task => Number(task.id) !== Number(id));
  
  saveTasks(tasks);
  renderTasks();
}

confirmDelete.addEventListener("click", () => {
  if (!taskToDeleteId) return;

  showToast("Task deleted successfully ✅");

        setTimeout(() => {
            deleteTask(taskToDeleteId);
        }, 400);

  deletePopup.style.display = 'none';
  popupOverlay.style.display = 'none';
});

cancelDelete.addEventListener("click", () => {
  taskToDeleteId = null;
  deletePopup.style.display = 'none';
  popupOverlay.style.display = 'none';
});


// Input Range Control

const progressPercent = document.querySelector('.task-progress-label');

inputProgress.addEventListener('input', () => {
    progressPercent.innerHTML = `${inputProgress.value}%`;
})


// Nav-bar Transitions

const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navContainer.classList.toggle('active');
})

// Filtering Buttons

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filterValue = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const taskCards = document.querySelectorAll(".task-card");

        taskCards.forEach((card) => {
            const priority = card.dataset.priority;

            if (filterValue === "all" || priority === filterValue) {
                card.style.display = "block";
            }
            else {
                card.style.display = "none";
            }
        });
    });
});
