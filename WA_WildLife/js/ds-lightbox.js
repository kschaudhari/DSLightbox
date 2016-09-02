$(document).ready(function () {
    
    // popup show Hide
    $("#ShwoPopUp").click(function () {
        var vid = $("#myVideo");
        $("#mydiv").fadeIn("slow");
    });
    $(".removePopup").click(function () {
        $("#mydiv").fadeOut("slow");
    });
    // popup show Hide end 
    $('.MobMenuBtn').off("click");
    $('.MobMenuBtn').click(function (e) {
        e.stopPropagation();
        var content = $(".mobMenuContainer");
        if ($(content).is(":visible")) {
            $(content).slideUp("slow");
        } else {
            $(content).slideDown("slow");
        }
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
        showTab($(this).attr("data-tab").replace("box", ''));
    });

    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").click(function (e) {
        e.stopPropagation();
        showTab($(this).attr("data-tab").replace("tab", ''));
    })

    function showTab(tabId)
    {
        if ($(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).is(":visible"))
        {
            return;
        }
        var defaultVisible = $(".lighbox-container .lightbox-defaultTab").is(":visible");
        var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");
        if(defaultVisible)
        {
            $(".lighbox-container .lightbox-defaultTab").fadeOut();
            $(".lighbox-container .lightbox-detailsPage").fadeIn();
        }
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

});