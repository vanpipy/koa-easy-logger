'use strict';

const colors = require('colors/safe');
const bytes = require('bytes');

colors.setTheme({
    Trace: 'grey',
    Error: 'red',
    Debug: 'blue',
    Info: 'green',
    Warn: 'yellow'
});

function printLog (level, text) {
    console.log(colors[level](`${level} - ${text}`));
}

function method (string) {
    return string === 'post' ? colors.green(string) : string;
}

function protocol (string) {
    return string === 'https' ? colors.green(string.toUpperCase()) : string.toUpperCase();
}

function timeCostFormat (inverval) {
    if (inverval <= 100) {
        return colors.green(inverval);
    }

    if (inverval > 500) {
        return colors.red(inverval);
    }

    return String(inverval);
}

function statusFormat (statusCode) {
    if (statusCode === 200) {
        return colors.green(statusCode);
    }

    if (400 <= statusCode && statusCode <= 510) {
        return colors.red(statusCode);
    }

    return colors.white(statusCode);
}

// number -> string
function sizeDisplay (byteLength) {
    if (byteLength) {
        return bytes(byteLength);
    } else {
        return 0;
    }
}

function calculateSize (maxSize) {
    return (point) => point.lowerBound <= maxSize ? `${maxSize % point.upperBound}${point.unit}` : '';
}

function inputLog (context) {
    console.log(
        '<-- %s %s %s Host: %s', 
        method(context.method), 
        context.url, 
        protocol(context.protocol),
        context.host
    );
}

function outputLog (context, inverval) {
    console.log(
        '--> %s %s %s %s Time-Cost: %s ms', 
        method(context.method), 
        context.url, 
        statusFormat(context.status),
        sizeDisplay(context.length),
        timeCostFormat(inverval)
    );
}

function main () {
    return (ctx, next) => {
        const start = new Date();

        inputLog(ctx);

        return next().then(() => {
            outputLog(ctx, new Date().getTime() - start.getTime());
        });
    };
}

module.exports = main;

module.exports.printLog = printLog;
