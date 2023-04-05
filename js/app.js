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
//// Create a checkGuess function
    //// Check if all 5 character have been entered; if not, display message to user indicating that they need to enter more characters (STRETCH: Have the current row shake back and forth)
    //// Add CSS classes to apply color to guessed characters indicating whether or not they exist in the word and are in the correct order or not
    //// If game hasn’t been won and the guessAttemptNum is not 5, increment guessAttemptNum
//// Create a function to check if an individual character exists in the target word
//// Create a checkForWin function
//// Add functionality that prevents previous guesses to be altered and prevents users from entering input into subsequent guess rows
//// Add a favicon to the site
//// Add Norse-themed font
// Update README with image
// Fix bug when target word is 'gamut' and guess is 'trait' versus word is 'madam' and guess is 'mommy'
//// Render messages in the DOM
//// Fix bug dealing with duplicate correct letters displaying correct color
// See if there's anywhere else in the code where I can use the "cells" element array
//// Make buttons pretty
// Make design responsive at smaller widths
// Ensure board stays centered on stone image
// STRETCH GOAL: Make entire board glow red on loss
//// STRETCH GOAL: Add timer to sequentially reveal the correctness of each guessed letter 
// STRETCH GOAL: Add difficulty selection to add or remove number of guesses allowed
//// STRETCH GOAL: Add functionality that automatically moves highlighted input to subsequent input field when a character is entered
// STRETCH GOAL: Add sound effects to play when each character is checked and when game is won or lost
//STRECH GOAL: Add dark mode
//// STRETCH GOAL: Add level variable; gain a level on each subsequent win; display RUNE MASTER after 10 subsequent wins; reset level to 0 after loss; display level up progress; save progress in localStorage

import { getTargetWord, isValidWord } from "./wordList.js";
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
    this.isExcessDuplicate = false;
  }
  toString() {
    return this.letter;
  }
}

/*-------------------------------- Constants --------------------------------*/

const board = new Board();
const REVEAL_SPEED = 250;

/*---------------------------- Variables (state) ----------------------------*/

let gameIsWon, guessAttemptNum, targetWord, targetWordTallyObj, numWins;


/*------------------------ Cached Element References ------------------------*/

const submitBtnEl = document.getElementById("submit-guess");
const resetBtnEl = document.getElementById("reset");
const resetWinsBtnEl = document.getElementById("reset-wins");
const boardEl = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const message = document.getElementById("msg-text");
const winsDisplayEl = document.getElementById("wins-display");
const rankDisplayEl = document.getElementById("rank-display");

/*----------------------------- Event Listeners -----------------------------*/

submitBtnEl.addEventListener('click', checkGuess);
resetBtnEl.addEventListener('click', handleReset);
resetWinsBtnEl.addEventListener('click', handleResetWins);
boardEl.addEventListener('keydown', enterLetter);
boardEl.addEventListener('keyup', focusNextInput);


/*-------------------------------- Functions --------------------------------*/

function init() {
  gameIsWon = false;
  guessAttemptNum = 0;
  renderPlayerStats();
  //targetWord = 'TEETH';
  targetWord = getTargetWord();
  board.reset();
  removeGlow();
  disableInputs();
  enableInputForRow(0);
  updateMessage('Enter Odin\'s runes');
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
  } else if(evt.key === 'Enter') {
    checkGuess();
  }
  
  render();
}

