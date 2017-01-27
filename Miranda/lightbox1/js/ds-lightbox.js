function isMobile() {
    return $(".mobDetector").is(":visible");
}
var totalTabs = 0;
$(document).ready(function () {
    
    totalTabs = $(".lighbox-container .lightbox-detailsPage .tab").length;
    $(".removePopup").click(function () {
        hideLightboxPopup();
        
    });
    $(".BackToMain").click(function () {
        showDefaultView();
    });
   
    $(".lighbox-container .tab-menu").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''), true);
    });

    $(".lighbox-container .lightbox-detailsPage .tab .readNextBox").click(function (e) {
        e.stopPropagation();
        moveToNext();
    });



    $(".tab3 .zoom-container .plus").click(function (){
        var currentWidth = $(".tab3 .map").width();
        var currentHeight = $(".tab3 .map").height();

        // Get center coordinates
        var location = $(".tab3 .map").position();
        var center = new Object();
        center.x = location.left + ($(".tab3 .map").width() / 2);
        center.y = location.top + ($(".tab3 .map").height() / 2);

        // Set new width (i.e. zoom in)
        currentWidth += 300;

        // Get transform values, to offset the center with
        var matrix = $(".tab3 .map").css('transform');
        var values = matrix.match(/-?[\d\.]+/g);
        var xTransform = values[4];
        var yTransform = values[5];

        // Calculate new left position based on new width, keeping the same center x-coordinate
        var newLeft = (center.x - xTransform) - (currentWidth/2) ;

        // Set new width and new left
        $(".tab3 .map").width(currentWidth);
        $(".tab3 .map").css( { left: newLeft });

        // New height is adjusted dynamically, for width increment of 300 this is constant value of 274
        var currentHeightNew = currentHeight + 274;
        
        // Calculate new top position based on new height, keeping the same center y-coordinate
        var newTop = (center.y - yTransform) - (currentHeightNew/2);

        // Set new top
        $(".tab3 .map").css( { top: newTop });
    });


    $(".tab3 .zoom-container .minus").click(function (){
        var currentWidth = $(".tab3 .map").width();
        var currentHeight = $(".tab3 .map").height();

        // Get center coordinates
        var location = $(".tab3 .map").position();
        var center = new Object();
        center.x = location.left + ($(".tab3 .map").width() / 2);
        center.y = location.top + ($(".tab3 .map").height() / 2);

        // Set new width (i.e. zoom out)
        currentWidth -= 300;

        // Get transform values, to offset the center with
        var matrix = $(".tab3 .map").css('transform');
        var values = matrix.match(/-?[\d\.]+/g);
        var xTransform = values[4];
        var yTransform = values[5];

        // Calculate new left position based on new widht, keeping the same center x-coordinate
        var newLeft = (center.x - xTransform) - (currentWidth/2);

        // Set new width and left   
        $(".tab3 .map").width(currentWidth);
        $(".tab3 .map").css( { left: newLeft });

        // New height is adjusted dynamically, for width decrease of 300 this is constant value of 274
        var currentHeightNew = currentHeight - 274;
        
        // Calculate new top position based on new height, keeping the same center y-coordinate
        var newTop = (center.y - yTransform) - (currentHeightNew/2);  

        // Set new top
        $(".tab3 .map").css( { top: newTop });
    });




    $(".lighbox-container .lightbox-defaultTab .default-navigator .prevTab").click(function (e) {
        moveToPrevious();
    });
    $(".lighbox-container .lightbox-defaultTab .default-navigator .nextTab").click(function (e) {
        moveToNext();
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

    
    $(".lighbox-container .lightbox-detailsPage .tab").each(function (__, tabPage) {
        swipedetect(tabPage, function (swipedir) {
            if(swipedir == "left")
            {
                moveToNext();
            }
            else if (swipedir == "right")
            {
                moveToPrevious();
            }
        })
    });

    if (!inIframe()) {
        showLightboxPopup();
    }
});


