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

// Create Task Form Validation

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const isValid = validateInputs();

    if (isValid) {
        setTimeout(() => {
            createTask();
            form.reset();

            showToast("Task Created Successfully");
        }, 400);
    }
});

const userNameValidator = /^[A-Za-z\s.]+$/;
const userPattern = /^(?:[A-Za-z]{3,})(?:[.\s][A-Za-z]+)*$/;
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const urlPattern = /^https?:\/\/[\w.-]+(\.[\w.-]+)+([/#?].*)?$/i;

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
        setError(inputUsername, 'Assignee Name is required');
        firstError ??= inputUsername;
    }
    else if (usernameVal.length < 3) {
        setError(inputUsername, 'Assignee Name must be at least 3 characters');
        firstError ??= inputUsername;
    }
    else if (!userNameValidator.test(usernameVal)) {
        setError(inputUsername, 'Assignee name cannot include numbers or special characters');
        firstError ??= inputUsername;
    }
    else if (usernameVal.startsWith('.') || usernameVal.endsWith('.')) {
        setError(inputUsername, 'Assignee Name cannot start or end with a dot');
        firstError ??= inputUsername;
    }
    else if (!userPattern.test(usernameVal)) {
        setError(inputUsername, 'Invalid Assignee Name format');
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
    else if (!userNameValidator.test(nameVal)) {
        setError(inputName, 'Task name cannot include numbers or special characters');
        firstError ??= inputName;
    }
    else if (isDuplicateTask(nameVal)) {
        setError(inputName, "Task Name already exists");
        firstError ??= inputName;
    }
    else {
        setSuccess(inputName);
    }

    // Validate Email
    if (emailVal === '') {
        setError(inputEmail, 'Assignee Email is required');
        firstError ??= inputEmail;
    }
    else if (!emailVal.includes('@')) {
        setError(inputEmail, "Email must include '@' symbol");
        firstError ??= inputEmail;
    }
    else if (!emailPattern.test(emailVal)) {
        setError(inputEmail, 'Please enter a valid email (e.g., name@email.com)');
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
    else if (dateVal === formattedTodayDate()) {
        const currentTime = formattedCurrentTime();

        if (timeVal < currentTime) {
            setError(inputTime, 'Due Time cannot be in the past');
            firstError ??= inputTime;
        }
        else {
            setSuccess(inputTime);
        }
    }
    else {
        setSuccess(inputTime);
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
    else if (hoursVal == 0) {
        setError(inputHours, 'Estimated Hours must be more than 0');
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
    else if (!/^https?:\/\//i.test(urlVal)) {
        setError(inputUrl, 'Enter a valid URL starting with http:// or https://');
        firstError ??= inputUrl;
    }
    else if (!urlPattern.test(urlVal)) {
        setError(inputUrl, 'Invalid URL');
        firstError ??= inputUrl;
    }
    else {
        setSuccess(inputUrl);
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
        setError(firstCheckbox, "Please select at least one Task Type");
        firstError ??= firstCheckbox;
    } else {
        setSuccess(firstCheckbox);
    }

    // Validate Task Status

    const inputRadio = document.querySelector('.radio:checked');
    const firstRadio = document.querySelector('.radio');

    if (!inputRadio) {
        setError(firstRadio, "Please select Task Status");
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
    element.style.borderColor = 'red';
}

function setSuccess(element) {
    const parent = element.parentElement;
    const errorElement = parent.querySelector('.error');
    errorElement.innerText = '';
    element.style.border = "";
}

function isDuplicateTask(taskName, taskId = null) {
    const tasks = getTasks();

    return tasks.some(task =>
        task.name.toLowerCase() === taskName.toLowerCase() && task.id !== taskId
    );
}


// Toast Message ( Success Notification )

const toast = document.querySelector('.toast');
const toastClose = document.getElementById('toast-close');

function showToast(message) {
    const toastMessage = document.querySelector(".toast-message");
    toastMessage.textContent = message;
    toast.classList.add("show");
    toast.style.display = "flex";

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

toastClose.addEventListener('click', () => {
    toast.style.display = "none";
})


// Local Storage 

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Storing New Task in Local Storage 

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
}

// Creating new Task Cards

function renderTasks() {
    taskList.innerHTML = "";

    const tasks = getTasks();

    tasks.forEach(task => {

        const newDate = new Date(task.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });

        const taskPriority = task.priority.toLowerCase();

        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card", taskPriority);           // task card count
        taskCard.dataset.id = task.id;                                // for Popup for all 
        taskCard.dataset.priority = task.priority.toLowerCase();      // for button filter
        taskCard.dataset.status = task.status.toLowerCase();

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
        <p class="task-card-date"><img src="images/Calendar-image.png" alt="Calendar-image">Due: ${newDate}</p>
        <p class="task-card-person"><img src="images/Person-image.png" alt="Person-image">${task.username}</p>
        
        <div class="priority-container">
        <label class="${task.priority.toLowerCase()}"><span>&#9679;</span>${task.priority}</label>
        <label class="${task.status.toLowerCase()}"><small>&#9679;</small>${task.status}</label>
        </div>`;

        taskList.prepend(taskCard);
    });

    taskcardsCount();
    combinedFilter();
}

// Full Task-card Details (Popup)

const fullTaskcard = document.querySelector('.fulltask-popup');
const fulltaskCloseButton = document.querySelector('#fulltask-popup-close');

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
const popupDescription = document.querySelector('#popupDescription');
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

    const newDate = new Date(task.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });

    popupTaskname.textContent = task.name;
    popupDescription.textContent = task.description;
    popupUser.textContent = task.username;
    popupEmail.textContent = task.email;
    popupDate.textContent = newDate;
    popupTime.textContent = task.time;
    popupHours.textContent = `${task.hours} Hours`;

    popupPriority.innerHTML = `<span>&#9679</span>${task.priority}`;
    popupPriority.className = task.priority.toLowerCase();

    popupStatus.innerHTML = `<small>&#9679</small>${task.status}`;
    popupStatus.className = task.status.toLowerCase();

    popupUrl.href = task.url;
    popupProgressBar.style.width = task.progress + '%';
    popupProgressText.textContent = task.progress + '%';
    popupType.textContent = task.taskTypes?.join(", ");

    fullTaskcard.style.display = 'flex';
}

fulltaskCloseButton.addEventListener('click', () => {
    fullTaskcard.style.display = 'none';
});


// Edit Task Validation 

const editTask = document.querySelector(".edit-popup");
const usernameEdit = document.querySelector("#taskUsername");
const tasknameEdit = document.querySelector("#taskName");
const emailEdit = document.querySelector("#taskEmail");
const dateEdit = document.querySelector("#taskDate");
const timeEdit = document.querySelector("#taskTime");
const selectPriorityEdit = document.querySelector("#taskPriority");
const hoursEdit = document.querySelector("#taskHours");
const urlEdit = document.querySelector("#taskUrl");
const descriptionEdit = document.querySelector("#taskDescription");
const progressEdit = document.querySelector("#taskProgress");
const progressLabel = document.querySelector("#taskProgresslabel");
const checkboxEdit = document.querySelectorAll(".edit-check");
const radioEdit = document.querySelectorAll('.edit-radio');

const cancelButton = document.querySelector('#cancel-button');
const updateButton = document.querySelector("#update-button");
const taskEditCloseButton = document.querySelector("#edittask-popup-close");

function validateEditInputs() {
    const usernameVal = usernameEdit.value.trim();
    const tasknameVal = tasknameEdit.value.trim();
    const emailVal = emailEdit.value.trim();
    const dateVal = dateEdit.value;
    const timeVal = timeEdit.value;
    const hoursVal = hoursEdit.value;
    const urlVal = urlEdit.value.trim();
    const descriptionVal = descriptionEdit.value.trim();

    let firstError = null;

    // Validate User name
    if (usernameVal === '') {
        setError(usernameEdit, 'Assignee Name is required');
        firstError ??= usernameEdit;
    }
    else if (usernameVal.length < 3) {
        setError(usernameEdit, 'Assignee Name must be at least 3 characters');
        firstError ??= usernameEdit;
    }
    else if (!userNameValidator.test(usernameVal)) {
        setError(usernameEdit, 'Assignee name cannot include numbers or special characters');
        firstError ??= usernameEdit;
    }
    else if (usernameVal.startsWith('.') || usernameVal.endsWith('.')) {
        setError(usernameEdit, 'Assignee Name cannot start or end with a dot');
        firstError ??= usernameEdit;
    }
    else if (!userPattern.test(usernameVal)) {
        setError(usernameEdit, 'Invalid Assignee Name format');
        firstError ??= usernameEdit;
    }
    else {
        setSuccess(usernameEdit);
    }

    // Validate Task name
    if (tasknameVal === '') {
        setError(tasknameEdit, 'Task Name is required');
        firstError ??= tasknameEdit;
    }
    else if (!userNameValidator.test(tasknameVal)) {
        setError(tasknameEdit, 'Task name cannot include numbers or special characters');
        firstError ??= tasknameEdit;
    }
    else if (isDuplicateTask(tasknameVal, editTaskId)) {
        setError(tasknameEdit, 'Task Name already exists');
        firstError ??= tasknameEdit;
    }
    else {
        setSuccess(tasknameEdit);
    }

    // Validate Email
    if (emailVal === '') {
        setError(emailEdit, 'Assignee Email is required');
        firstError ??= emailEdit;
    }
    else if (!emailVal.includes('@')) {
        setError(emailEdit, "Email must include '@' symbol");
        firstError ??= emailEdit;
    }
    else if (!emailPattern.test(emailVal)) {
        setError(emailEdit, 'Please enter a valid email (e.g., name@email.com)');
        firstError ??= emailEdit;
    }
    else {
        setSuccess(emailEdit);
    }

    // Validate Date
    if (dateVal === '') {
        setError(dateEdit, 'Due Date is required');
        firstError ??= dateEdit;
    }
    else {
        setSuccess(dateEdit);
    }

    // Validate Time
    if (timeVal === '') {
        setError(timeEdit, 'Due Time is required');
        firstError ??= timeEdit;
    }
    else if (dateVal === formattedTodayDate()) {
        const currentTime = formattedCurrentTime();

        if (timeVal < currentTime) {
            setError(timeEdit, 'Due Time cannot be in the past');
            firstError ??= timeEdit;
        }
        else {
            setSuccess(timeEdit);
        }
    }
    else {
        setSuccess(timeEdit);
    }

    // Validate Estimated Hours
    if (hoursVal === '') {
        setError(hoursEdit, 'Estimated Hours are required');
        firstError ??= hoursEdit;
    }
    else if (hoursVal == 0) {
        setError(hoursEdit, 'Estimated Hours must be more than 0');
        firstError ??= hoursEdit;
    }
    else {
        setSuccess(hoursEdit);
    }

    // Validate Project URL
    if (urlVal === '') {
        setError(urlEdit, 'Project URL is required');
        firstError ??= urlEdit;
    }
    else if (!/^https?:\/\//i.test(urlVal)) {
        setError(urlEdit, 'Enter a valid URL starting with http:// or https://');
        firstError ??= urlEdit;
    }
    else if (!urlPattern.test(urlVal)) {
        setError(urlEdit, 'Invalid URL');
        firstError ??= urlEdit;
    }
    else {
        setSuccess(urlEdit);
    }

    // Validate Task Description
    if (descriptionVal === '') {
        setError(descriptionEdit, 'Task Description is required');
        firstError ??= descriptionEdit;
    }
    else {
        setSuccess(descriptionEdit);
    }

    // // Validate Task Type

    const taskTypesEdit = document.querySelector('.edit-check:checked');
    const firstCheckbox = document.querySelector('.edit-checkbox-label');

    if (!taskTypesEdit) {
        setError(firstCheckbox, "Please select at least one Task Type");
        firstError ??= firstCheckbox;
    } else {
        setSuccess(firstCheckbox);
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

// Clear Error on Input

const checkboxes = document.querySelectorAll('.check');
const radios = document.querySelectorAll('.radio');

const checkboxesEdit = document.querySelectorAll('.edit-check');
const editCheckError = document.querySelector('.edit-check-error');

const requiredFields = [inputName, inputEmail, inputUsername, inputDate, inputTime, selectPriority, inputHours, inputUrl, inputDescription, usernameEdit, tasknameEdit, emailEdit, dateEdit, timeEdit, selectPriorityEdit, hoursEdit, urlEdit, descriptionEdit];

requiredFields.forEach((field) => {
    field.addEventListener("input", () => setSuccess(field));
});

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => setSuccess(checkbox));
});

radios.forEach((radio) => {
    radio.addEventListener("change", () => setSuccess(radio));
});

checkboxesEdit.forEach((checkbox) => {
    checkbox.addEventListener("change", () => editCheckError.textContent = "");
});

// Clear Error on Reset

resetButton.addEventListener("click", () => {

    const errorMessages = document.querySelectorAll(".error");
    errorMessages.forEach(error => error.textContent = "");

    const allFields = form.querySelectorAll("input, select, textarea");
    allFields.forEach(field => {
        field.style.borderColor = "";
    });

});


// Edit Form Submit

const editForm = document.querySelector('.edit-form');

editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const isValid = validateEditInputs();

    if (isValid) {
        setTimeout(() => {
            updateTask();
            showToast("Task Updated Successfully");
        }, 400);
    }
});

// Edit Task (Popup)

let editTaskId = null;

taskCardContainer.addEventListener("click", (event) => {
    if (event.target.closest(".edit-btn")) {
        const card = event.target.closest(".task-card");

        editTaskId = Number(card.dataset.id);

        editTaskPopup(editTaskId);
    }
});

function editTaskPopup(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == taskId);

    if (!task) {
        return;
    }

    editTask.style.display = "flex";

    usernameEdit.value = task.username;
    tasknameEdit.value = task.name;
    emailEdit.value = task.email;
    dateEdit.value = task.date;
    timeEdit.value = task.time;
    selectPriorityEdit.value = task.priority;
    hoursEdit.value = task.hours;
    urlEdit.value = task.url;
    descriptionEdit.value = task.description;
    progressEdit.value = task.progress || 0;
    progressLabel.textContent = `${task.progress}%`;

    checkboxEdit.forEach(checkbox => {
        checkbox.checked = task.taskTypes?.includes(checkbox.value);
    });

    radioEdit.forEach(radio => {
        radio.checked = radio.value === task.status;
    });

    progressEdit.addEventListener('input', () => {
        progressLabel.innerHTML = `${progressEdit.value}%`;
    })
}
function closeEditPopup() {
    editTask.style.display = "none";
    editTaskId = null;
}

taskEditCloseButton.addEventListener('click', closeEditPopup);

cancelButton.addEventListener('click', closeEditPopup);

function updateTask() {
    const tasks = getTasks();
    const ivalue = tasks.findIndex(t => t.id == editTaskId);

    if (ivalue === -1) {
        return;
    }

    tasks[ivalue] = {
        ...tasks[ivalue],
        username: usernameEdit.value.trim(),
        name: tasknameEdit.value.trim(),
        email: emailEdit.value.trim(),
        date: dateEdit.value,
        time: timeEdit.value,
        priority: selectPriorityEdit.value,
        hours: hoursEdit.value,
        url: urlEdit.value,
        description: descriptionEdit.value,
        progress: progressEdit.value,
        taskTypes: [...checkboxEdit]
            .filter(cb => cb.checked)
            .map(cb => cb.value),
        status: document.querySelector(".edit-radio:checked")?.value || ""
    };

    localStorage.setItem("tasks", JSON.stringify(tasks));

    closeEditPopup();
    renderTasks();
}


// Task card Delete button option

const deletePopup = document.querySelector('.delete-popup ');
const cancelDelete = document.querySelector('.cancel-button');
const confirmDelete = document.querySelector('.confirm-delete-button');
const deleteTaskName = document.querySelector('#delete-task-name');
const deleteOverlay = document.querySelector('.delete-overlay');

let taskToDeleteId = null;

taskList.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    if (!deleteButton) return;

    taskToDeleteId = deleteButton.dataset.id;
    const taskName = deleteButton.dataset.name;

    deleteTaskName.textContent = taskName;

    deletePopup.style.display = 'block';
    deleteOverlay.style.display = 'block';
});

