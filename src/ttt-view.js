class View {
  constructor(game, el) {
    this.game = game;
    this.el = el
    this.setupBoard()
    // console.log(this.el)
  }
  
  setupBoard() {
    const gridView = document.createElement("ul");

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const square = document.createElement("li");
        square.dataset.pos = JSON.stringify([i, j])
        gridView.append(square)
      }
    }
    this.el.append(gridView)
    // console.log(gridView)
  }
  
  handleClick(e) {
    //* set target variable
    //* call makeMove
    e.target.makeMove()

    //add onto ul
    //which li got clicked on(dataset.pos)
    //make sure pos is valid
    //if valid change content: x/o, innerHTML
  }

  makeMove(square) {

  }
  
  handleGameOver() {
  }
}

export default View;