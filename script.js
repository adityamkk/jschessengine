
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
    if(piece.charAt(1) === 'P'){
      if(!((coordToNum(target) === coordToNum(source)-8 && String(oldPos[target]).charAt(0) != 'b') ||
          (coordToNum(target) === coordToNum(source)-16 && source.charAt(1) === '2' && String(oldPos[target]).charAt(0) != 'b' && String(oldPos[(coordToNum(target)+8).toString()]).charAt(0) != 'b') ||
          (coordToNum(target) === coordToNum(source)-7 && String(oldPos[target]).charAt(0) === 'b') ||
          (coordToNum(target) === coordToNum(source)-9 && String(oldPos[target]).charAt(0) === 'b'))){
        return 'snapback';
      }
    }
    //Knight
    if(piece.charAt(1) === 'N'){
      console.log( (coordToNum(source)%8 - coordToNum(target)%8)**2 + (Math.floor(coordToNum(source)/8) - Math.floor(coordToNum(target)/8))**2);
      if(!(((coordToNum(target) === coordToNum(source)-17) ||
          (coordToNum(target) === coordToNum(source)-15) ||
          (coordToNum(target) === coordToNum(source)-10) ||
          (coordToNum(target) === coordToNum(source)-6) ||
          (coordToNum(target) === coordToNum(source)+6) ||
          (coordToNum(target) === coordToNum(source)+10) ||
          (coordToNum(target) === coordToNum(source)+15) ||
          (coordToNum(target) === coordToNum(source)+17)) && 
          ( (coordToNum(source)%8 - coordToNum(target)%8)**2 + (Math.floor(coordToNum(source)/8) - Math.floor(coordToNum(target)/8))**2 <= 5))){
        return 'snapback';
      }
    }
    //King
    if(piece.charAt(1) === 'K'){
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
    //Rook
    if(piece.charAt(1) === 'R'){
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
    //Bishop
    if(piece.charAt(1) === 'B'){
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
    //Queen
    if(piece.charAt(1) === 'Q'){
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
  }

  //Black Piece
  if(orientation === 'black'){
    console.log(coordToNum('a6'));
    console.log(coordToNum('h5'));
    console.log(newPos)
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
      if(oldPos[sourceTile].charAt(1) === 'P'){
        if(!((coordToNum(targetTile) === coordToNum(sourceTile)+8 && String(oldPos[targetTile]).charAt(0) != 'w') ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+16 && sourceTile.charAt(1) === '7' && String(oldPos[targetTile]).charAt(0) != 'w' && String(oldPos[(coordToNum(targetTile)-8).toString()]).charAt(0) != 'w') ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+7 && String(oldPos[targetTile]).charAt(0) === 'w') ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+9 && String(oldPos[targetTile]).charAt(0) === 'w'))){
          continue;
        }
      }
      //Knight
      if(oldPos[sourceTile].charAt(1) === 'N'){
        if(!(((coordToNum(targetTile) === coordToNum(sourceTile)-17) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)-15) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)-10) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)-6) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+6) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+10) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+15) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+17)) &&
            ((coordToNum(sourceTile)%8 - coordToNum(targetTile)%8)**2 + (Math.floor(coordToNum(sourceTile)/8) - Math.floor(coordToNum(sourceTile)/8))**2 <= 5))){
          continue;
        }
      }
      //King
      if(oldPos[sourceTile].charAt(1) === 'K'){
        if(!((coordToNum(targetTile) === coordToNum(sourceTile)-9) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)-8) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)-7) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)-1) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+1) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+7) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+8) ||
            (coordToNum(targetTile) === coordToNum(sourceTile)+9))){
          continue;
        }
      }
      //Rook
      if(oldPos[sourceTile].charAt(1) === 'R'){
        if(!((Math.floor(coordToNum(sourceTile)/8) === Math.floor(coordToNum(targetTile)/8)) ||
              coordToNum(sourceTile)%8 === coordToNum(targetTile)%8)){
          continue;
        } else if(Math.floor(coordToNum(sourceTile)/8) === Math.floor(coordToNum(targetTile)/8)){
            if(coordToNum(sourceTile)-coordToNum(targetTile) > 0){
              for(var i = coordToNum(sourceTile)-1;i>coordToNum(targetTile);i--){
                console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
                if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                  console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                  break;
                }
                else
                {
                  console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                }
              }
              continue;
            } else {
                for(var i = coordToNum(sourceTile)+1;i<coordToNum(targetTile);i++){
                  console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
                  if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                    console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                    break;
                  }
                  else
                  {
                    console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                  }
                }
                continue;
            }
        } else if(coordToNum(sourceTile)%8 === coordToNum(targetTile)%8){
          if(coordToNum(sourceTile)-coordToNum(targetTile) > 0){
            for(var i = coordToNum(sourceTile)-8;i>coordToNum(targetTile);i=i-8){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          } else {
              for(var i = coordToNum(sourceTile)+8;i<coordToNum(targetTile);i=i+8){
                console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
                if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                  console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                  break;
                }
                else
                {
                  console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                }
              }
              continue;
          }
        }
      }
      //Bishop
      if(oldPos[sourceTile].charAt(1) === 'B'){
        if(!(Math.abs(Math.floor(coordToNum(targetTile)/8)-Math.floor(coordToNum(sourceTile)/8)) === 
            Math.abs(coordToNum(targetTile)%8-coordToNum(sourceTile)%8))){
          continue;
        } else if(Math.floor(coordToNum(targetTile)/8) < Math.floor(coordToNum(sourceTile)/8)){
          if(coordToNum(targetTile)%8 > coordToNum(sourceTile)%8){
            for(var i = coordToNum(sourceTile)-7;i>coordToNum(targetTile);i=i-7){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          } else {
            for(var i = coordToNum(sourceTile)-9;i>coordToNum(targetTile);i=i-9){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          }
        } else {
          if(coordToNum(targetTile)%8 > coordToNum(sourceTile)%8){
            for(var i = coordToNum(sourceTile)+9;i<coordToNum(targetTile);i=i+9){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          } else {
            for(var i = coordToNum(sourceTile)+7;i<coordToNum(targetTile);i=i+7){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          }
        }
      }
      //Queen
      if(oldPos[sourceTile].charAt(1) === 'Q'){
        if(!((Math.abs(Math.floor(coordToNum(targetTile)/8)-Math.floor(coordToNum(sourceTile)/8)) === 
            Math.abs(coordToNum(targetTile)%8-coordToNum(sourceTile)%8))||(Math.floor(coordToNum(sourceTile)/8) === Math.floor(coordToNum(targetTile)/8)) ||
            coordToNum(sourceTile)%8 === coordToNum(targetTile)%8)){
          continue;
        } else if(Math.floor(coordToNum(sourceTile)/8) === Math.floor(coordToNum(targetTile)/8)){
          if(coordToNum(sourceTile)-coordToNum(targetTile) > 0){
            for(var i = coordToNum(sourceTile)-1;i>coordToNum(targetTile);i--){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          } else {
              for(var i = coordToNum(sourceTile)+1;i<coordToNum(targetTile);i++){
                console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
                if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                  console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                  break;
                }
                else
                {
                  console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                }
              }
              continue;
          }
        } else if(coordToNum(sourceTile)%8 === coordToNum(targetTile)%8){
          if(coordToNum(sourceTile)-coordToNum(targetTile) > 0){
            for(var i = coordToNum(sourceTile)-8;i>coordToNum(targetTile);i=i-8){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          } else {
              for(var i = coordToNum(sourceTile)+8;i<coordToNum(targetTile);i=i+8){
                console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
                if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                  console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                  break;
                }
                else
                {
                  console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                }
              }
              continue;
          }
        } else if(Math.floor(coordToNum(targetTile)/8) < Math.floor(coordToNum(sourceTile)/8)){
          if(coordToNum(targetTile)%8 > coordToNum(sourceTile)%8){
            for(var i = coordToNum(sourceTile)-7;i>coordToNum(targetTile);i=i-7){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          } else {
            for(var i = coordToNum(sourceTile)-9;i>coordToNum(targetTile);i=i-9){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          }
        } else {
          if(coordToNum(targetTile)%8 > coordToNum(sourceTile)%8){
            for(var i = coordToNum(sourceTile)+9;i<coordToNum(targetTile);i=i+9){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue
          } else {
            for(var i = coordToNum(sourceTile)+7;i<coordToNum(targetTile);i=i+7){
              console.log(`${numToCoord(i)} and oldPos[numToCoord(i)] = ${String(oldPos[numToCoord(i)]).charAt(0)}`);
              if(String(oldPos[numToCoord(i)]).charAt(0) == 'b' || String(oldPos[numToCoord(i)]).charAt(0) == 'w'){
                console.log('Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
                break;
              }
              else
              {
                console.log('Not Continue: '+String(oldPos[numToCoord(i)]).charAt(0));
              }
            }
            continue;
          }
        }
      }
      isLegal = true;
    };

    if(isLegal) {board.move(`${sourceTile}-${targetTile}`)};

    /*
    if(String(oldPos[target]).charAt(0) === 'b'){return 'snapback';}
    //Pawn
    if(piece.charAt(1) === 'P'){
      if(!((coordToNum(target) === coordToNum(source)+8 && String(oldPos[target]).charAt(0) != 'w') ||
          (coordToNum(target) === coordToNum(source)+16 && source.charAt(1) === '7' && String(oldPos[target]).charAt(0) != 'w' && String(oldPos[(coordToNum(target)-8).toString()]).charAt(0) != 'w') ||
          (coordToNum(target) === coordToNum(source)+7 && String(oldPos[target]).charAt(0) === 'w') ||
          (coordToNum(target) === coordToNum(source)+9 && String(oldPos[target]).charAt(0) === 'w'))){
        return 'snapback';
      }
    }
    //Knight
    if(piece.charAt(1) === 'N'){
      if(!((coordToNum(target) === coordToNum(source)-17) ||
          (coordToNum(target) === coordToNum(source)-15) ||
          (coordToNum(target) === coordToNum(source)-10) ||
          (coordToNum(target) === coordToNum(source)-6) ||
          (coordToNum(target) === coordToNum(source)+6) ||
          (coordToNum(target) === coordToNum(source)+10) ||
          (coordToNum(target) === coordToNum(source)+15) ||
          (coordToNum(target) === coordToNum(source)+17))){
        return 'snapback';
      }
    }
    //King
    if(piece.charAt(1) === 'K'){
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
    //Rook
    if(piece.charAt(1) === 'R'){
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
    //Bishop
    if(piece.charAt(1) === 'B'){
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
    //Queen
    if(piece.charAt(1) === 'Q'){
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