function deleteTask(id) {
    const tasks = getTasks();

    const deleteTaskIndex = tasks.findIndex(task => Number(task.id) === Number(id));

    if (deleteTaskIndex !== -1) {
        tasks.splice(deleteTaskIndex, 1);
    }

    saveTasks(tasks);
    renderTasks();
}

confirmDelete.addEventListener("click", () => {
    if (!taskToDeleteId) return;

    setTimeout(() => {
        deleteTask(taskToDeleteId);

        deletePopup.style.display = 'none';
        deleteOverlay.style.display = 'none';

        showToast("Task Deleted Successfully");
    }, 400);
});

cancelDelete.addEventListener("click", () => {
    taskToDeleteId = null;
    deletePopup.style.display = 'none';
    deleteOverlay.style.display = 'none';

});


// Nav-bar Transitions in mobile

const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navContainer.classList.toggle('active');
})

function closeMobileNav() {
    hamburger.classList.remove('active');
    navContainer.classList.remove('active');
}


// Tasks Priority and Status Filter

let currentPriority = "all";
let currentStatus = "all";
let currentSearch = "";

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filterValue = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        currentPriority = filterValue;
        combinedFilter();
    });
});

const statusFilter = document.getElementById("statusFilter");

statusFilter.addEventListener("change", () => {
    currentStatus = statusFilter.value;
    combinedFilter();
});

