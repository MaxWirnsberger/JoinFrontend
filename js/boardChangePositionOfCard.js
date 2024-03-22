// ####################### Drag and Drop Card ##########################
/**
 * This function is triggered when a card is lifted and its ID is stored in the global variable currentDraggedElement
 *
 * @param {number} id
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Function allows to drop the card at the desired location when carrying out an event
 *
 * @param {event} ev
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * The function is triggered when ondrop and gives the card the new function in status
 *
 * @param {string} status
 */
function moveTo(status) {
  tasks[currentDraggedElement]["status"] = status;
  let rightID = findIdToRemoveHighlight();
  removeHighlight(rightID);
  saveFunction();
}

/**
 * Function highlights the area over which you can drop the card when hovering over the area
 *
 * @param {number} id
 */
function highlight(id) {
  document.getElementById(id).classList.add("dragHighlight");
}

/**
 * Function ensures that the area is no longer highlighted when you leave the area with the card
 *
 * @param {number} id
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("dragHighlight");
}

/**
 * Is called in the moveTo() function in order to be able to execute the removeHighlight() function when the cacrd is dropped
 *
 * @returns status of the dropped Card
 */
function findIdToRemoveHighlight() {
  let status = tasks[currentDraggedElement]["status"];
  if (status == "todo") {
    return "toDoCards";
  } else if (status == "inProgress") {
    return "inProgressCards";
  } else if (status == "awaitFeedback") {
    return "awaitFeedbackCards";
  } else {
    return "doneCards";
  }
}

// ###################### Open and Close Submenu #######################
/**
 * Allows you to open the submenu without opening the card information
 *
 * @param {event} event
 * @param {number} taskId
 */
function openPositionMenu(event, taskId) {
  event.stopPropagation();
  let positionNav = document.getElementById(`positionNav${taskId}`);
  positionNav.classList.remove("d_none");
  currentMenuOpen = taskId;
  currentDraggedElement = taskId;
  wasSubmenuOpen = true;
}

/**
 * Closes submenu when you press another area
 */
document.addEventListener("click", function (event) {
  let positionNav = document.getElementById(`positionNav${currentMenuOpen}`);
  if (wasSubmenuOpen) {
    if (
      !positionNav.contains(event.target) &&
      event.target.id !== "responseDragAndDropButton"
    ) {
      positionNav.classList.add("d_none");
    }
  }
});

// ########################## Searching Cards ##########################
/**
 * This function starts the search for the values ​​in the search field
 */
function searchingCard() {
    let filterTask = [];
    let wantedTask = inputFieldFinder();
    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      if (
        task["title"].toLowerCase().includes(wantedTask) ||
        task["description"].toLowerCase().includes(wantedTask)
      ) {
        filterTask.push(task);
      }
    }
    filterTasksOnSearchingCards(filterTask);
  }
  
  /**
   * This function renders the found cards from the searchingCard() function
   * 
   * @param {Array} fillterdtasks 
   */
  function filterTasksOnSearchingCards(fillterdtasks) {
    todos = fillterdtasks.filter((task) => task["status"] == "todo");
    inProgress = fillterdtasks.filter((task) => task["status"] == "inProgress");
    awaitFeedback = fillterdtasks.filter(
      (task) => task["status"] == "awaitFeedback"
    );
    done = fillterdtasks.filter((task) => task["status"] == "done");
    renderCards();
  }
  
  /**
   * This function ensures that the input text is written the same as the searched text
   * 
   * @returns The text entered for the search
   */
  function inputFieldFinder() {
    firstField = document.getElementById("searching_form_input");
    secondField = document.getElementById("responseSearching_form_input");
    if (firstField.value.length > 0) {
      return firstField.value.toLowerCase();
    } else if (secondField.value.length > 0) {
      return secondField.value.toLowerCase();
    } else {
      return firstField.value.toLowerCase();
    }
  }
  