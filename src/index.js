import View from "./ttt-view"
import Game from "../ttt_node/game"
import { v4 as uuidv4 } from 'uuid';

document.addEventListener("DOMContentLoaded", () => {

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
    const codeInput = document.getElementById('game-code')
    codeInput.value = uuidv4().substr(0, 8).toUpperCase();;
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