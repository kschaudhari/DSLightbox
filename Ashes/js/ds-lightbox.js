function isMobile() {
    return $(".mobDetector").is(":visible");
}
$(document).ready(function () {
    
    
    $(".removePopup").click(function () {
        hideLightboxPopup();
        
    });
    $(".BackToMain").click(function () {
        showDefaultView();
    });
   
    $(".lighbox-container .lightbox-content .lightbox-tab-menu-item").click(function (e) {
        e.stopPropagation();
        handleMobNavigation($(this).attr("data-tab").replace("tab", ''), true);
    });


    $(".lighbox-container .lightbox-defaultTab .default-navigator .prevTab").click(function (e) {
        moveToPrevious();
    });
    $(".lighbox-container .lightbox-defaultTab .default-navigator .nextTab").click(function (e) {
        moveToNext();
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

    $(".lighbox-container .lightbox-detailsPage .tab").click(function (e) {
        var newTabId = $(this).attr("data-tab").replace("tab", '');
        handleMobNavigation(newTabId, false);
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

    if (!inIframe()) {
        showLightboxPopup();
    }
    $(".big-tab").hover(function () {
        var id = $(this).attr('id');
        $(".big-tab").addClass("another-tab-hover");
        $(this).removeClass("another-tab-hover");
        //alert(id);
        $("#" + id + " .tab-gradient").removeClass("tab-gradient-browse");
        $("#" + id + " .tab-gradient").addClass("tab-gradient-hover");

        $("#" + id + " .tab-bkg").removeClass(id + "-bkg-unzoom");
        $("#" + id + " .tab-bkg").addClass(id + "-bkg-zoom");

        $("#" + id + " .tab-logo-container").removeClass("tab-logo-container-browse");
        $("#" + id + " .tab-logo-container").addClass("tab-logo-container-hover");

        $("#" + id + " .arrow").removeClass("arrow-middle");
        $("#" + id + " .arrow").addClass("arrow-bottom");
        $("#" + id + " .tab-learn-more").addClass("show");


    }, function () {
        var id = $(this).attr('id');
        $(".big-tab").removeClass("another-tab-hover");
        $("#" + id + " .tab-gradient").removeClass("tab-gradient-hover");
        $("#" + id + " .tab-gradient").addClass("tab-gradient-browse");

        $("#" + id + " .tab-bkg").removeClass(id + "-bkg-zoom");
        $("#" + id + " .tab-bkg").addClass(id + "-bkg-unzoom");

        $("#" + id + " .tab-logo-container").removeClass("tab-logo-container-hover");
        $("#" + id + " .tab-logo-container").addClass("tab-logo-container-browse");

        $("#" + id + " .arrow").removeClass("arrow-bottom");
        $("#" + id + " .arrow").addClass("arrow-middle");
        $("#" + id + " .tab-learn-more").removeClass("show");


    });

    if($(".mobDetector").is("visible"))
    {
        $(".big-tab").off("hover");
    }
    setSVGImages();
    
});

var bgss = null;
function detailPageLoaded()
{
    window.setTimeout(function () {
        setScrollBar();
        sendAnalyticsEvent();
        setPlayer();
    }, 100);
    
    $(".lighbox-container .lightbox-detailsPage .tab.active .video-navigator .navigation").off("click");
    $(".lighbox-container .lightbox-detailsPage .tab.active .video-navigator .navigation").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(".lighbox-container .lightbox-detailsPage .tab.active .video-navigator .navigation").toggleClass("active");
        $(".lighbox-container .lightbox-detailsPage .tab.active .video-iframe").toggleClass("active");
        stopVideos();
        setPlayer();
    });

    if (!bgss) {
        bgss = new bgsrcset();

        bgss.callonce = false;

        bgss.init('.bgimg', function (a) {
            a.node.className += ' loaded';
        });
    }
}
function setPlayer()
{
    var iframes = $(".lighbox-container .lightbox-detailsPage .tab.active .ContentVideo .embed-container iframe:visible");
    if (iframes.length > 0) {
        var player = iframes.data("videoPlayer");
        if (!player) {
            player = new YT.Player(iframes.attr("id"), {
                events: {
                    'onReady': startVideo
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
    if (iframe.is(":visible")) {
        event.target.playVideo();
        event.target.mute();
    }
}
function stopVideos(privousVideos) {
    if (!privousVideos)
        privousVideos = $(".lighbox-container .lightbox-detailsPage .tab .ContentVideo .embed-container iframe");
    if (privousVideos.length > 0) {
        for (var i = 0; i < privousVideos.length; i++) {
            previousFrame = $(privousVideos[i]);
            var oldPlayer = previousFrame.data("videoPlayer");
            if (oldPlayer) {
                oldPlayer.stopVideo();                
            }
        }
    }
}

function setScrollBar(checkIfScrollApplied)
{
    if (!checkIfScrollApplied || !$(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea:first").hasClass("scroll-wrapper")) {
        window.setTimeout(function () {
            $(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea").scrollbar({
                "autoScrollSize": false,
                "scrolly": $(".lighbox-container .lightbox-detailsPage .tab.active").find('.external-scroll_y'),
                ignoreMobile: true,
                duration: 10
            });
        }, 400)
       
    }
        
    
    
}

function showTab(tabId, allowReLoad, slideDir) {
    if (!allowReLoad && $(".lighbox-container .lightbox-detailsPage .lightbox-tab" + tabId).hasClass("active")) {
        return;
    }
    var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");

    
    
    var previousTab = $(".lighbox-container .lightbox-detailsPage .tab.active");
    
    $(".lighbox-container .lightbox-detailsPage .tab").removeClass("active");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item").removeClass("active");
    stopVideos();
    var activeTab = $(".lighbox-container .lightbox-detailsPage .tab[data-tab='tab" + tabId + "']");
    activeTab.addClass("active");
    $(".lighbox-container .lightbox-detailsPage").addClass("expanded");
    $(".lighbox-container .lightbox-detailsPage .lightbox-top-menu-item[data-tab='tab" + tabId + "']").addClass("active");
    $(".lighbox-container .lightbox-detailsPage .tab.active .MainContaintArea").scrollTop(0);
    
    
        detailPageLoaded();
    
}

function sendAnalyticsEvent() {
    var detailsVisible = $(".lighbox-container .lightbox-detailsPage").is(":visible");

    if (detailsVisible) {
        var tabId = $(".lighbox-container .lightbox-detailsPage .tab.active").attr("data-tab").replace("tab", "");
        
        var tabName = "WESTERN AUSTRALIA";
        switch (parseInt(tabId)) {
            case 1:
                tabName = "WESTERN AUSTRALIA";
                break;
            case 2:
                tabName = "FOOD & WINE";
                break;
            case 3:
                tabName = "COASTAL & AQUATIC";
                break;
            case 4:
                tabName = "ADVENTURE & NATURE";
                break;
            case 5:
                tabName = "FLY THERE IN STYLE";
                break;
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'Tab',
            eventAction: 'TabView',
            eventLabel: 'tab ' + tabId + ' - ' + tabName,
            transport: 'beacon'
        });

        //additional pixel if you want to send
        //var isPixelSent = $(".lighbox-container .lightbox-detailsPage .tab.active").attr("data-is-pixel-sent") == "true";
        //if(!isPixelSent)
        //{
        //    (function (d, p) { var a = new Image(); a.onload = function () { a = null }; a.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//rs.gwallet.com/r1/pixel/x" + p + "r" + Math.round(1E9 * Math.random()) })(document, "40229");
        //    $(".lighbox-container .lightbox-detailsPage .tab.active").attr("data-is-pixel-sent", "true");
        //}

    }
}


function moveToPrevious(slideDir) {
    var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
    var newTabId = activeTabId - 1;
    if (newTabId == 0)
        newTabId = totalTabs;
    handleMobNavigation(newTabId, false, slideDir);
}
function moveToNext(slideDir) {
    var activeTabId = parseInt($(".topMobMenuBar .mobNavigatorContent .mobCurrentTab .mobTab.active").attr("data-tab").replace("tab", ''));
    var newTabId = activeTabId + 1;
    if (newTabId == totalTabs + 1)
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
function setSVGImages() {
    $('.svg-image').each(function (__, item) {

        var $item = $(item);
        var src = item.currentSrc;
        if (!src || src == '') {
            if (item.srcset && (item.naturalWidth == 208 || item.naturalWidth == 596 || isHighDensity()))
                src = item.src.replace(".svg", "@2x.svg");
            else if (item.srcset && (item.naturalWidth == 312 || item.naturalWidth == 894 || isRetina()))
                src = item.src.replace(".svg", "@3x.svg");
            else
                src = item.src
        }

        if (src && src != '') {
            var obj = '<object class="' + $item.attr("class") + '" data="' + src + '" type="image/svg+xml" ></object>';
            $(obj).insertBefore($item);
            $item.remove();
        }

    });
    if ($('img.svg-image').length > 0) {
        window.setTimeout(setSVGImages, 100);
    }
}

function isHighDensity() {
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
}


function isRetina() {
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

/* BG Srcset 1.0 */
(function () {
    'use strict';

    var bgsrcset = function () {

        this.called = false;
        this.callonce = true;
        this.compat();
    };

    bgsrcset.prototype.init = function (target, callback) {
        //retina bool
        this.retina = window.devicePixelRatio > 1;

        //storage for our elements
        this.elements = [];

        //global onload callback for imagery
        this.callback = typeof callback === 'function' ? callback : function () { };

        //window width, for responsive handling
        this.curwidth = this.getWidth();

        //get our input and turn it into an element list of some sort
        var elems = this.gather(target);

        //parse the element input
        for (var i = 0, l = elems.length; i < l; i++) { this.parse(elems[i]); }

        this.set();
        this.resize();
    };

    /* -----------* /
       Fix compatibility issues*
       *only down to IE8
    / *----------- */

    bgsrcset.prototype.compat = function () {
        var d = document;
        /* check for getElementsByClassName */
        if (typeof d.getElementsByClassName !== 'function') {
            d.getElementsByClassName = function (str) {
                return d.querySelectorAll('.' + str);
            };
        }

        /* check for .trim() */
        if (!String.prototype.trim) {
            String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
        }

        /*------------------------* /
          Check for Event Listener
        / *------*/
        if (!d.addEventListener) {
            this.addEvent = function (elem, evName, fn) {
                elem.attachEvent('on' + evName, function (e) {
                    fn(e || window.event);
                });
            };
        }

    };

    /* -----------* /
       Gather elements
    / *----------- */
    bgsrcset.prototype.gather = function (target) {
        var autotypes = ['HTMLCollection', 'NodeList'];
        var e = target;
        var type = (e.nodeType) ? 'Object' : Object.prototype.toString.call(e).replace(/^\[object |\]$/g, '');

        var func = 'parse' + type;

        if (autotypes.indexOf(type) > -1) {
            return e;
        }

        if (this[func]) {
            return this[func](e);
        }

        return [];
    };

    bgsrcset.prototype.parseObject = function (target) {
        return (target.nodeType) ? [target] : [];
    };

    bgsrcset.prototype.parseArray = function (target) {
        return target;
    };

    bgsrcset.prototype.parseString = function (target) {

        var d = document;
        var e = target.trim();
        var sel = e[0];
        var elems = [];

        switch (true) {
            /* class */
            case sel === '.':
                elems = d.getElementsByClassName(e.substring(1));
                break;
                /* id */
            case sel === '#':
                elems.push(d.getElementById(e.substring(1)));
                break;
                /* tag */
            case /^[a-zA-Z]+$/.test(e):
                elems = d.getElementsByTagName(e);
                break;
                /* unknown */
            default:
                elems = [];
        }

        return elems;
    };

    /* -----------* /
       Parse datasrc
    / *----------- */
    bgsrcset.prototype.parse = function (obj) {
        //our data to parase
        var bgss = obj.getAttribute('bg-srcset');
        /* exit if no attribute */
        if (attr === null) { return false; }

        /* create new element object */
        this.elements.push({});

        /* split up sets */
        var set = bgss.split(',');
        var attr = '';
        var curelem = this.elements[this.elements.length - 1];


        curelem.node = obj;
        curelem.srcset = [];

        /* loop through sets to define breakpoints */
        for (var i = 0, l = set.length; i < l; i++) {
            curelem.srcset.push({});
            attr = set[i].trim();
            var attrs = attr.split(' ');
            var a;
            var e;
            var t;
            /* since we can't know the order of the values, starting another loop */
            for (var attrc = 0, attrl = attrs.length; attrc < attrl; attrc++) {
                a = attrs[attrc];
                e = curelem.srcset[i]; //current attribute
                t = a.length - 1;
                switch (true) {
                    case a.trim() === "":
                        //in case of extra white spaces
                        continue;
                    case a[t] !== 'w' && a[a.length - 1] !== 'x':
                        e.src = a;
                        break;
                    case a[t] === 'w':
                        e.width = parseInt(a.slice(0, -1));
                        break;
                    case a[t] === 'x':
                        e.retina = (parseInt(a.slice(0, -1)) > 1);
                        break;
                }
                if (!e.width) { e.width = Number.POSITIVE_INFINITY; } //set to the top
                if (!e.retina) { e.retina = false; }
            }
        }
    };

    /* -----------* /
       Set image
    / *----------- */
    bgsrcset.prototype.set = function () {
        for (var i = 0, l = this.elements.length; i < l; i++) {
            this.setSingle(i);
        }
    };

    bgsrcset.prototype.setSingle = function (id) {
        var width = 0,
          elem = this.elements[id],
          comparray = [],
          best = 0,
          _this = this;

        width = this.getWidth(); //elem.node.offsetWidth;

        elem.srcset = elem.srcset.sort(dynamicSort("width"));

        for (var i = 0, l = elem.srcset.length; i < l; i++) {
            if (elem.srcset[i].width < width) {
                continue;
            }
            comparray.push(elem.srcset[i]);
        }
        if (comparray.length === 0) {
            comparray.push(elem.srcset[elem.srcset.length - 1]);
        }

        best = comparray[0];

        if (comparray.length > 1 && comparray[0].width === comparray[1].width) {
            best = (comparray[0].retina !== this.retina) ? comparray[1] : comparray[0];
        }

        if (best.src !== undefined && best.src !== 'null') {
            var img = new Image();
            var done = false;

            img.onload = img.onreadystatechange = function () {
                if (!done && (!this.readyState ||
                    this.readyState === "loaded" || this.readyState === "complete")) {
                    done = true;

                    elem.node.style.backgroundImage = "url('" + best.src + "')";

                    /* only fire the callback on initial load, not resize events */
                    if (!_this.called) {

                        _this.callback(elem);
                        _this.called = _this.callonce;

                    }

                }

            };

            img.src = best.src;
        } else {
            elem.node.style.backgroundImage = "";
        }




    };

    /* -----------* /
       Handle Resize
    / *----------- */
    bgsrcset.prototype.resize = function () {
        var _this = this,
          resizeTimer = setTimeout(function () { }, 0);

        this.addEvent(window, 'resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                var w = _this.getWidth();
                if (w !== _this.curwidth) {
                    _this.curwidth = w;
                    _this.set();
                }
            }, 250);
        });
    };

    bgsrcset.prototype.addEvent = function (elem, evName, fn) {
        elem.addEventListener(evName, fn, false);
    };

    bgsrcset.prototype.getWidth = function () {
        var w, d, e, g;
        w = window;
        d = document;
        e = d.documentElement;
        g = d.getElementsByTagName('body')[0];

        return w.innerWidth || e.clientWidth || g.clientWidth;
    };

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    }

    window.bgsrcset = bgsrcset;
})();
// following function to change inline css style attribute to replace particular value or to remove it completely 
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

// plugin to handle swipe in mobile
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





