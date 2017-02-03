function setVideoPlayer() {
    var videoContainer = $(".video-player");
    var playerStatus = $(".video-player").data('player-status');
    if (playerStatus == 'ready')
        return;
    var playList = $(".play-list-item");
    var playListContainer = $('.play-list-carousel-container');
    //setPlaylistSlider(playListContainer);

    if (videoContainer.length == 0 || playList.length == 0 || playListContainer.length == 0)
        return;
    playList.click(function (e) {
        setActiveVideo(this, videoContainer, playList);
    });
    var activeVideo = playListContainer.find(".active");
    if (activeVideo.length == 0) {
        activeVideo = playList.first();
    }
    setWidthOfCarousel();
    setActiveVideo(activeVideo, videoContainer, playList, playListContainer);
    $(".carousel-navigation .up").click(function (e) {
        var $item = playList.first();
        if (renderCarouselForMobile()) {
            var horizontalPlayListContainer = playListContainer.parent();
            var scrollLeft = Math.abs(horizontalPlayListContainer.scrollLeft());

            var itemWidth = $item.outerWidth() + 4;
            scrollLeft = scrollLeft - itemWidth;
            if (scrollLeft < 0) {
                scrollLeft = playListContainer.outerWidth();
            }
            horizontalPlayListContainer.animate({ scrollLeft: scrollLeft }, 500, function () { })
            return;
        }
        var itemHeight = $item.outerHeight() + 10;
        var currentScrollTop = playListContainer.scrollTop();
        if (currentScrollTop == 0)
            currentScrollTop = playListContainer[0].scrollHeight;
        else
            currentScrollTop = currentScrollTop - itemHeight;

        playListContainer.animate({ scrollTop: currentScrollTop }, 500, function () { })
    });
    $(".carousel-navigation .down").click(function (e) {
        var $item = playList.first();
        if (renderCarouselForMobile()) {
            var horizontalPlayListContainer = playListContainer.parent();
            var scrollLeft = Math.abs(horizontalPlayListContainer.scrollLeft());
            var itemWidth = $item.outerWidth() + 4;
            scrollLeft = scrollLeft + itemWidth;
            if (scrollLeft > playListContainer.outerWidth()) {
                scrollLeft = 0;
            }
            horizontalPlayListContainer.animate({ scrollLeft: scrollLeft }, 500, function () { })
            return;
        }
        var itemHeight = $item.outerHeight() + 10;
        var currentScrollTop = playListContainer.scrollTop();
        if (currentScrollTop >= playListContainer[0].scrollHeight - playListContainer.outerHeight())
            currentScrollTop = 0;
        else
            currentScrollTop = currentScrollTop + itemHeight;

        playListContainer.animate({ scrollTop: currentScrollTop }, 500, 'swing', function () { });
    });

    $(window).resize(function () {
        setWidthOfCarousel();
    });



    function setWidthOfCarousel() {
        if (renderCarouselForMobile()) {
            var itemWidth = $(".play-list-carousel-container .play-list-item:first").outerWidth() + 4;
            var itemCount = $(".play-list-carousel-container .play-list-item").length;
            var width = itemWidth * itemCount - 4;
            $(".play-list-carousel-container").css("width", width + "px");
            var parent = $(".play-list-carousel-container").parent();
            parent.css("width", "");
            var parentWidth = parent.outerWidth();
            var visibleItems = Math.floor(parentWidth / itemWidth);
            if (visibleItems > 2)
                visibleItems = 2;
            parent.css("width", ((visibleItems * itemWidth) - 4) + "px");
        }
        else {
            $(".play-list-carousel-container").css("width", "");
            $(".play-list-carousel-container").parent().css("width", "");
        }
    }

    function getCSSTop(element) {
        return parseInt($(element).css('top').replace("px", ""));
    }

    function setActiveVideo(playListItem, videoContainer, playList, playListContainer) {
        var $playListItem = $(playListItem);
        videoContainer.find('iframe').remove();
        var playingVideoId = "playing-video-iframe";
        videoContainer.append('<iframe id="' + playingVideoId + '" src="' + $playListItem.attr('data-video-url') + '?enablejsapi=1&autoplay=1" allowfullscreen frameborder="0" volume="0" ></iframe>')

        setYoutubeVideoPlayer(videoContainer, playingVideoId);






        playList.removeClass("active");
        $playListItem.addClass("active");
        showActiveSlideMiddle(playListItem, videoContainer, playList, playListContainer);
    }
    function setYoutubeVideoPlayer(videoContainer, playingVideoId) {
        if (typeof YT !== 'undefined' && YT.loaded == 1) {
            var player;

            player = new YT.Player(playingVideoId, {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            videoContainer.find("#" + playingVideoId).data('videoPlayer', player);

            videoContainer.find("#" + playingVideoId).mouseenter(function () {
                var player = $(this).data("videoPlayer");
                if (player) {
                    player.unMute();
                }
            });
        }
        else {
            window.setTimeout(function () {
                setYoutubeVideoPlayer(videoContainer, playingVideoId);
            }, 100);
        }
    }
    function showActiveSlideMiddle(activeVideo, videoContainer, playList, playListContainer) {
        var currentItemIndex = $(activeVideo).index();
        if (currentItemIndex > playList.length - 3)
            currentItemIndex = playList.length - 3;
        var activeVideo = playList.get(currentItemIndex);
        if (renderCarouselForMobile()) {
            var horizontalPlayListContainer = playListContainer.parent();
            var scrollLeft = $(activeVideo).position().left;
            horizontalPlayListContainer.animate({ scrollLeft: scrollLeft + $(activeVideo).width() + 4 }, 500, function () { })
            return;
        }

        var scrollTop = currentItemIndex * ($(activeVideo).outerHeight() + 10); //65 is height ofelement 5 is margin adjustment
        //if (playListContainer.scrollTop() != 0)
        //{
        //    scrollTop = $(activeVideo).offset().top;
        //}
        playListContainer.animate({ scrollTop: scrollTop }, 500, 'swing', function () { });
    }

    function renderCarouselForMobile() {
        return $(".showMobileCarousel").is(":visible");
    }

    function onPlayerReady(event) {
        event.target.mute();

    }

    function onPlayerStateChange(event) {
        if (event.data === 0) {
            var activeVideo = playListContainer.find(".active");
            if (activeVideo.index() + 1 == playList.length) {
                activeVideo = playList.first();
            }
            else
                activeVideo = activeVideo.next();
            setActiveVideo(activeVideo, videoContainer, playList, playListContainer);
        }

    }

    $(".video-player").data('player-status', 'ready');
}