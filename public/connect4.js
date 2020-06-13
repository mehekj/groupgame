var rows;
var cols;
var tokenSize;



function drawBoard(location, gameSize) {
    rows = 6;
    cols = 7;
    tokenSize = 60;


    if (gameSize > 3) {
        rows += gameSize - 3;
        cols += gameSize - 3;
        tokenSize *= (1 - gameSize * 0.05);
    }

    let marginSize = tokenSize * 0.2;
    
    $(location).html('<div id="board"></div>');
    $('#board').css('width', cols * (tokenSize + 2 * marginSize));
    $('#board').css('height', rows * (tokenSize + 2 * marginSize));

    for (let i = 0; i < cols; i++) {
        $('#board').append('<div class="column"></div>');
    }

    for (let j = 0; j < rows; j++) {
        $('.column').append('<div class="position empty"></div>');
    }

    $('.position').css('width', tokenSize);
    $('.position').css('height', tokenSize);
    $('.position').css('margin', marginSize);

    $(location).append('<div id="prompt"></div>');
}



function columnHoverEnter(selected) {
    $(selected).css('background-color', '#FFFFFF44');
}

function columnHoverLeave(selected) {
    $(selected).css('background-color', 'transparent');
}



function dropToken(selected, player) {
    let emptyRow = -1;

    for (let i = 0; i < rows; i++) {
        if ($(selected).children().eq(i).hasClass('empty')) {
            emptyRow = i;
        }
    }

    if (emptyRow == -1) {
        return false;
    }
    else {
        $(selected).children().eq(emptyRow).removeClass('empty');
        $(selected).children().eq(emptyRow).addClass(`p${player}`);
        return true;
    }
}



function checkWin() {
    if (verticalWin() || horizontalWin() || BLtoTRWin() || TLtoBRWin()) {
        return true;
    }
    else {
        return false;
    }
}



function verticalWin() {
    return false;
}

function horizontalWin() {
    return false;
}

function BLtoTRWin() {
    return false;
}

function TLtoBRWin() {
    return false;
}



function checkDraw() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if ($('.column').eq(i).children().eq(j).hasClass('empty')) {
                return false;
            }
        }
    }
    return true;
}