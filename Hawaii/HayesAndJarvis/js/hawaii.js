$(document).ready(function () {

    $(".island").hover(
    function () {

        if (!islandSelected) {
            $(".island").removeClass('highlighted');
            $(".gradient").show();
            $(this).addClass('highlighted');
            $(".big-palms").addClass("hover-island");
        }

    },
    function () {

        if (!islandSelected) {
            $(".island").addClass('highlighted');
            $(".gradient").hide();
            $(".big-palms").removeClass("hover-island");
        }
    }
    );

    $(".footer-menu-item").hover(
    function () {
        $(this).addClass('active');
        $(this).find("img.down").hide();
        $(this).find("img.up").show();

        if ($(this).attr('id') == "island") {
            //if (!($("#video-popup").hasClass("popup-active"))) {
            //    $(".popup").removeClass("popup-active");
            //    stopVideos();
            //}
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
        if ($(this).closest(".popup").hasClass("content-popup"))
            $(".scrollbar-external_wrapper").hide();
        if(!($("#video-popup").hasClass("popup-active")))
            stopVideos();
    });
    $("#journey").click(
    function () {

    });

    $(".mobDropdownMenuItem").click(function (e) {
        $('.topMobMenuBar .mobMenu').trigger("click");
    });
    $(".mobNavigatorContent .mobPrevTab .navArrow").click(function () {
        var activeIsland = $(".island-content-container .island-content.active");
        var nextIsland = null;
        if(activeIsland.index() == 0)
        {
            nextIsland = $(".island-content-container .island-content:last");
        }
        else
        {
            nextIsland = activeIsland.prev();
        }
        var id = nextIsland.attr("id").replace("-content", "");
        var mapIsland = $(".map .island[data-content='" + id + "']");
        showIslandDetails(mapIsland);
    });
    $(".mobNavigatorContent .mobNextTab .navArrow").click(function () {
        var activeIsland = $(".island-content-container .island-content.active");
        var nextIsland = null;
        if (activeIsland.index() == 5) {
            nextIsland = $(".island-content-container .island-content:first");
        }
        else {
            nextIsland = activeIsland.next();
        }
        var id = nextIsland.attr("id").replace("-content", "");
        var mapIsland = $(".map .island[data-content='" + id + "']");
        showIslandDetails(mapIsland);
    });
    $(".footer-menu-item, .mobDropdownMenuItem").click(
    function () {

        $(".popup").removeClass("popup-active");
        $(".scrollbar-external_wrapper").hide();
        var id = $(this).attr("id");
        $(".popup-details .island-content-container").hide();
        if (id == "video") {
            $(".lightbox-detailsPage").removeClass("island-active");
            $("#video-popup").addClass("popup-active");
            hideIslandDetails();
            detailPageLoaded();
        }
        else if (id == "trip") {
            $(".lightbox-detailsPage").removeClass("island-active");
            $("#trip-popup").addClass("popup-active");
            $("#trip-popup .island-content-container").show();
            hideIslandDetails();
            stopVideos();
            window.setTimeout(function () {
                
                $(".lighbox-container .lightbox-detailsPage .MainContaintArea").scrollTop(0);
                if (!$(".mobDetector").is(":visible")) {
                    $(".scrollbar-external_wrapper").show();
                    $(".lighbox-container .lightbox-detailsPage #trip-popup .MainContaintArea").scrollbar({
                        "autoScrollSize": false,
                        "scrolly": $('.external-scroll_y'),
                        ignoreMobile: true,
                        duration: 10
                    });
                }

            }, 600);

        }
        else if (id == "journey") {
            $(".lightbox-detailsPage").removeClass("island-active");
            $("#journey-popup").addClass("popup-active");
            $("#journey-popup .island-content-container").show();
            hideIslandDetails();
            stopVideos();
            window.setTimeout(function () {
                
                $(".lighbox-container .lightbox-detailsPage .MainContaintArea").scrollTop(0);
                if (!$(".mobDetector").is(":visible")) {
                    $(".scrollbar-external_wrapper").show();
                    $(".lighbox-container .lightbox-detailsPage #journey-popup .MainContaintArea").scrollbar({
                        "autoScrollSize": false,
                        "scrolly": $('.external-scroll_y'),
                        ignoreMobile: true,
                        duration: 10
                    });
                }
            }, 600);


        }
        else if (id == "island") {
            if (!$("#dd-menu").hasClass("popup-active"))
            {
                $("#dd-menu").addClass("popup-active");
            }
            else {
                $("#dd-menu").removeClass("popup-active");
            }
            
            if($(".mobDetector").is(":visible"))
            {
                stopVideos();
                showIslandDetails($(".island:first"));
            }
        }

    });


    $(".island").click(function () {
        var island = $(this);
        console.log('island', island[0]);
        moveMap(island[0]);
        showIslandDetails(island);
    });

    $("#dd-menu ul li").click(function () {
        $(".popup").removeClass("popup-active");
        $(".island-content-container").removeClass("island-content-active");

        var islandId = $(this).html();
        if (islandId == "island of hawaii")
        {
            islandId = "hawaii";
        }
        var island = $("#" + islandId);
        console.log('dd', island[0]);

        $(".island").removeClass('highlighted');
        $(".gradient").show();
        island.addClass('highlighted');
        $(".big-palms").addClass("hover-island");


        moveMap(island[0]);
        showIslandDetails(island);
    });

    $(".back-to-home-wrapper").click(hideIslandDetails);

    $(".lighbox-container .lightbox-detailsPage .island-content-container .MainContaintArea").scroll(function () {
        if ($(this).scrollTop() > 200) {
            $(".lighbox-container .lightbox-detailsPage .island-content-container .back-to-home").addClass("scroll-reach");
        }
        else {
            $(".lighbox-container .lightbox-detailsPage .island-content-container .back-to-home").removeClass("scroll-reach");
        }
    });
    var preLoadImages = [];
    $("#dd-menu ul img").each(function (index, item) {
        if ($(this).attr("src"))
            preLoadImages.push($(this).attr("src"));
    });
    $("#dd-menu ul li").each(function (index, item) {
        if ($(this).attr("data-hero-image"))
            preLoadImages.push($(this).attr("data-hero-image"));
    });
    if (preLoadImages.length > 0)
        preload(preLoadImages);
});

var islandSelected = false;


function showIslandDetails(island) {
    stopVideos();
    $(".mobCurrentTab .mobNavigationTabs .carousel-circle").removeClass("active");
    var bullet = $(".mobCurrentTab .mobNavigationTabs .carousel-circle").get($(island).index());
    $(bullet).addClass("active");
    $(".island-content-container").show();
    $(".topMobMenuBar .mobNavigatorContent").show();
    $(".big-palms").addClass("island-active");
    //$('.camera-shutter--animation4, .camera-shutter__lens, .camera-shutter__triangle, .capture-image').addClass('camera-shutter--no-animation');
    $('.camera-shutter--animation4').removeClass('camera-shutter--open camera-shutter--f22');

    $(".background-icons").addClass("island-active");
    window.setTimeout(function () {
        $('.camera-shutter--animation4, .camera-shutter__lens, .camera-shutter__triangle, .capture-image').removeClass('camera-shutter--no-animation');
        $('.camera-shutter--animation4').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                 function (event) {

                     $(".hero-image").addClass("small-collapsed");
                     $('.camera-shutter--animation4 .camera-shutter__triangle').removeClass("camera-shutter__triangle_no_outline");
                 });
    }, 10)


    $(".island-details").show();
    $(".island-content-container").removeClass("island-content-active");
    if ($(".lightbox-detailsPage").hasClass("island-active")) {
		if ($(isMobile())) {
        			window.setTimeout(function () { animateShutter(island); }, 300);
			      }
		else    {
			window.setTimeout(function () { animateShutter(island); }, 1000);
			}
    }
    else {
        $(".hero-image").addClass("small-collapsed");
        animateShutter(island);
    }


    islandSelected = true;

}
function hideIslandDetails(e) {
    $(".island-content:first").closest(".island-content-container").hide();
    $(".topMobMenuBar .mobNavigatorContent").hide();
    islandSelected = false;
    $(".big-palms").removeClass("island-active");
    $('.camera-shutter--animation4').removeClass('camera-shutter--open camera-shutter--f22');
    $(".background-icons").removeClass("island-active");
    $(".hero-image").removeClass("small-collapsed");

    $(".camera-shutter").removeClass("left-camera-shutter");
    $(".lightbox-detailsPage").removeClass("island-active");
    $(".island-content").removeClass("active");
    $(".island-content-active").removeClass("island-content-active");
    $(".map").css({ "top": "0px", "left": "0px" });
    $('.camera-shutter--animation4').off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
    $('.camera-shutter--animation4').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                  function (event) {
                      $(".island-details").hide();
                      $(".gradient").hide();
                  });

    $(".scrollbar-external_wrapper").hide();
}

