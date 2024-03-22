let users = [];
let currentUser = [];


/**
 * This function is started when the index.html has finished loading
 * @param {Array} currentUser
 */
async function initLogIn(){ 
    await loadUser();
    showLastUser(currentUser);
}


/**
* This function loads the current users from the users array
*/
async function loadUser(){ 
  try{
  users = JSON.parse(await getItem('users'));
  } catch(e){
      console.info('Could not load Users')
  }
}


/**
 * This function is used to load the last sign up or log in user 
 */
function showLastUser() {
  let data = sessionStorage.getItem("SignUp");
  const logInEmailInput = document.getElementById("emailLogIn");
  const logInPasswordInput = document.getElementById("passwordLogIn");
  if (data == "2") {
    showLastLogInUser(logInEmailInput, logInPasswordInput);
  }
  if (data == 1) {
    showLastSignUpUser(logInEmailInput, logInPasswordInput);
  }
  checkInputLogIn();
}


/**
 * Loads the last logged in user if they clicked the remember-me checkbox
 * @param {HTMLElement} logInEmailInput 
 * @param {HTMLElement} logInPasswordInput 
 */
function showLastLogInUser(logInEmailInput, logInPasswordInput) {
  let lastLogInUser = localStorage.getItem("checkinUser");
  let lastLogInPassword = localStorage.getItem("checkinPassword");
  logInEmailInput.value = lastLogInUser.replace(/"/g, "").trim();
  logInPasswordInput.value = lastLogInPassword.replace(/"/g, "").trim();
}


/**
 * Loads the last sign up user 
 * @param {HTMLElement} logInEmailInput 
 * @param {HTMLElement} logInPasswordInput 
 */
function showLastSignUpUser(logInEmailInput, logInPasswordInput){
  let currentData = localStorage.getItem("currentUser");
    if (currentData) {
      const currentUserArray = JSON.parse(currentData);
      if (currentUserArray.length > 0) {
        const lastUser = currentUserArray[currentUserArray.length - 1];
        logInEmailInput.value = lastUser.currentEmail;
        logInPasswordInput.value = lastUser.currentPassword;
      }
    }
}


/**
 * This function is used to check the content of the input field and, if necessary, converts the image and type of input
 */
function checkInputLogIn() { 
    let inputIds = ["passwordLogIn"];
    let imgIds = ["passwordLogInImg"];
    inputIds.forEach((inputId, index) => {
      let input = document.getElementById(inputId);
      let img = document.getElementById(imgIds[index]);
      if (input.value.trim() !== "") {
        if(input.type === 'text'){
          img.src = "../assets/img/signUp_icons/showPassword.png";
        }else{
        input.type = "password";
        img.src = "../assets/img/signUp_icons/hidePassword.png";
        img.onclick = function () {
          hidePassword(input, img);
        }};
      } else {
        changeInputTypeToPassword(img, input);
      }
    });
}


/**
 * This function is used to check the email with the password and possibly sets an error message
 */
function logInUser() {
    localStorage.removeItem("guestUser");
    event.preventDefault();
    let { passwordErrorDiv, emailErrorDiv } = setVariablesForLogInInput();
    let checkbox = document.getElementById('remember-me');
    removeClasslistFromInputDivRedBorderLogIn();
    clearErrorDiv(passwordErrorDiv, emailErrorDiv);
    const emailInput = document.getElementById("emailLogIn").value;
    const passwordInput = document.getElementById("passwordLogIn").value;
    const foundPassword = findPasswordByEmail(users, emailInput);
    if (foundPassword !== "E-Mail nicht gefunden") {
      if (foundPassword === passwordInput) {
        localStorage.setItem("checkinUser", JSON.stringify(emailInput));
        localStorage.setItem("checkinPassword", JSON.stringify(foundPassword));
        sessionStorage.clear('SignUp');
        if(checkbox.checked){
          sessionStorage.setItem('SignUp', 2);
        }
        openSummary();
      } else {
        passwordErrorDiv = setPasswordAlertLogIn(passwordErrorDiv);
      }
    } else {
      emailErrorDiv = setEmailAlertLogIn(emailErrorDiv);
    }
}


/**
 * This function links the id's to the variables
 * @param {HTMLElement} passwordErrorDiv
 * @param {HTMLElement} emailErrorDiv
 */ 
function setVariablesForLogInInput(){
  let passwordErrorDiv = document.getElementById('passwordErrorMessageLogIn');
  let emailErrorDiv = document.getElementById('emailErrorMessageLogIn');
  return { passwordErrorDiv, emailErrorDiv };
}


/**
 * This function removes the css class of the objects
 */
function removeClasslistFromInputDivRedBorderLogIn(){
  document.getElementById('inputDivRedBorderLogInPassword').classList.remove('check-password-red-border');
  document.getElementById('inputDivRedBorderLogInEmail').classList.remove('check-password-red-border');
}


/**
 * This function clears the input fields
 * @param {HTMLElement} passwordErrorDiv 
 * @param {HTMLElement} emailErrorDiv 
 */
function clearErrorDiv(passwordErrorDiv, emailErrorDiv){
  passwordErrorDiv.innerHTML = '';
  emailErrorDiv.innerHTML = '';
}


/**
 * This function looks for the password for the user
 * @param {Array} users 
 * @param {HTMLInputElement} emailToCheck 
 * @returns 
 */
function findPasswordByEmail(users, emailToCheck) {
  for (const user of users) {
    if (user.email === emailToCheck) {
      return user.password;
    }
  }
  return "E-Mail nicht gefunden";
}


/**
 * This function sets an error message if an incorrect password is used
 * @param {HTMLElement} passwordErrorDiv 
 */
function setPasswordAlertLogIn(passwordErrorDiv){
  passwordErrorDiv.innerHTML = 'Wrong password Ups! Try again.';
  document.getElementById('inputDivRedBorderLogInPassword').classList.add('check-password-red-border');
}


/**
 * This function sets an error message if an incorrect email is used
 * @param {HTMLElement} emailErrorDiv 
 */
function setEmailAlertLogIn(emailErrorDiv){
  emailErrorDiv.innerHTML = 'Wrong Email Ups! Try again.';
  document.getElementById('inputDivRedBorderLogInEmail').classList.add('check-password-red-border');
}


/**
 * This function is started when the signUp.html has finished loading
 */
async function initSignUp(){
  await loadUser();
}


/**
* This function compares the entered email with the existing emails in the users array
* @param {Array} users 
* @param {HTMLInputElement} emailToSearch 
* @returns 
*/
function checkEmail(users, emailToSearch) {
  for (const user of users) {
    if (user.email === emailToSearch) {
      return true;
    }
  }
  return false;
}


async function userSignUp() {
  let {emailErrorDiv,passwordErrorDiv,emailToSearch,checkbox,checkboxErrorDiv} = setVariablesForSignUp();
  removeRedBorderClassList();
  emptyErrorDivText(emailErrorDiv, passwordErrorDiv);
  if (checkEmail(users, emailToSearch.value)) {
    emailErrorDiv = setEmailAlertSignUp(emailErrorDiv);
  } else {
    if (password.value === checkPassword.value) {
      if(checkbox.checked){
        await succesSignUp();
      }else{
        checkboxErrorDiv = setCheckBoxAlertSignUp(checkboxErrorDiv);
      }
    } else {
      passwordErrorDiv = setPasswordAlertSignUp(passwordErrorDiv);
    }
  }
  sessionStorage.setItem('SignUp', 1);
}


/**
 * This function links the id's to the variables
 */
function setVariablesForSignUp() {
  let emailErrorDiv = document.getElementById("emailErrorMessageSignUp");
  let passwordErrorDiv = document.getElementById("passwordErrorMessageSignUp");
  let emailToSearch = document.getElementById("email");
  let checkbox = document.getElementById("accept-privacy-police");
  let checkboxErrorDiv = document.getElementById("checkboxErrorMessageSignUp");
  return {
    emailErrorDiv: emailErrorDiv,
    passwordErrorDiv: passwordErrorDiv,
    emailToSearch: emailToSearch,
    checkbox: checkbox,
    checkboxErrorDiv: checkboxErrorDiv,
  };
}


/**
 * This function is started after the required input fields have been successfully and correctly filled out
 */
async function succesSignUp(){
  signUpButton.disabled = true;
  pushIntoUsers();
  await setItem("users", JSON.stringify(users));
  deleteCurrentUser();
  pushIntoCurrentUser();
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  keyframeAnimationSignUp();
  loadIndex();
  resetForm();
}
/**
* This function removes the css class of the objects
*/
function removeRedBorderClassList(){
  document.getElementById('inputEmailDivRedBorderSignUp').classList.remove('check-password-red-border');
  document.getElementById('inputPasswordDivRedBorderSignUp').classList.remove('check-password-red-border');
}


/**
* This function clears the input fields
* @param {HTMLElement} emailErrorDiv 
* @param {HTMLElement} passwordErrorDiv 
*/
function emptyErrorDivText(emailErrorDiv, passwordErrorDiv){
  emailErrorDiv.innerHTML = '';
  passwordErrorDiv.innerHTML = '';
  emailErrorDiv.innerHTML = '';
}


/**
* This function sets an error message if the checkbox was not clicked
* @param {HTMLElement} checkboxErrorDiv 
* @returns 
*/
function setCheckBoxAlertSignUp(checkboxErrorDiv){
  checkboxErrorDiv.innerHTML = 'Ups! Please accept the Privacy Policy.';
  return checkboxErrorDiv;
}


/**
* This function sets an error message if the email is already taken
* @param {HTMLElement} emailErrorDiv 
* @returns 
*/
function setEmailAlertSignUp(emailErrorDiv){
  emailErrorDiv.innerHTML = 'Ups! Diese Email ist schon vergeben.';
  document.getElementById('inputEmailDivRedBorderSignUp').classList.add('check-password-red-border');
  return emailErrorDiv;
}


/**
* This function transfers the data specified during registration into the users array
*/
function pushIntoUsers() {
  users.push({
    name: userName.value,
    email: email.value,
    password: password.value,
    confirmPassword: checkPassword.value,
  });
}


/**
* This function deletes the current user in the currentUser array
*/
function deleteCurrentUser(){
  while (currentUser.length > 0) {
    currentUser.pop(); 
  }
}


/**
* This function transfers the email and password to the currentUser array after successful registration
*/
function pushIntoCurrentUser(){
  currentUser.push({
      currentEmail: email.value,
      currentPassword: password.value,
  });
}


/**
* This function starts the keyframe animation after a successful registration
*/
function keyframeAnimationSignUp(){
  document.getElementById('body').classList.add('succes-sign-up');
  document.getElementById('keyframeSignUp').classList.add('start-animation');
}


/**
* This function opens the index.html after successful registration
*/
function loadIndex(){
  setTimeout(function() {
      let pageURL = 'index.html';
      window.location.href = pageURL;
  }, 2000);
}


/**
* This function resets the input fields after successful registration
*/
function resetForm(){
  userName.value = '';
  email.value = '';
  password.value = '';
  checkPassword.value = '';
  signUpButton.disabled = false;
}


/**
* This function sets an error if the passwords do not match
* @param {HTMLElement} passwordErrorDiv 
*/
function setPasswordAlertSignUp(passwordErrorDiv){
  passwordErrorDiv.innerHTML = 'Ups! your password dont match';
  document.getElementById('inputPasswordDivRedBorderSignUp').classList.add('check-password-red-border');
}


/**
* This function checks whether something has been written in the password input fields and changes the type and image if desired
*/
function checkInputSignUp() {
  let inputIds = ["password", "checkPassword"];
  let imgIds = ["passwordInputImg", "checkPasswordInputImg"];
  inputIds.forEach((inputId, index) => {
    let input = document.getElementById(inputId);
    let img = document.getElementById(imgIds[index]);
    if (input.value.trim() !== "") {
      if(input.type === 'text'){
        img.src = "../assets/img/signUp_icons/showPassword.png";
      }else{
      input.type = "password";
      img.src = "../assets/img/signUp_icons/hidePassword.png";
      img.onclick = function () {
        hidePassword(input, img);
      }};
    } else {
      changeInputTypeToPassword(img, input);
    }
  });
}