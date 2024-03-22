// ########################### Render Cards ############################
/**
 * Calls the rendering functions of the different positions
 */
function renderCards() {
    renderCardsTodo("toDo");
    renderCardsProgress("inProgress");
    renderCardsAwait("awaitFeedback");
    renderCardsDone("done");
  }
  
  /**
   * Renders ToDo Tasks
   * 
   * @param {string} status 
   */
  function renderCardsTodo(status) {
    document.getElementById(`${status}Cards`).innerHTML = "";
    if (todos.length > 0) {
      for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        renderCardFunction(status, todo, i);
      }
    } else {
      renderEmptyField(status);
    }
  }
  
  /**
   * Renders In Progress Tasks
   * 
   * @param {string} status 
   */
  function renderCardsProgress(status) {
    document.getElementById(`${status}Cards`).innerHTML = "";
    if (inProgress.length > 0) {
      for (let i = 0; i < inProgress.length; i++) {
        let inProgressTask = inProgress[i];
        renderCardFunction(status, inProgressTask, i);
      }
    } else {
      renderEmptyField(status);
    }
  }
  
  /**
   * Renders "await Feedback" Tasks
   * 
   * @param {string} status 
   */
  function renderCardsAwait(status) {
    document.getElementById(`${status}Cards`).innerHTML = "";
    if (awaitFeedback.length > 0) {
      for (let i = 0; i < awaitFeedback.length; i++) {
        let awaitFeedbackTask = awaitFeedback[i];
        renderCardFunction(status, awaitFeedbackTask, i);
      }
    } else {
      renderEmptyField(status);
    }
  }
  
  /**
   * Renders "Done" Tasks
   * 
   * @param {string} status 
   */
  function renderCardsDone(status) {
    document.getElementById(`${status}Cards`).innerHTML = "";
    if (done.length > 0) {
      for (let i = 0; i < done.length; i++) {
        let doneTask = done[i];
        renderCardFunction(status, doneTask, i);
      }
    } else {
      renderEmptyField(status);
    }
  }
  
  /**
   * Renders the different sections of the cards by calling them up
   * 
   * @param {string} status 
   * @param {string} task 
   * @param {number} i 
   */
  function renderCardFunction(status, task, i) {
    document.getElementById(`${status}Cards`).innerHTML += `
      ${renderHeader(task, i)} 
      ${renderProgressBar(task)} 
      ${renderAssignedPerson(task, i)} 
      ${renderPrio(task, i)}`;
  }
  
  /**
   * Renders the placeholder if the card is present in this section
   * 
   * @param {string} status 
   */
  function renderEmptyField(status) {
    document.getElementById(`${status}Cards`).innerHTML = `
      <div class="emptyTasks">No tasks</div>`;
  }
  
// ############################ Card Templets ##########################
/**
 * Returns the HTML code for the header
 * 
 * @param {string} task 
 * @returns HTML Code for Header
 */
