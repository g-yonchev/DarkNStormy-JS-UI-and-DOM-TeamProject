var Lightning = (function () {
    var Lightning = function (options) {
        options = options || {};

        this.width = options.width || 128;
        this.height = options.height || 512;
        this.x = options.x || 0;
        this.y = options.y || 0;

        this.frames = options.frames || 8;
        this.renderSpeed = options.renderSpeed|| 7;
        this.image = options.image || new Image();
        this.image.src = 'lightning_0.png';
        this.frameCounter = 0;
        this.tickCounter = 0;
        this.context = $('canvas')[0].getContext('2d');

        var delta = 1;
        var update = 7;

        this.move = function () {
            this.x += delta + update;
            if (this.x >= 900) {
                this.image.src = 'lightning_0.png';
                delta *= -1;
                update *= -1;
            }
            if (this.x === 0) {
                this.image.src = 'lightning_0.png';
                delta *= -1;
                update *= -1;
            }

        };



        this.drawSprite = function () {

            this.context.drawImage(
                this.image,
                this.frameCounter * this.width,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
            this.tickCounter++;
            if (this.tickCounter % this.renderSpeed == 0) {
                this.frameCounter++;
            }

            if (this.frameCounter >= this.frames) {
                this.frameCounter = 0;
            }
        }
    };



    function checkRequestAnimationFrame() {
        if (!window.requestAnimationFrame) {

            window.requestAnimationFrame = (function () {

                return window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

                        window.setTimeout(callback, 1000 / 60);

                    };

            })();

        }
    };

    $(document).ready(function () {
        var lightning = new Lightning();
        var mainLoop = function () {
            $('canvas')[0].getContext('2d').clearRect(0, 0, 1000, 500);
            lightning.move();
            lightning.drawSprite();
            animation = requestAnimationFrame(mainLoop);
        };

        setTimeout(function () {
            mainLoop();
        }, 2000);

    });
}());


