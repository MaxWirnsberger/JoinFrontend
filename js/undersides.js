function goBack() {
    window.history.back();
}

function logOut(){
    sessionStorage.removeItem('welcomeScreenExecuted');
    let pageURL = 'index.html';
    window.location.href = pageURL;
}

  