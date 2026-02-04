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
            form.reset();
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
    else if (isDuplicateTask(nameVal)) {
        setError(inputName, "Task name already exists");
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

    // First Error Focus
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

function setError(element, message) {
    const parent = element.parentElement;
    const errorElement = parent.querySelector('.error');
    errorElement.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #c0392b;"></i>  ${message}`;
    element.style.border = "2px solid red";
}

function setSuccess(element) {
    const parent = element.parentElement;
    const errorElement = parent.querySelector('.error');
    errorElement.innerText = '';
}

function isDuplicateTask(taskName) {
    const tasks = getTasks();

    return tasks.some(task =>
        task.name.toLowerCase() === taskName.toLowerCase()
    );
}

const validateEmail = (emailVal) => {
    return String(emailVal)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
};

const checkboxes = document.querySelectorAll('.check');
const radios = document.querySelectorAll('.radio');

const requiredFields = [inputName, inputEmail, inputUsername, inputDate, inputTime, selectPriority, inputHours, inputUrl, inputDescription];

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
        progress: "0",
        taskTypes: [...document.querySelectorAll('.check:checked')]
            .map((checkbox) => checkbox.value),
        status: document.querySelector('.radio:checked')?.value || "Pending"
    };

    tasks.push(task);
    saveTasks(tasks);

    renderTasks();
    taskcardsCount();
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
        taskCard.classList.add("task-card", task.priority);           // task card count
        taskCard.dataset.id = task.id;                                // for Popup for all 
        taskCard.dataset.priority = task.priority.toLowerCase();      // for button filter

        taskCard.innerHTML = `<div class = task-card-title>
          <h4>${task.name}</h4>
          <div class="task-actions">
            <span class="action-icon-outline edit-btn">
              <i class="fas fa-edit"></i>
            </span>
            <span class="action-icon-outline delete-btn" data-id="${task.id}" data-name="${task.name}">
              <i class="fa-solid fa-trash"></i>
            </span>
          </div>
        </div>
        <p>${task.description}</p>
        <p class="task-card-date"><img src="images/Calendar-image.png" alt="Calendar-image">Due:${newDate}</p>
        <p class="task-card-person"><img src="images/Person-image.png" alt="Person-image">${task.username}</p>
        
        <div class="priority-container">
        <label class="${task.priority.toLowerCase()}"><span>&#9679;</span>${task.priority}</label>
        <label class="${task.status.toLowerCase()}"><small>&#9679;</small>${task.status}</label>
        </div>`;

        taskList.prepend(taskCard);
    });

    toggleEmptyState();
    taskcardsCount();
}

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
    taskcardsCount();
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
        // taskCardContainer.style.height = "auto";
        // taskCardContainer.style.overflowY = "visible";
    }
    else {
        emptyTask.style.display = "none";
        taskCardContainer.style.height = "1000px";
        taskCardContainer.style.overflowY = "auto";
    }
}

toggleEmptyState();

// Full Task-card Details (Popup)

const fullTaskcard = document.querySelector('.full-task-card');
const fulltaskCloseButton = document.querySelector('#fulltask-popup-close');
const popupOverlay = document.querySelector('.fulltask-overlay');

taskCardContainer.addEventListener('click', (event) => {

    if (event.target.closest(".edit-btn") || event.target.closest(".delete-btn")) {
        return;
    }

    const card = event.target.closest('.task-card');
    if (!card) return;

    const taskId = Number(card.dataset.id);
    fullTaskPopup(taskId);
});

const popupTaskname = document.querySelector('#popupTitle');
const popupDescription  = document.querySelector('#popupDescription');
const popupUser = document.querySelector('#popupUser');
const popupEmail = document.querySelector('#popupEmail');
const popupDate = document.querySelector('#popupDate');
const popupTime = document.querySelector('#popupTime');
const popupHours = document.querySelector('#popupHours');
const popupPriority = document.querySelector('#popupPriority')
const popupStatus = document.querySelector('#popupStatus');
const popupUrl = document.querySelector('#popupUrl');
const popupProgressBar = document.querySelector('#popupProgressBar');
const popupProgressText = document.querySelector('#popupProgressText');
const popupType = document.querySelector('#popupType');

