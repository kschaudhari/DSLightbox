function isMobile() {
    return $(".mobDetector").is(":visible");
}
$(document).ready(function () {
    var type = window.location.hash.substr(1);
    
    autoChangeTab();
    setBookLetViewForReadMore();
    setBookLetViewForDetails();
    // popup show Hide
    $("#ShwoPopUp").click(function () {
        showLightboxPopup(type);
    });
    showLightboxPopup(type);
    $(".removePopup").click(function () {
        $("#mydiv").fadeOut("slow");
    });
    $(".BackToMain").click(function () {
        showDefaultView();
    });
   
    $(".lighbox-container .lightbox-content .lightbox-tab-menu-item").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''), true);
    });

    $(".lighbox-container .lightbox-detailsPage .tab .readNextBox").click(function (e) {
        e.stopPropagation();
        moveToNext();
    })

    $(".lighbox-container .lightbox-defaultTab .default-navigator .prevTab").click(function (e) {
        moveToPrevious();
    });
    $(".lighbox-container .lightbox-defaultTab .default-navigator .nextTab").click(function (e) {
        moveToNext();
    });

    $(".lighbox-container .lightbox-defaultTab .default-navigator .readMore").click(function (e) {
        showMoreDetails();
    });

    $(".lighbox-container .lightbox-detailsPage .detail-navigator .mainMenu").click(function (e) {
        showDefaultView();
    });
    $("#TabbackToMain").click(function () {
        showDefaultView();
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
    $(".lighbox-container .lightbox-detailsPage .tab .MainContaintArea").scroll(function (e) {

        if (isMobile())
            return;

        if (scrollTimeOut)
            clearTimeout(scrollTimeOut);
        var activeTab = $(this);
        scrollTimeOut = setTimeout(function () {
            var images = activeTab.find(".TextContainer .TextBgImg img.TextBgImageMob");
            var divScrollTop = activeTab.scrollTop();
            var scrollHeight = activeTab.innerHeight();
            var imageFound = false;
            images.each(function (__, image) {
                var textContainer = $(image).closest(".TextBgImg");
                var elementTop = textContainer.position().top;
                var delay = parseInt($(image).attr("data-delay"));
                if (!delay)
                    delay = textContainer.innerHeight() + 10;
                if ((divScrollTop + scrollHeight) > (elementTop + delay + scrollHeight)) {
                    activeTab.closest(".tab").css("background-image", "url(" + $(image).attr("src") + ")");
                    imageFound = true;
                }

            });
            if (!imageFound) {
                activeTab.closest(".tab").removeStyle("background-image");
            }
        }, 120);
        
    })

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

    
});
var $bookBlockDefault = null;
function setBookLetViewForReadMore()
{
    $bookBlockDefault = $('.lightbox-default-booklet').bookblock({
        speed : 500,
        perspective : 2000,
        shadowSides	: 0.8,
        shadowFlip	: 0.4,
        onEndFlip : function(old, page, isLimit) {
            current = page;
            if ($(".lighbox-container .lightbox-content .lightbox-defaultTab").is(":visible")) {
                autoChangeTab();
                $(".lighbox-container .scrollbar-external_wrapper").hide();
            }
            else {
                handleDetailBookletEnd();
                //detailPageLoaded();
            }
        }
    } )
}
var $bookBlockPage = null;
function setBookLetViewForDetails() {
    $bookBlockPage = $('.lightbox-detail-booklet').bookblock({
        speed: 500,
        perspective: 2000,
        shadowSides: 0.8,
        shadowFlip: 0.4,
        onEndFlip: function (old, page, isLimit) {
            current = page + 1;
            handleDetailBookletEnd();
            //
        }
    })
}

function detailPageLoaded()
{
    var iframes = $(".lighbox-container .lightbox-detailsPage .tab.active .ContentVideo .embed-container iframe:visible");
    if (iframes.length > 0) {
        var player = iframes.data("videoPlayer");
        if (!player) {
            player = new Vimeo.Player(iframes);
            iframes.data("videoPlayer", player);
        }
       
                player.play();
        
    }
}

