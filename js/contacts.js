/**
 * Creates some necessary global variables
 */
let contacts = [];
let filterLetters = [];
let activeNameList = [];

/**
 * Initializes some functions after loading the body
 */
async function contactInit() {
  init();
  await loadContacts();
  filterLetter();
}

// ############## Load, Save or Change User Contacts #########################
/**
 * Loads the contacts in the variable "contacts" 
 */
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
    sortNames(contacts);
  } catch (e) {
    console.info("Could not load Contacts");
  }
}

/**
 * Sort the names in alphabetical order
 * 
 * @param {string} contacts 
 */
async function sortNames(contacts) {
  contacts.sort(function (a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

/**
 * Saves contacts when you press the Save button
 */
async function saveContact() {
  createButton.disabled = true;
  let color = Math.floor(Math.random() * 16777215).toString(16);
  contactNameUppercase = capitalizedName(contactName.value);
  pushContacts(contactNameUppercase, contactEmail, contactTel, color);
  await setItem("contacts", JSON.stringify(contacts));
  resetForm();
  filterLetters = [];
  await contactInit();
  saveNotification();
  closeButton();
}

/**
 * pushed new values ​​into existing array "contacts"
 * 
 * @param {string} contactNameUppercase 
 * @param {string} contactEmail 
 * @param {number} contactTel 
 * @param {number} color 
 */
function pushContacts(contactNameUppercase, contactEmail, contactTel, color) {
  contacts.push({
    name: contactNameUppercase,
    email: contactEmail.value,
    tel: contactTel.value,
    color: color,
  });
}

/**
 * Reset all values from Form after save the values
 */
function resetForm() {
  contactName.value = "";
  contactEmail.value = "";
  contactTel.value = "";
  createButton.disabled = false;
}

/**
 * Make sure all names are capitalized
 * 
 * @param {string} Name 
 * @returns capitalized name
 */
function capitalizedName(Name) {
  let FirstName = Name.split(" ")[0];
  let SecondName = Name.split(" ")[1];
  FirstName = FirstName.charAt(0).toUpperCase() + FirstName.slice(1);
  SecondName = SecondName.charAt(0).toUpperCase() + SecondName.slice(1);
  contactNameUppercase = FirstName + " " + SecondName;
  return contactNameUppercase;
}

/**
 * changes the values ​​of the existing contacts
 * 
 * @param {number} id 
 */
async function changeSavedContact(id) {
  contacts[id].name = contactName.value;
  contacts[id].email = contactEmail.value;
  contacts[id].tel = contactTel.value;
  await setItem("contacts", JSON.stringify(contacts));
  filterLetters = [];
  await contactInit();
  showName(id);
  changeNotification();
  closeButton();
}

// ######### Overlayer Functions for Add, delete and Create Contacts #########
/**
 * Closes overlayer when creating new contacts without making any changes
 */
function closeButton() {
  document.getElementById("newContact_bg").classList.add("display_none");
}

/**
 * Calls up some functions that are necessary to create a new contact
 */
function openNewContactDialog() {
  editLeftSideOfOverlayer();
  changeCycleImg();
  createCreateContactForm();
  changeButtonOnCreate();
  document.getElementById("newContact_bg").classList.remove("display_none");
}

/**
 * Changes the values ​​of the left side of the overlayer when the Edit button isn't pressed
 */
function editLeftSideOfOverlayer() {
  document.getElementById("newContactField_left").innerHTML = "";
  document.getElementById("newContactField_left").innerHTML = `
  <a onclick="closeButton()" id="closeResponse">
    <img src="../assets/img/contact_icons/contact_mini_icons/CloseResponse.png"/>
  </a>
  <img class="newContactLogo" src="../assets/img/contact_icons/JoinLogo.png" />
  <h2>Add contact</h2>
  <span>Task are better with a team!</span>
  <hr />`;
}

/**
 * Changes the values ​​in the overlayer's cycle when the Edit button isn't pressed
 */
function changeCycleImg() {
  let cycle = document.getElementById("newContact_cycle");
  cycle.innerHTML = "";
  cycle.style.backgroundColor = "#d1d1d1";
  cycle.innerHTML = `<img src="../assets/img/contact_icons/person.svg" alt="" />`;
}

/**
 * Creates the form for creating new contacts
 */
function createCreateContactForm() {
  document.getElementById("contactForm").innerHTML = "";
  document.getElementById("contactForm").innerHTML = `
  <form id="newContactForm" class="newContactForm" onsubmit="saveContact(); 
    return false;" >
    <input class="input_name" required pattern="[A-Za-zÄäÖöÜüß]+ [A-Za-zÄäÖöÜüß]+" id="contactName"
      type="text" placeholder="Firstname Secondname"/>
    <input class="input_email" required id="contactEmail" type="email"
      placeholder="Email" />
    <input class="input_tel" required id="contactTel" type="number"
      placeholder="Phone" />
    <div class="newContactButtons" id="OverlayerButtons"></div>
  </form>`;
}

/**
 * Creates the necessary buttons when creating new contacts
 */
function changeButtonOnCreate() {
  OverlayerButtons = document.getElementById("OverlayerButtons");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
  <button type="reset" class="cancelButton" id="cancelButton" 
    onclick="closeButton()">
    Cancel
    <img src="../assets/img/contact_icons/contact_mini_icons/iconoir_cancel.svg"/>
  </button>
  <button type="submit" class="createButton" id="createButton">
    Create contact
    <img src="../assets/img/contact_icons/contact_mini_icons/check.svg"/>
  </button>`;
}

/**
 * Opens the dialog to change values ​​of an existing contact
 * 
 * @param {number} id 
 */
function openEditContactDialog(id) {
  let name = contacts[id]["name"];
  let email = contacts[id]["email"];
  let phone = contacts[id]["tel"];
  let color = contacts[id]["color"];
  editLeftSideOfOverlayerForEdit();
  changeCycleId(name, color);
  createChangeContactForm(id);
  fillForm(name, email, phone);
  changeButtonOnEdit(id);
  document.getElementById("newContact_bg").classList.remove("display_none");
}

/**
 * Changes the values ​​of the left side of the overlayer when the Edit button is pressed
 */
function editLeftSideOfOverlayerForEdit() {
  document.getElementById("newContactField_left").innerHTML = "";
  document.getElementById("newContactField_left").innerHTML = `
    <a onclick="closeButton()" id="closeResponse">
      <img src="../assets/img/contact_icons/contact_mini_icons/CloseResponse.png"/>
    </a>
    <img class="newContactLogo" src="../assets/img/contact_icons/JoinLogo.png" alt=""/>
    <h2>Edit contact</h2>
    <hr />`;
}

/**
 * Changes the values ​​in the overlayer's cycle when the Edit button is pressed
 * 
 * @param {string} name 
 * @param {number} color 
 */
function changeCycleId(name, color) {
  let cycle = document.getElementById("newContact_cycle");
  cycle.innerHTML = "";
  cycle.style.backgroundColor = "#" + color;
  cycle.innerHTML = `${initials(name, 0) + initials(name, 1)}`;
}

/**
 * Creates the form for edit an existing contact
 * 
 * @param {number} id 
 */
function createChangeContactForm(id) {
  OverlayerButtons = document.getElementById("contactForm");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
  <form id="newContactForm" class="newContactForm" 
    onsubmit="changeSavedContact(${id}); return false;" >
    <input class="input_name" required pattern="[A-Za-zÄäÖöÜüß]+ [A-Za-zÄäÖöÜüß]+" 
      id="contactName" type="text" placeholder="Firstname Secondname"/>
    <input class="input_email" required id="contactEmail" type="email"
      placeholder="Email" />
    <input class="input_tel" required id="contactTel" type="tel"
      placeholder="Phone" />
    <div class="newContactButtons" id="OverlayerButtons"></div>
  </form>`;
}

/**
 * Changes the values ​​in the created form
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {number} phone 
 */
function fillForm(name, email, phone) {
  document.getElementById("contactName").value = "";
  document.getElementById("contactName").value = name;
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactEmail").value = email;
  document.getElementById("contactTel").value = "";
  document.getElementById("contactTel").value = phone;
}

/**
 * Creates the necessary buttons when eding a contact
 * 
 * @param {number} id 
 */
function changeButtonOnEdit(id) {
  OverlayerButtons = document.getElementById("OverlayerButtons");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
  <button type="reset" class="cancelButton" onclick="deleteContact(${id})"> 
    Delete 
  </button>
  <button type="submit" class="createButton" id="createButton">
    Save
    <img src="../assets/img/contact_icons/contact_mini_icons/check.svg"/>
  </button>`;
}

/**
 * This function is executed when the delete button is pressed and deletes the selected contact
 * 
 * @param {number} id 
 */
async function deleteContact(id) {
  contacts.splice(id, 1);
  await setItem("contacts", JSON.stringify(contacts));
  removeOptionsAfterDelete(id);
  closeButton();
}

/**
 * For some necessary functions when the contact has been deleted
 * 
 * @param {number} id 
 */
function removeOptionsAfterDelete(id) {
  filterLetters = [];
  contactInit();
  showName(id);
  rensponseBackToList();
}

/**
 * Informs users when the new contact has been saved
 */
function saveNotification() {
  let infoMessage = document.getElementById("saveOrChangeNotification");
  infoMessage.innerHTML = "Contact succesfully created";
  infoMessage.style.display = "flex";

  setTimeout(function () {
    infoMessage.style.display = "none";
    infoMessage.textContent = "";
  }, 2000);
}

/**
 * Informs users when the contact has been changend
 */
function changeNotification() {
  let infoMessage = document.getElementById("saveOrChangeNotification");
  infoMessage.innerHTML = "Contact succesfully changed";
  infoMessage.style.display = "flex";

  setTimeout(function () {
    infoMessage.style.display = "none";
    infoMessage.textContent = "";
  }, 2000);
}

// ######################## Event Listener ###################################
/**
 * Opens the Edit Delete menu in response view without listing any further functions
 */
document.addEventListener("DOMContentLoaded", function () {
  let menuButton = document.getElementById("editRemoveButtonResponse");
  let menu = document.getElementById("editDeletOverlay");
  document.addEventListener("click", function (event) {
    if (!menuButton.contains(event.target)) {
      menu.classList.remove("display_flex");
    }
  });
});

/**
 * Changes the settings of some CSS renderings when the screen is wider than 750px
 */
window.addEventListener("resize", function () {
  let screenWidth = window.innerWidth;
  if (screenWidth >= 750) {
    document.getElementById("left_container").classList.remove("display_none");
  } else if (screenWidth <= 750) {
    document.getElementById("editDeletOverlay").classList.remove("display_flex");
    document
      .getElementById("right_container")
      .classList.remove("display_block");
  }
});

