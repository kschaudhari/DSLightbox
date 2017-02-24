
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
        sendAdobePixel();
        return;
    }
    loadedTimerForTracker = window.setTimeout(sendTrackerInfo, 500);
}

function sendAdobePixel() {

    var ta_prodDomain = 'dslabs.io';
    var ta_partner = 'partner:digital-spring-uk';
    var ta_account;

    var ta_pageName = ta_partner + ':' + window.location.pathname;
    var ta_server = window.location.hostname;
    var ta_url = window.location.href;
    var ta_cachebreak = new Date().getTime();
    (window.location.hostname.indexOf(ta_prodDomain) > -1) ? ta_account = 'tuatourism-australia-global' : ta_account = 'tuata-dev-internal';
    var ta_analyticsImgSrc = 'http://tourismaustralia.sc.omtrdc.net/b/ss/' + ta_account + '/1/H.26.2/s' + ta_cachebreak + '?AQB=1&ndh=0&ns=tourismaustralia&pageName=' + escape(ta_pageName);
    ta_analyticsImgSrc += '&g=' + escape(ta_url) + '&server=' + escape(ta_server) + '&v11=' + escape(ta_partner) + '&AQE=1';
    var ta_analyticsImg = document.createElement('img');
    ta_analyticsImg.src = ta_analyticsImgSrc

}
function openNewWindow(url) {
    //stopVideos();
    window.open(url);
}
