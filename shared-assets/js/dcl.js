/* ====================================================
 * support your local library
 * comments/questions? djarrett at dclibraries dot org
   ==================================================== */

// script to pull the alert
// smooth page scroll for page anchors
// jQuery match-height plugin
// flip
// scrollme
// sticky		

// pull the alert into the global-alert div
/* ------------------------------------------------------------ */

jQuery.get("https://s3.amazonaws.com/website.alert/alert.txt")
	.done(function (data) {
		/*alert( "Data Loaded: " + data );*/
		if (data != null) {
			jQuery("#global-alert").show().append(data);
		}
	});

// smooth page scroll for page anchors
/* ------------------------------------------------------------ */




// --------------------------------------------------------------------------------------------------------
// jquery-match-height master by @liabru
// http://brm.io/jquery-match-height/
// License: MIT
// --------------------------------------------------------------------------------------------------------

$(function () {
	$('.equal-height').matchHeight();
});

;
(function (factory) { // eslint-disable-line no-extra-semi
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global
		factory(jQuery);
	}
})(function ($) {
	/*
	 *  internal
	 */

	var _previousResizeWidth = -1,
		_updateTimeout = -1;

	/*
	 *  _parse
	 *  value parse utility function
	 */

	var _parse = function (value) {
		// parse value and convert NaN to 0
		return parseFloat(value) || 0;
	};

	/*
	 *  _rows
	 *  utility function returns array of jQuery selections representing each row
	 *  (as displayed after float wrapping applied by browser)
	 */

	var _rows = function (elements) {
		var tolerance = 1,
			$elements = $(elements),
			lastTop = null,
			rows = [];

		// group elements by their top position
		$elements.each(function () {
			var $that = $(this),
				top = $that.offset().top - _parse($that.css('margin-top')),
				lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

			if (lastRow === null) {
				// first item on the row, so just push it
				rows.push($that);
			} else {
				// if the row top is the same, add to the row group
				if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
					rows[rows.length - 1] = lastRow.add($that);
				} else {
					// otherwise start a new row group
					rows.push($that);
				}
			}

			// keep track of the last row top
			lastTop = top;
		});

		return rows;
	};

	/*
	 *  _parseOptions
	 *  handle plugin options
	 */

	var _parseOptions = function (options) {
		var opts = {
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		};

		if (typeof options === 'object') {
			return $.extend(opts, options);
		}

		if (typeof options === 'boolean') {
			opts.byRow = options;
		} else if (options === 'remove') {
			opts.remove = true;
		}

		return opts;
	};

	/*
	 *  matchHeight
	 *  plugin definition
	 */

	var matchHeight = $.fn.matchHeight = function (options) {
		var opts = _parseOptions(options);

		// handle remove
		if (opts.remove) {
			var that = this;

			// remove fixed height from all selected elements
			this.css(opts.property, '');

			// remove selected elements from all groups
			$.each(matchHeight._groups, function (key, group) {
				group.elements = group.elements.not(that);
			});

			// TODO: cleanup empty groups

			return this;
		}

		if (this.length <= 1 && !opts.target) {
			return this;
		}

		// keep track of this group so we can re-apply later on load and resize events
		matchHeight._groups.push({
			elements: this,
			options: opts
		});

		// match each element's height to the tallest element in the selection
		matchHeight._apply(this, opts);

		return this;
	};

	/*
	 *  plugin global options
	 */

	matchHeight.version = 'master';
	matchHeight._groups = [];
	matchHeight._throttle = 80;
	matchHeight._maintainScroll = false;
	matchHeight._beforeUpdate = null;
	matchHeight._afterUpdate = null;
	matchHeight._rows = _rows;
	matchHeight._parse = _parse;
	matchHeight._parseOptions = _parseOptions;

	/*
	 *  matchHeight._apply
	 *  apply matchHeight to given elements
	 */

	matchHeight._apply = function (elements, options) {
		var opts = _parseOptions(options),
			$elements = $(elements),
			rows = [$elements];

		// take note of scroll position
		var scrollTop = $(window).scrollTop(),
			htmlHeight = $('html').outerHeight(true);

		// get hidden parents
		var $hiddenParents = $elements.parents().filter(':hidden');

		// cache the original inline style
		$hiddenParents.each(function () {
			var $that = $(this);
			$that.data('style-cache', $that.attr('style'));
		});

		// temporarily must force hidden parents visible
		$hiddenParents.css('display', 'block');

		// get rows if using byRow, otherwise assume one row
		if (opts.byRow && !opts.target) {

			// must first force an arbitrary equal height so floating elements break evenly
			$elements.each(function () {
				var $that = $(this),
					display = $that.css('display');

				// temporarily force a usable display value
				if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
					display = 'block';
				}

				// cache the original inline style
				$that.data('style-cache', $that.attr('style'));

				$that.css({
					'display': display,
					'padding-top': '0',
					'padding-bottom': '0',
					'margin-top': '0',
					'margin-bottom': '0',
					'border-top-width': '0',
					'border-bottom-width': '0',
					'height': '100px',
					'overflow': 'hidden'
				});
			});

			// get the array of rows (based on element top position)
			rows = _rows($elements);

			// revert original inline styles
			$elements.each(function () {
				var $that = $(this);
				$that.attr('style', $that.data('style-cache') || '');
			});
		}

		$.each(rows, function (key, row) {
			var $row = $(row),
				targetHeight = 0;

			if (!opts.target) {
				// skip apply to rows with only one item
				if (opts.byRow && $row.length <= 1) {
					$row.css(opts.property, '');
					return;
				}

				// iterate the row and find the max height
				$row.each(function () {
					var $that = $(this),
						style = $that.attr('style'),
						display = $that.css('display');

					// temporarily force a usable display value
					if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
						display = 'block';
					}

					// ensure we get the correct actual height (and not a previously set height value)
					var css = {
						'display': display
					};
					css[opts.property] = '';
					$that.css(css);

					// find the max height (including padding, but not margin)
					if ($that.outerHeight(false) > targetHeight) {
						targetHeight = $that.outerHeight(false);
					}

					// revert styles
					if (style) {
						$that.attr('style', style);
					} else {
						$that.css('display', '');
					}
				});
			} else {
				// if target set, use the height of the target element
				targetHeight = opts.target.outerHeight(false);
			}

			// iterate the row and apply the height to all elements
			$row.each(function () {
				var $that = $(this),
					verticalPadding = 0;

				// don't apply to a target
				if (opts.target && $that.is(opts.target)) {
					return;
				}

				// handle padding and border correctly (required when not using border-box)
				if ($that.css('box-sizing') !== 'border-box') {
					verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
					verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
				}

				// set the height (accounting for padding and border)
				$that.css(opts.property, (targetHeight - verticalPadding) + 'px');
			});
		});

		// revert hidden parents
		$hiddenParents.each(function () {
			var $that = $(this);
			$that.attr('style', $that.data('style-cache') || null);
		});

		// restore scroll position if enabled
		if (matchHeight._maintainScroll) {
			$(window).scrollTop((scrollTop / htmlHeight) * $('html').outerHeight(true));
		}

		return this;
	};

	/*
	 *  matchHeight._applyDataApi
	 *  applies matchHeight to all elements with a data-match-height attribute
	 */

	matchHeight._applyDataApi = function () {
		var groups = {};

		// generate groups by their groupId set by elements using data-match-height
		$('[data-match-height], [data-mh]').each(function () {
			var $this = $(this),
				groupId = $this.attr('data-mh') || $this.attr('data-match-height');

			if (groupId in groups) {
				groups[groupId] = groups[groupId].add($this);
			} else {
				groups[groupId] = $this;
			}
		});

		// apply matchHeight to each group
		$.each(groups, function () {
			this.matchHeight(true);
		});
	};

	/*
	 *  matchHeight._update
	 *  updates matchHeight on all current groups with their correct options
	 */

	var _update = function (event) {
		if (matchHeight._beforeUpdate) {
			matchHeight._beforeUpdate(event, matchHeight._groups);
		}

		$.each(matchHeight._groups, function () {
			matchHeight._apply(this.elements, this.options);
		});

		if (matchHeight._afterUpdate) {
			matchHeight._afterUpdate(event, matchHeight._groups);
		}
	};

	matchHeight._update = function (throttle, event) {
		// prevent update if fired from a resize event
		// where the viewport width hasn't actually changed
		// fixes an event looping bug in IE8
		if (event && event.type === 'resize') {
			var windowWidth = $(window).width();
			if (windowWidth === _previousResizeWidth) {
				return;
			}
			_previousResizeWidth = windowWidth;
		}

		// throttle updates
		if (!throttle) {
			_update(event);
		} else if (_updateTimeout === -1) {
			_updateTimeout = setTimeout(function () {
				_update(event);
				_updateTimeout = -1;
			}, matchHeight._throttle);
		}
	};

	/*
	 *  bind events
	 */

	// apply on DOM ready event
	$(matchHeight._applyDataApi);

	// update heights on load and resize events
	$(window).bind('load', function (event) {
		matchHeight._update(false, event);
	});

	// throttled update heights on resize events
	$(window).bind('resize orientationchange', function (event) {
		matchHeight._update(true, event);
	});

});


