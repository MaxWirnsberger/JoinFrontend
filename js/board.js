/**
 * initiates functions in board, which are triggered when loading
 */
async function boardInit() {
  init();
  await loadTasks();
  valueAppender();
  saveFunction();
  await getContacts();
  renderContacts();
}

/**
 * When this function is called, it triggers some additional functions that are necessary when saving the values
 */
async function saveFunction() {
  setIdFunction();
  await setItem("tasks", JSON.stringify(tasks));
  filterStatus();
  renderCards();
}

// ####################### Filter Cards on Status ######################
/**
 * Creates some parameters that are needed globally
 */
let todos = [];
let inProgress = [];
let feedback = [];
let done = [];
let currentDraggedElement;
let currentMenuOpen = "";
let statusCheck = "todo";
let wasSubmenuOpen = false;

/**
 * This function assigns an ID to all tasks
 */
function setIdFunction() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    task.id = i;
  }
}

/**
 * This function divides the tasks into different categories
 */
function filterStatus() {
  todos = tasks.filter((task) => task["status"] == "todo");
  inProgress = tasks.filter((task) => task["status"] == "inProgress");
  awaitFeedback = tasks.filter((task) => task["status"] == "awaitFeedback");
  done = tasks.filter((task) => task["status"] == "done");
}

// ###################### Append Values in Tasks #######################
/**
 * This function checks whether SubTasks exist and whether they were already known before the last call was saved.
 * If distinctions were found, the function calcValuesToAppend is called
 */
async function valueAppender() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let testSum = task["subtask"].length;
    if ("progressValue" in task && task.progressSum != testSum) {
      let difference = task.progressSum - testSum;
      calcValuesToAppend(task, difference);
    } else if ("progressValue" in task && task["progressValue"].length > 0) {
    } else {
      task.progressValue = [];
      task.progressSum = 0;
      difference = 0;
      calcValuesToAppend(task, difference);
    }
  }
}

/**
 * Depending on whether distinctions were found in the valueAppender function. New values ​​are added or deleted here
 *
 * @param {Array} task
 * @param {number} difference
 */
function calcValuesToAppend(task, difference) {
  let subtasks = task["subtask"];
  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      task.progressValue.push(0);
    }
    task.progressSum = subtasks.length;
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      task.progressValue.splice(subtasks.length, 1);
    }
    task.progressSum = subtasks.length;
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      task.progressValue.push(0);
    }
    task.progressSum = subtasks.length;
  }
}

// ########################## Delete and Edit ##########################
/**
 * This function is executed when you click on the Delete button and deletes the task with the number ID
 *
 * @param {number} id
 */
async function deleteTask(id) {
  tasks.splice(id, 1);
  closeCardDetails();
  saveFunction();
}

/**
 * Opens the overlayer to change the desired ID
 *
 * @param {number} id
 */
async function editTask(id) {
  taskOnEdit = id;
  closeCardDetails();
  openEditContactDialog(id);
  document.getElementById("addTaskOverlay").classList.remove("d_none");
}

/**
 * Changes the execute button in the overlayer if the editTask() function was previously listed
 */
