import View from "./ttt-view"
import Game from "../ttt_node/game"
import { v4 as uuidv4 } from 'uuid';
import database from "./firebase";
import { collection, getDoc, doc, updateDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';


document.addEventListener("DOMContentLoaded", () => {

  const gameCode = JSON.parse(sessionStorage.getItem("gameCode"));
  const myId = JSON.parse(sessionStorage.getItem("myId"));
  
  // when paqge is refreshed, should maintain the sessionStorage 
  if (gameCode) {
      sessionStorage.setItem("gameCode", JSON.stringify(gameCode));
      document.getElementById('game-code').value = gameCode;
  } else {
      sessionStorage.setItem("gameCode", JSON.stringify(''));
      sessionStorage.setItem("gameActive", JSON.stringify(false));
  }

  if (myId) {
    sessionStorage.setItem("myId", JSON.stringify(myId));
  } else {
    sessionStorage.setItem("myId", JSON.stringify(uuidv4()));
  }

  if (myId && gameCode) {
    saveGameToFirestore(gameCode, myId);
  }


  function saveGameToFirestore(gameCode, myId) {
    const gameRef = doc(database, 'games', gameCode);
    getDoc(gameRef).then((snapshot) => {
        if (!snapshot.exists()) {
          setDoc(gameRef, {
              active: false,
              player1: myId,
              player2: null,
              board: [null, null, null, null, null, null, null, null, null]
          });
          listenForGameJoin(gameCode)
        }
    });
  }

  function lookForGameInFirestore(gameCode, myId) {
    const gameRef = doc(database, 'games', gameCode);
    getDoc(gameRef).then((snapshot) => {
        if (snapshot.exists() && snapshot.data().player1 !== myId && !snapshot.data().active) {
          // Game exists and it's not yours, (you have just found it), update it
          updateDoc(gameRef, {...snapshot.data(), player2: myId, active: true});
          sessionStorage.setItem("gameActive", JSON.stringify(true));
          sessionStorage.setItem("board", JSON.stringify(snapshot.data().board));
          sessionStorage.setItem("opponent", JSON.stringify(snapshot.data().player1));
        }
    });
  }


  function deleteOldGameFromDatabase(oldCode) {
    const gameRef = doc(database, 'games', oldCode);
    getDoc(gameRef).then((snapshot) => {
      if (snapshot.exists() && !snapshot.data().active) {
        deleteDoc(gameRef);
      }
    })
  }

  function listenForGameJoin(gameCode) {
    const gameRef = doc(database, 'games', gameCode);
  
    // Listen for changes in the game document
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const gameData = snapshot.data();
      if (gameData.active && gameData.player2) {
        console.log('Player 2 has joined the game!');
  
        // Store the relevant game info in session storage for Player 1
        sessionStorage.setItem("gameActive", JSON.stringify(true));
        sessionStorage.setItem("board", JSON.stringify(gameData.board));
        sessionStorage.setItem("opponent", JSON.stringify(gameData.player2));
  
        // You can stop listening after the game becomes active
        unsubscribe();
      }
    });
  }



  const copyText = () => {
    const copyIcon = document.getElementById('copy-text');
    const copyMessage = document.getElementById('copy-message');
    const code = document.getElementById('game-code').value
    setCopyState(copyIcon, copyMessage);
    copyToClipboard(code);
    setTimeout(() => resetState(copyIcon, copyMessage), 1000);
  }

  const setCopyState = (icon, message) => {
    icon.src = "assets/tick.svg";
    message.style.display = "block";
  }

  const resetState = (icon, message)  => {
      icon.src = "assets/copy-text.svg";
      message.style.display = "none";
  }

  const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  }

  document.getElementById('code-generate').addEventListener('click', ()=> {
    debugger
    const oldGameCode = JSON.parse(sessionStorage.getItem("gameCode"));
    if (oldGameCode.length !== 0){
      deleteOldGameFromDatabase(oldGameCode)
    }
    const gameCode = uuidv4().substr(0, 8).toUpperCase();
    document.getElementById('game-code').value = gameCode
    sessionStorage.setItem("gameCode", JSON.stringify(gameCode));
    saveGameToFirestore(gameCode, myId)
  })

  document.getElementById('code-find').addEventListener('click', ()=> {
    const oldGameCode = JSON.parse(sessionStorage.getItem("gameCode"));
    deleteOldGameFromDatabase(oldGameCode)
    const gameCode = document.getElementById('game-code').value;
    sessionStorage.setItem("gameCode", JSON.stringify(gameCode));
    lookForGameInFirestore(gameCode, myId)
  })


  document.getElementById('start-button').addEventListener('click', ()=> {
    const startEle = document.querySelector('.start-a-game');
    const startButton = document.getElementById('start-button')
    startButton.classList.add('hide');
    startEle.classList.remove('hide');
  })

  document.getElementById('join-button').addEventListener('click', ()=> {
    const findEle = document.querySelector('.find-a-game');
    const findButton = document.getElementById('join-button')
    findButton.classList.add('hide');
    findEle.classList.remove('hide');
  })


  const minimizeButtons = document.querySelectorAll('.minimize-button');
  minimizeButtons.forEach(button => {
      button.addEventListener('click', function() {
          if (this.getAttribute('data-type') === 'start') {
            const startEle = document.querySelector('.start-a-game');
            const startButton = document.getElementById('start-button')
            startEle.classList.add('hide');
            startButton.classList.remove('hide');
          } else if (this.getAttribute('data-type') === 'find') {
            const findEle = document.querySelector('.find-a-game');
            const findButton = document.getElementById('join-button')
            findEle.classList.add('hide');
            findButton.classList.remove('hide');
          }
      });
  });


  document.getElementById('copy-text').addEventListener('click', copyText);





  const game = new Game();
  const ele = document.querySelector(".ttt")

  const view = new View(game, ele)

  const ul = document.querySelector("ul")
  ul.addEventListener("click", (e) => {
    const square = e.target;
    const pos = JSON.parse(square.dataset.pos);

    
    if (square.classList.length === 0) {
      square.innerHTML = game.currentPlayer
      // console.log(game.currentPlayer)
      if (game.currentPlayer === "x") {
        square.classList.add("clickedX")
      } else {
        square.classList.add("clickedO")
      }
    }
    game.playMove(pos);

    if (game.board.isOver()) {
      let winner = game.winner() ||"undefined";
      setTimeout( () => {
        alert(`Player ${winner} wins!`), 5000});
        window.location.reload();
    }

  })



});