function checkGuess() {
  if(board.boardArray[guessAttemptNum].includes(null)) {
    updateMessage('Guess needs to be 5 letters long');
  } else if(!isValidWord(board.boardArray[guessAttemptNum].join('').toLowerCase())) {
    updateMessage(`'${board.boardArray[guessAttemptNum].join('')}' is not a valid word`)
  } else {
    let targetChars = targetWord.split('');
    const resultColors = [null, null, null, null, null];

    board.boardArray[guessAttemptNum].forEach((guessChar, idx) => {
      if(guessChar.toString() === targetChars[idx]) {
        resultColors[idx] = 'green';
        targetChars[idx] = null;
      }
    })
    board.boardArray[guessAttemptNum].forEach((guessChar, idx) => {
      if(resultColors[idx] !== 'green' && targetChars.includes(guessChar.toString())) {
        resultColors[idx] = 'yellow';
        targetChars[targetChars.indexOf(guessChar.toString())] = null;
      }
    })

    revealGuessResults(resultColors);
    checkForWinner(resultColors);

    if(gameIsWon) {
      updateMessage('You win! Odin is pleased.');
      numWins++;
      localStorage.setItem("numWins", numWins);
      renderPlayerStats();
    } else {
        if(guessAttemptNum === 5) {
          updateMessage(`Your word was ${targetWord}. Odin is most displeased!`);
          numWins = 0;
          localStorage.setItem("numWins", 0)
          setNumWins();
          renderPlayerStats();
        } else {
          guessAttemptNum++;
          enableInputForRow(guessAttemptNum);
          updateMessage(`${6 - guessAttemptNum} attempts remaining`);
          const nextSquare = boardEl.children[guessAttemptNum].children[0];
          focusInput(nextSquare);
        } 
    }
  }
}

function checkForWinner(resultColors) {
  gameIsWon = resultColors.every(resultColor => resultColor === 'green');
}

function revealGuessResults(resultColors) {
  let charIdx = 0;
  for(let charSquare of boardEl.children[guessAttemptNum].children){
    delayResultReveal(resultColors, charSquare, charIdx);
    charIdx++;
  }
}

function delayResultReveal(resultColors, charSquare, charIdx) {
  setTimeout(function() {
    if(resultColors[charIdx] === 'green') {
      charSquare.classList.add('correctAnswerGlow', 'disable-input'); 
    } else if(resultColors[charIdx] === 'yellow') {
      charSquare.classList.add('wrongPositionGlow', 'disable-input'); 
    } else {
      charSquare.classList.add('wrongAnswerGlow', 'disable-input'); 
    }
  }, REVEAL_SPEED * charIdx);
}

function handleResetWins() {
  numWins = 0;
  localStorage.setItem("numWins", numWins);
  renderPlayerStats();
}

function renderPlayerStats(){
  setNumWins();
  displayRank();
}

function setNumWins() {
  if(localStorage.getItem("numWins")) numWins = localStorage.getItem("numWins");
  else numWins = 0;
  displayNumWins();
}

function displayNumWins() {
  winsDisplayEl.textContent = `streak: ${numWins}`
}

function displayRank() {
  if(numWins <= 0) {
    rankDisplayEl.textContent = `Rank: Uninitiated`;
  }
  else if(numWins > 0 && numWins < 2) 
    rankDisplayEl.textContent = `Rank: Thrall`;
  else if(numWins >= 2 && numWins < 4) 
    rankDisplayEl.textContent = `Rank: Karl`;
  else if(numWins >= 4 && numWins < 6) 
    rankDisplayEl.textContent = `Rank: Earl`;
  else if(numWins >= 6 && numWins < 8) 
    rankDisplayEl.textContent = `Rank: Jarl`;
  else if(numWins >= 8 && numWins < 10) 
    rankDisplayEl.textContent = `Rank: Royal`;
  else if(numWins >= 10) 
    rankDisplayEl.textContent = `Rank: RUNE MASTER`;
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
    if(cell.classList.contains("disable-input")){
      cell.classList.remove("disable-input");
    }
    cell.classList.remove('animate__animated', 'animate__fadeIn');
    cell.offsetHeight;
    cell.classList.add('animate__animated', 'animate__fadeIn');
  })
}

function enableInputForRow(rowNum) {
  cells.forEach(cell => {
    let currentRowNum = parseInt(cell.parentElement.id.slice(-1));
    if(currentRowNum === rowNum && cell.classList.contains("disable-input")){
      cell.classList.remove("disable-input");
    }
  })
}

function disableInputs() {
  cells.forEach(cell => {
    let currentRowNum = cell.parentElement.id.slice(-1);
    if(currentRowNum > 0){
      cell.classList.add('disable-input');
    }
  })
}

function updateMessage(msg) {
  message.textContent = msg;
}

init();