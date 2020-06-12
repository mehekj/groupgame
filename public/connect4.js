var rows;
var cols;
var tokenSize;

function drawBoard(location, gameSize) {
    rows = 6;
    cols = 7;
    tokenSize = 60;


    if (gameSize > 2) {
        rows += gameSize - 2;
        cols += gameSize - 2;
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
        message('<strong>This column is full. Please select a different spot.</strong>');
    }
    else {
        $(selected).children().eq(emptyRow).removeClass('empty');
        $(selected).children().eq(emptyRow).addClass(`p${player}`);
    }
}