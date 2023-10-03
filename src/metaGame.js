const uuidv4 = require("uuid/v9")

document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById('code-generate').addEventListener('click', (e)=> {
        const codeInput = document.getElementById('game-code')
        codeInput.value = uuidv4()
    })

});