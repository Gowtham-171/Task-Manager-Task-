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

    errorElement.innerText = "";
    // errorElement.style.visibility = "hidden";
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
        type: [...document.querySelectorAll('.check:checked')]
                .map((checkbox) => checkbox.value),
        status: document.querySelector('.radio:checked')?.value || "Pending"
    };

    tasks.push(task);
    saveTasks(tasks);

    renderTasks();
}

function renderTasks() {
    //   taskCardContainer.innerHTML = "";

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

        taskCard.innerHTML =
        `<h4 class="task-card-name">${task.name}</h4>
        <div class="task-actions">
                <span class="action-icon-outline edit-btn">
                  <i class="fa-solid fa-pen"></i>
                </span>
                <span class="action-icon-outline delete-btn">
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

        taskCardContainer.appendChild(taskCard);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
});

// Full Task-card Details (Popup)

const fullTaskcard = document.querySelector('.full-task-card');
const closeBtn = document.querySelector('.popup-close');
const popupOverlay = document.querySelector('.popup-overlay');

taskCardContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.task-card');
    if (!card) return;

    const taskId = Number(card.dataset.id);
    openFullTaskPopup(taskId);
});

function openFullTaskPopup(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    console.log(task)

    if (!task) return;

    document.querySelector('#popupTitle').textContent = task.name;
    document.querySelector('#popupDescription').textContent = task.description;
    document.querySelector('#popupUser').textContent = task.username;
    document.querySelector('#popupEmail').textContent = task.email;
    document.querySelector('#popupDate').textContent = task.date;
    document.querySelector('#popupTime').textContent = task.time;
    document.querySelector('#popupHours').textContent = task.hours;
    document.querySelector('#popupPriority').textContent = task.priority;
    document.querySelector('#popupStatus').textContent = task.status;
    document.querySelector('#popupUrl').href = task.url;
    
    

    fullTaskcard.style.display = 'block';
    popupOverlay.style.display = 'block';
}

closeBtn.addEventListener('click', () => {
    fullTaskcard.style.display = 'none';
    popupOverlay.style.display = 'none';
});

// Task card delete and edit option

document.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-btn");

  if (deleteBtn) {
    deleteBtn.closest(".task-card").remove();
  }
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

const filterButtons = document.querySelectorAll(".filter-btn");

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


