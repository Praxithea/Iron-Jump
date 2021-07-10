const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const ui = document.querySelector(".ui");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 620;

const CHARACTER_WIDTH = 110;
const CHARACTER_HEIGHT = 110;

const PLATFORM_WIDTH = 95;
const PLATFORM_HEIGHT = 35;

const GAP = CANVAS_HEIGHT / 5;

//variables will change
let score = 0;
let level = 0;
let isGameOver = 0;
let jumpTime = 40;
let message = "Game over";

//initial state of setting
// define elements
const initCharacter = {
  x: Math.round(CANVAS_WIDTH / 2),
  y: Math.round(CANVAS_HEIGHT / 2),
  speed: 5,
};
const initPlatforms = [
  {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH)),
    y: 0,
    speed: 1,
  },
  {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH)),
    y: GAP,
    speed: 1,
  },
  {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH)),
    y: 2 * GAP,
    speed: 1,
  },
  {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH)),
    y: 3 * GAP,
    speed: 1,
  },
  {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH)),
    y: 3 * GAP,
    speed: 1,
  },
  {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH)),
    y: 4 * GAP,
    speed: 1,
  },
];
//organizing code
let character = initCharacter;
let platforms = initPlatforms;
// drawing instruction
// draw character
function drawCharacter() {
  //draw shape

  if (characterReady) {
    ctx.drawImage(
      characterImage,
      character.x,
      character.y,
      CHARACTER_WIDTH,
      CHARACTER_HEIGHT
    );
  }
}
//draw platforms
function drawPlatforms() {
  //for loops
  for (let index = 0; index < platforms.length; index++) {
    const platform = platforms[index];
    //step draw platforms with shape

    if (platformReady) {
      ctx.drawImage(
        platformImage,
        platform.x,
        platform.y,
        PLATFORM_WIDTH,
        PLATFORM_HEIGHT
      );
    }
    //draw image
  }
}

//the update function
function update() {
  //check if game is over?
  if (isGameOver === true) {
    // let text = document.createElement("H1");
    // let context = document.createTextNode(message);
    // text.appendChild(context);
    // text.classList.add("reset");
    // ui.appendChild(text);
    document.querySelector('.music').pause()
    document.querySelector('.modal').style.display = 'block'
    document.querySelector('.modal').innerText = message
    return;
  }
  if (37 in keysDown) {
    // Player is holding left key

    character.x -= 10;
  }
  if (39 in keysDown) {
    // Player is holding right key

    character.x += 10;
  }
  //border detection
  if (character.x < -CHARACTER_WIDTH) {
    character.x = CANVAS_WIDTH;
  } else if (character.x > CANVAS_WIDTH) {
    character.x = -CHARACTER_WIDTH / 1;
  }
  // want to know when it die>?
  if (character.y > CANVAS_HEIGHT) {
    //gameover logic
    isGameOver = true;

    setTimeout(() => { window.location.reload() }, 2000) // refresh page after 2 secs
  
  }
  // detection of the jump
  for (let index = 0; index < platforms.length; index++) {
    const platform = platforms[index];
    // when to jump?
    if (
      character.y + CHARACTER_HEIGHT < platform.y + PLATFORM_HEIGHT && //if feet on top border of platform
      character.y + CHARACTER_HEIGHT >= platform.y && //if feet on bottom border of platform
      character.x >= platform.x - PLATFORM_WIDTH / 2 &&
      //if iron still not out the left of platform
      character.x <= platform.x + PLATFORM_WIDTH
      ///if iron still not out the rignt of platform
    ) {
      //then

      jumpTime = 50;

      //increase score

      score += 1;
      //when to increase level
      if (score % 15 === 0) {
        level += 1;
        character.speed += level / 3;
      }
      // when to end game
      if (score >= 120) {
        isGameOver = true;
        message = "YOU WIN!";
       setTimeout(() => { window.location.reload() }, 2000) // refresh page after 2 secs
  
      }
    }
  }

  if (character.y <= 0) {
    if (jumpTime > 5) {
      jumpTime = 5
    }
  
  }

  if (jumpTime > 0) {
    jumpTime -= 1;
    character.y -= 3;
  } else {
    character.y += 3;
  }

  for (let index = 0; index < platforms.length; index++) {
    const platform = platforms[index];

    platform.y += 1;

    if (platform.y >= CANVAS_HEIGHT) {
      platform.y = 0;
      platform.x = Math.floor(Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH));
      platform.speed += level / 3;
    }
  }
}

function intro() {
  let button = document.querySelector('.Start')
  button.addEventListener("click", function () {
    document.querySelector('.music').play()
    main();
    button.style.display = "none";
  });
}
// / Setup + load image
let characterImage, platformImage;
let characterReady, platformReady;
function loadImages() {
  //load platforms image
  platformImage = new Image();
  platformImage.onload = function () {
    platformReady = true;
  };
  platformImage.src = "platform.png";

  // show the hero image
  characterImage = new Image();
  characterImage.onload = function () {
    characterReady = true;
  };
  characterImage.src = "Ironman.png";
}

function main() {
  //clear the canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  update();
  requestAnimationFrame(main);
  drawPlatforms();
  drawCharacter();
  document.getElementById("score").innerHTML = score;
  document.getElementById("level").innerHTML = level;
}

//Javascript magic
let keysDown = {};
function setupKeyboardListeners() {
  addEventListener(
    "keydown",
    function (key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function (key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}




//execution
setupKeyboardListeners();
loadImages();
//main();
//to see intro use this below
intro()
//This magic tell the program to keep checking for update and re-render
let w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;
