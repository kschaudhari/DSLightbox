
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
    //handleMobNavigation(defaultTab, true);
}

function hideLightboxPopup() {
    //$(".removePopup").trigger("click");
    if (window.parent) {
        stopVideos();
        window.parent.postMessage("LB_CLOSE", "*");
        
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
        
        //R1 pixel sent by Danilo
        (function (d, p) { var a = new Image(); a.onload = function () { a = null }; a.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//rs.gwallet.com/r1/pixel/x" + p + "r" + Math.round(1E9 * Math.random()) })(document, "42341");

        //Tag from Danilo through Email on 10 Feb 2017, and commented as per request on skype 13 Feb 2017
        //$('body').append("<ins class='dcmads' style='display:inline-block;width:1px;height:1px' data-dcm-placement='N3643.497583DIGITALSPRING/B10888452.146172653' data-dcm-rendering-mode='script' data-dcm-https-only data-dcm-resettable-device-id='' data-dcm-app-id=''> <script src='https://www.googletagservices.com/dcm/dcmads.js'></script> </ins>");
        //Tag from Danilo thorugh Email on 13 Feb 2017
        var randomNumber = Math.round(1E9 * Math.random());
        $('body').append('<A HREF="https://ad.doubleclick.net/ddm/jump/N3643.497583DIGITALSPRING/B10888452.146172653;sz=1x1;ord=' + randomNumber + '?"><IMG SRC="https://ad.doubleclick.net/ddm/ad/N3643.497583DIGITALSPRING/B10888452.146172653;sz=1x1;ord=' + randomNumber + ';dc_lat=;dc_rdid=;tag_for_child_directed_treatment=?" BORDER=0 WIDTH=1 HEIGHT=1 ALT="Advertisement"></A>');

        return;
    }
    loadedTimerForTracker = window.setTimeout(sendTrackerInfo, 500);
}


function openNewWindow(url) {
    stopVideos();
    window.open(url);
}

