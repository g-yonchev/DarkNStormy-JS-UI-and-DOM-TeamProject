var Lightning = (function () {
    var Lightning = function (options) {
        options = options || {};

        this.width = options.width || 86;
        this.height = options.height || 950;
        this.x = options.x || 0;
        this.y = options.y || 0;

        this.frames = options.frames || 16;
        this.renderSpeed = options.renderSpeed || 5;
        this.image = options.image || new Image();
        this.image.src = 'lightning_0.png';
        this.frameCounter = 0;
        this.tickCounter = 0;
        this.context = $('canvas')[0].getContext('2d');

        var delta = 3;
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
            var shit = 0;
            var bullshit = 0;

            switch (this.frameCounter) {
                case 0:
                case 1:
                case 2:
                case 3:
                    shit = this.frameCounter * this.width;
                    bullshit = 0;
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                    shit = (this.frameCounter - 4) * this.width;
                    bullshit = 128;
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                    shit = (this.frameCounter - 8) * this.width;
                    bullshit = 256;
                    break;
                case 12:
                case 13:
                case 14:
                case 15:
                    shit = (this.frameCounter - 12) * this.width;
                    bullshit = 384;
                    break;
            }

            this.context.drawImage(
                    this.image,
                    shit,
                    bullshit,
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


