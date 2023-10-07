import View from "./ttt-view"
import Game from "../ttt_node/game"
import { v4 as uuidv4 } from 'uuid';
import database from "./firebase";
import { collection, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';


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
        if (snapshot.exists()) {
          // Game exists, and you have just found it, update it
          updateDoc(gameRef, {...snapshot.data(), player2: myId, active: true});
        } else {
          // If game doesn't exist, initialize one
          setDoc(gameRef, {
              active: false,
              player1: myId,
              player2: null,
              board: [null, null, null, null, null, null, null, null, null]
          });
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
    const gameCode = uuidv4().substr(0, 8).toUpperCase();
    document.getElementById('game-code').value = gameCode
    sessionStorage.setItem("gameCode", JSON.stringify(gameCode));
    saveGameToFirestore(gameCode, myId)
  })

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