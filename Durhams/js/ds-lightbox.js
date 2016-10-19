function isMobile() {
    return $(".mobDetector").is(":visible");
}
$(document).ready(function () {
    setScrollBar();

    var type = window.location.hash.substr(1);
    if (document.referrer) {
        var is_mrs_reffer = document.referrer.indexOf("mrandmrssmith.com") > -1;
        if (is_mrs_reffer) {
            $(".lighbox-container").addClass("smithSource");
        }
    }

    // popup show Hide
    $("#ShwoPopUp").click(function () {
        showLightboxPopup(type);
    });
    showLightboxPopup(type);
    $(".removePopup").click(function () {
        hideLightboxPopup();
        
    });
    $(".BackToMain").click(function () {
        showDefaultView();
    });
   
    $(".lighbox-container .lightbox-content .lightbox-tab-menu-item").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''), true);
    });

    $(".lighbox-container .tab-page-details .detail-container .mob-footer .readNextBox").click(function (e) {
        e.stopPropagation();
        moveToNext();
    })

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

    
    $(".tab").hover(function () {
        addHoverClasses(this)
        },
        function () {
            removeHoverClasses(this);
        });
    $(".tab").click(function (e) {
        if ($(this).hasClass("active"))
            return;

        tabId = $(this).attr("data-tab").replace("tab", "");
        handleMobNavigation(tabId, false);

    });

   



    $(".default-tab-content").click(function (e) {
       tabId = $(this).attr("data-tab").replace("tab", "");
       handleMobNavigation(tabId, false);
    });
    $(".default-tab-content").hover(function () {
        addHoverClasses(this)
    },
        function () {
            removeHoverClasses(this);
        });
    $(".lighbox-container .lightbox-detailsPage .tab-page-details").each(function (__, tabPage) {
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
    $(".lighbox-container .Container .ContentBox .ContentVideo .embed-container").click(function (e) {
        if(isVideoPlaying)
        {
            var player = $(this).data("videoPlayer");
            stopVideos();
        }
    });
    
});
var isVideoPlaying = false;
function detailPageLoaded() {
    var iframes = $(".lighbox-container .Container .ContentBox .ContentVideo .embed-container");
    if (iframes.length > 0) {
        var player = iframes.data("videoPlayer");
        if (!player) {
            player = new Vimeo.Player('video1Player');
            player.on('play', function () { isVideoPlaying = true });
            player.on('pause', function () { isVideoPlaying = false });
            iframes.data("videoPlayer", player);
            player.ready().then(function () {
                startVideo(player);
            });
            
        }
        else {
            startVideo(player);
        }


    }
}

function loadTab() {
    // load video
    window.setTimeout(function () {
        detailPageLoaded();
    }, 500);

    lazyLoadImages();

    $(window).resize(function (e) {
        lazyLoadImages();
    })
}

function lazyLoadImages()
{
    
        $('.lighbox-container div[data-background-image]').each(function (__, item) {
            var $item = $(item).find('.content-image');
            $item.css("background-image", 'url(' + $(item).attr("data-background-image") + ')');
            //if ($item.find('img').length == 0) {
            //    $item.append('<img src="' + $(item).attr("data-background-image") + '"/>');
            //}
        });
    
}

function startVideo(player) {
    window.setTimeout(function () {
        player.play();
    }, 500);
    
}

function stopVideos(privousVideos) {
    if (!privousVideos)
        privousVideos = $(".lighbox-container .Container .ContentBox .ContentVideo .embed-container");
    if (privousVideos.length > 0) {
        for (var i = 0; i < privousVideos.length; i++) {
            previousFrame = $(privousVideos[i]);
            var oldPlayer = previousFrame.data("videoPlayer");
            if (oldPlayer) {
                oldPlayer.pause();
            }
        }
    }
}

