var rows = 6;
var cols = 7;
var tokenSize = 60;



function drawBoard(location, gameSize) {
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
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows - 3; j++) {
            let first = $('.column').eq(i).children().eq(j).attr('class');
            let second = $('.column').eq(i).children().eq(j + 1).attr('class');
            let third = $('.column').eq(i).children().eq(j + 2).attr('class');
            let fourth = $('.column').eq(i).children().eq(j + 3).attr('class');

            if ((first.indexOf('empty') == -1) &&
            (first == second) &&
            (second == third) &&
            (third == fourth)) {
                return true;
            }
        }
    }
    return false;
}

function horizontalWin() {
    for (let i = 0; i < cols - 3; i++) {
        for (let j = 0; j < rows; j++) {
            let first = $('.column').eq(i).children().eq(j).attr('class');
            let second = $('.column').eq(i + 1).children().eq(j).attr('class');
            let third = $('.column').eq(i + 2).children().eq(j).attr('class');
            let fourth = $('.column').eq(i + 3).children().eq(j).attr('class');

            if ((first.indexOf('empty') == -1) &&
            (first == second) &&
            (second == third) &&
            (third == fourth)) {
                return true;
            }
        }
    }
    return false;
}

function BLtoTRWin() {
    for (let i = 0; i < cols - 3; i++) {
        for (let j = 3; j < rows; j++) {
            let first = $('.column').eq(i).children().eq(j).attr('class');
            let second = $('.column').eq(i + 1).children().eq(j - 1).attr('class');
            let third = $('.column').eq(i + 2).children().eq(j - 2).attr('class');
            let fourth = $('.column').eq(i + 3).children().eq(j - 3).attr('class');

            if ((first.indexOf('empty') == -1) &&
            (first == second) &&
            (second == third) &&
            (third == fourth)) {
                return true;
            }
        }
    }
    return false;
}

function TLtoBRWin() {
    for (let i = 0; i < cols - 3; i++) {
        for (let j = 0; j < rows - 3; j++) {
            let first = $('.column').eq(i).children().eq(j).attr('class');
            let second = $('.column').eq(i + 1).children().eq(j + 1).attr('class');
            let third = $('.column').eq(i + 2).children().eq(j + 2).attr('class');
            let fourth = $('.column').eq(i + 3).children().eq(j + 3).attr('class');

            if ((first.indexOf('empty') == -1) &&
            (first == second) &&
            (second == third) &&
            (third == fourth)) {
                return true;
            }
        }
    }
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