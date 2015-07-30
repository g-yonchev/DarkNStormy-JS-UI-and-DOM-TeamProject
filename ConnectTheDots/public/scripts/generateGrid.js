var generateGrid = (function grid(paper, rows, cols) {
    var pathsIDs = 0;

    for (var i = 1; i <= rows; i++) {
        for (var j = 1; j <= cols; j++) {
            var y = i * constants.squareSize.width;
            var x = j * constants.squareSize.height;

            if (j !== cols) {
                createLine(x, y, constants.squareSize.width, 'h');
            }
        }
    }

    for (var i = 1; i <= rows; i++) {
        for (var j = 1; j <= cols; j++) {
            var y = i * constants.squareSize.width;
            var x = j * constants.squareSize.height;

            // without last line ( they get out of the grid)
            if (i !== rows) {
                createLine(x, y, constants.squareSize.height, 'v');
            }

            createDot(x, y, 2);
        }
    }

    function createLine(x, y, len, type) {
        var path = 'M' + x + ' ' + y + ' ' + type + len;
        var line = paper.path(path)
        line.attr({ stroke: constants.colors.lightgray });
        line.attr({ 'stroke-width': constants.lineSize.initial });
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