function combinedFilter() {
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach((card) => {

        const priority = card.dataset.priority;
        const status = card.dataset.status;

        const title = card.querySelector("h4")?.textContent.toLowerCase() || "";
        const description = card.querySelector("p")?.textContent.toLowerCase() || "";
        const username = card.querySelector(".task-card-person")?.textContent.toLowerCase() || "";

        const priorityFind = currentPriority === "all" || priority === currentPriority;

        const statusFind = currentStatus === "all" || status === currentStatus;

        const searchFind =
            title.includes(currentSearch) ||
            description.includes(currentSearch) ||
            username.includes(currentSearch);

        if (priorityFind && statusFind && searchFind) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });

    togglePriorityUI(currentPriority);
    taskcardsCount();
}

// Global Empty Task Container 

const addTaskButton = document.querySelector('.add-task-button');
const emptyTask = document.querySelector('.empty-task');
const globalEmptyDescription = document.querySelector('.empty-description');

addTaskButton.addEventListener("click", () => {
    location.hash = "dashboard";

    setTimeout(() => {
        inputUsername.focus();
    }, 100);
});

// Priority and Status Empty Container

const priorityEmptyUI = document.getElementById("priority-empty-ui");
const priorityEmptyTitle = document.getElementById("priority-empty-title");