function changeTaskButtonOnEdit() {
  OverlayerButtons = document.getElementById("createButton");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
    <button class="createBtn d_flex" type="submit">
          <span>Save Task</span>
          <img src="../assets/img/addTask_icons/check.png" />
    </button>`;
}

/**
 * Changes the button to the normal state when a new task is created
 */
function changeButtonToRegularAddTask() {
  OverlayerButtons = document.getElementById("createButton");
  OverlayerButtons.innerHTML = "";
  OverlayerButtons.innerHTML = `
    <div class="clearBtn d_flex" onclick="clearInput()">
        <span>Clear</span>
        <img src="../assets/img/addTask_icons/cancel.png" />
    </div>
    <button class="createBtn d_flex" type="submit">
        <span>Create Task</span>
        <img src="../assets/img/addTask_icons/check.png" />
    </button>`;
}

/**
 * This function makes the Category output more beautiful
 *
 * @param {string} category
 * @returns A nice version of the category
 */
function prettyCategory(category) {
  if (category == "user_story") {
    return "User Story";
  } else {
    return "Technical Task";
  }
}

/**
 * This function fills the shape with the contents of the current card so that they can be changed
 *
 * @param {string} titel
 * @param {string} description
 * @param {Array} assignedToEdit
 * @param {date} dueDate
 * @param {string} prio
 * @param {string} category
 * @param {Array} subtasksEdit
 */
function fillForm(
  titel,
  description,
  assignedToEdit,
  dueDate,
  prio,
  category,
  subtasksEdit
) {
  document.getElementById("taskTitle").value = titel;
  document.getElementById("taskDescription").value = description;
  assignedTo = assignedToEdit;
  document.getElementById("date").value = dueDate;
  setPrio(prio);
  document.getElementById("categoryInput").value = prettyCategory(category);
  categoryFromAddTask = category;
  subtasks = subtasksEdit;
}

/**
 * Makes the different buttons visible, which are necessary to change or create the tasks
 */
function changeEditSettings() {
  document.getElementById("createButton").classList.add("d_none");
  document.getElementById("createButton").classList.remove("d_flex");
  document.getElementById("editButtons").classList.add("d_flex");
  document.getElementById("editButtons").classList.remove("d_none");
}

/**
 * The function passes the changed values ​​to the card with the number ID
 *
 * @param {number} id
 */
function saveTaskButton(id) {
  prioCheck();
  tasks[id]["title"] = taskTitle.value;
  tasks[id]["description"] = taskDescription.value;
  tasks[id]["assignedTo"] = assignedTo;
  tasks[id]["date"] = date.value;
  tasks[id]["prio"] = taskPrio;
  tasks[id]["category"] = categoryFromAddTask;
  tasks[id]["subtask"] = subtasks;
  statusCheck = tasks[id]["status"];
  saveFunction();
  valueAppender();
  showTaskAddedOverlay();
  setTimeout(() => {
    closeAddTaskOverlay();
    hideTaskAddedOverlay();
  }, 1500);
}

// ######################## Overlayer AddTask ##########################
/**
 * This function creates variables and fills them with the values ​​of the card with the number ID and calls other functions to make changes
 *
 * @param {number} id
 */
function openEditContactDialog(id) {
  let titel = tasks[id]["title"];
  let description = tasks[id]["description"];
  let assignedToEdit = tasks[id]["assignedTo"];
  let dueDate = tasks[id]["date"];
  let prio = tasks[id]["prio"];
  let category = tasks[id]["category"];
  let subtasksEdit = tasks[id]["subtask"];
  statusCheck = tasks[id]["status"];
  fillForm(
    titel,
    description,
    assignedToEdit,
    dueDate,
    prio,
    category,
    subtasksEdit
  );
  necessaryFunctionsToEditTasks(id);
}

/**
 * This function calls other functions that are necessary for processing the tasks
 *
 * @param {number} id
 */
function necessaryFunctionsToEditTasks(id) {
  renderAssignedBadges();
  renderSubtasksToEdit();
  changeTaskButtonOnEdit();
  addAssignedToContacts(id);
  CameFrom = "EditTaskFromBoard";
}

/**
 * This function is called when the tasks are created.
 */
async function overlayerAddTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let date = document.getElementById("date").value;
  prioCheck();
  tasks.push({
    title: title,
    description: description,
    assignedTo: assignedTo,
    date: date,
    prio: taskPrio,
    category: categoryFromAddTask,
    subtask: subtasks,
    status: statusCheck,
  });
  saveFunction();
  valueAppender();
  showTaskAddedOverlay();
  setTimeout(() => {
    closeAddTaskOverlay();
    hideTaskAddedOverlay();
  }, 1500);
}

/**
 * This function displays the existing subtasks and displays them in the overlayer for editing
 */
function renderSubtasksToEdit() {
  if (subtasks.length > 0) {
    let subtaskOutput = document.getElementById("subtaskListContainer");
    for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      renderSubtasksHTML(subtaskOutput, subtask, i);
    }
  }
}

/**
 * This function outputs the HTML code for the renderSubtasksToEdit() function
 *
 * @param {string} subtaskOutput
 * @param {string} subtask
 * @param {number} i
 */
function renderSubtasksHTML(subtaskOutput, subtask, i) {
  let subtaskId = i;
  subtaskOutput.innerHTML += `
  <div id="subtask_${subtaskId}" class="subtaskContainer d_flex" ondblclick="editSubtask('${subtaskId}')">
       <li  >${subtask}</li>
       ${generateSubtaskChange(subtaskId)}
  </div>`;
}

/**
 * This function renders the people assigned to the task
 *
 * @param {number} id
 */
function addAssignedToContacts(id) {
  AssignedPersons = tasks[id].assignedTo;
  for (let i = 0; i < AssignedPersons.length; i++) {
    let AssignedPerson = AssignedPersons[i];
    for (let y = 0; y < contacts.length; y++) {
      let contact = contacts[y];
      addAssignedTrueTest(AssignedPerson, contact);
    }
  }
}

/**
 * This function checks whether a person in Contacts has already been assigned to the task that is being processed
 * 
 * @param {string} AssignedPerson 
 * @param {string} contact 
 */
function addAssignedTrueTest(AssignedPerson, contact) {
  if (contact.assigned == false || contact.assigned == undefined) {
    if (AssignedPerson.email == contact.email) {
      contact.assigned = true;
    } else {
      contact.assigned = false;
    }
  }
}