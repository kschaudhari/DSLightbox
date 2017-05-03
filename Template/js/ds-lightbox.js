function isMobile() {
    return $(".mobDetector").is(":visible");
}
var totalTabs = 0;
$(document).ready(function () {
    var type = window.location.hash.substr(1);

    // popup show Hide
    $("#ShwoPopUp").click(function () {
        showLightboxPopup(type);
    });
    showLightboxPopup(type);
    $(".removePopup").click(function () {
        hideLightboxPopup();

    });

    $(".lightbox-container .lightbox-content .lightbox-tab-menu-item").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''), true);
    });

    $(".lightbox-container .lightbox-content .tab .collapsed-detail-container").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).closest(".tab").attr("data-tab").replace("tab", ''), true);
    });
    // popup show Hide end 
    $('.topMobMenuBar .mobMenu').off("click");
    $('.topMobMenuBar .mobMenu').click(function (e) {
        e.stopPropagation();
        var self = $(this);
        var content = $(".topMobMenuBar .mobDropdownMenu");
        if ($(content).is(":visible")) {

            $(content).slideUp("slow", function () {
                $(self).removeClass("active");
            });
        } else {
            $(self).addClass("active");
            $(content).slideDown("slow");
        }
    });

    $(".topMobMenuBar .mobDropdownMenu .mobDropdownMenuItem").click(function (e) {
        e.stopPropagation();
        $('.topMobMenuBar .mobMenu').trigger("click");
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''));
    });

    $(".topMobMenuBar .mobNavigator .mobPrevTab .navArrow").click(function (e) {
        e.stopPropagation();
        moveToPrevious();
    });

    $(".topMobMenuBar .mobNavigator .mobNextTab .navArrow").click(function (e) {
        e.stopPropagation();
        moveToNext();
    });



    var scrollTimeOut = null;
    $(".lightbox-container .tab").each(function (__, tabPage) {
        swipedetect(tabPage, function (swipedir) {
            if (swipedir == "left") {
                moveToNext();
            }
            else if (swipedir == "right") {
                moveToPrevious();
            }
        })
    });

    $(window).resize(function (e) {
        if (isMobile()) {
            var tabName = $(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab");
            if (!tabName)
                tabName = "tab1";
            if (tabName) {
                activeTabId = tabName.replace("tab", "");
                handleMobNavigation(activeTabId, true);
            }
        }
    });
    $(".lightbox-content .lightbox-tabs .tab").hover(
		function () {
		    var tab = $(this);
		    if (tab.hasClass("active")) {
		        return;
		    }
		    tab.addClass("hover");
		    $('.tab').not(this).addClass("another-hover");
		}
		, function () {
		    var tab = $(this);
		    if (tab.hasClass("active")) {
		        return;
		    }
		    tab.removeClass("hover");
		    $('.tab').removeClass("another-hover");
		}
	);
    totalTabs = $(".lightbox-container .tab").length;
});

function detailPageLoaded() {
    window.setTimeout(function () {
        var iframes = $(".lightbox-container .tab.active .ContentVideo .embed-container iframe:visible");
        if (iframes.length > 0) {
            var player = iframes.data("videoPlayer");
            if (!player) {
                player = new YT.Player(iframes.attr("id"), {
                    events: {
                        'onReady': startVideo
                    }
                });
                iframes.data("videoPlayer", player);
            }
            else {
                startVideo({ target: player });
            }
        }
    }, 100);

    window.setTimeout(function () {
        setScrollBar();
        if (!isMobile())
            $(".lightbox-container .scrollbar-external_wrapper").show();
    }, 100);

}

function startVideo(event) {
    var iframe = $(event.target.getIframe());
    if (iframe.is(":visible"))
        event.target.playVideo();
}
function stopVideos(privousVideos) {
    if (!privousVideos)
        privousVideos = $(".lightbox-container .tab .ContentVideo .embed-container iframe");
    if (privousVideos.length > 0) {
        for (var i = 0; i < privousVideos.length; i++) {
            previousFrame = $(privousVideos[i]);
            var oldPlayer = previousFrame.data("videoPlayer");
            if (oldPlayer) {
                oldPlayer.stopVideo();
            }
        }
    }
}


