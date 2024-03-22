let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let todos = 0;
let done = 0;
let urgent = 0;
let inBoard = 0;
let inProgress = 0;
let feedback = 0;


let tasks = [];

/**
 * set the summary status counter to zero
 */
function resetCounters() {
  todos = 0;
  done = 0;
  urgent = 0;
  inBoard = 0;
  inProgress = 0;
  feedback = 0;
}
resetCounters();

async function addToSummary() {
  await updateTaskCounts();
  updateTodoNumber();
}

async function summaryInit() {
  init();
  await loadUser();
  await loadTasks();
  greet();
  addToSummary();
  checkEmailSummary();
  displayEarliestDueDate();
  renderUserName();
}
 
/**
 * load tasks from server
 */
async function loadTasks() {
  tasks = JSON.parse(await getItem("tasks"));
}

/**
 * daytime and display user
 */
function greet() {
  let hour = new Date().getHours();
  let greeting;

  if (hour < 11) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  document.getElementById("demo").innerHTML = greeting;
}

greet();

/**
 * this function displayed the name of the user or the guest
 */
function renderUserName() {
  const guestUser = localStorage.getItem("guestUser");
  if (guestUser === "Guest") {
    document.getElementById("userName").innerHTML = "Guest";
  } else {
    document.getElementById("userName").innerHTML = matchingUser.name;
  }
}

/**
 * count tasks
 */
function countTasksByStatus(status) {
  let count = 0;

  tasks.forEach((tasks) => {
    if (tasks.status === status) {
      count++;

      if (tasks.prio === "urgent") {
        urgent++;
      }
      
    }
  });

  return count;
}

/**
 * 
 * @returns the length of all tasks
 */
function countAllTasks() {
  return tasks.length;
}
/**
 * update the count of tasks
 */
async function updateTaskCounts() {
  todos = countTasksByStatus("todo");
  done = countTasksByStatus("done");
  inBoard = countAllTasks();
  inProgress = countTasksByStatus("inProgress");
  feedback = countTasksByStatus("awaitFeedback");

  const urgentToDoneTasks = tasks.filter(
    (task) => task.prio === "urgent" && task.status === "done"
  );

  urgent -= urgentToDoneTasks.length;
}

/**
 * show the count of tasks
 */
function updateTodoNumber() {
  document.getElementById("todos").innerText = todos;
  document.getElementById("done").innerText = done;
  document.getElementById("urgent").innerText = urgent;
  document.getElementById("inBoard").innerText = inBoard;
  document.getElementById("inProgress").innerText = inProgress;
  document.getElementById("feedback").innerText = feedback;
}

/**
 * if a task had the status urgent, DISPLAY the earliest urgent date
 */ 
function displayEarliestDueDate() {
  const earliestTask = findEarliestDueDate(tasks);
  const hasUndoneUrgentTasks = tasks.some(task => task.prio === "urgent" && task.status !== "done");

  if (!earliestTask || !hasUndoneUrgentTasks) {
    document.getElementById("date").innerHTML = "No Urgent tasks found.";
  } else {
    const earliestDate = new Date(
      earliestTask.date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1")
    );
    const monthIndex = earliestDate.getMonth();
    const month = months[monthIndex];
    const formattedDate = `${month} ${earliestDate.getDate()}, ${earliestDate.getFullYear()}`;

    document.getElementById("date").innerHTML = formattedDate;
  }
}

/**
 * if a task had the status urgent, FIND the earliest urgent date
 */
function findEarliestDueDate(tasks) {
  const urgentTasks = tasks.filter((tasks) => tasks.prio === "urgent");

  if (urgentTasks.length === 0) {
    return null;
  }

  return urgentTasks.reduce((earliest, current) => {
    const currentDate = new Date(
      current.date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1")
    );
    const earliestDate = new Date(
      earliest.date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1")
    );
    return currentDate < earliestDate ? current : earliest;
  }, urgentTasks[0]);
}
findEarliestDueDate(tasks);

/**
 * display name after login
 */ 
function welcomeMobile() {
  document.addEventListener("DOMContentLoaded", function () {
    if (
      !sessionStorage.getItem("welcomeScreenExecuted") &&
      window.innerWidth <= 750
    ) {
      showWelcomeScreen();
      sessionStorage.setItem("welcomeScreenExecuted", "true");
    } else {
      let welcomeOverlayer = document.querySelector(".welcomeOverlayer");
      welcomeOverlayer.classList.add("d-none");
    }
  });


  /**
   * hide the welcome screen after login (only in the mobile view)
   */
function showWelcomeScreen() {
    let welcomeOverlayer = document.querySelector(".welcomeOverlayer");

    setTimeout(function () {
      if (welcomeOverlayer) {
        welcomeOverlayer.style.opacity = "0";
        setTimeout(function () {
          welcomeOverlayer.classList.add("d-none");
        }, 500);
      }
    }, 2000);
  }
}

welcomeMobile();
