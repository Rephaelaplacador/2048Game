// console.log("Helo, World")
// declare all the variables need for the website

let board;
let score = 0;
let rows = 4;
let columns = 4;

// function to set Game Board
function setGame(){
    board = [ 
        // initialize 4x4 game board of tiles to 0
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    for (let r = 0; r<rows; r++){
        for(let c =0; c<columns; c++){

            let tile = document.createElement("div");

            // select a unique id for tile base on its coordinates
            tile.id = r.toString() + "-" + c.toString();

            let num = board[r][c];
            updateTile(tile,num);
            
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}
function updateTile(tile, num){
    // clear the tile
    tile.innerText = "";
    //  add clear classList to avoid multiple classes
    tile.classList.value ="";
    tile.classList.add("tile");

    if(num>0){
        tile.innerText = num.toString();
        // make another condition if the value are on its max value
        if(num <= 4096){
            tile.classList.add("x"+ num.toString());
        }else{
            tile.classList.add("x8192");
        }
    }
}

// auto invoke the setgame function after browser finished loading
window.onload = function(){
    setGame();
}

// function that will handle the user's keyboard when they press certain arrow keys

function handleSlide(e){
    // it monitors the key being clicked
    console.log(e.code);
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","keyW","KeyS","KeyA","KeyD"].includes(e.code)){
        if(e.code == "ArrowLeft" || e.code == "KeyA"){
            slideLeft();
            setTwo();
        }else if(e.code == "ArrowRight" || e.code == "KeyD"){
            slideRight();
            setTwo();
        }else if(e.code == "ArrowUp" || e.code == "KeyW"){
            slideUp();
            setTwo();
        }else if(e.code == "ArrowDown" || e.code == "KeyS"){
            slideDown();
            setTwo();
        }
    checkWin();
    if(hasLost()){
        // Timeout
        setTimeout(()=>{
            alert("Game Over! You have lost the game. Game will restart.");
            restartGame();
            alert("Click any arrow key to restart!")
        }, 100);
    }


    }
    // to update score
    document.getElementById("score").innerText = score 
}

// when any key is pressed, the handle slide function is invoke.
document.addEventListener("keydown", handleSlide);

function slideLeft(){
    // console.log("Slide left");
    for(let r = 0; r< rows; r++){
        let row = board[r];
        
        // contain the current row into the variable original row
        let originalRow = row.slice();
        
        row = slide(row);
        board[r] = row;
        for(let c =0; c < columns; c++){
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
            
            // this line responsible for animation slide left function
            if(originalRow[c] !== num && num !== 0){
                // indicates the animation style and the duration of it.
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(()=>{
                    tile.style.animation ="";
                },300);
            } 
        }
    }
}
function slideRight(){
    // console.log("Slide right");
    for(let r = 0; r< rows; r++){
        let row = board[r];
        // reverses the order of the elements in the row make it the tile sliides to the right

        let originalRow = row.slice();
        row.reverse();

        row = slide(row);

        row.reverse();
        board[r] = row;
        for(let c =0; c < columns; c++){
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);

            // animation line
            if(originalRow[c] !== num && num !==  0){
                tile.style.animation = " slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}
function slideUp(){
    // console.log("Slide upward");
    for(let c = 0;  c<columns; c++){
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]];

        let originalRow = row.slice();
        
        row = slide(row);

        // check which style have change in this column
        // this will records the current position of tiles that have change
        let changeIndices = [];
        for(let r = 0;r<rows;r++){
            if(originalRow[r] !== row[r]){
                changeIndices.push(r);
            }
        }

        for( let r = 0; r<rows;r++){
            board[r][c] = row[r];
            let tile =document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);

            if(changeIndices.includes(r) && num !== 0){
                tile.style.animation ="slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}
function slideDown(){
    // console.log("Slide downward");
    for(let c = 0;  c<columns; c++){
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]];
        
        let originalRow = row.slice();

        row.reverse();
        row = slide(row);
        row.reverse();

// animation
        let changeIndices = [];
        for(let r = 0; r<rows; r++){
            if(originalRow[r] !== row[r]){
                changeIndices.push(r);
            }
        }
        
        for( let r = 0; r<rows;r++){
            board[r][c] = row[r];
            let tile =document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);

            if(changeIndices.includes(r) && num !== 0){
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

// this function will filter out or remove the zero fisrt.
function filterZero(row){
    return row.filter(num => num !=0);
}

function slide(row){
    row = filterZero(row);
    
    for(let i = 0; i< row.length-1; i++){
        if(row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            // merger/ add score
            score += row[i];
        }
        
    }
    row = filterZero(row);
    while(row.length < columns){
        row.push(0);
    }
    return row;

}

function hasEmptyTile(){
    // iterate thru for loop

    for(let r = 0; r<rows; r++){
        for(let c = 0; c<columns;c++){
            if(board[r][0]==0){
                return true;
            }
        }
    }
    return false;
}
function setTwo(){
    if(!hasEmptyTile()){
        return;
    }
    // declare found variable
    let found = false;

    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c]==0){
            found = true;
            board[r][c] = 2;
            let tile = document.getElementById(r.toString()+"-"+ c.toString());

            tile.innerText ="2";
            tile.classList.add("x2");
        }   
    }
}


let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function checkWin(){
    for(let r = 0; r<rows; r++){
        for (let c = 0; c<columns; c++){
            // check if the current tile is equal to 2048 and higher
            if(board[r][c] == 2048 && is2048Exist == false){
                alert("You win, you got 2048");
                is2048Exist = true;
            }else if(board[r][c] == 4096 && is4096Exist == false){
                alert("You are unstoppable at 4096");
                is4096Exist = true;
            }else if(board[r][c] == 8192 && is8192Exist == false){
                alert("you got the highest value can be made greate job");
                is8192Exist = true;
            }
        }
    }
}

// this function will verify if the user lost the game

function hasLost(){
    for(let r = 0; r<rows;r++){
        for(let c = 0; c<columns; c++){
            // we checked whether there is an empty tile or none
            if(board[r][c]==0){
                return false;
            }
            const currentTile = board[r][c];
            // if there are adjacent tile for possible merging
            if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile) {
                    return false;
                }
        }
    }
    // no possible move left or empty tile
    return true;
}
// restarting the game functionality

function restartGame(){
    board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    score = 0;
    setTwo();
}


// gesture logic for the mobile devices

// declare variables for touch input
let startX = 0;
let startY = 0;

// event listener - this will listen when we touch the screen and assign the coordinates of the touch
document.addEventListener("touchstart",(e)=>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    console.log(startX,startY);
});
// this will check where you touch the screen to prevent scrolling
document.addEventListener('touchmove',(e)=>{
    if(!e.target.className.includes("tile")){
        return;
    }
    e.preventDefault(); //this line disable scrolling
},{passive:false});

// event that will listen to the touch end

document.addEventListener('touchend',(e)=>{
    // check if the element that triggered the event has a classname containing tile.
    if(!e.target.className.includes("tile")){
        return;
    }
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
        } else {
            slideDown(); // Call a function for sliding down
            setTwo(); // Call a function named "setTwo"
        }
    }
    document.getElementById("score").innerText = score;
    checkWin();
    if(hasLost()){
        // Timeout
        setTimeout(()=>{
            alert("Game Over! You have lost the game. Game will restart.");
            restartGame();
            alert("Click any arrow key to restart!")
        }, 100);
    }
});
