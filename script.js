var backgroundImage = new Image();
backgroundImage.src = "back.jpg";
const restartButton = document.getElementById("restartButton");
let gameOver = false;
let myGamePiece;
let myObstacles = [];
let myScore;
let score = 0;
let gameInterval;
let level;
let vitesse = -3;
let distance = 60;

window.addEventListener("load", () => {
  document.getElementById("startGame").addEventListener("click", function () {
    this.style.display = "none";
    img = document.getElementById("backG").style.display = "none";
    document.getElementById("flappyCanvas").style.display = "block";

    startGame();
  });

  document.forms["form"].addEventListener("change", () => {
    level = document.forms["form"]["level"].value;
    if (level === "easy") {
      vitesse = -3;
      distance = 70;
    } else if (level === "medium") {
      vitesse = -4;
      distance = 45;
    } else if (level === "hard") {
      vitesse = -4;
      distance = 30;
    }
  });
});

function startGame() {
  clearInterval(gameInterval);
  myGameArea.start();
  backgroundImage.src = "back2.png";
  myGamePiece = new Component(30, 30, "flappy-bird.png", 10, 120, "image");
  myGamePiece.gravity = 0.05;
  myScore = new Component("40px", "flappy", "black", 280, 40, "text");

  myObstacles = [];
  hideRestartButton();
  gameOver = false;
  score = 0;
}

function hideRestartButton() {
  restartButton.style.display = "none";
}

const myGameArea = {
  canvas: document.getElementById("flappyCanvas"),
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    gameInterval = setInterval(updateGameArea, 20);

    window.addEventListener("keydown", function (e) {
      if (e.keyCode == 32) accelerate(-0.6);
    });

    window.addEventListener("keyup", function (e) {
      if (e.keyCode == 32) accelerate(0.15);
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

class Component {
  constructor(width, height, color, x, y, type) {
    this.type = type;
    this.image = new Image();
    this.image.src = color;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
  }

  update() {
    const ctx = myGameArea.context;
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
    } else if (this.type === "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  newPos() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  }

  hitBottom() {
    const rockTop = 0;
    const rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom || this.y < rockTop) {
      this.y = myGameArea.canvas.height / 2;
      this.gravitySpeed = 0;
      if (!gameOver) {
        gameOver = true;
        showRestartButton();
      }
    }
  }

  crashWith(otherobj) {
    const myleft = this.x;
    const myright = this.x + this.width;
    const mytop = this.y;
    const mybottom = this.y + this.height;
    const otherleft = otherobj.x;
    const otherright = otherobj.x + otherobj.width;
    const othertop = otherobj.y;
    const otherbottom = otherobj.y + otherobj.height;
    if (myleft > otherleft) {
      if (otherleft == 0) score += 0.5;
    }
    return (
      mybottom > othertop &&
      mytop < otherbottom &&
      myright > otherleft &&
      myleft < otherright
    );
  }
}

function updateGameArea() {
  if (!gameOver) {
    for (let i = 0; i < myObstacles.length; i++) {
      if (myGamePiece.crashWith(myObstacles[i])) {
        gameOver = true;
        showRestartButton();
        return;
      }
    }

    myGameArea.clear();
    myGameArea.context.drawImage(
      backgroundImage,
      0,
      0,
      myGameArea.canvas.width,
      myGameArea.canvas.height
    );

    myGameArea.frameNo++;

    if (myGameArea.frameNo === 1 || everyInterval(distance)) {
      const x = myGameArea.canvas.width;
      const minHeight = 20;
      const maxHeight = 200;
      const height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
      const minGap = 50;
      const maxGap = 200;
      const gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(
        new Component(30, height, "pipe-down.png", x, 0, "image")
      );
      myObstacles.push(
        new Component(
          30,
          x - height - gap,
          "pipe-up.png",
          x,
          height + gap,
          "image"
        )
      );
    }

    for (let i = 0; i < myObstacles.length; i++) {
      myObstacles[i].x += vitesse; //vitesse apparition des obs
      myObstacles[i].update();
    }

    myScore.text = "SCORE: " + score;
    myScore.update();

    myGamePiece.newPos();
    myGamePiece.update();
  }
}

//distance apparition entre obs
function everyInterval(n) {
  return myGameArea.frameNo % n === 0;
}

function accelerate(n) {
  myGamePiece.gravity = n;
}

function showRestartButton() {
  restartButton.style.display = "block";
  restartButton.onclick = startGame;
}