function handleDetailBookletEnd()
{
    window.setTimeout(function () {

        $(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea").scrollbar({
            "autoScrollSize": false,
            "scrollx": $('.external-scroll_x'),
            "scrolly": $('.external-scroll_y'),
            ignoreMobile: true,
            duration: 10
        });
        window.setTimeout(function () {
            detailPageLoaded();
        }, 1000);
    }, 500);

    $(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea").scrollTop(0);
    if (!isMobile())
        $(".lighbox-container .scrollbar-external_wrapper").show();
}
var autoChangeTimer = null;
var autoChangeTimeInterval = 100;
var autoChangeTimeElapsed = 0;
var autoChangeTimeDuration = 5000;
var totalTabs = 5;
function autoChangeTab()
{
    if (autoChangeTimer)
        window.clearTimeout(autoChangeTimer);
    $(".lighbox-container .lightbox-content .bullet-container .bullet .bullet-progress").css("width", "0px");
    autoChangeTimeElapsed = 0;
    autoChangeTimer = window.setTimeout(updateAutoChangeProgress, autoChangeTimeInterval);

}
function updateAutoChangeProgress()
{
    if (!$(".lighbox-container .lightbox-defaultTab").is(":visible")) {
        $(".lighbox-container .lightbox-content .bullet-container .bullet .bullet-progress").css("width", "0px");
        window.clearTimeout(autoChangeTimer);
        return;
    }
    autoChangeTimeElapsed += autoChangeTimeInterval;
    var progress = autoChangeTimeElapsed / autoChangeTimeDuration * 100;
    var activeTabId = $(".lighbox-container .lightbox-content .lightbox-tab-menu-item.active").attr("data-tab").replace("tab", '');
    if (progress > 100)
    {
        showNextDefaultTab();
        
        return;
    }
    
    $(".lighbox-container .lightbox-content .bullet-container .bullet[data-tab='tab" + activeTabId + "'] .bullet-progress").css("width", progress + "%");
    autoChangeTimer = window.setTimeout(updateAutoChangeProgress, autoChangeTimeInterval);
    
}
function showNextDefaultTab() {
    
    var activeTabId = $(".lighbox-container .lightbox-content .lightbox-tab-menu-item.active").attr("data-tab").replace("tab", '');
    activeTabId = parseInt(activeTabId);
    var nextTabId = activeTabId + 1;
    if (nextTabId > totalTabs) {
        nextTabId = 1;
    }
    handleMobNavigation(nextTabId, false);
}
function showDefaultTab(tabId, allowReLoad) {
    
    $(".lighbox-container .lightbox-content .lightbox-tab-menu-item.active").removeClass("active");
    //$(".lighbox-container .lightbox-content .lightbox-defaultTab .welcomeTab.active").fadeOut();
    $(".lighbox-container .lightbox-content .lightbox-defaultTab .welcomeTab.active").removeClass("active");
    $(".lighbox-container .lightbox-content .lightbox-tab-menu-item[data-tab='tab" + tabId + "']").addClass("active");
    $(".lighbox-container .lightbox-content .lightbox-defaultTab .welcomeTab[data-tab='tab" + tabId + "']").addClass("active");
    //$(".lighbox-container .lightbox-content .lightbox-defaultTab .welcomeTab[data-tab='tab" + tabId + "']").fadeIn();
    if ($(".lighbox-container .lightbox-content .lightbox-defaultTab").is(":visible")) {
        autoChangeTab();
    }
}

function showTab(tabId, allowReLoad, slideDir) {
    if (!allowReLoad && $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).is(":visible")) {
        return;
    }
    var defaultVisible = $(".lighbox-container .lightbox-defaultTab").is(":visible");
    var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");
    
    var previousTab = $(".lighbox-container .lightbox-detailsPage .tab.active");
    $(".lighbox-container .lightbox-detailsPage .tab.active").hide();
    $(".lighbox-container .lightbox-detailsPage .tab[data-tab='tab" + tabId + "']").show();

    $(".lighbox-container .lightbox-detailsPage .tab").removeClass("active");
    $(".lighbox-container .lightbox-detailsPage .tab[data-tab='tab" + tabId + "']").addClass("active");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").removeClass("active");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item[data-tab='tab" + tabId + "']").addClass("active");

    if (detailsVisible) {
        
        if (!isMobile())
            $bookBlockPage.bookblock('jump', tabId);
        else
            handleDetailBookletEnd();
    }
    var privousVideos = previousTab.find(".ContentVideo .embed-container iframe");
    if (privousVideos.length > 0)
    {
        for (var i = 0; i < privousVideos.length; i++) {
            previousFrame = $(privousVideos[i]);
            var oldPlayer = previousFrame.data("videoPlayer");
            if (oldPlayer) {
                oldPlayer.pause();
            }
        }
    }
    setImageCarousel($(".lighbox-container .lightbox-detailsPage .tab.active .page-background-images"), $(".lighbox-container .lightbox-detailsPage .image-bullet-container"), $(".lighbox-container .lightbox-detailsPage .next-image"), $(".lighbox-container .lightbox-detailsPage .prev-image"));
}
function showDefaultView() {
    $(".lighbox-container .lightbox-defaultTab").fadeIn();
    $(".lighbox-container .lightbox-detailsPage").fadeOut();
    
    $bookBlockDefault.bookblock('jump', 1);
    //$(".lightbox-footer .BackToMain").hide();
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
    window.clearTimeout(autoChangeTimer);
    $(".lighbox-container .lightbox-content .bullet-container .bullet .bullet-progress").css("width", "0px");

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

    showDefaultTab(tabId, allowReLoad);
    showTab(tabId, allowReLoad, slideDir);
    

}

function showMoreDetails()
{
    window.clearTimeout(autoChangeTimer);
    $(".lighbox-container .lightbox-content .bullet-container .bullet .bullet-progress").css("width", "0px");
    var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));

    handleMobNavigation(activeTabId, true);
    handleDetailBookletEnd();
    if(!isMobile())
    $bookBlockDefault.bookblock('jump', 2);
    
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




