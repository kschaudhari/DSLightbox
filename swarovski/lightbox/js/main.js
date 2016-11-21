(function($){
	
	$.fn.imagePanning=function(){
		var init="center",
			speed=800, //animation/tween speed
			//custom js tween
			_tweenTo=function(el,prop,to,duration,easing,overwrite){
				if(!el._mTween){el._mTween={top:{},left:{}};}
				var startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
				if(prop==="left"){from=el.offsetLeft;}
				var diff=to-from;
				if(overwrite!=="none"){_cancelTween();}
				_startTween();
				function _step(){
					progress=_getTime()-startTime;
					_tween();
					if(progress>=tobj.time){
						tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
						if(tobj.time<progress+1){tobj.time=progress+1;}
					}
					if(tobj.time<duration){tobj.id=_request(_step);}
				}
				function _tween(){
					if(duration>0){
						tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
						elStyle[prop]=Math.round(tobj.currVal)+"px";
					}else{
						elStyle[prop]=to+"px";
					}
				}
				function _startTween(){
					_delay=1000/60;
					tobj.time=progress+_delay;
					_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
					tobj.id=_request(_step);
				}
				function _cancelTween(){
					if(tobj.id==null){return;}
					if(!window.requestAnimationFrame){clearTimeout(tobj.id);
					}else{window.cancelAnimationFrame(tobj.id);}
					tobj.id=null;
				}
				function _ease(t,b,c,d,type){
					var ts=(t/=d)*t,tc=ts*t;
					return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
				}
				function _getTime(){
					if(window.performance && window.performance.now){
						return window.performance.now();
					}else{
						if(window.performance && window.performance.webkitNow){
							return window.performance.webkitNow();
						}else{
							if(Date.now){return Date.now();}else{return new Date().getTime();}
						}
					}
				}
			};
		return this.each(function(){
			var $this=$(this),timer,dest;
			if($this.data("imagePanning")) return;
			$this.data("imagePanning",1)
				//create markup
				.wrap("<div id='img-pan-container' class='' />")
				.after("<div class='resize' style='position:absolute; width:auto; height:auto; top:0; right:0; bottom:0; left:0; margin:0; padding:0; overflow:hidden; visibility:hidden; z-index:-1'><iframe style='width:100%; height:0; border:0; visibility:visible; margin:0' /><iframe style='width:0; height:100%; border:0; visibility:visible; margin:0' /></div>")
				//image loaded fn
				.one("load",function(){
				    setTimeout(function () {
				        $this.addClass("loaded").trigger("mousemove", 1);

				        window.setTimeout(function () {
				            $("#BanerTopArrow").addClass("BanerTopArrow");
				            $("#BanerBottomArrow").addClass("BanerBottomArrow");
				            $("#BannerCaption").addClass("BannerCaption");
				            $("#panViewOverlay").addClass("panViewOverlay");

				            $("#BanerBottomArrow").css("bottom", "-5px;");
				            $("#img-pan-container").addClass("img-pan-container");
				            window.setTimeout(function () {
				                $("#BanerBottomArrow").css("bottom", "-4px;");
				            }, 100);
				        }, 100);
				    }, 200);
				}).each(function(){ //run load fn even if cached
					if(this.complete) $(this).load();
				})
				//panning fn
				.parent().on("mousemove touchmove MSPointerMove pointermove",function(e,p){
					var cont=$(this);
					e.preventDefault();
					var contH=cont.height(),contW=cont.width(),
						isTouch=e.type.indexOf("touch")!==-1,isPointer=e.type.indexOf("pointer")!==-1,
						evt=isPointer ? e.originalEvent : isTouch ? e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] : e,
						coords=[
							!p ? evt.pageY-cont.offset().top : init==="center" ? contH/2 : 0,
							!p ? evt.pageX-cont.offset().left : init==="center" ? contW/2 : 0
						];
					dest=[Math.round(($this.outerHeight(true)-contH)*(coords[0]/contH)),Math.round(($this.outerWidth(true)-contW)*(coords[1]/contW))];
				})
				//resize fn
				.find(".resize iframe").each(function(){
					$(this.contentWindow || this).on("resize",function(){
						$this.trigger("mousemove",1);
					});
				});
			//panning animation 60FPS
			if(timer) clearInterval(timer);
			timer = setInterval(function () {
			    if (!dest || dest.length == 0)
			        return;
			    if (dest[0] < 0)
			        dest[0] = 0;
			    if (dest[1] < 0)
			        dest[1] = 0;

			    var parentWidth = $this.parent().width();
			    var parentHeight = $this.parent().height();
			    if (dest[0] > $this.outerHeight(true) - parentHeight)
			        dest[0] = $this.outerHeight(true) - parentHeight;

			    if (dest[1] > $this.outerWidth(true) - parentWidth)
			        dest[1] = $this.outerWidth(true) - parentWidth;

				_tweenTo($this[0],"top",-dest[0],speed);
				_tweenTo($this[0],"left",-dest[1],speed);
			},16.6);
		});
	}

   'use strict';

	$.fn.fitVids = function (options) {
		var settings = {
			customSelector: null,
			ignore: null
		};

		if (!document.getElementById('fit-vids-style')) {
			// appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
			var head = document.head || document.getElementsByTagName('head')[0];
			var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
			var div = document.createElement("div");
			div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
			head.appendChild(div.childNodes[1]);
		}

		if (options) {
			$.extend(settings, options);
		}

		return this.each(function () {
			var selectors = [
					 'iframe[src*="player.vimeo.com"]',
					 'iframe[src*="youtube.com"]',
					 'iframe[src*="youtube-nocookie.com"]',
					 'iframe[src*="kickstarter.com"][src*="video.html"]',
					 'object',
					 'embed'
					 ];

			if (settings.customSelector) {
				selectors.push(settings.customSelector);
			}

			var ignoreList = '.fitvidsignore';

			if (settings.ignore) {
				ignoreList = ignoreList + ', ' + settings.ignore;
			}

			var $allVideos = $(this).find(selectors.join(','));
			$allVideos = $allVideos.not('object object'); // SwfObj conflict patch
			$allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

			$allVideos.each(function () {

				var $this = $(this);
				//console.log($this);
				if ($this.parents(ignoreList).length > 0) {
					return; // Disable FitVids on this video.
				}
				if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
				if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width')))) {
					$this.attr('height', 9);
					$this.attr('width', 16);
				}
				var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
						 width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
						 aspectRatio = height / width;
				if (!$this.attr('id')) {
					var videoID = 'fitvid' + Math.floor(Math.random() * 999999);
					$this.attr('id', videoID);
				}
				$this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + '%');
				$this.removeAttr('height').removeAttr('width');
			});
		});
	};