function renderHeader(task) {
    let category = changeCategoryValue(task["category"]);
    let color = categoryColorCheck(category);
    return `<div id="user_cards" class="user_cards" draggable="true" 
      ondragstart="startDragging(${task.id})" onclick="openCardDetails(${task.id})">
        <div class="user_card_content"> <div class="cardHeader">
          <div class="category" style="background-color: #${color}">${category}</div>
          <button id="responseDragAndDropButton" 
          class="responseDragAndDropButton" onclick="openPositionMenu(event, ${task.id})">
            <img src="../assets/img/board/dots.png" alt=""/>
            </button><div class="menuForPosition">${renderPositionMenu(task.id)}</div>
          </div>
            <div class="text_content_card">
                <div class="titel_content_card">
                    ${task["title"]}
                </div>
                <div class="description_content_card">
                    ${task["description"]}
                </div></div>`;
  }
  
  /**
   * Returns the HTML code for the submenu
   * 
   * @param {number} id 
   * @returns 
   */
  function renderPositionMenu(id){
    return `
    <div id="positionNav${id}" class="positionNav d_none">
      <a onclick="stopOpenCardDetailsBeforMoveTo(event, 'todo')">Todo</a>
      <a onclick="stopOpenCardDetailsBeforMoveTo(event, 'inProgress')">In Progress</a>
      <a onclick="stopOpenCardDetailsBeforMoveTo(event, 'awaitFeedback')">Await feddback</a>
      <a onclick="stopOpenCardDetailsBeforMoveTo(event, 'done')">Await feddback</a>
    </div>`
  }
  
  /**
   * Prevents the information card from opening when changing the position of the card
   * 
   * @param {event} event 
   * @param {string} status 
   */
  function stopOpenCardDetailsBeforMoveTo(event, status){
    event.stopPropagation();
    moveTo(status);
  }
  
  /**
   * Render the progress bar if subtasks are present
   * 
   * @param {string} task 
   * @returns 
   */
  function renderProgressBar(task) {
    let finalSubTasks = calcSubtask(task);
    let sumOfTasks = task["progressValue"].length;
    if (sumOfTasks > 0) {
      let calcValueOfProgress = calcValueOfProgressbar(finalSubTasks, sumOfTasks);
      return `<div class="progress_bar_card">
            <progress id="fileSubtask(${task.id})" max="100" value="${calcValueOfProgress}">
            </progress>
            <div id="calcSubtask(${task.id})">${finalSubTasks}/${sumOfTasks} Subtask</div>
        </div>`;
    } else {
      return `<div class="progress_bar_card"></div>`;
    }
  }
  
  /**
   * Renders people assigned to the task
   * 
   * @param {*} task 
   * @returns 
   */
  function renderAssignedPerson(task) {
    return `<div class="contact_prio">
        <div class="assigned_list">
        ${calcAssignedPersons(task)}
        </div>`;
  }
  
  /**
   * Renders the priority of the task
   * 
   * @param {*} task 
   * @param {*} i 
   * @returns 
   */
  function renderPrio(task, i) {
    return `<div class="prio_card">
                <img src="${rightPrioImg(task)}" alt="" />
                </div></div></div></div>`;
  }
  
  /**
   * Calculates the sum of all subtasks of the selected tasks
   * 
   * @param {string} task 
   * @returns Sum of subtasks
   */
  function calcSubtask(task) {
    let sum = 0;
    let values = task["progressValue"];
    if (values.length > 0) {
      for (let i = 0; i < values.length; i++) {
        let value = values[i];
        sum += value;
      }
    }
    return sum;
  }
  
  /**
   * Calculation of subtasks completed in percent
   * 
   * @param {number} finalSubTasks 
   * @param {number} sumOfTasks 
   * @returns Percent of subtasks completed
   */
  function calcValueOfProgressbar(finalSubTasks, sumOfTasks) {
    let progressBarValue = 0;
    progressBarValue = (finalSubTasks / sumOfTasks) * 100;
    return progressBarValue;
  }
  
  /**
   * Shows the first three assigned people
   * 
   * @param {string} task 
   * @returns 
   */
  function calcAssignedPersons(task) {
    let assignedToHTML = "";
    loopValue = calclenghOfPersonList(task)
    for (let i = 0; i < loopValue; i++) {
      let assignedTo = task["assignedTo"][i];
      assignedToHTML += `<div class="assigned_person" 
        style = "background-color: #${assignedTo.color};">${
        initialsAssignedTo(assignedTo.name, 0) +
        initialsAssignedTo(assignedTo.name, 1)
        }</div>`;
    } assignedToHTML = overThreePersonsInTasks(task, assignedToHTML);
    return assignedToHTML;
  }

  function calclenghOfPersonList(task){
    if (task["assignedTo"].length > 3) {
        return 3
    } else{
        return task["assignedTo"].length
    }
  }
  
  /**
   * calculates the number of people still present if it exceeds three
   *  
   * @param {string} task 
   * @param {string} assignedToHTML 
   * @returns 
   */
  function overThreePersonsInTasks(task, assignedToHTML){
    if (task["assignedTo"].length > 3){
      let calcOverThree = task["assignedTo"].length - 3;
      assignedToHTML += `<div class="assigned_person" 
        style = "background-color: #grey;">+${calcOverThree}</div>`;
    } return assignedToHTML
  }
  
  /**
   * Renders the initials of a name
   * 
   * @param {string} name 
   * @param {number} position 
   * @returns first letter of the first or the second name
   */
  function initialsAssignedTo(name, position) {
    let nameArray = name.split(" ");
    return nameArray[position].charAt(0);
  }
  
  /**
   * Returns the necessary image depending on the priority of the tasks
   * 
   * @param {string} task 
   * @returns image of prio 
   */
  function rightPrioImg(task) {
    if (task["prio"] == "urgent") {
      return "../assets/img/board/PrioUrgent.png";
    } else if (task["prio"] == "medium") {
      return "../assets/img/board/PrioMedia.png";
    } else {
      return "../assets/img/board/PrioLight.png";
    }
  }
  
  /**
   * Add a color to the two categories
   * 
   * @param {string} category 
   * @returns color code of category
   */
  function categoryColorCheck(category) {
    if (category == "Technical Task") {
      return "1FD7C1";
    } else if (category == "User Story") {
      return "0938FF";
    } else {
      return "808080";
    }
  }