$(document).ready(function () {
   $('#chose-level').addClass('animated fadeInDown');
});

var btn = document.getElementById('btn');
$('#btn').addClass('animated pulse');
$('#team-logo').addClass('animated flash');

var levels = document.getElementById('level-menu');

var rows, cols;
var someSocket = io();

$('.level').on('click', function(){
    $('.level').removeClass('level-chosen');
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

btn.addEventListener('click', function () {
    someSocket.emit('set up game', null);
});

someSocket.on('set up game', function () {
    $('#chat-minimized').removeClass('hidden');
    $('#svg-container').removeClass('hidden');
    $('#chose-level').addClass('hidden');
    $('#lightningcanvas').removeClass('hidden');

    var paper = Raphael('svg-container', constants.svgSize.width, constants.svgSize.height);

    var players = [{
        color: constants.colors.red,
        points: 0
    }, {
        color: constants.colors.blue,
        points: 0
    }];

    $('#chat-minimized').on('click', function () {
        $('#container').removeClass('hidden').addClass('animated fadeInUp');
        $('#chat-minimized').addClass('hidden');
    });

    $('h1').on('click', function (){
        $('#container').addClass('animated fadeInDown').addClass('hidden');
        $('#chat-minimized').removeClass('hidden');
    })

    var playersCount = players.length;
    var currentPlayerTurn = 0;
    var isPlayerAgain = false;

    var pointsContainer = document.getElementById('points-container');
    var firstPlayerPointsSpan = document.createElement('span');
    var secondPlayerPointsSpan = document.createElement('span');
    firstPlayerPointsSpan.style.display = 'inline-block';
    firstPlayerPointsSpan.style.marginRight='40px';
    firstPlayerPointsSpan.style.color = constants.colors.red;
    secondPlayerPointsSpan.style.display = 'inline-block';
    secondPlayerPointsSpan.style.marginRight='10px';
    secondPlayerPointsSpan.style.color = constants.colors.blue;

    pointsContainer.appendChild(firstPlayerPointsSpan);
    pointsContainer.appendChild(secondPlayerPointsSpan);

    var showPoints = (function showPoints() {
        var firstPlayerPoints = players[0].color + ': ' + players[0].points;
        var secondPlayerPoints = players[1].color + ': ' + players[1].points;

        firstPlayerPointsSpan.innerText = firstPlayerPoints;
        secondPlayerPointsSpan.innerText = secondPlayerPoints;
        //console.log(players[0].color, players[0].points);
        //console.log(players[1].color, players[1].points);
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
            //console.log($(this).attr('id'));
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
            //console.log(currentLineID);

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
            console.log('in socket: ', currentPlayerTurn);
        });
        //console.log('after socket: ', currentPlayerTurn);

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
                    //console.log(currentSquare);
                    currentSquare.lines.splice(indexOfId, 1);
                    //console.log(currentSquare);

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

                    //console.log(currentSquare);
                    //console.log(id);
                }
            });
        }

        var $line = $('div svg path');

        $line.mouseover(mouseOver)
             .mouseout(mouseOut)
             .click(clicked);

    }(socket, currentLineId));
});
