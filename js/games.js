let grid = 6;
const board = document.querySelector("#board");
let imageSrc = "img/main.jpg";

class puzzleGame {
  constructor(board, grid, imgSrc) {
    this.grid = grid;
    this.board = board;
    this.imgSrc = imgSrc;
    this.pieces = [];
    this.blankIndex;
    for (let i = 0; i < this.grid * this.grid; i++) {
      this.pieces.push(i);
    }
    this.game = [];
    for (let r = 0; r < this.grid; r++) {
      for (let c = 0; c < this.grid; c++) {
        let index = r * this.grid + c;
        let pieceIndex = this.pieces[index];
        let pieceRow = Math.floor(pieceIndex / this.grid);
        let pieceCol = pieceIndex % this.grid;
        const image = {
          width: this.board.clientWidth / this.grid + "px",
          height: this.board.clientHeight / this.grid + "px",
          backgroundPosition: `${
            (-pieceCol * this.board.clientWidth) / this.grid + "px"
          } ${(-pieceRow * this.board.clientHeight) / this.grid + "px"}`,
          backgroundSize: `${this.board.clientWidth}px ${this.board.clientHeight}px`,
          order: index,
        };
        this.game.push(image);
      }
    }
    this.game.sort(() => Math.random() - 0.5);
    this.mobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    this._appendImages(this.game);
    window.addEventListener("resize", () => {
      this._handleResize();
    });
    window.addEventListener("load", () => {
      this._handleResize();
    });
  }
  _handleResize() {
    this.board.querySelectorAll("#board > div").forEach((img, index) => {
      let r = Math.floor(index / this.grid);
      let c = index % this.grid;
      board.style.height = (this.board.clientWidth / this.grid) * grid + "px";
      img.style.width = this.board.clientWidth / this.grid + "px";
      img.style.height = this.board.clientWidth / this.grid + "px";
      img.style.top = (r * this.board.clientWidth) / this.grid + "px";
      img.style.left = (c * this.board.clientWidth) / this.grid + "px";
    });
  }
  _appendImages(array) {
    if (this.mobile) this.board.classList.add("mobile");
    array.forEach((image, index) => {
      let r = Math.floor(index / this.grid);
      let c = index % this.grid;
      let img = document.createElement("div");
      let span = document.createElement("span");
      img.style.backgroundImage = `url(${this.imgSrc})`;
      img.style.width = image.width;
      img.style.height = image.height;
      img.style.top = (r * this.board.clientHeight) / this.grid + "px";
      img.style.left = (c * this.board.clientWidth) / this.grid + "px";
      img.style.backgroundPosition = image.backgroundPosition;
      img.style.backgroundSize = image.backgroundSize;
      img.dataset.index = index;
      img.dataset.order = image.order;
      this.board.appendChild(img);
      span.textContent = image.order + 1;
      img.appendChild(span);
      // Add click event listener to move this.
      if (this.mobile) {
        img.addEventListener("touchend", () => {
          this._movePiece(img.dataset.index);
        });
      } else {
        img.addEventListener("click", () => {
          this._movePiece(img.dataset.index);
        });
      }
    });
    this._defineBlanket();
  }
  _defineBlanket() {
    let lastPiece = board.querySelector(
      `[data-order='${this.grid * this.grid - 1}']`
    );
    lastPiece.classList.add("blanket");
    this.blankIndex = +lastPiece.dataset.index;
  }
  _movePiece(clickedIndex) {
    // Find the current row and column of the clicked piece and the blank piece
    let clickedRow = Math.floor(clickedIndex / grid);
    let clickedCol = clickedIndex % grid;
    let blankRow = Math.floor(this.blankIndex / grid);
    let blankCol = this.blankIndex % grid;

    // Check if the clicked piece is horizontally or vertically adjacent to the blank piece
    if (
      (clickedRow === blankRow && Math.abs(clickedCol - blankCol) === 1) || // Horizontal adjacency
      (clickedCol === blankCol && Math.abs(clickedRow - blankRow) === 1) // Vertical adjacency
    ) {
      // Swap the positions of the clicked piece and the blank piece
      let clickedPiece = board.querySelector(`[data-index='${clickedIndex}']`);
      let blankPiece = board.querySelector(`[data-index='${this.blankIndex}']`);

      // Swap top and left positions
      let tempTop = clickedPiece.style.top;
      let tempLeft = clickedPiece.style.left;
      clickedPiece.style.top = blankPiece.style.top;
      clickedPiece.style.left = blankPiece.style.left;
      blankPiece.style.top = tempTop;
      blankPiece.style.left = tempLeft;

      // Swap the data-index attributes to reflect the new positions
      [clickedPiece.dataset.index, blankPiece.dataset.index] = [
        blankPiece.dataset.index,
        clickedPiece.dataset.index,
      ];

      // Swap the elements in the pieces array
      [this.pieces[clickedIndex], this.pieces[this.blankIndex]] = [
        this.pieces[this.blankIndex],
        this.pieces[clickedIndex],
      ];

      // Update the this.blankIndex to the new position of the blank piece
      this.blankIndex = clickedIndex;
      this._checkIfWin();
    }
  }
  _checkIfWin() {
    let allCorrect = true;

    this.board.querySelectorAll("#board > div").forEach((image) => {
      if (image.dataset.order !== image.dataset.index) {
        allCorrect = false;
      }
    });
    if (allCorrect) {
      board.classList.add("win");
    }
  }
  _solveGame() {
    this.board.querySelectorAll("#board > div").forEach((image) => {
      let r = Math.floor(+image.dataset.order / grid);
      let c = +image.dataset.order % grid;
      image.style.top = (r * this.board.clientHeight) / grid + "px";
      image.style.left = (c * this.board.clientWidth) / grid + "px";
      image.dataset.index = image.dataset.order;
    });
    this._checkIfWin();
  }
}
new puzzleGame(board, grid, imageSrc);