$(document).ready(function(){
	

    $('.scrollbar-external').scrollbar({
        "autoScrollSize": false,
        "scrolly": $('.external-scroll_y'),
        "ignoreMobile": true,
        "duration":10
    }).scrollTop(0);

    $("#contents").fitVids();

    $("#nav").load("menu.html");

	// display image caption on top of image
    $(".copy img").each(function() {
          var imageCaption = $(this).attr("alt");
		  
		  if( !window.isCMS ) {
          if (imageCaption != '') {
              var imgWidth = $(this).width();
              var imgHeight = $(this).height();
              var position = $(this).position();
              var positionTop = (position.top + imgHeight - 26);
              $("<span class='img-caption'><em>"+imageCaption+"</em></span>")
             // .css({"position":"absolute", "top":positionTop+"px", "left":"0", "width":imgWidth +"px"})
              .insertAfter(this);
          }
		  }
    });

    
    mobMenuNavigation();
    loadPageDetails();

    
     
    
}); $(window).load(function () {

   
});
function loadPageDetails() {
    if ($('#nav ul').length > 0) {
        lazyLoadImages();
        
        mobMenuNavigation();
        nextButton();
        $(".mobileMenuCarosel .mobmainDiv .mobdiv[data-id='" + $('body').attr('data-id') + "']").addClass('active');
        $(".mobileMenuCarosel .Bullets .Dots[data-id='" + $('body').attr('data-id') + "']").addClass('active');
        $("#menuList li[data-id='" + $('body').attr('data-id') + "']").addClass('active');

        //window.parent.postMessage('Frame_Change', '*');
        var data = {
            message: "Frame_Change",
        }
        window.parent.postMessage(JSON.stringify(data), '*');

        $('#nav ul li a').click(function () {
            var iframeSrc = $(this).attr('href');
            changePage(iframeSrc);
            return false;
        });

        $("#wrapper").each(function (__, tabPage) {
            swipedetect(tabPage, function (swipedir) {
                if (swipedir == "left") {
                    moveNext();
                }
                else if (swipedir == "right") {
                    movePrevious();
                }
            })
        });
        return;
    }
    
    window.setTimeout(loadPageDetails, 100);
    
}


$('.scrollbar-external').scroll(function () {
    if ($(this).scrollTop() > 0) {
        $('#nav ul').addClass("move-left");
    }
    else {
        $('#nav ul').removeClass("move-left");
    }
});



})(jQuery);
function isMobile() {
    return $(".mobDetector").is(":visible");
}

