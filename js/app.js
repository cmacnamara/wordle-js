// See if there's anywhere else in the code where I can use the "cells" element array
// STRETCH GOAL: Add difficulty selection to add or remove number of guesses allowed
// STRECH GOAL: Add dark mode

import { getTargetWord, isValidWord } from "./wordList.js";
import { alphabet } from "./alphabet.js";
import { playButtonSound, playWinSound, playLoseSound, playShrekSound } from "./audio.js";

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
  }
  toString() {
    return this.letter;
  }
}

/*-------------------------------- Constants --------------------------------*/

const board = new Board();
const REVEAL_SPEED = 250;
const LOSS_REVEAL_SPEED = 150;

/*---------------------------- Variables (state) ----------------------------*/

let gameIsWon, guessAttemptNum, targetWord, numWins;


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
  playButtonSound();
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
  playButtonSound();
  if(board.boardArray[guessAttemptNum].includes(null)) {
    updateMessage('Not enough runes');
  } else if(!isValidWord(board.boardArray[guessAttemptNum].join('').toLowerCase())) {
    updateMessage(`Not in word list`);
  } else {
    if(board.boardArray[guessAttemptNum].join('').toLowerCase() === 'shrek') {
      playShrekSound();
    }
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
      playWinSound();
      updateMessage('You win! Odin is pleased.');
      numWins++;
      localStorage.setItem("numWins", numWins);
      renderPlayerStats();
    } else {
        if(guessAttemptNum === 5) {
          playLoseSound();
          updateMessage(`You lose! Odin's runes: ${targetWord}`);
          numWins = 0;
          localStorage.setItem("numWins", 0)
          setNumWins();
          renderPlayerStats();
          revealLossResult();
        } else {
          guessAttemptNum++;
          enableInputForRow(guessAttemptNum);
          updateMessage(`${6 - guessAttemptNum} attempt${guessAttemptNum === 5 ? '' : 's'} remaining`);
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
  playButtonSound();
  numWins = 0;
  localStorage.setItem("numWins", numWins);
  rankDisplayEl.classList.remove('animate__animated', 'animate__fadeIn');
  winsDisplayEl.classList.remove('animate__animated', 'animate__fadeIn');
  rankDisplayEl.offsetHeight;
  winsDisplayEl.offsetHeight;
  renderPlayerStats();
  rankDisplayEl.classList.add('animate__animated', 'animate__fadeIn');
  winsDisplayEl.classList.add('animate__animated', 'animate__fadeIn');
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
  winsDisplayEl.textContent = `Streak: ${numWins}`
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
    if(cell.classList.contains("lossGlow")){
      cell.classList.remove("lossGlow");
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
  message.classList.remove('animate__animated', 'animate__fadeIn');
  message.offsetHeight;
  message.textContent = msg;
  message.classList.add('animate__animated', 'animate__fadeIn');
}

function revealLossResult() {
  let idx = 0;
  cells.forEach(cell => {
    delayLossReveal(cell, idx);
    idx++;
  })
}

function delayLossReveal(cell, idx) {
  setTimeout(function() {
    cell.classList.add('lossGlow');
  }, LOSS_REVEAL_SPEED * idx);
}

init();