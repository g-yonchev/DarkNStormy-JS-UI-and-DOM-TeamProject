var generateGrid = (function grid(paper, rows, cols) {
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
        line.attr({ stroke: 'lightgray' });
        line.attr({ 'stroke-width': '4' });
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