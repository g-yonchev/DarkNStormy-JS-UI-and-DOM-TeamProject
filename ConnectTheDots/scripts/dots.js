var paper = Raphael('svg-container', 600, 600);

var rows = 10;
var cols = 10;

for (var i = 1; i <= rows; i++) {
    for (var j = 1; j <= cols; j++) {
        var x = i * 40;
        var y = j * 40;

        // without last line ( they get out of the grid)
        if (j !== rows) {
            createLine(x, y, 40, 'v');
        }
        if (i !== cols) {
            createLine(x, y, 40, 'h');
        }

        createDot(x, y, 2);
    }
}

function createLine(x, y, len, type) {
    var path = 'M' + x + ' ' + y + ' ' + type + len;
    var line = paper.path(path)
    line.attr({stroke: 'lightgray'});
    line.attr({'stroke-width': '4'});
}

function createDot(x, y, r) {
    var dot = paper.circle();
    dot.attr({
        cx: x,
        cy: y,
        r: r
    });
}

$('div svg path').mouseover(
    function() {
        $(this).attr({stroke: 'green'});
        $(this).attr({'stroke-width': '5'});
    }
).mouseleave(
    function() {
        $(this).attr({stroke: 'lightgray'});
        $(this).attr({'stroke-width': '5'});
    }
);