function isTablet() {
    return $(".tabletDetector").is(":visible");
}

function lazyLoadImages() {

    $('[data-logo]').each(function (__, item) {
        var $item = $(item);
        var imageUrl = $(item).attr("data-logo");
        if (isMobile()) {
            imageUrl = $(item).attr("data-logo-mobile");
        }
        else if (isTablet()) {
            imageUrl = $(item).attr("data-logo-tablet");
        }
        else {
            var cap = chooseCap(3);
            if (cap == 2) {
                imageUrl = $(item).attr("data-logo-mobile");
            }
            else if (cap == 3) {
                imageUrl = $(item).attr("data-logo-tablet");
            }
        }
        if ($item.find('.logoImg').length == 0) {
            $(".logo").attr("src", imageUrl);

        }
    });
   
    $('[data-background-image]').each(function (__, item) {
        var $item = $(item);
        var imageUrl = $(item).attr("data-background-image");
        if (isMobile()) {
            imageUrl = $(item).attr("data-background-image-mobile");
        }
        else if (isTablet()) {
            imageUrl = $(item).attr("data-background-image-tablet");
        }
        else {
            var cap = chooseCap(3);
            if (cap == 2) {
                imageUrl = $(item).attr("data-background-image-mobile");
            }
            else if (cap == 3) {
                imageUrl = $(item).attr("data-background-image-tablet");
            }
        }
        $item.css("background-image", 'url(' + imageUrl + ')');
    });

    $('[data-image]').each(function (__, item) {
        var $item = $(item);
        var imageUrl = $(item).attr("data-image");
        if (isMobile()) {
            imageUrl = $(item).attr("data-image-mobile");
        }
        else if (isTablet()) {
            imageUrl = $(item).attr("data-image-tablet");
        }
        else {
            var cap = chooseCap(3);
            if (cap == 2) {
                imageUrl = $(item).attr("data-image-mobile");
            }
            else if (cap == 3) {
                imageUrl = $(item).attr("data-image-tablet");
            }
        }

        if ($item.find('.contentImage').length == 0) {
            $img = $('<img class="contentImage" src="' + imageUrl + '"/>');
            $item.append($img);
        }


    });

    $('[data-image-preview]').each(function (__, item) {
        var $item = $(item);
        var imageUrl = $(item).attr("data-image-preview");
        if (isMobile()) {
            imageUrl = $(item).attr("data-image-preview-mobile");
        }
        else if (isTablet()) {
            imageUrl = $(item).attr("data-image-preview-tablet");
        }
        else {
            var cap = chooseCap(3);
            if (cap == 2) {
                imageUrl = $(item).attr("data-image-preview-mobile");
            }
            else if (cap == 3) {
                imageUrl = $(item).attr("data-image-preview-tablet");
            }
        }
        $("#panimage").attr("src", imageUrl);
        $(".panview img").imagePanning();
    });

    $("#BanerTopArrow").removeClass("BanerTopArrow");
    $("#BanerBottomArrow").removeClass("BanerBottomArrow");
    $("#BannerCaption").removeClass("BannerCaption");
    $("#panViewOverlay").removeClass("panViewOverlay");


}
function nextButton() {
    $(".readNext").click(function () {
        moveNext();
    });
}
function moveNext()
{
    var nextPageId = parseInt($("body").attr("data-id")) + 1;
    if (nextPageId > $("#menuList li").length)
        nextPageId = 1;
    changePage($($("#menuList li").get(nextPageId - 1)).find('a').attr("href"));
}

function movePrevious() {
    var nextPageId = parseInt($("body").attr("data-id")) - 1;
    if (nextPageId > $("#menuList li").length)
        nextPageId = 1;
    changePage($($("#menuList li").get(nextPageId - 1)).find('a').attr("href"));
}

function changePage(url)
{
    var data = {
        message: "Frame_Change_Out",
        url: url
    }
    window.parent.postMessage(JSON.stringify(data), '*');
    //window.location.href = url;
}
function mobMenuNavigation() {
    
    $("#next").click(function () {
        
        moveNext();
        return false;
    });

    $("#prev").click(function () {
      
        movePrevious();
        return false;
    });

    $(".mobBurger").click(function () {
        $("#menuList").slideDown( 500, function(){ 
            $("#menuList").show();
        });
    });
    $(".ClickTocliseList").click(function () {
        $("#menuList").slideUp('fast', function () {
            $("#menuList").hide();
        });
    });
}


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

