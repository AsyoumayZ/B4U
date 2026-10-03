const STORAGE_KEY = "b4u_registrations";

const registrationForm = document.getElementById("registrationForm");
const registrationMessage = document.getElementById("registrationMessage");

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    registrationMessage.textContent =
      "Please enter your name and phone number.";
    return;
  }

  let registrations = [];

  try {
    registrations = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
  } catch (error) {
    console.error("Could not read registration storage:", error);
  }

  registrations.push({
    name: name,
    phone: phone,
    date: new Date().toISOString()
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(registrations)
  );

  registrationForm.reset();
  registrationMessage.textContent = "Registration saved. Thank you!";
});