function addHoverClasses(element)
{
    if ($(".tab-container").hasClass("expanded")) {
        var tabId = $(element).attr("data-tab");
        $(".default-tab-content[data-tab='" + tabId + "'] .explore-outer").addClass("hover");
        return;
    }

    $(element).addClass("hover");
    var tabId = $(element).attr("data-tab");
    var tabs = $(element).closest(".tabs");
    var tab = tabs.find(".tab[data-tab='" + tabId + "']")
    $(tab).addClass("hover");

    var nextElement = tabs.find(".tab").not(tab);
    nextElement.addClass("hoverAnother");

    var tabDefaultContent = tabs.find(".default-tab-content[data-tab='" + tabId + "']");
    tabDefaultContent.addClass("hover");

    tabs.addClass("hover" + tabId);
}
function removeHoverClasses(element) {
    $(element).removeClass("hover");
    $(".default-tab-content").removeClass("hover");
    $(".explore-outer").removeClass("hover");
    var tabs = $(element).closest(".tabs");
    var tabId = $(element).attr("data-tab");
    var tab = tabs.find(".tab[data-tab='" + tabId + "']")
    $(tab).removeClass("hover");
    var nextElement = tabs.find(".tab").not(tab);
    nextElement.removeClass("hoverAnother");

    tabs.removeClass("hover" + tabId);
    
}

function setScrollBar(checkIfScrollApplied)
{
    if (!checkIfScrollApplied || !$(".lighbox-container .Container .ContentBox .MainContaintArea:first").hasClass("scroll-wrapper")) {
       
        window.setTimeout(function () {
            if (!isMobile())
            {
                $(".lighbox-container .Container .ContentBox .MainContaintArea").scrollbar({
                    "autoScrollSize": false,
                    "scrollx": $('.external-scroll_x'),
                    "scrolly": $('.external-scroll_y'),
                    duration: 10
                });
                $(".lighbox-container .Container .ContentBox .MainContaintArea").removeStyle("overflow");
                $(".lighbox-container .Container .ContentBox .MainContaintArea").removeStyle("overflow-x");
            }
            else
            {
                $(".lighbox-container .Container .ContentBox .MainContaintArea").css("overflow", "scroll");
                $(".lighbox-container .Container .ContentBox .MainContaintArea").css("overflow-x", "hidden");
            }
        }, 500);
    }
    $(".scrollbar-external_wrapper").show();
}

function showTab(tabId, allowReLoad, slideDir) {
    var newTab = $(".lighbox-container .lightbox-detailsPage .tab[data-tab='tab" + tabId + "']");
    if (!allowReLoad && newTab.hasClass("active")) {
        return;
    }
    
    removeHoverClasses(newTab);
    $(".tab-container").addClass("expanded");
    $(".tab-container .active").removeClass("active")
    $(".lighbox-container .lightbox-detailsPage .tab").removeClass("active");
    $(".lighbox-container .lightbox-detailsPage .tab[data-tab='tab" + tabId + "']").addClass("active");
    newTab.closest(".tabs").addClass("active");
    $(".tab-container .tab").css({ 'z-index': '6' });
    $(".tab-container .tab").not(".active").css({ 'z-index': '7' });
    
    $(".lighbox-container .lightbox-detailsPage .tab-page-details[data-tab='tab" + tabId + "']").addClass("active");
    $(".lighbox-container .Container .ContentBox .MainContaintArea").scrollTop(0);
    setScrollBar();
    
    $(".default-tab-content").show();
    $(".default-tab-content[data-tab='tab" + tabId + "']").hide();
    
    loadTabImages($(".lighbox-container .lightbox-detailsPage .tab-page-details[data-tab='tab" + tabId + "']"));
    sendEvent()
}

function sendEvent() {
    var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");

    if (detailsVisible) {
        var tabId = $(".lighbox-container .lightbox-detailsPage .tab.active").attr("data-tab").replace("tab", "");

        var tabName = "Island adventure";
        switch (parseInt(tabId)) {
            case 1:
                tabName = "Island adventure";
                break;
            case 2:
                tabName = "Bermy style";
                break;
            case 3:
                tabName = "Food & drink";
                break;
            case 4:
                tabName = "Couple's retreat";
                break;
            
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'Tab',
            eventAction: 'TabView',
            eventLabel: 'tab ' + tabId + ' - ' + tabName,
            transport: 'beacon'
        });
    }
}


function loadTabImages(tabElement)
{
    $(tabElement).find(".description-image-rectangle[data-image]").each(function (__, item) {
        var $item = $(item);
        $item.css({ 'background-image': 'url(' + $item.attr("data-image") + ')' });
    })
}
var totalTabs = 4;
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