function visibleTasksCount() {
    return [...document.querySelectorAll(".task-card")]
        .filter(card => card.style.display !== "none").length;
}

function togglePriorityUI(priority) {
    const taskCards = document.querySelectorAll(".task-card");

    const totalTasks = taskCards.length;
    const visibleTasks = visibleTasksCount();

    if (totalTasks === 0) {
        emptyTask.style.display = "flex";
        priorityEmptyUI.classList.add("hidden");
        taskList.style.display = "none";

        taskCardContainer.style.height = "auto";
        taskCardContainer.style.overflowY = "visible";
        return;
    }

    if (visibleTasks === 0) {
        emptyTask.style.display = "none";
        priorityEmptyUI.classList.remove("hidden");
        taskList.style.display = "none";

        const statusTasks = [...taskCards].filter(
            card => currentStatus === "all" || card.dataset.status === currentStatus
        );

        if (statusTasks.length === 0) {
            priorityEmptyTitle.textContent =
                currentStatus === "all"
                    ? "No Tasks"
                    : `No ${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Tasks`;
        } else {
            priorityEmptyTitle.textContent =
                priority === "all"
                    ? `No ${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Tasks`
                    : `No ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Tasks`;
        }

        taskCardContainer.style.height = "auto";
        taskCardContainer.style.overflowY = "visible";
        return;
    }

    emptyTask.style.display = "none";
    priorityEmptyUI.classList.add("hidden");
    taskList.style.display = "grid";

    taskCardContainer.style.height = "930px";
    taskCardContainer.style.overflowY = "auto";
}


