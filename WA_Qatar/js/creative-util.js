
function showLightboxPopup(type) {
    if (!inIframe())
    {
        sendTrackerInfo();
    }
    var defaultTab = 1;
    if (type)
        defaultTab = type.replace("tab", '');
    if (defaultTab > 5 || defaultTab < 1)
        type = "";
    if (type || isMobile()) {
        showMoreDetails();
        handleMobNavigation(defaultTab, true);
    }
    else
        showDefaultView();

    //pixel to track

}

function hideLightboxPopup() {
    //$(".removePopup").trigger("click");
    if (window.parent) {
        var activeTabVideo = $(".lighbox-container .lightbox-detailsPage .tab.active .ContentVideo .embed-container iframe")
        stopVideos(activeTabVideo);
        
        window.parent.postMessage('LB_CLOSE', '*');
        ga('send', 'pageview', { 'sessionControl': 'end' });
    }
}

var loadedTimerForTracker = null;
function sendTrackerInfo() {
    if ($(".lighbox-container").is(":visible")) {
        window.clearTimeout(loadedTimerForTracker);
        if (typeof ga !== "undefined") {
            ga('create', 'UA-75055673-13', 'auto');
            ga('send', 'pageview', { 'sessionControl': 'start' });
        }
        //add any pixel info to track
        // radium one
        (function (d, p) { var a = new Image(); a.onload = function () { a = null }; a.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//rs.gwallet.com/r1/pixel/x" + p + "r" + Math.round(1E9 * Math.random()) })(document, "40229");
        // woopra pixel
        (function () {
            var t, i, e, n = window, o = document, a = arguments, s = "script", r = ["config", "track", "identify", "visit", "push", "call", "trackForm", "trackClick"], c = function () { var t, i = this; for (i._e = [], t = 0; r.length > t; t++) (function (t) { i[t] = function () { return i._e.push([t].concat(Array.prototype.slice.call(arguments, 0))), i } })(r[t]) }; for (n._w = n._w || {}, t = 0; a.length > t; t++) n._w[a[t]] = n[a[t]] = n[a[t]] || new c; i = o.createElement(s), i.async = 1, i.src = "//static.woopra.com/js/w.js", e = o.getElementsByTagName(s)[0], e.parentNode.insertBefore(i, e)
        })("woopra");

        woopra.config({
            domain: 'waqatar.dslabs.io'
        });
        woopra.track();

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