const volunteerRoles = [
  {
    value: "daily-care",
    title: "Daily Care",
    description: "Help with feeding and cleaning under the team's guidance."
  },
  {
    value: "time-with-pets",
    title: "Time With Pets",
    description: "Help pets through suitable walks, play, and gentle attention."
  },
  {
    value: "community-support",
    title: "Community Support",
    description: "Help at events, organize supplies, and share information about the rescue."
  }
];



const formFields = [
  {
    id: "full-name",
    requiredMessage: "Please enter your full name.",
    minLength: 2,
    maxLength: 80
  },
  {
    id: "email",
    requiredMessage: "Please enter your email address.",
    minLength: 0,
    maxLength: 0
  },
  {
    id: "interest",
    requiredMessage: "Please choose a type of interest.",
    minLength: 0,
    maxLength: 0
  },
  {
    id: "experience",
    requiredMessage: "Please choose your experience with pets.",
    minLength: 0,
    maxLength: 0
  },
  {
    id: "message",
    requiredMessage: "Please enter your message.",
    minLength: 10,
    maxLength: 500
  }
];

const form = document.getElementById("interest-form");
const roleSelect = document.getElementById("volunteer-role");
const roleTitle = document.getElementById("role-title");
const roleDescription = document.getElementById("role-description");
const roleStatus = document.getElementById("role-storage-status");

const emailInput = document.getElementById("email");
const rememberEmail = document.getElementById("remember-email");
const emailStatus = document.getElementById("email-storage-status");
const formStatus = document.getElementById("form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showVolunteerRole(){
  roleTitle.textContent = "Find a way to help";
  roleDescription.textContent = "Choose a role above to read about it.";

  for (let i = 0; i < volunteerRoles.length; i++) {
    if (volunteerRoles[i].value === roleSelect.value) {
      roleTitle.textContent = volunteerRoles[i].title;
      roleDescription.textContent = volunteerRoles[i].description;
    }
  }
}

function saveVolunteerRole() {
  showVolunteerRole();

  if (roleSelect.value === "") {
    localStorage.removeItem("rescueVolunteerRole");
    roleStatus.textContent = "Your saved role has been cleared.";
  } else {
    localStorage.setItem("rescueVolunteerRole", roleSelect.value);
    roleStatus.textContent = "Your role is saved for your next visit.";
  }

  formStatus.textContent = "";
}

function saveEmail() {
  const email = emailInput.value.trim();

  if (!rememberEmail.checked) {
    localStorage.removeItem("rescueEmail");
    emailStatus.textContent = "Your email will not be remembered.";
  } else if (emailPattern.test(email)) {
    localStorage.setItem("rescueEmail", email);
    emailStatus.textContent = "Your email is saved for your next visit.";
  } else {
    localStorage.removeItem("rescueEmail");
    emailStatus.textContent = "Enter a valid email address to remember it.";
  }
}

function loadSavedChoices() {
  const savedRole = localStorage.getItem("rescueVolunteerRole");
  const savedEmail = localStorage.getItem("rescueEmail");

  if (savedRole) {
    roleSelect.value = savedRole;

    if (roleSelect.value !== "") {
      roleStatus.textContent = "Your saved role has been restored.";
    }
  }

  showVolunteerRole();

  if (savedEmail && emailPattern.test(savedEmail)) {
    emailInput.value = savedEmail;
    rememberEmail.checked = true;
    emailStatus.textContent = "Your saved email has been filled in.";
  }
}

function validateField(field) {
  const input = document.getElementById(field.id);
  const error = document.getElementById(`${field.id}-error`);
  const value = input.value.trim();
  let message = "";

  if (value === "") {
    message = field.requiredMessage;
  } else if (value.length < field.minLength) {
    message = `Please use at least ${field.minLength} characters.`;
  } else if (field.maxLength > 0 && value.length > field.maxLength) {
    message = `Please use no more than ${field.maxLength} characters.`;
  } else if (field.id === "email" && !emailPattern.test(value)) {
    message = "Enter an email address like name@example.com.";
  }

  error.textContent = message;

  if (message === "") {
    input.classList.remove("input-error");
    input.setAttribute("aria-invalid", "false");
    return true;
  }

  input.classList.add("input-error");
  input.setAttribute("aria-invalid", "true");
  return false;
}

function checkForm(event) {
  event.preventDefault();
  let isValid = true;

  for (let i = 0; i < formFields.length; i++) {
    if (!validateField(formFields[i])) {
      isValid = false;
    }
  }

  if (isValid) {
    formStatus.textContent = "Your form is complete. No request has been sent.";
  } else {
    formStatus.textContent = "Please correct the marked fields and check again.";
  }
}

function addFieldListeners() {
  for (let i = 0; i < formFields.length; i++) {
    const field = formFields[i];
    const input = document.getElementById(field.id);

    input.addEventListener("input", function () {
      formStatus.textContent = "";

      if (input.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  }
}

roleSelect.addEventListener("change", saveVolunteerRole);

rememberEmail.addEventListener("change", saveEmail);

emailInput.addEventListener("input", function () {
  if (rememberEmail.checked) {
    saveEmail();
  }
});

form.addEventListener("submit", checkForm);

addFieldListeners();
form.setAttribute("novalidate", "");
loadSavedChoices();