function detailPageLoaded()
{
    window.setTimeout(function () {
        setScrollBar();
        sendAnalyticsEvent();
        var iframes = $(".lighbox-container .lightbox-detailsPage .tab.active .ContentVideo .embed-container iframe:visible");
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
    
}

function startVideo(event) {
    var iframe = $(event.target.getIframe());
    if(iframe.is(":visible"))
        event.target.playVideo();
}
function stopVideos(privousVideos) {
    if (!privousVideos)
        privousVideos = $(".lighbox-container .lightbox-detailsPage .tab .ContentVideo .embed-container iframe");
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

function setScrollBar(checkIfScrollApplied)
{
    if (!checkIfScrollApplied || !$(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea:first").hasClass("scroll-wrapper")) {
        $(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea").scrollbar({
            "autoScrollSize": false,
            "scrollx": $('.external-scroll_x'),
            "scrolly": $('.external-scroll_y'),
            ignoreMobile: true,
            duration: 10
        });
    }
        window.setTimeout(function () {
            detailPageLoaded();
        }, 100);
    
}

function showTab(tabId, allowReLoad, slideDir) {
    if (!allowReLoad && $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).hasClass(".active")) {
        return;
    }
    var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");
    
    var previousTab = $(".lighbox-container .lightbox-detailsPage .tab.active");
    
    $(".lighbox-container .lightbox-detailsPage .tab").removeClass("active");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").removeClass("active");
    stopVideos();
    var activeTab = $(".lighbox-container .lightbox-detailsPage .tab[data-tab='tab" + tabId + "']");
    activeTab.addClass("active");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item[data-tab='tab" + tabId + "']").addClass("active");

    $(".lighbox-container .lightbox-footer .tab-menu").removeClass("active");
    $(".lighbox-container .lightbox-footer .tab-menu[data-tab='tab" + tabId + "']").addClass("active");
    
    //Following code for dynamic loading of tab htmls
    //TODO: get the tab releated html using ajax call and on success call detailPageLoaded
    /*if (!activeTab.attr('data-loaded')) {
        $.get("tab-" + tabId + ".html", function (data) {
            activeTab.html(data);
            activeTab.attr('data-loaded', true);
            detailPageLoaded();
        });
    }
    else
    {*/
        detailPageLoaded();
    //}
}

function sendAnalyticsEvent() {
    var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");

    if (detailsVisible) {
        var tabId = $(".lighbox-container .lightbox-detailsPage .tab.active").attr("data-tab").replace("tab", "");
        
        var tabName = "WESTERN AUSTRALIA";
        switch (parseInt(tabId)) {
            case 1:
                tabName = "WESTERN AUSTRALIA";
                break;
            case 2:
                tabName = "FOOD & WINE";
                break;
            case 3:
                tabName = "COASTAL & AQUATIC";
                break;
            case 4:
                tabName = "ADVENTURE & NATURE";
                break;
            case 5:
                tabName = "FLY THERE IN STYLE";
                break;
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'Tab',
            eventAction: 'TabView',
            eventLabel: 'tab ' + tabId + ' - ' + tabName,
            transport: 'beacon'
        });

        //additional pixel if you want to send
        //var isPixelSent = $(".lighbox-container .lightbox-detailsPage .tab.active").attr("data-is-pixel-sent") == "true";
        //if(!isPixelSent)
        //{
        //    (function (d, p) { var a = new Image(); a.onload = function () { a = null }; a.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//rs.gwallet.com/r1/pixel/x" + p + "r" + Math.round(1E9 * Math.random()) })(document, "40229");
        //    $(".lighbox-container .lightbox-detailsPage .tab.active").attr("data-is-pixel-sent", "true");
        //}

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

    showTab(tabId, allowReLoad, slideDir);
    

}

// following function to change inline css style attribute to replace particular value or to remove it completely 
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

// plugin to handle swipe in mobile
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







