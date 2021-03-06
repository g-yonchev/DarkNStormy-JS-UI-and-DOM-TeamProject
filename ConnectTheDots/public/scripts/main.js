$(document).ready(function () {
   $('#chose-level').addClass('animated fadeInDown');
});

var audio = new Audio('../audios/thunder.mp3');
audio.loop = true;

var rows,
    cols,
    $btn = $('#btn'),
    $level = $('.level'),
    $teamLogo = $('#team-log'),
    someSocket = io();

$btn.addClass('animated pulse');
$teamLogo.addClass('animated flash');

$level.on('click', function(){
    $level.removeClass('level-chosen');
    $(this).addClass('level-chosen');
    var difficult = $(this).data('level');
    someSocket.emit('difficulty', difficult);
});

someSocket.on('difficulty', function (diff) {
    switch (diff) {
        case 'e':
            rows = constants.gridSize.easy;
            cols = constants.gridSize.easy;
            break;
        case 'm':
            rows = constants.gridSize.medium;
            cols = constants.gridSize.medium;
            break;
        case 's':
            rows = constants.gridSize.hard;
            cols = constants.gridSize.hard;
            break;
    }
});

$btn.on('click', function () {
    audio.play();
    someSocket.emit('set up game', null);
});

someSocket.on('set up game', function () {
    var $chatMinimized = $('#chat-minimized'),
        $svgContainer = $('#svg-container'),
        $choseLevel = $('#chose-level'),
        $lightingCanvas = $('#lightningcanvas'),
        $chatHeader = $('h1');

    $chatMinimized.removeClass('hidden');
    $svgContainer.removeClass('hidden');
    $choseLevel.addClass('hidden');
    $lightingCanvas.removeClass('hidden');

    var paper = Raphael('svg-container', constants.svgSize.width, constants.svgSize.height);

    var players = [{
        color: constants.colors.red,
        points: 0
    }, {
        color: constants.colors.blue,
        points: 0
    }];

    $chatMinimized.on('click', function () {
        $('#container').removeClass('hidden').addClass('animated fadeInUp');
        $('#chat-minimized').addClass('hidden');
    });

    $chatHeader.on('click', function (){
        $('#container').addClass('animated fadeInDown').addClass('hidden');
        $('#chat-minimized').removeClass('hidden');
    });

    var playersCount = players.length;
    var currentPlayerTurn = 0;
    var isPlayerAgain = false;

    var $pointsContainer = $('#points-container');
    var $firstPlayerPointsSpan = $('<span/>');
    var $secondPlayerPointsSpan = $('<span/>');

    $firstPlayerPointsSpan.css({
        'display': 'inline-block',
        'marginRight': '40px',
        'color': constants.colors.red
    });

    $secondPlayerPointsSpan.css({
        'display': 'inline-block',
        'marginRight': '10px',
        'color': constants.colors.blue
    });

    $pointsContainer
        .append($firstPlayerPointsSpan)
        .append($secondPlayerPointsSpan);

    var showPoints = (function showPoints() {
        var firstPlayerPoints = players[0].color + ': ' + players[0].points,
            secondPlayerPoints = players[1].color + ': ' + players[1].points;

        $firstPlayerPointsSpan.html(firstPlayerPoints);
        $secondPlayerPointsSpan.html(secondPlayerPoints);
    });

    showPoints();

    var squares = [];

    var socket = io();
    var currentLineId = -1;

    //emitting chat's messages
    $('form').submit(function () {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
    //--- end of emitting chat's messages

    generateGrid(paper, rows, cols);
    generateIds(squares, rows, cols);

    (function socket(socket, currentLineID) {

        function mouseOver() {
            $(this).attr({ stroke: constants.colors.darkgray });
            $(this).attr({ 'stroke-width': constants.lineSize.hovered });
        }

        function mouseOut() {
            $(this).attr({ stroke: constants.colors.lightgray});
            $(this).attr({ 'stroke-width': constants.lineSize.initial });
        }

        function clicked() {
            $(this).attr({ stroke: constants.colors.black });
            $(this).attr({ 'stroke-width': constants.lineSize.filled });
            $(this).unbind("mouseover", mouseOver);
            $(this).unbind("mouseout", mouseOut);

            currentLineID = +($(this).attr('id'));

            socket.emit('id', currentLineID);

            socket.on('id', function (id) {
                addLineToSquare(id);
            });

            socket.on('player again', function (again) {
                isPlayerAgain = again;
            });

            if (!isPlayerAgain) {
                currentPlayerTurn++;
            }
            else {
                isPlayerAgain = false;
                socket.emit('player again', isPlayerAgain);
            }

            if (currentPlayerTurn === playersCount) {
                currentPlayerTurn = 0;
            }
            socket.emit('player turn', currentPlayerTurn);
        }

        socket.on('player turn', function (turn) {
            currentPlayerTurn = turn;
        });

        socket.emit('id', currentLineID);

        socket.on('id', function (id) {
            addLineToSquare(id);
        });

        function addLineToSquare(id) {
            squares.forEach(function (currentSquare) {

                if (!currentSquare.lines.length) {
                    return;
                }

                var indexOfId = currentSquare.lines.indexOf(id);

                if (indexOfId >= 0) {
                    currentSquare.lines.splice(indexOfId, 1);

                    $('#' + id).unbind("mouseover", mouseOver);
                    $('#' + id).unbind("mouseout", mouseOut);
                    $('#' + id).attr({ stroke: constants.colors.black });
                    $('#' + id).attr({ 'stroke-width': constants.lineSize.filled });
                }

                if (!currentSquare.lines.length) {
                    // THE SQUARE HAS ALL SIDES FILLED, NEED TO CONTINUE THE LOGIC
                    var currentTopLineId = currentSquare.topLineId;

                    var $currentLine = $('#' + currentTopLineId);
                    var $position = $currentLine.position();

                    var x = $position.left;
                    var y = $position.top;

                    var browser = navigator.checkBrowser;

                    x = crossBrowser(browser, x, y).x;
                    y = crossBrowser(browser, x, y).y;

                    var rectToFill = paper.rect(x, y, constants.squareSize.width, constants.squareSize.height);

                    var colorToUse = players[currentPlayerTurn].color;

                    socket.emit('rect color', colorToUse);

                    socket.on('rect color', function (color) {
                        if (rectToFill.attr('fill') == 'none') {
                            rectToFill.attr({
                                fill: color
                            });
                        }
                    });

                    players[currentPlayerTurn].points++;

                    showPoints();

                    isPlayerAgain = true;
                    socket.emit('player again', isPlayerAgain);

                }
            });
        }

        var $line = $('div svg path');

        $line.mouseover(mouseOver)
             .mouseout(mouseOut)
             .click(clicked);

    }(socket, currentLineId));
});
