var Lightning = (function () {
    var Lightning = function (options) {
        options = options || {};

        var delta = constants.lightningUpdates.lightningDelta;
        var update = constants.lightningUpdates.lightningUpdate;

        this.width = options.width || constants.lightningSize.width;
        this.height = options.height || constants.lightningSize.height;
        this.x = options.x || constants.lightningCoordinates.x;
        this.y = options.y || constants.lightningCoordinates.y;

        this.frames = options.frames || constants.lightningFrameOptions.frames;
        this.renderSpeed = options.renderSpeed || constants.lightningFrameOptions.renderSpeed;
        this.image = options.image || constants.lightningSpriteOptions.image;
        this.image.src = constants.lightningSpriteOptions.imageSrc;
        this.frameCounter = constants.lightningFrameOptions.frameCounter;
        this.tickCounter = constants.lightningFrameOptions.tickCounter;
        this.context = $('canvas')[0].getContext('2d');


        this.move = function () {
            this.x = delta * update;
        };



        this.secondMove = function () {
            this.x = secondDelta * secondUpdate;
        };

        this.thirdMove = function () {
            this.x = thirdDelta * thirdUpdate;
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
            if (this.tickCounter % this.renderSpeed == constants.lightningFrameOptions.renderEndPoint) {
                this.frameCounter++;
            }

            if (this.frameCounter >= this.frames) {
                this.frameCounter = constants.lightningFrameOptions.frameCounter;
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
            lightning.x = Math.random() * 900;
            lightning.drawSprite();
            animation = requestAnimationFrame(mainLoop);
        };

        var anim = setTimeout(function () {
            mainLoop();
        }, 2000);

    });
}());