/*! flip - v1.0.16 - 2015-08-09
 * https://github.com/nnattawat/flip
 * Copyright (c) 2015 Nattawat Nonsung; Licensed MIT */
(function ($) {
	var flip = function ($dom, callback) {
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
		$dom.one(whichTransitionEvent(), function () {
			$(this).trigger('flip:done');
			if (callback !== undefined) {
				callback.call(this);
			}
		});
	};

	var unflip = function ($dom, callback) {
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
		$dom.one(whichTransitionEvent(), function () {
			$(this).trigger('flip:done');
			if (callback !== undefined) {
				callback.call(this);
			}
		});
	};
	// Function from David Walsh: http://davidwalsh.name/css-animation-callback licensed with http://opensource.org/licenses/MIT
	var whichTransitionEvent = function () {
		var t,
			el = document.createElement("fakeelement"),
			transitions = {
				"transition": "transitionend",
				"OTransition": "oTransitionEnd",
				"MozTransition": "transitionend",
				"WebkitTransition": "webkitTransitionEnd"
			};

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	};
	$.fn.flip = function (options, callback) {
		if (typeof options == 'function') {
			//This allows flip to be called for setup with only a callback (default settings)
			callback = options;
		}
		this.each(function () {
			var $dom = $(this);

			if (options !== undefined && (typeof (options) == "boolean" || typeof (options) == "string")) { // Force flip the DOM
				if (options == "toggle") {
					options = !$dom.data("flipped");
				}
				if (options) {
					flip($dom, callback);
				} else {
					unflip($dom, callback);
				}
				// //Providing a nicely wrapped up callback because transform is essentially async
				//  $(this).one(whichTransitionEvent(), function(){
				//     $(this).trigger('flip:done');
				//     if (callback !== undefined){
				//       callback.call(this);
				//     }
				//   });
			} else if (!$dom.data("initiated")) { //Init flipable DOM
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
				}, options);

				//By defualt we first check for the old front and back selectors for backward compatibility
				//if they arent there we fall back to auto selecting the first and second div
				if (settings.front == "auto") {
					settings.front = ($dom.find('.front').length > 0) ? '.front' : 'div:first-child';
				} else if (settings.front == "autostrict") {
					settings.front = 'div:first-child';
				}
				if (settings.back == "auto") {
					//Note, we must use the old 'div:first-child + div' for IE compatibility
					settings.back = ($dom.find('.back').length > 0) ? '.back' : 'div:first-child + div';
				} else if (settings.back == "autostrict") {
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
					transform: rotateAxis + "(" + (settings.reverse ? "180deg" : "-180deg") + ")"
				});

				$dom.css({
					perspective: perspective,
					position: "relative"
				});

				var speedInSec = settings.speed / 1000 || 0.5;
				var faces = $dom.find(settings.front).add(settings.back, $dom);
				if (settings.forceHeight) {
					faces.outerHeight($dom.height());
				} else if (settings.autoSize) {
					faces.css({
						'height': '100%'
					});
				}
				if (settings.forceWidth) {
					faces.outerWidth($dom.width());
				} else if (settings.autoSize) {
					faces.css({
						'width': '100%'
					});
				}
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
					transform: rotateAxis + "(" + (settings.reverse ? "180deg" : "-180deg") + ")",
					"z-index": "0"
				});

				// Back face always visible on Chrome #39
				if ((window.chrome || (window.Intl && Intl.v8BreakIterator)) && 'CSS' in window) {
					//Blink Engine, add preserve-3d to $dom
					$dom.css({
						"-webkit-transform-style": "preserve-3d"
					});
				}
				// /#39

				// not forcing width/height may cause an initial flip to show up on
				// page load when we apply the style to reverse the backface...
				// To prevent this we first apply the basic styles and then give the
				// browser a moment to apply them. Only afterwards do we add the transition.
				setTimeout(function () {
					// By now the browser should have applied the styles, so the transition
					// will only affect subsequent flips.
					faces.css({
						transition: "all " + speedInSec + "s ease-out"
					});
					if (callback !== undefined) {
						callback.call(this);
					}
					//While this used to work with a setTimeout of zero, at some point that became
					//unstable and the initial flip returned. The reason for this is unknown but we
					//will temporarily use a short delay of 20 to mitigate this issue. 
				}, 20);

				if (settings.trigger.toLowerCase() == "click") {
					$dom.on($.fn.tap ? "tap" : "click", function (event) {
						if (!event) {
							event = window.event;
						}
						if ($dom.find($(event.target).closest('button, a, input[type="submit"]')).length) {
							return;
						}

						if ($dom.data("flipped")) {
							unflip($dom);
						} else {
							flip($dom);
						}
					});
				} else if (settings.trigger.toLowerCase() == "hover") {
					var performFlip = function () {
						$dom.unbind('mouseleave', performUnflip);

						flip($dom);

						setTimeout(function () {
							$dom.bind('mouseleave', performUnflip);
							if (!$dom.is(":hover")) {
								unflip($dom);
							}
						}, (settings.speed + 150));
					};

					var performUnflip = function () {
						unflip($dom);
					};

					$dom.mouseenter(performFlip);
					$dom.mouseleave(performUnflip);
				}
			} else {
				//The element has been initiated, all we have to do is change applicable settings
				if (options && (options.axis !== undefined || options.reverse !== undefined)) {
					changeSettings.call(this, options, function () {
						$dom.trigger('flip:change');
						if (callback !== undefined) {
							callback.call(this);
						}
					});
				}
			}
		});

		return this;
	};
	var changeSettings = function (options, callback) {
		var changeNeeded = false;
		if (options.axis !== undefined && $(this).data("axis") != options.axis.toLowerCase()) {
			$(this).data("axis", options.axis.toLowerCase());
			changeNeeded = true;
		}
		if (options.reverse !== undefined && $(this).data("reverse") != options.reverse) {
			$(this).data("reverse", options.reverse);
			changeNeeded = true;
		}
		if (changeNeeded) {
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
			if ($(this).data("flipped")) {
				$(this).find($(this).data("front")).css({
					transform: rotateAxis + ($(this).data("reverse") ? "(-180deg)" : "(180deg)"),
					"z-index": "0"
				});
			} else {
				$(this).find($(this).data("back")).css({
					transform: rotateAxis + "(" + ($(this).data("reverse") ? "180deg" : "-180deg") + ")",
					"z-index": "0"
				});
			}
			//Providing a nicely wrapped up callback because transform is essentially async
			setTimeout(function () {
				faces.css({
					transition: savedTrans
				});
				callback.call(this);
			}.bind(this), 0);
		} else {
			//If we didnt have to set the axis we can just call back.
			setTimeout(callback.bind(this), 0);
		}
	};
}(jQuery));


