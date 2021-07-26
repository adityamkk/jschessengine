
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function coordToNum(coord) {
  switch(coord.charAt(0)){
    case 'a':
      return 8*(8-parseInt(coord.charAt(1))) + 0;
    case 'b':
      return 8*(8-parseInt(coord.charAt(1))) + 1;
    case 'c':
      return 8*(8-parseInt(coord.charAt(1))) + 2;
    case 'd':
      return 8*(8-parseInt(coord.charAt(1))) + 3;
    case 'e':
      return 8*(8-parseInt(coord.charAt(1))) + 4;
    case 'f':
      return 8*(8-parseInt(coord.charAt(1))) + 5;
    case 'g':
      return 8*(8-parseInt(coord.charAt(1))) + 6;
    case 'h':
      return 8*(8-parseInt(coord.charAt(1))) + 7;
  }
}

function numToCoord(num) {
  if(num < 0){
    return;
  }
  switch(num%8){
    case 0:
      return 'a' + (8 - Math.floor(num/8)).toString();
    case 1:
      return 'b' + (8 - Math.floor(num/8)).toString();
    case 2:
      return 'c' + (8 - Math.floor(num/8)).toString();
    case 3:
      return 'd' + (8 - Math.floor(num/8)).toString();
    case 4:
      return 'e' + (8 - Math.floor(num/8)).toString();
    case 5:
      return 'f' + (8 - Math.floor(num/8)).toString();
    case 6:
      return 'g' + (8 - Math.floor(num/8)).toString();
    case 7:
      return 'h' + (8 - Math.floor(num/8)).toString();
  }
}

function moveValue(source, target, color, oldPos) {
  //Returns a number based on how good a move is with depth 1
  let totalPoints = 0;
  if(oldPos[target].charAt(0) === 'b') {
    switch(oldPos[target].charAt(1)) {
      case 'P': totalPoints = totalPoints + 1; break;
      case 'N': totalPoints = totalPoints + 3; break;
      case 'K': totalPoints = totalPoints + 1000; break;
      case 'R': totalPoints = totalPoints + 5; break;
      case 'B': totalPoints = totalPoints + 3; break;
      case 'Q': totalPoints = totalPoints + 9; break;
    }
  }
  return totalPoints;
}

