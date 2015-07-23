var paper = Raphael('svg-container', 600, 600);
var squares = [];
var pathsIDs = 0;
var rows = 10;
var cols = 10;

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
    //console.log(dot);
}

function mouseOver() {
    $(this).attr({ stroke: 'green' });
    $(this).attr({ 'stroke-width': '5' });
    //console.log($(this).attr('id'));
}

function mouseOut() {
    $(this).attr({ stroke: 'lightgray' });
    $(this).attr({ 'stroke-width': '4' });
}

function clicked() {
    $(this).attr({ stroke: 'red' });
    $(this).attr({ 'stroke-width': '5' });
    $(this).unbind("mouseover", mouseOver);
    $(this).unbind("mouseout", mouseOut);

    var currentLineID = +($(this).attr('id'));
    //console.log(currentLineID);
    addLineToSquare(currentLineID);
    //console.log(squares[0]);
}

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
        }
		
        if (!currentSquare.lines.length) {
            // THE SQUARE HAS ALL SIDES FILLED, NEED TO CONTINUE THE LOGIC
            console.log('IT WORKS');
            //console.log(currentSquare);
			//console.log(id);
        }
    });
}

$('div svg path')
    .mouseover(mouseOver)
    .mouseout(mouseOut)
    .click(clicked);

//console.log(paths);
var lineOneStart = 1;
var lineTwoStart = 10;
var lineThreeStart = 91;
var lineFourStart = 92;

for (var i = 1; i <= 81; i++) {

    var squaresLines = [lineOneStart, lineTwoStart, lineThreeStart, lineFourStart];

    var square = {
        lines: squaresLines
    };

    lineOneStart++;
    lineTwoStart++;
    lineThreeStart++;
    lineFourStart++;

    if (i % 9 == 0) {
        lineThreeStart++;
        lineFourStart++;
    }
    squares.push(square);
}

//console.log(squares[15]);
