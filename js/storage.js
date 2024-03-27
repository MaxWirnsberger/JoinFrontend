let CURRENT_URL = "http://127.0.0.1:8000";
let USER_TOKEN = "";

async function registeredUser(emailErrorDiv) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    email: email.value,
    first_name: firstname.value,
    last_name: lastname.value,
    password: password.value,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    let resp = await fetch(CURRENT_URL + "/singup/", requestOptions);
    let answer = await resp.json();
    if (answer.message === "User created successfully") {
      successSignUp();
    } else if (answer.message === "This email already exists") {
      setEmailAlertSignUp(emailErrorDiv);
    }
  } catch (e) {
    console.error(e);
  }
}

async function loginWithEmailandPassword(emailInput, passwordInput) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({ username: emailInput, password: passwordInput });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    let resp = await fetch(CURRENT_URL + "/login/", requestOptions);
    let json = await resp.json();
    localStorage.setItem("token", json.token);
    openSummary();
  } catch (e) {
    console.error(e);
  }
}

function checkLogin() {
  USER_TOKEN = localStorage.getItem("token");
  if (USER_TOKEN === null || USER_TOKEN === "undefined") {
    let pageURL = "index.html";
    window.location.href = pageURL;
  }
}

function logOut() {
  sessionStorage.removeItem("welcomeScreenExecuted");
  logOutFromDB();
  let pageURL = "index.html";
  window.location.href = pageURL;
}

async function logOutFromDB() {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${USER_TOKEN}`);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    await fetch(CURRENT_URL + "/logout/", requestOptions);
    localStorage.removeItem("token");
  } catch (e) {
    console.error(e);
  }
}

async function getUser() {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${USER_TOKEN}`);
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    const resp = await fetch(CURRENT_URL + "/user-data/", requestOptions);
    const data = await resp.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function getTasks() {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${USER_TOKEN}`);
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    const resp = await fetch(CURRENT_URL + "/tasks/", requestOptions);
    const data = await resp.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function updateTask(task, id) {
  if (id != undefined) {
    const taskToUpdate = task.find((element) => element.id === id);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${USER_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");
    debugger
    const raw = JSON.stringify(taskToUpdate);
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      const resp = await fetch(`${CURRENT_URL}/tasks/${id}/`, requestOptions);
      const data = await resp.json();
      return data;
    } catch (e) {
      console.error(e);
    }
  }
}

async function deleteSubtaskFromDB(id) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${USER_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");
  const raw = "";
  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    const response = await fetch(`${CURRENT_URL}/subtasks/${id}/`, requestOptions);
    const result = await response.json();
    console.error(result);
  } catch (error) {
    console.error(error);
  };
}