//Piece functions
let moveValidation = {
  checkIfPawn: function (source, target, color, oldPos) {
    let token = 0;
    let opcolor = '';
    if(color == 'w') {
      token = 1;
      opcolor = 'b';
    } else {
      token = -1;
      opcolor = 'w';
    }
    if(oldPos[source].charAt(1) === 'P'){
      if(!(((coordToNum(target) === coordToNum(source)-8*token && String(oldPos[target]).charAt(0) != opcolor) ||
          (coordToNum(target) === coordToNum(source)-16*token && source.charAt(1) === `${4.5 - 2.5*token}` && String(oldPos[target]).charAt(0) != opcolor && String(oldPos[(coordToNum(target)+8).toString()]).charAt(0) != opcolor) ||
          (coordToNum(target) === coordToNum(source)-7*token && String(oldPos[target]).charAt(0) === opcolor) ||
          (coordToNum(target) === coordToNum(source)-9*token && String(oldPos[target]).charAt(0) === opcolor)) &&
          ((coordToNum(source)%8 - coordToNum(target)%8)**2 + (Math.floor(coordToNum(source)/8) - Math.floor(coordToNum(target)/8))**2 <= 5))){
        return 'snapback';
      }
    }
  },

  checkIfKnight: function (source, target, color, oldPos) {
    if(oldPos[source].charAt(1) === 'N'){
      if(!(((coordToNum(target) === coordToNum(source)-17) ||
          (coordToNum(target) === coordToNum(source)-15) ||
          (coordToNum(target) === coordToNum(source)-10) ||
          (coordToNum(target) === coordToNum(source)-6) ||
          (coordToNum(target) === coordToNum(source)+6) ||
          (coordToNum(target) === coordToNum(source)+10) ||
          (coordToNum(target) === coordToNum(source)+15) ||
          (coordToNum(target) === coordToNum(source)+17)) && 
          ((coordToNum(source)%8 - coordToNum(target)%8)**2 + (Math.floor(coordToNum(source)/8) - Math.floor(coordToNum(target)/8))**2 <= 5))){
        return 'snapback';
      }
    }
  },

  checkIfKing: function (source, target, color, oldPos) {
    if(oldPos[source].charAt(1) === 'K'){
      if(!((coordToNum(target) === coordToNum(source)-9) ||
          (coordToNum(target) === coordToNum(source)-8) ||
          (coordToNum(target) === coordToNum(source)-7) ||
          (coordToNum(target) === coordToNum(source)-1) ||
          (coordToNum(target) === coordToNum(source)+1) ||
          (coordToNum(target) === coordToNum(source)+7) ||
          (coordToNum(target) === coordToNum(source)+8) ||
          (coordToNum(target) === coordToNum(source)+9))){
        return 'snapback';
      }
    }
  },

  checkIfRook: function (source, target, color, oldPos) {
    if(oldPos[source].charAt(1) === 'R'){
      if(!((Math.floor(coordToNum(source)/8) === Math.floor(coordToNum(target)/8)) ||
            coordToNum(source)%8 === coordToNum(target)%8)){
        return 'snapback';
      } else if(Math.floor(coordToNum(source)/8) === Math.floor(coordToNum(target)/8)){
          if(coordToNum(source)-coordToNum(target) > 0){
            for(var i = coordToNum(source)-1;i>coordToNum(target);i--){
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                return 'snapback';
              }
            }
          } else {
              for(var i = coordToNum(source)+1;i<coordToNum(target);i++){
                if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                  return 'snapback';
                }
              }
          }
      } else if(coordToNum(source)%8 === coordToNum(target)%8){
        if(coordToNum(source)-coordToNum(target) > 0){
          for(var i = coordToNum(source)-8;i>coordToNum(target);i=i-8){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        } else {
            for(var i = coordToNum(source)+8;i<coordToNum(target);i=i+8){
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                return 'snapback';
              }
            }
        }
      }
    }
  },

  checkIfBishop: function (source, target, color, oldPos) {
    if(oldPos[source].charAt(1) === 'B'){
      if(!(Math.abs(Math.floor(coordToNum(target)/8)-Math.floor(coordToNum(source)/8)) === 
          Math.abs(coordToNum(target)%8-coordToNum(source)%8))){
        return 'snapback';
      } else if(Math.floor(coordToNum(target)/8) < Math.floor(coordToNum(source)/8)){
        if(coordToNum(target)%8 > coordToNum(source)%8){
          for(var i = coordToNum(source)-7;i>coordToNum(target);i=i-7){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        } else {
          for(var i = coordToNum(source)-9;i>coordToNum(target);i=i-9){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        }
      } else {
        if(coordToNum(target)%8 > coordToNum(source)%8){
          for(var i = coordToNum(source)+9;i<coordToNum(target);i=i+9){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        } else {
          for(var i = coordToNum(source)+7;i<coordToNum(target);i=i+7){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        }
      }
    }
  },

  checkIfQueen: function (source, target, color, oldPos) {
    if(oldPos[source].charAt(1) === 'Q'){
      if(!((Math.abs(Math.floor(coordToNum(target)/8)-Math.floor(coordToNum(source)/8)) === 
          Math.abs(coordToNum(target)%8-coordToNum(source)%8))||(Math.floor(coordToNum(source)/8) === Math.floor(coordToNum(target)/8)) ||
          coordToNum(source)%8 === coordToNum(target)%8)){
        return 'snapback';
      } else if(Math.floor(coordToNum(source)/8) === Math.floor(coordToNum(target)/8)){
        if(coordToNum(source)-coordToNum(target) > 0){
          for(var i = coordToNum(source)-1;i>coordToNum(target);i--){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        } else {
            for(var i = coordToNum(source)+1;i<coordToNum(target);i++){
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                return 'snapback';
              }
            }
        }
      } else if(coordToNum(source)%8 === coordToNum(target)%8){
        if(coordToNum(source)-coordToNum(target) > 0){
          for(var i = coordToNum(source)-8;i>coordToNum(target);i=i-8){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        } else {
            for(var i = coordToNum(source)+8;i<coordToNum(target);i=i+8){
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                return 'snapback';
              }
            }
        }
      } else if(Math.floor(coordToNum(target)/8) < Math.floor(coordToNum(source)/8)){
        if(coordToNum(target)%8 > coordToNum(source)%8){
          for(var i = coordToNum(source)-7;i>coordToNum(target);i=i-7){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        } else {
          for(var i = coordToNum(source)-9;i>coordToNum(target);i=i-9){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        }
      } else {
        if(coordToNum(target)%8 > coordToNum(source)%8){
          for(var i = coordToNum(source)+9;i<coordToNum(target);i=i+9){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        } else {
          for(var i = coordToNum(source)+7;i<coordToNum(target);i=i+7){
            if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
              return 'snapback';
            }
          }
        }
      }
    }
  },
  
};

let previousPosition = '';
let stopAllMoves = false;

function onDragStart(source, piece, position, orientation) {
  if(stopAllMoves){
    return 'snapback';
  }
  if ((orientation === 'white' && piece.search(/^w/) === -1) ||
      (orientation === 'black' && piece.search(/^b/) === -1)) {
        return false;
      }
}

function onDrop (source,target,piece,newPos,oldPos,orientation) {
  if(stopAllMoves){
    return 'snapback';
  }
  console.log('Drag ended:');
  console.log('Source: ' + source);
  console.log('End:' + target);
  console.log('Piece: ' + piece);
  console.log('New Position: ' + Chessboard.objToFen(newPos));
  console.log('Old Position: ' + Chessboard.objToFen(oldPos));
  console.log('Orientation: ' + orientation);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  
  //White Piece
  if(orientation === 'white'){
    if(String(oldPos[target]).charAt(0) === 'w'){return 'snapback';}
    //Pawn
    moveValidation.checkIfPawn(source, target, 'w', oldPos);
    //Knight
    moveValidation.checkIfKnight(source, target, 'w', oldPos);
    //King
    moveValidation.checkIfKing(source, target, 'w', oldPos);
    //Rook
    moveValidation.checkIfRook(source, target, 'w', oldPos);
    //Bishop
    moveValidation.checkIfBishop(source, target, 'w', oldPos);
    //Queen
    moveValidation.checkIfQueen(source, target, 'w', oldPos);
  }

  //Black Piece
  if(orientation === 'black'){
    let newPosEntries = Object.entries(newPos);
    let blackPiecePos = [];

    for(let [pos,piece] of newPosEntries) {
      if(piece.includes('b')){
        blackPiecePos.push(pos);
      }
    };
    console.log(blackPiecePos);
    let isLegal = false;
    let sourceTile = '';
    let targetTile = '';

    /* AI generated random moves
    let newPosEntries = Object.entries(newPos);
    let blackPiecePos = [];

    for(let [pos,piece] of newPosEntries) {
      if(piece.includes('b')){
        blackPiecePos.push(pos);
      }
    };
    console.log(blackPiecePos);
    let isLegal = false;
    let sourceTile = '';
    let targetTile = '';

    while(isLegal === false) {
      sourceTile = blackPiecePos[getRandomInt(blackPiecePos.length)];
      targetTile = numToCoord(getRandomInt(64));

      console.log(`${sourceTile}-${targetTile}`);

      if(String(oldPos[targetTile]).charAt(0) === 'b'){continue;}
      //Pawn
      if(moveValidation.checkIfPawn(sourceTile, targetTile, 'b', oldPos) == 'snapback') {
        continue;
      }
      //Knight
      if(moveValidation.checkIfKnight(sourceTile, targetTile, 'b', oldPos) == 'snapback') {
        continue;
      };
      //King
      if(moveValidation.checkIfKing(sourceTile, targetTile, 'b', oldPos) == 'snapback') {
        continue;
      };
      //Rook
      if(moveValidation.checkIfRook(sourceTile, targetTile, 'b', oldPos) == 'snapback') {
        continue;
      };
      //Bishop
      if(moveValidation.checkIfBishop(sourceTile, targetTile, 'b', oldPos) == 'snapback') {
        continue;
      };
      //Queen
      if(moveValidation.checkIfQueen(sourceTile, targetTile, 'b', oldPos) == 'snapback') {
        continue;
      };
      isLegal = true;
    };
    
    if(isLegal) {board.move(`${sourceTile}-${targetTile}`)};
    */
    /* Two player
    if(String(oldPos[target]).charAt(0) === 'b'){return 'snapback';}
    //Pawn
    moveValidation.checkIfPawn(source, target, 'b', oldPos);
    //Knight
    moveValidation.checkIfKnight(source, target, 'b', oldPos);
    //King
    moveValidation.checkIfKing(source, target, 'b', oldPos);
    //Rook
    moveValidation.checkIfRook(source, target, 'b', oldPos);
    //Bishop
    moveValidation.checkIfBishop(source, target, 'b', oldPos);
    //Queen
    moveValidation.checkIfBishop(source, target, 'b', oldPos);
    */
  }
  
  //Display the buttons
  document.getElementById('confirm').style.display = 'inline-block';
  document.getElementById('back').style.display = 'inline-block';

  //Set the previous position
  previousPosition = Chessboard.objToFen(oldPos);
  stopAllMoves = true;
}

let config = {
  draggable: true,
  position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  onDragStart: onDragStart,
  onDrop: onDrop,
  sparePieces: true
}
let board = Chessboard('myBoard', config);

//Confirm Buttons
$('#confirm').on('click', function(){
  //Flip the Orientation of the Board
  sleep(300);
  console.log('flipped!');
  board.flip();

  //Hide the buttons
  document.getElementById('confirm').style.display = 'none';
  document.getElementById('back').style.display = 'none';

  stopAllMoves = false;
});

//Back Button
$('#back').on('click', function(){
  board.position(previousPosition, true);
  document.getElementById('confirm').style.display = 'none';
  document.getElementById('back').style.display = 'none';

  stopAllMoves = false;
})