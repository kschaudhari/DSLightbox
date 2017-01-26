
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
    switch (event.data) {
        case "Slide_open":
            showLightboxPopup();
            break;
    }
}
function showLightboxPopup() {
    
    var defaultTab = 1;
    var type = window.location.hash.substr(1);
    if (type)
        defaultTab = type.replace("tab", '');
    if (defaultTab > 5 || defaultTab < 1)
        type = "";
    
    sendTrackerInfo();
    handleMobNavigation(defaultTab, true);
}

function hideLightboxPopup() {
    //$(".removePopup").trigger("click");
    if (window.parent) {
        var activeTabVideo = $(".lighbox-container .lightbox-detailsPage .tab.active .ContentVideo .embed-container iframe")
        stopVideos(activeTabVideo);
        
        
    }
}

var loadedTimerForTracker = null;
function sendTrackerInfo() {
    if ($(".lighbox-container").is(":visible")) {
        window.clearTimeout(loadedTimerForTracker);

        ////fire ga code
        //if (typeof ga !== "undefined") {
        //    ga('create', 'UA-75055673-13', 'auto');
        //    ga('send', 'pageview', { 'sessionControl': 'start' });
        //}
        //add any pixel info to track
        
        return;
    }
    loadedTimerForTracker = window.setTimeout(sendTrackerInfo, 500);
}


