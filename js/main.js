console.log("welcome to my game please hire me")

// 1) Define required constants:
//   1.1) Define a colors object with keys of 'null' (when the square is empty), and players 1 & -1. The value assigned to each key represents the color to display for an empty square (null), player 1 and player -1.
/*----- constants -----*/
const COLOR_LOOKUP = {
  '1': "yellow",
  '-1': 'orange',
  'null': 'white'
}

const NAME_LOOKUP = {
  '1': 'Rick',
  '-1': 'Morty',
}
// Display Character Icon In Clicked Cell If Uncliked Will Show Portal
const PLAYERS = {
  '1': "url('https://i.imgur.com/3pC1zCk.png')",
  '-1': "url('https://i.imgur.com/CjyQzJk.jpg')",
  'null': "url('https://cdna.artstation.com/p/assets/images/images/031/538/850/original/petro-kosariekov-portal-gun-rick-and-morty2-2.gif')",
}
// Display Character Avatar
const AVATAR_LOOKUP = {
  '1': "url('https://i.imgur.com/SXoZd0K.png')",
  '-1': "url('https://i.imgur.com/0kNZ6du.png')",
}
// Player Sound Whenever A Player Turn Will Play
const PLAYER_AUDIO_LOOKUP = {
  '1': new Audio('https://www.101soundboards.com/storage/board_sounds_rendered/59626.mp3'),
  '-1': new Audio('https://www.101soundboards.com/storage/board_sounds_rendered/126145.mp3')
}
//   1.2) Define the 8 possible winning combinations, each containing three indexes of the board that make a winner if they hold the same player value.
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
// Sounds For Theme Song When Game Begins And Portal Sound When Click
const startSound = new Audio('https://www.redringtones.com/wp-content/uploads/2017/10/rick-and-morty-theme-song.mp3')
const portalSound = new Audio('https://static.wikia.nocookie.net/soundeffects/images/e/ea/Rick_and_Morty%27s_Portal_Gun.mp3')
// 2) Define required variables used to track the state of the game:
//   2.1) Use a board array to represent the squares.
//   2.2) Use a turn variable to remember whose turn it is.
//   2.3) Use a winner variable to represent three different possibilities - player that won, a tie, or game in play.
/*----- app's state (variables) -----*/
let board, turn, winner

// 3) Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant:
//   3.1) Store the 9 elements that represent the squares on the page.
/*----- cached element references -----*/
const message = document.querySelector('h1')
const playAgainBtn = document.querySelector('#playAgainBtn')
const playAgainModal = document.getElementById("play-again-modal");
const playAgainModalContent = document.querySelector(".play-again-modal-content");
const playAgainModalText = document.getElementById("play-again-modal-text");
const volumeToggleBtn = document.getElementById('volume-toggle');
const startGameBtn = document.querySelector('#start-game-button');
const startModal = document.querySelector('.start-modal')

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleMove)
// 6) Handle a player clicking the replay button:
//   6.1) Do steps 4.1 (initialize the state variables) and 4.2 (render).
playAgainBtn.addEventListener('click', initialize);
volumeToggleBtn.addEventListener('click', startMute);
startGameBtn.addEventListener('click', initialize);
/*----- functions -----*/

// 4) Upon loading the app should:
//   4.1) Initialize the state variables:
//     4.1.1) Initialize the board array to 9 nulls to represent empty squares. The 9 elements will "map" to each square, where index 0 maps to the top-left square and index 8 maps to the bottom-right square.
//     4.1.2) Initialize whose turn it is to 1 (player 'X'). Player 'O' will be represented by -1.
//     4.1.3) Initialize winner to null to represent that there is no winner or tie yet. Winner will hold the player value (1 or -1) if there's a winner. Winner will hold a 'T' if there's a tie.

function initialize() {
  board = [null, null, null, null, null, null, null, null, null]
  turn = 1;
  winner = null
  startSound.currentTime = 0
  startSound.play()
  startSound.loop = true
  startModal.style.display = "none";
  playAgainModal.style.display = "none";
  render()
}

// Mute start sound

