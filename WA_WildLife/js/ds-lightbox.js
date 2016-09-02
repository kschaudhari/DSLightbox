$(document).ready(function () {
    
    // popup show Hide
    $("#ShwoPopUp").click(function () {
        var vid = $("#myVideo");
        $("#mydiv").fadeIn("slow");
        
        if ($(".mobDetector").is(":visible"))
            handleMobNavigation(1);
        else
            showDefaultView();
    });
    $(".removePopup").click(function () {
        $("#mydiv").fadeOut("slow");
    });
    
    $(".lightbox-defaultTab .lighbox-boxedMenu .lightbox-menuItem-boxed").hover(function () {
        $(".lightbox-defaultTab").addClass($(this).attr("data-tab") + "BG");
        $(this).addClass($(this).attr("data-tab") + "Hover");
        $(this).addClass("hover");
    }, function () {
        $(".lightbox-defaultTab").removeClass($(this).attr("data-tab") + "BG");
        $(this).removeClass($(this).attr("data-tab") + "Hover");
        $(this).removeClass("hover");
    });

    $(".lighbox-container .lightbox-defaultTab .lightbox-menuItem-boxed").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("box", ''), true);
    });

    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''));
    })

    function showTab(tabId)
    {
        if ($(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).is(":visible"))
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
        $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item[data-tab='tab" + tabId + "'").addClass("active");

        $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).find(".MainContaintArea").scrollbar({
            "autoScrollSize": false,
            "scrollx": $('.external-scroll_x'),
            "scrolly": $('.external-scroll_y')
        });
    }

    function showDefaultView()
    {
        $(".lighbox-container .lightbox-defaultTab").fadeIn();
        $(".lighbox-container .lightbox-detailsPage").fadeOut();
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
        var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
        var newTabId = activeTabId + 1;
        if (newTabId == 7)
            newTabId = 1;
        handleMobNavigation(newTabId);
    });

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

        showTab(tabId);
    }

});