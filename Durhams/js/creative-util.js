
function showLightboxPopup(type) {
    if (!inIframe()) {
        sendTrackerAndAutoplayVideo();
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
    stopVideos();
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
function sendTrackerAndAutoplayVideo() {
    sendTrackerInfo();
    loadTab();
}
function sendTrackerInfo() {
    if ($(".lighbox-container").is(":visible")) {
        window.clearTimeout(loadedTimerForTracker);
        if (typeof ga !== "undefined") {
            ga('create', 'UA-75055673-16', 'auto');
            ga('send', 'pageview', {'sessionControl': 'start'});
        }
        //add any pixel info to track
        //trackloadpixel();
        (function (d, p) { var a = new Image(); a.onload = function () { a = null }; a.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//rs.gwallet.com/r1/pixel/x" + p + "r" + Math.round(1E9 * Math.random()) })(document, "40414");

        var my_awesome_script = document.createElement('script');
        my_awesome_script.setAttribute('src', 'https://ad.doubleclick.net/ddm/trackimpj/N3643.497583DIGITALSPRING/B10470664.140223689;dc_trk_aid=312446097;dc_trk_cid=75605336;ord=[timestamp];dc_lat=;dc_rdid=;tag_for_child_directed_treatment=?');
        document.head.appendChild(my_awesome_script);

        return;
    }
    loadedTimerForTracker = window.setTimeout(sendTrackerInfo, 500);
}

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
    switch (event.data) {
        case "Slide_open":
            sendTrackerAndAutoplayVideo();
            break;
        case "Slide_close":
            stopVideos();
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

function openNewWindow(url)
{
    stopVideos();
    window.open(url);
}

function handleStopEvent()
{
    $("#mydiv-content").click(function (e) {
        e.stopPropagation()
    })
}