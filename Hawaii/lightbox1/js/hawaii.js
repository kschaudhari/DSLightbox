$(document).ready(function () {

    $(".island").hover(
    function () {
        $(".island").removeClass('highlighted');
        $(".gradient").show();
        $(this).addClass('highlighted');
    }, 
    function () {
        $(".island").addClass('highlighted');
        $(".gradient").hide();
    }
    );

    $(".footer-menu-item").hover(
    function () {
        $(this).addClass('active');
        $(this).find("img.down").hide();
        $(this).find("img.up").show();

        if ($(this).attr('id')=="island") {
            $(".popup").removeClass("popup-active");
            $("#dd-menu").addClass("popup-active");
        }
    }, 
    function () {
        $(this).removeClass('active');
        $(this).find("img.up").hide();
        $(this).find("img.down").show();
    }
    );


    $(".popup-close").click(
    function () {
        $(this).closest(".popup").removeClass("popup-active");
    });

    $(".footer-menu-item").click(
    function () {

        $(".popup").removeClass("popup-active");

        var id = $(this).attr("id");

        if (id == "video") {
            $("#video-popup").addClass("popup-active");
        } 
        else if (id == "trip") {
            $("#trip-popup").addClass("popup-active");
        }

    });

});