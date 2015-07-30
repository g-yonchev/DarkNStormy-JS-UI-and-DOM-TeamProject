var generateIds = (function generateIds(squares, rows, cols) {
    var lineOneStart = 1;
    var lineTwoStart = rows;
    var lineThreeStart = (rows * cols) - (cols - 1);
    var lineFourStart = lineThreeStart + 1;

    for (var i = 1; i <= (rows - 1) * (cols - 1) ; i++) {

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