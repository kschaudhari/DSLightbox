function isMobile() {
    return $(".mobDetector").is(":visible");
}
$(document).ready(function () {
    var type = window.location.hash.substr(1);
    
    
    // popup show Hide
    $("#ShwoPopUp").click(function () {
        showLightboxPopup(type);
    });
    if (type) {
        showLightboxPopup(type);
    }
    $(".removePopup").click(function () {
        $("#mydiv").fadeOut("slow");
    });
    $(".BackToMain").click(function () {
        showDefaultView();
    });
    $(".lightbox-defaultTab .lighbox-boxedMenu .lightbox-menuItem-boxed").hover(function () {
        removeHoverClassOfBox($(this));
        $(".lightbox-defaultTab").addClass($(this).attr("data-tab") + "BG");
        $(this).addClass($(this).attr("data-tab") + "Hover");
        $(this).addClass("hover");
        $(".lightbox-defaultTab").addClass("BGScale")//.delay(1000).removeClass("BGScale");
        setTimeout(function () {
            $(".lightbox-defaultTab").removeClass("BGScale");
        }, 50);
    },
    function () {
        removeHoverClassOfBox($(this));
    });

    function removeHoverClassOfBox(element)
    {
        var container = $(element).closest(".lightbox-defaultTab");
        container.removeClass();
        container.addClass("lightbox-defaultTab");
        container.find(".lighbox-boxedMenu .lightbox-menuItem-boxed.hover").each(function (__, item) {
            $(item).removeClass($(item).attr("data-tab") + "Hover");
            $(item).removeClass("hover");
        })
        
    }
    $(".lighbox-container .lightbox-defaultTab .lightbox-menuItem-boxed").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("box", ''), true);
    });

    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''));
    })

    $(".lighbox-container .lightbox-detailsPage .tab .readNextBox").click(function (e) {
        e.stopPropagation();
        moveToNext();
    })

    

    
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
function showTab(tabId, allowReLoad, slideDir) {
    if (!allowReLoad && $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).is(":visible")) {
        return;
    }
    var defaultVisible = $(".lighbox-container .lightbox-defaultTab").is(":visible");
    var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");
    $(".lighbox-container .lightbox-defaultTab").fadeOut();
    $(".lighbox-container .lightbox-detailsPage").fadeIn();

    if (slideDir) {
        hideDir = (slideDir == "left" ? "right" : "left");
        $(".lighbox-container .lightbox-detailsPage .tab.active").hide("slide", { direction: hideDir }, 500);
        $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).show("slide", { direction: slideDir }, 500);;
    }
    else {
        $(".lighbox-container .lightbox-detailsPage .tab.active").fadeOut();
        $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).fadeIn();
    }


    $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).addClass("active");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").removeClass("active");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item[data-tab='tab" + tabId + "']").addClass("active");

    window.setTimeout(function () {
        $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).find(".MainContaintArea").scrollbar({
            "autoScrollSize": false,
            "scrollx": $('.external-scroll_x'),
            "scrolly": $('.external-scroll_y'),
            duration: 10
        });
    }, 500);
    
    $(".lightbox-footer .BackToMain").show();
    $(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea").scrollTop(0);
    if (!isMobile())
        $(".lighbox-container .external-scroll_y").show();
}
function showDefaultView() {
    $(".lighbox-container .lightbox-defaultTab").fadeIn();
    $(".lighbox-container .lightbox-detailsPage").fadeOut();
    $(".lightbox-footer .BackToMain").hide();
    $(".lighbox-container .external-scroll_y").hide();
}
function moveToPrevious(slideDir) {
    var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
    var newTabId = activeTabId - 1;
    if (newTabId == 0)
        newTabId = 6;
    handleMobNavigation(newTabId, false, slideDir);
}
function moveToNext(slideDir) {
    var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
    var newTabId = activeTabId + 1;
    if (newTabId == 7)
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

function showLightboxPopup(type)
{
    var vid = $("#myVideo");
    $("#mydiv").fadeIn("slow");
    ga('send', 'pageview');
    var defaultTab = 1;
    if (type)
        defaultTab = type.replace("tab", '');
    if (defaultTab > 6 || defaultTab < 1)
        type = "";
    if (type || isMobile())
        handleMobNavigation(defaultTab, true);
    else
        showDefaultView();
}

function hideLightboxPopup()
{
    $(".removePopup").trigger("click");
}

var lightboxCounter = null;
var lightbocCounterInterval = 10;
function progressLightbox(time)
{
    lightboxCounter = window.setTimeout(function () {
        progressLightboxTimer(time, 0)
    }, lightbocCounterInterval)
}

function progressLightboxTimer(time, ellapsedTime)
{
    
    ellapsedTime = ellapsedTime + lightbocCounterInterval;
    
    renderProgress(ellapsedTime / time * 100);
    lightboxCounter = window.setTimeout(function () {
        progressLightboxTimer(time, ellapsedTime)
    }, lightbocCounterInterval)
}

function stopProgressLightbox()
{
    
    window.clearTimeout(lightboxCounter);
    clearProgress(0);
}
function clearProgress()
{
    ellapsedTime = 0;
    $(".animate-75-100-b, .animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform", "rotate(90deg)");
}
function renderProgress(progress)
{
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



