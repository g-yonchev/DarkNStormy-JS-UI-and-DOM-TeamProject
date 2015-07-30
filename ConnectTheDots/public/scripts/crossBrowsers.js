var crossBrowser = function (browser, x, y) {
    if (browser === 'Firefox 39') {
        x = x - 490;
        y = y + 10;
    } else if (browser === 'MSIE 10') {
        x = x - 588.7037353;
        y = y + 3 - 0.32638931;
    } else if (browser === 'IE 11') {
        x = x - 641;
        y = y + 2.5;
    } else if (browser === 'Opera 12') {
        x = x - 500;
    }

    return {
        x: x,
        y: y
    }
};