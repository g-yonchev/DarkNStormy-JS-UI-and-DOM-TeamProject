var constants = (function() {
    var colors = {
        red: 'red',
        blue: 'blue',
        black: 'black',
        lightgray: 'lightgray',
        darkgray: 'darkgray'
    };

    var gridSize = {
        easy: 8,
        medium: 11,
        hard: 14
    };

    var svgSize = {
        width: 600,
        height: 600
    };

    var lineSize = {
        initial: '4',
        hovered: '5',
        filled: '5'
    };

    var squareSize = {
        width: 40,
        height: 40
    };

    return {
        colors: colors,
        gridSize: gridSize,
        svgSize: svgSize,
        lineSize: lineSize,
        squareSize: squareSize
    };
}());
