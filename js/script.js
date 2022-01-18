const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

const bgImg = new Image();
bgImg.src = "../images/bg.png";

const flappyImg = new Image();
flappyImg.src = "../images/flappy.png";

const obsBottom = new Image();
obsBottom.src = '../images/obstacle_bottom.png';

const obsTop = new Image();
obsTop.src = '../images/obstacle_top.png';

const obstacles = [];
let frame = 0;
let myInterval = 0;

class Obstacle {
  constructor(argX, argY, argWidth, argHeight, argImg) {
    this.x = argX;
    this.y = argY;
    this.width = argWidth;
    this.height = argHeight;
    this.image = argImg;
    this.speedX = -4;
  };
  move() {
    this.x += this.speedX;
  };
  draw() {
    this.move();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  left() {
    return this.x;
  };
  right() {
    return this.x + this.width;
  };
  top() {
    return this.y;
  };
  bottom() {
    return this.y + this.height;
  };
}

const bgImgAnime = {
  img: bgImg,
  x: 0,
  speed: -3,
  move: function () {
    this.x += this.speed;
    this.x %= canvas.width;
  },
  draw: function () {
    this.move();
    ctx.drawImage(this.img, this.x, 0);
    if (this.speed < 0) {
      ctx.drawImage(this.img, this.x + canvas.width, 0);
    } else {
      ctx.drawImage(this.img, this.x - this.img.width, 0);
    }
  },
};

const flappy = {
  img: flappyImg,
  x: 50,
  y: canvas.height / 4,
  size: 8,
  gravity: 0.5,
  gravitySpeed: 1,
  jump: false,
  width: function () {
    return this.img.width / this.size;
  },
  height: function () {
    return this.img.height / this.size;
  },
  update: function () {
    if (this.jump) {
      this.gravitySpeed = -8;
    } else {
      this.gravitySpeed += this.gravity;
    }
    this.y += this.gravitySpeed;
  },
  draw: function () {
    this.update();
    ctx.drawImage(this.img, this.x, this.y, this.width(), this.height());
  },
  left: function () {
    return this.x;
  },
  right: function () {
    return this.x + this.width();
  },
  top: function () {
    return this.y;
  },
  bottom: function () {
    return this.y + this.height();
  },
  collision: function (obstacle) {
    return (
      this.left() < obstacle.right() &&
      this.right() > obstacle.left() &&
      this.top() < obstacle.bottom() &&
      this.bottom() > obstacle.top()
    );
  },
};

window.onload = function () {
  document.getElementById("start-button").onclick = function () {
    document.getElementById("start-button").disabled = true;
    startGame();
  };
};

function startGame() {
  myInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bgImgAnime.draw();
    updateObstacles();
    flappy.draw();
    checkForCollision();
    outOfBounds();
  }, 20);
}

function checkForCollision() {
  const collision = obstacles.some((obstacle) => {
    return flappy.collision(obstacle);
  });
  if (collision) {
    clearInterval(myInterval);
  };
}

function updateObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.draw();
  });
  frame++;
  if (frame % 100 === 0) {
    const gap = randomIntFromInterval(160, 180);
    const gapPos = randomIntFromInterval(50, 300);
    obstacles.push(
      new Obstacle(canvas.width, 0, 100, gapPos, obsTop),
      new Obstacle(
        canvas.width,
        gapPos + gap,
        100,
        canvas.height - gapPos - gap,
        obsBottom
      )
    );
  }
}

function outOfBounds() {
  if (flappy.top() <= 0 || flappy.bottom() >= 504){
    clearInterval(myInterval);
  };
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    flappy.jump = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    flappy.jump = false;
  }
});