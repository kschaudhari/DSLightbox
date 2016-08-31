$(document).ready(function () {

    // popup show Hide
    $("#ShwoPopUp").click(function () {
        var vid = $("#myVideo");
        $("#mydiv").fadeIn("slow");
    });
    $(".CloseBtn").click(function () {
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
    })

});