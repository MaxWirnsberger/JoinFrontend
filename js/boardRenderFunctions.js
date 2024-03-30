// ############################ Render Info ############################
/**
 * Calls all functions necessary to display the detailed information of a card
 * 
 * @param {number} index 
 */
function renderCardDetails(index) {
  renderCardDetailsHeader(index);
  renderCardDetailsTitel(index);
  renderCardDetailsDescription(index);
  renderCardDetailsDate(index);
  renderCardDetailsPriority(index);
  renderCardDetailsAssignedTo(index);
  renderCardDetailsSubTasks(index);
  renderCardDetailsDeleteEdit(index);
}

/**
 * Renders the header for the detailed information of the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsHeader(index) {
  let findRightTask =tasks.find(element => element.id === index);
  let category = findRightTask["category"];
  category = changeCategoryValue(category);
  let color = categoryColorCheck(category);
  let header = document.getElementById("cardDetails_header");
  header.innerHTML = `<div class="category" 
    style="background-color: #${color}">${category}</div>
      <a onclick="closeCardDetails()" class="cardCloseButton">
        <img src="../assets/img/board/close.png" alt="" />
      </a>`;
}

/**
 * Makes the category view more beautiful
 * 
 * @param {string} category 
 * @returns Nicer look of the category
 */
function changeCategoryValue(category) {
  if (category.name == "technical_task") {
    return "Technical Task";
  } else if (category.name == "user_story") {
    return "User Story";
  } else {
    return "Standard Task";
  }
}

/**
 * Renders the Titel for the detailed information of the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsTitel(index) {
  let findRightTask =tasks.find(element => element.id === index);
  let titelText = findRightTask["title"];
  let titelSection = document.getElementById("cardDetails_titel");
  titelSection.innerHTML = `<h2>${titelText}</h2>`;
}

/**
 * Renders the Description for the detailed information of the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsDescription(index) {
  let findRightTask =tasks.find(element => element.id === index);
  let descriptionText = findRightTask["description"];
  let descriptionSection = document.getElementById("cardDetails_description");
  descriptionSection.innerHTML = `${descriptionText}`;
}

/**
 * Renders the Date for the detailed information of the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsDate(index) {
  let findRightTask =tasks.find(element => element.id === index);
  let dateText = findRightTask["due_date"].split("-");
  let year = dateText[0];
  let month = dateText[1];
  let day = dateText[2];
  let dateSection = document.getElementById("cardDetails_date");
  dateSection.innerHTML = `${day}/${month}/${year}`;
}

/**
 * Renders the Priority for the detailed information of the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsPriority(index) {
  let standardPrioText =tasks.find(element => element.id === index);
  prioText = standardPrioText["priority"];
  prioText = prioText.charAt(0).toUpperCase() + prioText.slice(1);
  let prioImg = rightPrioImg(standardPrioText);
  let prioSection = document.getElementById("cardDetails_prio");
  prioSection.innerHTML = `
      ${prioText} <img src="${prioImg}" alt="" />`;
}

/**
 * Renders the "AssignedTo" for the detailed information of the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsAssignedTo(index) {
  let findRightTask =tasks.find(element => element.id === index);
  let assignedToArray = findRightTask["assignedTo"];
  let assignedToSection = document.getElementById("assignedToCardName");
  assignedToSection.innerHTML = ``;
  for (let i = 0; i < assignedToArray.length; i++) {
    let rightContacts = contacts.find(element => element.id == assignedToArray[i])
    let assignedToText = rightContacts.name;
    let assignedToColor = rightContacts.color;
    assignedToSection.innerHTML += `
          <div class="assignedToCardNameValue">
              <div class="assignedToCardCyrcle" 
              style="background-color: #${assignedToColor};">${
      initialsAssignedTo(assignedToText, 0) +
      initialsAssignedTo(assignedToText, 1)
      }</div><div>${assignedToText}</div></div>`;
  }
}

/**
 * Renders the "SubTasks" for the detailed information of the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsSubTasks(index) {
  let subTasksSection = document.getElementById("renderSubtasksToCard");
  subTasksSection.innerHTML = "";
  let subTasks = getNameOfSubtasks(index);
  let progressValue = getProgressOfSubtasks(index);
  for (let i = 0; i < subTasks.length; i++) {
    let subTask = subTasks[i];
    let findRightTask = tasks.find(element => element.id === index);
    let findRightSubtaskID = findRightTask['subtasks'].find(element => element.title === subTask);
    subTasksSection.innerHTML += `
          <div class="renderSubtasksToCard" onclick="addProgress(${index}, ${findRightSubtaskID['id']})">
              <div><img src="${progressCheckOnSubtask(progressValue[i])}" alt="" />
              </div>
              <div>${subTask}</div>
          </div>`;
  }
}

function getNameOfSubtasks(index){
  let findRightTask =tasks.find(element => element.id === index);
  subtaskArray = []
  for (let i = 0; i < findRightTask["subtasks"].length; i++) {
    const subtasks = findRightTask["subtasks"][i];
    subtaskArray.push(subtasks["title"])
  }
  return subtaskArray
}

function getProgressOfSubtasks(index){
  let findRightTask =tasks.find(element => element.id === index);
  subtaskArray = []
  for (let i = 0; i < findRightTask["subtasks"].length; i++) {
    const subtasks = findRightTask["subtasks"][i];
    subtaskArray.push(subtasks["checked"])
  }
  return subtaskArray
}

/**
 * This function returns an empty or filled checkbox, depending on whether the subtask has already been completed.
 * 
 * @param {boolean} progressValue 
 * @returns 
 */
