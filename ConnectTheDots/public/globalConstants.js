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

    var lightningSize = {
        width: 128,
        height: 118
    };

    var lightningCoordinates = {
        x: 0,
        y:0
    };

    var lightningFrameOptions = {
        frames: 30,
        renderSpeed: 18,
        frameCounter: 0,
        tickCounter: 0,
        renderEndPoint:0
    };

    var lightningUpdates = {
        lightningDelta: Math.random(),
        lightningUpdate:900
    };

    var lightningSpriteOptions = {
        image:new Image(),
        imageSrc: 'lightning_0.png'
    };

    return {
        colors: colors,
        gridSize: gridSize,
        svgSize: svgSize,
        lineSize: lineSize,
        squareSize: squareSize,
        lightningSize: lightningSize,
        lightningCoordinates: lightningCoordinates,
        lightningFrameOptions: lightningFrameOptions,
        lightningUpdates: lightningUpdates,
        lightningSpriteOptions: lightningSpriteOptions
    };
}());
