// // const uuidv4 = require("uuid/v9")
// import { v4 as uuidv4 } from 'uuid';

// document.addEventListener("DOMContentLoaded", () => {


// document.getElementById('code-generate').addEventListener('click', ()=> {
//     const codeInput = document.getElementById('game-code')
//     codeInput.value = uuidv4().substr(0, 8);
//   })

//   document.getElementById('copy-text').addEventListener('click',() => {
//     document.getElementById('copy-text').src = "assets/tick.svg"
//     document.getElementById('copy-message').style.display = "block"
//     setTimeout(()=>{
//       document.getElementById('copy-text').src = "assets/copy-text.svg"
//       document.getElementById('copy-message').style.display = "none"
//     }, 1000)
//   })

//   copyButton.addEventListener("click", () => {
//     const textToCopy = aiResponse.innerHTML;
//     const tempTextArea = document.createElement("textarea");
//     tempTextArea.value = textToCopy;
//     document.body.appendChild(tempTextArea);
//     tempTextArea.select();
//     document.execCommand("copy");
//     document.body.removeChild(tempTextArea);
//     alert("Text copied to clipboard!");
//   });


// });