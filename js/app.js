//// Add HTML element to display title of game
//// Add HTML element to display status (won game, lost, or current guess attempt number)
//// Add a container div to represent the board 
//// Add 6 divs within the container div that represent each word row
//// Add 5 HTML input elements within each word row div to represent each character of each word
//// Add an HTML button element to submit each guess
//// Add a cached element reference for the submit guess button
//// Add an event listener to the submit guess button
//// Add HTML button to reset the game and choose new word
//// Add a cached element reference for the reset button
//// Add an event listener to the reset button
//// Create a 2-D array variable to represent the board. Will contain character objects
//// Create character class, which contains variables letter, isInWord, isInCorrectPosition
//// Add variables for winner (boolean), guessAttemptNum, targetWord
//// Add init function
//// Set board array elements to null
//// Set winner to false
//// Set guessAttemptNum to 0
// Set targetWord to randomized word from external js file
// Import the function that will access the target word
// Create a checkGuess function
// Check if all 5 character have been entered; if not, display message to user indicating that they need to enter more characters (STRETCH: Have the current row shake back and forth)
// Add CSS classes to apply color to guessed characters indicating whether or not they exist in the word and are in the correct order or not
// If game hasn’t been won and the guessAttemptNum is not 5, increment guessAttemptNum
// STRETCH GOAL: Add timer to sequentially reveal the correctness of each guessed letter 
// Create a function to check if an individual character exists in the target word
// Create a checkForWin function
// Add functionality that prevents previous guesses to be altered and prevents users from entering input into subsequent guess rows
// Add a favicon to the site
// Add Norse-themed font
// STRETCH GOAL: Add difficulty selection to add or remove number of guesses allowed
// STRETCH GOAL: Add functionality that automatically moves highlighted input to subsequent input field when a character is entered
// STRETCH GOAL: Add sound effects to play when each character is checked and when game is won or lost
// STRETCH GOAL: Add level variable; gain a level on each subsequent win; display RUNE MASTER after 10 subsequent wins; reset level to 0 after loss; display level up progress; save progress in localStorage


/*-------------------------------- Classes --------------------------------*/

class Character {
  constructor(letter, idx){
    this.letter = letter;
    this.idx = idx;
    this.isInWord = false;
    this.isInCorrectPosition = false;
  }
}

/*-------------------------------- Constants --------------------------------*/

const board = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
];


/*---------------------------- Variables (state) ----------------------------*/

let gameIsWon, guessAttemptNum, targetWord;


/*------------------------ Cached Element References ------------------------*/

const submitBtnEl = document.getElementById("submit-guess");
const resetBtnEl = document.getElementById("reset");


/*----------------------------- Event Listeners -----------------------------*/

submitBtnEl.addEventListener('click', handleSubmit);
resetBtnEl.addEventListener('click', handleReset);


/*-------------------------------- Functions --------------------------------*/

function init() {
  board.forEach(row => {
    row.forEach(charObj => {
      charObj = null;
    })
  })
  gameIsWon = false;
  guessAttemptNum = 0;
  targetWord = '';
}

function handleSubmit() {
  console.log("Guess submitted");
}

function handleReset() {
  console.log("Game reset");
}