/*jshint esversion: 6 */


// Get the reference to the input field and reminders container
const inputField = document.getElementById("input_field");
const remindersContainer = document.getElementById("reminders_container");

// Variable to keep track of the element being dragged
let draggingElement = null;
// Variable to store the reference to the current alert
let currentAlert = null;


// Function to create a new reminder element
function createReminderElement(text, checked = false) {
  // Create a new list item element and set its HTML content
  const li = document.createElement("li");
  li.innerHTML = `<p>${text}</p><span>\u00d7</span>`;

  // If the reminder is checked, add a CSS class to mark it as checked
  if (checked) {
    li.classList.add("checked");
  }

  // Add and return event listeners to the newly created reminder
  addEventListenersToReminder(li);
  return li;
}


// Function to add event listeners to a reminder element
function addEventListenersToReminder(reminder) {
  // Enable the reminder to be draggable
  reminder.draggable = true;

  // Event listener to handle the start of a drag operation
  reminder.addEventListener("dragstart", function (event) {
    // Store the reference to the dragging element
    draggingElement = event.target;

    // Set data to be transferred during drag-and-drop operation
    event.dataTransfer.setData("text/plain", "");

    // Add a CSS class to indicate that the element is being dragged
    setTimeout(() => {
      event.target.classList.add("dragging");
    }, 0);
  });

  // Event listener to handle the end of a drag operation
  reminder.addEventListener("dragend", function (event) {
    // Reset the dragging element reference
    draggingElement = null;

    // Remove CSS classes related to dragging
    event.target.classList.remove("dragging");
    event.target.classList.remove("highlighted");

    // Save the current state of reminders
    savedReminders();
  });

  // Event listener to handle drag-over events on the reminder
  reminder.addEventListener("dragover", function (event) {
    // Prevent the default drag-over behavior
    event.preventDefault();

    // Find the target list item element being dragged over
    const targetElement = event.target.closest("li");

    if (!targetElement) {
      return;
    }

    // Get the vertical position of the cursor relative to the target element
    const bounding = targetElement.getBoundingClientRect();
    const offset = bounding.y + bounding.height / 2;

    // Determine if the cursor is above or below the center of the target element
    const isAfter = event.clientY > offset;

    // Reorder the reminders based on the cursor position
    const draggingElement = document.querySelector(".dragging");

    if (isAfter) {
      remindersContainer.insertBefore(draggingElement, targetElement.nextElementSibling);
    } else {
      remindersContainer.insertBefore(draggingElement, targetElement);
    }

    // Add a CSS class to highlight the drop position
    draggingElement.classList.add("highlighted");
  });

  // Event listener to handle the click on the delete button
  reminder.querySelector("span").addEventListener("click", function () {
    // Remove the reminder from the DOM
    reminder.remove();

    // Save the current state of reminders
    savedReminders();
  });

  // Event listener to handle the click on the reminder itself
  reminder.addEventListener("click", function (event) {
    // Toggle the checked state of the reminder when clicking on it
    if (event.target.tagName === "LI" || event.target.tagName === "P") {
      reminder.classList.toggle("checked");

      // Save the current state of reminders
      savedReminders();
    }
  });
}


// Function to add a new reminder
function addReminder() {
  const inputValue = inputField.value.trim();

  // If the input value is empty, show an alert and return
  if (inputValue === "") {
    showAlert("You must write something!");
    return;
  }

  // Check if the input value contains only valid characters
  const validInput = /^[a-zA-ZÀ-ÿ\s\d\.,'":!?()/-]*$/.test(inputValue);

  // If the input value contains invalid characters, show an alert and clear the input field
  if (!validInput) {
    showAlert("This character is not allowed!");

    // Clear the input field
    inputField.value = "";
    return;
  }


  // Create a new reminder element with the input value
  const li = createReminderElement(inputValue);
  // Append the reminder to the reminders container
  remindersContainer.appendChild(li);
  // Save the current state of reminders
  savedReminders();

  // Clear the input field after adding the reminder
  inputField.value = "";
}


// Function to save the current state of reminders to local storage
function savedReminders() {
  localStorage.setItem("reminders", remindersContainer.innerHTML);
}


// Function to load reminders from local storage
function loadReminders() {
  // Retrieve saved reminders from local storage
  const savedReminders = localStorage.getItem("reminders");

  // If there are saved reminders, populate the reminders container with them
  if (savedReminders) {
    remindersContainer.innerHTML = savedReminders;

    // Add event listeners to each loaded reminder
    remindersContainer.querySelectorAll("li").forEach(li => {
      addEventListenersToReminder(li);
    });
  }
}


// Function to show a custom alert message
function showAlert(message) {
  // If an alert is already displayed, remove it
  if (currentAlert) {
    currentAlert.remove();
    currentAlert = null;
  }

  // Create a new alert element
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert");
  alertElement.textContent = message;

  // Append the alert to the body
  document.body.appendChild(alertElement);

  // Remove the alert after a certain delay
  const delay = message === "clear" ? 500 : 3000;
  setTimeout(() => {
    alertElement.remove();

    // Reset the reference to the current alert
    if (alertElement === currentAlert) {
      currentAlert = null;
    }
  }, delay);

  // Update the reference to the current alert
  currentAlert = alertElement;
}


// Event listener to add a reminder when the Enter key is pressed
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addReminder();
  } else {
    // If an alert is displayed, remove it
    if (currentAlert) {
      currentAlert.remove();
      currentAlert = null;
    }
  }
});



// Load reminders from local storage when the page is loaded
loadReminders();