// Taskcards Count

function taskcardsCount() {
    const allButtonCount = document.getElementById("all-button-count");
    const highbuttonCount = document.getElementById("high-button-count");
    const mediumButtonCount = document.getElementById("medium-button-count");
    const lowButtonCount = document.getElementById("low-button-count");

    const taskCards = document.querySelectorAll(".task-card");

    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let totalCount = 0;

    taskCards.forEach((card) => {

        const priority = card.dataset.priority;
        const status = card.dataset.status;

        const statusFind =
            currentStatus === "all" || status === currentStatus;

        if (statusFind) {
            totalCount++;

            if (priority === "high") {
                highCount++;
            }
            if (priority === "medium") {
                mediumCount++;
            }
            if (priority === "low") {
                lowCount++;
            }
        }
    });

    allButtonCount.textContent = totalCount;
    highbuttonCount.textContent = highCount;
    mediumButtonCount.textContent = mediumCount;
    lowButtonCount.textContent = lowCount;
}

// Tasks Search Filter

const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value.toLowerCase().trim();
    combinedFilter();
});


// Page Navigation 

const mainSection = document.querySelector('.main-section');
const taskPanelSection = document.querySelector('.task-panel-section');
const activeTaskSection = document.querySelector('.active-task-section');
const mainTitle = document.querySelector('.main-title');
const navLinks = document.querySelectorAll('.nav-links a');
const searchBox = document.querySelector('.search-container');
const profileBox = document.querySelector('.profile-box');

