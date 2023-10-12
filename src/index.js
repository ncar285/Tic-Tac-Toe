import View from "./ttt-view"
import Game from "../ttt_node/game"
import { v4 as uuidv4 } from 'uuid';
import database from "./firebase";
import { collection, getDoc, doc, updateDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';


document.addEventListener("DOMContentLoaded", () => {

  
  // reset an active game session
  const gameActive = JSON.parse(sessionStorage.getItem("gameActive"));
  if (gameActive) {
    sessionStorage.setItem("gameActive", JSON.stringify(JSON.parse(sessionStorage.getItem("gameActive"))));
    sessionStorage.setItem("player", JSON.stringify(JSON.parse(sessionStorage.getItem("player"))));
    sessionStorage.setItem("currentGame", JSON.stringify(JSON.parse(sessionStorage.getItem("currentGame"))));
    sessionStorage.setItem("myId", JSON.stringify(JSON.parse(sessionStorage.getItem("myId"))));
  }

  // reset pre-game session

  let myId = JSON.parse(sessionStorage.getItem("myId"));
  
  if (!gameActive){
    const gameCode = JSON.parse(sessionStorage.getItem("gameCode"));
    if (gameCode) {
        sessionStorage.setItem("gameCode", JSON.stringify(gameCode));
        document.getElementById('game-code').value = gameCode;
    } else {
        sessionStorage.setItem("gameCode", JSON.stringify(''));
        sessionStorage.setItem("gameActive", JSON.stringify(false));
    }

    if (myId ) {
      sessionStorage.setItem("myId", JSON.stringify(myId));
    } else {
      myId = uuidv4();
      sessionStorage.setItem("myId", JSON.stringify(myId));
    }

    if (myId && gameCode) {
      saveGameToFirestore(gameCode, myId);
    }

    let joinGameCode = JSON.parse(sessionStorage.getItem("joinGameCode"));
    if (joinGameCode) {
        sessionStorage.setItem("joinGameCode", JSON.stringify(gameCode))
        document.getElementById('game-code-search').value = joinGameCode;
    } else {
        sessionStorage.setItem("joinGameCode", JSON.stringify(''));
    }
  
    if (myId && joinGameCode) {
      lookForGameInFirestore(joinGameCode, myId)
    }

  }


  

  




  function saveGameToFirestore(gameCode, myId) {
    const gameRef = doc(database, 'games', gameCode);
    getDoc(gameRef).then((snapshot) => {
        if (!snapshot.exists()) {
          setDoc(gameRef, {active: false, player1: myId});
          listenForGameJoin(gameCode)
        }
    });
  }


  function lookForGameInFirestore(gameCode, myId) {
    const gameRef = doc(database, 'games', gameCode);
    getDoc(gameRef).then((snapshot) => {
      if (snapshot.exists() && snapshot.data().player1 !== myId && !snapshot.data().active) {
        const gameData = snapshot.data()
        const activeGame = {
          active: true,
          player1: gameData.player1,
          player2: myId,
          board: [null, null, null, null, null, null, null, null, null]
        }
        updateDoc(gameRef, {...activeGame});
        startActiveGameSession(2)
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
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      const gameData = snapshot.data();
      if (gameData.active && gameData.player2) {
        startActiveGameSession(1)
        unsubscribe();
      }
    });
  }

  function listenForMove(gameCode) {
    const gameCode = JSON.stringify(JSON.parse(sessionStorage.getItem("currentGame")));
    const gameRef = doc(database, 'games', gameCode);
    
    const unsubscribe = gameRef.onSnapshot((doc) => {
        if (doc.exists) {
            const gameData = doc.data();


            
            // Here, you can check the gameData for changes in the board or any other property
            // For example, if you have a function called updateBoard to redraw the game, you can call:
            updateBoard(gameData.board);

            // If the game has ended or for any other reason you want to stop listening:
            // unsubscribe();
        } else {
            console.log("No such document!");
        }
    });
  }

  function startActiveGameSession(playerNum) {
    sessionStorage.setItem("player", JSON.stringify(playerNum));
    sessionStorage.setItem("gameActive", JSON.stringify(true));
    const gameCode = playerNum === 1 ? JSON.parse(sessionStorage.getItem("gameCode")) : document.getElementById('game-code-search').value;
    sessionStorage.setItem("currentGame", gameCode );
    sessionStorage.removeItem('gameCode')
    sessionStorage.removeItem('joinGameCode')
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
    const gameCode = document.getElementById('game-code-search').value;
    sessionStorage.setItem("joinGameCode", JSON.stringify(gameCode));
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