/**
 * This function is used to open the signUp.html
 */
function openSignUpWindow(){ /**LOGIN */
    sessionStorage.clear('SignUp');
    let pageURL = 'signUp.html';
    window.location.href = pageURL;
}


/**
 * This function opens a page
 */
function openSummary(){
    let pageURL = 'summary.html';
    window.location.href = pageURL;
}


/**
* This function opens, saves the current page and opens a new tab
* @param {string} url 
*/
function openNewTab(url) {
    sessionStorage.setItem('previousPage', window.location.href);
    window.open(url, '_blank');
}


/**
 * This function is used to log in as a guest
 */
function guestLogIn(){
    emailLogIn.value = '';
    localStorage.removeItem('checkinUser');
    localStorage.setItem('guestUser', 'Guest');
    sessionStorage.clear('SignUp');
    openSummary();
}


/**
* This function changes the image and type of the input field after something has been written into it
* @param {HTMLElement} img 
* @param {HTMLElement} input 
*/
function changeInputTypeToPassword(img, input){
    img.src = "../assets/img/signUp_icons/lock.png";
    input.type = "password";
}


/**
* This function changes the image and type of the input field
* @param {HTMLElement} input 
* @param {HTMLElement} img 
*/
function hidePassword(input, img) {
    input.type = "password";
    img.src = "../assets/img/signUp_icons/hidePassword.png";
    img.onclick = function () {
        showPassword(input, img);
    };
}
  
  
/**
* This function changes the image and type of the input field
* @param {HTMLElement} input 
* @param {HTMLElement} img 
*/
function showPassword(input, img) {
    input.type = "text";
    img.src = "../assets/img/signUp_icons/showPassword.png";
    img.onclick = function () {
        hidePassword(input, img);
  };
}