function resetUI() {
    mainSection.classList.remove('active');
    taskPanelSection.classList.remove('active');
    activeTaskSection.classList.remove('active');
    taskList.classList.remove('active');
    searchBox.classList.remove('active');
    navLinks.forEach(link => link.classList.remove('active-nav'));
    mainSection.style.display = "grid";
    profileBox.style.display = 'none';
}

function showDashboard() {
    resetUI();

    mainTitle.innerHTML = `<span class="line"></span>Task Dashboard`;
    document.querySelector('#dashboard-nav').classList.add('active-nav');

    searchInput.value = "";
    currentSearch = "";
}

function showTasks() {
    resetUI();

    mainSection.classList.add('active');
    taskPanelSection.classList.add('active');
    activeTaskSection.classList.add('active');
    taskList.classList.add('active');
    taskCardContainer.style.height = "auto";
    mainTitle.innerHTML = `<span class="line"></span>Tasks`;
    document.querySelector('#tasks-nav').classList.add('active-nav');
    searchBox.classList.add('active');

    searchInput.value = "";
    currentSearch = "";

    combinedFilter();
}

function showProfile() {
    resetUI();

    mainTitle.innerHTML = `<span class="line"></span>Profile`;
    mainSection.style.display = "none";
    profileBox.style.display = 'flex';
    document.querySelector('#profile-nav').classList.add('active-nav');
}

function handleNavigation() {
    const page = location.hash.replace('#', '') || 'dashboard';
    closeMobileNav();

    switch (page) {
        case 'tasks':
            showTasks();
            break;

        case 'profile':
            showProfile();
            break;

        default:
            showDashboard();
    }
}

window.addEventListener('hashchange', handleNavigation);
window.addEventListener('DOMContentLoaded', handleNavigation);


// Auto Update Year in Footer

const copyrightYear = document.getElementById("copyright-year");
const currentYear = new Date().getFullYear();
copyrightYear.textContent = currentYear;


// Date and Time Control (No Past)

function formattedTodayDate() {
    return new Date().toISOString().split("T")[0];
}

function formattedCurrentTime() {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
    taskcardsCount();

    const today = formattedTodayDate();
    inputDate.min = today;
    dateEdit.min = today;
});


// Prevent Entering (+ - e E) in number input

inputHours.addEventListener('keydown', function (e) {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
        e.preventDefault();
    }
});


// // Prevent <a> tag reload

// const footer = document.querySelector(".footer-container");
// footer.addEventListener("click", (e) => {
//     const link = e.target.closest("a");
//     if (!link) {
//         return
//     }
//     e.preventDefault();
// });