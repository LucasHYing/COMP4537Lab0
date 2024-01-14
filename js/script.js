// Array to store button objects
let arrayButtons = [];

// Array of colors for buttons
const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500"];

// Class representing a button
class Button {
  constructor(color, order) {
    this.order = order;
    this.btn = this.createButton(color);
  }

  // Method to create a button element
  createButton(color) {
    let button = document.createElement("button");
    button.style.backgroundColor = color;
    button.style.width = "10em";
    button.style.height = "5em";
    button.style.position = "absolute";
    document.getElementById("buttonContainer").appendChild(button);
    button.style.top = "50px";
    button.style.left = `${(parseInt(this.order) - 1) * 150}px`;
    return button;
  }

  // Method to hide the number on the button
  hideNumber() {
    this.btn.innerHTML = "";
  }

  // Method to show the number on the button
  showNumber() {
    this.btn.innerHTML = `<span style="color: #000000">${this.order}</span>`;
  }
}

// Function to create buttons with unique colors
function createButtons(count) {
  for (let i = 0; i < count; i++) {
    let newButton = new Button(getUniqueColor(), i + 1);
    newButton.showNumber();
    arrayButtons.push(newButton);
  }
}

// Function to move buttons randomly on the screen
function moveButtonsRandomly() {
  arrayButtons.forEach((button) => button.btn.disabled = true);

  // Set timeout to delay the movement
  setTimeout(() => {
    let movesCounter = 0;
    let interval = setInterval(() => {
      if (movesCounter >= 3) {
        clearInterval(interval);
        enableButtons();
        startMemoryTest();
      } else {
        arrayButtons.forEach((button) => {
          button.hideNumber();
          let newX = getRandomCoordinate(window.innerWidth - 100);
          let newY = getRandomCoordinate(window.innerHeight - 50);
          button.btn.style.top = `${newY}px`;
          button.btn.style.left = `${newX}px`;
        });
      }
      movesCounter++;
    }, 2000);
  }, arrayButtons.length * 1000);
}

// Function to get a random coordinate within the given limit
function getRandomCoordinate(limit) {
  return Math.floor(Math.random() * limit);
}

// Function to enable buttons after movement
function enableButtons() {
  arrayButtons.forEach((button) => button.btn.disabled = false);
}

// Function to start memory test and handle button clicks
function startMemoryTest() {
  let orderCopy = [...arrayButtons];
  let gameInProgress = true;

  arrayButtons.forEach((button) => {
    button.btn.addEventListener("click", function clickHandler() {
      if (!gameInProgress) return;

      let clickedButton = orderCopy.shift();
      if (clickedButton && button.order === clickedButton.order) {
        button.showNumber();
        if (orderCopy.length === 0) {
          displayMessage(userMessages.correctOrder);
          disableButtons();
          arrayButtons = [];
          gameInProgress = false;
          arrayButtons.forEach((button) => button.btn.removeEventListener("click", clickHandler));
        }
      } else {
        displayMessage(userMessages.incorrectOrder);
        showCorrectOrder();
        disableButtons();
        arrayButtons.forEach((button) => button.showNumber());
        gameInProgress = false;
        arrayButtons.forEach((button) => button.btn.removeEventListener("click", clickHandler));
      }
    });
  });
}

// Function to disable buttons
function disableButtons() {
  arrayButtons.forEach((button) => button.btn.disabled = true);
}

// Function to get a unique color for buttons
function getUniqueColor() {
  if (colors.length === 0) colors.push("#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500");
  return colors.splice(Math.floor(Math.random() * colors.length), 1)[0];
}

// Function to display a message using an alert
function displayMessage(message) {
  alert(message);
}

// Function to show the correct order on buttons
function showCorrectOrder() {
  arrayButtons.forEach((button) => button.showNumber());
}

// Event listener for the "Start" button
document.getElementById("startButton").addEventListener("click", () => {
  let count = parseInt(document.getElementById("buttonCountInput").value);
  if (count >= 3 && count <= 7) {
    arrayButtons = [];
    document.getElementById("buttonContainer").innerHTML = "";
    createButtons(count);
    moveButtonsRandomly();
  } else {
    displayMessage(userMessages.invalidInput);
  }
});
