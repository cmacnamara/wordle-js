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
//// Set targetWord to randomized word from external js file
////  Import the function that will access the target word
//// Create enterLetter function
// Create a checkGuess function
    //// Check if all 5 character have been entered; if not, display message to user indicating that they need to enter more characters (STRETCH: Have the current row shake back and forth)
    // Add CSS classes to apply color to guessed characters indicating whether or not they exist in the word and are in the correct order or not
    // If game hasn’t been won and the guessAttemptNum is not 5, increment guessAttemptNum
//// Create a function to check if an individual character exists in the target word
//// Create a checkForWin function
// Add functionality that prevents previous guesses to be altered and prevents users from entering input into subsequent guess rows
//// Add a favicon to the site
//// Add Norse-themed font
// STRETCH GOAL: Add timer to sequentially reveal the correctness of each guessed letter 
// STRETCH GOAL: Add difficulty selection to add or remove number of guesses allowed
// STRETCH GOAL: Add functionality that automatically moves highlighted input to subsequent input field when a character is entered
// STRETCH GOAL: Add sound effects to play when each character is checked and when game is won or lost
// STRETCH GOAL: Add level variable; gain a level on each subsequent win; display RUNE MASTER after 10 subsequent wins; reset level to 0 after loss; display level up progress; save progress in localStorage

import { getTargetWord } from "./wordList.js";
import { alphabet } from "./alphabet.js";

/*-------------------------------- Classes --------------------------------*/
class Board {
  constructor() {
   this.boardArray;
  }
  reset() {
    this.boardArray = [
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null]
    ];
  }
}

class Character {
  constructor(letter, idx){
    this.letter = letter;
    this.idx = idx;
    this.isInWord = false;
    this.isInCorrectPosition = false;
  }
  toString() {
    return this.letter;
  }
}

/*-------------------------------- Constants --------------------------------*/

const board = new Board();

/*---------------------------- Variables (state) ----------------------------*/

let gameIsWon, guessAttemptNum, targetWord;


/*------------------------ Cached Element References ------------------------*/

const submitBtnEl = document.getElementById("submit-guess");
const resetBtnEl = document.getElementById("reset");
const boardEl = document.getElementById("board");
const printBtnEl = document.getElementById("printBoard");
const cells = document.querySelectorAll(".cell");


/*----------------------------- Event Listeners -----------------------------*/

submitBtnEl.addEventListener('click', checkGuess);
resetBtnEl.addEventListener('click', handleReset);
boardEl.addEventListener('keydown', enterLetter);
boardEl.addEventListener('keyup', focusNextInput);
printBtnEl.addEventListener('click', printBoard);


/*-------------------------------- Functions --------------------------------*/

function init() {
  gameIsWon = false;
  guessAttemptNum = 0;
  targetWord = getTargetWord();
  board.reset();
  removeGlow();
  render();
  focusFirstSquare();
  console.log(`Target word is ${targetWord}`);
}

function render() {
  let rowIdx = 0;
  for(let row of boardEl.children) {
    let charIdx = 0;
    for(let charSquare of row.children){
      charSquare.value = board.boardArray[rowIdx][charIdx];
      charIdx++;
    }
    rowIdx++;
  }
}

function handleReset() {
  console.log("Game reset");
  init();
}

function enterLetter(evt) {
  const letter = evt.key.toUpperCase();
  const letterIdx = parseInt(evt.target.id.slice(-1));
  if(alphabet.includes(letter)){
    const rowIdx = parseInt(evt.target.parentElement.id.slice(-1));
    const char = new Character(letter, letterIdx); 
    board.boardArray[rowIdx][letterIdx] = char;
  } else if(evt.key === 'Backspace') {
    const rowIdx = parseInt(evt.target.parentElement.id.slice(-1)); 
    board.boardArray[rowIdx][letterIdx] = null;
  } else if(evt.key === 'ArrowLeft' && letterIdx > 0) {
    focusInput(evt.target.previousElementSibling);
  } else if(evt.key === 'ArrowRight' && letterIdx < 4) {
    focusInput(evt.target.nextElementSibling);
  }
  render();
}

function checkGuess() {
  if(board.boardArray[guessAttemptNum].includes(null)) {
    console.log("Guess needs to be 5 letters long");
  }
  else {
    const guess = board.boardArray[guessAttemptNum];
    guess.forEach((character, idx) => {
      character.isInWord = existsInWord(character);
      if(character.isInWord) {
        character.isInCorrectPosition = isInCorrectPosition(character, idx);
      }
      console.log(`${character} ${character.isInWord ? 'is' : 'is not'} in the word and ${character.isInCorrectPosition ? 'is' : 'is not'} in the correct position.`);
    })

    revealGuessResults(board.boardArray[guessAttemptNum]);
    checkForWinner(board.boardArray[guessAttemptNum]);

    if(gameIsWon) {
      console.log(`WE HAVE WINNER!!`);
    }
    else {
      if(guessAttemptNum === 5) {
        console.log('Game over');
      } else {
        guessAttemptNum++;
        console.log(`Guess attempt num is now ${guessAttemptNum}`);
        const nextSquare = boardEl.children[guessAttemptNum].children[0];
        focusInput(nextSquare);
      } 
    }
  }
}

function checkForWinner(wordArray) {
  gameIsWon = wordArray.every(charObj => charObj.isInWord && charObj.isInCorrectPosition);
}

function revealGuessResults(wordArray) {
  let charIdx = 0;
  for(let charSquare of boardEl.children[guessAttemptNum].children){
    if(wordArray[charIdx].isInWord && wordArray[charIdx].isInCorrectPosition) {
      console.log(`Applying correct glow`);
      charSquare.classList.add('correctAnswerGlow'); 
    } else if(wordArray[charIdx].isInWord && !wordArray[charIdx].isInCorrectPosition) {
      charSquare.classList.add('wrongPositionGlow'); 
      console.log(`Applying wrong position glow`);
    } else {
      console.log(`Applying wrong answer glow`);
      charSquare.classList.add('wrongAnswerGlow'); 
    }
    charIdx++;
  }
}

function existsInWord(char) {
  if(targetWord.includes(char)) return true;
  return false;
}

function isInCorrectPosition(char, idx) {
  if(targetWord.charAt(idx) === char.toString()) return true;
  return false;
}

function focusFirstSquare(){
  const firstSquare = boardEl.children[0].children[0];
  firstSquare.focus();
  firstSquare.select();
}

function focusNextInput(evt) {
  const letter = evt.key.toUpperCase();
  if(alphabet.includes(letter)){
    const letterIdx = parseInt(evt.target.id.slice(-1));
    if(letterIdx !== 4) focusInput(evt.target.nextElementSibling);
  }
}

function focusInput(element) {
    element.focus();
    element.select();
}

function removeGlow() {
  cells.forEach(cell => {
    if(cell.classList.contains("correctAnswerGlow")){
      cell.classList.remove("correctAnswerGlow");
    } else if(cell.classList.contains("wrongPositionGlow")){
      cell.classList.remove("wrongPositionGlow");
    } else if(cell.classList.contains("wrongAnswerGlow")){
      cell.classList.remove("wrongAnswerGlow");
    }
  })
}

function printBoard() {
  board.boardArray.forEach(row => {
    console.log(row.join(' - '));
  })
}

init();
