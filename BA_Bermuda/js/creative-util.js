﻿
function showLightboxPopup(type) {
    if (!inIframe()) {
        sendTrackerInfo();
    }
    var defaultTab = 1;
    if (type)
        defaultTab = type.replace("tab", '');
    if (defaultTab > 5 || defaultTab < 1)
        type = "";
    if (type || isMobile()) {
        handleMobNavigation(defaultTab, true);
    }

    //pixel to track

}

function hideLightboxPopup() {
    //$(".removePopup").trigger("click");
    if (window.parent) {
        
        window.parent.postMessage('LB_CLOSE', '*');
        ga('send', 'event', { 'sessionControl': 'end' });
        var trackers = ga.getAll();
        trackers.forEach(function (tracker) {
            ga.remove(tracker.get('name'));
        });
    }
}

var loadedTimerForTracker = null;
function sendTrackerInfo()
{
    if($(".lighbox-container").is(":visible"))
    {
        window.clearTimeout(loadedTimerForTracker);
        if (typeof ga !== "undefined") {
            ga('create', 'UA-75055673-14', 'auto');
            ga('send', 'pageview', { 'sessionControl': 'start' });
        }
        //add any pixel info to track
        //trackloadpixel();
        (function () {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = ('https:' == document.location.protocol ? 'https://s' : 'http://i')
              + '.po.st/static/v4/post-widget.js#publisherKey=hd5fpp4mmp986324f5rl';
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        })();
        return;
    }
    loadedTimerForTracker = window.setTimeout(sendTrackerInfo, 500);
}

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
    switch (event.data) {
        case "Slide_open":
            sendTrackerInfo();
            break;
    }
}

var lightboxCounter = null;
var lightbocCounterInterval = 10;
function progressLightbox(time) {
    lightboxCounter = window.setTimeout(function () {
        progressLightboxTimer(time, 0)
    }, lightbocCounterInterval)
}

function progressLightboxTimer(time, ellapsedTime) {

    ellapsedTime = ellapsedTime + lightbocCounterInterval;

    renderProgress(ellapsedTime / time * 100);
    lightboxCounter = window.setTimeout(function () {
        progressLightboxTimer(time, ellapsedTime)
    }, lightbocCounterInterval)
}

function stopProgressLightbox() {

    window.clearTimeout(lightboxCounter);
    clearProgress(0);
}
function clearProgress() {
    ellapsedTime = 0;
    $(".animate-75-100-b, .animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform", "rotate(90deg)");
}
function renderProgress(progress) {
    progress = Math.floor(progress);

    if (progress < 25) {
        var angle = -90 + (progress / 100) * 360;
        $(".animate-0-25-b").css("transform", "rotate(" + angle + "deg)");
    }
    else if (progress >= 25 && progress < 50) {
        var angle = -90 + ((progress - 25) / 100) * 360;
        $(".animate-0-25-b").css("transform", "rotate(0deg)");
        $(".animate-25-50-b").css("transform", "rotate(" + angle + "deg)");
    }
    else if (progress >= 50 && progress < 75) {
        var angle = -90 + ((progress - 50) / 100) * 360;
        $(".animate-25-50-b, .animate-0-25-b").css("transform", "rotate(0deg)");
        $(".animate-50-75-b").css("transform", "rotate(" + angle + "deg)");
    }
    else if (progress >= 75 && progress <= 100) {
        var angle = -90 + ((progress - 75) / 100) * 360;
        $(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform", "rotate(0deg)");
        $(".animate-75-100-b").css("transform", "rotate(" + angle + "deg)");
    }
    if (progress >= 100) {

    }
}