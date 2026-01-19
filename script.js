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
const inputColor = document.querySelector('#color-input');
const inputUpload = document.querySelector('#upload-input');
const createButton = document.querySelector('#create-button');
const resetButton = document.querySelector('#reset-button');
const taskCardContainer = document.querySelector('.task-card-container');
const taskCard = document.querySelector('.task-card');
const form = document.querySelector('#form');

// Form Validation

form.addEventListener('submit',(event)=>{
    event.preventDefault();
    validateInputs();
    createTask();
});

function validateInputs(){
    const nameVal = inputName.value.trim();
    const emailVal = inputEmail.value.trim();
    const usernameVal = inputUsername.value.trim();
    const dateVal = inputDate.value;
    const selectVal = selectPriority.value;

    let firstError = null;

    // Validate Task name
    if(nameVal === ''){
        setError(inputName,'Task Name is required');
        firstError ??= inputName;
    }
    else{
        setSuccess(inputName);
    }

    // Validate User name
    if(usernameVal === ''){
        setError(inputUsername,'User Name is required');
        firstError ??= inputUsername;
    }
    else{
        setSuccess(inputUsername);
    }

    // Validate Email
    if(emailVal === ''){
        setError(inputEmail,'Email is required');
        firstError ??= inputEmail;
    }
    else if(!validateEmail(emailVal)){
        setError(inputEmail,'Please enter a valid email');
        firstError ??= inputEmail;
    }
    else{
        setSuccess(inputEmail);
    }

    // Validate Date
    if(dateVal === ''){
        setError(inputDate,'Due Date is required');
        firstError ??= inputDate;
    }
    else{
        setSuccess(inputDate)
    }

    // Validate Select priority
    if(selectVal === ''){
        setError(selectPriority,'Priority Level is required');
        firstError ??= selectPriority;
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

function setError(element,message){
    const parent = element.parentElement;
    const errorElement = parent.querySelector('.error');

    errorElement.innerText = message;
    errorElement.style.visibility = "visible";
    // parent.classList.add('error');
    // parent.classList.remove('success');
}
function setSuccess(element){
    const parent = element.parentElement;
    const errorElement = parent.querySelector('.error');

    errorElement.innerText = '';
    errorElement.style.visibility = "hidden";
    // parent.classList.add('success');
    // parent.classList.remove('error');
}

const validateEmail = (emailVal) => {
  return String(emailVal)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
};

const requiredFields = [inputName, inputEmail, inputDate, selectPriority];

requiredFields.forEach((field) => {
  field.addEventListener("input", () => clearError(field));
//   field.addEventListener("focus", () => clearError(field));
});

function clearError(element) {
  const parent = element.parentElement;
  const errorElement = parent.querySelector(".error");

  errorElement.innerText = "";
  errorElement.style.visibility = "hidden";
//   element.classList.remove("border-red");
}

// Creating new Task-card div

function createTask(){
    const taskCard = document.createElement('div');
    taskCard.setAttribute("class", "task-card");
    taskCard.dataset.priority = selectPriority.value;
    const inputRadio = document.querySelector('.radio:checked')?.value;

    taskCard.innerHTML = `<h4>${inputName.value}</h4>
    <p>${inputDescription.value}<p>
    <p class="task-card-date"><img src="images/Calendar-image.png" alt="Calendar-image">${inputDate.value}</p>
    <p class="task-card-person"><img src="images/Person-image.png" alt="Person-image">Sarah Johnson</p>

    <div class="priority-container">
        <label class="${selectPriority.value}"><span>&#9679</span>${selectPriority.value}</label>
        <label class="${inputRadio.toLowerCase()}"><small>&#9679</small>${inputRadio}</label>
    </div>`

    taskCardContainer.append(taskCard);
}


// Input Range Control

const inputProgress = document.querySelector('#progress-input');
const progressPercent = document.querySelector('.task-progress-label');

inputProgress.addEventListener('input',()=>{
    progressPercent.innerHTML = `${inputProgress.value}%`;
})


// Nav-bar Transitions

const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');

hamburger.addEventListener('click', ()=> {
    hamburger.classList.toggle('active');
    navContainer.classList.toggle('active');
})

// Filtering Buttons

const filterButtons = document.querySelectorAll(".filter-btn");
const tasks = document.querySelectorAll(".task-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.id.replace("filter-", ""); // all, high, medium, low

    // toggle active UI
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tasks.forEach(task => {
      const priority = task.dataset.priority;

      if (filter === "all" || priority === filter) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    });
  });
});


