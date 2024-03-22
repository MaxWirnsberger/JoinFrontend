// ################## Button and Design funktions ############################
/**
 * This function is used to create contact informations on the right side.
 *
 * @param {number} id - This id is the position of the Elements name
 */
function showName(id) {
    removeActiveName();
    addORremoveActiveName(id);
    renderContactInformation(id);
    responseTestToOpenWindow(id);
  }
  
  /**
   * Remove the highlight options when another contact is pressed
   */
  function removeActiveName() {
    for (let i = 0; i < activeNameList.length; i++) {
      let activeElement = activeNameList[i];
      document.getElementById(activeElement).classList.remove("activeName");
    }
  }
  
  /**
   * Added the highlight options when contact is pressed
   * 
   * @param {number} id 
   */
  function addORremoveActiveName(id) {
    let markedElement = document.getElementById(`name` + id);
    if (activeNameList.includes(`name` + id)) {
      removeAllActiveElements(markedElement);
    } else {
      markedElement.classList.add("activeName");
      document.getElementById("contact_overview").classList.add("display_flex");
      activeNameList = [];
      activeNameList.push(`name${id}`);
    }
  }
  
  /**
   * Remove all highlight options on contacts
   * 
   * @param {string} markedElement 
   */
  function removeAllActiveElements(markedElement) {
    markedElement.classList.remove("activeName");
    document.getElementById("contact_overview").classList.remove("display_flex");
    activeNameList = [];
  }
  
  /**
   * This feature ensures that the list of contacts is displayed when the screen is smaller than 750px
   * 
   * @param {number} id 
   */
  function responseTestToOpenWindow(id) {
    let screenWidth = window.innerWidth;
    if (screenWidth <= 750) {
      document.getElementById("contact_overview").classList.add("display_flex");
      openRensponse(id);
    }
  }
  
  /**
   * Executed on the responseTestToOpenWindow() function
   */
  function openRensponse() {
    document.getElementById("left_container").classList.add("display_none");
    document.getElementById("right_container").classList.add("display_block");
  }
  
  /**
   * Ensures that the display changes back to the list
   */
  function rensponseBackToList() {
    document.getElementById("left_container").classList.remove("display_none");
    document.getElementById("right_container").classList.remove("display_block");
    removeActiveName();
    activeNameList = [];
  }
  
  /**
   * Creates a summary, storing the first letter of a name in a list
   */
  function filterLetter() {
    for (let i = 0; i < contacts.length; i++) {
      let contact = contacts[i]["name"];
      let letter = contact.charAt(0);
      appendLetter(letter);
    }
    renderContacts();
  }
  
  /**
   * Calls some functions to display the names of contacts in a list
   */
  function renderContacts() {
    document.getElementById("contact_List").innerHTML = "";
    for (let i = 0; i < filterLetters.length; i++) {
      let firstLetter = filterLetters[i];
      document.getElementById("contact_List").innerHTML += `
          <div class="first_Latter">${firstLetter}</div>
          <hr class="name_Seperator" />
          <div id="contact_Users(${firstLetter})"></div>`;
      filterContactNames(firstLetter);
    }
  }
  
  /**
   * Pushed first Letter of Name if the letter does not yet exist
   * 
   * @param {string} letter 
   */
  function appendLetter(letter) {
    let i = filterLetters.indexOf(letter);
    if (i < 0) {
      filterLetters.push(letter);
    }
  }
  
  /**
   * Filters the contact list based on the first letters
   * 
   * @param {string} letter 
   */
  function filterContactNames(letter) {
    letter = letter.toLowerCase();
    for (let i = 0; i < contacts.length; i++) {
      let name = contacts[i]["name"];
      let email = contacts[i]["email"];
      let color = contacts[i]["color"];
      if (name.toLowerCase().charAt(0).includes(letter)) {
        renderContactNames(i, name, email, color);
      }
    }
  }
  
  /**
   * Renders the contact names in the list
   * 
   * @param {number} i 
   * @param {string} name 
   * @param {string} email 
   * @param {number} color 
   */
  function renderContactNames(i, name, email, color) {
    document.getElementById(
      `contact_Users(${initials(name, 0)})`
    ).innerHTML += `<div class="centersizer">
      <div onclick="showName(${i})" id="name${i}" class="name_contant">
          <div class="nameIcon_leftContainer" style=background-color:#${color}>${
      initials(name, 0) + initials(name, 1)
    }</div>
              <div>
                  <div class="name_leftContainer">${name}</div>
                  <div class="email_leftContainer">${email}</div>
              </div>
          </div>
      </div>`;
  }
  
  /**
   * creates initials of names
   * 
   * @param {string} name 
   * @param {number} position 
   * @returns 
   */
  function initials(name, position) {
    let nameArray = name.split(" ");
    return nameArray[position].charAt(0);
  }
  
  /**
   * Renders the detailed information of a contact by calling various functions
   * 
   * @param {number} id 
   */
  function renderContactInformation(id) {
    if (id >= 0 && id < contacts.length) {
      let name = contacts[id]["name"];
      let color = contacts[id]["color"];
      renderBigCircle(name, color);
      document.getElementById("name_rightContainer").innerHTML = name;
      renderEditDelete(id);
      renderResponseEditDelete(id);
      renderEmail(id);
      renderPhone(id);
    }
  }
  
  /**
   * Creates the contact's cycle in the detailed information
   * 
   * @param {string} name 
   * @param {number} color 
   */
  function renderBigCircle(name, color) {
    document.getElementById("big_circle").innerHTML = "";
    document.getElementById("big_circle").style.backgroundColor = "#" + color;
    document.getElementById("big_circle").innerHTML +=
      initials(name, 0) + initials(name, 1);
  }
  
  /**
   * Creates the Edit and Delete buttons in the detailed information
   * 
   * @param {number} id 
   */
  function renderEditDelete(id) {
    document.getElementById("edit_delete").innerHTML = "";
    document.getElementById("edit_delete").innerHTML = `
      <a onclick="openEditContactDialog(${id})">
          <img src="../assets/img/contact_icons/edit.svg"
          alt="Edit Icon"/>Edit
      </a>
      <a onclick="deleteContact(${id})">
          <img src="../assets/img/contact_icons/delete.svg"
          alt="Delete Icon"/>Delete
      </a>`;
  }
  
  /**
   * Creates the Edit and Delete button in the detail information when the response view is active
   * 
   * @param {number} id 
   */
  function renderResponseEditDelete(id) {
    document.getElementById("editDeletOverlay").innerHTML = "";
    document.getElementById("editDeletOverlay").innerHTML = `
    <button onclick="openEditContactDialog(${id})" class="editDeletOverlayButton">
      <img class="editDeletOverlayIMG" src="../assets/img/contact_icons/edit.svg"/>
        Edit
    </button>
    <button onclick="deleteContact(${id})" class="editDeletOverlayButton">
      <img class="editDeletOverlayIMG" src="../assets/img/contact_icons/delete.svg"
      onclick=""/>
        Delete
    </button>`;
  }
  
  /**
   * Opens the Delete and Edit buttons in Response view
   */
  function showEditDeletOverlayButton() {
    document.getElementById("editDeletOverlay").classList.add("display_flex");
  }
  
  /**
   * Render email address in the detailed information
   * 
   * @param {number} id 
   */
  function renderEmail(id) {
    let email = contacts[id]["email"];
    document.getElementById("email_rightContainer").innerHTML = "";
    document.getElementById("email_rightContainer").innerHTML = `
      <span>Email</span>
      <a href="mailto:${email}?subject=Feedback&body=Message">
          ${email}
      </a>`;
  }
  
  /**
   * Render phone number in the detailed information
   * 
   * @param {number} id 
   */
  function renderPhone(id) {
    let tel = contacts[id]["tel"];
    document.getElementById("phone_rightContainer").innerHTML = "";
    document.getElementById("phone_rightContainer").innerHTML = `
      <span>Email</span>
      <a href="mailto:${tel}?subject=Feedback&body=Message">
          ${tel}
      </a>`;
  }