// ----------------------------------------------------------------------------------------------------
// ScrollMe
// A jQuery plugin for adding simple scrolling effects to web pages
// http://scrollme.nckprsn.com
// ----------------------------------------------------------------------------------------------------

var scrollme = (function ($) {
	// ----------------------------------------------------------------------------------------------------
	// ScrollMe object

	var _this = {};

	// ----------------------------------------------------------------------------------------------------
	// Properties

	var $document = $(document);
	var $window = $(window);

	_this.body_height = 0;

	_this.viewport_height = 0;

	_this.viewport_top = 0;
	_this.viewport_bottom = 0;

	_this.viewport_top_previous = -1;

	_this.elements = [];
	_this.elements_in_view = [];

	_this.property_defaults = {
		'opacity': 1,
		'translatex': 0,
		'translatey': 0,
		'translatez': 0,
		'rotatex': 0,
		'rotatey': 0,
		'rotatez': 0,
		'scale': 1,
		'scalex': 1,
		'scaley': 1,
		'scalez': 1
	};

	_this.scrollme_selector = '.scrollme';
	_this.animateme_selector = '.animateme';

	_this.update_interval = 10;

	// Easing functions

	_this.easing_functions = {
		'linear': function (x) {
			return x;
		},

		'easeout': function (x) {
			return x * x * x;
		},

		'easein': function (x) {
			x = 1 - x;
			return 1 - (x * x * x);
		},

		'easeinout': function (x) {
			if (x < 0.5) {
				return (4 * x * x * x);
			} else {
				x = 1 - x;
				return 1 - (4 * x * x * x);
			}
		}
	};

	// Document events to bind initialisation to

	_this.init_events = [
		'ready',
		'page:load', // Turbolinks
		'page:change' // Turbolinks
	];

	// ----------------------------------------------------------------------------------------------------
	// Initialisation conditions

	_this.init_if = function () {
		return true;
	}

	// ----------------------------------------------------------------------------------------------------
	// Initialisation

	_this.init = function () {
		// Cancel if initialisation conditions not met

		if (!_this.init_if()) return false;

		// Load all elements to animate

		_this.init_elements();

		// Get element & viewport sizes

		_this.on_resize();

		// Recalculate heights & positions on resize and rotate

		$window.on('resize orientationchange', function () {
			_this.on_resize();
		});

		// Recalculate heights & positions when page is fully loaded + a bit just in case

		$window.load(function () {
			setTimeout(function () {
				_this.on_resize();
			}, 100)
		});

		// Start animating

		setInterval(_this.update, _this.update_interval);

		return true;
	}

	// ----------------------------------------------------------------------------------------------------
	// Get list and pre-load animated elements

	_this.init_elements = function () {
		// For each reference element

		$(_this.scrollme_selector).each(function () {
			var element = {};

			element.element = $(this);

			var effects = [];

			// For each animated element

			$(this).find(_this.animateme_selector).addBack(_this.animateme_selector).each(function () {
				// Get effect details

				var effect = {};

				effect.element = $(this);

				effect.when = effect.element.data('when');
				effect.from = effect.element.data('from');
				effect.to = effect.element.data('to');

				if (effect.element.is('[data-crop]')) {
					effect.crop = effect.element.data('crop');
				} else {
					effect.crop = true;
				}

				if (effect.element.is('[data-easing]')) {
					effect.easing = _this.easing_functions[effect.element.data('easing')]
				} else {
					effect.easing = _this.easing_functions['easeout'];
				}

				// Get animated properties

				var properties = {};

				if (effect.element.is('[data-opacity]')) properties.opacity = effect.element.data('opacity');
				if (effect.element.is('[data-translatex]')) properties.translatex = effect.element.data('translatex');
				if (effect.element.is('[data-translatey]')) properties.translatey = effect.element.data('translatey');
				if (effect.element.is('[data-translatez]')) properties.translatez = effect.element.data('translatez');
				if (effect.element.is('[data-rotatex]')) properties.rotatex = effect.element.data('rotatex');
				if (effect.element.is('[data-rotatey]')) properties.rotatey = effect.element.data('rotatey');
				if (effect.element.is('[data-rotatez]')) properties.rotatez = effect.element.data('rotatez');
				if (effect.element.is('[data-scale]')) properties.scale = effect.element.data('scale');
				if (effect.element.is('[data-scalex]')) properties.scalex = effect.element.data('scalex');
				if (effect.element.is('[data-scaley]')) properties.scaley = effect.element.data('scaley');
				if (effect.element.is('[data-scalez]')) properties.scalez = effect.element.data('scalez');

				effect.properties = properties;

				effects.push(effect);
			});

			element.effects = effects;

			_this.elements.push(element);
		});
	}

	// ----------------------------------------------------------------------------------------------------
	// Update elements

	_this.update = function () {
		window.requestAnimationFrame(function () {
			_this.update_viewport_position();

			if (_this.viewport_top_previous != _this.viewport_top) {
				_this.update_elements_in_view();
				_this.animate();
			}

			_this.viewport_top_previous = _this.viewport_top;
		});
	}

	// ----------------------------------------------------------------------------------------------------
	// Animate stuff

	_this.animate = function () {
		// For each element in viewport

		var elements_in_view_length = _this.elements_in_view.length;

		for (var i = 0; i < elements_in_view_length; i++) {
			var element = _this.elements_in_view[i];

			// For each effect

			var effects_length = element.effects.length;

			for (var e = 0; e < effects_length; e++) {
				var effect = element.effects[e];

				// Get effect animation boundaries

				switch (effect.when) {
					case 'view': // Maintained for backwards compatibility
					case 'span':
						var start = element.top - _this.viewport_height;
						var end = element.bottom;
						break;

					case 'exit':
						var start = element.bottom - _this.viewport_height;
						var end = element.bottom;
						break;

					default:
						var start = element.top - _this.viewport_height;
						var end = element.top;
						break;
				}

				// Crop boundaries

				if (effect.crop) {
					if (start < 0) start = 0;
					if (end > (_this.body_height - _this.viewport_height)) end = _this.body_height - _this.viewport_height;
				}

				// Get scroll position of reference selector

				var scroll = (_this.viewport_top - start) / (end - start);

				// Get relative scroll position for effect

				var from = effect['from'];
				var to = effect['to'];

				var length = to - from;

				var scroll_relative = (scroll - from) / length;

				// Apply easing

				var scroll_eased = effect.easing(scroll_relative);

				// Get new value for each property

				var opacity = _this.animate_value(scroll, scroll_eased, from, to, effect, 'opacity');
				var translatey = _this.animate_value(scroll, scroll_eased, from, to, effect, 'translatey');
				var translatex = _this.animate_value(scroll, scroll_eased, from, to, effect, 'translatex');
				var translatez = _this.animate_value(scroll, scroll_eased, from, to, effect, 'translatez');
				var rotatex = _this.animate_value(scroll, scroll_eased, from, to, effect, 'rotatex');
				var rotatey = _this.animate_value(scroll, scroll_eased, from, to, effect, 'rotatey');
				var rotatez = _this.animate_value(scroll, scroll_eased, from, to, effect, 'rotatez');
				var scale = _this.animate_value(scroll, scroll_eased, from, to, effect, 'scale');
				var scalex = _this.animate_value(scroll, scroll_eased, from, to, effect, 'scalex');
				var scaley = _this.animate_value(scroll, scroll_eased, from, to, effect, 'scaley');
				var scalez = _this.animate_value(scroll, scroll_eased, from, to, effect, 'scalez');

				// Override scale values

				if ('scale' in effect.properties) {
					scalex = scale;
					scaley = scale;
					scalez = scale;
				}

				// Update properties

				effect.element.css({
					'opacity': opacity,
					'transform': 'translate3d( ' + translatex + 'px , ' + translatey + 'px , ' + translatez + 'px ) rotateX( ' + rotatex + 'deg ) rotateY( ' + rotatey + 'deg ) rotateZ( ' + rotatez + 'deg ) scale3d( ' + scalex + ' , ' + scaley + ' , ' + scalez + ' )'
				});
			}
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Calculate property values

	_this.animate_value = function (scroll, scroll_eased, from, to, effect, property) {
		var value_default = _this.property_defaults[property];

		// Return default value if property is not animated

		if (!(property in effect.properties)) return value_default;

		var value_target = effect.properties[property];

		var forwards = (to > from) ? true : false;

		// Return boundary value if outside effect boundaries

		if (scroll < from && forwards) {
			return value_default;
		}
		if (scroll > to && forwards) {
			return value_target;
		}

		if (scroll > from && !forwards) {
			return value_default;
		}
		if (scroll < to && !forwards) {
			return value_target;
		}

		// Calculate new property value

		var new_value = value_default + (scroll_eased * (value_target - value_default));

		// Round as required

		switch (property) {
			case 'opacity':
				new_value = new_value.toFixed(2);
				break;
			case 'translatex':
				new_value = new_value.toFixed(0);
				break;
			case 'translatey':
				new_value = new_value.toFixed(0);
				break;
			case 'translatez':
				new_value = new_value.toFixed(0);
				break;
			case 'rotatex':
				new_value = new_value.toFixed(1);
				break;
			case 'rotatey':
				new_value = new_value.toFixed(1);
				break;
			case 'rotatez':
				new_value = new_value.toFixed(1);
				break;
			case 'scale':
				new_value = new_value.toFixed(3);
				break;
			default:
				break;
		}

		// Done

		return new_value;
	}

	// ----------------------------------------------------------------------------------------------------
	// Update viewport position

	_this.update_viewport_position = function () {
		_this.viewport_top = $window.scrollTop();
		_this.viewport_bottom = _this.viewport_top + _this.viewport_height;
	}

	// ----------------------------------------------------------------------------------------------------
	// Update list of elements in view

	_this.update_elements_in_view = function () {
		_this.elements_in_view = [];

		var elements_length = _this.elements.length;

		for (var i = 0; i < elements_length; i++) {
			if ((_this.elements[i].top < _this.viewport_bottom) && (_this.elements[i].bottom > _this.viewport_top)) {
				_this.elements_in_view.push(_this.elements[i]);
			}
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Stuff to do on resize

	_this.on_resize = function () {
		// Update viewport/element data

		_this.update_viewport();
		_this.update_element_heights();

		// Update display

		_this.update_viewport_position();
		_this.update_elements_in_view();
		_this.animate();
	}

	// ----------------------------------------------------------------------------------------------------
	// Update viewport parameters

	_this.update_viewport = function () {
		_this.body_height = $document.height();
		_this.viewport_height = $window.height();
	}

	// ----------------------------------------------------------------------------------------------------
	// Update height of animated elements

	_this.update_element_heights = function () {
		var elements_length = _this.elements.length;

		for (var i = 0; i < elements_length; i++) {
			var element_height = _this.elements[i].element.outerHeight();
			var position = _this.elements[i].element.offset();

			_this.elements[i].height = element_height;
			_this.elements[i].top = position.top;
			_this.elements[i].bottom = position.top + element_height;
		}
	}

	// ----------------------------------------------------------------------------------------------------
	// Bind initialisation

	$document.on(_this.init_events.join(' '), function () {
		_this.init();
	});

	// ----------------------------------------------------------------------------------------------------

	return _this;

	// ----------------------------------------------------------------------------------------------------

})(jQuery);

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

(function ($) {
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
		scroller = function () {
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
				} else {
					var newTop = documentHeight - s.stickyElement.outerHeight() -
						s.topSpacing - s.bottomSpacing - scrollTop - extra;
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
		resizer = function () {
			windowHeight = $window.height();
		},
		methods = {
			init: function (options) {
				var o = $.extend(defaults, options);
				return this.each(function () {
					var stickyElement = $(this);

					var stickyId = stickyElement.attr('id');
					var wrapper = $('<div></div>')
						.attr('id', stickyId + '-sticky-wrapper')
						.addClass(o.wrapperClassName);
					stickyElement.wrapAll(wrapper);

					if (o.center) {
						stickyElement.parent().css({
							width: stickyElement.outerWidth(),
							marginLeft: "auto",
							marginRight: "auto"
						});
					}

					if (stickyElement.css("float") == "right") {
						stickyElement.css({
							"float": "none"
						}).parent().css({
							"float": "right"
						});
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

	$.fn.sticky = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.sticky');
		}
	};
	$(function () {
		setTimeout(scroller, 0);
	});
}(jQuery));