function startMute () {
  startSound.muted = !startSound.muted
  if (startSound.muted) {
    volumeToggleBtn.innerHTML = 'music off <img src="https://w7.pngwing.com/pngs/408/981/png-transparent-audio-mic-microphone-music-off-sound-volume-minimalisticons-icon-thumbnail.png" alt="Music Off" />';
  } else {
    volumeToggleBtn.innerHTML = 'music on <img src="https://w7.pngwing.com/pngs/880/191/png-transparent-computer-icons-sound-icon-feedback-button-miscellaneous-text-internet.png" alt="Music On" />';;
  }
}
//   4.2) Render those state variables to the page:
function render() {
  renderBoard()
  renderMessage()
  // ternary statement if winner true display playAgainBtn else not display
  winner ? playAgainBtn.style.display = 'block' : playAgainBtn.style.display = 'none'
}
//     4.2.1) Render the board:
//       4.2.1.1) Loop over each of the 9 elements that represent the squares on the page, and for each iteration:
//         4.2.1.1.2) Use the index of the iteration to access the mapped value from the board array.
//         4.3.1.1.3) Set the background color of the current element by using the value as a key on the colors lookup object (constant).
function renderBoard() {
  board.forEach(function(sqVal, idx) {
    const squareEl = document.getElementById(`sq-${idx}`)
    squareEl.style.backgroundImage = PLAYERS[sqVal]
    squareEl.style.backgroundSize = '100%'
    squareEl.style.backgroundColor = COLOR_LOOKUP[sqVal]
    squareEl.className = !sqVal ? 'avail' : '';
  })
}

function showModal() {
  playAgainModalText.innerHTML = message.innerHTML
  playAgainBtn.style.margin = "auto";
  playAgainBtn.style.display = "block";
  playAgainModal.style.display = "block";
}
//     4.2.2) Render a message:
//       4.2.2.1) If winner has a value other than null (game still in progress), render whose turn it is - use the color name for the player, converting it to upper case.
//       4.2.2.2) If winner is equal to 'T' (tie), render a tie message.
//       4.2.2.3) Otherwise, render a congratulatory message to which player has won - use the color name for the player, converting it to uppercase.
//   4.3) Wait for the user to click a square

function renderMessage() {
  if (winner === 'T') {
    message.innerHTML = "We Have A Tie!"
    startSound.pause();
    showModal()
  } else if (winner) {
    message.innerHTML = `Congrats <span style="color: ${COLOR_LOOKUP[winner]}">${NAME_LOOKUP[winner].toUpperCase()}</span>!`
    startSound.pause();
    PLAYER_AUDIO_LOOKUP[winner].currentTime = 1
    PLAYER_AUDIO_LOOKUP[winner].play()
    showModal()
  } else {
    message.innerHTML = `<span style="color: ${COLOR_LOOKUP[turn]}">${NAME_LOOKUP[turn].toUpperCase()}</span>'s Turn`;
    const avatarEl = document.getElementById('avatar');
    avatarEl.style.backgroundImage = AVATAR_LOOKUP[turn];
    avatarEl.style.backgroundPosition = turn === 1 ? 'left' : 'right';
    PLAYER_AUDIO_LOOKUP[turn].currentTime = 1;
    PLAYER_AUDIO_LOOKUP[turn].play();
  }
}

// 5) Handle a player clicking a square:
//   5.1) Obtain the index of the square that was clicked by either:
//     5.1.1) "Extracting" the index from an id assigned to the element in the HTML, or
//     5.1.2) Looping through the cached square elements using a for loop and breaking out when the current square element equals the event object's target.

function handleMove(evt) {
  const idx = parseInt(evt.target.id.replace('sq-', ''))

  //   5.2) If the board has a value at the index, immediately return because that square is already taken.
  //   5.3) If winner is not null, immediately return because the game is over.

  if (isNaN(idx) || board[idx] || winner) return
  //   5.4) Update the board array at the index with the value of turn.
  board[idx] = turn
  //   5.5) Flip turns by multiplying turn by -1 (flips a 1 to -1, and vice-versa).

  turn *= -1
  //   5.6) Set the winner variable if there's a winner:

  winner = getWinner()

  render()
  portalSound.play()
  portalSound.currentTime = 0
}
//     5.6.1) Loop through the each of the winning combination arrays defined.
//     5.6.2) Total up the three board positions using the three indexes in the current combo.
//     5.6.3) Convert the total to an absolute value (convert any negative total to positive).
//     5.6.4) If the total equals 3, we have a winner! Set winner to the board's value at the index specified by the first index in the combo array. Exit the loop
//   5.7) If there's no winner, check if there's a tie:
//     5.7.1) Set winner to 'T' if there are no more nulls in the board array.
//   5.8) All state has been updated, so render the state to the page (step 4.2).

function getWinner() {
  for (let i = 0; i < winningCombos.length; i++) {
    if (Math.abs(board[winningCombos[i][0]] + board[winningCombos[i][1]] + board[winningCombos[i][2]]) === 3) {
      result = board[winningCombos[i][0]]
      console.log(result, "here is our winner!")
      return result
    }
  }
  if (board.includes(null)) return null;
  return 'T'
}