function moveMap(target) {

    //$(".map").addClass("island-active");

    console.log('moveMap', target);

    var top = target.offsetTop;
    var left = target.offsetLeft;

    var topTarget = 160;
    var leftTarget = 720;

    var topAdjust = topTarget - top;
    var leftAdjust = leftTarget - left;

    $(".map").css("top", topAdjust + 'px');
    $(".map").css("left", leftAdjust + 'px');


}

function animateShutter(island) {



    $(".hero-image").css("background-image", "url('" + $(island).attr("data-hero-image") + "')");

    $(".hero-image-caption span").html($(island).attr("data-caption"));

    $(".lighbox-container .lightbox-detailsPage .island-content-container .MainContaintArea").scrollTop(0);
    $(".scrollbar-external_wrapper").show();
    window.setTimeout(function () {
        $(".island-content-container").addClass("island-content-active");
        $(".island-content-container .island-content").removeClass("active");
        $(".island-content-container #" + island.attr("data-content") + "-content").addClass("active");

        $('.camera-shutter--animation4').addClass('camera-shutter--open camera-shutter--f22');
        $('.camera-shutter--animation4 .camera-shutter__triangle').addClass("camera-shutter__triangle_no_outline");
        $('.camera-shutter--animation4').off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
        $('.camera-shutter--animation4').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                  function (event) {
                      $(".camera-shutter").addClass("left-camera-shutter");
                      $(".lightbox-detailsPage").addClass("island-active");
                      if ($('.camera-shutter--animation4').hasClass("camera-shutter--open")) {
                          $(".hero-image").removeClass("small-collapsed");
                      }
                      else {
                          $(".hero-image").addClass("small-collapsed");
                      }
                      if (!$(".mobDetector").is(":visible")) {
                          $(".lighbox-container .lightbox-detailsPage .island-content-container .MainContaintArea").scrollbar({
                              "autoScrollSize": false,
                              "scrolly": $('.external-scroll_y'),
                              ignoreMobile: true,
                              duration: 10
                          });
                      }
                      //$('.camera-shutter--animation4 .camera-shutter__triangle').removeClass("camera-shutter__triangle_no_outline");
                  });
    }, 200);
}
function detailPageLoaded() {
    var iframes = $(".lighbox-container .lightbox-detailsPage #video-popup .video-container .video iframe:visible");
    if (iframes.length > 0) {
        var player = iframes.data("videoPlayer");
        if (!player) {
            player = new YT.Player(iframes.attr("id"), {
                events: {
                    'onReady': startVideo,
                    'onStateChange': onPlayerStateChange
                }
            });
            iframes.data("videoPlayer", player);
        }
        else {
            startVideo({ target: player });
        }


    }
}
function startVideo(event) {
    var iframe = $(event.target.getIframe());
    if (iframe.is(":visible"))
        event.target.playVideo();
    event.target.setLoop(true);
}
function stopVideos() {

    privousVideos = $(".lighbox-container .lightbox-detailsPage #video-popup .video-container .video iframe");
    //if (privousVideos.length > 0) {
    //    for (var i = 0; i < privousVideos.length; i++) {
    //        previousFrame = $(privousVideos[i]);
    var oldPlayer = privousVideos.data("videoPlayer");
    if (oldPlayer) {
        oldPlayer.stopVideo();
    }
    //    }
    //}
}
function onPlayerStateChange(event) {
    if (event.data === 0) {
        detailPageLoaded();
    }

}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}