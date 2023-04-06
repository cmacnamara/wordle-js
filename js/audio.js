const buttonPressSound = new Audio('../assets/audio/stone-grind.mp3');
const winSound = new Audio('../assets/audio/win-sfx.mp3');
const loseSound = new Audio('../assets/audio/lose-sfx.mp3');

function playButtonSound() {
  buttonPressSound.volume = 0.05;
  buttonPressSound.play();
}

function playWinSound() {
  winSound.volume = 0.05;
  winSound.play();
}

function playLoseSound() {
  loseSound.volume = 0.05;
  loseSound.play();
}

export {
  playButtonSound,
  playWinSound,
  playLoseSound,
}