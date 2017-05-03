
function showLightboxPopup(type) {

    var defaultTab = 1;
    if (type)
        defaultTab = type.replace("tab", '');
    if (defaultTab > 5 || defaultTab < 1)
        type = "";
    if (type || isMobile()) {
        handleMobNavigation(defaultTab, true);
    }
    //pixel to track
    sendTrackerInfo();
}

function hideLightboxPopup() {
    //$(".removePopup").trigger("click");
    if (window.parent) {
        var activeTabVideo = $(".lightbox-container .lightbox-detailsPage .tab.active .ContentVideo .embed-container iframe")
        stopVideos(activeTabVideo);

        window.parent.postMessage('LB_CLOSE', '*');
        ga('send', 'pageview', { 'sessionControl': 'end' });
    }
}

var loadedTimerForTracker = null;
function sendTrackerInfo() {
    if ($(".lightbox-container").is(":visible")) {
        window.clearTimeout(loadedTimerForTracker);
        if (typeof ga !== "undefined") {
            ga('create', 'UA-98422839-1', 'auto');
            ga('send', 'pageview');
        }
        //add any pixel info to track


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
        case "Slide_close":
            hideLightboxPopup();
            break;
    }
}

function openNewWindow(url, target) {

    if (!target)
        window.open(url);
    else
        window.open(url, target);

}