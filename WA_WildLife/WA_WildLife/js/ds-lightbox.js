﻿$(document).ready(function () {
    
    function isMobile()
    {
        return $(".mobDetector").is(":visible");
    }
    // popup show Hide
    $("#ShwoPopUp").click(function () {
        var vid = $("#myVideo");
        $("#mydiv").fadeIn("slow");
	
        if (isMobile())
            handleMobNavigation(1, true);
        else
            showDefaultView();
    });
    $(".removePopup").click(function () {
        $("#mydiv").fadeOut("slow");
    });
    $(".BackToMain").click(function () {
        showDefaultView();
    });
    $(".lightbox-defaultTab .lighbox-boxedMenu .lightbox-menuItem-boxed").hover(function () {
        $(".lightbox-defaultTab").addClass($(this).attr("data-tab") + "BG");
        $(this).addClass($(this).attr("data-tab") + "Hover");
        $(this).addClass("hover");
        $(".lightbox-defaultTab").addClass("BGScale")//.delay(1000).removeClass("BGScale");
        setTimeout(function () {
            $(".lightbox-defaultTab").removeClass("BGScale");
        }, 50);
    }, function () {
        $(".lightbox-defaultTab").removeClass($(this).attr("data-tab") + "BG");
        $(this).removeClass($(this).attr("data-tab") + "Hover");
        $(this).removeClass("hover");
        $(".lightbox-defaultTab").removeClass("BGScale");
    });

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

    function showTab(tabId, allowReLoad)
    {
        if (!allowReLoad && $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).is(":visible"))
        {
            return;
        }
        var defaultVisible = $(".lighbox-container .lightbox-defaultTab").is(":visible");
        var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");
            $(".lighbox-container .lightbox-defaultTab").fadeOut();
            $(".lighbox-container .lightbox-detailsPage").fadeIn();

        $(".lighbox-container .lightbox-detailsPage .tab.active").fadeOut();
        $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).fadeIn();
        
        $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).addClass("active");
        $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").removeClass("active");
        $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item[data-tab='tab" + tabId + "']").addClass("active");
        
        $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).find(".MainContaintArea").scrollbar({
            "autoScrollSize": false,
            "scrollx": $('.external-scroll_x'),
            "scrolly": $('.external-scroll_y')
        });
        $(".lightbox-footer .BackToMain").show();
        $(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea").scrollTop(0)
    }

    function showDefaultView()
    {
        $(".lighbox-container .lightbox-defaultTab").fadeIn();
        $(".lighbox-container .lightbox-detailsPage").fadeOut();
        $(".lightbox-footer .BackToMain").hide();
    }

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
        var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
        var newTabId = activeTabId - 1;
        if (newTabId == 0)
            newTabId = 6;
        handleMobNavigation(newTabId);
    });

    $(".topMobMenuBar .mobNavigator .mobNextTab .navArrow").click(function (e) {
        e.stopPropagation();
        moveToNext();
    });

    function moveToNext()
    {
        var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
        var newTabId = activeTabId + 1;
        if (newTabId == 7)
            newTabId = 1;
        handleMobNavigation(newTabId);
    }

    function handleMobNavigation(tabId, allowReLoad)
    {
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

        showTab(tabId,allowReLoad);
    }

    $(".lighbox-container .lightbox-detailsPage .tab .MainContaintArea").scroll(function (e) {
        if (isMobile())
            return;
        var activeTab = $(this);
        var images = activeTab.find(".TextContainer .TextBgImg img.TextBgImageMob");
        var divScrollTop = activeTab.scrollTop();
        var scrollHeight = activeTab.innerHeight();
        var imageFound = false;
        images.each(function (__, image) {
            var textContainer = $(image).closest(".TextBgImg");
            var elementTop = textContainer.position().top;
            if ((divScrollTop + scrollHeight) > (elementTop + scrollHeight))
            {
                activeTab.closest(".tab").css("background-image", "url(" + $(image).attr("src") + ")");
                imageFound = true;
            }
            
        });
        if (!imageFound)
        {
            activeTab.closest(".tab").removeStyle("background-image");
        }
    })
});

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