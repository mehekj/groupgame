var rows;
var cols;
var players = [];
var tokenSize = 60;

function drawBoard(location, rows, cols, gameSize) {
    this.rows = rows;
    this.cols = cols;
    
    for (let i = 1; i <= gameSize; i++) {
        players.push(i);
    }

    let marginSize = tokenSize * 0.2;
    
    $(location).html('<div id="board"></div>');
    $("#board").css("width", cols * (tokenSize + 2 * marginSize));
    $("#board").css("height", rows * (tokenSize + 2 * marginSize));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            $("#board").append('<div class="position"></div>');
        }
    }

    $(".position").css("width", tokenSize);
    $(".position").css("height", tokenSize);
    $(".position").css("margin", marginSize);
}