var Timer = (function () {

    var stage = new Kinetic.Stage({
        container: 'canvas',
        width: 750,
        height: 65
    });

    var layer = new Kinetic.Layer({});
    var imgLayer = new Kinetic.Layer();
    var rigthLayer = new Kinetic.Layer();
    var backgroundLayer = new Kinetic.Layer();
    var playersLayer = new Kinetic.Layer();
    var movingLayer = new Kinetic.Layer();

    var label = new Kinetic.Label({
        x: stage.getWidth() / 2 - 30,
        y: stage.getHeight() / 2 - 25,
        draggable: true
    });


    label.add(new Kinetic.Tag({
        fill: 'rgba(255,255,255, 0.0)',
        shadowColor: 'black',
        shadowBlur: 10,

    }));

    var text = new Kinetic.Text({
        x: 0,
        y: 0,
        fill: '#333',
        fontSize: 50,
        fontFamily: 'Arial',
        text: '20',
    });

    var times = [];
    for (var i = 0; i < 21; i++) {
        var index = i;
        times[i] = index + '';
    }

    times.reverse();

    var $timer = $('#blurLeft').click(function () {
        var index = 0,
            startValue = 20,
            endIndex = 21;
        anim.start();
        setTurn();
        $timer.bind('click', function () {
            clearTimeout(timer);
        });

        var timer = setInterval(function () {
            var currentTime = times[index];

            if (currentTime === undefined) {
                index = 0;
                text.text(startValue);
                clearInterval(timer);
                layer.draw();
                setTurn();
                return;
            }
            text.text(currentTime);
            index += 1;
            layer.draw();
        }, 1000);
    });



    var leftArrow = new Image();
    var rightArrow = new Image();
    var background = new Image();
    var redPlayer = new Image();
    var bluePlayer = new Image();
    var loadCount = 0;
    var endCount = 5;

    leftArrow.onload = function () {
        loadCount++;
        if (loadCount == endCount) {
            putOnCanvas();
        }
    };

    rightArrow.onload = function () {
        loadCount++;
        if (loadCount == endCount) {
            putOnCanvas();
        }
    };

    background.onload = function () {
        loadCount++;
        if (loadCount == endCount) {
            putOnCanvas();
        }
    };

    redPlayer.onload = function () {
        loadCount++;
        if (loadCount == endCount) {
            putOnCanvas();
        }
    };

    bluePlayer.onload = function () {
        loadCount++;
        if (loadCount == endCount) {
            putOnCanvas();
        }
    };


    leftArrow.src = 'left.png';
    rightArrow.src = 'right.png';
    background.src = 'grass.png';
    redPlayer.src = 'red.png';
    bluePlayer.src = 'blue.png';

    function putOnCanvas() {
        var lArrow = new Kinetic.Image({
            x: 80,
            y: 30,
            image: leftArrow,
            width: 50,
            height: 35,
            name: 'left'
        });

        var rArrow = new Kinetic.Image({
            x: stage.getWidth() - 125,
            y: 30,
            image: rightArrow,
            width: 50,
            height: 35,
            name: 'right'
        });

        var backgroundImg = new Kinetic.Image({
            x: 0,
            y: 0,
            image: background,
            width: stage.getWidth(),
            height: stage.getHeight()
        });

        var redPlayerImg = new Kinetic.Image({
            x: 10,
            y: 0,
            image: redPlayer,
            width: 60,
            height: stage.getHeight()
        });

        var bluePlayerImg = new Kinetic.Image({
            x: stage.getWidth() - 65,
            y: 0,
            image: bluePlayer,
            width: 60,
            height: stage.getHeight()
        });

        movingLayer.add(hexagon);

        playersLayer.add(redPlayerImg);
        playersLayer.add(bluePlayerImg);
        backgroundLayer.add(backgroundImg);
        imgLayer.add(lArrow);
        rigthLayer.add(rArrow);
        label.add(text);
        layer.add(label);
        stage.add(backgroundLayer).add(playersLayer).add(imgLayer).add(rigthLayer).add(layer).add(movingLayer);

    }


    function stopAnimation() {
        clearInterval($timer);
        layer.draw();
    }


    var images = imgLayer.getChildren();
    function setTurn() {
        stopAnimation();
        var lopacity = imgLayer.getOpacity();
        var ropacity = imgLayer.getOpacity();
        if (lopacity === 1) {
            imgLayer.setOpacity(0.0);
            rigthLayer.setOpacity(1);
            imgLayer.draw();
            rigthLayer.draw();
        }
        else {
            imgLayer.setOpacity(1);
            rigthLayer.setOpacity(0.0);
            imgLayer.draw();
            rigthLayer.draw();
        }
    };


    var hexagon = new Kinetic.RegularPolygon({
        x: stage.width() / 2,
        y: stage.height() / 3,
        sides: 6,
        radius: 45,
        fill: 'red',
        opacity: 0.5,
        strokeWidth: 5
    });





    var amplitude = 208;
    var period = 2000;
    // in ms
    var centerX = (stage.width() / 2) - 20;


    var anim = new Kinetic.Animation(function (frame) {
        hexagon.setX(amplitude * Math.sin(frame.time / period) + centerX + 22.5);
    }, movingLayer);



    //anim.start();
}());