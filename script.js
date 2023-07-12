const cellElements = document.querySelectorAll('[data-cell]');
// cellElements is a nodelist that contains all the divs with the class cell

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], 
    [0, 3, 6],
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]
]
const board = document.getElementById('board');
// this selects the board div

x_class = 'x';
circle_class = 'circle';
let currTurn;

const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', startGame);

startGame();

function startGame(){
    // when the game is started , assign x_class to currTurn because the first turn is of x
    currTurn = x_class;
    document.getElementById('winningMessage').classList.remove('show');
    // for each cell in cellElements , attach a click event listener onto it which will listen for clicks (once : true) : means that it will only listen for the first click onto that cell
    cellElements.forEach((cell) => {
        cell.removeEventListener('click', handleClick);
        cell.classList.remove(x_class);
        cell.classList.remove(circle_class);
        cell.addEventListener('click', handleClick, {once : true})
    })
    // after adding all the eventlisteners to all the cells, set cellhovereffect is called which removes all the classes that should not be present in the board div and then assigns the currTurn class to the board div, setting the hover effect for whose turn it currently is 
    setCellHoverEffect();
}

function handleClick(e){
    // add mark
    addMark(e, currTurn);

    // check for win
    if(checkWin(currTurn)){
        
        showWinMsg(currTurn);
    }
    // check for draw
    else if(checkDraw()){
        showDrawMsg();
    }
    // if currTurn has not won, and it also is not a draw at this moment of time, then switch turns
    // switch turns
    switchTurns();
    setCellHoverEffect();
}

function addMark(element, currTurn){
    element.target.classList.add(currTurn);
}

function switchTurns(){
    if(currTurn === x_class) currTurn = circle_class;
    else currTurn = x_class;
}

function setCellHoverEffect() {
    board.classList.remove(x_class);
    board.classList.remove(circle_class);

    board.classList.add(currTurn);
}

function checkWin(currTurn){
    // returns true if even one of the combos possible has been achieved till now
    let flag2 = false;
    for(let i = 0; i<winningCombos.length; i++){
        let combo = winningCombos[i];
        
        let flag = true;

        for(let j = 0; j<combo.length; j++){
            let cellno = combo[j];
            
            // returns false if the current combo is definitely not been made
            if(cellElements[cellno].classList.contains(currTurn)){
                continue;
            }
            else {
                flag = false;
                break;
            }
        }

        // if the inner for loop does not set flag to false, then it must mean that for this combo, all the cells of this combo had the same mark applied to them, which means that the current turn has indeed won the game so we must set the outer flag = true and return the result
        // if the flag has been set to false, then the outer loop does not break and tries the next combination, if after trying all the combinations, the inner loop never once sets the flag to true, flag remains false throughout and the outer flag2 never gets set to true
        // and hence we can say that, no combination exists for which every cell contains the same mark,
        // and therefore no one has won the game till now so return false 

        if(flag){
            flag2 = flag;
            break;
        }
    }
    return flag2;
}

function showWinMsg(currTurn){
    let winMsg = document.querySelector('[data-winning-message-text]');
    winMsg.innerHTML = currTurn + " wins!";
    document.getElementById('winningMessage').classList.add('show');
}

function checkDraw() {

    // if all the cells in cellElements have been marked before, then return true
    // since cellElements is a nodeList, it does not have an .every method to it, we have to first convert it into an array
    // .every returns true if the callback function for it returns true for each element of the cellElements
    return [...cellElements].every(cell => {

        // return true if the cell in question contains a x_class or a circle class
        // essentially we are checking to see if the cell has already been marked before
        return cell.classList.contains(x_class) || cell.classList.contains(circle_class);
    })

    // so checkDraw returns true only if all the elements of the cellElements have either an xclass or a circle class applied to them
    // which means that all the moves have been made and no one has won yet, so it must mean the game has ended in a draw
}

function showDrawMsg() {
    let msg = document.querySelector('[data-winning-message-text]');
    msg.innerHTML = "It's a Draw!";
    document.getElementById('winningMessage').classList.add('show');
}