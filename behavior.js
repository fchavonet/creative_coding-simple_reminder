/*jshint esversion: 6 */


// Get the reference to the input field and reminders container
const inputField = document.getElementById("input_field");
const remindersContainer = document.getElementById("reminders_container");

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
  const li = createReminderElement(inputValue);
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


// Event listener to add a reminder when the Enter key is pressed
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addReminder();
  }
});



// Load reminders from local storage when the page is loaded
loadReminders();