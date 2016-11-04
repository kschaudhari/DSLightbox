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
				.wrap("<div class='img-pan-container' />")
				.after("<div class='resize' style='position:absolute; width:auto; height:auto; top:0; right:0; bottom:0; left:0; margin:0; padding:0; overflow:hidden; visibility:hidden; z-index:-1'><iframe style='width:100%; height:0; border:0; visibility:visible; margin:0' /><iframe style='width:0; height:100%; border:0; visibility:visible; margin:0' /></div>")
				//image loaded fn
				.one("load",function(){
					setTimeout(function(){ $this.addClass("loaded").trigger("mousemove",1); },1);
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
			timer=setInterval(function(){
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
	$(".panview img").imagePanning();

    $('.scrollbar-external').scrollbar({
        "autoScrollSize": false,
        "scrolly": $('.external-scroll_y'),
        "disableBodyScroll": true,
        "ignoreMobile": true
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

  
});$(window).load(function () {
    lazyLoadImages();
});
})(jQuery);
function isMobile() {
    return $(".mobDetector").is(":visible");
}

function isTablet() {
    return $(".tabletDetector").is(":visible");
}

function lazyLoadImages() {

    $('[data-background-image]').each(function (__, item) {
        var $item = $(item);
        var imageUrl = $(item).attr("data-background-image");
        if (isMobile()) {
            imageUrl = $(item).attr("data-background-image-mobile");
        }
        else if (isTablet()) {
            imageUrl = $(item).attr("data-background-image-tablet");
        }
        $item.css("background-image", 'url(' + imageUrl + ')');
    });

    $('[data-image]').each(function (__, item) {
        var $item = $(item);
        var imageUrl = $(item).attr("data-background-image");
        if (isMobile()) {
            imageUrl = $(item).attr("data-background-image-mobile");
        }
        else if (isTablet()) {
            imageUrl = $(item).attr("data-background-image-tablet");
        }

        if ($item.find('.contentImage').length == 0) {
            $img = $('<img class="contentImage" src="' + imageUrl + '"/>');
            $item.append($img);
        }

    });
}