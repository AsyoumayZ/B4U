const STORAGE_KEY = "b4u_registrations";

const listElement = document.getElementById("registrationList");
const logoutButton = document.getElementById("logoutButton");
const clearRegistrationsButton = document.getElementById(
  "clearRegistrationsButton"
);

const isLoggedIn = sessionStorage.getItem("b4u_loggedIn") === "true";

if (!isLoggedIn) {
  // The user has not logged in, so return to the login page.
  window.location.replace("login.html");
} else {
  showRegistrations();
}

function getRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Could not read registrations:", error);
    return [];
  }
}

function showRegistrations() {
  const registrations = getRegistrations();

  listElement.innerHTML = "";

  if (registrations.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No registrations have been saved yet.";
    listElement.appendChild(item);
    return;
  }

  registrations.forEach(function (registration, index) {
    const item = document.createElement("li");

    const name = document.createElement("span");
    name.className = "person-name";
    name.textContent = registration.name || "No name";

    const phone = document.createElement("span");
    phone.className = "phone";
    phone.textContent = "Phone: " + (registration.phone || "Not provided");

    const date = document.createElement("span");
    date.className = "date";

    const registeredDate = new Date(registration.date);

    date.textContent = Number.isNaN(registeredDate.getTime())
      ? "Registered: Unknown date"
      : "Registered: " + registeredDate.toLocaleString();

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-registration";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      const confirmed = window.confirm(
        `Delete registration for ${registration.name || "this person"}?`
      );

      if (!confirmed) {
        return;
      }

      const updatedRegistrations = getRegistrations();

      updatedRegistrations.splice(index, 1);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedRegistrations)
      );

      showRegistrations();
    });

    item.append(name, phone, date, deleteButton);
    listElement.appendChild(item);
  });
}

clearRegistrationsButton.addEventListener("click", function () {
  const confirmed = window.confirm(
    "Are you sure you want to permanently delete all registrations?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  showRegistrations();
});

logoutButton.addEventListener("click", function () {
  sessionStorage.removeItem("b4u_loggedIn");
  window.location.href = "login.html";
});
