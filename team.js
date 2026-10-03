const STORAGE_KEY = "b4u_registrations";
const TEAMS_KEY = "b4u_teams";

const blueTeamList = document.getElementById("blueTeamList");
const redTeamList = document.getElementById("redTeamList");

function getRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Could not read registrations:", error);
    return [];
  }
}

function getSavedTeams() {
  try {
    return JSON.parse(localStorage.getItem(TEAMS_KEY) || "null");
  } catch (error) {
    console.error("Could not read saved teams:", error);
    return null;
  }
}

function shuffle(array) {
  const shuffled = [...array];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}

function createTeams(names) {
  const shuffledNames = shuffle(names);

  const teams = {
    blue: [],
    red: []
  };

  shuffledNames.forEach(function (name, index) {
    if (index % 2 === 0) {
      teams.blue.push(name);
    } else {
      teams.red.push(name);
    }
  });

  return teams;
}

function addPlayer(list, playerName) {
  const item = document.createElement("li");
  item.textContent = playerName;
  list.appendChild(item);
}

function displayTeam(list, players, emptyText) {
  list.innerHTML = "";

  if (players.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-message";
    item.textContent = emptyText;
    list.appendChild(item);
    return;
  }

  players.forEach(function (playerName) {
    addPlayer(list, playerName);
  });
}

function showTeams() {
  const registrations = getRegistrations();

  const names = registrations
    .map(function (registration) {
      return registration.name;
    })
    .filter(function (name) {
      return name && name.trim() !== "";
    });

  if (names.length === 0) {
    displayTeam(
      blueTeamList,
      [],
      "No registered players yet."
    );

    displayTeam(
      redTeamList,
      [],
      "No registered players yet."
    );

    return;
  }

  let teams = getSavedTeams();

  if (!teams) {
    teams = createTeams(names);

    localStorage.setItem(
      TEAMS_KEY,
      JSON.stringify(teams)
    );
  }

  displayTeam(blueTeamList, teams.blue, "No Blue Team players.");
  displayTeam(redTeamList, teams.red, "No Red Team players.");
}

showTeams();