function progressCheckOnSubtask(progressValue) {
  if (progressValue == 1) {
    return "../assets/img/board/checkButton.png";
  } else {
    return "../assets/img/board/noneCheckButton.png";
  }
}

/**
 * Changes value of progress Value when task is completed
 * 
 * @param {string} task 
 * @param {string} subtask 
 */
async function addProgress(task, subtask) {
  let findRightTask =tasks.find(element => element.id === task);
  let findRightSubtask =findRightTask['subtasks'].find(element => element.id === subtask);
  if (findRightSubtask['checked'] == 0) {
    findRightSubtask['checked']++;
  } else if (findRightSubtask['checked'] == 1) {
    findRightSubtask['checked']--;
  }
  renderCardDetailsSubTasks(task);
  saveFunction(task);
}

/**
 * Renders the Delete and Edit buttons for the desired task
 * 
 * @param {number} index 
 */
function renderCardDetailsDeleteEdit(index) {
  let deleteEdit = document.getElementById("deleteEditCard");
  deleteEdit.innerHTML = `<div class="deleteEditCardContent">
      <div class="renderDeleteEditCardContent" onclick="deleteTask(${index})">
        <img src="../assets/img/board/delete.png" alt="" />
        <div>Delete</div>
      </div>
      <hr />
      <div class="renderDeleteEditCardContent" onclick="editTask(${index})">
        <img src="../assets/img/board/edit.png" alt="" />
        <div>Edit</div>
      </div>
    </div>`;
}

// ################### Open & Close Layer and Cards ####################
/**
 * Opens overlayer when you click the AddTask button
 * 
 * @param {string} status 
 */
function openAddTaskOverlay(status) {
  statusCheck = status;
  CameFrom = "AddTaskOnStatus";
  document.getElementById("addTaskOverlay").classList.remove("d_none");
  setPrioBtn(prio_medium, "#FFA800", "prio_medium_white.svg");
}

/**
 * closes the overlayer without making any changes
 */
function closeAddTaskOverlay() {
  clearInput();
  changeButtonToRegularAddTask();
  CameFrom = "addTask";
  document.getElementById("addTaskOverlay").classList.add("d_none");
}

/**
 * closes the detail information without making any changes
 */
function closeCardDetails() {
  document.getElementById("card_details_bg").classList.add("d_none");
}

/**
 * open card details
 * 
 * @param {number} index 
 */
function openCardDetails(index) {
  renderCardDetails(index);
  document.getElementById("card_details_bg").classList.remove("d_none");
}