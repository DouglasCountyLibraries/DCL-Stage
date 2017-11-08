/* ====================================================
 * support your local library
 * comments/questions? djarrett at dclibraries dot org
   ==================================================== */

// josh's script to pull in the alert
// smooth page scroll for page anchors
// jQuery match-height plugin
// flip
// scrollme
// sticky		

// pull the alert into the global-alert div
/* ------------------------------------------------------------ */

jQuery.get("https://s3.amazonaws.com/website.alert/alert.txt")
  .done(function( data ) {
    /*alert( "Data Loaded: " + data );*/
	if ( data !=null ){	jQuery("#global-alert").show().append( data );}
  });
  
// smooth page scroll for page anchors
/* ------------------------------------------------------------ */

	$(function() {
$('a[href*=#]:not([href=#]):not(.carousel-control):not(.tab)').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top - 50
	        }, 800);
	        return false;
	      }
	    }
	  });
	});

// --------------------------------------------------------------------------------------------------------
// jquery-match-height master by @liabru
// http://brm.io/jquery-match-height/
// License: MIT
// --------------------------------------------------------------------------------------------------------

  
/*! flip - v1.0.16 - 2015-08-09
* https://github.com/nnattawat/flip
* Copyright (c) 2015 Nattawat Nonsung; Licensed MIT */
(function( $ ) {
  var flip = function($dom, callback) {
    $dom.data("flipped", true);

    var rotateAxis = "rotate" + $dom.data("axis");
    $dom.find($dom.data("front")).css({
      transform: rotateAxis + ($dom.data("reverse") ? "(-180deg)" : "(180deg)"),
      "z-index": "0"
    });

    $dom.find($dom.data("back")).css({
      transform: rotateAxis + "(0deg)",
      "z-index": "1"
    });

    //Providing a nicely wrapped up callback because transform is essentially async
     $dom.one(whichTransitionEvent(), function(){
        $(this).trigger('flip:done');
        if (callback !== undefined){
          callback.call(this);
        }
      });
  };

  var unflip = function($dom, callback) {
    $dom.data("flipped", false);

    var rotateAxis = "rotate" + $dom.data("axis");
    $dom.find($dom.data("front")).css({
      transform: rotateAxis + "(0deg)",
      "z-index": "1"
    });

    $dom.find($dom.data("back")).css({
      transform: rotateAxis + ($dom.data("reverse") ? "(180deg)" : "(-180deg)"),
      "z-index": "0"
    });

    //Providing a nicely wrapped up callback because transform is essentially async
     $dom.one(whichTransitionEvent(), function(){
        $(this).trigger('flip:done');
        if (callback !== undefined){
          callback.call(this);
        }
      });
  };
  // Function from David Walsh: http://davidwalsh.name/css-animation-callback licensed with http://opensource.org/licenses/MIT
  var whichTransitionEvent = function(){
    var t,
        el = document.createElement("fakeelement"),
    transitions = {
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    };

    for (t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  };
  $.fn.flip = function(options, callback) {
    if (typeof options == 'function'){
      //This allows flip to be called for setup with only a callback (default settings)
      callback = options;
    }
    this.each(function(){
      var $dom = $(this);

        if (options !== undefined && (typeof(options) == "boolean" || typeof(options) == "string")) { // Force flip the DOM
          if (options == "toggle"){
            options = !$dom.data("flipped");
          }
          if (options) {
            flip($dom,callback);
          } else {
            unflip($dom,callback);
          }
          // //Providing a nicely wrapped up callback because transform is essentially async
          //  $(this).one(whichTransitionEvent(), function(){
          //     $(this).trigger('flip:done');
          //     if (callback !== undefined){
          //       callback.call(this);
          //     }
          //   });
        } else if (!$dom.data("initiated")){ //Init flipable DOM
          $dom.data("initiated", true);

          var settings = $.extend({
            axis: "y",
            reverse: false,
            trigger: "click",
            speed: 500,
            forceHeight: false,
            forceWidth: false,
            autoSize: true,
            front: 'auto',
            back: 'auto'
          }, options );

          //By defualt we first check for the old front and back selectors for backward compatibility
          //if they arent there we fall back to auto selecting the first and second div
          if (settings.front == "auto"){
            settings.front = ($dom.find('.front').length > 0)? '.front' : 'div:first-child';
          }else if (settings.front == "autostrict"){
            settings.front = 'div:first-child';
          }
          if (settings.back == "auto"){
            //Note, we must use the old 'div:first-child + div' for IE compatibility
            settings.back = ($dom.find('.back').length > 0)? '.back' : 'div:first-child + div';
          }else if (settings.back == "autostrict"){
            settings.back = 'div:first-child + div';
          }
          // save reverse and axis css to DOM for performing flip
          $dom.data("reverse", settings.reverse);
          $dom.data("axis", settings.axis);
          $dom.data("front", settings.front);
          $dom.data("back", settings.back);

          var rotateAxis = "rotate" + (settings.axis.toLowerCase() == "x" ? "x" : "y"), 
              perspective = $dom["outer" + (rotateAxis == "rotatex" ? "Height" : "Width")]() * 2;

          $dom.find($dom.data("back")).css({
            transform: rotateAxis + "(" + (settings.reverse? "180deg" : "-180deg") + ")"
          });

          $dom.css({
            perspective: perspective,
            position: "relative"
          });

          var speedInSec = settings.speed / 1000 || 0.5;
          var faces = $dom.find(settings.front).add(settings.back, $dom);
          if (settings.forceHeight) {faces.outerHeight($dom.height());} else if (settings.autoSize) {faces.css({'height': '100%'});}
          if (settings.forceWidth) {faces.outerWidth($dom.width());} else if (settings.autoSize) {faces.css({'width': '100%'});}
          faces.css({
            "backface-visibility": "hidden",
            "transform-style": "preserve-3d",
            position: "absolute",
            "z-index": "1"
          });
          faces.find('*').css({
            "backface-visibility": "hidden"
          });
          $dom.find($dom.data("back")).css({
            transform: rotateAxis + "(" + (settings.reverse? "180deg" : "-180deg") + ")",
            "z-index": "0"
          });
		  
		  // Back face always visible on Chrome #39
          if ((window.chrome || (window.Intl && Intl.v8BreakIterator)) && 'CSS' in window){
            //Blink Engine, add preserve-3d to $dom
			$dom.css({"-webkit-transform-style": "preserve-3d"});
          }
		  // /#39
		  
          // not forcing width/height may cause an initial flip to show up on
          // page load when we apply the style to reverse the backface...
          // To prevent this we first apply the basic styles and then give the
          // browser a moment to apply them. Only afterwards do we add the transition.
          setTimeout(function(){
            // By now the browser should have applied the styles, so the transition
            // will only affect subsequent flips.
            faces.css({
              transition: "all " + speedInSec + "s ease-out"
            });
            if (callback !== undefined){
              callback.call(this);
            }
          //While this used to work with a setTimeout of zero, at some point that became
          //unstable and the initial flip returned. The reason for this is unknown but we
          //will temporarily use a short delay of 20 to mitigate this issue. 
          }, 20);

          if (settings.trigger.toLowerCase() == "click") {
            $dom.on($.fn.tap ? "tap" : "click", function(event) {
              if (!event) {event = window.event;}
              if ($dom.find($(event.target).closest('button, a, input[type="submit"]')).length) {
                return;
              }

              if ($dom.data("flipped")) {
                unflip($dom);
              } else {
                flip($dom);
              }
            });
          }
          else if (settings.trigger.toLowerCase() == "hover") {
            var performFlip = function() {
              $dom.unbind('mouseleave', performUnflip);

              flip($dom);

              setTimeout(function() {
                $dom.bind('mouseleave', performUnflip);
                if (!$dom.is(":hover")) {
                  unflip($dom);
                }
              }, (settings.speed + 150));
            };

            var performUnflip = function() {
              unflip($dom);
            };

            $dom.mouseenter(performFlip);
            $dom.mouseleave(performUnflip);
          }
        }else{
          //The element has been initiated, all we have to do is change applicable settings
          if (options && (options.axis !== undefined || options.reverse !== undefined)){
            changeSettings.call(this,options,function(){
              $dom.trigger('flip:change');
              if (callback !== undefined){
                callback.call(this);
              }
            });
          }
      }
    });

    return this;
  };
  var changeSettings = function(options,callback){
    var changeNeeded = false;
    if (options.axis !== undefined && $(this).data("axis") != options.axis.toLowerCase()){
      $(this).data("axis", options.axis.toLowerCase());
      changeNeeded = true;
    }
    if (options.reverse !== undefined && $(this).data("reverse") != options.reverse){
      $(this).data("reverse", options.reverse);
      changeNeeded = true;
    }
    if (changeNeeded){
      var faces = $(this).find($(this).data("front")).add($(this).data("back"), $(this));
      var savedTrans = faces.css("transition");
      faces.css({
        transition: "none"
      });
      //Only setting the axis if it needs to be

      //options.axis = options.axis.toLowerCase();
      //$(this).data("axis", options.axis);

      //This sets up the first flip in the new direction automatically
      var rotateAxis = "rotate" + $(this).data("axis");
      if ($(this).data("flipped")){
        $(this).find($(this).data("front")).css({
          transform: rotateAxis + ($(this).data("reverse") ? "(-180deg)" : "(180deg)"),
          "z-index": "0"
        });
      }else{
        $(this).find($(this).data("back")).css({
          transform: rotateAxis + "(" + ($(this).data("reverse")? "180deg" : "-180deg") + ")",
          "z-index": "0"
        });
      }
      //Providing a nicely wrapped up callback because transform is essentially async
      setTimeout(function(){
        faces.css({
          transition: savedTrans
        });
          callback.call(this);
      }.bind(this),0);
    }else{
      //If we didnt have to set the axis we can just call back.
        setTimeout(callback.bind(this), 0);
    }
  };
}( jQuery ));


// Sticky Plugin v1.0.0 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.

(function($) {
  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: ''
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css('position', '')
              .css('top', '');
            s.stickyElement.parent().removeClass(s.className);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop != newTop) {
            s.stickyElement
              .css('position', 'fixed')
              .css('top', newTop);

            if (typeof s.getWidthFrom !== 'undefined') {
              s.stickyElement.css('width', $(s.getWidthFrom).width());
            }

            s.stickyElement.parent().addClass(s.className);
            s.currentTop = newTop;
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();
    },
    methods = {
      init: function(options) {
        var o = $.extend(defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var wrapper = $('<div></div>')
            .attr('id', stickyId + '-sticky-wrapper')
            .addClass(o.wrapperClassName);
          stickyElement.wrapAll(wrapper);

          if (o.center) {
            stickyElement.parent().css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") == "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          var stickyWrapper = stickyElement.parent();
          stickyWrapper.css('height', stickyElement.outerHeight());
          sticked.push({
            topSpacing: o.topSpacing,
            bottomSpacing: o.bottomSpacing,
            stickyElement: stickyElement,
            currentTop: null,
            stickyWrapper: stickyWrapper,
            className: o.className,
            getWidthFrom: o.getWidthFrom
          });
        });
      },
      update: scroller
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };
  $(function() {
    setTimeout(scroller, 0);
  });
}(jQuery));

