let matchingUser;

async function init() {
  includeHTML();
  await loadUserHeader();
  checkEmailSummary(users);
}

async function loadUserHeader() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.info("Could not load Users");
  }
}

async function checkEmailSummary() {
  const guestUser = localStorage.getItem("guestUser");
  if (guestUser === "Guest") {
    //document.getElementById("userName").innerHTML = "Guest";
    document.getElementById("user").innerHTML = "<b>G</b>";
  } else {
    const emailToSearch = localStorage.getItem("checkinUser");
    const cleanedEmailToSearch = emailToSearch.replace(/^"(.*)"$/, "$1");
    const lowerCaseEmailToSearch = cleanedEmailToSearch.toLowerCase();
    matchingUser = users.find((user) => {
      return user.email.toLowerCase() === lowerCaseEmailToSearch;
    });
    loadInitialsHeader(matchingUser);
    return;
  }
}
function loadInitialsHeader(matchingUser) {
  const [firstName, lastName] = matchingUser.name.split(" ");
  const firstLetterFirstName = firstName.charAt(0).toUpperCase();
  const firstLetterLastName = lastName.charAt(0).toUpperCase();
  document.getElementById("user").innerHTML =
    firstLetterFirstName + firstLetterLastName;
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  activeMainMenu();
}

function activeMainMenu() {
  let links = document.querySelectorAll(".navBar");
  let subLinks = document.querySelectorAll(".sideBar_footer");
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    link.classList.remove("active_navBar");
  }
  for (let i = 0; i < subLinks.length; i++) {
    let subLink = subLinks[i];
    subLink.classList.remove("active_navBar");
  }
  let url = urlFinder();
  mainMenuTest(url);
}

function urlFinder() {
  let url = window.location.href;
  let res = url.split("/");
  let pos = res.length;
  let result = res[pos - 1];
  return result;
}

function mainMenuTest(url) {
  if (url == "summary.html") {
    document.getElementById("navSummary").classList.add("active_navBar");
  } else if (url == "addTask.html") {
    document.getElementById("navAddTask").classList.add("active_navBar");
  } else if (url == "board.html") {
    document.getElementById("navBoard").classList.add("active_navBar");
  } else if (url == "contacts.html") {
    document.getElementById("navContent").classList.add("active_navBar");
  } else {
    activeSubMenu(url);
  }
}

function activeSubMenu(url) {
  if (url == "privacyPolice.html") {
    document.getElementById("navPolice").classList.add("active_navBar");
  } else if (url == "legalNotice.html") {
    document.getElementById("navNotice").classList.add("active_navBar");
  } else if (url == "privacyPolice_notLoggedIn.html") {
    document.getElementById("navPolice").classList.add("active_navBar");
  } else if (url == "legalNotice_%20notLoggedIn.html") {
    document.getElementById("navNotice").classList.add("active_navBar");
  }
}

function openPopUpNav() {
  let popupNav = document.getElementById("popupNav");
  popupNav.classList.toggle("d_none");
}