function setScrollBar(checkIfScrollApplied) {
    if (!checkIfScrollApplied || !$(".lightbox-container .tab.active .MainContentArea:first").hasClass("scroll-wrapper")) {
        $(".lightbox-container .tab.active .MainContentArea").scrollbar({
            "autoScrollSize": false,
            "scrolly": $(".lightbox-container .tab.active").find('.external-scroll_y'),
            ignoreMobile: true,
            duration: 10
        });
        $(".lightbox-container .tab.active .MainContentArea").scrollTop(0);
        if (!isMobile())
            $(".lightbox-container .scrollbar-external_wrapper").show();
    }


}

function handleMobNavigation(tabId, allowReLoad, slideDir) {

    var activeTab = $(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active");
    if (activeTab.length > 0) {
        var activTabData = activeTab.attr("data-tab");
        if (!allowReLoad && activTabData.replace("tab", '') == tabId)
            return;
        $(".topMobMenuBar").removeClass(activTabData + "Active");
        $(".topMobMenuBar").addClass("tab" + tabId + "Active");
    }
    $(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").removeClass("active");
    $(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab[data-tab='tab" + tabId + "']").addClass("active");

    $(".lightbox-tabs").addClass("expanded");
    showTab(tabId, allowReLoad, slideDir);


}

function showTab(tabId, allowReLoad, slideDir) {
    if (!allowReLoad && $(".lightbox-container .tab[data-tab='tab" + tabId + "']").is(":visible")) {
        return;
    }

    var previousTab = $(".lightbox-container .tab.active");
    $(".lightbox-container .tab.active").removeClass("active");

    $(".lightbox-container .tab").removeClass("active");
    $(".lightbox-container .tab[data-tab='tab" + tabId + "']").addClass("active");
    $(".lightbox-container .lightbox-top-menu-item").removeClass("active");
    $(".lightbox-container .lightbox-top-menu-item[data-tab='tab" + tabId + "']").addClass("active");
    $(".tab").removeClass("hover").removeClass("another-hover");
    detailPageLoaded();
    stopVideos(privousVideos);
    sendEvent();
    var privousVideos = previousTab.find(".ContentVideo .embed-container iframe");

}

function sendEvent() {
    var detailsVisible = $(".lightbox-container .tab.active").length > 0;
    if (detailsVisible) {
        var tabId = $(".lightbox-container .tab.active").attr("data-tab").replace("tab", "");

        var tabName = "Tab 1";
        switch (parseInt(tabId)) {
            case 1:
                tabName = "Tab 1";
                break;
            case 2:
                tabName = "Tab 2";
                break;
            case 3:
                tabName = "Tab 3";
                break;
            case 4:
                tabName = "Tab 4";
                break;
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'Tab',
            eventAction: 'TabView',
            eventLabel: 'tab ' + tabId,
            transport: 'beacon'
        });

        var isPixelSent = $(".lightbox-container .tab.active").attr("data-is-pixel-sent") == "true";
        if (!isPixelSent) {
            (function (d, p) { var a = new Image(); a.onload = function () { a = null }; a.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//rs.gwallet.com/r1/pixel/x" + p + "r" + Math.round(1E9 * Math.random()) })(document, "40229");
            $(".lightbox-container .tab.active").attr("data-is-pixel-sent", "true");
        }

    }
}


function moveToPrevious(slideDir) {
    var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
    var newTabId = activeTabId - 1;
    if (newTabId == 0)
        newTabId = totalTabs;
    handleMobNavigation(newTabId, false, slideDir);
}
function moveToNext(slideDir) {
    var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
    var newTabId = activeTabId + 1;
    if (newTabId == totalTabs + 1)
        newTabId = 1;
    handleMobNavigation(newTabId, false, slideDir);
}


(function ($) {
    $.fn.removeStyle = function (style) {
        var search = new RegExp(style + '[^;]+;?', 'g');

        return this.each(function () {
            $(this).attr('style', function (i, style) {
                return style.replace(search, '');
            });
        });
    };
}(jQuery));

function swipedetect(el, callback) {

    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 100, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 3000, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function (swipedir) { }

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        //e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function (e) {
        //e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        if (swipedir == "left" || swipedir == "right")
            e.preventDefault()
    }, false)
}