function fullTaskPopup(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    popupTaskname.textContent = task.name;
    popupDescription.textContent = task.description;
    popupUser.textContent = task.username;
    popupEmail.textContent = task.email;
    popupDate.textContent = task.date;
    popupTime.textContent = task.time;
    popupHours.textContent = `${task.hours} Hours`;
    popupPriority.innerHTML = `<span>&#9679</span>${task.priority}`;
    popupStatus.innerHTML = `${task.status}`;
    popupUrl.href = task.url;
    popupProgressBar.style.width = task.progress + '%';
    popupProgressText.textContent = task.progress + '%';
    popupType.textContent = task.taskTypes?.join(", ");

    popupPriority.className = task.priority.toLowerCase();

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

taskCardContainer.addEventListener("click", (event) => {
    if (event.target.closest(".edit-btn")) {
        const card = event.target.closest(".task-card");

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

const checkboxInput = document.querySelectorAll(".edit-check");
const radioInput = document.querySelectorAll('.edit-radio');

const cancelButton = document.querySelector('#cancel-button');
const updateButton = document.querySelector("#update-button");
const taskEditCloseButton = document.querySelector("#edittask-popup-close");

function editTaskPopup(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == taskId);

    if (!task) {
        return;
    }

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

    checkboxInput.forEach(checkbox => {
        checkbox.checked = task.taskTypes?.includes(checkbox.value);
    });

    radioInput.forEach(radio => {
        radio.checked = radio.value === task.status;
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

updateButton.addEventListener("click", (event) => {
    event.preventDefault();

    const tasks = getTasks();
    const ivalue = tasks.findIndex(t => t.id == editTaskId);

    if (ivalue === -1) {
        return;
    }

    tasks[ivalue] = {
        ...tasks[ivalue],
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
        taskTypes: [...checkboxInput]
            .filter(cb => cb.checked)
            .map(cb => cb.value),
        status: document.querySelector(".edit-radio:checked")?.value || ""
    };

    localStorage.setItem("tasks", JSON.stringify(tasks));

    closeEditPopup();
    renderTasks();

    showToast("Task updated successfully ✅");
});

// Task card Delete button option

const deletePopup = document.querySelector('.delete-popup ');
const cancelDelete = document.querySelector('.cancel-button');
const confirmDelete = document.querySelector('.confirm-delete-button');
const deleteTaskName = document.querySelector('#delete-task-name');

let taskToDeleteId = null;

taskList.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    if (!deleteButton) return;

    taskToDeleteId = deleteButton.dataset.id;
    const taskName = deleteButton.dataset.name;

    deleteTaskName.textContent = taskName;

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

// Taskcards count

function taskcardsCount() {
    const allCountEl = document.getElementById('all-button-count');
    const highCountEl = document.getElementById('high-button-count');
    const mediumCountEl = document.getElementById('medium-button-count');
    const lowCountEl = document.getElementById('low-button-count');

    const highCount = document.querySelectorAll('.High').length;
    const mediumCount = document.querySelectorAll('.Medium').length;
    const lowCount = document.querySelectorAll('.Low').length;

    allCountEl.textContent = highCount + mediumCount + lowCount;
    highCountEl.textContent = highCount;
    mediumCountEl.textContent = mediumCount;
    lowCountEl.textContent = lowCount;
}


// Auto Update Year in Footer

const copyrightYear = document.getElementById("copyright-year");
const currentYear = new Date().getFullYear();
copyrightYear.textContent = currentYear;


// Prevent <a> tag reload 

const footer = document.querySelector(".footer-container");

footer.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) {
        return
    }
    e.preventDefault();
});

