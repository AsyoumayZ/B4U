 const STORAGE_KEY = "b4u_registrations";

    const loginSection = document.getElementById("loginSection");
    const phoneInput = document.getElementById("phone");
    const loginButton = document.getElementById("loginButton");
    const loginMessage = document.getElementById("loginMessage");

    const identity = document.getElementById("identity");
    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = document.getElementById("input");

    let currentUser = null;

    function getRegistrations() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      } catch (error) {
        console.error("Could not read registration storage:", error);
        return [];
      }
    }

    function normalizePhone(value) {
      return value.replace(/\D/g, "");
    }

    function findRegistration(phone) {
      const target = normalizePhone(phone);
      return getRegistrations().find(function (registration) {
        return normalizePhone(registration.phone || "") === target;
      });
    }

    function startChat(registration) {
      currentUser = registration;

      identity.textContent =
        `Signed in as ${registration.name} (${registration.phone})`;

      loginSection.classList.add("hidden");
      identity.classList.remove("hidden");
      messages.classList.remove("hidden");
      form.classList.remove("hidden");

      input.focus();
    }

    loginButton.addEventListener("click", function () {
      const phone = phoneInput.value.trim();
      const registration = findRegistration(phone);

      if (!phone) {
        loginMessage.textContent = "Please enter your phone number.";
        return;
      }

      if (!registration) {
        loginMessage.textContent = "No registration found for this phone number.";
        return;
      }

      loginMessage.textContent = "";
      startChat(registration);
    });

    phoneInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        loginButton.click();
      }
    });

    function getLocation() {
      return new Promise(function (resolve) {
        if (!navigator.geolocation) {
          resolve("Location unavailable");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          function (position) {
            const lat = position.coords.latitude.toFixed(5);
            const lon = position.coords.longitude.toFixed(5);
            resolve(`${lat}, ${lon}`);
          },
          function () {
            resolve("Location not allowed");
          },
          { timeout: 8000 }
        );
      });
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const text = input.value.trim();
      if (!text || !currentUser) return;

      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      const location = await getLocation();

      const div = document.createElement("div");
      div.className = "message";

      const meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent =
        `${currentUser.name} • ${currentUser.phone} • ${time} • ${location}`;

      div.appendChild(meta);
      div.appendChild(document.createTextNode(text));

      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;

      input.value = "";
      input.focus();
    });