$(document).ready(function () {
   $('#chose-level').addClass('animated fadeInDown');
});

var btn = document.getElementById('btn');
$('#btn').addClass('animated pulse');

btn.addEventListener('click', function () {
    $('#container').removeClass('hidden');
    $('#svg-container').removeClass('hidden');
    $('#chose-level').addClass('hidden');

    var input = document.getElementById('info');
    var rows = +input.value + 1;
    var cols = +input.value + 1;

    var paper = Raphael('svg-container', 600, 600);

    var container = document.getElementById('svg-container');

    var players = [{
        color: 'red',
        points: 0
    }, {
        color: 'blue',
        points: 0
    }, {
        color: 'green',
        points: 0
    }, {
        color: 'purple',
        points: 0
    }];

    var playersCount = players.length;
    var currentPlayerTurn = 0;
    var isPlayerAgain = false;

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

    var generateGrid = (function grid(rows, cols) {
        var pathsIDs = 0;

        for (var i = 1; i <= rows; i++) {
            for (var j = 1; j <= cols; j++) {
                var y = i * 40;
                var x = j * 40;

                if (j !== cols) {
                    createLine(x, y, 40, 'h');
                }
            }
        }

        for (var i = 1; i <= rows; i++) {
            for (var j = 1; j <= cols; j++) {
                var y = i * 40;
                var x = j * 40;

                // without last line ( they get out of the grid)
                if (i !== rows) {
                    createLine(x, y, 40, 'v');
                }

                createDot(x, y, 2);
            }
        }

        function createLine(x, y, len, type) {
            var path = 'M' + x + ' ' + y + ' ' + type + len;
            var line = paper.path(path)
            line.attr({stroke: 'lightgray'});
            line.attr({'stroke-width': '4'});
            line.node.id = ++pathsIDs;
        }

        function createDot(x, y, r) {
            var dot = paper.circle();
            dot.attr({
                cx: x,
                cy: y,
                r: r
            });
        }
    });
    generateGrid(rows, cols);

    var generateIds = (function generateIds(rows, cols) {
        var lineOneStart = 1;
        var lineTwoStart = rows;
        var lineThreeStart = (rows * cols) - (cols - 1);
        var lineFourStart = lineThreeStart + 1;

        for (var i = 1; i <= (rows - 1) * (cols - 1); i++) {

            var squaresLines = [lineOneStart, lineTwoStart, lineThreeStart, lineFourStart];
            var square = {
                lines: squaresLines,
                topLineId: lineOneStart
            };

            lineOneStart++;
            lineTwoStart++;
            lineThreeStart++;
            lineFourStart++;

            if (i % (rows - 1) == 0) {
                lineThreeStart++;
                lineFourStart++;
            }

            squares.push(square);
        }
    });

    generateIds(rows, cols);

    (function socket(socket, currentLineID) {

        function mouseOver() {
            $(this).attr({stroke: '#53533F'});
            $(this).attr({'stroke-width': '5'});
            //console.log($(this).attr('id'));
        }

        function mouseOut() {
            $(this).attr({stroke: 'lightgray'});
            $(this).attr({'stroke-width': '4'});
        }

        function clicked() {

            $(this).attr({stroke: 'black'});
            $(this).attr({'stroke-width': '5'});
            $(this).unbind("mouseover", mouseOver);
            $(this).unbind("mouseout", mouseOut);

            currentLineID = +($(this).attr('id'));
            //console.log(currentLineID);

            socket.emit('id', currentLineID);

            socket.on('id', function (id) {
                addLineToSquare(id);
            });

            if (!isPlayerAgain) {
                currentPlayerTurn++;
            }
            else {
                isPlayerAgain = false;
            }

            if (currentPlayerTurn === playersCount) {
                currentPlayerTurn = 0;
            }
        }

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
                    $('#' + id).attr({stroke: 'black'});
                    $('#' + id).attr({'stroke-width': '5'});
                }

                if (!currentSquare.lines.length) {
                    // THE SQUARE HAS ALL SIDES FILLED, NEED TO CONTINUE THE LOGIC
                    var currentTopLineId = currentSquare.topLineId;

                    var $currentLine = $('#' + currentTopLineId);
                    var $position = $currentLine.position();

                    var x = $position.left;
                    var y = $position.top;

                    //alert('x: ' + x + ' y: ' + y);
                    var rectToFill = paper.rect(x, y, 40, 40);

                    var colorToUse = players[currentPlayerTurn].color;

                    socket.emit('rect color', colorToUse);
                    console.log();

                    socket.on('rect color', function (color) {
                        if (rectToFill.attr('fill') == 'none') {
                            rectToFill.attr({
                                fill: color
                            });
                        }
                    });


                    players[currentPlayerTurn].points++;

                    isPlayerAgain = true;

                    //console.log(currentSquare);
                    //console.log(id);
                }
            });
        }

        $('div svg path')
            .mouseover(mouseOver)
            .mouseout(mouseOut)
            .click(clicked);

    }(socket, currentLineId));
});



