(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./partials/_parallax');

require('./partials/_intro');

},{"./partials/_intro":2,"./partials/_parallax":3}],2:[function(require,module,exports){
'use strict';

var _randomcolor = require('randomcolor');

var _randomcolor2 = _interopRequireDefault(_randomcolor);

require('gsap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderIntro() {
  var logotype = document.querySelector('.js-logotype');
  var logomark = document.querySelector('.js-logomark');
  var logoNodes = logomark.childNodes;
  var tl = new TimelineMax();
  var shapes = [];

  for (var i in logoNodes) {
    var n = logoNodes[i];
    if (n.attributes) {
      shapes.push(n);
    };
  };

  var backgrounds = (0, _randomcolor2.default)({
    count: shapes.length,
    luminosity: 'light'
  });

  for (var i in shapes) {
    var shape = shapes[i];
    shape.setAttribute('fill', backgrounds[i]);
  };

  tl.staggerFromTo(shapes, 1, {
    css: { y: -100, opacity: 0 }
  }, {
    delay: 0.24,
    ease: Elastic.easeOut,
    css: { y: 0, opacity: 0.5 }
  }, 0.05);

  var tween = TweenMax.to(logotype, 1, {
    delay: 0.5,
    opacity: 1,
    ease: Elastic.easeOut
  }, 0.05);
};

document.addEventListener("DOMContentLoaded", function (event) {
  renderIntro();
});

},{"gsap":4,"randomcolor":5}],3:[function(require,module,exports){
'use strict';

var size = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content');

window.addEventListener('scroll', function (event) {

  if (size) {

    var depth, i, layer, layers, len, movement, topDistance, translate3d;
    topDistance = this.pageYOffset;
    layers = document.querySelectorAll('[data-type=\'parallax\']');

    for (i = 0, len = layers.length; i < len; i++) {
      layer = layers[i];
      depth = layer.getAttribute('data-depth');
      movement = -(topDistance * depth);
      translate3d = 'translate3d(0, ' + movement + 'px, 0)';
      layer.style['-webkit-transform'] = translate3d;
      layer.style['-moz-transform'] = translate3d;
      layer.style['-ms-transform'] = translate3d;
      layer.style['-o-transform'] = translate3d;
      layer.style.transform = translate3d;
    }
  }
});

},{}],4:[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.19.0
 * DATE: 2016-07-14
 * UPDATES AND DOCS AT: http://greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

	"use strict";

	_gsScope._gsDefine("TweenMax", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

		var _slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			_applyCycle = function(vars, targets, i) {
				var alt = vars.cycle,
					p, val;
				for (p in alt) {
					val = alt[p];
					vars[p] = (typeof(val) === "function") ? val(i, targets[i]) : val[i % val.length];
				}
				delete vars.cycle;
			},
			TweenMax = function(target, duration, vars) {
				TweenLite.call(this, target, duration, vars);
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._dirty = true; //ensures that if there is any repeat, the totalDuration will get recalculated to accurately report it.
				this.render = TweenMax.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_isSelector = TweenLiteInternals.isSelector,
			_isArray = TweenLiteInternals.isArray,
			p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
			_blankArray = [];

		TweenMax.version = "1.19.0";
		p.constructor = TweenMax;
		p.kill()._gc = false;
		TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
		TweenMax.getTweensOf = TweenLite.getTweensOf;
		TweenMax.lagSmoothing = TweenLite.lagSmoothing;
		TweenMax.ticker = TweenLite.ticker;
		TweenMax.render = TweenLite.render;

		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TweenLite.prototype.invalidate.call(this);
		};
		
		p.updateTo = function(vars, resetDuration) {
			var curRatio = this.ratio,
				immediate = this.vars.immediateRender || vars.immediateRender,
				p;
			if (resetDuration && this._startTime < this._timeline._time) {
				this._startTime = this._timeline._time;
				this._uncache(false);
				if (this._gc) {
					this._enabled(true, false);
				} else {
					this._timeline.insert(this, this._startTime - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			for (p in vars) {
				this.vars[p] = vars[p];
			}
			if (this._initted || immediate) {
				if (resetDuration) {
					this._initted = false;
					if (immediate) {
						this.render(0, true, true);
					}
				} else {
					if (this._gc) {
						this._enabled(true, false);
					}
					if (this._notifyPluginsOfEnabled && this._firstPT) {
						TweenLite._onPluginEvent("_onDisable", this); //in case a plugin like MotionBlur must perform some cleanup tasks
					}
					if (this._time / this._duration > 0.998) { //if the tween has finished (or come extremely close to finishing), we just need to rewind it to 0 and then render it again at the end which forces it to re-initialize (parsing the new vars). We allow tweens that are close to finishing (but haven't quite finished) to work this way too because otherwise, the values are so small when determining where to project the starting values that binary math issues creep in and can make the tween appear to render incorrectly when run backwards. 
						var prevTime = this._totalTime;
						this.render(0, true, false);
						this._initted = false;
						this.render(prevTime, true, false);
					} else {
						this._initted = false;
						this._init();
						if (this._time > 0 || immediate) {
							var inv = 1 / (1 - curRatio),
								pt = this._firstPT, endValue;
							while (pt) {
								endValue = pt.s + pt.c;
								pt.c *= inv;
								pt.s = endValue - pt.c;
								pt = pt._next;
							}
						}
					}
				}
			}
			return this;
		};
				
		p.render = function(time, suppressEvents, force) {
			if (!this._initted) if (this._duration === 0 && this.vars.repeat) { //zero duration tweens that render immediately have render() called from TweenLite's constructor, before TweenMax's constructor has finished setting _repeat, _repeatDelay, and _yoyo which are critical in determining totalDuration() so we need to call invalidate() which is a low-kb way to get those set properly.
				this.invalidate();
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				prevTime = this._time,
				prevTotalTime = this._totalTime, 
				prevCycle = this._cycle,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, cycleDuration, r, type, pow, rawPrevTime;
			if (time >= totalDur - 0.0000001) { //to work around occasional floating point math artifacts.
				this._totalTime = totalDur;
				this._cycle = this._repeat;
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = 0;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				} else {
					this._time = duration;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				}
				if (!this._reversed) {
					isComplete = true;
					callback = "onComplete";
					force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}
				
			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = this._cycle = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTotalTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				}
				if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;
				if (this._repeat !== 0) {
					cycleDuration = duration + this._repeatDelay;
					this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
					if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration && prevTotalTime <= time) {
						this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
					}
					this._time = this._totalTime - (this._cycle * cycleDuration);
					if (this._yoyo) if ((this._cycle & 1) !== 0) {
						this._time = duration - this._time;
					}
					if (this._time > duration) {
						this._time = duration;
					} else if (this._time < 0) {
						this._time = 0;
					}
				}

				if (this._easeType) {
					r = this._time / duration;
					type = this._easeType;
					pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (this._time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(this._time / duration);
				}
				
			}
				
			if (prevTime === this._time && !force && prevCycle === this._cycle) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._callback("onUpdate");
				}
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) { //we stick it in the queue for rendering at the very end of the tick - this is a performance optimization because browsers invalidate styles and force a recalculation if you read, write, and then read style data (so it's better to read/read/read/write/write/write than read/write/read/write/read/write). The down side, of course, is that usually you WANT things to render immediately because you may have code running right after that which depends on the change. Like imagine running TweenLite.set(...) and then immediately after that, creating a nother tween that animates the same property to another value; the starting values of that 2nd tween wouldn't be accurate if lazy is true.
					this._time = prevTime;
					this._totalTime = prevTotalTime;
					this._rawPrevTime = prevRawPrevTime;
					this._cycle = prevCycle;
					TweenLiteInternals.lazyTweens.push(this);
					this._lazy = [time, suppressEvents];
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) {
				this._lazy = false;
			}

			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTotalTime === 0) {
				if (this._initted === 2 && time > 0) {
					//this.invalidate();
					this._init(); //will just apply overwriting since _initted of (2) means it was a from() tween that had immediateRender:true
				}
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._totalTime !== 0 || duration === 0) if (!suppressEvents) {
					this._callback("onStart");
				}
			}
			
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}
			
			if (this._onUpdate) {
				if (time < 0) if (this._startAt && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._totalTime !== prevTotalTime || callback) {
					this._callback("onUpdate");
				}
			}
			if (this._cycle !== prevCycle) if (!suppressEvents) if (!this._gc) if (this.vars.onRepeat) {
				this._callback("onRepeat");
			}
			if (callback) if (!this._gc || force) { //check gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};
		
//---- STATIC FUNCTIONS -----------------------------------------------------------------------------------------------------------
		
		TweenMax.to = function(target, duration, vars) {
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenMax(target, duration, toVars);
		};
		
		TweenMax.staggerTo = TweenMax.allTo = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			stagger = stagger || 0;
			var delay = 0,
				a = [],
				finalComplete = function() {
					if (vars.onComplete) {
						vars.onComplete.apply(vars.onCompleteScope || this, arguments);
					}
					onCompleteAll.apply(onCompleteAllScope || vars.callbackScope || this, onCompleteAllParams || _blankArray);
				},
				cycle = vars.cycle,
				fromCycle = (vars.startAt && vars.startAt.cycle),
				l, copy, i, p;
			if (!_isArray(targets)) {
				if (typeof(targets) === "string") {
					targets = TweenLite.selector(targets) || targets;
				}
				if (_isSelector(targets)) {
					targets = _slice(targets);
				}
			}
			targets = targets || [];
			if (stagger < 0) {
				targets = _slice(targets);
				targets.reverse();
				stagger *= -1;
			}
			l = targets.length - 1;
			for (i = 0; i <= l; i++) {
				copy = {};
				for (p in vars) {
					copy[p] = vars[p];
				}
				if (cycle) {
					_applyCycle(copy, targets, i);
					if (copy.duration != null) {
						duration = copy.duration;
						delete copy.duration;
					}
				}
				if (fromCycle) {
					fromCycle = copy.startAt = {};
					for (p in vars.startAt) {
						fromCycle[p] = vars.startAt[p];
					}
					_applyCycle(copy.startAt, targets, i);
				}
				copy.delay = delay + (copy.delay || 0);
				if (i === l && onCompleteAll) {
					copy.onComplete = finalComplete;
				}
				a[i] = new TweenMax(targets[i], duration, copy);
				delay += stagger;
			}
			return a;
		};
		
		TweenMax.staggerFrom = TweenMax.allFrom = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
		
		TweenMax.staggerFromTo = TweenMax.allFromTo = function(targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
				
		TweenMax.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenMax(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, useFrames:useFrames, overwrite:0});
		};
		
		TweenMax.set = function(target, vars) {
			return new TweenMax(target, 0, vars);
		};
		
		TweenMax.isTweening = function(target) {
			return (TweenLite.getTweensOf(target, true).length > 0);
		};
		
		var _getChildrenOf = function(timeline, includeTimelines) {
				var a = [],
					cnt = 0,
					tween = timeline._first;
				while (tween) {
					if (tween instanceof TweenLite) {
						a[cnt++] = tween;
					} else {
						if (includeTimelines) {
							a[cnt++] = tween;
						}
						a = a.concat(_getChildrenOf(tween, includeTimelines));
						cnt = a.length;
					}
					tween = tween._next;
				}
				return a;
			}, 
			getAllTweens = TweenMax.getAllTweens = function(includeTimelines) {
				return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat( _getChildrenOf(Animation._rootFramesTimeline, includeTimelines) );
			};
		
		TweenMax.killAll = function(complete, tweens, delayedCalls, timelines) {
			if (tweens == null) {
				tweens = true;
			}
			if (delayedCalls == null) {
				delayedCalls = true;
			}
			var a = getAllTweens((timelines != false)),
				l = a.length,
				allTrue = (tweens && delayedCalls && timelines),
				isDC, tween, i;
			for (i = 0; i < l; i++) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					if (complete) {
						tween.totalTime(tween._reversed ? 0 : tween.totalDuration());
					} else {
						tween._enabled(false, false);
					}
				}
			}
		};
		
		TweenMax.killChildTweensOf = function(parent, complete) {
			if (parent == null) {
				return;
			}
			var tl = TweenLiteInternals.tweenLookup,
				a, curParent, p, i, l;
			if (typeof(parent) === "string") {
				parent = TweenLite.selector(parent) || parent;
			}
			if (_isSelector(parent)) {
				parent = _slice(parent);
			}
			if (_isArray(parent)) {
				i = parent.length;
				while (--i > -1) {
					TweenMax.killChildTweensOf(parent[i], complete);
				}
				return;
			}
			a = [];
			for (p in tl) {
				curParent = tl[p].target.parentNode;
				while (curParent) {
					if (curParent === parent) {
						a = a.concat(tl[p].tweens);
					}
					curParent = curParent.parentNode;
				}
			}
			l = a.length;
			for (i = 0; i < l; i++) {
				if (complete) {
					a[i].totalTime(a[i].totalDuration());
				}
				a[i]._enabled(false, false);
			}
		};

		var _changePause = function(pause, tweens, delayedCalls, timelines) {
			tweens = (tweens !== false);
			delayedCalls = (delayedCalls !== false);
			timelines = (timelines !== false);
			var a = getAllTweens(timelines),
				allTrue = (tweens && delayedCalls && timelines),
				i = a.length,
				isDC, tween;
			while (--i > -1) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					tween.paused(pause);
				}
			}
		};
		
		TweenMax.pauseAll = function(tweens, delayedCalls, timelines) {
			_changePause(true, tweens, delayedCalls, timelines);
		};
		
		TweenMax.resumeAll = function(tweens, delayedCalls, timelines) {
			_changePause(false, tweens, delayedCalls, timelines);
		};

		TweenMax.globalTimeScale = function(value) {
			var tl = Animation._rootTimeline,
				t = TweenLite.ticker.time;
			if (!arguments.length) {
				return tl._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
			tl = Animation._rootFramesTimeline;
			t = TweenLite.ticker.frame;
			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
			tl._timeScale = Animation._rootTimeline._timeScale = value;
			return value;
		};
		
	
//---- GETTERS / SETTERS ----------------------------------------------------------------------------------------------------------
		
		p.progress = function(value, suppressEvents) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
		};
		
		p.totalProgress = function(value, suppressEvents) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, suppressEvents);
		};
		
		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.duration = function(value) {
			if (!arguments.length) {
				return this._duration; //don't set _dirty = false because there could be repeats that haven't been factored into the _totalDuration yet. Otherwise, if you create a repeated TweenMax and then immediately check its duration(), it would cache the value and the totalDuration would not be correct, thus repeats wouldn't take effect.
			}
			return Animation.prototype.duration.call(this, value);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					//instead of Infinity, we use 999999999999 so that we can accommodate reverses
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
					this._dirty = false;
				}
				return this._totalDuration;
			}
			return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
		};
		
		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};
		
		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};
		
		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};
		
		
		return TweenMax;
		
	}, true);








/*
 * ----------------------------------------------------------------
 * TimelineLite
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("TimelineLite", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

		var TimelineLite = function(vars) {
				SimpleTimeline.call(this, vars);
				this._labels = {};
				this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
				this.smoothChildTiming = (this.vars.smoothChildTiming === true);
				this._sortChildren = true;
				this._onUpdate = this.vars.onUpdate;
				var v = this.vars,
					val, p;
				for (p in v) {
					val = v[p];
					if (_isArray(val)) if (val.join("").indexOf("{self}") !== -1) {
						v[p] = this._swapSelfInParams(val);
					}
				}
				if (_isArray(v.tweens)) {
					this.add(v.tweens, 0, v.align, v.stagger);
				}
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_internals = TimelineLite._internals = {},
			_isSelector = TweenLiteInternals.isSelector,
			_isArray = TweenLiteInternals.isArray,
			_lazyTweens = TweenLiteInternals.lazyTweens,
			_lazyRender = TweenLiteInternals.lazyRender,
			_globals = _gsScope._gsDefine.globals,
			_copy = function(vars) {
				var copy = {}, p;
				for (p in vars) {
					copy[p] = vars[p];
				}
				return copy;
			},
			_applyCycle = function(vars, targets, i) {
				var alt = vars.cycle,
					p, val;
				for (p in alt) {
					val = alt[p];
					vars[p] = (typeof(val) === "function") ? val.call(targets[i], i) : val[i % val.length];
				}
				delete vars.cycle;
			},
			_pauseCallback = _internals.pauseCallback = function() {},
			_slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			p = TimelineLite.prototype = new SimpleTimeline();

		TimelineLite.version = "1.19.0";
		p.constructor = TimelineLite;
		p.kill()._gc = p._forcingPlayhead = p._hasPause = false;

		/* might use later...
		//translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
		function localToGlobal(time, animation) {
			while (animation) {
				time = (time / animation._timeScale) + animation._startTime;
				animation = animation.timeline;
			}
			return time;
		}

		//translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
		function globalToLocal(time, animation) {
			var scale = 1;
			time -= localToGlobal(0, animation);
			while (animation) {
				scale *= animation._timeScale;
				animation = animation.timeline;
			}
			return time * scale;
		}
		*/

		p.to = function(target, duration, vars, position) {
			var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
			return duration ? this.add( new Engine(target, duration, vars), position) : this.set(target, vars, position);
		};

		p.from = function(target, duration, vars, position) {
			return this.add( ((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, vars), position);
		};

		p.fromTo = function(target, duration, fromVars, toVars, position) {
			var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
			return duration ? this.add( Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
		};

		p.staggerTo = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			var tl = new TimelineLite({onComplete:onCompleteAll, onCompleteParams:onCompleteAllParams, callbackScope:onCompleteAllScope, smoothChildTiming:this.smoothChildTiming}),
				cycle = vars.cycle,
				copy, i;
			if (typeof(targets) === "string") {
				targets = TweenLite.selector(targets) || targets;
			}
			targets = targets || [];
			if (_isSelector(targets)) { //senses if the targets object is a selector. If it is, we should translate it into an array.
				targets = _slice(targets);
			}
			stagger = stagger || 0;
			if (stagger < 0) {
				targets = _slice(targets);
				targets.reverse();
				stagger *= -1;
			}
			for (i = 0; i < targets.length; i++) {
				copy = _copy(vars);
				if (copy.startAt) {
					copy.startAt = _copy(copy.startAt);
					if (copy.startAt.cycle) {
						_applyCycle(copy.startAt, targets, i);
					}
				}
				if (cycle) {
					_applyCycle(copy, targets, i);
					if (copy.duration != null) {
						duration = copy.duration;
						delete copy.duration;
					}
				}
				tl.to(targets[i], duration, copy, i * stagger);
			}
			return this.add(tl, position);
		};

		p.staggerFrom = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.immediateRender = (vars.immediateRender != false);
			vars.runBackwards = true;
			return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.call = function(callback, params, scope, position) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.set = function(target, vars, position) {
			position = this._parseTimeOrLabel(position, 0, true);
			if (vars.immediateRender == null) {
				vars.immediateRender = (position === this._time && !this._paused);
			}
			return this.add( new TweenLite(target, 0, vars), position);
		};

		TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
			vars = vars || {};
			if (vars.smoothChildTiming == null) {
				vars.smoothChildTiming = true;
			}
			var tl = new TimelineLite(vars),
				root = tl._timeline,
				tween, next;
			if (ignoreDelayedCalls == null) {
				ignoreDelayedCalls = true;
			}
			root._remove(tl, true);
			tl._startTime = 0;
			tl._rawPrevTime = tl._time = tl._totalTime = root._time;
			tween = root._first;
			while (tween) {
				next = tween._next;
				if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
					tl.add(tween, tween._startTime - tween._delay);
				}
				tween = next;
			}
			root.add(tl, 0);
			return tl;
		};

		p.add = function(value, position, align, stagger) {
			var curTime, l, i, child, tl, beforeRawTime;
			if (typeof(position) !== "number") {
				position = this._parseTimeOrLabel(position, 0, true, value);
			}
			if (!(value instanceof Animation)) {
				if ((value instanceof Array) || (value && value.push && _isArray(value))) {
					align = align || "normal";
					stagger = stagger || 0;
					curTime = position;
					l = value.length;
					for (i = 0; i < l; i++) {
						if (_isArray(child = value[i])) {
							child = new TimelineLite({tweens:child});
						}
						this.add(child, curTime);
						if (typeof(child) !== "string" && typeof(child) !== "function") {
							if (align === "sequence") {
								curTime = child._startTime + (child.totalDuration() / child._timeScale);
							} else if (align === "start") {
								child._startTime -= child.delay();
							}
						}
						curTime += stagger;
					}
					return this._uncache(true);
				} else if (typeof(value) === "string") {
					return this.addLabel(value, position);
				} else if (typeof(value) === "function") {
					value = TweenLite.delayedCall(0, value);
				} else {
					throw("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
				}
			}

			SimpleTimeline.prototype.add.call(this, value, position);

			//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
			if (this._gc || this._time === this._duration) if (!this._paused) if (this._duration < this.duration()) {
				//in case any of the ancestors had completed but should now be enabled...
				tl = this;
				beforeRawTime = (tl.rawTime() > value._startTime); //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
				while (tl._timeline) {
					if (beforeRawTime && tl._timeline.smoothChildTiming) {
						tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
					} else if (tl._gc) {
						tl._enabled(true, false);
					}
					tl = tl._timeline;
				}
			}

			return this;
		};

		p.remove = function(value) {
			if (value instanceof Animation) {
				this._remove(value, false);
				var tl = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline; //now that it's removed, default it to the root timeline so that if it gets played again, it doesn't jump back into this timeline.
				value._startTime = (value._paused ? value._pauseTime : tl._time) - ((!value._reversed ? value._totalTime : value.totalDuration() - value._totalTime) / value._timeScale); //ensure that if it gets played again, the timing is correct.
				return this;
			} else if (value instanceof Array || (value && value.push && _isArray(value))) {
				var i = value.length;
				while (--i > -1) {
					this.remove(value[i]);
				}
				return this;
			} else if (typeof(value) === "string") {
				return this.removeLabel(value);
			}
			return this.kill(null, value);
		};

		p._remove = function(tween, skipDisable) {
			SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
			var last = this._last;
			if (!last) {
				this._time = this._totalTime = this._duration = this._totalDuration = 0;
			} else if (this._time > last._startTime + last._totalDuration / last._timeScale) {
				this._time = this.duration();
				this._totalTime = this._totalDuration;
			}
			return this;
		};

		p.append = function(value, offsetOrLabel) {
			return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
		};

		p.insert = p.insertMultiple = function(value, position, align, stagger) {
			return this.add(value, position || 0, align, stagger);
		};

		p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
			return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
		};

		p.addLabel = function(label, position) {
			this._labels[label] = this._parseTimeOrLabel(position);
			return this;
		};

		p.addPause = function(position, callback, params, scope) {
			var t = TweenLite.delayedCall(0, _pauseCallback, params, scope || this);
			t.vars.onComplete = t.vars.onReverseComplete = callback;
			t.data = "isPause";
			this._hasPause = true;
			return this.add(t, position);
		};

		p.removeLabel = function(label) {
			delete this._labels[label];
			return this;
		};

		p.getLabelTime = function(label) {
			return (this._labels[label] != null) ? this._labels[label] : -1;
		};

		p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
			var i;
			//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
			if (ignore instanceof Animation && ignore.timeline === this) {
				this.remove(ignore);
			} else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
				i = ignore.length;
				while (--i > -1) {
					if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
						this.remove(ignore[i]);
					}
				}
			}
			if (typeof(offsetOrLabel) === "string") {
				return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0, appendIfAbsent);
			}
			offsetOrLabel = offsetOrLabel || 0;
			if (typeof(timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
				i = timeOrLabel.indexOf("=");
				if (i === -1) {
					if (this._labels[timeOrLabel] == null) {
						return appendIfAbsent ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
					}
					return this._labels[timeOrLabel] + offsetOrLabel;
				}
				offsetOrLabel = parseInt(timeOrLabel.charAt(i-1) + "1", 10) * Number(timeOrLabel.substr(i+1));
				timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i-1), 0, appendIfAbsent) : this.duration();
			} else if (timeOrLabel == null) {
				timeOrLabel = this.duration();
			}
			return Number(timeOrLabel) + offsetOrLabel;
		};

		p.seek = function(position, suppressEvents) {
			return this.totalTime((typeof(position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
		};

		p.stop = function() {
			return this.paused(true);
		};

		p.gotoAndPlay = function(position, suppressEvents) {
			return this.play(position, suppressEvents);
		};

		p.gotoAndStop = function(position, suppressEvents) {
			return this.pause(position, suppressEvents);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				prevTime = this._time,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevPaused = this._paused,
				tween, isComplete, next, callback, internalForce, pauseTween, curTime;
			if (time >= totalDur - 0.0000001) { //to work around occasional floating point math artifacts.
				this._totalTime = this._time = totalDur;
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					if (this._duration === 0) if ((time <= 0 && time >= -0.0000001) || this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum) if (this._rawPrevTime !== time && this._first) {
						internalForce = true;
						if (this._rawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || (time < 0 && this._rawPrevTime >= 0)))) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._timeline.autoRemoveChildren && this._reversed) { //ensures proper GC if a timeline is resumed after it's finished reversing.
						internalForce = isComplete = true;
						callback = "onReverseComplete";
					} else if (this._rawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
						internalForce = true;
					}
					this._rawPrevTime = time;
				} else {
					this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
						tween = this._first;
						while (tween && tween._startTime === 0) {
							if (!tween._duration) {
								isComplete = false;
							}
							tween = tween._next;
						}
					}
					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
					if (!this._initted) {
						internalForce = true;
					}
				}

			} else {

				if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
					if (time >= prevTime) {
						tween = this._first;
						while (tween && tween._startTime <= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
								pauseTween = tween;
							}
							tween = tween._next;
						}
					} else {
						tween = this._last;
						while (tween && tween._startTime >= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
								pauseTween = tween;
							}
							tween = tween._prev;
						}
					}
					if (pauseTween) {
						this._time = time = pauseTween._startTime;
						this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
					}
				}

				this._totalTime = this._time = this._rawPrevTime = time;
			}
			if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
				return;
			} else if (!this._initted) {
				this._initted = true;
			}

			if (!this._active) if (!this._paused && this._time !== prevTime && time > 0) {
				this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
			}

			if (prevTime === 0) if (this.vars.onStart) if (this._time !== 0 || !this._duration) if (!suppressEvents) {
				this._callback("onStart");
			}

			curTime = this._time;
			if (curTime >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= curTime && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
							while (pauseTween && pauseTween.endTime() > this._time) {
								pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
								pauseTween = pauseTween._prev;
							}
							pauseTween = null;
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				this._callback("onUpdate");
			}

			if (callback) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
			}
		};

		p._hasPausedChild = function() {
			var tween = this._first;
			while (tween) {
				if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
					return true;
				}
				tween = tween._next;
			}
			return false;
		};

		p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || -9999999999;
			var a = [],
				tween = this._first,
				cnt = 0;
			while (tween) {
				if (tween._startTime < ignoreBeforeTime) {
					//do nothing
				} else if (tween instanceof TweenLite) {
					if (tweens !== false) {
						a[cnt++] = tween;
					}
				} else {
					if (timelines !== false) {
						a[cnt++] = tween;
					}
					if (nested !== false) {
						a = a.concat(tween.getChildren(true, tweens, timelines));
						cnt = a.length;
					}
				}
				tween = tween._next;
			}
			return a;
		};

		p.getTweensOf = function(target, nested) {
			var disabled = this._gc,
				a = [],
				cnt = 0,
				tweens, i;
			if (disabled) {
				this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
			}
			tweens = TweenLite.getTweensOf(target);
			i = tweens.length;
			while (--i > -1) {
				if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
					a[cnt++] = tweens[i];
				}
			}
			if (disabled) {
				this._enabled(false, true);
			}
			return a;
		};

		p.recent = function() {
			return this._recent;
		};

		p._contains = function(tween) {
			var tl = tween.timeline;
			while (tl) {
				if (tl === this) {
					return true;
				}
				tl = tl.timeline;
			}
			return false;
		};

		p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || 0;
			var tween = this._first,
				labels = this._labels,
				p;
			while (tween) {
				if (tween._startTime >= ignoreBeforeTime) {
					tween._startTime += amount;
				}
				tween = tween._next;
			}
			if (adjustLabels) {
				for (p in labels) {
					if (labels[p] >= ignoreBeforeTime) {
						labels[p] += amount;
					}
				}
			}
			return this._uncache(true);
		};

		p._kill = function(vars, target) {
			if (!vars && !target) {
				return this._enabled(false, false);
			}
			var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target),
				i = tweens.length,
				changed = false;
			while (--i > -1) {
				if (tweens[i]._kill(vars, target)) {
					changed = true;
				}
			}
			return changed;
		};

		p.clear = function(labels) {
			var tweens = this.getChildren(false, true, true),
				i = tweens.length;
			this._time = this._totalTime = 0;
			while (--i > -1) {
				tweens[i]._enabled(false, false);
			}
			if (labels !== false) {
				this._labels = {};
			}
			return this._uncache(true);
		};

		p.invalidate = function() {
			var tween = this._first;
			while (tween) {
				tween.invalidate();
				tween = tween._next;
			}
			return Animation.prototype.invalidate.call(this);;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (enabled === this._gc) {
				var tween = this._first;
				while (tween) {
					tween._enabled(enabled, true);
					tween = tween._next;
				}
			}
			return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			this._forcingPlayhead = true;
			var val = Animation.prototype.totalTime.apply(this, arguments);
			this._forcingPlayhead = false;
			return val;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					this.totalDuration(); //just triggers recalculation
				}
				return this._duration;
			}
			if (this.duration() !== 0 && value !== 0) {
				this.timeScale(this._duration / value);
			}
			return this;
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					var max = 0,
						tween = this._last,
						prevStart = 999999999999,
						prev, end;
					while (tween) {
						prev = tween._prev; //record it here in case the tween changes position in the sequence...
						if (tween._dirty) {
							tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
						}
						if (tween._startTime > prevStart && this._sortChildren && !tween._paused) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
							this.add(tween, tween._startTime - tween._delay);
						} else {
							prevStart = tween._startTime;
						}
						if (tween._startTime < 0 && !tween._paused) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
							max -= tween._startTime;
							if (this._timeline.smoothChildTiming) {
								this._startTime += tween._startTime / this._timeScale;
							}
							this.shiftChildren(-tween._startTime, false, -9999999999);
							prevStart = 0;
						}
						end = tween._startTime + (tween._totalDuration / tween._timeScale);
						if (end > max) {
							max = end;
						}
						tween = prev;
					}
					this._duration = this._totalDuration = max;
					this._dirty = false;
				}
				return this._totalDuration;
			}
			return (value && this.totalDuration()) ? this.timeScale(this._totalDuration / value) : this;
		};

		p.paused = function(value) {
			if (!value) { //if there's a pause directly at the spot from where we're unpausing, skip it.
				var tween = this._first,
					time = this._time;
				while (tween) {
					if (tween._startTime === time && tween.data === "isPause") {
						tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
					}
					tween = tween._next;
				}
			}
			return Animation.prototype.paused.apply(this, arguments);
		};

		p.usesFrames = function() {
			var tl = this._timeline;
			while (tl._timeline) {
				tl = tl._timeline;
			}
			return (tl === Animation._rootFramesTimeline);
		};

		p.rawTime = function() {
			return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
		};

		return TimelineLite;

	}, true);








	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * TimelineMax
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("TimelineMax", ["TimelineLite","TweenLite","easing.Ease"], function(TimelineLite, TweenLite, Ease) {

		var TimelineMax = function(vars) {
				TimelineLite.call(this, vars);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._dirty = true;
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_lazyTweens = TweenLiteInternals.lazyTweens,
			_lazyRender = TweenLiteInternals.lazyRender,
			_globals = _gsScope._gsDefine.globals,
			_easeNone = new Ease(null, null, 1, 0),
			p = TimelineMax.prototype = new TimelineLite();

		p.constructor = TimelineMax;
		p.kill()._gc = false;
		TimelineMax.version = "1.19.0";

		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TimelineLite.prototype.invalidate.call(this);
		};

		p.addCallback = function(callback, position, params, scope) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.removeCallback = function(callback, position) {
			if (callback) {
				if (position == null) {
					this._kill(null, callback);
				} else {
					var a = this.getTweensOf(callback, false),
						i = a.length,
						time = this._parseTimeOrLabel(position);
					while (--i > -1) {
						if (a[i]._startTime === time) {
							a[i]._enabled(false, false);
						}
					}
				}
			}
			return this;
		};

		p.removePause = function(position) {
			return this.removeCallback(TimelineLite._internals.pauseCallback, position);
		};

		p.tweenTo = function(position, vars) {
			vars = vars || {};
			var copy = {ease:_easeNone, useFrames:this.usesFrames(), immediateRender:false},
				Engine = (vars.repeat && _globals.TweenMax) || TweenLite,
				duration, p, t;
			for (p in vars) {
				copy[p] = vars[p];
			}
			copy.time = this._parseTimeOrLabel(position);
			duration = (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001;
			t = new Engine(this, duration, copy);
			copy.onStart = function() {
				t.target.paused(true);
				if (t.vars.time !== t.target.time() && duration === t.duration()) { //don't make the duration zero - if it's supposed to be zero, don't worry because it's already initting the tween and will complete immediately, effectively making the duration zero anyway. If we make duration zero, the tween won't run at all.
					t.duration( Math.abs( t.vars.time - t.target.time()) / t.target._timeScale );
				}
				if (vars.onStart) { //in case the user had an onStart in the vars - we don't want to overwrite it.
					t._callback("onStart");
				}
			};
			return t;
		};

		p.tweenFromTo = function(fromPosition, toPosition, vars) {
			vars = vars || {};
			fromPosition = this._parseTimeOrLabel(fromPosition);
			vars.startAt = {onComplete:this.seek, onCompleteParams:[fromPosition], callbackScope:this};
			vars.immediateRender = (vars.immediateRender !== false);
			var t = this.tweenTo(toPosition, vars);
			return t.duration((Math.abs( t.vars.time - fromPosition) / this._timeScale) || 0.001);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				dur = this._duration,
				prevTime = this._time,
				prevTotalTime = this._totalTime,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevRawPrevTime = this._rawPrevTime,
				prevPaused = this._paused,
				prevCycle = this._cycle,
				tween, isComplete, next, callback, internalForce, cycleDuration, pauseTween, curTime;
			if (time >= totalDur - 0.0000001) { //to work around occasional floating point math artifacts.
				if (!this._locked) {
					this._totalTime = totalDur;
					this._cycle = this._repeat;
				}
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					if (this._duration === 0) if ((time <= 0 && time >= -0.0000001) || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) if (prevRawPrevTime !== time && this._first) {
						internalForce = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = time = 0;
				} else {
					this._time = dur;
					time = dur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7. We cannot do less then 0.0001 because the same issue can occur when the duration is extremely large like 999999999999 in which case adding 0.00000001, for example, causes it to act like nothing was added.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				if (!this._locked) {
					this._totalTime = this._cycle = 0;
				}
				this._time = 0;
				if (prevTime !== 0 || (dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || (time < 0 && prevRawPrevTime >= 0)) && !this._locked)) { //edge case for checking time < 0 && prevRawPrevTime >= 0: a zero-duration fromTo() tween inside a zero-duration timeline (yeah, very rare)
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._timeline.autoRemoveChildren && this._reversed) {
						internalForce = isComplete = true;
						callback = "onReverseComplete";
					} else if (prevRawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
						internalForce = true;
					}
					this._rawPrevTime = time;
				} else {
					this._rawPrevTime = (dur || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
						tween = this._first;
						while (tween && tween._startTime === 0) {
							if (!tween._duration) {
								isComplete = false;
							}
							tween = tween._next;
						}
					}
					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
					if (!this._initted) {
						internalForce = true;
					}
				}

			} else {
				if (dur === 0 && prevRawPrevTime < 0) { //without this, zero-duration repeating timelines (like with a simple callback nested at the very beginning and a repeatDelay) wouldn't render the first time through.
					internalForce = true;
				}
				this._time = this._rawPrevTime = time;
				if (!this._locked) {
					this._totalTime = time;
					if (this._repeat !== 0) {
						cycleDuration = dur + this._repeatDelay;
						this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
						if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration && prevTotalTime <= time) {
							this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
						}
						this._time = this._totalTime - (this._cycle * cycleDuration);
						if (this._yoyo) if ((this._cycle & 1) !== 0) {
							this._time = dur - this._time;
						}
						if (this._time > dur) {
							this._time = dur;
							time = dur + 0.0001; //to avoid occasional floating point rounding error
						} else if (this._time < 0) {
							this._time = time = 0;
						} else {
							time = this._time;
						}
					}
				}

				if (this._hasPause && !this._forcingPlayhead && !suppressEvents) {
					time = this._time;
					if (time >= prevTime) {
						tween = this._first;
						while (tween && tween._startTime <= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && this._rawPrevTime === 0)) {
								pauseTween = tween;
							}
							tween = tween._next;
						}
					} else {
						tween = this._last;
						while (tween && tween._startTime >= time && !pauseTween) {
							if (!tween._duration) if (tween.data === "isPause" && tween._rawPrevTime > 0) {
								pauseTween = tween;
							}
							tween = tween._prev;
						}
					}
					if (pauseTween) {
						this._time = time = pauseTween._startTime;
						this._totalTime = time + (this._cycle * (this._totalDuration + this._repeatDelay));
					}
				}

			}

			if (this._cycle !== prevCycle) if (!this._locked) {
				/*
				make sure children at the end/beginning of the timeline are rendered properly. If, for example,
				a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
				would get transated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
				could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
				we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
				ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
				*/
				var backwards = (this._yoyo && (prevCycle & 1) !== 0),
					wrap = (backwards === (this._yoyo && (this._cycle & 1) !== 0)),
					recTotalTime = this._totalTime,
					recCycle = this._cycle,
					recRawPrevTime = this._rawPrevTime,
					recTime = this._time;

				this._totalTime = prevCycle * dur;
				if (this._cycle < prevCycle) {
					backwards = !backwards;
				} else {
					this._totalTime += dur;
				}
				this._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.

				this._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
				this._cycle = prevCycle;
				this._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
				prevTime = (backwards) ? 0 : dur;
				this.render(prevTime, suppressEvents, (dur === 0));
				if (!suppressEvents) if (!this._gc) {
					if (this.vars.onRepeat) {
						this._callback("onRepeat");
					}
				}
				if (prevTime !== this._time) { //in case there's a callback like onComplete in a nested tween/timeline that changes the playhead position, like via seek(), we should just abort.
					return;
				}
				if (wrap) {
					prevTime = (backwards) ? dur + 0.0001 : -0.0001;
					this.render(prevTime, true, false);
				}
				this._locked = false;
				if (this._paused && !prevPaused) { //if the render() triggered callback that paused this timeline, we should abort (very rare, but possible)
					return;
				}
				this._time = recTime;
				this._totalTime = recTotalTime;
				this._cycle = recCycle;
				this._rawPrevTime = recRawPrevTime;
			}

			if ((this._time === prevTime || !this._first) && !force && !internalForce && !pauseTween) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._callback("onUpdate");
				}
				return;
			} else if (!this._initted) {
				this._initted = true;
			}

			if (!this._active) if (!this._paused && this._totalTime !== prevTotalTime && time > 0) {
				this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
			}

			if (prevTotalTime === 0) if (this.vars.onStart) if (this._totalTime !== 0 || !this._totalDuration) if (!suppressEvents) {
				this._callback("onStart");
			}

			curTime = this._time;
			if (curTime >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (curTime !== this._time || (this._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						if (pauseTween === tween) {
							pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
							while (pauseTween && pauseTween.endTime() > this._time) {
								pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
								pauseTween = pauseTween._prev;
							}
							pauseTween = null;
							this.pause();
						}
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				this._callback("onUpdate");
			}
			if (callback) if (!this._locked) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
			}
		};

		p.getActive = function(nested, tweens, timelines) {
			if (nested == null) {
				nested = true;
			}
			if (tweens == null) {
				tweens = true;
			}
			if (timelines == null) {
				timelines = false;
			}
			var a = [],
				all = this.getChildren(nested, tweens, timelines),
				cnt = 0,
				l = all.length,
				i, tween;
			for (i = 0; i < l; i++) {
				tween = all[i];
				if (tween.isActive()) {
					a[cnt++] = tween;
				}
			}
			return a;
		};


		p.getLabelAfter = function(time) {
			if (!time) if (time !== 0) { //faster than isNan()
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				l = labels.length,
				i;
			for (i = 0; i < l; i++) {
				if (labels[i].time > time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelBefore = function(time) {
			if (time == null) {
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				i = labels.length;
			while (--i > -1) {
				if (labels[i].time < time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelsArray = function() {
			var a = [],
				cnt = 0,
				p;
			for (p in this._labels) {
				a[cnt++] = {time:this._labels[p], name:p};
			}
			a.sort(function(a,b) {
				return a.time - b.time;
			});
			return a;
		};


//---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------

		p.progress = function(value, suppressEvents) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
		};

		p.totalProgress = function(value, suppressEvents) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, suppressEvents);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					TimelineLite.prototype.totalDuration.call(this); //just forces refresh
					//Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
				}
				return this._totalDuration;
			}
			return (this._repeat === -1 || !value) ? this : this.timeScale( this.totalDuration() / value );
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};

		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};

		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};

		p.currentLabel = function(value) {
			if (!arguments.length) {
				return this.getLabelBefore(this._time + 0.00000001);
			}
			return this.seek(value, true);
		};

		return TimelineMax;

	}, true);
	




	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * BezierPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var _RAD2DEG = 180 / Math.PI,
			_r1 = [],
			_r2 = [],
			_r3 = [],
			_corProps = {},
			_globals = _gsScope._gsDefine.globals,
			Segment = function(a, b, c, d) {
				if (c === d) { //if c and d match, the final autoRotate value could lock at -90 degrees, so differentiate them slightly.
					c = d - (d - b) / 1000000;
				}
				if (a === b) { //if a and b match, the starting autoRotate value could lock at -90 degrees, so differentiate them slightly.
					b = a + (c - a) / 1000000;
				}
				this.a = a;
				this.b = b;
				this.c = c;
				this.d = d;
				this.da = d - a;
				this.ca = c - a;
				this.ba = b - a;
			},
			_correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
			cubicToQuadratic = function(a, b, c, d) {
				var q1 = {a:a},
					q2 = {},
					q3 = {},
					q4 = {c:d},
					mab = (a + b) / 2,
					mbc = (b + c) / 2,
					mcd = (c + d) / 2,
					mabc = (mab + mbc) / 2,
					mbcd = (mbc + mcd) / 2,
					m8 = (mbcd - mabc) / 8;
				q1.b = mab + (a - mab) / 4;
				q2.b = mabc + m8;
				q1.c = q2.a = (q1.b + q2.b) / 2;
				q2.c = q3.a = (mabc + mbcd) / 2;
				q3.b = mbcd - m8;
				q4.b = mcd + (d - mcd) / 4;
				q3.c = q4.a = (q3.b + q4.b) / 2;
				return [q1, q2, q3, q4];
			},
			_calculateControlPoints = function(a, curviness, quad, basic, correlate) {
				var l = a.length - 1,
					ii = 0,
					cp1 = a[0].a,
					i, p1, p2, p3, seg, m1, m2, mm, cp2, qb, r1, r2, tl;
				for (i = 0; i < l; i++) {
					seg = a[ii];
					p1 = seg.a;
					p2 = seg.d;
					p3 = a[ii+1].d;

					if (correlate) {
						r1 = _r1[i];
						r2 = _r2[i];
						tl = ((r2 + r1) * curviness * 0.25) / (basic ? 0.5 : _r3[i] || 0.5);
						m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : (r1 !== 0 ? tl / r1 : 0));
						m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : (r2 !== 0 ? tl / r2 : 0));
						mm = p2 - (m1 + (((m2 - m1) * ((r1 * 3 / (r1 + r2)) + 0.5) / 4) || 0));
					} else {
						m1 = p2 - (p2 - p1) * curviness * 0.5;
						m2 = p2 + (p3 - p2) * curviness * 0.5;
						mm = p2 - (m1 + m2) / 2;
					}
					m1 += mm;
					m2 += mm;

					seg.c = cp2 = m1;
					if (i !== 0) {
						seg.b = cp1;
					} else {
						seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6; //instead of placing b on a exactly, we move it inline with c so that if the user specifies an ease like Back.easeIn or Elastic.easeIn which goes BEYOND the beginning, it will do so smoothly.
					}

					seg.da = p2 - p1;
					seg.ca = cp2 - p1;
					seg.ba = cp1 - p1;

					if (quad) {
						qb = cubicToQuadratic(p1, cp1, cp2, p2);
						a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
						ii += 4;
					} else {
						ii++;
					}

					cp1 = m2;
				}
				seg = a[ii];
				seg.b = cp1;
				seg.c = cp1 + (seg.d - cp1) * 0.4; //instead of placing c on d exactly, we move it inline with b so that if the user specifies an ease like Back.easeOut or Elastic.easeOut which goes BEYOND the end, it will do so smoothly.
				seg.da = seg.d - seg.a;
				seg.ca = seg.c - seg.a;
				seg.ba = cp1 - seg.a;
				if (quad) {
					qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
					a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
				}
			},
			_parseAnchors = function(values, p, correlate, prepend) {
				var a = [],
					l, i, p1, p2, p3, tmp;
				if (prepend) {
					values = [prepend].concat(values);
					i = values.length;
					while (--i > -1) {
						if (typeof( (tmp = values[i][p]) ) === "string") if (tmp.charAt(1) === "=") {
							values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)); //accommodate relative values. Do it inline instead of breaking it out into a function for speed reasons
						}
					}
				}
				l = values.length - 2;
				if (l < 0) {
					a[0] = new Segment(values[0][p], 0, 0, values[(l < -1) ? 0 : 1][p]);
					return a;
				}
				for (i = 0; i < l; i++) {
					p1 = values[i][p];
					p2 = values[i+1][p];
					a[i] = new Segment(p1, 0, 0, p2);
					if (correlate) {
						p3 = values[i+2][p];
						_r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
						_r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
					}
				}
				a[i] = new Segment(values[i][p], 0, 0, values[i+1][p]);
				return a;
			},
			bezierThrough = function(values, curviness, quadratic, basic, correlate, prepend) {
				var obj = {},
					props = [],
					first = prepend || values[0],
					i, p, a, j, r, l, seamless, last;
				correlate = (typeof(correlate) === "string") ? ","+correlate+"," : _correlate;
				if (curviness == null) {
					curviness = 1;
				}
				for (p in values[0]) {
					props.push(p);
				}
				//check to see if the last and first values are identical (well, within 0.05). If so, make seamless by appending the second element to the very end of the values array and the 2nd-to-last element to the very beginning (we'll remove those segments later)
				if (values.length > 1) {
					last = values[values.length - 1];
					seamless = true;
					i = props.length;
					while (--i > -1) {
						p = props[i];
						if (Math.abs(first[p] - last[p]) > 0.05) { //build in a tolerance of +/-0.05 to accommodate rounding errors.
							seamless = false;
							break;
						}
					}
					if (seamless) {
						values = values.concat(); //duplicate the array to avoid contaminating the original which the user may be reusing for other tweens
						if (prepend) {
							values.unshift(prepend);
						}
						values.push(values[1]);
						prepend = values[values.length - 3];
					}
				}
				_r1.length = _r2.length = _r3.length = 0;
				i = props.length;
				while (--i > -1) {
					p = props[i];
					_corProps[p] = (correlate.indexOf(","+p+",") !== -1);
					obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
				}
				i = _r1.length;
				while (--i > -1) {
					_r1[i] = Math.sqrt(_r1[i]);
					_r2[i] = Math.sqrt(_r2[i]);
				}
				if (!basic) {
					i = props.length;
					while (--i > -1) {
						if (_corProps[p]) {
							a = obj[props[i]];
							l = a.length - 1;
							for (j = 0; j < l; j++) {
								r = (a[j+1].da / _r2[j] + a[j].da / _r1[j]) || 0;
								_r3[j] = (_r3[j] || 0) + r * r;
							}
						}
					}
					i = _r3.length;
					while (--i > -1) {
						_r3[i] = Math.sqrt(_r3[i]);
					}
				}
				i = props.length;
				j = quadratic ? 4 : 1;
				while (--i > -1) {
					p = props[i];
					a = obj[p];
					_calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]); //this method requires that _parseAnchors() and _setSegmentRatios() ran first so that _r1, _r2, and _r3 values are populated for all properties
					if (seamless) {
						a.splice(0, j);
						a.splice(a.length - j, j);
					}
				}
				return obj;
			},
			_parseBezierData = function(values, type, prepend) {
				type = type || "soft";
				var obj = {},
					inc = (type === "cubic") ? 3 : 2,
					soft = (type === "soft"),
					props = [],
					a, b, c, d, cur, i, j, l, p, cnt, tmp;
				if (soft && prepend) {
					values = [prepend].concat(values);
				}
				if (values == null || values.length < inc + 1) { throw "invalid Bezier data"; }
				for (p in values[0]) {
					props.push(p);
				}
				i = props.length;
				while (--i > -1) {
					p = props[i];
					obj[p] = cur = [];
					cnt = 0;
					l = values.length;
					for (j = 0; j < l; j++) {
						a = (prepend == null) ? values[j][p] : (typeof( (tmp = values[j][p]) ) === "string" && tmp.charAt(1) === "=") ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
						if (soft) if (j > 1) if (j < l - 1) {
							cur[cnt++] = (a + cur[cnt-2]) / 2;
						}
						cur[cnt++] = a;
					}
					l = cnt - inc + 1;
					cnt = 0;
					for (j = 0; j < l; j += inc) {
						a = cur[j];
						b = cur[j+1];
						c = cur[j+2];
						d = (inc === 2) ? 0 : cur[j+3];
						cur[cnt++] = tmp = (inc === 3) ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
					}
					cur.length = cnt;
				}
				return obj;
			},
			_addCubicLengths = function(a, steps, resolution) {
				var inc = 1 / resolution,
					j = a.length,
					d, d1, s, da, ca, ba, p, i, inv, bez, index;
				while (--j > -1) {
					bez = a[j];
					s = bez.a;
					da = bez.d - s;
					ca = bez.c - s;
					ba = bez.b - s;
					d = d1 = 0;
					for (i = 1; i <= resolution; i++) {
						p = inc * i;
						inv = 1 - p;
						d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
						index = j * resolution + i - 1;
						steps[index] = (steps[index] || 0) + d * d;
					}
				}
			},
			_parseLengthData = function(obj, resolution) {
				resolution = resolution >> 0 || 6;
				var a = [],
					lengths = [],
					d = 0,
					total = 0,
					threshold = resolution - 1,
					segments = [],
					curLS = [], //current length segments array
					p, i, l, index;
				for (p in obj) {
					_addCubicLengths(obj[p], a, resolution);
				}
				l = a.length;
				for (i = 0; i < l; i++) {
					d += Math.sqrt(a[i]);
					index = i % resolution;
					curLS[index] = d;
					if (index === threshold) {
						total += d;
						index = (i / resolution) >> 0;
						segments[index] = curLS;
						lengths[index] = total;
						d = 0;
						curLS = [];
					}
				}
				return {length:total, lengths:lengths, segments:segments};
			},



			BezierPlugin = _gsScope._gsDefine.plugin({
					propName: "bezier",
					priority: -1,
					version: "1.3.7",
					API: 2,
					global:true,

					//gets called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
					init: function(target, vars, tween) {
						this._target = target;
						if (vars instanceof Array) {
							vars = {values:vars};
						}
						this._func = {};
						this._mod = {};
						this._props = [];
						this._timeRes = (vars.timeResolution == null) ? 6 : parseInt(vars.timeResolution, 10);
						var values = vars.values || [],
							first = {},
							second = values[0],
							autoRotate = vars.autoRotate || tween.vars.orientToBezier,
							p, isFunc, i, j, prepend;

						this._autoRotate = autoRotate ? (autoRotate instanceof Array) ? autoRotate : [["x","y","rotation",((autoRotate === true) ? 0 : Number(autoRotate) || 0)]] : null;
						for (p in second) {
							this._props.push(p);
						}

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];

							this._overwriteProps.push(p);
							isFunc = this._func[p] = (typeof(target[p]) === "function");
							first[p] = (!isFunc) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
							if (!prepend) if (first[p] !== values[0][p]) {
								prepend = first;
							}
						}
						this._beziers = (vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft") ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, (vars.type === "thruBasic"), vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
						this._segCount = this._beziers[p].length;

						if (this._timeRes) {
							var ld = _parseLengthData(this._beziers, this._timeRes);
							this._length = ld.length;
							this._lengths = ld.lengths;
							this._segments = ld.segments;
							this._l1 = this._li = this._s1 = this._si = 0;
							this._l2 = this._lengths[0];
							this._curSeg = this._segments[0];
							this._s2 = this._curSeg[0];
							this._prec = 1 / this._curSeg.length;
						}

						if ((autoRotate = this._autoRotate)) {
							this._initialRotations = [];
							if (!(autoRotate[0] instanceof Array)) {
								this._autoRotate = autoRotate = [autoRotate];
							}
							i = autoRotate.length;
							while (--i > -1) {
								for (j = 0; j < 3; j++) {
									p = autoRotate[i][j];
									this._func[p] = (typeof(target[p]) === "function") ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ] : false;
								}
								p = autoRotate[i][2];
								this._initialRotations[i] = (this._func[p] ? this._func[p].call(this._target) : this._target[p]) || 0;
								this._overwriteProps.push(p);
							}
						}
						this._startRatio = tween.vars.runBackwards ? 1 : 0; //we determine the starting ratio when the tween inits which is always 0 unless the tween has runBackwards:true (indicating it's a from() tween) in which case it's 1.
						return true;
					},

					//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
					set: function(v) {
						var segments = this._segCount,
							func = this._func,
							target = this._target,
							notStart = (v !== this._startRatio),
							curIndex, inv, i, p, b, t, val, l, lengths, curSeg;
						if (!this._timeRes) {
							curIndex = (v < 0) ? 0 : (v >= 1) ? segments - 1 : (segments * v) >> 0;
							t = (v - (curIndex * (1 / segments))) * segments;
						} else {
							lengths = this._lengths;
							curSeg = this._curSeg;
							v *= this._length;
							i = this._li;
							//find the appropriate segment (if the currently cached one isn't correct)
							if (v > this._l2 && i < segments - 1) {
								l = segments - 1;
								while (i < l && (this._l2 = lengths[++i]) <= v) {	}
								this._l1 = lengths[i-1];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s2 = curSeg[(this._s1 = this._si = 0)];
							} else if (v < this._l1 && i > 0) {
								while (i > 0 && (this._l1 = lengths[--i]) >= v) { }
								if (i === 0 && v < this._l1) {
									this._l1 = 0;
								} else {
									i++;
								}
								this._l2 = lengths[i];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
								this._s2 = curSeg[this._si];
							}
							curIndex = i;
							//now find the appropriate sub-segment (we split it into the number of pieces that was defined by "precision" and measured each one)
							v -= this._l1;
							i = this._si;
							if (v > this._s2 && i < curSeg.length - 1) {
								l = curSeg.length - 1;
								while (i < l && (this._s2 = curSeg[++i]) <= v) {	}
								this._s1 = curSeg[i-1];
								this._si = i;
							} else if (v < this._s1 && i > 0) {
								while (i > 0 && (this._s1 = curSeg[--i]) >= v) {	}
								if (i === 0 && v < this._s1) {
									this._s1 = 0;
								} else {
									i++;
								}
								this._s2 = curSeg[i];
								this._si = i;
							}
							t = ((i + (v - this._s1) / (this._s2 - this._s1)) * this._prec) || 0;
						}
						inv = 1 - t;

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];
							b = this._beziers[p][curIndex];
							val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
							if (this._mod[p]) {
								val = this._mod[p](val, target);
							}
							if (func[p]) {
								target[p](val);
							} else {
								target[p] = val;
							}
						}

						if (this._autoRotate) {
							var ar = this._autoRotate,
								b2, x1, y1, x2, y2, add, conv;
							i = ar.length;
							while (--i > -1) {
								p = ar[i][2];
								add = ar[i][3] || 0;
								conv = (ar[i][4] === true) ? 1 : _RAD2DEG;
								b = this._beziers[ar[i][0]];
								b2 = this._beziers[ar[i][1]];

								if (b && b2) { //in case one of the properties got overwritten.
									b = b[curIndex];
									b2 = b2[curIndex];

									x1 = b.a + (b.b - b.a) * t;
									x2 = b.b + (b.c - b.b) * t;
									x1 += (x2 - x1) * t;
									x2 += ((b.c + (b.d - b.c) * t) - x2) * t;

									y1 = b2.a + (b2.b - b2.a) * t;
									y2 = b2.b + (b2.c - b2.b) * t;
									y1 += (y2 - y1) * t;
									y2 += ((b2.c + (b2.d - b2.c) * t) - y2) * t;

									val = notStart ? Math.atan2(y2 - y1, x2 - x1) * conv + add : this._initialRotations[i];

									if (this._mod[p]) {
										val = this._mod[p](val, target); //for modProps
									}

									if (func[p]) {
										target[p](val);
									} else {
										target[p] = val;
									}
								}
							}
						}
					}
			}),
			p = BezierPlugin.prototype;


		BezierPlugin.bezierThrough = bezierThrough;
		BezierPlugin.cubicToQuadratic = cubicToQuadratic;
		BezierPlugin._autoCSS = true; //indicates that this plugin can be inserted into the "css" object using the autoCSS feature of TweenLite
		BezierPlugin.quadraticToCubic = function(a, b, c) {
			return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
		};

		BezierPlugin._cssRegister = function() {
			var CSSPlugin = _globals.CSSPlugin;
			if (!CSSPlugin) {
				return;
			}
			var _internals = CSSPlugin._internals,
				_parseToProxy = _internals._parseToProxy,
				_setPluginRatio = _internals._setPluginRatio,
				CSSPropTween = _internals.CSSPropTween;
			_internals._registerComplexSpecialProp("bezier", {parser:function(t, e, prop, cssp, pt, plugin) {
				if (e instanceof Array) {
					e = {values:e};
				}
				plugin = new BezierPlugin();
				var values = e.values,
					l = values.length - 1,
					pluginValues = [],
					v = {},
					i, p, data;
				if (l < 0) {
					return pt;
				}
				for (i = 0; i <= l; i++) {
					data = _parseToProxy(t, values[i], cssp, pt, plugin, (l !== i));
					pluginValues[i] = data.end;
				}
				for (p in e) {
					v[p] = e[p]; //duplicate the vars object because we need to alter some things which would cause problems if the user plans to reuse the same vars object for another tween.
				}
				v.values = pluginValues;
				pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
				pt.data = data;
				pt.plugin = plugin;
				pt.setRatio = _setPluginRatio;
				if (v.autoRotate === 0) {
					v.autoRotate = true;
				}
				if (v.autoRotate && !(v.autoRotate instanceof Array)) {
					i = (v.autoRotate === true) ? 0 : Number(v.autoRotate);
					v.autoRotate = (data.end.left != null) ? [["left","top","rotation",i,false]] : (data.end.x != null) ? [["x","y","rotation",i,false]] : false;
				}
				if (v.autoRotate) {
					if (!cssp._transform) {
						cssp._enableTransforms(false);
					}
					data.autoRotate = cssp._target._gsTransform;
					data.proxy.rotation = data.autoRotate.rotation || 0;
					cssp._overwriteProps.push("rotation");
				}
				plugin._onInitTween(data.proxy, v, cssp._tween);
				return pt;
			}});
		};

		p._mod = function(lookup) {
			var op = this._overwriteProps,
				i = op.length,
				val;
			while (--i > -1) {
				val = lookup[op[i]];
				if (val && typeof(val) === "function") {
					this._mod[op[i]] = val;
				}
			}
		};

		p._kill = function(lookup) {
			var a = this._props,
				p, i;
			for (p in this._beziers) {
				if (p in lookup) {
					delete this._beziers[p];
					delete this._func[p];
					i = a.length;
					while (--i > -1) {
						if (a[i] === p) {
							a.splice(i, 1);
						}
					}
				}
			}
			a = this._autoRotate;
			if (a) {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i][2]]) {
						a.splice(i, 1);
					}
				}
			}
			return this._super._kill.call(this, lookup);
		};

	}());






	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * CSSPlugin
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin","TweenLite"], function(TweenPlugin, TweenLite) {

		/** @constructor **/
		var CSSPlugin = function() {
				TweenPlugin.call(this, "css");
				this._overwriteProps.length = 0;
				this.setRatio = CSSPlugin.prototype.setRatio; //speed optimization (avoid prototype lookup on this "hot" method)
			},
			_globals = _gsScope._gsDefine.globals,
			_hasPriority, //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
			_suffixMap, //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
			_cs, //computed style (we store this in a shared variable to conserve memory and make minification tighter
			_overwriteProps, //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
			_specialProps = {},
			p = CSSPlugin.prototype = new TweenPlugin("css");

		p.constructor = CSSPlugin;
		CSSPlugin.version = "1.19.0";
		CSSPlugin.API = 2;
		CSSPlugin.defaultTransformPerspective = 0;
		CSSPlugin.defaultSkewType = "compensated";
		CSSPlugin.defaultSmoothOrigin = true;
		p = "px"; //we'll reuse the "p" variable to keep file size down
		CSSPlugin.suffixMap = {top:p, right:p, bottom:p, left:p, width:p, height:p, fontSize:p, padding:p, margin:p, perspective:p, lineHeight:""};


		var _numExp = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
			_relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
			_valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
			_NaNExp = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, //also allows scientific notation and doesn't kill the leading -/+ in -= and +=
			_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
			_opacityExp = /opacity *= *([^)]*)/i,
			_opacityValExp = /opacity:([^;]*)/i,
			_alphaFilterExp = /alpha\(opacity *=.+?\)/i,
			_rgbhslExp = /^(rgb|hsl)/,
			_capsExp = /([A-Z])/g,
			_camelExp = /-([a-z])/gi,
			_urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
			_camelFunc = function(s, g) { return g.toUpperCase(); },
			_horizExp = /(?:Left|Right|Width)/i,
			_ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
			_ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
			_commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi, //finds any commas that are not within parenthesis
			_complexExp = /[\s,\(]/i, //for testing a string to find if it has a space, comma, or open parenthesis (clues that it's a complex value)
			_DEG2RAD = Math.PI / 180,
			_RAD2DEG = 180 / Math.PI,
			_forcePT = {},
			_doc = document,
			_createElement = function(type) {
				return _doc.createElementNS ? _doc.createElementNS("http://www.w3.org/1999/xhtml", type) : _doc.createElement(type);
			},
			_tempDiv = _createElement("div"),
			_tempImg = _createElement("img"),
			_internals = CSSPlugin._internals = {_specialProps:_specialProps}, //provides a hook to a few internal methods that we need to access from inside other plugins
			_agent = navigator.userAgent,
			_autoRound,
			_reqSafariFix, //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).

			_isSafari,
			_isFirefox, //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
			_isSafariLT6, //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
			_ieVers,
			_supportsOpacity = (function() { //we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
				var i = _agent.indexOf("Android"),
					a = _createElement("a");
				_isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || Number(_agent.substr(i+8, 1)) > 3));
				_isSafariLT6 = (_isSafari && (Number(_agent.substr(_agent.indexOf("Version/")+8, 1)) < 6));
				_isFirefox = (_agent.indexOf("Firefox") !== -1);
				if ((/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent) || (/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/).exec(_agent)) {
					_ieVers = parseFloat( RegExp.$1 );
				}
				if (!a) {
					return false;
				}
				a.style.cssText = "top:1px;opacity:.55;";
				return /^0.55/.test(a.style.opacity);
			}()),
			_getIEOpacity = function(v) {
				return (_opacityExp.test( ((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ) ? ( parseFloat( RegExp.$1 ) / 100 ) : 1);
			},
			_log = function(s) {//for logging messages, but in a way that won't throw errors in old versions of IE.
				if (window.console) {
					console.log(s);
				}
			},
			_target, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params
			_index, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params

			_prefixCSS = "", //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
			_prefix = "", //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".

			// @private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
			_checkPropPrefix = function(p, e) {
				e = e || _tempDiv;
				var s = e.style,
					a, i;
				if (s[p] !== undefined) {
					return p;
				}
				p = p.charAt(0).toUpperCase() + p.substr(1);
				a = ["O","Moz","ms","Ms","Webkit"];
				i = 5;
				while (--i > -1 && s[a[i]+p] === undefined) { }
				if (i >= 0) {
					_prefix = (i === 3) ? "ms" : a[i];
					_prefixCSS = "-" + _prefix.toLowerCase() + "-";
					return _prefix + p;
				}
				return null;
			},

			_getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : function() {},

			/**
			 * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
			 * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
			 *
			 * @param {!Object} t Target element whose style property you want to query
			 * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
			 * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
			 * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
			 * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
			 * @return {?string} The current property value
			 */
			_getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
				var rv;
				if (!_supportsOpacity) if (p === "opacity") { //several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
					return _getIEOpacity(t);
				}
				if (!calc && t.style[p]) {
					rv = t.style[p];
				} else if ((cs = cs || _getComputedStyle(t))) {
					rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
				} else if (t.currentStyle) {
					rv = t.currentStyle[p];
				}
				return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
			},

			/**
			 * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
			 * @param {!Object} t Target element
			 * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
			 * @param {!number} v Value
			 * @param {string=} sfx Suffix (like "px" or "%" or "em")
			 * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
			 * @return {number} value in pixels
			 */
			_convertToPixels = _internals.convertToPixels = function(t, p, v, sfx, recurse) {
				if (sfx === "px" || !sfx) { return v; }
				if (sfx === "auto" || !v) { return 0; }
				var horiz = _horizExp.test(p),
					node = t,
					style = _tempDiv.style,
					neg = (v < 0),
					precise = (v === 1),
					pix, cache, time;
				if (neg) {
					v = -v;
				}
				if (precise) {
					v *= 100;
				}
				if (sfx === "%" && p.indexOf("border") !== -1) {
					pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
				} else {
					style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
					if (sfx === "%" || !node.appendChild || sfx.charAt(0) === "v" || sfx === "rem") {
						node = t.parentNode || _doc.body;
						cache = node._gsCache;
						time = TweenLite.ticker.frame;
						if (cache && horiz && cache.time === time) { //performance optimization: we record the width of elements along with the ticker frame so that we can quickly get it again on the same tick (seems relatively safe to assume it wouldn't change on the same tick)
							return cache.width * v / 100;
						}
						style[(horiz ? "width" : "height")] = v + sfx;
					} else {
						style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
					}
					node.appendChild(_tempDiv);
					pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
					node.removeChild(_tempDiv);
					if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
						cache = node._gsCache = node._gsCache || {};
						cache.time = time;
						cache.width = pix / v * 100;
					}
					if (pix === 0 && !recurse) {
						pix = _convertToPixels(t, p, v, sfx, true);
					}
				}
				if (precise) {
					pix /= 100;
				}
				return neg ? -pix : pix;
			},
			_calculateOffset = _internals.calculateOffset = function(t, p, cs) { //for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
				if (_getStyle(t, "position", cs) !== "absolute") { return 0; }
				var dim = ((p === "left") ? "Left" : "Top"),
					v = _getStyle(t, "margin" + dim, cs);
				return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
			},

			// @private returns at object containing ALL of the style properties in camelCase and their associated values.
			_getAllStyles = function(t, cs) {
				var s = {},
					i, tr, p;
				if ((cs = cs || _getComputedStyle(t, null))) {
					if ((i = cs.length)) {
						while (--i > -1) {
							p = cs[i];
							if (p.indexOf("-transform") === -1 || _transformPropCSS === p) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
								s[p.replace(_camelExp, _camelFunc)] = cs.getPropertyValue(p);
							}
						}
					} else { //some browsers behave differently - cs.length is always 0, so we must do a for...in loop.
						for (i in cs) {
							if (i.indexOf("Transform") === -1 || _transformProp === i) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
								s[i] = cs[i];
							}
						}
					}
				} else if ((cs = t.currentStyle || t.style)) {
					for (i in cs) {
						if (typeof(i) === "string" && s[i] === undefined) {
							s[i.replace(_camelExp, _camelFunc)] = cs[i];
						}
					}
				}
				if (!_supportsOpacity) {
					s.opacity = _getIEOpacity(t);
				}
				tr = _getTransform(t, cs, false);
				s.rotation = tr.rotation;
				s.skewX = tr.skewX;
				s.scaleX = tr.scaleX;
				s.scaleY = tr.scaleY;
				s.x = tr.x;
				s.y = tr.y;
				if (_supports3D) {
					s.z = tr.z;
					s.rotationX = tr.rotationX;
					s.rotationY = tr.rotationY;
					s.scaleZ = tr.scaleZ;
				}
				if (s.filters) {
					delete s.filters;
				}
				return s;
			},

			// @private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
			_cssDif = function(t, s1, s2, vars, forceLookup) {
				var difs = {},
					style = t.style,
					val, p, mpt;
				for (p in s2) {
					if (p !== "cssText") if (p !== "length") if (isNaN(p)) if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p])) if (p.indexOf("Origin") === -1) if (typeof(val) === "number" || typeof(val) === "string") {
						difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
						if (style[p] !== undefined) { //for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
							mpt = new MiniPropTween(style, p, style[p], mpt);
						}
					}
				}
				if (vars) {
					for (p in vars) { //copy properties (except className)
						if (p !== "className") {
							difs[p] = vars[p];
						}
					}
				}
				return {difs:difs, firstMPT:mpt};
			},
			_dimensions = {width:["Left","Right"], height:["Top","Bottom"]},
			_margins = ["marginLeft","marginRight","marginTop","marginBottom"],

			/**
			 * @private Gets the width or height of an element
			 * @param {!Object} t Target element
			 * @param {!string} p Property name ("width" or "height")
			 * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
			 * @return {number} Dimension (in pixels)
			 */
			_getDimension = function(t, p, cs) {
				if ((t.nodeName + "").toLowerCase() === "svg") { //Chrome no longer supports offsetWidth/offsetHeight on SVG elements.
					return (cs || _getComputedStyle(t))[p] || 0;
				} else if (t.getBBox && _isSVG(t)) {
					return t.getBBox()[p] || 0;
				}
				var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
					a = _dimensions[p],
					i = a.length;
				cs = cs || _getComputedStyle(t, null);
				while (--i > -1) {
					v -= parseFloat( _getStyle(t, "padding" + a[i], cs, true) ) || 0;
					v -= parseFloat( _getStyle(t, "border" + a[i] + "Width", cs, true) ) || 0;
				}
				return v;
			},

			// @private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
			_parsePosition = function(v, recObj) {
				if (v === "contain" || v === "auto" || v === "auto auto") { //note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
					return v + " ";
				}
				if (v == null || v === "") {
					v = "0 0";
				}
				var a = v.split(" "),
					x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
					y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1],
					i;
				if (a.length > 3 && !recObj) { //multiple positions
					a = v.split(", ").join(",").split(",");
					v = [];
					for (i = 0; i < a.length; i++) {
						v.push(_parsePosition(a[i]));
					}
					return v.join(",");
				}
				if (y == null) {
					y = (x === "center") ? "50%" : "0";
				} else if (y === "center") {
					y = "50%";
				}
				if (x === "center" || (isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1)) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
					x = "50%";
				}
				v = x + " " + y + ((a.length > 2) ? " " + a[2] : "");
				if (recObj) {
					recObj.oxp = (x.indexOf("%") !== -1);
					recObj.oyp = (y.indexOf("%") !== -1);
					recObj.oxr = (x.charAt(1) === "=");
					recObj.oyr = (y.charAt(1) === "=");
					recObj.ox = parseFloat(x.replace(_NaNExp, ""));
					recObj.oy = parseFloat(y.replace(_NaNExp, ""));
					recObj.v = v;
				}
				return recObj || v;
			},

			/**
			 * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
			 * @param {(number|string)} e End value which is typically a string, but could be a number
			 * @param {(number|string)} b Beginning value which is typically a string but could be a number
			 * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
			 */
			_parseChange = function(e, b) {
				if (typeof(e) === "function") {
					e = e(_index, _target);
				}
				return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : (parseFloat(e) - parseFloat(b)) || 0;
			},

			/**
			 * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @return {number} Parsed value
			 */
			_parseVal = function(v, d) {
				if (typeof(v) === "function") {
					v = v(_index, _target);
				}
				return (v == null) ? d : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) + d : parseFloat(v) || 0;
			},

			/**
			 * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
			 * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
			 * @return {number} parsed angle in radians
			 */
			_parseAngle = function(v, d, p, directionalEnd) {
				var min = 0.000001,
					cap, split, dif, result, isRelative;
				if (typeof(v) === "function") {
					v = v(_index, _target);
				}
				if (v == null) {
					result = d;
				} else if (typeof(v) === "number") {
					result = v;
				} else {
					cap = 360;
					split = v.split("_");
					isRelative = (v.charAt(1) === "=");
					dif = (isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(split[0].substr(2)) : parseFloat(split[0])) * ((v.indexOf("rad") === -1) ? 1 : _RAD2DEG) - (isRelative ? 0 : d);
					if (split.length) {
						if (directionalEnd) {
							directionalEnd[p] = d + dif;
						}
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					result = d + dif;
				}
				if (result < min && result > -min) {
					result = 0;
				}
				return result;
			},

			_colorLookup = {aqua:[0,255,255],
				lime:[0,255,0],
				silver:[192,192,192],
				black:[0,0,0],
				maroon:[128,0,0],
				teal:[0,128,128],
				blue:[0,0,255],
				navy:[0,0,128],
				white:[255,255,255],
				fuchsia:[255,0,255],
				olive:[128,128,0],
				yellow:[255,255,0],
				orange:[255,165,0],
				gray:[128,128,128],
				purple:[128,0,128],
				green:[0,128,0],
				red:[255,0,0],
				pink:[255,192,203],
				cyan:[0,255,255],
				transparent:[255,255,255,0]},

			_hue = function(h, m1, m2) {
				h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
				return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
			},

			/**
			 * @private Parses a color (like #9F0, #FF9900, rgb(255,51,153) or hsl(108, 50%, 10%)) into an array with 3 elements for red, green, and blue or if toHSL parameter is true, it will populate the array with hue, saturation, and lightness values. If a relative value is found in an hsl() or hsla() string, it will preserve those relative prefixes and all the values in the array will be strings instead of numbers (in all other cases it will be populated with numbers).
			 * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
			 * @param {(boolean)} toHSL If true, an hsl() or hsla() value will be returned instead of rgb() or rgba()
			 * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order, or if the toHSL parameter was true, the array will contain hue, saturation and lightness (and optionally alpha) in that order. Always numbers unless there's a relative prefix found in an hsl() or hsla() string and toHSL is true.
			 */
			_parseColor = CSSPlugin.parseColor = function(v, toHSL) {
				var a, r, g, b, h, s, l, max, min, d, wasHSL;
				if (!v) {
					a = _colorLookup.black;
				} else if (typeof(v) === "number") {
					a = [v >> 16, (v >> 8) & 255, v & 255];
				} else {
					if (v.charAt(v.length - 1) === ",") { //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
						v = v.substr(0, v.length - 1);
					}
					if (_colorLookup[v]) {
						a = _colorLookup[v];
					} else if (v.charAt(0) === "#") {
						if (v.length === 4) { //for shorthand like #9F0
							r = v.charAt(1);
							g = v.charAt(2);
							b = v.charAt(3);
							v = "#" + r + r + g + g + b + b;
						}
						v = parseInt(v.substr(1), 16);
						a = [v >> 16, (v >> 8) & 255, v & 255];
					} else if (v.substr(0, 3) === "hsl") {
						a = wasHSL = v.match(_numExp);
						if (!toHSL) {
							h = (Number(a[0]) % 360) / 360;
							s = Number(a[1]) / 100;
							l = Number(a[2]) / 100;
							g = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
							r = l * 2 - g;
							if (a.length > 3) {
								a[3] = Number(v[3]);
							}
							a[0] = _hue(h + 1 / 3, r, g);
							a[1] = _hue(h, r, g);
							a[2] = _hue(h - 1 / 3, r, g);
						} else if (v.indexOf("=") !== -1) { //if relative values are found, just return the raw strings with the relative prefixes in place.
							return v.match(_relNumExp);
						}
					} else {
						a = v.match(_numExp) || _colorLookup.transparent;
					}
					a[0] = Number(a[0]);
					a[1] = Number(a[1]);
					a[2] = Number(a[2]);
					if (a.length > 3) {
						a[3] = Number(a[3]);
					}
				}
				if (toHSL && !wasHSL) {
					r = a[0] / 255;
					g = a[1] / 255;
					b = a[2] / 255;
					max = Math.max(r, g, b);
					min = Math.min(r, g, b);
					l = (max + min) / 2;
					if (max === min) {
						h = s = 0;
					} else {
						d = max - min;
						s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
						h = (max === r) ? (g - b) / d + (g < b ? 6 : 0) : (max === g) ? (b - r) / d + 2 : (r - g) / d + 4;
						h *= 60;
					}
					a[0] = (h + 0.5) | 0;
					a[1] = (s * 100 + 0.5) | 0;
					a[2] = (l * 100 + 0.5) | 0;
				}
				return a;
			},
			_formatColors = function(s, toHSL) {
				var colors = s.match(_colorExp) || [],
					charIndex = 0,
					parsed = colors.length ? "" : s,
					i, color, temp;
				for (i = 0; i < colors.length; i++) {
					color = colors[i];
					temp = s.substr(charIndex, s.indexOf(color, charIndex)-charIndex);
					charIndex += temp.length + color.length;
					color = _parseColor(color, toHSL);
					if (color.length === 3) {
						color.push(1);
					}
					parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
				}
				return parsed + s.substr(charIndex);
			},
			_colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.

		for (p in _colorLookup) {
			_colorExp += "|" + p + "\\b";
		}
		_colorExp = new RegExp(_colorExp+")", "gi");

		CSSPlugin.colorStringFilter = function(a) {
			var combined = a[0] + a[1],
				toHSL;
			if (_colorExp.test(combined)) {
				toHSL = (combined.indexOf("hsl(") !== -1 || combined.indexOf("hsla(") !== -1);
				a[0] = _formatColors(a[0], toHSL);
				a[1] = _formatColors(a[1], toHSL);
			}
			_colorExp.lastIndex = 0;
		};

		if (!TweenLite.defaultStringFilter) {
			TweenLite.defaultStringFilter = CSSPlugin.colorStringFilter;
		}

		/**
		 * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
		 * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
		 * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
		 * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
		 * @return {Function} formatter function
		 */
		var _getFormatter = function(dflt, clr, collapsible, multi) {
				if (dflt == null) {
					return function(v) {return v;};
				}
				var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
					dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
					pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
					sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
					delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
					numVals = dVals.length,
					dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
					formatter;
				if (!numVals) {
					return function(v) {return v;};
				}
				if (clr) {
					formatter = function(v) {
						var color, vals, i, a;
						if (typeof(v) === "number") {
							v += dSfx;
						} else if (multi && _commasOutsideParenExp.test(v)) {
							a = v.replace(_commasOutsideParenExp, "|").split("|");
							for (i = 0; i < a.length; i++) {
								a[i] = formatter(a[i]);
							}
							return a.join(",");
						}
						color = (v.match(_colorExp) || [dColor])[0];
						vals = v.split(color).join("").match(_valuesExp) || [];
						i = vals.length;
						if (numVals > i--) {
							while (++i < numVals) {
								vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
							}
						}
						return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
					};
					return formatter;

				}
				formatter = function(v) {
					var vals, a, i;
					if (typeof(v) === "number") {
						v += dSfx;
					} else if (multi && _commasOutsideParenExp.test(v)) {
						a = v.replace(_commasOutsideParenExp, "|").split("|");
						for (i = 0; i < a.length; i++) {
							a[i] = formatter(a[i]);
						}
						return a.join(",");
					}
					vals = v.match(_valuesExp) || [];
					i = vals.length;
					if (numVals > i--) {
						while (++i < numVals) {
							vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
						}
					}
					return pfx + vals.join(delim) + sfx;
				};
				return formatter;
			},

			/**
			 * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
			 * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
			 * @return {Function} a formatter function
			 */
			_getEdgeParser = function(props) {
				props = props.split(",");
				return function(t, e, p, cssp, pt, plugin, vars) {
					var a = (e + "").split(" "),
						i;
					vars = {};
					for (i = 0; i < 4; i++) {
						vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
					}
					return cssp.parse(t, vars, pt, plugin);
				};
			},

			// @private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
			_setPluginRatio = _internals._setPluginRatio = function(v) {
				this.plugin.setRatio(v);
				var d = this.data,
					proxy = d.proxy,
					mpt = d.firstMPT,
					min = 0.000001,
					val, pt, i, str, p;
				while (mpt) {
					val = proxy[mpt.v];
					if (mpt.r) {
						val = Math.round(val);
					} else if (val < min && val > -min) {
						val = 0;
					}
					mpt.t[mpt.p] = val;
					mpt = mpt._next;
				}
				if (d.autoRotate) {
					d.autoRotate.rotation = d.mod ? d.mod(proxy.rotation, this.t) : proxy.rotation; //special case for ModifyPlugin to hook into an auto-rotating bezier
				}
				//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method. Same for "b" at the beginning.
				if (v === 1 || v === 0) {
					mpt = d.firstMPT;
					p = (v === 1) ? "e" : "b";
					while (mpt) {
						pt = mpt.t;
						if (!pt.type) {
							pt[p] = pt.s + pt.xs0;
						} else if (pt.type === 1) {
							str = pt.xs0 + pt.s + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt[p] = str;
						}
						mpt = mpt._next;
					}
				}
			},

			/**
			 * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
			 * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
			 * @param {!string} p property name
			 * @param {(number|string|object)} v value
			 * @param {MiniPropTween=} next next MiniPropTween in the linked list
			 * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
			 */
			MiniPropTween = function(t, p, v, next, r) {
				this.t = t;
				this.p = p;
				this.v = v;
				this.r = r;
				if (next) {
					next._prev = this;
					this._next = next;
				}
			},

			/**
			 * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
			 * This method returns an object that has the following properties:
			 *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
			 *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
			 *  - firstMPT: the first MiniPropTween in the linked list
			 *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
			 * @param {!Object} t target object to be tweened
			 * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
			 * @param {!CSSPlugin} cssp The CSSPlugin instance
			 * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
			 * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
			 * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
			 * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
			 */
			_parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
				var bpt = pt,
					start = {},
					end = {},
					transform = cssp._transform,
					oldForce = _forcePT,
					i, p, xp, mpt, firstPT;
				cssp._transform = null;
				_forcePT = vars;
				pt = firstPT = cssp.parse(t, vars, pt, plugin);
				_forcePT = oldForce;
				//break off from the linked list so the new ones are isolated.
				if (shallow) {
					cssp._transform = transform;
					if (bpt) {
						bpt._prev = null;
						if (bpt._prev) {
							bpt._prev._next = null;
						}
					}
				}
				while (pt && pt !== bpt) {
					if (pt.type <= 1) {
						p = pt.p;
						end[p] = pt.s + pt.c;
						start[p] = pt.s;
						if (!shallow) {
							mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
							pt.c = 0;
						}
						if (pt.type === 1) {
							i = pt.l;
							while (--i > 0) {
								xp = "xn" + i;
								p = pt.p + "_" + xp;
								end[p] = pt.data[xp];
								start[p] = pt[xp];
								if (!shallow) {
									mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
								}
							}
						}
					}
					pt = pt._next;
				}
				return {proxy:start, end:end, firstMPT:mpt, pt:firstPT};
			},



			/**
			 * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
			 * CSSPropTweens have the following optional properties as well (not defined through the constructor):
			 *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
			 *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
			 *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
			 *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
			 *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
			 * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
			 * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
			 * @param {number} s Starting numeric value
			 * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
			 * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
			 * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
			 * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
			 * @param {boolean=} r If true, the value(s) should be rounded
			 * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
			 * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
			 * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
			 */
			CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
				this.t = t; //target
				this.p = p; //property
				this.s = s; //starting value
				this.c = c; //change value
				this.n = n || p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
				if (!(t instanceof CSSPropTween)) {
					_overwriteProps.push(this.n);
				}
				this.r = r; //round (boolean)
				this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
				if (pr) {
					this.pr = pr;
					_hasPriority = true;
				}
				this.b = (b === undefined) ? s : b;
				this.e = (e === undefined) ? s + c : e;
				if (next) {
					this._next = next;
					next._prev = this;
				}
			},

			_addNonTweeningNumericPT = function(target, prop, start, end, next, overwriteProp) { //cleans up some code redundancies and helps minification. Just a fast way to add a NUMERIC non-tweening CSSPropTween
				var pt = new CSSPropTween(target, prop, start, end - start, next, -1, overwriteProp);
				pt.b = start;
				pt.e = pt.xs0 = end;
				return pt;
			},

			/**
			 * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
			 * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
			 * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
			 * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
			 *
			 * @param {!Object} t Target whose property will be tweened
			 * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
			 * @param {string} b Beginning value
			 * @param {string} e Ending value
			 * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
			 * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
			 * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
			 * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
			 * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
			 * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
			 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
			 */
			_parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
				//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
				b = b || dflt || "";
				if (typeof(e) === "function") {
					e = e(_index, _target);
				}
				pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
				e += ""; //ensures it's a string
				if (clrs && _colorExp.test(e + b)) { //if colors are found, normalize the formatting to rgba() or hsla().
					e = [b, e];
					CSSPlugin.colorStringFilter(e);
					b = e[0];
					e = e[1];
				}
				var ba = b.split(", ").join(",").split(" "), //beginning array
					ea = e.split(", ").join(",").split(" "), //ending array
					l = ba.length,
					autoRound = (_autoRound !== false),
					i, xi, ni, bv, ev, bnums, enums, bn, hasAlpha, temp, cv, str, useHSL;
				if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
					ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					l = ba.length;
				}
				if (l !== ea.length) {
					//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
					ba = (dflt || "").split(" ");
					l = ba.length;
				}
				pt.plugin = plugin;
				pt.setRatio = setRatio;
				_colorExp.lastIndex = 0;
				for (i = 0; i < l; i++) {
					bv = ba[i];
					ev = ea[i];
					bn = parseFloat(bv);
					//if the value begins with a number (most common). It's fine if it has a suffix like px
					if (bn || bn === 0) {
						pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1), true);

					//if the value is a color
					} else if (clrs && _colorExp.test(bv)) {
						str = ev.indexOf(")") + 1;
						str = ")" + (str ? ev.substr(str) : ""); //if there's a comma or ) at the end, retain it.
						useHSL = (ev.indexOf("hsl") !== -1 && _supportsOpacity);
						bv = _parseColor(bv, useHSL);
						ev = _parseColor(ev, useHSL);
						hasAlpha = (bv.length + ev.length > 6);
						if (hasAlpha && !_supportsOpacity && ev[3] === 0) { //older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
							pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
							pt.e = pt.e.split(ea[i]).join("transparent");
						} else {
							if (!_supportsOpacity) { //old versions of IE don't support rgba().
								hasAlpha = false;
							}
							if (useHSL) {
								pt.appendXtra((hasAlpha ? "hsla(" : "hsl("), bv[0], _parseChange(ev[0], bv[0]), ",", false, true)
									.appendXtra("", bv[1], _parseChange(ev[1], bv[1]), "%,", false)
									.appendXtra("", bv[2], _parseChange(ev[2], bv[2]), (hasAlpha ? "%," : "%" + str), false);
							} else {
								pt.appendXtra((hasAlpha ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", true, true)
									.appendXtra("", bv[1], ev[1] - bv[1], ",", true)
									.appendXtra("", bv[2], ev[2] - bv[2], (hasAlpha ? "," : str), true);
							}

							if (hasAlpha) {
								bv = (bv.length < 4) ? 1 : bv[3];
								pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
							}
						}
						_colorExp.lastIndex = 0; //otherwise the test() on the RegExp could move the lastIndex and taint future results.

					} else {
						bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array

						//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
						if (!bnums) {
							pt["xs" + pt.l] += (pt.l || pt["xs" + pt.l]) ? " " + ev : ev;

						//loop through all the numbers that are found and construct the extra values on the pt.
						} else {
							enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
							if (!enums || enums.length !== bnums.length) {
								//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
								return pt;
							}
							ni = 0;
							for (xi = 0; xi < bnums.length; xi++) {
								cv = bnums[xi];
								temp = bv.indexOf(cv, ni);
								pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px"), (xi === 0));
								ni = temp + cv.length;
							}
							pt["xs" + pt.l] += bv.substr(ni);
						}
					}
				}
				//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
				if (e.indexOf("=") !== -1) if (pt.data) {
					str = pt.xs0 + pt.data.s;
					for (i = 1; i < pt.l; i++) {
						str += pt["xs" + i] + pt.data["xn" + i];
					}
					pt.e = str + pt["xs" + i];
				}
				if (!pt.l) {
					pt.type = -1;
					pt.xs0 = pt.e;
				}
				return pt.xfirst || pt;
			},
			i = 9;


		p = CSSPropTween.prototype;
		p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
		while (--i > 0) {
			p["xn" + i] = 0;
			p["xs" + i] = "";
		}
		p.xs0 = "";
		p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;


		/**
		 * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
		 * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
		 * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
		 * @param {string=} pfx Prefix (if any)
		 * @param {!number} s Starting value
		 * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
		 * @param {string=} sfx Suffix (if any)
		 * @param {boolean=} r Round (if true).
		 * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
		 * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
		 */
		p.appendXtra = function(pfx, s, c, sfx, r, pad) {
			var pt = this,
				l = pt.l;
			pt["xs" + l] += (pad && (l || pt["xs" + l])) ? " " + pfx : pfx || "";
			if (!c) if (l !== 0 && !pt.plugin) { //typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
				pt["xs" + l] += s + (sfx || "");
				return pt;
			}
			pt.l++;
			pt.type = pt.setRatio ? 2 : 1;
			pt["xs" + pt.l] = sfx || "";
			if (l > 0) {
				pt.data["xn" + l] = s + c;
				pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
				pt["xn" + l] = s;
				if (!pt.plugin) {
					pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
					pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
				}
				return pt;
			}
			pt.data = {s:s + c};
			pt.rxp = {};
			pt.s = s;
			pt.c = c;
			pt.r = r;
			return pt;
		};

		/**
		 * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
		 * @param {!string} p Property name (like "boxShadow" or "throwProps")
		 * @param {Object=} options An object containing any of the following configuration options:
		 *                      - defaultValue: the default value
		 *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
		 *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
		 *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
		 *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
		 *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
		 *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
		 *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
		 *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
		 */
		var SpecialProp = function(p, options) {
				options = options || {};
				this.p = options.prefix ? _checkPropPrefix(p) || p : p;
				_specialProps[p] = _specialProps[this.p] = this;
				this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
				if (options.parser) {
					this.parse = options.parser;
				}
				this.clrs = options.color;
				this.multi = options.multi;
				this.keyword = options.keyword;
				this.dflt = options.defaultValue;
				this.pr = options.priority || 0;
			},

			//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
			_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
				if (typeof(options) !== "object") {
					options = {parser:defaults}; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
				}
				var a = p.split(","),
					d = options.defaultValue,
					i, temp;
				defaults = defaults || [d];
				for (i = 0; i < a.length; i++) {
					options.prefix = (i === 0 && options.prefix);
					options.defaultValue = defaults[i] || d;
					temp = new SpecialProp(a[i], options);
				}
			},

			//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
			_registerPluginProp = _internals._registerPluginProp = function(p) {
				if (!_specialProps[p]) {
					var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
					_registerComplexSpecialProp(p, {parser:function(t, e, p, cssp, pt, plugin, vars) {
						var pluginClass = _globals.com.greensock.plugins[pluginName];
						if (!pluginClass) {
							_log("Error: " + pluginName + " js file not loaded.");
							return pt;
						}
						pluginClass._cssRegister();
						return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
					}});
				}
			};


		p = SpecialProp.prototype;

		/**
		 * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
		 * @param {!Object} t target element
		 * @param {(string|number|object)} b beginning value
		 * @param {(string|number|object)} e ending (destination) value
		 * @param {CSSPropTween=} pt next CSSPropTween in the linked list
		 * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
		 * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
		 * @return {CSSPropTween=} First CSSPropTween in the linked list
		 */
		p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
			var kwd = this.keyword,
				i, ba, ea, l, bi, ei;
			//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
			if (this.multi) if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
				ba = b.replace(_commasOutsideParenExp, "|").split("|");
				ea = e.replace(_commasOutsideParenExp, "|").split("|");
			} else if (kwd) {
				ba = [b];
				ea = [e];
			}
			if (ea) {
				l = (ea.length > ba.length) ? ea.length : ba.length;
				for (i = 0; i < l; i++) {
					b = ba[i] = ba[i] || this.dflt;
					e = ea[i] = ea[i] || this.dflt;
					if (kwd) {
						bi = b.indexOf(kwd);
						ei = e.indexOf(kwd);
						if (bi !== ei) {
							if (ei === -1) { //if the keyword isn't in the end value, remove it from the beginning one.
								ba[i] = ba[i].split(kwd).join("");
							} else if (bi === -1) { //if the keyword isn't in the beginning, add it.
								ba[i] += " " + kwd;
							}
						}
					}
				}
				b = ba.join(", ");
				e = ea.join(", ");
			}
			return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
		};

		/**
		 * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
		 * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
		 * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
		 * @param {!Object} t Target object whose property is being tweened
		 * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
		 * @param {!string} p Property name
		 * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
		 * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
		 * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
		 * @param {Object=} vars Original vars object that contains the data for parsing.
		 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
		 */
		p.parse = function(t, e, p, cssp, pt, plugin, vars) {
			return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
		};

		/**
		 * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
		 *  1) Target object whose property should be tweened (typically a DOM element)
		 *  2) The end/destination value (could be a string, number, object, or whatever you want)
		 *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
		 *
		 * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
		 *
		 * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
		 *      var start = target.style.width;
		 *      return function(ratio) {
		 *              target.style.width = (start + value * ratio) + "px";
		 *              console.log("set width to " + target.style.width);
		 *          }
		 * }, 0);
		 *
		 * Then, when I do this tween, it will trigger my special property:
		 *
		 * TweenLite.to(element, 1, {css:{myCustomProp:100}});
		 *
		 * In the example, of course, we're just changing the width, but you can do anything you want.
		 *
		 * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
		 * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
		 * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
		 */
		CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
			_registerComplexSpecialProp(name, {parser:function(t, e, p, cssp, pt, plugin, vars) {
				var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
				rv.plugin = plugin;
				rv.setRatio = onInitTween(t, e, cssp._tween, p);
				return rv;
			}, priority:priority});
		};






		//transform-related methods and properties
		CSSPlugin.useSVGTransformAttr = _isSafari || _isFirefox; //Safari and Firefox both have some rendering bugs when applying CSS transforms to SVG elements, so default to using the "transform" attribute instead (users can override this).
		var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent").split(","),
			_transformProp = _checkPropPrefix("transform"), //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
			_transformPropCSS = _prefixCSS + "transform",
			_transformOriginProp = _checkPropPrefix("transformOrigin"),
			_supports3D = (_checkPropPrefix("perspective") !== null),
			Transform = _internals.Transform = function() {
				this.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
				this.force3D = (CSSPlugin.defaultForce3D === false || !_supports3D) ? false : CSSPlugin.defaultForce3D || "auto";
			},
			_SVGElement = window.SVGElement,
			_useSVGTransformAttr,
			//Some browsers (like Firefox and IE) don't honor transform-origin properly in SVG elements, so we need to manually adjust the matrix accordingly. We feature detect here rather than always doing the conversion for certain browsers because they may fix the problem at some point in the future.

			_createSVG = function(type, container, attributes) {
				var element = _doc.createElementNS("http://www.w3.org/2000/svg", type),
					reg = /([a-z])([A-Z])/g,
					p;
				for (p in attributes) {
					element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
				}
				container.appendChild(element);
				return element;
			},
			_docElement = _doc.documentElement,
			_forceSVGTransformAttr = (function() {
				//IE and Android stock don't support CSS transforms on SVG elements, so we must write them to the "transform" attribute. We populate this variable in the _parseTransform() method, and only if/when we come across an SVG element
				var force = _ieVers || (/Android/i.test(_agent) && !window.chrome),
					svg, rect, width;
				if (_doc.createElementNS && !force) { //IE8 and earlier doesn't support SVG anyway
					svg = _createSVG("svg", _docElement);
					rect = _createSVG("rect", svg, {width:100, height:50, x:100});
					width = rect.getBoundingClientRect().width;
					rect.style[_transformOriginProp] = "50% 50%";
					rect.style[_transformProp] = "scaleX(0.5)";
					force = (width === rect.getBoundingClientRect().width && !(_isFirefox && _supports3D)); //note: Firefox fails the test even though it does support CSS transforms in 3D. Since we can't push 3D stuff into the transform attribute, we force Firefox to pass the test here (as long as it does truly support 3D).
					_docElement.removeChild(svg);
				}
				return force;
			})(),
			_parseSVGOrigin = function(e, local, decoratee, absolute, smoothOrigin, skipRecord) {
				var tm = e._gsTransform,
					m = _getMatrix(e, true),
					v, x, y, xOrigin, yOrigin, a, b, c, d, tx, ty, determinant, xOriginOld, yOriginOld;
				if (tm) {
					xOriginOld = tm.xOrigin; //record the original values before we alter them.
					yOriginOld = tm.yOrigin;
				}
				if (!absolute || (v = absolute.split(" ")).length < 2) {
					b = e.getBBox();
					local = _parsePosition(local).split(" ");
					v = [(local[0].indexOf("%") !== -1 ? parseFloat(local[0]) / 100 * b.width : parseFloat(local[0])) + b.x,
						 (local[1].indexOf("%") !== -1 ? parseFloat(local[1]) / 100 * b.height : parseFloat(local[1])) + b.y];
				}
				decoratee.xOrigin = xOrigin = parseFloat(v[0]);
				decoratee.yOrigin = yOrigin = parseFloat(v[1]);
				if (absolute && m !== _identity2DMatrix) { //if svgOrigin is being set, we must invert the matrix and determine where the absolute point is, factoring in the current transforms. Otherwise, the svgOrigin would be based on the element's non-transformed position on the canvas.
					a = m[0];
					b = m[1];
					c = m[2];
					d = m[3];
					tx = m[4];
					ty = m[5];
					determinant = (a * d - b * c);
					x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + ((c * ty - d * tx) / determinant);
					y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - ((a * ty - b * tx) / determinant);
					xOrigin = decoratee.xOrigin = v[0] = x;
					yOrigin = decoratee.yOrigin = v[1] = y;
				}
				if (tm) { //avoid jump when transformOrigin is changed - adjust the x/y values accordingly
					if (skipRecord) {
						decoratee.xOffset = tm.xOffset;
						decoratee.yOffset = tm.yOffset;
						tm = decoratee;
					}
					if (smoothOrigin || (smoothOrigin !== false && CSSPlugin.defaultSmoothOrigin !== false)) {
						x = xOrigin - xOriginOld;
						y = yOrigin - yOriginOld;
						//originally, we simply adjusted the x and y values, but that would cause problems if, for example, you created a rotational tween part-way through an x/y tween. Managing the offset in a separate variable gives us ultimate flexibility.
						//tm.x -= x - (x * m[0] + y * m[2]);
						//tm.y -= y - (x * m[1] + y * m[3]);
						tm.xOffset += (x * m[0] + y * m[2]) - x;
						tm.yOffset += (x * m[1] + y * m[3]) - y;
					} else {
						tm.xOffset = tm.yOffset = 0;
					}
				}
				if (!skipRecord) {
					e.setAttribute("data-svg-origin", v.join(" "));
				}
			},
			_canGetBBox = function(e) {
				try {
					return e.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
				} catch (e) {}
			},
			_isSVG = function(e) { //reports if the element is an SVG on which getBBox() actually works
				return !!(_SVGElement && e.getBBox && e.getCTM && _canGetBBox(e) && (!e.parentNode || (e.parentNode.getBBox && e.parentNode.getCTM)));
			},
			_identity2DMatrix = [1,0,0,1,0,0],
			_getMatrix = function(e, force2D) {
				var tm = e._gsTransform || new Transform(),
					rnd = 100000,
					style = e.style,
					isDefault, s, m, n, dec, none;
				if (_transformProp) {
					s = _getStyle(e, _transformPropCSS, null, true);
				} else if (e.currentStyle) {
					//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
					s = e.currentStyle.filter.match(_ieGetMatrixExp);
					s = (s && s.length === 4) ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",") : "";
				}
				isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
				if (isDefault && _transformProp && ((none = (_getComputedStyle(e).display === "none")) || !e.parentNode)) {
					if (none) { //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none".
						n = style.display;
						style.display = "block";
					}
					if (!e.parentNode) {
						dec = 1; //flag
						_docElement.appendChild(e);
					}
					s = _getStyle(e, _transformPropCSS, null, true);
					isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
					if (n) {
						style.display = n;
					} else if (none) {
						_removeProp(style, "display");
					}
					if (dec) {
						_docElement.removeChild(e);
					}
				}
				if (tm.svg || (e.getBBox && _isSVG(e))) {
					if (isDefault && (style[_transformProp] + "").indexOf("matrix") !== -1) { //some browsers (like Chrome 40) don't correctly report transforms that are applied inline on an SVG element (they don't get included in the computed style), so we double-check here and accept matrix values
						s = style[_transformProp];
						isDefault = 0;
					}
					m = e.getAttribute("transform");
					if (isDefault && m) {
						if (m.indexOf("matrix") !== -1) { //just in case there's a "transform" value specified as an attribute instead of CSS style. Accept either a matrix() or simple translate() value though.
							s = m;
							isDefault = 0;
						} else if (m.indexOf("translate") !== -1) {
							s = "matrix(1,0,0,1," + m.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")";
							isDefault = 0;
						}
					}
				}
				if (isDefault) {
					return _identity2DMatrix;
				}
				//split the matrix values out into an array (m for matrix)
				m = (s || "").match(_numExp) || [];
				i = m.length;
				while (--i > -1) {
					n = Number(m[i]);
					m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
				}
				return (force2D && m.length > 6) ? [m[0], m[1], m[4], m[5], m[12], m[13]] : m;
			},

			/**
			 * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
			 * @param {!Object} t target element
			 * @param {Object=} cs computed style object (optional)
			 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
			 * @param {boolean=} parse if true, we'll ignore any _gsTransform values that already exist on the element, and force a reparsing of the css (calculated style)
			 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
			 */
			_getTransform = _internals.getTransform = function(t, cs, rec, parse) {
				if (t._gsTransform && rec && !parse) {
					return t._gsTransform; //if the element already has a _gsTransform, use that. Note: some browsers don't accurately return the calculated style for the transform (particularly for SVG), so it's almost always safest to just use the values we've already applied rather than re-parsing things.
				}
				var tm = rec ? t._gsTransform || new Transform() : new Transform(),
					invX = (tm.scaleX < 0), //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
					min = 0.00002,
					rnd = 100000,
					zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin  || 0 : 0,
					defaultTransformPerspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0,
					m, i, scaleX, scaleY, rotation, skewX;

				tm.svg = !!(t.getBBox && _isSVG(t));
				if (tm.svg) {
					_parseSVGOrigin(t, _getStyle(t, _transformOriginProp, cs, false, "50% 50%") + "", tm, t.getAttribute("data-svg-origin"));
					_useSVGTransformAttr = CSSPlugin.useSVGTransformAttr || _forceSVGTransformAttr;
				}
				m = _getMatrix(t);
				if (m !== _identity2DMatrix) {

					if (m.length === 16) {
						//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
						var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
							a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
							a13 = m[8], a23 = m[9], a33 = m[10],
							a14 = m[12], a24 = m[13], a34 = m[14],
							a43 = m[11],
							angle = Math.atan2(a32, a33),
							t1, t2, t3, t4, cos, sin;

						//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
						if (tm.zOrigin) {
							a34 = -tm.zOrigin;
							a14 = a13*a34-m[12];
							a24 = a23*a34-m[13];
							a34 = a33*a34+tm.zOrigin-m[14];
						}
						tm.rotationX = angle * _RAD2DEG;
						//rotationX
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a12*cos+a13*sin;
							t2 = a22*cos+a23*sin;
							t3 = a32*cos+a33*sin;
							a13 = a12*-sin+a13*cos;
							a23 = a22*-sin+a23*cos;
							a33 = a32*-sin+a33*cos;
							a43 = a42*-sin+a43*cos;
							a12 = t1;
							a22 = t2;
							a32 = t3;
						}
						//rotationY
						angle = Math.atan2(-a31, a33);
						tm.rotationY = angle * _RAD2DEG;
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a11*cos-a13*sin;
							t2 = a21*cos-a23*sin;
							t3 = a31*cos-a33*sin;
							a23 = a21*sin+a23*cos;
							a33 = a31*sin+a33*cos;
							a43 = a41*sin+a43*cos;
							a11 = t1;
							a21 = t2;
							a31 = t3;
						}
						//rotationZ
						angle = Math.atan2(a21, a11);
						tm.rotation = angle * _RAD2DEG;
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							a11 = a11*cos+a12*sin;
							t2 = a21*cos+a22*sin;
							a22 = a21*-sin+a22*cos;
							a32 = a31*-sin+a32*cos;
							a21 = t2;
						}

						if (tm.rotationX && Math.abs(tm.rotationX) + Math.abs(tm.rotation) > 359.9) { //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
							tm.rotationX = tm.rotation = 0;
							tm.rotationY = 180 - tm.rotationY;
						}

						tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21) * rnd + 0.5) | 0) / rnd;
						tm.scaleY = ((Math.sqrt(a22 * a22 + a23 * a23) * rnd + 0.5) | 0) / rnd;
						tm.scaleZ = ((Math.sqrt(a32 * a32 + a33 * a33) * rnd + 0.5) | 0) / rnd;
						if (tm.rotationX || tm.rotationY) {
							tm.skewX = 0;
						} else {
							tm.skewX = (a12 || a22) ? Math.atan2(a12, a22) * _RAD2DEG + tm.rotation : tm.skewX || 0;
							if (Math.abs(tm.skewX) > 90 && Math.abs(tm.skewX) < 270) {
								if (invX) {
									tm.scaleX *= -1;
									tm.skewX += (tm.rotation <= 0) ? 180 : -180;
									tm.rotation += (tm.rotation <= 0) ? 180 : -180;
								} else {
									tm.scaleY *= -1;
									tm.skewX += (tm.skewX <= 0) ? 180 : -180;
								}
							}
						}
						tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
						tm.x = a14;
						tm.y = a24;
						tm.z = a34;
						if (tm.svg) {
							tm.x -= tm.xOrigin - (tm.xOrigin * a11 - tm.yOrigin * a12);
							tm.y -= tm.yOrigin - (tm.yOrigin * a21 - tm.xOrigin * a22);
						}

					} else if ((!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY))) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
						var k = (m.length >= 6),
							a = k ? m[0] : 1,
							b = m[1] || 0,
							c = m[2] || 0,
							d = k ? m[3] : 1;
						tm.x = m[4] || 0;
						tm.y = m[5] || 0;
						scaleX = Math.sqrt(a * a + b * b);
						scaleY = Math.sqrt(d * d + c * c);
						rotation = (a || b) ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
						skewX = (c || d) ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
						if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
							if (invX) {
								scaleX *= -1;
								skewX += (rotation <= 0) ? 180 : -180;
								rotation += (rotation <= 0) ? 180 : -180;
							} else {
								scaleY *= -1;
								skewX += (skewX <= 0) ? 180 : -180;
							}
						}
						tm.scaleX = scaleX;
						tm.scaleY = scaleY;
						tm.rotation = rotation;
						tm.skewX = skewX;
						if (_supports3D) {
							tm.rotationX = tm.rotationY = tm.z = 0;
							tm.perspective = defaultTransformPerspective;
							tm.scaleZ = 1;
						}
						if (tm.svg) {
							tm.x -= tm.xOrigin - (tm.xOrigin * a + tm.yOrigin * c);
							tm.y -= tm.yOrigin - (tm.xOrigin * b + tm.yOrigin * d);
						}
					}
					tm.zOrigin = zOrigin;
					//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
					for (i in tm) {
						if (tm[i] < min) if (tm[i] > -min) {
							tm[i] = 0;
						}
					}
				}
				//DEBUG: _log("parsed rotation of " + t.getAttribute("id")+": "+(tm.rotationX)+", "+(tm.rotationY)+", "+(tm.rotation)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective+ ", origin: "+ tm.xOrigin+ ","+ tm.yOrigin);
				if (rec) {
					t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
					if (tm.svg) { //if we're supposed to apply transforms to the SVG element's "transform" attribute, make sure there aren't any CSS transforms applied or they'll override the attribute ones. Also clear the transform attribute if we're using CSS, just to be clean.
						if (_useSVGTransformAttr && t.style[_transformProp]) {
							TweenLite.delayedCall(0.001, function(){ //if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
								_removeProp(t.style, _transformProp);
							});
						} else if (!_useSVGTransformAttr && t.getAttribute("transform")) {
							TweenLite.delayedCall(0.001, function(){
								t.removeAttribute("transform");
							});
						}
					}
				}
				return tm;
			},

			//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
			_setIETransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					ang = -t.rotation * _DEG2RAD,
					skew = ang + t.skewX * _DEG2RAD,
					rnd = 100000,
					a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
					b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
					c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
					d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
					style = this.t.style,
					cs = this.t.currentStyle,
					filters, val;
				if (!cs) {
					return;
				}
				val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
				b = -c;
				c = -val;
				filters = cs.filter;
				style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
				var w = this.t.offsetWidth,
					h = this.t.offsetHeight,
					clip = (cs.position !== "absolute"),
					m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
					ox = t.x + (w * t.xPercent / 100),
					oy = t.y + (h * t.yPercent / 100),
					dx, dy;

				//if transformOrigin is being used, adjust the offset x and y
				if (t.ox != null) {
					dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
					dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
					ox += dx - (dx * a + dy * b);
					oy += dy - (dx * c + dy * d);
				}

				if (!clip) {
					m += ", sizingMethod='auto expand')";
				} else {
					dx = (w / 2);
					dy = (h / 2);
					//translate to ensure that transformations occur around the correct origin (default is center).
					m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
				}
				if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
					style.filter = filters.replace(_ieSetMatrixExp, m);
				} else {
					style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
				}

				//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
				if (v === 0 || v === 1) if (a === 1) if (b === 0) if (c === 0) if (d === 1) if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) if (filters.indexOf("gradient(" && filters.indexOf("Alpha")) === -1) {
					style.removeAttribute("filter");
				}

				//we must set the margins AFTER applying the filter in order to avoid some bugs in IE8 that could (in rare scenarios) cause them to be ignored intermittently (vibration).
				if (!clip) {
					var mult = (_ieVers < 8) ? 1 : -1, //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
						marg, prop, dif;
					dx = t.ieOffsetX || 0;
					dy = t.ieOffsetY || 0;
					t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
					t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
					for (i = 0; i < 4; i++) {
						prop = _margins[i];
						marg = cs[prop];
						//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
						val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
						if (val !== t[prop]) {
							dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
						} else {
							dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
						}
						style[prop] = (t[prop] = Math.round( val - dif * ((i === 0 || i === 2) ? 1 : mult) )) + "px";
					}
				}
			},

			/* translates a super small decimal to a string WITHOUT scientific notation
			_safeDecimal = function(n) {
				var s = (n < 0 ? -n : n) + "",
					a = s.split("e-");
				return (n < 0 ? "-0." : "0.") + new Array(parseInt(a[1], 10) || 0).join("0") + a[0].split(".").join("");
			},
			*/

			_setTransformRatio = _internals.set3DTransformRatio = _internals.setTransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					style = this.t.style,
					angle = t.rotation,
					rotationX = t.rotationX,
					rotationY = t.rotationY,
					sx = t.scaleX,
					sy = t.scaleY,
					sz = t.scaleZ,
					x = t.x,
					y = t.y,
					z = t.z,
					isSVG = t.svg,
					perspective = t.perspective,
					force3D = t.force3D,
					a11, a12, a13, a21, a22, a23, a31, a32, a33, a41, a42, a43,
					zOrigin, min, cos, sin, t1, t2, transform, comma, zero, skew, rnd;
				//check to see if we should render as 2D (and SVGs must use 2D when _useSVGTransformAttr is true)
				if (((((v === 1 || v === 0) && force3D === "auto" && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime)) || !force3D) && !z && !perspective && !rotationY && !rotationX && sz === 1) || (_useSVGTransformAttr && isSVG) || !_supports3D) { //on the final render (which could be 0 for a from tween), if there are no 3D aspects, render in 2D to free up memory and improve performance especially on mobile devices. Check the tween's totalTime/totalDuration too in order to make sure it doesn't happen between repeats if it's a repeating tween.

					//2D
					if (angle || t.skewX || isSVG) {
						angle *= _DEG2RAD;
						skew = t.skewX * _DEG2RAD;
						rnd = 100000;
						a11 = Math.cos(angle) * sx;
						a21 = Math.sin(angle) * sx;
						a12 = Math.sin(angle - skew) * -sy;
						a22 = Math.cos(angle - skew) * sy;
						if (skew && t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
							t1 = Math.tan(skew - t.skewY * _DEG2RAD);
							t1 = Math.sqrt(1 + t1 * t1);
							a12 *= t1;
							a22 *= t1;
							if (t.skewY) {
								t1 = Math.tan(t.skewY * _DEG2RAD);
								t1 = Math.sqrt(1 + t1 * t1);
								a11 *= t1;
								a21 *= t1;
							}
						}
						if (isSVG) {
							x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
							y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
							if (_useSVGTransformAttr && (t.xPercent || t.yPercent)) { //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the matrix to simulate it.
								min = this.t.getBBox();
								x += t.xPercent * 0.01 * min.width;
								y += t.yPercent * 0.01 * min.height;
							}
							min = 0.000001;
							if (x < min) if (x > -min) {
								x = 0;
							}
							if (y < min) if (y > -min) {
								y = 0;
							}
						}
						transform = (((a11 * rnd) | 0) / rnd) + "," + (((a21 * rnd) | 0) / rnd) + "," + (((a12 * rnd) | 0) / rnd) + "," + (((a22 * rnd) | 0) / rnd) + "," + x + "," + y + ")";
						if (isSVG && _useSVGTransformAttr) {
							this.t.setAttribute("transform", "matrix(" + transform);
						} else {
							//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
							style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + transform;
						}
					} else {
						style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + sx + ",0,0," + sy + "," + x + "," + y + ")";
					}
					return;

				}
				if (_isFirefox) { //Firefox has a bug (at least in v25) that causes it to render the transparent part of 32-bit PNG images as black when displayed inside an iframe and the 3D scale is very small and doesn't change sufficiently enough between renders (like if you use a Power4.easeInOut to scale from 0 to 1 where the beginning values only change a tiny amount to begin the tween before accelerating). In this case, we force the scale to be 0.00002 instead which is visually the same but works around the Firefox issue.
					min = 0.0001;
					if (sx < min && sx > -min) {
						sx = sz = 0.00002;
					}
					if (sy < min && sy > -min) {
						sy = sz = 0.00002;
					}
					if (perspective && !t.z && !t.rotationX && !t.rotationY) { //Firefox has a bug that causes elements to have an odd super-thin, broken/dotted black border on elements that have a perspective set but aren't utilizing 3D space (no rotationX, rotationY, or z).
						perspective = 0;
					}
				}
				if (angle || t.skewX) {
					angle *= _DEG2RAD;
					cos = a11 = Math.cos(angle);
					sin = a21 = Math.sin(angle);
					if (t.skewX) {
						angle -= t.skewX * _DEG2RAD;
						cos = Math.cos(angle);
						sin = Math.sin(angle);
						if (t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
							t1 = Math.tan((t.skewX - t.skewY) * _DEG2RAD);
							t1 = Math.sqrt(1 + t1 * t1);
							cos *= t1;
							sin *= t1;
							if (t.skewY) {
								t1 = Math.tan(t.skewY * _DEG2RAD);
								t1 = Math.sqrt(1 + t1 * t1);
								a11 *= t1;
								a21 *= t1;
							}
						}
					}
					a12 = -sin;
					a22 = cos;

				} else if (!rotationY && !rotationX && sz === 1 && !perspective && !isSVG) { //if we're only translating and/or 2D scaling, this is faster...
					style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + y + "px," + z +"px)" + ((sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "");
					return;
				} else {
					a11 = a22 = 1;
					a12 = a21 = 0;
				}
				// KEY  INDEX   AFFECTS
				// a11  0       rotation, rotationY, scaleX
				// a21  1       rotation, rotationY, scaleX
				// a31  2       rotationY, scaleX
				// a41  3       rotationY, scaleX
				// a12  4       rotation, skewX, rotationX, scaleY
				// a22  5       rotation, skewX, rotationX, scaleY
				// a32  6       rotationX, scaleY
				// a42  7       rotationX, scaleY
				// a13  8       rotationY, rotationX, scaleZ
				// a23  9       rotationY, rotationX, scaleZ
				// a33  10      rotationY, rotationX, scaleZ
				// a43  11      rotationY, rotationX, perspective, scaleZ
				// a14  12      x, zOrigin, svgOrigin
				// a24  13      y, zOrigin, svgOrigin
				// a34  14      z, zOrigin
				// a44  15
				// rotation: Math.atan2(a21, a11)
				// rotationY: Math.atan2(a13, a33) (or Math.atan2(a13, a11))
				// rotationX: Math.atan2(a32, a33)
				a33 = 1;
				a13 = a23 = a31 = a32 = a41 = a42 = 0;
				a43 = (perspective) ? -1 / perspective : 0;
				zOrigin = t.zOrigin;
				min = 0.000001; //threshold below which browsers use scientific notation which won't work.
				comma = ",";
				zero = "0";
				angle = rotationY * _DEG2RAD;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					a31 = -sin;
					a41 = a43*-sin;
					a13 = a11*sin;
					a23 = a21*sin;
					a33 = cos;
					a43 *= cos;
					a11 *= cos;
					a21 *= cos;
				}
				angle = rotationX * _DEG2RAD;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a12*cos+a13*sin;
					t2 = a22*cos+a23*sin;
					a32 = a33*sin;
					a42 = a43*sin;
					a13 = a12*-sin+a13*cos;
					a23 = a22*-sin+a23*cos;
					a33 = a33*cos;
					a43 = a43*cos;
					a12 = t1;
					a22 = t2;
				}
				if (sz !== 1) {
					a13*=sz;
					a23*=sz;
					a33*=sz;
					a43*=sz;
				}
				if (sy !== 1) {
					a12*=sy;
					a22*=sy;
					a32*=sy;
					a42*=sy;
				}
				if (sx !== 1) {
					a11*=sx;
					a21*=sx;
					a31*=sx;
					a41*=sx;
				}

				if (zOrigin || isSVG) {
					if (zOrigin) {
						x += a13*-zOrigin;
						y += a23*-zOrigin;
						z += a33*-zOrigin+zOrigin;
					}
					if (isSVG) { //due to bugs in some browsers, we need to manage the transform-origin of SVG manually
						x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
						y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
					}
					if (x < min && x > -min) {
						x = zero;
					}
					if (y < min && y > -min) {
						y = zero;
					}
					if (z < min && z > -min) {
						z = 0; //don't use string because we calculate perspective later and need the number.
					}
				}

				//optimized way of concatenating all the values into a string. If we do it all in one shot, it's slower because of the way browsers have to create temp strings and the way it affects memory. If we do it piece-by-piece with +=, it's a bit slower too. We found that doing it in these sized chunks works best overall:
				transform = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix3d(" : "matrix3d(");
				transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
				transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
				if (rotationX || rotationY || sz !== 1) { //performance optimization (often there's no rotationX or rotationY, so we can skip these calculations)
					transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
					transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
				} else {
					transform += ",0,0,0,0,1,0,";
				}
				transform += x + comma + y + comma + z + comma + (perspective ? (1 + (-z / perspective)) : 1) + ")";

				style[_transformProp] = transform;
			};

		p = Transform.prototype;
		p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
		p.scaleX = p.scaleY = p.scaleZ = 1;

		_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {parser:function(t, e, parsingProp, cssp, pt, plugin, vars) {
			if (cssp._lastParsedTransform === vars) { return pt; } //only need to parse the transform once, and only if the browser supports it.
			cssp._lastParsedTransform = vars;
			var swapFunc;
			if (typeof(vars[parsingProp]) === "function") { //whatever property triggers the initial parsing might be a function-based value in which case it already got called in parse(), thus we don't want to call it again in here. The most efficient way to avoid this is to temporarily swap the value directly into the vars object, and then after we do all our parsing in this function, we'll swap it back again.
				swapFunc = vars[parsingProp];
				vars[parsingProp] = e;
			}
			var originalGSTransform = t._gsTransform,
				style = t.style,
				min = 0.000001,
				i = _transformProps.length,
				v = vars,
				endRotations = {},
				transformOriginString = "transformOrigin",
				m1 = _getTransform(t, _cs, true, v.parseTransform),
				orig = v.transform && ((typeof(v.transform) === "function") ? v.transform(_index, _target) : v.transform),
				m2, copy, has3D, hasChange, dr, x, y, matrix, p;
			cssp._transform = m1;
			if (orig && typeof(orig) === "string" && _transformProp) { //for values like transform:"rotate(60deg) scale(0.5, 0.8)"
				copy = _tempDiv.style; //don't use the original target because it might be SVG in which case some browsers don't report computed style correctly.
				copy[_transformProp] = orig;
				copy.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
				copy.position = "absolute";
				_doc.body.appendChild(_tempDiv);
				m2 = _getTransform(_tempDiv, null, false);
				if (m1.svg) { //if it's an SVG element, x/y part of the matrix will be affected by whatever we use as the origin and the offsets, so compensate here...
					x = m1.xOrigin;
					y = m1.yOrigin;
					m2.x -= m1.xOffset;
					m2.y -= m1.yOffset;
					if (v.transformOrigin || v.svgOrigin) { //if this tween is altering the origin, we must factor that in here. The actual work of recording the transformOrigin values and setting up the PropTween is done later (still inside this function) so we cannot leave the changes intact here - we only want to update the x/y accordingly.
						orig = {};
						_parseSVGOrigin(t, _parsePosition(v.transformOrigin), orig, v.svgOrigin, v.smoothOrigin, true);
						x = orig.xOrigin;
						y = orig.yOrigin;
						m2.x -= orig.xOffset - m1.xOffset;
						m2.y -= orig.yOffset - m1.yOffset;
					}
					if (x || y) {
						matrix = _getMatrix(_tempDiv, true);
						m2.x -= x - (x * matrix[0] + y * matrix[2]);
						m2.y -= y - (x * matrix[1] + y * matrix[3]);
					}
				}
				_doc.body.removeChild(_tempDiv);
				if (!m2.perspective) {
					m2.perspective = m1.perspective; //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
				}
				if (v.xPercent != null) {
					m2.xPercent = _parseVal(v.xPercent, m1.xPercent);
				}
				if (v.yPercent != null) {
					m2.yPercent = _parseVal(v.yPercent, m1.yPercent);
				}
			} else if (typeof(v) === "object") { //for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
				m2 = {scaleX:_parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
					scaleY:_parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
					scaleZ:_parseVal(v.scaleZ, m1.scaleZ),
					x:_parseVal(v.x, m1.x),
					y:_parseVal(v.y, m1.y),
					z:_parseVal(v.z, m1.z),
					xPercent:_parseVal(v.xPercent, m1.xPercent),
					yPercent:_parseVal(v.yPercent, m1.yPercent),
					perspective:_parseVal(v.transformPerspective, m1.perspective)};
				dr = v.directionalRotation;
				if (dr != null) {
					if (typeof(dr) === "object") {
						for (copy in dr) {
							v[copy] = dr[copy];
						}
					} else {
						v.rotation = dr;
					}
				}
				if (typeof(v.x) === "string" && v.x.indexOf("%") !== -1) {
					m2.x = 0;
					m2.xPercent = _parseVal(v.x, m1.xPercent);
				}
				if (typeof(v.y) === "string" && v.y.indexOf("%") !== -1) {
					m2.y = 0;
					m2.yPercent = _parseVal(v.y, m1.yPercent);
				}

				m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : ("rotationZ" in v) ? v.rotationZ : m1.rotation - m1.skewY, m1.rotation - m1.skewY, "rotation", endRotations); //see notes below about skewY for why we subtract it from rotation here
				if (_supports3D) {
					m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
					m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
				}
				m2.skewX = _parseAngle(v.skewX, m1.skewX - m1.skewY); //see notes below about skewY and why we subtract it from skewX here

				//note: for performance reasons, we combine all skewing into the skewX and rotation values, ignoring skewY but we must still record it so that we can discern how much of the overall skew is attributed to skewX vs. skewY. Otherwise, if the skewY would always act relative (tween skewY to 10deg, for example, multiple times and if we always combine things into skewX, we can't remember that skewY was 10 from last time). Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of -10 degrees.
				if ((m2.skewY = _parseAngle(v.skewY, m1.skewY))) {
					m2.skewX += m2.skewY;
					m2.rotation += m2.skewY;
				}
			}
			if (_supports3D && v.force3D != null) {
				m1.force3D = v.force3D;
				hasChange = true;
			}

			m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;

			has3D = (m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
			if (!has3D && v.scale != null) {
				m2.scaleZ = 1; //no need to tween scaleZ.
			}

			while (--i > -1) {
				p = _transformProps[i];
				orig = m2[p] - m1[p];
				if (orig > min || orig < -min || v[p] != null || _forcePT[p] != null) {
					hasChange = true;
					pt = new CSSPropTween(m1, p, m1[p], orig, pt);
					if (p in endRotations) {
						pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
					}
					pt.xs0 = 0; //ensures the value stays numeric in setRatio()
					pt.plugin = plugin;
					cssp._overwriteProps.push(pt.n);
				}
			}

			orig = v.transformOrigin;
			if (m1.svg && (orig || v.svgOrigin)) {
				x = m1.xOffset; //when we change the origin, in order to prevent things from jumping we adjust the x/y so we must record those here so that we can create PropTweens for them and flip them at the same time as the origin
				y = m1.yOffset;
				_parseSVGOrigin(t, _parsePosition(orig), m2, v.svgOrigin, v.smoothOrigin);
				pt = _addNonTweeningNumericPT(m1, "xOrigin", (originalGSTransform ? m1 : m2).xOrigin, m2.xOrigin, pt, transformOriginString); //note: if there wasn't a transformOrigin defined yet, just start with the destination one; it's wasteful otherwise, and it causes problems with fromTo() tweens. For example, TweenLite.to("#wheel", 3, {rotation:180, transformOrigin:"50% 50%", delay:1}); TweenLite.fromTo("#wheel", 3, {scale:0.5, transformOrigin:"50% 50%"}, {scale:1, delay:2}); would cause a jump when the from values revert at the beginning of the 2nd tween.
				pt = _addNonTweeningNumericPT(m1, "yOrigin", (originalGSTransform ? m1 : m2).yOrigin, m2.yOrigin, pt, transformOriginString);
				if (x !== m1.xOffset || y !== m1.yOffset) {
					pt = _addNonTweeningNumericPT(m1, "xOffset", (originalGSTransform ? x : m1.xOffset), m1.xOffset, pt, transformOriginString);
					pt = _addNonTweeningNumericPT(m1, "yOffset", (originalGSTransform ? y : m1.yOffset), m1.yOffset, pt, transformOriginString);
				}
				orig = _useSVGTransformAttr ? null : "0px 0px"; //certain browsers (like firefox) completely botch transform-origin, so we must remove it to prevent it from contaminating transforms. We manage it ourselves with xOrigin and yOrigin
			}
			if (orig || (_supports3D && has3D && m1.zOrigin)) { //if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
				if (_transformProp) {
					hasChange = true;
					p = _transformOriginProp;
					orig = (orig || _getStyle(t, p, _cs, false, "50% 50%")) + ""; //cast as string to avoid errors
					pt = new CSSPropTween(style, p, 0, 0, pt, -1, transformOriginString);
					pt.b = style[p];
					pt.plugin = plugin;
					if (_supports3D) {
						copy = m1.zOrigin;
						orig = orig.split(" ");
						m1.zOrigin = ((orig.length > 2 && !(copy !== 0 && orig[2] === "0px")) ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
						pt.xs0 = pt.e = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
						pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
						pt.b = copy;
						pt.xs0 = pt.e = m1.zOrigin;
					} else {
						pt.xs0 = pt.e = orig;
					}

					//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
				} else {
					_parsePosition(orig + "", m1);
				}
			}
			if (hasChange) {
				cssp._transformType = (!(m1.svg && _useSVGTransformAttr) && (has3D || this._transformType === 3)) ? 3 : 2; //quicker than calling cssp._enableTransforms();
			}
			if (swapFunc) {
				vars[parsingProp] = swapFunc;
			}
			return pt;
		}, prefix:true});

		_registerComplexSpecialProp("boxShadow", {defaultValue:"0px 0px 0px 0px #999", prefix:true, color:true, multi:true, keyword:"inset"});

		_registerComplexSpecialProp("borderRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
			e = this.format(e);
			var props = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],
				style = t.style,
				ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
			w = parseFloat(t.offsetWidth);
			h = parseFloat(t.offsetHeight);
			ea1 = e.split(" ");
			for (i = 0; i < props.length; i++) { //if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
				if (this.p.indexOf("border")) { //older browsers used a prefix
					props[i] = _checkPropPrefix(props[i]);
				}
				bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
				if (bs.indexOf(" ") !== -1) {
					bs2 = bs.split(" ");
					bs = bs2[0];
					bs2 = bs2[1];
				}
				es = es2 = ea1[i];
				bn = parseFloat(bs);
				bsfx = bs.substr((bn + "").length);
				rel = (es.charAt(1) === "=");
				if (rel) {
					en = parseInt(es.charAt(0)+"1", 10);
					es = es.substr(2);
					en *= parseFloat(es);
					esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
				} else {
					en = parseFloat(es);
					esfx = es.substr((en + "").length);
				}
				if (esfx === "") {
					esfx = _suffixMap[p] || bsfx;
				}
				if (esfx !== bsfx) {
					hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
					vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
					if (esfx === "%") {
						bs = (hn / w * 100) + "%";
						bs2 = (vn / h * 100) + "%";
					} else if (esfx === "em") {
						em = _convertToPixels(t, "borderLeft", 1, "em");
						bs = (hn / em) + "em";
						bs2 = (vn / em) + "em";
					} else {
						bs = hn + "px";
						bs2 = vn + "px";
					}
					if (rel) {
						es = (parseFloat(bs) + en) + esfx;
						es2 = (parseFloat(bs2) + en) + esfx;
					}
				}
				pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
			}
			return pt;
		}, prefix:true, formatter:_getFormatter("0px 0px 0px 0px", false, true)});
		_registerComplexSpecialProp("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
			return _parseComplex(t.style, p, this.format(_getStyle(t, p, _cs, false, "0px 0px")), this.format(e), false, "0px", pt);
		}, prefix:true, formatter:_getFormatter("0px 0px", false, true)});
		_registerComplexSpecialProp("backgroundPosition", {defaultValue:"0 0", parser:function(t, e, p, cssp, pt, plugin) {
			var bp = "background-position",
				cs = (_cs || _getComputedStyle(t, null)),
				bs = this.format( ((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
				es = this.format(e),
				ba, ea, i, pct, overlap, src;
			if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1) && es.split(",").length < 2) {
				src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
				if (src && src !== "none") {
					ba = bs.split(" ");
					ea = es.split(" ");
					_tempImg.setAttribute("src", src); //set the temp IMG's src to the background-image so that we can measure its width/height
					i = 2;
					while (--i > -1) {
						bs = ba[i];
						pct = (bs.indexOf("%") !== -1);
						if (pct !== (ea[i].indexOf("%") !== -1)) {
							overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
							ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
						}
					}
					bs = ba.join(" ");
				}
			}
			return this.parseComplex(t.style, bs, es, pt, plugin);
		}, formatter:_parsePosition});
		_registerComplexSpecialProp("backgroundSize", {defaultValue:"0 0", formatter:function(v) {
			v += ""; //ensure it's a string
			return _parsePosition(v.indexOf(" ") === -1 ? v + " " + v : v); //if set to something like "100% 100%", Safari typically reports the computed style as just "100%" (no 2nd value), but we should ensure that there are two values, so copy the first one. Otherwise, it'd be interpreted as "100% 0" (wrong).
		}});
		_registerComplexSpecialProp("perspective", {defaultValue:"0px", prefix:true});
		_registerComplexSpecialProp("perspectiveOrigin", {defaultValue:"50% 50%", prefix:true});
		_registerComplexSpecialProp("transformStyle", {prefix:true});
		_registerComplexSpecialProp("backfaceVisibility", {prefix:true});
		_registerComplexSpecialProp("userSelect", {prefix:true});
		_registerComplexSpecialProp("margin", {parser:_getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")});
		_registerComplexSpecialProp("padding", {parser:_getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")});
		_registerComplexSpecialProp("clip", {defaultValue:"rect(0px,0px,0px,0px)", parser:function(t, e, p, cssp, pt, plugin){
			var b, cs, delim;
			if (_ieVers < 9) { //IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
				cs = t.currentStyle;
				delim = _ieVers < 8 ? " " : ",";
				b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
				e = this.format(e).split(",").join(delim);
			} else {
				b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
				e = this.format(e);
			}
			return this.parseComplex(t.style, b, e, pt, plugin);
		}});
		_registerComplexSpecialProp("textShadow", {defaultValue:"0px 0px 0px #999", color:true, multi:true});
		_registerComplexSpecialProp("autoRound,strictUnits", {parser:function(t, e, p, cssp, pt) {return pt;}}); //just so that we can ignore these properties (not tween them)
		_registerComplexSpecialProp("border", {defaultValue:"0px solid #000", parser:function(t, e, p, cssp, pt, plugin) {
			var bw = _getStyle(t, "borderTopWidth", _cs, false, "0px"),
				end = this.format(e).split(" "),
				esfx = end[0].replace(_suffixExp, "");
			if (esfx !== "px") { //if we're animating to a non-px value, we need to convert the beginning width to that unit.
				bw = (parseFloat(bw) / _convertToPixels(t, "borderTopWidth", 1, esfx)) + esfx;
			}
			return this.parseComplex(t.style, this.format(bw + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), end.join(" "), pt, plugin);
			}, color:true, formatter:function(v) {
				var a = v.split(" ");
				return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
			}});
		_registerComplexSpecialProp("borderWidth", {parser:_getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}); //Firefox doesn't pick up on borderWidth set in style sheets (only inline).
		_registerComplexSpecialProp("float,cssFloat,styleFloat", {parser:function(t, e, p, cssp, pt, plugin) {
			var s = t.style,
				prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
			return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
		}});

		//opacity-related
		var _setIEOpacityRatio = function(v) {
				var t = this.t, //refers to the element's style property
					filters = t.filter || _getStyle(this.data, "filter") || "",
					val = (this.s + this.c * v) | 0,
					skip;
				if (val === 100) { //for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
					if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
						t.removeAttribute("filter");
						skip = (!_getStyle(this.data, "filter")); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
					} else {
						t.filter = filters.replace(_alphaFilterExp, "");
						skip = true;
					}
				}
				if (!skip) {
					if (this.xn1) {
						t.filter = filters = filters || ("alpha(opacity=" + val + ")"); //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
					}
					if (filters.indexOf("pacity") === -1) { //only used if browser doesn't support the standard opacity style property (IE 7 and 8). We omit the "O" to avoid case-sensitivity issues
						if (val !== 0 || !this.xn1) { //bugs in IE7/8 won't render the filter properly if opacity is ADDED on the same frame/render as "visibility" changes (this.xn1 is 1 if this tween is an "autoAlpha" tween)
							t.filter = filters + " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
						}
					} else {
						t.filter = filters.replace(_opacityExp, "opacity=" + val);
					}
				}
			};
		_registerComplexSpecialProp("opacity,alpha,autoAlpha", {defaultValue:"1", parser:function(t, e, p, cssp, pt, plugin) {
			var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
				style = t.style,
				isAutoAlpha = (p === "autoAlpha");
			if (typeof(e) === "string" && e.charAt(1) === "=") {
				e = ((e.charAt(0) === "-") ? -1 : 1) * parseFloat(e.substr(2)) + b;
			}
			if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
				b = 0;
			}
			if (_supportsOpacity) {
				pt = new CSSPropTween(style, "opacity", b, e - b, pt);
			} else {
				pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
				pt.xn1 = isAutoAlpha ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
				style.zoom = 1; //helps correct an IE issue.
				pt.type = 2;
				pt.b = "alpha(opacity=" + pt.s + ")";
				pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
				pt.data = t;
				pt.plugin = plugin;
				pt.setRatio = _setIEOpacityRatio;
			}
			if (isAutoAlpha) { //we have to create the "visibility" PropTween after the opacity one in the linked list so that they run in the order that works properly in IE8 and earlier
				pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "inherit" : "hidden"), ((e === 0) ? "hidden" : "inherit"));
				pt.xs0 = "inherit";
				cssp._overwriteProps.push(pt.n);
				cssp._overwriteProps.push(p);
			}
			return pt;
		}});


		var _removeProp = function(s, p) {
				if (p) {
					if (s.removeProperty) {
						if (p.substr(0,2) === "ms" || p.substr(0,6) === "webkit") { //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
							p = "-" + p;
						}
						s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
					} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
						s.removeAttribute(p);
					}
				}
			},
			_setClassNameRatio = function(v) {
				this.t._gsClassPT = this;
				if (v === 1 || v === 0) {
					this.t.setAttribute("class", (v === 0) ? this.b : this.e);
					var mpt = this.data, //first MiniPropTween
						s = this.t.style;
					while (mpt) {
						if (!mpt.v) {
							_removeProp(s, mpt.p);
						} else {
							s[mpt.p] = mpt.v;
						}
						mpt = mpt._next;
					}
					if (v === 1 && this.t._gsClassPT === this) {
						this.t._gsClassPT = null;
					}
				} else if (this.t.getAttribute("class") !== this.e) {
					this.t.setAttribute("class", this.e);
				}
			};
		_registerComplexSpecialProp("className", {parser:function(t, e, p, cssp, pt, plugin, vars) {
			var b = t.getAttribute("class") || "", //don't use t.className because it doesn't work consistently on SVG elements; getAttribute("class") and setAttribute("class", value") is more reliable.
				cssText = t.style.cssText,
				difData, bs, cnpt, cnptLookup, mpt;
			pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClassNameRatio;
			pt.pr = -11;
			_hasPriority = true;
			pt.b = b;
			bs = _getAllStyles(t, _cs);
			//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
			cnpt = t._gsClassPT;
			if (cnpt) {
				cnptLookup = {};
				mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
				while (mpt) {
					cnptLookup[mpt.p] = 1;
					mpt = mpt._next;
				}
				cnpt.setRatio(1);
			}
			t._gsClassPT = pt;
			pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
			t.setAttribute("class", pt.e);
			difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
			t.setAttribute("class", b);
			pt.data = difData.firstMPT;
			t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
			pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
			return pt;
		}});


		var _setClearPropsRatio = function(v) {
			if (v === 1 || v === 0) if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") { //this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that and if the tween is the zero-duration one that's created internally to render the starting values in a from() tween, ignore that because otherwise, for example, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in).
				var s = this.t.style,
					transformParse = _specialProps.transform.parse,
					a, p, i, clearTransform, transform;
				if (this.e === "all") {
					s.cssText = "";
					clearTransform = true;
				} else {
					a = this.e.split(" ").join("").split(",");
					i = a.length;
					while (--i > -1) {
						p = a[i];
						if (_specialProps[p]) {
							if (_specialProps[p].parse === transformParse) {
								clearTransform = true;
							} else {
								p = (p === "transformOrigin") ? _transformOriginProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
							}
						}
						_removeProp(s, p);
					}
				}
				if (clearTransform) {
					_removeProp(s, _transformProp);
					transform = this.t._gsTransform;
					if (transform) {
						if (transform.svg) {
							this.t.removeAttribute("data-svg-origin");
							this.t.removeAttribute("transform");
						}
						delete this.t._gsTransform;
					}
				}

			}
		};
		_registerComplexSpecialProp("clearProps", {parser:function(t, e, p, cssp, pt) {
			pt = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClearPropsRatio;
			pt.e = e;
			pt.pr = -10;
			pt.data = cssp._tween;
			_hasPriority = true;
			return pt;
		}});

		p = "bezier,throwProps,physicsProps,physics2D".split(",");
		i = p.length;
		while (i--) {
			_registerPluginProp(p[i]);
		}








		p = CSSPlugin.prototype;
		p._firstPT = p._lastParsedTransform = p._transform = null;

		//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
		p._onInitTween = function(target, vars, tween, index) {
			if (!target.nodeType) { //css is only for dom elements
				return false;
			}
			this._target = _target = target;
			this._tween = tween;
			this._vars = vars;
			_index = index;
			_autoRound = vars.autoRound;
			_hasPriority = false;
			_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
			_cs = _getComputedStyle(target, "");
			_overwriteProps = this._overwriteProps;
			var style = target.style,
				v, pt, pt2, first, last, next, zIndex, tpt, threeD;
			if (_reqSafariFix) if (style.zIndex === "") {
				v = _getStyle(target, "zIndex", _cs);
				if (v === "auto" || v === "") {
					//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
					this._addLazySet(style, "zIndex", 0);
				}
			}

			if (typeof(vars) === "string") {
				first = style.cssText;
				v = _getAllStyles(target, _cs);
				style.cssText = first + ";" + vars;
				v = _cssDif(target, v, _getAllStyles(target)).difs;
				if (!_supportsOpacity && _opacityValExp.test(vars)) {
					v.opacity = parseFloat( RegExp.$1 );
				}
				vars = v;
				style.cssText = first;
			}

			if (vars.className) { //className tweens will combine any differences they find in the css with the vars that are passed in, so {className:"myClass", scale:0.5, left:20} would work.
				this._firstPT = pt = _specialProps.className.parse(target, vars.className, "className", this, null, null, vars);
			} else {
				this._firstPT = pt = this.parse(target, vars, null);
			}

			if (this._transformType) {
				threeD = (this._transformType === 3);
				if (!_transformProp) {
					style.zoom = 1; //helps correct an IE issue.
				} else if (_isSafari) {
					_reqSafariFix = true;
					//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
					if (style.zIndex === "") {
						zIndex = _getStyle(target, "zIndex", _cs);
						if (zIndex === "auto" || zIndex === "") {
							this._addLazySet(style, "zIndex", 0);
						}
					}
					//Setting WebkitBackfaceVisibility corrects 3 bugs:
					// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
					// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
					// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
					//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
					if (_isSafariLT6) {
						this._addLazySet(style, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden"));
					}
				}
				pt2 = pt;
				while (pt2 && pt2._next) {
					pt2 = pt2._next;
				}
				tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
				this._linkCSSP(tpt, null, pt2);
				tpt.setRatio = _transformProp ? _setTransformRatio : _setIETransformRatio;
				tpt.data = this._transform || _getTransform(target, _cs, true);
				tpt.tween = tween;
				tpt.pr = -1; //ensures that the transforms get applied after the components are updated.
				_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
			}

			if (_hasPriority) {
				//reorders the linked list in order of pr (priority)
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				this._firstPT = first;
			}
			return true;
		};


		p.parse = function(target, vars, pt, plugin) {
			var style = target.style,
				p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
			for (p in vars) {
				es = vars[p]; //ending value string
				if (typeof(es) === "function") {
					es = es(_index, _target);
				}
				sp = _specialProps[p]; //SpecialProp lookup.
				if (sp) {
					pt = sp.parse(target, es, p, this, pt, plugin, vars);

				} else {
					bs = _getStyle(target, p, _cs) + "";
					isStr = (typeof(es) === "string");
					if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) { //Opera uses background: to define color sometimes in addition to backgroundColor:
						if (!isStr) {
							es = _parseColor(es);
							es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
						}
						pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);

					} else if (isStr && _complexExp.test(es)) {
						pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);

					} else {
						bn = parseFloat(bs);
						bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.

						if (bs === "" || bs === "auto") {
							if (p === "width" || p === "height") {
								bn = _getDimension(target, p, _cs);
								bsfx = "px";
							} else if (p === "left" || p === "top") {
								bn = _calculateOffset(target, p, _cs);
								bsfx = "px";
							} else {
								bn = (p !== "opacity") ? 0 : 1;
								bsfx = "";
							}
						}

						rel = (isStr && es.charAt(1) === "=");
						if (rel) {
							en = parseInt(es.charAt(0) + "1", 10);
							es = es.substr(2);
							en *= parseFloat(es);
							esfx = es.replace(_suffixExp, "");
						} else {
							en = parseFloat(es);
							esfx = isStr ? es.replace(_suffixExp, "") : "";
						}

						if (esfx === "") {
							esfx = (p in _suffixMap) ? _suffixMap[p] : bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
						}

						es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.

						//if the beginning/ending suffixes don't match, normalize them...
						if (bsfx !== esfx) if (esfx !== "") if (en || en === 0) if (bn) { //note: if the beginning value (bn) is 0, we don't need to convert units!
							bn = _convertToPixels(target, p, bn, bsfx);
							if (esfx === "%") {
								bn /= _convertToPixels(target, p, 100, "%") / 100;
								if (vars.strictUnits !== true) { //some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
									bs = bn + "%";
								}

							} else if (esfx === "em" || esfx === "rem" || esfx === "vw" || esfx === "vh") {
								bn /= _convertToPixels(target, p, 1, esfx);

							//otherwise convert to pixels.
							} else if (esfx !== "px") {
								en = _convertToPixels(target, p, en, esfx);
								esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
							}
							if (rel) if (en || en === 0) {
								es = (en + bn) + esfx; //the changes we made affect relative calculations, so adjust the end value here.
							}
						}

						if (rel) {
							en += bn;
						}

						if ((bn || bn === 0) && (en || en === 0)) { //faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
							pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
							pt.xs0 = esfx;
							//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
						} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
							_log("invalid " + p + " tween value: " + vars[p]);
						} else {
							pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
							pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
							//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
						}
					}
				}
				if (plugin) if (pt && !pt.plugin) {
					pt.plugin = plugin;
				}
			}
			return pt;
		};


		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
		p.setRatio = function(v) {
			var pt = this._firstPT,
				min = 0.000001,
				val, str, i;
			//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
			if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
				while (pt) {
					if (pt.type !== 2) {
						if (pt.r && pt.type !== -1) {
							val = Math.round(pt.s + pt.c);
							if (!pt.type) {
								pt.t[pt.p] = val + pt.xs0;
							} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
								i = pt.l;
								str = pt.xs0 + val + pt.xs1;
								for (i = 1; i < pt.l; i++) {
									str += pt["xn"+i] + pt["xs"+(i+1)];
								}
								pt.t[pt.p] = str;
							}
						} else {
							pt.t[pt.p] = pt.e;
						}
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
				while (pt) {
					val = pt.c * v + pt.s;
					if (pt.r) {
						val = Math.round(val);
					} else if (val < min) if (val > -min) {
						val = 0;
					}
					if (!pt.type) {
						pt.t[pt.p] = val + pt.xs0;
					} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
						i = pt.l;
						if (i === 2) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
						} else if (i === 3) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
						} else if (i === 4) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
						} else if (i === 5) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
						} else {
							str = pt.xs0 + val + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt.t[pt.p] = str;
						}

					} else if (pt.type === -1) { //non-tweening value
						pt.t[pt.p] = pt.xs0;

					} else if (pt.setRatio) { //custom setRatio() for things like SpecialProps, external plugins, etc.
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
			} else {
				while (pt) {
					if (pt.type !== 2) {
						pt.t[pt.p] = pt.b;
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}
			}
		};

		/**
		 * @private
		 * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
		 * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
		 * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
		 * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
		 * doesn't have any transform-related properties of its own. You can call this method as many times as you
		 * want and it won't create duplicate CSSPropTweens.
		 *
		 * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
		 */
		p._enableTransforms = function(threeD) {
			this._transform = this._transform || _getTransform(this._target, _cs, true); //ensures that the element has a _gsTransform property with the appropriate values.
			this._transformType = (!(this._transform.svg && _useSVGTransformAttr) && (threeD || this._transformType === 3)) ? 3 : 2;
		};

		var lazySet = function(v) {
			this.t[this.p] = this.e;
			this.data._linkCSSP(this, this._next, null, true); //we purposefully keep this._next even though it'd make sense to null it, but this is a performance optimization, as this happens during the while (pt) {} loop in setRatio() at the bottom of which it sets pt = pt._next, so if we null it, the linked list will be broken in that loop.
		};
		/** @private Gives us a way to set a value on the first render (and only the first render). **/
		p._addLazySet = function(t, p, v) {
			var pt = this._firstPT = new CSSPropTween(t, p, 0, 0, this._firstPT, 2);
			pt.e = v;
			pt.setRatio = lazySet;
			pt.data = this;
		};

		/** @private **/
		p._linkCSSP = function(pt, next, prev, remove) {
			if (pt) {
				if (next) {
					next._prev = pt;
				}
				if (pt._next) {
					pt._next._prev = pt._prev;
				}
				if (pt._prev) {
					pt._prev._next = pt._next;
				} else if (this._firstPT === pt) {
					this._firstPT = pt._next;
					remove = true; //just to prevent resetting this._firstPT 5 lines down in case pt._next is null. (optimized for speed)
				}
				if (prev) {
					prev._next = pt;
				} else if (!remove && this._firstPT === null) {
					this._firstPT = pt;
				}
				pt._next = next;
				pt._prev = prev;
			}
			return pt;
		};

		p._mod = function(lookup) {
			var pt = this._firstPT;
			while (pt) {
				if (typeof(lookup[pt.p]) === "function" && lookup[pt.p] === Math.round) { //only gets called by RoundPropsPlugin (ModifyPlugin manages all the rendering internally for CSSPlugin properties that need modification). Remember, we handle rounding a bit differently in this plugin for performance reasons, leveraging "r" as an indicator that the value should be rounded internally..
					pt.r = 1;
				}
				pt = pt._next;
			}
		};

		//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
		p._kill = function(lookup) {
			var copy = lookup,
				pt, p, xfirst;
			if (lookup.autoAlpha || lookup.alpha) {
				copy = {};
				for (p in lookup) { //copy the lookup so that we're not changing the original which may be passed elsewhere.
					copy[p] = lookup[p];
				}
				copy.opacity = 1;
				if (copy.autoAlpha) {
					copy.visibility = 1;
				}
			}
			if (lookup.className && (pt = this._classNamePT)) { //for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
				xfirst = pt.xfirst;
				if (xfirst && xfirst._prev) {
					this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
				} else if (xfirst === this._firstPT) {
					this._firstPT = pt._next;
				}
				if (pt._next) {
					this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
				}
				this._classNamePT = null;
			}
			pt = this._firstPT;
			while (pt) {
				if (pt.plugin && pt.plugin !== p && pt.plugin._kill) { //for plugins that are registered with CSSPlugin, we should notify them of the kill.
					pt.plugin._kill(lookup);
					p = pt.plugin;
				}
				pt = pt._next;
			}
			return TweenPlugin.prototype._kill.call(this, copy);
		};



		//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
		var _getChildStyles = function(e, props, targets) {
				var children, i, child, type;
				if (e.slice) {
					i = e.length;
					while (--i > -1) {
						_getChildStyles(e[i], props, targets);
					}
					return;
				}
				children = e.childNodes;
				i = children.length;
				while (--i > -1) {
					child = children[i];
					type = child.type;
					if (child.style) {
						props.push(_getAllStyles(child));
						if (targets) {
							targets.push(child);
						}
					}
					if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
						_getChildStyles(child, props, targets);
					}
				}
			};

		/**
		 * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
		 * and then compares the style properties of all the target's child elements at the tween's start and end, and
		 * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
		 * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
		 * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
		 * is because it creates entirely new tweens that may have completely different targets than the original tween,
		 * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
		 * and it would create other problems. For example:
		 *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
		 *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
		 *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
		 *
		 * @param {Object} target object to be tweened
		 * @param {number} Duration in seconds (or frames for frames-based tweens)
		 * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
		 * @return {Array} An array of TweenLite instances
		 */
		CSSPlugin.cascadeTo = function(target, duration, vars) {
			var tween = TweenLite.to(target, duration, vars),
				results = [tween],
				b = [],
				e = [],
				targets = [],
				_reservedProps = TweenLite._internals.reservedProps,
				i, difs, p, from;
			target = tween._targets || tween.target;
			_getChildStyles(target, b, targets);
			tween.render(duration, true, true);
			_getChildStyles(target, e);
			tween.render(0, true, true);
			tween._enabled(true);
			i = targets.length;
			while (--i > -1) {
				difs = _cssDif(targets[i], b[i], e[i]);
				if (difs.firstMPT) {
					difs = difs.difs;
					for (p in vars) {
						if (_reservedProps[p]) {
							difs[p] = vars[p];
						}
					}
					from = {};
					for (p in difs) {
						from[p] = b[i][p];
					}
					results.push(TweenLite.fromTo(targets[i], duration, from, difs));
				}
			}
			return results;
		};

		TweenPlugin.activate([CSSPlugin]);
		return CSSPlugin;

	}, true);

	
	
	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * RoundPropsPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var RoundPropsPlugin = _gsScope._gsDefine.plugin({
				propName: "roundProps",
				version: "1.6.0",
				priority: -1,
				API: 2,

				//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
				init: function(target, value, tween) {
					this._tween = tween;
					return true;
				}

			}),
			_roundLinkedList = function(node) {
				while (node) {
					if (!node.f && !node.blob) {
						node.m = Math.round;
					}
					node = node._next;
				}
			},
			p = RoundPropsPlugin.prototype;

		p._onInitAllProps = function() {
			var tween = this._tween,
				rp = (tween.vars.roundProps.join) ? tween.vars.roundProps : tween.vars.roundProps.split(","),
				i = rp.length,
				lookup = {},
				rpt = tween._propLookup.roundProps,
				prop, pt, next;
			while (--i > -1) {
				lookup[rp[i]] = Math.round;
			}
			i = rp.length;
			while (--i > -1) {
				prop = rp[i];
				pt = tween._firstPT;
				while (pt) {
					next = pt._next; //record here, because it may get removed
					if (pt.pg) {
						pt.t._mod(lookup);
					} else if (pt.n === prop) {
						if (pt.f === 2 && pt.t) { //a blob (text containing multiple numeric values)
							_roundLinkedList(pt.t._firstPT);
						} else {
							this._add(pt.t, prop, pt.s, pt.c);
							//remove from linked list
							if (next) {
								next._prev = pt._prev;
							}
							if (pt._prev) {
								pt._prev._next = next;
							} else if (tween._firstPT === pt) {
								tween._firstPT = next;
							}
							pt._next = pt._prev = null;
							tween._propLookup[prop] = rpt;
						}
					}
					pt = next;
				}
			}
			return false;
		};

		p._add = function(target, p, s, c) {
			this._addTween(target, p, s, s + c, p, Math.round);
			this._overwriteProps.push(p);
		};

	}());










/*
 * ----------------------------------------------------------------
 * AttrPlugin
 * ----------------------------------------------------------------
 */

	(function() {

		_gsScope._gsDefine.plugin({
			propName: "attr",
			API: 2,
			version: "0.6.0",

			//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
			init: function(target, value, tween, index) {
				var p, end;
				if (typeof(target.setAttribute) !== "function") {
					return false;
				}
				for (p in value) {
					end = value[p];
					if (typeof(end) === "function") {
						end = end(index, target);
					}
					this._addTween(target, "setAttribute", target.getAttribute(p) + "", end + "", p, false, p);
					this._overwriteProps.push(p);
				}
				return true;
			}

		});

	}());










/*
 * ----------------------------------------------------------------
 * DirectionalRotationPlugin
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine.plugin({
		propName: "directionalRotation",
		version: "0.3.0",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween, index) {
			if (typeof(value) !== "object") {
				value = {rotation:value};
			}
			this.finals = {};
			var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
				min = 0.000001,
				p, v, start, end, dif, split;
			for (p in value) {
				if (p !== "useRadians") {
					end = value[p];
					if (typeof(end) === "function") {
						end = end(index, target);
					}
					split = (end + "").split("_");
					v = split[0];
					start = parseFloat( (typeof(target[p]) !== "function") ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
					end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
					dif = end - start;
					if (split.length) {
						v = split.join("_");
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					if (dif > min || dif < -min) {
						this._addTween(target, p, start, start + dif, p);
						this._overwriteProps.push(p);
					}
				}
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			var pt;
			if (ratio !== 1) {
				this._super.setRatio.call(this, ratio);
			} else {
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](this.finals[pt.p]);
					} else {
						pt.t[pt.p] = this.finals[pt.p];
					}
					pt = pt._next;
				}
			}
		}

	})._autoCSS = true;







	
	
	
	
/*
 * ----------------------------------------------------------------
 * EasePack
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
		
		var w = (_gsScope.GreenSockGlobals || _gsScope),
			gs = w.com.greensock,
			_2PI = Math.PI * 2,
			_HALF_PI = Math.PI / 2,
			_class = gs._class,
			_create = function(n, f) {
				var C = _class("easing." + n, function(){}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				return C;
			},
			_easeReg = Ease.register || function(){}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
			_wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
				var C = _class("easing."+name, {
					easeOut:new EaseOut(),
					easeIn:new EaseIn(),
					easeInOut:new EaseInOut()
				}, true);
				_easeReg(C, name);
				return C;
			},
			EasePoint = function(time, value, next) {
				this.t = time;
				this.v = value;
				if (next) {
					this.next = next;
					next.prev = this;
					this.c = next.v - value;
					this.gap = next.t - time;
				}
			},

			//Back
			_createBack = function(n, f) {
				var C = _class("easing." + n, function(overshoot) {
						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
						this._p2 = this._p1 * 1.525;
					}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				p.config = function(overshoot) {
					return new C(overshoot);
				};
				return C;
			},

			Back = _wrap("Back",
				_createBack("BackOut", function(p) {
					return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
				}),
				_createBack("BackIn", function(p) {
					return p * p * ((this._p1 + 1) * p - this._p1);
				}),
				_createBack("BackInOut", function(p) {
					return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
				})
			),


			//SlowMo
			SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
				power = (power || power === 0) ? power : 0.7;
				if (linearRatio == null) {
					linearRatio = 0.7;
				} else if (linearRatio > 1) {
					linearRatio = 1;
				}
				this._p = (linearRatio !== 1) ? power : 0;
				this._p1 = (1 - linearRatio) / 2;
				this._p2 = linearRatio;
				this._p3 = this._p1 + this._p2;
				this._calcEnd = (yoyoMode === true);
			}, true),
			p = SlowMo.prototype = new Ease(),
			SteppedEase, RoughEase, _createElastic;

		p.constructor = SlowMo;
		p.getRatio = function(p) {
			var r = p + (0.5 - p) * this._p;
			if (p < this._p1) {
				return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
			} else if (p > this._p3) {
				return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
			}
			return this._calcEnd ? 1 : r;
		};
		SlowMo.ease = new SlowMo(0.7, 0.7);

		p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
			return new SlowMo(linearRatio, power, yoyoMode);
		};


		//SteppedEase
		SteppedEase = _class("easing.SteppedEase", function(steps) {
				steps = steps || 1;
				this._p1 = 1 / steps;
				this._p2 = steps + 1;
			}, true);
		p = SteppedEase.prototype = new Ease();
		p.constructor = SteppedEase;
		p.getRatio = function(p) {
			if (p < 0) {
				p = 0;
			} else if (p >= 1) {
				p = 0.999999999;
			}
			return ((this._p2 * p) >> 0) * this._p1;
		};
		p.config = SteppedEase.config = function(steps) {
			return new SteppedEase(steps);
		};


		//RoughEase
		RoughEase = _class("easing.RoughEase", function(vars) {
			vars = vars || {};
			var taper = vars.taper || "none",
				a = [],
				cnt = 0,
				points = (vars.points || 20) | 0,
				i = points,
				randomize = (vars.randomize !== false),
				clamp = (vars.clamp === true),
				template = (vars.template instanceof Ease) ? vars.template : null,
				strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
				x, y, bump, invX, obj, pnt;
			while (--i > -1) {
				x = randomize ? Math.random() : (1 / points) * i;
				y = template ? template.getRatio(x) : x;
				if (taper === "none") {
					bump = strength;
				} else if (taper === "out") {
					invX = 1 - x;
					bump = invX * invX * strength;
				} else if (taper === "in") {
					bump = x * x * strength;
				} else if (x < 0.5) {  //"both" (start)
					invX = x * 2;
					bump = invX * invX * 0.5 * strength;
				} else {				//"both" (end)
					invX = (1 - x) * 2;
					bump = invX * invX * 0.5 * strength;
				}
				if (randomize) {
					y += (Math.random() * bump) - (bump * 0.5);
				} else if (i % 2) {
					y += bump * 0.5;
				} else {
					y -= bump * 0.5;
				}
				if (clamp) {
					if (y > 1) {
						y = 1;
					} else if (y < 0) {
						y = 0;
					}
				}
				a[cnt++] = {x:x, y:y};
			}
			a.sort(function(a, b) {
				return a.x - b.x;
			});

			pnt = new EasePoint(1, 1, null);
			i = points;
			while (--i > -1) {
				obj = a[i];
				pnt = new EasePoint(obj.x, obj.y, pnt);
			}

			this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
		}, true);
		p = RoughEase.prototype = new Ease();
		p.constructor = RoughEase;
		p.getRatio = function(p) {
			var pnt = this._prev;
			if (p > pnt.t) {
				while (pnt.next && p >= pnt.t) {
					pnt = pnt.next;
				}
				pnt = pnt.prev;
			} else {
				while (pnt.prev && p <= pnt.t) {
					pnt = pnt.prev;
				}
			}
			this._prev = pnt;
			return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
		};
		p.config = function(vars) {
			return new RoughEase(vars);
		};
		RoughEase.ease = new RoughEase();


		//Bounce
		_wrap("Bounce",
			_create("BounceOut", function(p) {
				if (p < 1 / 2.75) {
					return 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				}
				return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
			}),
			_create("BounceIn", function(p) {
				if ((p = 1 - p) < 1 / 2.75) {
					return 1 - (7.5625 * p * p);
				} else if (p < 2 / 2.75) {
					return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
				} else if (p < 2.5 / 2.75) {
					return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
				}
				return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
			}),
			_create("BounceInOut", function(p) {
				var invert = (p < 0.5);
				if (invert) {
					p = 1 - (p * 2);
				} else {
					p = (p * 2) - 1;
				}
				if (p < 1 / 2.75) {
					p = 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				} else {
					p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
				}
				return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
			})
		);


		//CIRC
		_wrap("Circ",
			_create("CircOut", function(p) {
				return Math.sqrt(1 - (p = p - 1) * p);
			}),
			_create("CircIn", function(p) {
				return -(Math.sqrt(1 - (p * p)) - 1);
			}),
			_create("CircInOut", function(p) {
				return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
			})
		);


		//Elastic
		_createElastic = function(n, f, def) {
			var C = _class("easing." + n, function(amplitude, period) {
					this._p1 = (amplitude >= 1) ? amplitude : 1; //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
					this._p2 = (period || def) / (amplitude < 1 ? amplitude : 1);
					this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
					this._p2 = _2PI / this._p2; //precalculate to optimize
				}, true),
				p = C.prototype = new Ease();
			p.constructor = C;
			p.getRatio = f;
			p.config = function(amplitude, period) {
				return new C(amplitude, period);
			};
			return C;
		};
		_wrap("Elastic",
			_createElastic("ElasticOut", function(p) {
				return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * this._p2 ) + 1;
			}, 0.3),
			_createElastic("ElasticIn", function(p) {
				return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2 ));
			}, 0.3),
			_createElastic("ElasticInOut", function(p) {
				return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * this._p2 ) * 0.5 + 1;
			}, 0.45)
		);


		//Expo
		_wrap("Expo",
			_create("ExpoOut", function(p) {
				return 1 - Math.pow(2, -10 * p);
			}),
			_create("ExpoIn", function(p) {
				return Math.pow(2, 10 * (p - 1)) - 0.001;
			}),
			_create("ExpoInOut", function(p) {
				return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
			})
		);


		//Sine
		_wrap("Sine",
			_create("SineOut", function(p) {
				return Math.sin(p * _HALF_PI);
			}),
			_create("SineIn", function(p) {
				return -Math.cos(p * _HALF_PI) + 1;
			}),
			_create("SineInOut", function(p) {
				return -0.5 * (Math.cos(Math.PI * p) - 1);
			})
		);

		_class("easing.EaseLookup", {
				find:function(s) {
					return Ease.map[s];
				}
			}, true);

		//register the non-standard eases
		_easeReg(w.SlowMo, "SlowMo", "ease,");
		_easeReg(RoughEase, "RoughEase", "ease,");
		_easeReg(SteppedEase, "SteppedEase", "ease,");

		return Back;
		
	}, true);


});

if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); } //necessary in case TweenLite was already loaded separately.











/*
 * ----------------------------------------------------------------
 * Base classes like TweenLite, SimpleTimeline, Ease, Ticker, etc.
 * ----------------------------------------------------------------
 */
(function(window, moduleName) {

		"use strict";
		var _exports = {},
			_globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
		if (_globals.TweenLite) {
			return; //in case the core set of classes is already loaded, don't instantiate twice.
		}
		var _namespace = function(ns) {
				var a = ns.split("."),
					p = _globals, i;
				for (i = 0; i < a.length; i++) {
					p[a[i]] = p = p[a[i]] || {};
				}
				return p;
			},
			gs = _namespace("com.greensock"),
			_tinyNum = 0.0000000001,
			_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++])) {}
				return b;
			},
			_emptyFunc = function() {},
			_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
				var toString = Object.prototype.toString,
					array = toString.call([]);
				return function(obj) {
					return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
				};
			}()),
			a, i, p, _ticker, _tickerActive,
			_defLookup = {},

			/**
			 * @constructor
			 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
			 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
			 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
			 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
			 *
			 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
			 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
			 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
			 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
			 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
			 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
			 * sandbox the banner one like:
			 *
			 * <script>
			 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
			 * </script>
			 * <script src="js/greensock/v1.7/TweenMax.js"></script>
			 * <script>
			 *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
			 * </script>
			 * <script src="js/greensock/v1.6/TweenMax.js"></script>
			 * <script>
			 *     gs.TweenLite.to(...); //would use v1.7
			 *     TweenLite.to(...); //would use v1.6
			 * </script>
			 *
			 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
			 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
			 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
			 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
			 */
			Definition = function(ns, dependencies, func, global) {
				this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
				_defLookup[ns] = this;
				this.gsClass = null;
				this.func = func;
				var _classes = [];
				this.check = function(init) {
					var i = dependencies.length,
						missing = i,
						cur, a, n, cl, hasModule;
					while (--i > -1) {
						if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
							_classes[i] = cur.gsClass;
							missing--;
						} else if (init) {
							cur.sc.push(this);
						}
					}
					if (missing === 0 && func) {
						a = ("com.greensock." + ns).split(".");
						n = a.pop();
						cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

						//exports to multiple environments
						if (global) {
							_globals[n] = _exports[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
							hasModule = (typeof(module) !== "undefined" && module.exports);
							if (!hasModule && typeof(define) === "function" && define.amd){ //AMD
								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
							} else if (hasModule){ //node
								if (ns === moduleName) {
									module.exports = _exports[moduleName] = cl;
									for (i in _exports) {
										cl[i] = _exports[i];
									}
								} else if (_exports[moduleName]) {
									_exports[moduleName][n] = cl;
								}
							}
						}
						for (i = 0; i < this.sc.length; i++) {
							this.sc[i].check();
						}
					}
				};
				this.check(true);
			},

			//used to create Definition instances (which basically registers a class that has dependencies).
			_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
				return new Definition(ns, dependencies, func, global);
			},

			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
			_class = gs._class = function(ns, func, global) {
				func = func || function() {};
				_gsDefine(ns, [], function(){ return func; }, global);
				return func;
			};

		_gsDefine.globals = _globals;



/*
 * ----------------------------------------------------------------
 * Ease
 * ----------------------------------------------------------------
 */
		var _baseParams = [0, 0, 1, 1],
			_blankArray = [],
			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
				this._func = func;
				this._type = type || 0;
				this._power = power || 0;
				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
			}, true),
			_easeMap = Ease.map = {},
			_easeReg = Ease.register = function(ease, names, types, create) {
				var na = names.split(","),
					i = na.length,
					ta = (types || "easeIn,easeOut,easeInOut").split(","),
					e, name, j, type;
				while (--i > -1) {
					name = na[i];
					e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
					j = ta.length;
					while (--j > -1) {
						type = ta[j];
						_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
					}
				}
			};

		p = Ease.prototype;
		p._calcEnd = false;
		p.getRatio = function(p) {
			if (this._func) {
				this._params[0] = p;
				return this._func.apply(null, this._params);
			}
			var t = this._type,
				pw = this._power,
				r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
			if (pw === 1) {
				r *= r;
			} else if (pw === 2) {
				r *= r * r;
			} else if (pw === 3) {
				r *= r * r * r;
			} else if (pw === 4) {
				r *= r * r * r * r;
			}
			return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
		};

		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
		a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
		i = a.length;
		while (--i > -1) {
			p = a[i]+",Power"+i;
			_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
			_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
			_easeReg(new Ease(null,null,3,i), p, "easeInOut");
		}
		_easeMap.linear = gs.easing.Linear.easeIn;
		_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


/*
 * ----------------------------------------------------------------
 * EventDispatcher
 * ----------------------------------------------------------------
 */
		var EventDispatcher = _class("events.EventDispatcher", function(target) {
			this._listeners = {};
			this._eventTarget = target || this;
		});
		p = EventDispatcher.prototype;

		p.addEventListener = function(type, callback, scope, useParam, priority) {
			priority = priority || 0;
			var list = this._listeners[type],
				index = 0,
				listener, i;
			if (this === _ticker && !_tickerActive) {
				_ticker.wake();
			}
			if (list == null) {
				this._listeners[type] = list = [];
			}
			i = list.length;
			while (--i > -1) {
				listener = list[i];
				if (listener.c === callback && listener.s === scope) {
					list.splice(i, 1);
				} else if (index === 0 && listener.pr < priority) {
					index = i + 1;
				}
			}
			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
		};

		p.removeEventListener = function(type, callback) {
			var list = this._listeners[type], i;
			if (list) {
				i = list.length;
				while (--i > -1) {
					if (list[i].c === callback) {
						list.splice(i, 1);
						return;
					}
				}
			}
		};

		p.dispatchEvent = function(type) {
			var list = this._listeners[type],
				i, t, listener;
			if (list) {
				i = list.length;
				if (i > 1) {
					list = list.slice(0); //in case addEventListener() is called from within a listener/callback (otherwise the index could change, resulting in a skip)
				}
				t = this._eventTarget;
				while (--i > -1) {
					listener = list[i];
					if (listener) {
						if (listener.up) {
							listener.c.call(listener.s || t, {type:type, target:t});
						} else {
							listener.c.call(listener.s || t);
						}
					}
				}
			}
		};


/*
 * ----------------------------------------------------------------
 * Ticker
 * ----------------------------------------------------------------
 */
 		var _reqAnimFrame = window.requestAnimationFrame,
			_cancelAnimFrame = window.cancelAnimationFrame,
			_getTime = Date.now || function() {return new Date().getTime();},
			_lastUpdate = _getTime();

		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
		a = ["ms","moz","webkit","o"];
		i = a.length;
		while (--i > -1 && !_reqAnimFrame) {
			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
		}

		_class("Ticker", function(fps, useRAF) {
			var _self = this,
				_startTime = _getTime(),
				_useRAF = (useRAF !== false && _reqAnimFrame) ? "auto" : false,
				_lagThreshold = 500,
				_adjustedLag = 33,
				_tickWord = "tick", //helps reduce gc burden
				_fps, _req, _id, _gap, _nextTime,
				_tick = function(manual) {
					var elapsed = _getTime() - _lastUpdate,
						overlap, dispatch;
					if (elapsed > _lagThreshold) {
						_startTime += elapsed - _adjustedLag;
					}
					_lastUpdate += elapsed;
					_self.time = (_lastUpdate - _startTime) / 1000;
					overlap = _self.time - _nextTime;
					if (!_fps || overlap > 0 || manual === true) {
						_self.frame++;
						_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
						dispatch = true;
					}
					if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
						_id = _req(_tick);
					}
					if (dispatch) {
						_self.dispatchEvent(_tickWord);
					}
				};

			EventDispatcher.call(_self);
			_self.time = _self.frame = 0;
			_self.tick = function() {
				_tick(true);
			};

			_self.lagSmoothing = function(threshold, adjustedLag) {
				_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
				_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
			};

			_self.sleep = function() {
				if (_id == null) {
					return;
				}
				if (!_useRAF || !_cancelAnimFrame) {
					clearTimeout(_id);
				} else {
					_cancelAnimFrame(_id);
				}
				_req = _emptyFunc;
				_id = null;
				if (_self === _ticker) {
					_tickerActive = false;
				}
			};

			_self.wake = function(seamless) {
				if (_id !== null) {
					_self.sleep();
				} else if (seamless) {
					_startTime += -_lastUpdate + (_lastUpdate = _getTime());
				} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
					_lastUpdate = _getTime() - _lagThreshold + 5;
				}
				_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
				if (_self === _ticker) {
					_tickerActive = true;
				}
				_tick(2);
			};

			_self.fps = function(value) {
				if (!arguments.length) {
					return _fps;
				}
				_fps = value;
				_gap = 1 / (_fps || 60);
				_nextTime = this.time + _gap;
				_self.wake();
			};

			_self.useRAF = function(value) {
				if (!arguments.length) {
					return _useRAF;
				}
				_self.sleep();
				_useRAF = value;
				_self.fps(_fps);
			};
			_self.fps(fps);

			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
			setTimeout(function() {
				if (_useRAF === "auto" && _self.frame < 5 && document.visibilityState !== "hidden") {
					_self.useRAF(false);
				}
			}, 1500);
		});

		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
		p.constructor = gs.Ticker;


/*
 * ----------------------------------------------------------------
 * Animation
 * ----------------------------------------------------------------
 */
		var Animation = _class("core.Animation", function(duration, vars) {
				this.vars = vars = vars || {};
				this._duration = this._totalDuration = duration || 0;
				this._delay = Number(vars.delay) || 0;
				this._timeScale = 1;
				this._active = (vars.immediateRender === true);
				this.data = vars.data;
				this._reversed = (vars.reversed === true);

				if (!_rootTimeline) {
					return;
				}
				if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
					_ticker.wake();
				}

				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
				tl.add(this, tl._time);

				if (this.vars.paused) {
					this.paused(true);
				}
			});

		_ticker = Animation.ticker = new gs.Ticker();
		p = Animation.prototype;
		p._dirty = p._gc = p._initted = p._paused = false;
		p._totalTime = p._time = 0;
		p._rawPrevTime = -1;
		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
		p._paused = false;


		//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
		var _checkTimeout = function() {
				if (_tickerActive && _getTime() - _lastUpdate > 2000) {
					_ticker.wake();
				}
				setTimeout(_checkTimeout, 2000);
			};
		_checkTimeout();


		p.play = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.reversed(false).paused(false);
		};

		p.pause = function(atTime, suppressEvents) {
			if (atTime != null) {
				this.seek(atTime, suppressEvents);
			}
			return this.paused(true);
		};

		p.resume = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.paused(false);
		};

		p.seek = function(time, suppressEvents) {
			return this.totalTime(Number(time), suppressEvents !== false);
		};

		p.restart = function(includeDelay, suppressEvents) {
			return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
		};

		p.reverse = function(from, suppressEvents) {
			if (from != null) {
				this.seek((from || this.totalDuration()), suppressEvents);
			}
			return this.reversed(true).paused(false);
		};

		p.render = function(time, suppressEvents, force) {
			//stub - we override this method in subclasses.
		};

		p.invalidate = function() {
			this._time = this._totalTime = 0;
			this._initted = this._gc = false;
			this._rawPrevTime = -1;
			if (this._gc || !this.timeline) {
				this._enabled(true);
			}
			return this;
		};

		p.isActive = function() {
			var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
				startTime = this._startTime,
				rawTime;
			return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
		};

		p._enabled = function (enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			this._gc = !enabled;
			this._active = this.isActive();
			if (ignoreTimeline !== true) {
				if (enabled && !this.timeline) {
					this._timeline.add(this, this._startTime - this._delay);
				} else if (!enabled && this.timeline) {
					this._timeline._remove(this, true);
				}
			}
			return false;
		};


		p._kill = function(vars, target) {
			return this._enabled(false, false);
		};

		p.kill = function(vars, target) {
			this._kill(vars, target);
			return this;
		};

		p._uncache = function(includeSelf) {
			var tween = includeSelf ? this : this.timeline;
			while (tween) {
				tween._dirty = true;
				tween = tween.timeline;
			}
			return this;
		};

		p._swapSelfInParams = function(params) {
			var i = params.length,
				copy = params.concat();
			while (--i > -1) {
				if (params[i] === "{self}") {
					copy[i] = this;
				}
			}
			return copy;
		};

		p._callback = function(type) {
			var v = this.vars,
				callback = v[type],
				params = v[type + "Params"],
				scope = v[type + "Scope"] || v.callbackScope || this,
				l = params ? params.length : 0;
			switch (l) { //speed optimization; call() is faster than apply() so use it when there are only a few parameters (which is by far most common). Previously we simply did var v = this.vars; v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
				case 0: callback.call(scope); break;
				case 1: callback.call(scope, params[0]); break;
				case 2: callback.call(scope, params[0], params[1]); break;
				default: callback.apply(scope, params);
			}
		};

//----Animation getters/setters --------------------------------------------------------

		p.eventCallback = function(type, callback, params, scope) {
			if ((type || "").substr(0,2) === "on") {
				var v = this.vars;
				if (arguments.length === 1) {
					return v[type];
				}
				if (callback == null) {
					delete v[type];
				} else {
					v[type] = callback;
					v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
					v[type + "Scope"] = scope;
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		};

		p.delay = function(value) {
			if (!arguments.length) {
				return this._delay;
			}
			if (this._timeline.smoothChildTiming) {
				this.startTime( this._startTime + value - this._delay );
			}
			this._delay = value;
			return this;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				this._dirty = false;
				return this._duration;
			}
			this._duration = this._totalDuration = value;
			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
			if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
				this.totalTime(this._totalTime * (value / this._duration), true);
			}
			return this;
		};

		p.totalDuration = function(value) {
			this._dirty = false;
			return (!arguments.length) ? this._totalDuration : this.duration(value);
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (!arguments.length) {
				return this._totalTime;
			}
			if (this._timeline) {
				if (time < 0 && !uncapped) {
					time += this.totalDuration();
				}
				if (this._timeline.smoothChildTiming) {
					if (this._dirty) {
						this.totalDuration();
					}
					var totalDuration = this._totalDuration,
						tl = this._timeline;
					if (time > totalDuration && !uncapped) {
						time = totalDuration;
					}
					this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
					if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
						this._uncache(false);
					}
					//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
					if (tl._timeline) {
						while (tl._timeline) {
							if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
								tl.totalTime(tl._totalTime, true);
							}
							tl = tl._timeline;
						}
					}
				}
				if (this._gc) {
					this._enabled(true, false);
				}
				if (this._totalTime !== time || this._duration === 0) {
					if (_lazyTweens.length) {
						_lazyRender();
					}
					this.render(time, suppressEvents, false);
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
						_lazyRender();
					}
				}
			}
			return this;
		};

		p.progress = p.totalProgress = function(value, suppressEvents) {
			var duration = this.duration();
			return (!arguments.length) ? (duration ? this._time / duration : this.ratio) : this.totalTime(duration * value, suppressEvents);
		};

		p.startTime = function(value) {
			if (!arguments.length) {
				return this._startTime;
			}
			if (value !== this._startTime) {
				this._startTime = value;
				if (this.timeline) if (this.timeline._sortChildren) {
					this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			return this;
		};

		p.endTime = function(includeRepeats) {
			return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
		};

		p.timeScale = function(value) {
			if (!arguments.length) {
				return this._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			if (this._timeline && this._timeline.smoothChildTiming) {
				var pauseTime = this._pauseTime,
					t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
			}
			this._timeScale = value;
			return this._uncache(false);
		};

		p.reversed = function(value) {
			if (!arguments.length) {
				return this._reversed;
			}
			if (value != this._reversed) {
				this._reversed = value;
				this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
			}
			return this;
		};

		p.paused = function(value) {
			if (!arguments.length) {
				return this._paused;
			}
			var tl = this._timeline,
				raw, elapsed;
			if (value != this._paused) if (tl) {
				if (!_tickerActive && !value) {
					_ticker.wake();
				}
				raw = tl.rawTime();
				elapsed = raw - this._pauseTime;
				if (!value && tl.smoothChildTiming) {
					this._startTime += elapsed;
					this._uncache(false);
				}
				this._pauseTime = value ? raw : null;
				this._paused = value;
				this._active = this.isActive();
				if (!value && elapsed !== 0 && this._initted && this.duration()) {
					raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
					this.render(raw, (raw === this._totalTime), true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
				}
			}
			if (this._gc && !value) {
				this._enabled(true, false);
			}
			return this;
		};


/*
 * ----------------------------------------------------------------
 * SimpleTimeline
 * ----------------------------------------------------------------
 */
		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
			Animation.call(this, 0, vars);
			this.autoRemoveChildren = this.smoothChildTiming = true;
		});

		p = SimpleTimeline.prototype = new Animation();
		p.constructor = SimpleTimeline;
		p.kill()._gc = false;
		p._first = p._last = p._recent = null;
		p._sortChildren = false;

		p.add = p.insert = function(child, position, align, stagger) {
			var prevTween, st;
			child._startTime = Number(position || 0) + child._delay;
			if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
				child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
			}
			if (child.timeline) {
				child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
			}
			child.timeline = child._timeline = this;
			if (child._gc) {
				child._enabled(true, true);
			}
			prevTween = this._last;
			if (this._sortChildren) {
				st = child._startTime;
				while (prevTween && prevTween._startTime > st) {
					prevTween = prevTween._prev;
				}
			}
			if (prevTween) {
				child._next = prevTween._next;
				prevTween._next = child;
			} else {
				child._next = this._first;
				this._first = child;
			}
			if (child._next) {
				child._next._prev = child;
			} else {
				this._last = child;
			}
			child._prev = prevTween;
			this._recent = child;
			if (this._timeline) {
				this._uncache(true);
			}
			return this;
		};

		p._remove = function(tween, skipDisable) {
			if (tween.timeline === this) {
				if (!skipDisable) {
					tween._enabled(false, true);
				}

				if (tween._prev) {
					tween._prev._next = tween._next;
				} else if (this._first === tween) {
					this._first = tween._next;
				}
				if (tween._next) {
					tween._next._prev = tween._prev;
				} else if (this._last === tween) {
					this._last = tween._prev;
				}
				tween._next = tween._prev = tween.timeline = null;
				if (tween === this._recent) {
					this._recent = this._last;
				}

				if (this._timeline) {
					this._uncache(true);
				}
			}
			return this;
		};

		p.render = function(time, suppressEvents, force) {
			var tween = this._first,
				next;
			this._totalTime = this._time = this._rawPrevTime = time;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (tween._active || (time >= tween._startTime && !tween._paused)) {
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
					}
				}
				tween = next;
			}
		};

		p.rawTime = function() {
			if (!_tickerActive) {
				_ticker.wake();
			}
			return this._totalTime;
		};

/*
 * ----------------------------------------------------------------
 * TweenLite
 * ----------------------------------------------------------------
 */
		var TweenLite = _class("TweenLite", function(target, duration, vars) {
				Animation.call(this, duration, vars);
				this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

				if (target == null) {
					throw "Cannot tween a null target.";
				}

				this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

				var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
					overwrite = this.vars.overwrite,
					i, targ, targets;

				this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

				if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
					this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					this._propLookup = [];
					this._siblings = [];
					for (i = 0; i < targets.length; i++) {
						targ = targets[i];
						if (!targ) {
							targets.splice(i--, 1);
							continue;
						} else if (typeof(targ) === "string") {
							targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
							if (typeof(targ) === "string") {
								targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
							}
							continue;
						} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
							targets.splice(i--, 1);
							this._targets = targets = targets.concat(_slice(targ));
							continue;
						}
						this._siblings[i] = _register(targ, this, false);
						if (overwrite === 1) if (this._siblings[i].length > 1) {
							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
						}
					}

				} else {
					this._propLookup = {};
					this._siblings = _register(target, this, false);
					if (overwrite === 1) if (this._siblings.length > 1) {
						_applyOverwrite(target, this, null, 1, this._siblings);
					}
				}
				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
					this.render(Math.min(0, -this._delay)); //in case delay is negative
				}
			}, true),
			_isSelector = function(v) {
				return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
			},
			_autoCSS = function(vars, target) {
				var css = {},
					p;
				for (p in vars) {
					if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
						css[p] = vars[p];
						delete vars[p];
					}
				}
				vars.css = css;
			};

		p = TweenLite.prototype = new Animation();
		p.constructor = TweenLite;
		p.kill()._gc = false;

//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

		p.ratio = 0;
		p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
		p._notifyPluginsOfEnabled = p._lazy = false;

		TweenLite.version = "1.19.0";
		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
		TweenLite.defaultOverwrite = "auto";
		TweenLite.ticker = _ticker;
		TweenLite.autoSleep = 120;
		TweenLite.lagSmoothing = function(threshold, adjustedLag) {
			_ticker.lagSmoothing(threshold, adjustedLag);
		};

		TweenLite.selector = window.$ || window.jQuery || function(e) {
			var selector = window.$ || window.jQuery;
			if (selector) {
				TweenLite.selector = selector;
				return selector(e);
			}
			return (typeof(document) === "undefined") ? e : (document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
		};

		var _lazyTweens = [],
			_lazyLookup = {},
			_numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
			//_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
			_setRatio = function(v) {
				var pt = this._firstPT,
					min = 0.000001,
					val;
				while (pt) {
					val = !pt.blob ? pt.c * v + pt.s : v ? this.join("") : this.start;
					if (pt.m) {
						val = pt.m(val, this._target || pt.t);
					} else if (val < min) if (val > -min) { //prevents issues with converting very small numbers to strings in the browser
						val = 0;
					}
					if (!pt.f) {
						pt.t[pt.p] = val;
					} else if (pt.fp) {
						pt.t[pt.p](pt.fp, val);
					} else {
						pt.t[pt.p](val);
					}
					pt = pt._next;
				}
			},
			//compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
			_blobDif = function(start, end, filter, pt) {
				var a = [start, end],
					charIndex = 0,
					s = "",
					color = 0,
					startNums, endNums, num, i, l, nonNumbers, currentNum;
				a.start = start;
				if (filter) {
					filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
					start = a[0];
					end = a[1];
				}
				a.length = 0;
				startNums = start.match(_numbersExp) || [];
				endNums = end.match(_numbersExp) || [];
				if (pt) {
					pt._next = null;
					pt.blob = 1;
					a._firstPT = a._applyPT = pt; //apply last in the linked list (which means inserting it first)
				}
				l = endNums.length;
				for (i = 0; i < l; i++) {
					currentNum = endNums[i];
					nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex)-charIndex);
					s += (nonNumbers || !i) ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
					charIndex += nonNumbers.length;
					if (color) { //sense rgba() values and round them.
						color = (color + 1) % 5;
					} else if (nonNumbers.substr(-5) === "rgba(") {
						color = 1;
					}
					if (currentNum === startNums[i] || startNums.length <= i) {
						s += currentNum;
					} else {
						if (s) {
							a.push(s);
							s = "";
						}
						num = parseFloat(startNums[i]);
						a.push(num);
						a._firstPT = {_next: a._firstPT, t:a, p: a.length-1, s:num, c:((currentNum.charAt(1) === "=") ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : (parseFloat(currentNum) - num)) || 0, f:0, m:(color && color < 4) ? Math.round : 0};
						//note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
					}
					charIndex += currentNum.length;
				}
				s += end.substr(charIndex);
				if (s) {
					a.push(s);
				}
				a.setRatio = _setRatio;
				return a;
			},
			//note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
			_addPropTween = function(target, prop, start, end, overwriteProp, mod, funcParam, stringFilter, index) {
				if (typeof(end) === "function") {
					end = end(index || 0, target);
				}
				var s = (start === "get") ? target[prop] : start,
					type = typeof(target[prop]),
					isRelative = (typeof(end) === "string" && end.charAt(1) === "="),
					pt = {t:target, p:prop, s:s, f:(type === "function"), pg:0, n:overwriteProp || prop, m:(!mod ? 0 : (typeof(mod) === "function") ? mod : Math.round), pr:0, c:isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : (parseFloat(end) - s) || 0},
					blob, getterName;
				if (type !== "number") {
					if (type === "function" && start === "get") {
						getterName = ((prop.indexOf("set") || typeof(target["get" + prop.substr(3)]) !== "function") ? prop : "get" + prop.substr(3));
						pt.s = s = funcParam ? target[getterName](funcParam) : target[getterName]();
					}
					if (typeof(s) === "string" && (funcParam || isNaN(s))) {
						//a blob (string that has multiple numbers in it)
						pt.fp = funcParam;
						blob = _blobDif(s, end, stringFilter || TweenLite.defaultStringFilter, pt);
						pt = {t:blob, p:"setRatio", s:0, c:1, f:2, pg:0, n:overwriteProp || prop, pr:0, m:0}; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
					} else if (!isRelative) {
						pt.s = parseFloat(s);
						pt.c = (parseFloat(end) - pt.s) || 0;
					}
				}
				if (pt.c) { //only add it to the linked list if there's a change.
					if ((pt._next = this._firstPT)) {
						pt._next._prev = pt;
					}
					this._firstPT = pt;
					return pt;
				}
			},
			_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens, blobDif:_blobDif}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
			_plugins = TweenLite._plugins = {},
			_tweenLookup = _internals.tweenLookup = {},
			_tweenLookupNum = 0,
			_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1, onOverwrite:1, callbackScope:1, stringFilter:1, id:1},
			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
			_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
			_nextGCFrame = 30,
			_lazyRender = _internals.lazyRender = function() {
				var i = _lazyTweens.length,
					tween;
				_lazyLookup = {};
				while (--i > -1) {
					tween = _lazyTweens[i];
					if (tween && tween._lazy !== false) {
						tween.render(tween._lazy[0], tween._lazy[1], true);
						tween._lazy = false;
					}
				}
				_lazyTweens.length = 0;
			};

		_rootTimeline._startTime = _ticker.time;
		_rootFramesTimeline._startTime = _ticker.frame;
		_rootTimeline._active = _rootFramesTimeline._active = true;
		setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

		Animation._updateRoot = TweenLite.render = function() {
				var i, a, p;
				if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
					_lazyRender();
				}
				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
				if (_lazyTweens.length) {
					_lazyRender();
				}
				if (_ticker.frame >= _nextGCFrame) { //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
					_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
					for (p in _tweenLookup) {
						a = _tweenLookup[p].tweens;
						i = a.length;
						while (--i > -1) {
							if (a[i]._gc) {
								a.splice(i, 1);
							}
						}
						if (a.length === 0) {
							delete _tweenLookup[p];
						}
					}
					//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
					p = _rootTimeline._first;
					if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
						while (p && p._paused) {
							p = p._next;
						}
						if (!p) {
							_ticker.sleep();
						}
					}
				}
			};

		_ticker.addEventListener("tick", Animation._updateRoot);

		var _register = function(target, tween, scrub) {
				var id = target._gsTweenID, a, i;
				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
					_tweenLookup[id] = {target:target, tweens:[]};
				}
				if (tween) {
					a = _tweenLookup[id].tweens;
					a[(i = a.length)] = tween;
					if (scrub) {
						while (--i > -1) {
							if (a[i] === tween) {
								a.splice(i, 1);
							}
						}
					}
				}
				return _tweenLookup[id].tweens;
			},
			_onOverwrite = function(overwrittenTween, overwritingTween, target, killedProps) {
				var func = overwrittenTween.vars.onOverwrite, r1, r2;
				if (func) {
					r1 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				func = TweenLite.onOverwrite;
				if (func) {
					r2 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				return (r1 !== false && r2 !== false);
			},
			_applyOverwrite = function(target, tween, props, mode, siblings) {
				var i, changed, curTween, l;
				if (mode === 1 || mode >= 4) {
					l = siblings.length;
					for (i = 0; i < l; i++) {
						if ((curTween = siblings[i]) !== tween) {
							if (!curTween._gc) {
								if (curTween._kill(null, target, tween)) {
									changed = true;
								}
							}
						} else if (mode === 5) {
							break;
						}
					}
					return changed;
				}
				//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
				var startTime = tween._startTime + _tinyNum,
					overlaps = [],
					oCount = 0,
					zeroDur = (tween._duration === 0),
					globalStart;
				i = siblings.length;
				while (--i > -1) {
					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
						//ignore
					} else if (curTween._timeline !== tween._timeline) {
						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
							overlaps[oCount++] = curTween;
						}
					} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
						overlaps[oCount++] = curTween;
					}
				}

				i = oCount;
				while (--i > -1) {
					curTween = overlaps[i];
					if (mode === 2) if (curTween._kill(props, target, tween)) {
						changed = true;
					}
					if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
						if (mode !== 2 && !_onOverwrite(curTween, tween)) {
							continue;
						}
						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
							changed = true;
						}
					}
				}
				return changed;
			},
			_checkOverlap = function(tween, reference, zeroDur) {
				var tl = tween._timeline,
					ts = tl._timeScale,
					t = tween._startTime;
				while (tl._timeline) {
					t += tl._startTime;
					ts *= tl._timeScale;
					if (tl._paused) {
						return -100;
					}
					tl = tl._timeline;
				}
				t /= ts;
				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
			};


//---- TweenLite instance methods -----------------------------------------------------------------------------

		p._init = function() {
			var v = this.vars,
				op = this._overwrittenProps,
				dur = this._duration,
				immediate = !!v.immediateRender,
				ease = v.ease,
				i, initPlugins, pt, p, startVars, l;
			if (v.startAt) {
				if (this._startAt) {
					this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
					this._startAt.kill();
				}
				startVars = {};
				for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
					startVars[p] = v.startAt[p];
				}
				startVars.overwrite = false;
				startVars.immediateRender = true;
				startVars.lazy = (immediate && v.lazy !== false);
				startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
				this._startAt = TweenLite.to(this.target, 0, startVars);
				if (immediate) {
					if (this._time > 0) {
						this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
					} else if (dur !== 0) {
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (v.runBackwards && dur !== 0) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (this._startAt) {
					this._startAt.render(-1, true);
					this._startAt.kill();
					this._startAt = null;
				} else {
					if (this._time !== 0) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
						immediate = false;
					}
					pt = {};
					for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
						if (!_reservedProps[p] || p === "autoCSS") {
							pt[p] = v[p];
						}
					}
					pt.overwrite = 0;
					pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
					pt.lazy = (immediate && v.lazy !== false);
					pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
					this._startAt = TweenLite.to(this.target, 0, pt);
					if (!immediate) {
						this._startAt._init(); //ensures that the initial values are recorded
						this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
						if (this.vars.immediateRender) {
							this._startAt = null;
						}
					} else if (this._time === 0) {
						return;
					}
				}
			}
			this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
			if (v.easeParams instanceof Array && ease.config) {
				this._ease = ease.config.apply(ease, v.easeParams);
			}
			this._easeType = this._ease._type;
			this._easePower = this._ease._power;
			this._firstPT = null;

			if (this._targets) {
				l = this._targets.length;
				for (i = 0; i < l; i++) {
					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null), i) ) {
						initPlugins = true;
					}
				}
			} else {
				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op, 0);
			}

			if (initPlugins) {
				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
			}
			if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
				this._enabled(false, false);
			}
			if (v.runBackwards) {
				pt = this._firstPT;
				while (pt) {
					pt.s += pt.c;
					pt.c = -pt.c;
					pt = pt._next;
				}
			}
			this._onUpdate = v.onUpdate;
			this._initted = true;
		};

		p._initProps = function(target, propLookup, siblings, overwrittenProps, index) {
			var p, i, initPlugins, plugin, pt, v;
			if (target == null) {
				return false;
			}

			if (_lazyLookup[target._gsTweenID]) {
				_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
			}

			if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
				_autoCSS(this.vars, target);
			}
			for (p in this.vars) {
				v = this.vars[p];
				if (_reservedProps[p]) {
					if (v) if ((v instanceof Array) || (v.push && _isArray(v))) if (v.join("").indexOf("{self}") !== -1) {
						this.vars[p] = v = this._swapSelfInParams(v, this);
					}

				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this, index)) {

					//t - target 		[object]
					//p - property 		[string]
					//s - start			[number]
					//c - change		[number]
					//f - isFunction	[boolean]
					//n - name			[string]
					//pg - isPlugin 	[boolean]
					//pr - priority		[number]
					//m - mod           [function | 0]
					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:1, n:p, pg:1, pr:plugin._priority, m:0};
					i = plugin._overwriteProps.length;
					while (--i > -1) {
						propLookup[plugin._overwriteProps[i]] = this._firstPT;
					}
					if (plugin._priority || plugin._onInitAllProps) {
						initPlugins = true;
					}
					if (plugin._onDisable || plugin._onEnable) {
						this._notifyPluginsOfEnabled = true;
					}
					if (pt._next) {
						pt._next._prev = pt;
					}

				} else {
					propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter, index);
				}
			}

			if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
				return this._initProps(target, propLookup, siblings, overwrittenProps, index);
			}
			if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
				this._kill(propLookup, target);
				return this._initProps(target, propLookup, siblings, overwrittenProps, index);
			}
			if (this._firstPT) if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
				_lazyLookup[target._gsTweenID] = true;
			}
			return initPlugins;
		};

		p.render = function(time, suppressEvents, force) {
			var prevTime = this._time,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, rawPrevTime;
			if (time >= duration - 0.0000001) { //to work around occasional floating point math artifacts.
				this._totalTime = this._time = duration;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				if (!this._reversed ) {
					isComplete = true;
					callback = "onComplete";
					force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && this.data === "isPause")) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				}
				if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;

				if (this._easeType) {
					var r = time / duration, type = this._easeType, pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(time / duration);
				}
			}

			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
					this._time = this._totalTime = prevTime;
					this._rawPrevTime = prevRawPrevTime;
					_lazyTweens.push(this);
					this._lazy = [time, suppressEvents];
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
				this._lazy = false;
			}
			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTime === 0) {
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._time !== 0 || duration === 0) if (!suppressEvents) {
					this._callback("onStart");
				}
			}
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}

			if (this._onUpdate) {
				if (time < 0) if (this._startAt && time !== -0.0001) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._time !== prevTime || isComplete || force) {
					this._callback("onUpdate");
				}
			}
			if (callback) if (!this._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && time !== -0.0001) { //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};

		p._kill = function(vars, target, overwritingTween) {
			if (vars === "all") {
				vars = null;
			}
			if (vars == null) if (target == null || target === this.target) {
				this._lazy = false;
				return this._enabled(false, false);
			}
			target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
			var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline),
				i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				while (--i > -1) {
					if (this._kill(vars, target[i], overwritingTween)) {
						changed = true;
					}
				}
			} else {
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if (target === this._targets[i]) {
							propLookup = this._propLookup[i] || {};
							this._overwrittenProps = this._overwrittenProps || [];
							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
							break;
						}
					}
				} else if (target !== this.target) {
					return false;
				} else {
					propLookup = this._propLookup;
					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
				}

				if (propLookup) {
					killProps = vars || propLookup;
					record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
					if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
						for (p in killProps) {
							if (propLookup[p]) {
								if (!killed) {
									killed = [];
								}
								killed.push(p);
							}
						}
						if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) { //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
							return false;
						}
					}

					for (p in killProps) {
						if ((pt = propLookup[p])) {
							if (simultaneousOverwrite) { //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
								if (pt.f) {
									pt.t[pt.p](pt.s);
								} else {
									pt.t[pt.p] = pt.s;
								}
								changed = true;
							}
							if (pt.pg && pt.t._kill(killProps)) {
								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
							}
							if (!pt.pg || pt.t._overwriteProps.length === 0) {
								if (pt._prev) {
									pt._prev._next = pt._next;
								} else if (pt === this._firstPT) {
									this._firstPT = pt._next;
								}
								if (pt._next) {
									pt._next._prev = pt._prev;
								}
								pt._next = pt._prev = null;
							}
							delete propLookup[p];
						}
						if (record) {
							overwrittenProps[p] = 1;
						}
					}
					if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
						this._enabled(false, false);
					}
				}
			}
			return changed;
		};

		p.invalidate = function() {
			if (this._notifyPluginsOfEnabled) {
				TweenLite._onPluginEvent("_onDisable", this);
			}
			this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
			this._notifyPluginsOfEnabled = this._active = this._lazy = false;
			this._propLookup = (this._targets) ? {} : [];
			Animation.prototype.invalidate.call(this);
			if (this.vars.immediateRender) {
				this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
				this.render(Math.min(0, -this._delay)); //in case delay is negative.
			}
			return this;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (enabled && this._gc) {
				var targets = this._targets,
					i;
				if (targets) {
					i = targets.length;
					while (--i > -1) {
						this._siblings[i] = _register(targets[i], this, true);
					}
				} else {
					this._siblings = _register(this.target, this, true);
				}
			}
			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
			if (this._notifyPluginsOfEnabled) if (this._firstPT) {
				return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
			}
			return false;
		};


//----TweenLite static methods -----------------------------------------------------

		TweenLite.to = function(target, duration, vars) {
			return new TweenLite(target, duration, vars);
		};

		TweenLite.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenLite(target, duration, vars);
		};

		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenLite(target, duration, toVars);
		};

		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, lazy:false, useFrames:useFrames, overwrite:0});
		};

		TweenLite.set = function(target, vars) {
			return new TweenLite(target, 0, vars);
		};

		TweenLite.getTweensOf = function(target, onlyActive) {
			if (target == null) { return []; }
			target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
			var i, a, j, t;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				a = [];
				while (--i > -1) {
					a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
				}
				i = a.length;
				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
				while (--i > -1) {
					t = a[i];
					j = i;
					while (--j > -1) {
						if (t === a[j]) {
							a.splice(i, 1);
						}
					}
				}
			} else {
				a = _register(target).concat();
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc || (onlyActive && !a[i].isActive())) {
						a.splice(i, 1);
					}
				}
			}
			return a;
		};

		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
			if (typeof(onlyActive) === "object") {
				vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
				onlyActive = false;
			}
			var a = TweenLite.getTweensOf(target, onlyActive),
				i = a.length;
			while (--i > -1) {
				a[i]._kill(vars, target);
			}
		};



/*
 * ----------------------------------------------------------------
 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
 * ----------------------------------------------------------------
 */
		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
					this._overwriteProps = (props || "").split(",");
					this._propName = this._overwriteProps[0];
					this._priority = priority || 0;
					this._super = TweenPlugin.prototype;
				}, true);

		p = TweenPlugin.prototype;
		TweenPlugin.version = "1.19.0";
		TweenPlugin.API = 2;
		p._firstPT = null;
		p._addTween = _addPropTween;
		p.setRatio = _setRatio;

		p._kill = function(lookup) {
			var a = this._overwriteProps,
				pt = this._firstPT,
				i;
			if (lookup[this._propName] != null) {
				this._overwriteProps = [];
			} else {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i]] != null) {
						a.splice(i, 1);
					}
				}
			}
			while (pt) {
				if (lookup[pt.n] != null) {
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
						pt._prev = null;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
					}
				}
				pt = pt._next;
			}
			return false;
		};

		p._mod = p._roundProps = function(lookup) {
			var pt = this._firstPT,
				val;
			while (pt) {
				val = lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ]);
				if (val && typeof(val) === "function") { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
					if (pt.f === 2) {
						pt.t._applyPT.m = val;
					} else {
						pt.m = val;
					}
				}
				pt = pt._next;
			}
		};

		TweenLite._onPluginEvent = function(type, tween) {
			var pt = tween._firstPT,
				changed, pt2, first, last, next;
			if (type === "_onInitAllProps") {
				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				pt = tween._firstPT = first;
			}
			while (pt) {
				if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
					changed = true;
				}
				pt = pt._next;
			}
			return changed;
		};

		TweenPlugin.activate = function(plugins) {
			var i = plugins.length;
			while (--i > -1) {
				if (plugins[i].API === TweenPlugin.API) {
					_plugins[(new plugins[i]())._propName] = plugins[i];
				}
			}
			return true;
		};

		//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
		_gsDefine.plugin = function(config) {
			if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
			var propName = config.propName,
				priority = config.priority || 0,
				overwriteProps = config.overwriteProps,
				map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_mod", mod:"_mod", initAll:"_onInitAllProps"},
				Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
					function() {
						TweenPlugin.call(this, propName, priority);
						this._overwriteProps = overwriteProps || [];
					}, (config.global === true)),
				p = Plugin.prototype = new TweenPlugin(propName),
				prop;
			p.constructor = Plugin;
			Plugin.API = config.API;
			for (prop in map) {
				if (typeof(config[prop]) === "function") {
					p[map[prop]] = config[prop];
				}
			}
			Plugin.version = config.version;
			TweenPlugin.activate([Plugin]);
			return Plugin;
		};


		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
		a = window._gsQueue;
		if (a) {
			for (i = 0; i < a.length; i++) {
				a[i]();
			}
			for (p in _defLookup) {
				if (!_defLookup[p].func) {
					window.console.log("GSAP encountered missing dependency: " + p);
				}
			}
		}

		_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

})((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window, "TweenMax");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function(root, factory) {

  // Support AMD
  if (typeof define === 'function' && define.amd) {
    define([], factory);

  // Support CommonJS
  } else if (typeof exports === 'object') {
    var randomColor = factory();

    // Support NodeJS & Component, which allow module.exports to be a function
    if (typeof module === 'object' && module && module.exports) {
      exports = module.exports = randomColor;
    }

    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;

  // Support vanilla script loading
  } else {
    root.randomColor = factory();
  }

}(this, function() {

  // Seed to get repeatable colors
  var seed = null;

  // Shared color dictionary
  var colorDictionary = {};

  // Populate the color dictionary
  loadColorBounds();

  var randomColor = function (options) {

    options = options || {};

    // Check if there is a seed and ensure it's an
    // integer. Otherwise, reset the seed value.
    if (options.seed && options.seed === parseInt(options.seed, 10)) {
      seed = options.seed;

    // A string was passed as a seed
    } else if (typeof options.seed === 'string') {
      seed = stringToInteger(options.seed);

    // Something was passed as a seed but it wasn't an integer or string
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError('The seed value must be an integer or string');

    // No seed, reset the value outside.
    } else {
      seed = null;
    }

    var H,S,B;

    // Check if we need to generate multiple colors
    if (options.count !== null && options.count !== undefined) {

      var totalColors = options.count,
          colors = [];

      options.count = null;

      while (totalColors > colors.length) {

        // Since we're generating multiple colors,
        // incremement the seed. Otherwise we'd just
        // generate the same color each time...
        if (seed && options.seed) options.seed += 1;

        colors.push(randomColor(options));
      }

      options.count = totalColors;

      return colors;
    }

    // First we pick a hue (H)
    H = pickHue(options);

    // Then use H to determine saturation (S)
    S = pickSaturation(H, options);

    // Then use S and H to determine brightness (B).
    B = pickBrightness(H, S, options);

    // Then we return the HSB color in the desired format
    return setFormat([H,S,B], options);
  };

  function pickHue (options) {

    var hueRange = getHueRange(options.hue),
        hue = randomWithin(hueRange);

    // Instead of storing red as two seperate ranges,
    // we group them, using negative numbers
    if (hue < 0) {hue = 360 + hue;}

    return hue;

  }

  function pickSaturation (hue, options) {

    if (options.luminosity === 'random') {
      return randomWithin([0,100]);
    }

    if (options.hue === 'monochrome') {
      return 0;
    }

    var saturationRange = getSaturationRange(hue);

    var sMin = saturationRange[0],
        sMax = saturationRange[1];

    switch (options.luminosity) {

      case 'bright':
        sMin = 55;
        break;

      case 'dark':
        sMin = sMax - 10;
        break;

      case 'light':
        sMax = 55;
        break;
   }

    return randomWithin([sMin, sMax]);

  }

  function pickBrightness (H, S, options) {

    var bMin = getMinimumBrightness(H, S),
        bMax = 100;

    switch (options.luminosity) {

      case 'dark':
        bMax = bMin + 20;
        break;

      case 'light':
        bMin = (bMax + bMin)/2;
        break;

      case 'random':
        bMin = 0;
        bMax = 100;
        break;
    }

    return randomWithin([bMin, bMax]);
  }

  function setFormat (hsv, options) {

    switch (options.format) {

      case 'hsvArray':
        return hsv;

      case 'hslArray':
        return HSVtoHSL(hsv);

      case 'hsl':
        var hsl = HSVtoHSL(hsv);
        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

      case 'hsla':
        var hslColor = HSVtoHSL(hsv);
        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + Math.random() + ')';

      case 'rgbArray':
        return HSVtoRGB(hsv);

      case 'rgb':
        var rgb = HSVtoRGB(hsv);
        return 'rgb(' + rgb.join(', ') + ')';

      case 'rgba':
        var rgbColor = HSVtoRGB(hsv);
        return 'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')';

      default:
        return HSVtoHex(hsv);
    }

  }

  function getMinimumBrightness(H, S) {

    var lowerBounds = getColorInfo(H).lowerBounds;

    for (var i = 0; i < lowerBounds.length - 1; i++) {

      var s1 = lowerBounds[i][0],
          v1 = lowerBounds[i][1];

      var s2 = lowerBounds[i+1][0],
          v2 = lowerBounds[i+1][1];

      if (S >= s1 && S <= s2) {

         var m = (v2 - v1)/(s2 - s1),
             b = v1 - m*s1;

         return m*S + b;
      }

    }

    return 0;
  }

  function getHueRange (colorInput) {

    if (typeof parseInt(colorInput) === 'number') {

      var number = parseInt(colorInput);

      if (number < 360 && number > 0) {
        return [number, number];
      }

    }

    if (typeof colorInput === 'string') {

      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {return color.hueRange;}
      }
    }

    return [0,360];

  }

  function getSaturationRange (hue) {
    return getColorInfo(hue).saturationRange;
  }

  function getColorInfo (hue) {

    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue-= 360;
    }

    for (var colorName in colorDictionary) {
       var color = colorDictionary[colorName];
       if (color.hueRange &&
           hue >= color.hueRange[0] &&
           hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
       }
    } return 'Color not found';
  }

  function randomWithin (range) {
    if (seed === null) {
      return Math.floor(range[0] + Math.random()*(range[1] + 1 - range[0]));
    } else {
      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      var max = range[1] || 1;
      var min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    }
  }

  function HSVtoHex (hsv){

    var rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

    return hex;

  }

  function defineColor (name, hueRange, lowerBounds) {

    var sMin = lowerBounds[0][0],
        sMax = lowerBounds[lowerBounds.length - 1][0],

        bMin = lowerBounds[lowerBounds.length - 1][1],
        bMax = lowerBounds[0][1];

    colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [sMin, sMax],
      brightnessRange: [bMin, bMax]
    };

  }

  function loadColorBounds () {

    defineColor(
      'monochrome',
      null,
      [[0,0],[100,0]]
    );

    defineColor(
      'red',
      [-26,18],
      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
    );

    defineColor(
      'orange',
      [19,46],
      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
    );

    defineColor(
      'yellow',
      [47,62],
      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
    );

    defineColor(
      'green',
      [63,178],
      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
    );

    defineColor(
      'blue',
      [179, 257],
      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
    );

    defineColor(
      'purple',
      [258, 282],
      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
    );

    defineColor(
      'pink',
      [283, 334],
      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
    );

  }

  function HSVtoRGB (hsv) {

    // this doesn't work for the values of 0 and 360
    // here's the hacky fix
    var h = hsv[0];
    if (h === 0) {h = 1;}
    if (h === 360) {h = 359;}

    // Rebase the h,s,v values
    h = h/360;
    var s = hsv[1]/100,
        v = hsv[2]/100;

    var h_i = Math.floor(h*6),
      f = h * 6 - h_i,
      p = v * (1 - s),
      q = v * (1 - f*s),
      t = v * (1 - (1 - f)*s),
      r = 256,
      g = 256,
      b = 256;

    switch(h_i) {
      case 0: r = v; g = t; b = p;  break;
      case 1: r = q; g = v; b = p;  break;
      case 2: r = p; g = v; b = t;  break;
      case 3: r = p; g = q; b = v;  break;
      case 4: r = t; g = p; b = v;  break;
      case 5: r = v; g = p; b = q;  break;
    }

    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
    return result;
  }

  function HSVtoHSL (hsv) {
    var h = hsv[0],
      s = hsv[1]/100,
      v = hsv[2]/100,
      k = (2-s)*v;

    return [
      h,
      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
      k/2 * 100
    ];
  }

  function stringToInteger (string) {
    var total = 0
    for (var i = 0; i !== string.length; i++) {
      if (total >= Number.MAX_SAFE_INTEGER) break;
      total += string.charCodeAt(i)
    }
    return total
  }

  return randomColor;
}));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvbWFpbi5qcyIsImFzc2V0cy9qcy9wYXJ0aWFscy9faW50cm8uanMiLCJhc3NldHMvanMvcGFydGlhbHMvX3BhcmFsbGF4LmpzIiwibm9kZV9tb2R1bGVzL2dzYXAvc3JjL3VuY29tcHJlc3NlZC9Ud2Vlbk1heC5qcyIsIm5vZGVfbW9kdWxlcy9yYW5kb21jb2xvci9yYW5kb21Db2xvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBQ0E7Ozs7O0FDREE7Ozs7QUFDQTs7OztBQUVBLFNBQVMsV0FBVCxHQUF1QjtBQUNyQixNQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLGNBQXZCLENBQWY7QUFDQSxNQUFJLFdBQVcsU0FBUyxhQUFULENBQXVCLGNBQXZCLENBQWY7QUFDQSxNQUFJLFlBQVksU0FBUyxVQUF6QjtBQUNBLE1BQUksS0FBSyxJQUFJLFdBQUosRUFBVDtBQUNBLE1BQUksU0FBUyxFQUFiOztBQUVBLE9BQUssSUFBSSxDQUFULElBQWMsU0FBZCxFQUF5QjtBQUN2QixRQUFJLElBQUksVUFBVSxDQUFWLENBQVI7QUFDQSxRQUFJLEVBQUUsVUFBTixFQUFrQjtBQUNoQixhQUFPLElBQVAsQ0FBWSxDQUFaO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJLGNBQWMsMkJBQVk7QUFDNUIsV0FBTyxPQUFPLE1BRGM7QUFFNUIsZ0JBQVk7QUFGZ0IsR0FBWixDQUFsQjs7QUFLQSxPQUFLLElBQUksQ0FBVCxJQUFjLE1BQWQsRUFBc0I7QUFDcEIsUUFBSSxRQUFRLE9BQU8sQ0FBUCxDQUFaO0FBQ0EsVUFBTSxZQUFOLENBQW1CLE1BQW5CLEVBQTJCLFlBQVksQ0FBWixDQUEzQjtBQUNEOztBQUVELEtBQUcsYUFBSCxDQUNFLE1BREYsRUFDVSxDQURWLEVBQ2E7QUFDVCxTQUFLLEVBQUUsR0FBRyxDQUFDLEdBQU4sRUFBVyxTQUFTLENBQXBCO0FBREksR0FEYixFQUdLO0FBQ0QsV0FBTyxJQUROO0FBRUQsVUFBTSxRQUFRLE9BRmI7QUFHRCxTQUFJLEVBQUUsR0FBRyxDQUFMLEVBQVEsU0FBUyxHQUFqQjtBQUhILEdBSEwsRUFPSyxJQVBMOztBQVVBLE1BQUksUUFBUSxTQUFTLEVBQVQsQ0FDVixRQURVLEVBQ0EsQ0FEQSxFQUNHO0FBQ1gsV0FBTyxHQURJO0FBRVgsYUFBUyxDQUZFO0FBR1gsVUFBTSxRQUFRO0FBSEgsR0FESCxFQUtQLElBTE8sQ0FBWjtBQU9EOztBQUVELFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFVBQVMsS0FBVCxFQUFnQjtBQUM1RDtBQUNELENBRkQ7Ozs7O0FDOUNBLElBQUksT0FBTyxPQUFPLGdCQUFQLENBQ1QsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBRFMsRUFDdUIsU0FEdkIsRUFFVCxnQkFGUyxDQUVRLFNBRlIsQ0FBWDs7QUFJQSxPQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFVBQVMsS0FBVCxFQUFnQjs7QUFFaEQsTUFBSSxJQUFKLEVBQVU7O0FBRVIsUUFBSSxLQUFKLEVBQVcsQ0FBWCxFQUFjLEtBQWQsRUFBcUIsTUFBckIsRUFBNkIsR0FBN0IsRUFBa0MsUUFBbEMsRUFBNEMsV0FBNUMsRUFBeUQsV0FBekQ7QUFDQSxrQkFBYyxLQUFLLFdBQW5CO0FBQ0EsYUFBUyxTQUFTLGdCQUFULENBQTBCLDBCQUExQixDQUFUOztBQUVBLFNBQUssSUFBSSxDQUFKLEVBQU8sTUFBTSxPQUFPLE1BQXpCLEVBQWlDLElBQUksR0FBckMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsY0FBUSxPQUFPLENBQVAsQ0FBUjtBQUNBLGNBQVEsTUFBTSxZQUFOLENBQW1CLFlBQW5CLENBQVI7QUFDQSxpQkFBVyxFQUFFLGNBQWMsS0FBaEIsQ0FBWDtBQUNBLG9CQUFjLG9CQUFvQixRQUFwQixHQUErQixRQUE3QztBQUNBLFlBQU0sS0FBTixDQUFZLG1CQUFaLElBQW1DLFdBQW5DO0FBQ0EsWUFBTSxLQUFOLENBQVksZ0JBQVosSUFBZ0MsV0FBaEM7QUFDQSxZQUFNLEtBQU4sQ0FBWSxlQUFaLElBQStCLFdBQS9CO0FBQ0EsWUFBTSxLQUFOLENBQVksY0FBWixJQUE4QixXQUE5QjtBQUNBLFlBQU0sS0FBTixDQUFZLFNBQVosR0FBd0IsV0FBeEI7QUFDRDtBQUVGO0FBRUYsQ0F0QkQ7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2blBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi9wYXJ0aWFscy9fcGFyYWxsYXgnO1xuaW1wb3J0ICcuL3BhcnRpYWxzL19pbnRybyc7XG4iLCJpbXBvcnQgcmFuZG9tQ29sb3IgZnJvbSAncmFuZG9tY29sb3InO1xuaW1wb3J0ICdnc2FwJztcblxuZnVuY3Rpb24gcmVuZGVySW50cm8oKSB7XG4gIHZhciBsb2dvdHlwZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1sb2dvdHlwZScpO1xuICB2YXIgbG9nb21hcmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbG9nb21hcmsnKTtcbiAgdmFyIGxvZ29Ob2RlcyA9IGxvZ29tYXJrLmNoaWxkTm9kZXM7XG4gIHZhciB0bCA9IG5ldyBUaW1lbGluZU1heCgpO1xuICB2YXIgc2hhcGVzID0gW107XG5cbiAgZm9yICh2YXIgaSBpbiBsb2dvTm9kZXMpIHtcbiAgICB2YXIgbiA9IGxvZ29Ob2Rlc1tpXTtcbiAgICBpZiAobi5hdHRyaWJ1dGVzKSB7XG4gICAgICBzaGFwZXMucHVzaChuKTtcbiAgICB9O1xuICB9O1xuXG4gIHZhciBiYWNrZ3JvdW5kcyA9IHJhbmRvbUNvbG9yKHtcbiAgICBjb3VudDogc2hhcGVzLmxlbmd0aCxcbiAgICBsdW1pbm9zaXR5OiAnbGlnaHQnXG4gIH0pO1xuXG4gIGZvciAodmFyIGkgaW4gc2hhcGVzKSB7XG4gICAgdmFyIHNoYXBlID0gc2hhcGVzW2ldO1xuICAgIHNoYXBlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIGJhY2tncm91bmRzW2ldKTtcbiAgfTtcblxuICB0bC5zdGFnZ2VyRnJvbVRvKFxuICAgIHNoYXBlcywgMSwge1xuICAgICAgY3NzOiB7IHk6IC0xMDAsIG9wYWNpdHk6IDAgfVxuICAgIH0sIHtcbiAgICAgIGRlbGF5OiAwLjI0LFxuICAgICAgZWFzZTogRWxhc3RpYy5lYXNlT3V0LFxuICAgICAgY3NzOnsgeTogMCwgb3BhY2l0eTogMC41IH1cbiAgICB9LCAwLjA1XG4gICk7XG5cbiAgdmFyIHR3ZWVuID0gVHdlZW5NYXgudG8oXG4gICAgbG9nb3R5cGUsIDEsIHtcbiAgICAgIGRlbGF5OiAwLjUsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZWFzZTogRWxhc3RpYy5lYXNlT3V0XG4gICAgfSwgMC4wNVxuICApO1xufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgcmVuZGVySW50cm8oKTtcbn0pO1xuIiwidmFyIHNpemUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCAnOmJlZm9yZSdcbikuZ2V0UHJvcGVydHlWYWx1ZSgnY29udGVudCcpO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICBpZiAoc2l6ZSkge1xuXG4gICAgdmFyIGRlcHRoLCBpLCBsYXllciwgbGF5ZXJzLCBsZW4sIG1vdmVtZW50LCB0b3BEaXN0YW5jZSwgdHJhbnNsYXRlM2Q7XG4gICAgdG9wRGlzdGFuY2UgPSB0aGlzLnBhZ2VZT2Zmc2V0O1xuICAgIGxheWVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXR5cGU9XFwncGFyYWxsYXhcXCddJyk7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBsYXllcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxheWVyID0gbGF5ZXJzW2ldO1xuICAgICAgZGVwdGggPSBsYXllci5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVwdGgnKTtcbiAgICAgIG1vdmVtZW50ID0gLSh0b3BEaXN0YW5jZSAqIGRlcHRoKTtcbiAgICAgIHRyYW5zbGF0ZTNkID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyBtb3ZlbWVudCArICdweCwgMCknO1xuICAgICAgbGF5ZXIuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSB0cmFuc2xhdGUzZDtcbiAgICAgIGxheWVyLnN0eWxlWyctbW96LXRyYW5zZm9ybSddID0gdHJhbnNsYXRlM2Q7XG4gICAgICBsYXllci5zdHlsZVsnLW1zLXRyYW5zZm9ybSddID0gdHJhbnNsYXRlM2Q7XG4gICAgICBsYXllci5zdHlsZVsnLW8tdHJhbnNmb3JtJ10gPSB0cmFuc2xhdGUzZDtcbiAgICAgIGxheWVyLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zbGF0ZTNkO1xuICAgIH1cblxuICB9XG5cbn0pO1xuIiwiLyohXG4gKiBWRVJTSU9OOiAxLjE5LjBcbiAqIERBVEU6IDIwMTYtMDctMTRcbiAqIFVQREFURVMgQU5EIERPQ1MgQVQ6IGh0dHA6Ly9ncmVlbnNvY2suY29tXG4gKiBcbiAqIEluY2x1ZGVzIGFsbCBvZiB0aGUgZm9sbG93aW5nOiBUd2VlbkxpdGUsIFR3ZWVuTWF4LCBUaW1lbGluZUxpdGUsIFRpbWVsaW5lTWF4LCBFYXNlUGFjaywgQ1NTUGx1Z2luLCBSb3VuZFByb3BzUGx1Z2luLCBCZXppZXJQbHVnaW4sIEF0dHJQbHVnaW4sIERpcmVjdGlvbmFsUm90YXRpb25QbHVnaW5cbiAqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNiwgR3JlZW5Tb2NrLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyB3b3JrIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIGF0IGh0dHA6Ly9ncmVlbnNvY2suY29tL3N0YW5kYXJkLWxpY2Vuc2Ugb3IgZm9yXG4gKiBDbHViIEdyZWVuU29jayBtZW1iZXJzLCB0aGUgc29mdHdhcmUgYWdyZWVtZW50IHRoYXQgd2FzIGlzc3VlZCB3aXRoIHlvdXIgbWVtYmVyc2hpcC5cbiAqIFxuICogQGF1dGhvcjogSmFjayBEb3lsZSwgamFja0BncmVlbnNvY2suY29tXG4gKiovXG52YXIgX2dzU2NvcGUgPSAodHlwZW9mKG1vZHVsZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mKGdsb2JhbCkgIT09IFwidW5kZWZpbmVkXCIpID8gZ2xvYmFsIDogdGhpcyB8fCB3aW5kb3c7IC8vaGVscHMgZW5zdXJlIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQvUmVxdWlyZUpTIGFuZCBDb21tb25KUy9Ob2RlXG4oX2dzU2NvcGUuX2dzUXVldWUgfHwgKF9nc1Njb3BlLl9nc1F1ZXVlID0gW10pKS5wdXNoKCBmdW5jdGlvbigpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRfZ3NTY29wZS5fZ3NEZWZpbmUoXCJUd2Vlbk1heFwiLCBbXCJjb3JlLkFuaW1hdGlvblwiLFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLFwiVHdlZW5MaXRlXCJdLCBmdW5jdGlvbihBbmltYXRpb24sIFNpbXBsZVRpbWVsaW5lLCBUd2VlbkxpdGUpIHtcblxuXHRcdHZhciBfc2xpY2UgPSBmdW5jdGlvbihhKSB7IC8vZG9uJ3QgdXNlIFtdLnNsaWNlIGJlY2F1c2UgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUU4IHdpdGggYSBOb2RlTGlzdCB0aGF0J3MgcmV0dXJuZWQgYnkgcXVlcnlTZWxlY3RvckFsbCgpXG5cdFx0XHRcdHZhciBiID0gW10sXG5cdFx0XHRcdFx0bCA9IGEubGVuZ3RoLFxuXHRcdFx0XHRcdGk7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgIT09IGw7IGIucHVzaChhW2krK10pKTtcblx0XHRcdFx0cmV0dXJuIGI7XG5cdFx0XHR9LFxuXHRcdFx0X2FwcGx5Q3ljbGUgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXRzLCBpKSB7XG5cdFx0XHRcdHZhciBhbHQgPSB2YXJzLmN5Y2xlLFxuXHRcdFx0XHRcdHAsIHZhbDtcblx0XHRcdFx0Zm9yIChwIGluIGFsdCkge1xuXHRcdFx0XHRcdHZhbCA9IGFsdFtwXTtcblx0XHRcdFx0XHR2YXJzW3BdID0gKHR5cGVvZih2YWwpID09PSBcImZ1bmN0aW9uXCIpID8gdmFsKGksIHRhcmdldHNbaV0pIDogdmFsW2kgJSB2YWwubGVuZ3RoXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgdmFycy5jeWNsZTtcblx0XHRcdH0sXG5cdFx0XHRUd2Vlbk1heCA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdFx0VHdlZW5MaXRlLmNhbGwodGhpcywgdGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0XHRcdHRoaXMuX2N5Y2xlID0gMDtcblx0XHRcdFx0dGhpcy5feW95byA9ICh0aGlzLnZhcnMueW95byA9PT0gdHJ1ZSk7XG5cdFx0XHRcdHRoaXMuX3JlcGVhdCA9IHRoaXMudmFycy5yZXBlYXQgfHwgMDtcblx0XHRcdFx0dGhpcy5fcmVwZWF0RGVsYXkgPSB0aGlzLnZhcnMucmVwZWF0RGVsYXkgfHwgMDtcblx0XHRcdFx0dGhpcy5fZGlydHkgPSB0cnVlOyAvL2Vuc3VyZXMgdGhhdCBpZiB0aGVyZSBpcyBhbnkgcmVwZWF0LCB0aGUgdG90YWxEdXJhdGlvbiB3aWxsIGdldCByZWNhbGN1bGF0ZWQgdG8gYWNjdXJhdGVseSByZXBvcnQgaXQuXG5cdFx0XHRcdHRoaXMucmVuZGVyID0gVHdlZW5NYXgucHJvdG90eXBlLnJlbmRlcjsgLy9zcGVlZCBvcHRpbWl6YXRpb24gKGF2b2lkIHByb3RvdHlwZSBsb29rdXAgb24gdGhpcyBcImhvdFwiIG1ldGhvZClcblx0XHRcdH0sXG5cdFx0XHRfdGlueU51bSA9IDAuMDAwMDAwMDAwMSxcblx0XHRcdFR3ZWVuTGl0ZUludGVybmFscyA9IFR3ZWVuTGl0ZS5faW50ZXJuYWxzLFxuXHRcdFx0X2lzU2VsZWN0b3IgPSBUd2VlbkxpdGVJbnRlcm5hbHMuaXNTZWxlY3Rvcixcblx0XHRcdF9pc0FycmF5ID0gVHdlZW5MaXRlSW50ZXJuYWxzLmlzQXJyYXksXG5cdFx0XHRwID0gVHdlZW5NYXgucHJvdG90eXBlID0gVHdlZW5MaXRlLnRvKHt9LCAwLjEsIHt9KSxcblx0XHRcdF9ibGFua0FycmF5ID0gW107XG5cblx0XHRUd2Vlbk1heC52ZXJzaW9uID0gXCIxLjE5LjBcIjtcblx0XHRwLmNvbnN0cnVjdG9yID0gVHdlZW5NYXg7XG5cdFx0cC5raWxsKCkuX2djID0gZmFsc2U7XG5cdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mID0gVHdlZW5NYXgua2lsbERlbGF5ZWRDYWxsc1RvID0gVHdlZW5MaXRlLmtpbGxUd2VlbnNPZjtcblx0XHRUd2Vlbk1heC5nZXRUd2VlbnNPZiA9IFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZjtcblx0XHRUd2Vlbk1heC5sYWdTbW9vdGhpbmcgPSBUd2VlbkxpdGUubGFnU21vb3RoaW5nO1xuXHRcdFR3ZWVuTWF4LnRpY2tlciA9IFR3ZWVuTGl0ZS50aWNrZXI7XG5cdFx0VHdlZW5NYXgucmVuZGVyID0gVHdlZW5MaXRlLnJlbmRlcjtcblxuXHRcdHAuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5feW95byA9ICh0aGlzLnZhcnMueW95byA9PT0gdHJ1ZSk7XG5cdFx0XHR0aGlzLl9yZXBlYXQgPSB0aGlzLnZhcnMucmVwZWF0IHx8IDA7XG5cdFx0XHR0aGlzLl9yZXBlYXREZWxheSA9IHRoaXMudmFycy5yZXBlYXREZWxheSB8fCAwO1xuXHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdHJldHVybiBUd2VlbkxpdGUucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAudXBkYXRlVG8gPSBmdW5jdGlvbih2YXJzLCByZXNldER1cmF0aW9uKSB7XG5cdFx0XHR2YXIgY3VyUmF0aW8gPSB0aGlzLnJhdGlvLFxuXHRcdFx0XHRpbW1lZGlhdGUgPSB0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyIHx8IHZhcnMuaW1tZWRpYXRlUmVuZGVyLFxuXHRcdFx0XHRwO1xuXHRcdFx0aWYgKHJlc2V0RHVyYXRpb24gJiYgdGhpcy5fc3RhcnRUaW1lIDwgdGhpcy5fdGltZWxpbmUuX3RpbWUpIHtcblx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gdGhpcy5fdGltZWxpbmUuX3RpbWU7XG5cdFx0XHRcdHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdFx0XHRpZiAodGhpcy5fZ2MpIHtcblx0XHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUsIGZhbHNlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lbGluZS5pbnNlcnQodGhpcywgdGhpcy5fc3RhcnRUaW1lIC0gdGhpcy5fZGVsYXkpOyAvL2Vuc3VyZXMgdGhhdCBhbnkgbmVjZXNzYXJ5IHJlLXNlcXVlbmNpbmcgb2YgQW5pbWF0aW9ucyBpbiB0aGUgdGltZWxpbmUgb2NjdXJzIHRvIG1ha2Ugc3VyZSB0aGUgcmVuZGVyaW5nIG9yZGVyIGlzIGNvcnJlY3QuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZvciAocCBpbiB2YXJzKSB7XG5cdFx0XHRcdHRoaXMudmFyc1twXSA9IHZhcnNbcF07XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5faW5pdHRlZCB8fCBpbW1lZGlhdGUpIHtcblx0XHRcdFx0aWYgKHJlc2V0RHVyYXRpb24pIHtcblx0XHRcdFx0XHR0aGlzLl9pbml0dGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKGltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXIoMCwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkICYmIHRoaXMuX2ZpcnN0UFQpIHtcblx0XHRcdFx0XHRcdFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudChcIl9vbkRpc2FibGVcIiwgdGhpcyk7IC8vaW4gY2FzZSBhIHBsdWdpbiBsaWtlIE1vdGlvbkJsdXIgbXVzdCBwZXJmb3JtIHNvbWUgY2xlYW51cCB0YXNrc1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZSAvIHRoaXMuX2R1cmF0aW9uID4gMC45OTgpIHsgLy9pZiB0aGUgdHdlZW4gaGFzIGZpbmlzaGVkIChvciBjb21lIGV4dHJlbWVseSBjbG9zZSB0byBmaW5pc2hpbmcpLCB3ZSBqdXN0IG5lZWQgdG8gcmV3aW5kIGl0IHRvIDAgYW5kIHRoZW4gcmVuZGVyIGl0IGFnYWluIGF0IHRoZSBlbmQgd2hpY2ggZm9yY2VzIGl0IHRvIHJlLWluaXRpYWxpemUgKHBhcnNpbmcgdGhlIG5ldyB2YXJzKS4gV2UgYWxsb3cgdHdlZW5zIHRoYXQgYXJlIGNsb3NlIHRvIGZpbmlzaGluZyAoYnV0IGhhdmVuJ3QgcXVpdGUgZmluaXNoZWQpIHRvIHdvcmsgdGhpcyB3YXkgdG9vIGJlY2F1c2Ugb3RoZXJ3aXNlLCB0aGUgdmFsdWVzIGFyZSBzbyBzbWFsbCB3aGVuIGRldGVybWluaW5nIHdoZXJlIHRvIHByb2plY3QgdGhlIHN0YXJ0aW5nIHZhbHVlcyB0aGF0IGJpbmFyeSBtYXRoIGlzc3VlcyBjcmVlcCBpbiBhbmQgY2FuIG1ha2UgdGhlIHR3ZWVuIGFwcGVhciB0byByZW5kZXIgaW5jb3JyZWN0bHkgd2hlbiBydW4gYmFja3dhcmRzLiBcblx0XHRcdFx0XHRcdHZhciBwcmV2VGltZSA9IHRoaXMuX3RvdGFsVGltZTtcblx0XHRcdFx0XHRcdHRoaXMucmVuZGVyKDAsIHRydWUsIGZhbHNlKTtcblx0XHRcdFx0XHRcdHRoaXMuX2luaXR0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHRoaXMucmVuZGVyKHByZXZUaW1lLCB0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX2luaXR0ZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHRoaXMuX2luaXQoKTtcblx0XHRcdFx0XHRcdGlmICh0aGlzLl90aW1lID4gMCB8fCBpbW1lZGlhdGUpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGludiA9IDEgLyAoMSAtIGN1clJhdGlvKSxcblx0XHRcdFx0XHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQsIGVuZFZhbHVlO1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRcdFx0XHRlbmRWYWx1ZSA9IHB0LnMgKyBwdC5jO1xuXHRcdFx0XHRcdFx0XHRcdHB0LmMgKj0gaW52O1xuXHRcdFx0XHRcdFx0XHRcdHB0LnMgPSBlbmRWYWx1ZSAtIHB0LmM7XG5cdFx0XHRcdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblx0XHRcdFx0XG5cdFx0cC5yZW5kZXIgPSBmdW5jdGlvbih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcblx0XHRcdGlmICghdGhpcy5faW5pdHRlZCkgaWYgKHRoaXMuX2R1cmF0aW9uID09PSAwICYmIHRoaXMudmFycy5yZXBlYXQpIHsgLy96ZXJvIGR1cmF0aW9uIHR3ZWVucyB0aGF0IHJlbmRlciBpbW1lZGlhdGVseSBoYXZlIHJlbmRlcigpIGNhbGxlZCBmcm9tIFR3ZWVuTGl0ZSdzIGNvbnN0cnVjdG9yLCBiZWZvcmUgVHdlZW5NYXgncyBjb25zdHJ1Y3RvciBoYXMgZmluaXNoZWQgc2V0dGluZyBfcmVwZWF0LCBfcmVwZWF0RGVsYXksIGFuZCBfeW95byB3aGljaCBhcmUgY3JpdGljYWwgaW4gZGV0ZXJtaW5pbmcgdG90YWxEdXJhdGlvbigpIHNvIHdlIG5lZWQgdG8gY2FsbCBpbnZhbGlkYXRlKCkgd2hpY2ggaXMgYSBsb3cta2Igd2F5IHRvIGdldCB0aG9zZSBzZXQgcHJvcGVybHkuXG5cdFx0XHRcdHRoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRvdGFsRHVyID0gKCF0aGlzLl9kaXJ0eSkgPyB0aGlzLl90b3RhbER1cmF0aW9uIDogdGhpcy50b3RhbER1cmF0aW9uKCksXG5cdFx0XHRcdHByZXZUaW1lID0gdGhpcy5fdGltZSxcblx0XHRcdFx0cHJldlRvdGFsVGltZSA9IHRoaXMuX3RvdGFsVGltZSwgXG5cdFx0XHRcdHByZXZDeWNsZSA9IHRoaXMuX2N5Y2xlLFxuXHRcdFx0XHRkdXJhdGlvbiA9IHRoaXMuX2R1cmF0aW9uLFxuXHRcdFx0XHRwcmV2UmF3UHJldlRpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSxcblx0XHRcdFx0aXNDb21wbGV0ZSwgY2FsbGJhY2ssIHB0LCBjeWNsZUR1cmF0aW9uLCByLCB0eXBlLCBwb3csIHJhd1ByZXZUaW1lO1xuXHRcdFx0aWYgKHRpbWUgPj0gdG90YWxEdXIgLSAwLjAwMDAwMDEpIHsgLy90byB3b3JrIGFyb3VuZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IG1hdGggYXJ0aWZhY3RzLlxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0b3RhbER1cjtcblx0XHRcdFx0dGhpcy5fY3ljbGUgPSB0aGlzLl9yZXBlYXQ7XG5cdFx0XHRcdGlmICh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IDA7XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuX2NhbGNFbmQgPyB0aGlzLl9lYXNlLmdldFJhdGlvKDApIDogMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lID0gZHVyYXRpb247XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuX2NhbGNFbmQgPyB0aGlzLl9lYXNlLmdldFJhdGlvKDEpIDogMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXRoaXMuX3JldmVyc2VkKSB7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRydWU7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uQ29tcGxldGVcIjtcblx0XHRcdFx0XHRmb3JjZSA9IChmb3JjZSB8fCB0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pOyAvL290aGVyd2lzZSwgaWYgdGhlIGFuaW1hdGlvbiBpcyB1bnBhdXNlZC9hY3RpdmF0ZWQgYWZ0ZXIgaXQncyBhbHJlYWR5IGZpbmlzaGVkLCBpdCBkb2Vzbid0IGdldCByZW1vdmVkIGZyb20gdGhlIHBhcmVudCB0aW1lbGluZS5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZHVyYXRpb24gPT09IDApIGlmICh0aGlzLl9pbml0dGVkIHx8ICF0aGlzLnZhcnMubGF6eSB8fCBmb3JjZSkgeyAvL3plcm8tZHVyYXRpb24gdHdlZW5zIGFyZSB0cmlja3kgYmVjYXVzZSB3ZSBtdXN0IGRpc2Nlcm4gdGhlIG1vbWVudHVtL2RpcmVjdGlvbiBvZiB0aW1lIGluIG9yZGVyIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBzdGFydGluZyB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkIG9yIHRoZSBlbmRpbmcgdmFsdWVzLiBJZiB0aGUgXCJwbGF5aGVhZFwiIG9mIGl0cyB0aW1lbGluZSBnb2VzIHBhc3QgdGhlIHplcm8tZHVyYXRpb24gdHdlZW4gaW4gdGhlIGZvcndhcmQgZGlyZWN0aW9uIG9yIGxhbmRzIGRpcmVjdGx5IG9uIGl0LCB0aGUgZW5kIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQsIGJ1dCBpZiB0aGUgdGltZWxpbmUncyBcInBsYXloZWFkXCIgbW92ZXMgcGFzdCBpdCBpbiB0aGUgYmFja3dhcmQgZGlyZWN0aW9uIChmcm9tIGEgcG9zdGl0aXZlIHRpbWUgdG8gYSBuZWdhdGl2ZSB0aW1lKSwgdGhlIHN0YXJ0aW5nIHZhbHVlcyBtdXN0IGJlIHJlbmRlcmVkLlxuXHRcdFx0XHRcdGlmICh0aGlzLl9zdGFydFRpbWUgPT09IHRoaXMuX3RpbWVsaW5lLl9kdXJhdGlvbikgeyAvL2lmIGEgemVyby1kdXJhdGlvbiB0d2VlbiBpcyBhdCB0aGUgVkVSWSBlbmQgb2YgYSB0aW1lbGluZSBhbmQgdGhhdCB0aW1lbGluZSByZW5kZXJzIGF0IGl0cyBlbmQsIGl0IHdpbGwgdHlwaWNhbGx5IGFkZCBhIHRpbnkgYml0IG9mIGN1c2hpb24gdG8gdGhlIHJlbmRlciB0aW1lIHRvIHByZXZlbnQgcm91bmRpbmcgZXJyb3JzIGZyb20gZ2V0dGluZyBpbiB0aGUgd2F5IG9mIHR3ZWVucyByZW5kZXJpbmcgdGhlaXIgVkVSWSBlbmQuIElmIHdlIHRoZW4gcmV2ZXJzZSgpIHRoYXQgdGltZWxpbmUsIHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIHdpbGwgdHJpZ2dlciBpdHMgb25SZXZlcnNlQ29tcGxldGUgZXZlbiB0aG91Z2ggdGVjaG5pY2FsbHkgdGhlIHBsYXloZWFkIGRpZG4ndCBwYXNzIG92ZXIgaXQgYWdhaW4uIEl0J3MgYSB2ZXJ5IHNwZWNpZmljIGVkZ2UgY2FzZSB3ZSBtdXN0IGFjY29tbW9kYXRlLlxuXHRcdFx0XHRcdFx0dGltZSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwcmV2UmF3UHJldlRpbWUgPCAwIHx8ICh0aW1lIDw9IDAgJiYgdGltZSA+PSAtMC4wMDAwMDAxKSB8fCAocHJldlJhd1ByZXZUaW1lID09PSBfdGlueU51bSAmJiB0aGlzLmRhdGEgIT09IFwiaXNQYXVzZVwiKSkgaWYgKHByZXZSYXdQcmV2VGltZSAhPT0gdGltZSkgeyAvL25vdGU6IHdoZW4gdGhpcy5kYXRhIGlzIFwiaXNQYXVzZVwiLCBpdCdzIGEgY2FsbGJhY2sgYWRkZWQgYnkgYWRkUGF1c2UoKSBvbiBhIHRpbWVsaW5lIHRoYXQgd2Ugc2hvdWxkIG5vdCBiZSB0cmlnZ2VyZWQgd2hlbiBMRUFWSU5HIGl0cyBleGFjdCBzdGFydCB0aW1lLiBJbiBvdGhlciB3b3JkcywgdGwuYWRkUGF1c2UoMSkucGxheSgxKSBzaG91bGRuJ3QgcGF1c2UuXG5cdFx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID4gX3RpbnlOdW0pIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmF3UHJldlRpbWUgPSAoIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgcHJldlJhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH0gZWxzZSBpZiAodGltZSA8IDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMsIHJvdW5kIHN1cGVyIHNtYWxsIHZhbHVlcyB0byAwLlxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gdGhpcy5fY3ljbGUgPSAwO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMCkgOiAwO1xuXHRcdFx0XHRpZiAocHJldlRvdGFsVGltZSAhPT0gMCB8fCAoZHVyYXRpb24gPT09IDAgJiYgcHJldlJhd1ByZXZUaW1lID4gMCkpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRpbWUgPCAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwKSBpZiAodGhpcy5faW5pdHRlZCB8fCAhdGhpcy52YXJzLmxhenkgfHwgZm9yY2UpIHsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyBhcmUgdHJpY2t5IGJlY2F1c2Ugd2UgbXVzdCBkaXNjZXJuIHRoZSBtb21lbnR1bS9kaXJlY3Rpb24gb2YgdGltZSBpbiBvcmRlciB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgc3RhcnRpbmcgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCBvciB0aGUgZW5kaW5nIHZhbHVlcy4gSWYgdGhlIFwicGxheWhlYWRcIiBvZiBpdHMgdGltZWxpbmUgZ29lcyBwYXN0IHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGluIHRoZSBmb3J3YXJkIGRpcmVjdGlvbiBvciBsYW5kcyBkaXJlY3RseSBvbiBpdCwgdGhlIGVuZCB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBidXQgaWYgdGhlIHRpbWVsaW5lJ3MgXCJwbGF5aGVhZFwiIG1vdmVzIHBhc3QgaXQgaW4gdGhlIGJhY2t3YXJkIGRpcmVjdGlvbiAoZnJvbSBhIHBvc3RpdGl2ZSB0aW1lIHRvIGEgbmVnYXRpdmUgdGltZSksIHRoZSBzdGFydGluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZC5cblx0XHRcdFx0XHRcdGlmIChwcmV2UmF3UHJldlRpbWUgPj0gMCkge1xuXHRcdFx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHJhd1ByZXZUaW1lID0gKCFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHByZXZSYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCkgeyAvL2lmIHdlIHJlbmRlciB0aGUgdmVyeSBiZWdpbm5pbmcgKHRpbWUgPT0gMCkgb2YgYSBmcm9tVG8oKSwgd2UgbXVzdCBmb3JjZSB0aGUgcmVuZGVyIChub3JtYWwgdHdlZW5zIHdvdWxkbid0IG5lZWQgdG8gcmVuZGVyIGF0IGEgdGltZSBvZiAwIHdoZW4gdGhlIHByZXZUaW1lIHdhcyBhbHNvIDApLiBUaGlzIGlzIGFsc28gbWFuZGF0b3J5IHRvIG1ha2Ugc3VyZSBvdmVyd3JpdGluZyBraWNrcyBpbiBpbW1lZGlhdGVseS5cblx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0aW1lO1xuXHRcdFx0XHRpZiAodGhpcy5fcmVwZWF0ICE9PSAwKSB7XG5cdFx0XHRcdFx0Y3ljbGVEdXJhdGlvbiA9IGR1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXk7XG5cdFx0XHRcdFx0dGhpcy5fY3ljbGUgPSAodGhpcy5fdG90YWxUaW1lIC8gY3ljbGVEdXJhdGlvbikgPj4gMDsgLy9vcmlnaW5hbGx5IF90b3RhbFRpbWUgJSBjeWNsZUR1cmF0aW9uIGJ1dCBmbG9hdGluZyBwb2ludCBlcnJvcnMgY2F1c2VkIHByb2JsZW1zLCBzbyBJIG5vcm1hbGl6ZWQgaXQuICg0ICUgMC44IHNob3VsZCBiZSAwIGJ1dCBzb21lIGJyb3dzZXJzIHJlcG9ydCBpdCBhcyAwLjc5OTk5OTk5ISlcblx0XHRcdFx0XHRpZiAodGhpcy5fY3ljbGUgIT09IDApIGlmICh0aGlzLl9jeWNsZSA9PT0gdGhpcy5fdG90YWxUaW1lIC8gY3ljbGVEdXJhdGlvbiAmJiBwcmV2VG90YWxUaW1lIDw9IHRpbWUpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2N5Y2xlLS07IC8vb3RoZXJ3aXNlIHdoZW4gcmVuZGVyZWQgZXhhY3RseSBhdCB0aGUgZW5kIHRpbWUsIGl0IHdpbGwgYWN0IGFzIHRob3VnaCBpdCBpcyByZXBlYXRpbmcgKGF0IHRoZSBiZWdpbm5pbmcpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl90b3RhbFRpbWUgLSAodGhpcy5fY3ljbGUgKiBjeWNsZUR1cmF0aW9uKTtcblx0XHRcdFx0XHRpZiAodGhpcy5feW95bykgaWYgKCh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gZHVyYXRpb24gLSB0aGlzLl90aW1lO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZSA+IGR1cmF0aW9uKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gZHVyYXRpb247XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lIDwgMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fdGltZSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX2Vhc2VUeXBlKSB7XG5cdFx0XHRcdFx0ciA9IHRoaXMuX3RpbWUgLyBkdXJhdGlvbjtcblx0XHRcdFx0XHR0eXBlID0gdGhpcy5fZWFzZVR5cGU7XG5cdFx0XHRcdFx0cG93ID0gdGhpcy5fZWFzZVBvd2VyO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSAxIHx8ICh0eXBlID09PSAzICYmIHIgPj0gMC41KSkge1xuXHRcdFx0XHRcdFx0ciA9IDEgLSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMykge1xuXHRcdFx0XHRcdFx0ciAqPSAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocG93ID09PSAxKSB7XG5cdFx0XHRcdFx0XHRyICo9IHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDIpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDMpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHIgKiByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocG93ID09PSA0KSB7XG5cdFx0XHRcdFx0XHRyICo9IHIgKiByICogciAqIHI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDEpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IDIpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdGltZSAvIGR1cmF0aW9uIDwgMC41KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJhdGlvID0gciAvIDI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gKHIgLyAyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lIC8gZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdGlmIChwcmV2VGltZSA9PT0gdGhpcy5fdGltZSAmJiAhZm9yY2UgJiYgcHJldkN5Y2xlID09PSB0aGlzLl9jeWNsZSkge1xuXHRcdFx0XHRpZiAocHJldlRvdGFsVGltZSAhPT0gdGhpcy5fdG90YWxUaW1lKSBpZiAodGhpcy5fb25VcGRhdGUpIGlmICghc3VwcHJlc3NFdmVudHMpIHsgLy9zbyB0aGF0IG9uVXBkYXRlIGZpcmVzIGV2ZW4gZHVyaW5nIHRoZSByZXBlYXREZWxheSAtIGFzIGxvbmcgYXMgdGhlIHRvdGFsVGltZSBjaGFuZ2VkLCB3ZSBzaG91bGQgdHJpZ2dlciBvblVwZGF0ZS5cblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSBpZiAoIXRoaXMuX2luaXR0ZWQpIHtcblx0XHRcdFx0dGhpcy5faW5pdCgpO1xuXHRcdFx0XHRpZiAoIXRoaXMuX2luaXR0ZWQgfHwgdGhpcy5fZ2MpIHsgLy9pbW1lZGlhdGVSZW5kZXIgdHdlZW5zIHR5cGljYWxseSB3b24ndCBpbml0aWFsaXplIHVudGlsIHRoZSBwbGF5aGVhZCBhZHZhbmNlcyAoX3RpbWUgaXMgZ3JlYXRlciB0aGFuIDApIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IG92ZXJ3cml0aW5nIG9jY3VycyBwcm9wZXJseS4gQWxzbywgaWYgYWxsIG9mIHRoZSB0d2VlbmluZyBwcm9wZXJ0aWVzIGhhdmUgYmVlbiBvdmVyd3JpdHRlbiAod2hpY2ggd291bGQgY2F1c2UgX2djIHRvIGJlIHRydWUsIGFzIHNldCBpbiBfaW5pdCgpKSwgd2Ugc2hvdWxkbid0IGNvbnRpbnVlIG90aGVyd2lzZSBhbiBvblN0YXJ0IGNhbGxiYWNrIGNvdWxkIGJlIGNhbGxlZCBmb3IgZXhhbXBsZS5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWZvcmNlICYmIHRoaXMuX2ZpcnN0UFQgJiYgKCh0aGlzLnZhcnMubGF6eSAhPT0gZmFsc2UgJiYgdGhpcy5fZHVyYXRpb24pIHx8ICh0aGlzLnZhcnMubGF6eSAmJiAhdGhpcy5fZHVyYXRpb24pKSkgeyAvL3dlIHN0aWNrIGl0IGluIHRoZSBxdWV1ZSBmb3IgcmVuZGVyaW5nIGF0IHRoZSB2ZXJ5IGVuZCBvZiB0aGUgdGljayAtIHRoaXMgaXMgYSBwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24gYmVjYXVzZSBicm93c2VycyBpbnZhbGlkYXRlIHN0eWxlcyBhbmQgZm9yY2UgYSByZWNhbGN1bGF0aW9uIGlmIHlvdSByZWFkLCB3cml0ZSwgYW5kIHRoZW4gcmVhZCBzdHlsZSBkYXRhIChzbyBpdCdzIGJldHRlciB0byByZWFkL3JlYWQvcmVhZC93cml0ZS93cml0ZS93cml0ZSB0aGFuIHJlYWQvd3JpdGUvcmVhZC93cml0ZS9yZWFkL3dyaXRlKS4gVGhlIGRvd24gc2lkZSwgb2YgY291cnNlLCBpcyB0aGF0IHVzdWFsbHkgeW91IFdBTlQgdGhpbmdzIHRvIHJlbmRlciBpbW1lZGlhdGVseSBiZWNhdXNlIHlvdSBtYXkgaGF2ZSBjb2RlIHJ1bm5pbmcgcmlnaHQgYWZ0ZXIgdGhhdCB3aGljaCBkZXBlbmRzIG9uIHRoZSBjaGFuZ2UuIExpa2UgaW1hZ2luZSBydW5uaW5nIFR3ZWVuTGl0ZS5zZXQoLi4uKSBhbmQgdGhlbiBpbW1lZGlhdGVseSBhZnRlciB0aGF0LCBjcmVhdGluZyBhIG5vdGhlciB0d2VlbiB0aGF0IGFuaW1hdGVzIHRoZSBzYW1lIHByb3BlcnR5IHRvIGFub3RoZXIgdmFsdWU7IHRoZSBzdGFydGluZyB2YWx1ZXMgb2YgdGhhdCAybmQgdHdlZW4gd291bGRuJ3QgYmUgYWNjdXJhdGUgaWYgbGF6eSBpcyB0cnVlLlxuXHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBwcmV2VGltZTtcblx0XHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSBwcmV2VG90YWxUaW1lO1xuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcHJldlJhd1ByZXZUaW1lO1xuXHRcdFx0XHRcdHRoaXMuX2N5Y2xlID0gcHJldkN5Y2xlO1xuXHRcdFx0XHRcdFR3ZWVuTGl0ZUludGVybmFscy5sYXp5VHdlZW5zLnB1c2godGhpcyk7XG5cdFx0XHRcdFx0dGhpcy5fbGF6eSA9IFt0aW1lLCBzdXBwcmVzc0V2ZW50c107XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vX2Vhc2UgaXMgaW5pdGlhbGx5IHNldCB0byBkZWZhdWx0RWFzZSwgc28gbm93IHRoYXQgaW5pdCgpIGhhcyBydW4sIF9lYXNlIGlzIHNldCBwcm9wZXJseSBhbmQgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSB0aGUgcmF0aW8uIE92ZXJhbGwgdGhpcyBpcyBmYXN0ZXIgdGhhbiB1c2luZyBjb25kaXRpb25hbCBsb2dpYyBlYXJsaWVyIGluIHRoZSBtZXRob2QgdG8gYXZvaWQgaGF2aW5nIHRvIHNldCByYXRpbyB0d2ljZSBiZWNhdXNlIHdlIG9ubHkgaW5pdCgpIG9uY2UgYnV0IHJlbmRlclRpbWUoKSBnZXRzIGNhbGxlZCBWRVJZIGZyZXF1ZW50bHkuXG5cdFx0XHRcdGlmICh0aGlzLl90aW1lICYmICFpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuZ2V0UmF0aW8odGhpcy5fdGltZSAvIGR1cmF0aW9uKTtcblx0XHRcdFx0fSBlbHNlIGlmIChpc0NvbXBsZXRlICYmIHRoaXMuX2Vhc2UuX2NhbGNFbmQpIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbygodGhpcy5fdGltZSA9PT0gMCkgPyAwIDogMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9sYXp5ICE9PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghdGhpcy5fYWN0aXZlKSBpZiAoIXRoaXMuX3BhdXNlZCAmJiB0aGlzLl90aW1lICE9PSBwcmV2VGltZSAmJiB0aW1lID49IDApIHtcblx0XHRcdFx0dGhpcy5fYWN0aXZlID0gdHJ1ZTsgLy9zbyB0aGF0IGlmIHRoZSB1c2VyIHJlbmRlcnMgYSB0d2VlbiAoYXMgb3Bwb3NlZCB0byB0aGUgdGltZWxpbmUgcmVuZGVyaW5nIGl0KSwgdGhlIHRpbWVsaW5lIGlzIGZvcmNlZCB0byByZS1yZW5kZXIgYW5kIGFsaWduIGl0IHdpdGggdGhlIHByb3BlciB0aW1lL2ZyYW1lIG9uIHRoZSBuZXh0IHJlbmRlcmluZyBjeWNsZS4gTWF5YmUgdGhlIHR3ZWVuIGFscmVhZHkgZmluaXNoZWQgYnV0IHRoZSB1c2VyIG1hbnVhbGx5IHJlLXJlbmRlcnMgaXQgYXMgaGFsZndheSBkb25lLlxuXHRcdFx0fVxuXHRcdFx0aWYgKHByZXZUb3RhbFRpbWUgPT09IDApIHtcblx0XHRcdFx0aWYgKHRoaXMuX2luaXR0ZWQgPT09IDIgJiYgdGltZSA+IDApIHtcblx0XHRcdFx0XHQvL3RoaXMuaW52YWxpZGF0ZSgpO1xuXHRcdFx0XHRcdHRoaXMuX2luaXQoKTsgLy93aWxsIGp1c3QgYXBwbHkgb3ZlcndyaXRpbmcgc2luY2UgX2luaXR0ZWQgb2YgKDIpIG1lYW5zIGl0IHdhcyBhIGZyb20oKSB0d2VlbiB0aGF0IGhhZCBpbW1lZGlhdGVSZW5kZXI6dHJ1ZVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9zdGFydEF0KSB7XG5cdFx0XHRcdFx0aWYgKHRpbWUgPj0gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIl9kdW1teUdTXCI7IC8vaWYgbm8gY2FsbGJhY2sgaXMgZGVmaW5lZCwgdXNlIGEgZHVtbXkgdmFsdWUganVzdCBzbyB0aGF0IHRoZSBjb25kaXRpb24gYXQgdGhlIGVuZCBldmFsdWF0ZXMgYXMgdHJ1ZSBiZWNhdXNlIF9zdGFydEF0IHNob3VsZCByZW5kZXIgQUZURVIgdGhlIG5vcm1hbCByZW5kZXIgbG9vcCB3aGVuIHRoZSB0aW1lIGlzIG5lZ2F0aXZlLiBXZSBjb3VsZCBoYW5kbGUgdGhpcyBpbiBhIG1vcmUgaW50dWl0aXZlIHdheSwgb2YgY291cnNlLCBidXQgdGhlIHJlbmRlciBsb29wIGlzIHRoZSBNT1NUIGltcG9ydGFudCB0aGluZyB0byBvcHRpbWl6ZSwgc28gdGhpcyB0ZWNobmlxdWUgYWxsb3dzIHVzIHRvIGF2b2lkIGFkZGluZyBleHRyYSBjb25kaXRpb25hbCBsb2dpYyBpbiBhIGhpZ2gtZnJlcXVlbmN5IGFyZWEuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLnZhcnMub25TdGFydCkgaWYgKHRoaXMuX3RvdGFsVGltZSAhPT0gMCB8fCBkdXJhdGlvbiA9PT0gMCkgaWYgKCFzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25TdGFydFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKHB0LmYpIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucztcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAodGhpcy5fb25VcGRhdGUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwKSBpZiAodGhpcy5fc3RhcnRBdCAmJiB0aGlzLl9zdGFydFRpbWUpIHsgLy9pZiB0aGUgdHdlZW4gaXMgcG9zaXRpb25lZCBhdCB0aGUgVkVSWSBiZWdpbm5pbmcgKF9zdGFydFRpbWUgMCkgb2YgaXRzIHBhcmVudCB0aW1lbGluZSwgaXQncyBpbGxlZ2FsIGZvciB0aGUgcGxheWhlYWQgdG8gZ28gYmFjayBmdXJ0aGVyLCBzbyB3ZSBzaG91bGQgbm90IHJlbmRlciB0aGUgcmVjb3JkZWQgc3RhcnRBdCB2YWx1ZXMuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTsgLy9ub3RlOiBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgd2UgdHVjayB0aGlzIGNvbmRpdGlvbmFsIGxvZ2ljIGluc2lkZSBsZXNzIHRyYXZlbGVkIGFyZWFzIChtb3N0IHR3ZWVucyBkb24ndCBoYXZlIGFuIG9uVXBkYXRlKS4gV2UnZCBqdXN0IGhhdmUgaXQgYXQgdGhlIGVuZCBiZWZvcmUgdGhlIG9uQ29tcGxldGUsIGJ1dCB0aGUgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkIGJlZm9yZSBhbnkgb25VcGRhdGUgaXMgY2FsbGVkLCBzbyB3ZSBBTFNPIHB1dCBpdCBoZXJlIGFuZCB0aGVuIGlmIGl0J3Mgbm90IGNhbGxlZCwgd2UgZG8gc28gbGF0ZXIgbmVhciB0aGUgb25Db21wbGV0ZS5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXN1cHByZXNzRXZlbnRzKSBpZiAodGhpcy5fdG90YWxUaW1lICE9PSBwcmV2VG90YWxUaW1lIHx8IGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblVwZGF0ZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2N5Y2xlICE9PSBwcmV2Q3ljbGUpIGlmICghc3VwcHJlc3NFdmVudHMpIGlmICghdGhpcy5fZ2MpIGlmICh0aGlzLnZhcnMub25SZXBlYXQpIHtcblx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblJlcGVhdFwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChjYWxsYmFjaykgaWYgKCF0aGlzLl9nYyB8fCBmb3JjZSkgeyAvL2NoZWNrIGdjIGJlY2F1c2UgdGhlcmUncyBhIGNoYW5jZSB0aGF0IGtpbGwoKSBjb3VsZCBiZSBjYWxsZWQgaW4gYW4gb25VcGRhdGVcblx0XHRcdFx0aWYgKHRpbWUgPCAwICYmIHRoaXMuX3N0YXJ0QXQgJiYgIXRoaXMuX29uVXBkYXRlICYmIHRoaXMuX3N0YXJ0VGltZSkgeyAvL2lmIHRoZSB0d2VlbiBpcyBwb3NpdGlvbmVkIGF0IHRoZSBWRVJZIGJlZ2lubmluZyAoX3N0YXJ0VGltZSAwKSBvZiBpdHMgcGFyZW50IHRpbWVsaW5lLCBpdCdzIGlsbGVnYWwgZm9yIHRoZSBwbGF5aGVhZCB0byBnbyBiYWNrIGZ1cnRoZXIsIHNvIHdlIHNob3VsZCBub3QgcmVuZGVyIHRoZSByZWNvcmRlZCBzdGFydEF0IHZhbHVlcy5cblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbikge1xuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXN1cHByZXNzRXZlbnRzICYmIHRoaXMudmFyc1tjYWxsYmFja10pIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhjYWxsYmFjayk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwICYmIHRoaXMuX3Jhd1ByZXZUaW1lID09PSBfdGlueU51bSAmJiByYXdQcmV2VGltZSAhPT0gX3RpbnlOdW0pIHsgLy90aGUgb25Db21wbGV0ZSBvciBvblJldmVyc2VDb21wbGV0ZSBjb3VsZCB0cmlnZ2VyIG1vdmVtZW50IG9mIHRoZSBwbGF5aGVhZCBhbmQgZm9yIHplcm8tZHVyYXRpb24gdHdlZW5zICh3aGljaCBtdXN0IGRpc2Nlcm4gZGlyZWN0aW9uKSB0aGF0IGxhbmQgZGlyZWN0bHkgYmFjayBvbiB0aGVpciBzdGFydCB0aW1lLCB3ZSBkb24ndCB3YW50IHRvIGZpcmUgYWdhaW4gb24gdGhlIG5leHQgcmVuZGVyLiBUaGluayBvZiBzZXZlcmFsIGFkZFBhdXNlKCkncyBpbiBhIHRpbWVsaW5lIHRoYXQgZm9yY2VzIHRoZSBwbGF5aGVhZCB0byBhIGNlcnRhaW4gc3BvdCwgYnV0IHdoYXQgaWYgaXQncyBhbHJlYWR5IHBhdXNlZCBhbmQgYW5vdGhlciB0d2VlbiBpcyB0d2VlbmluZyB0aGUgXCJ0aW1lXCIgb2YgdGhlIHRpbWVsaW5lPyBFYWNoIHRpbWUgaXQgbW92ZXMgW2ZvcndhcmRdIHBhc3QgdGhhdCBzcG90LCBpdCB3b3VsZCBtb3ZlIGJhY2ssIGFuZCBzaW5jZSBzdXBwcmVzc0V2ZW50cyBpcyB0cnVlLCBpdCdkIHJlc2V0IF9yYXdQcmV2VGltZSB0byBfdGlueU51bSBzbyB0aGF0IHdoZW4gaXQgYmVnaW5zIGFnYWluLCB0aGUgY2FsbGJhY2sgd291bGQgZmlyZSAoc28gdWx0aW1hdGVseSBpdCBjb3VsZCBib3VuY2UgYmFjayBhbmQgZm9ydGggZHVyaW5nIHRoYXQgdHdlZW4pLiBBZ2FpbiwgdGhpcyBpcyBhIHZlcnkgdW5jb21tb24gc2NlbmFyaW8sIGJ1dCBwb3NzaWJsZSBub25ldGhlbGVzcy5cblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuLy8tLS0tIFNUQVRJQyBGVU5DVElPTlMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcblx0XHRUd2Vlbk1heC50byA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5NYXgodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblx0XHRcblx0XHRUd2Vlbk1heC5mcm9tID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0dmFycy5ydW5CYWNrd2FyZHMgPSB0cnVlO1xuXHRcdFx0dmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIG5ldyBUd2Vlbk1heCh0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmZyb21UbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMpIHtcblx0XHRcdHRvVmFycy5zdGFydEF0ID0gZnJvbVZhcnM7XG5cdFx0XHR0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UgJiYgZnJvbVZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5NYXgodGFyZ2V0LCBkdXJhdGlvbiwgdG9WYXJzKTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnN0YWdnZXJUbyA9IFR3ZWVuTWF4LmFsbFRvID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSkge1xuXHRcdFx0c3RhZ2dlciA9IHN0YWdnZXIgfHwgMDtcblx0XHRcdHZhciBkZWxheSA9IDAsXG5cdFx0XHRcdGEgPSBbXSxcblx0XHRcdFx0ZmluYWxDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICh2YXJzLm9uQ29tcGxldGUpIHtcblx0XHRcdFx0XHRcdHZhcnMub25Db21wbGV0ZS5hcHBseSh2YXJzLm9uQ29tcGxldGVTY29wZSB8fCB0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvbkNvbXBsZXRlQWxsLmFwcGx5KG9uQ29tcGxldGVBbGxTY29wZSB8fCB2YXJzLmNhbGxiYWNrU2NvcGUgfHwgdGhpcywgb25Db21wbGV0ZUFsbFBhcmFtcyB8fCBfYmxhbmtBcnJheSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGN5Y2xlID0gdmFycy5jeWNsZSxcblx0XHRcdFx0ZnJvbUN5Y2xlID0gKHZhcnMuc3RhcnRBdCAmJiB2YXJzLnN0YXJ0QXQuY3ljbGUpLFxuXHRcdFx0XHRsLCBjb3B5LCBpLCBwO1xuXHRcdFx0aWYgKCFfaXNBcnJheSh0YXJnZXRzKSkge1xuXHRcdFx0XHRpZiAodHlwZW9mKHRhcmdldHMpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0dGFyZ2V0cyA9IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnZXRzKSB8fCB0YXJnZXRzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChfaXNTZWxlY3Rvcih0YXJnZXRzKSkge1xuXHRcdFx0XHRcdHRhcmdldHMgPSBfc2xpY2UodGFyZ2V0cyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRhcmdldHMgPSB0YXJnZXRzIHx8IFtdO1xuXHRcdFx0aWYgKHN0YWdnZXIgPCAwKSB7XG5cdFx0XHRcdHRhcmdldHMgPSBfc2xpY2UodGFyZ2V0cyk7XG5cdFx0XHRcdHRhcmdldHMucmV2ZXJzZSgpO1xuXHRcdFx0XHRzdGFnZ2VyICo9IC0xO1xuXHRcdFx0fVxuXHRcdFx0bCA9IHRhcmdldHMubGVuZ3RoIC0gMTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPD0gbDsgaSsrKSB7XG5cdFx0XHRcdGNvcHkgPSB7fTtcblx0XHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0XHRjb3B5W3BdID0gdmFyc1twXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY3ljbGUpIHtcblx0XHRcdFx0XHRfYXBwbHlDeWNsZShjb3B5LCB0YXJnZXRzLCBpKTtcblx0XHRcdFx0XHRpZiAoY29weS5kdXJhdGlvbiAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRkdXJhdGlvbiA9IGNvcHkuZHVyYXRpb247XG5cdFx0XHRcdFx0XHRkZWxldGUgY29weS5kdXJhdGlvbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGZyb21DeWNsZSkge1xuXHRcdFx0XHRcdGZyb21DeWNsZSA9IGNvcHkuc3RhcnRBdCA9IHt9O1xuXHRcdFx0XHRcdGZvciAocCBpbiB2YXJzLnN0YXJ0QXQpIHtcblx0XHRcdFx0XHRcdGZyb21DeWNsZVtwXSA9IHZhcnMuc3RhcnRBdFtwXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0X2FwcGx5Q3ljbGUoY29weS5zdGFydEF0LCB0YXJnZXRzLCBpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb3B5LmRlbGF5ID0gZGVsYXkgKyAoY29weS5kZWxheSB8fCAwKTtcblx0XHRcdFx0aWYgKGkgPT09IGwgJiYgb25Db21wbGV0ZUFsbCkge1xuXHRcdFx0XHRcdGNvcHkub25Db21wbGV0ZSA9IGZpbmFsQ29tcGxldGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YVtpXSA9IG5ldyBUd2Vlbk1heCh0YXJnZXRzW2ldLCBkdXJhdGlvbiwgY29weSk7XG5cdFx0XHRcdGRlbGF5ICs9IHN0YWdnZXI7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tID0gVHdlZW5NYXguYWxsRnJvbSA9IGZ1bmN0aW9uKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpIHtcblx0XHRcdHZhcnMucnVuQmFja3dhcmRzID0gdHJ1ZTtcblx0XHRcdHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHJldHVybiBUd2Vlbk1heC5zdGFnZ2VyVG8odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSk7XG5cdFx0fTtcblx0XHRcblx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvID0gVHdlZW5NYXguYWxsRnJvbVRvID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMsIHN0YWdnZXIsIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSkge1xuXHRcdFx0dG9WYXJzLnN0YXJ0QXQgPSBmcm9tVmFycztcblx0XHRcdHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodG9WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSAmJiBmcm9tVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIFR3ZWVuTWF4LnN0YWdnZXJUbyh0YXJnZXRzLCBkdXJhdGlvbiwgdG9WYXJzLCBzdGFnZ2VyLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpO1xuXHRcdH07XG5cdFx0XHRcdFxuXHRcdFR3ZWVuTWF4LmRlbGF5ZWRDYWxsID0gZnVuY3Rpb24oZGVsYXksIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlLCB1c2VGcmFtZXMpIHtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5NYXgoY2FsbGJhY2ssIDAsIHtkZWxheTpkZWxheSwgb25Db21wbGV0ZTpjYWxsYmFjaywgb25Db21wbGV0ZVBhcmFtczpwYXJhbXMsIGNhbGxiYWNrU2NvcGU6c2NvcGUsIG9uUmV2ZXJzZUNvbXBsZXRlOmNhbGxiYWNrLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczpwYXJhbXMsIGltbWVkaWF0ZVJlbmRlcjpmYWxzZSwgdXNlRnJhbWVzOnVzZUZyYW1lcywgb3ZlcndyaXRlOjB9KTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnNldCA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2Vlbk1heCh0YXJnZXQsIDAsIHZhcnMpO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXguaXNUd2VlbmluZyA9IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0cmV0dXJuIChUd2VlbkxpdGUuZ2V0VHdlZW5zT2YodGFyZ2V0LCB0cnVlKS5sZW5ndGggPiAwKTtcblx0XHR9O1xuXHRcdFxuXHRcdHZhciBfZ2V0Q2hpbGRyZW5PZiA9IGZ1bmN0aW9uKHRpbWVsaW5lLCBpbmNsdWRlVGltZWxpbmVzKSB7XG5cdFx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdFx0Y250ID0gMCxcblx0XHRcdFx0XHR0d2VlbiA9IHRpbWVsaW5lLl9maXJzdDtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0aWYgKHR3ZWVuIGluc3RhbmNlb2YgVHdlZW5MaXRlKSB7XG5cdFx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoaW5jbHVkZVRpbWVsaW5lcykge1xuXHRcdFx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YSA9IGEuY29uY2F0KF9nZXRDaGlsZHJlbk9mKHR3ZWVuLCBpbmNsdWRlVGltZWxpbmVzKSk7XG5cdFx0XHRcdFx0XHRjbnQgPSBhLmxlbmd0aDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYTtcblx0XHRcdH0sIFxuXHRcdFx0Z2V0QWxsVHdlZW5zID0gVHdlZW5NYXguZ2V0QWxsVHdlZW5zID0gZnVuY3Rpb24oaW5jbHVkZVRpbWVsaW5lcykge1xuXHRcdFx0XHRyZXR1cm4gX2dldENoaWxkcmVuT2YoQW5pbWF0aW9uLl9yb290VGltZWxpbmUsIGluY2x1ZGVUaW1lbGluZXMpLmNvbmNhdCggX2dldENoaWxkcmVuT2YoQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUsIGluY2x1ZGVUaW1lbGluZXMpICk7XG5cdFx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmtpbGxBbGwgPSBmdW5jdGlvbihjb21wbGV0ZSwgdHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0aWYgKHR3ZWVucyA9PSBudWxsKSB7XG5cdFx0XHRcdHR3ZWVucyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGVsYXllZENhbGxzID09IG51bGwpIHtcblx0XHRcdFx0ZGVsYXllZENhbGxzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHZhciBhID0gZ2V0QWxsVHdlZW5zKCh0aW1lbGluZXMgIT0gZmFsc2UpKSxcblx0XHRcdFx0bCA9IGEubGVuZ3RoLFxuXHRcdFx0XHRhbGxUcnVlID0gKHR3ZWVucyAmJiBkZWxheWVkQ2FsbHMgJiYgdGltZWxpbmVzKSxcblx0XHRcdFx0aXNEQywgdHdlZW4sIGk7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdHR3ZWVuID0gYVtpXTtcblx0XHRcdFx0aWYgKGFsbFRydWUgfHwgKHR3ZWVuIGluc3RhbmNlb2YgU2ltcGxlVGltZWxpbmUpIHx8ICgoaXNEQyA9ICh0d2Vlbi50YXJnZXQgPT09IHR3ZWVuLnZhcnMub25Db21wbGV0ZSkpICYmIGRlbGF5ZWRDYWxscykgfHwgKHR3ZWVucyAmJiAhaXNEQykpIHtcblx0XHRcdFx0XHRpZiAoY29tcGxldGUpIHtcblx0XHRcdFx0XHRcdHR3ZWVuLnRvdGFsVGltZSh0d2Vlbi5fcmV2ZXJzZWQgPyAwIDogdHdlZW4udG90YWxEdXJhdGlvbigpKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dHdlZW4uX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmtpbGxDaGlsZFR3ZWVuc09mID0gZnVuY3Rpb24ocGFyZW50LCBjb21wbGV0ZSkge1xuXHRcdFx0aWYgKHBhcmVudCA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciB0bCA9IFR3ZWVuTGl0ZUludGVybmFscy50d2Vlbkxvb2t1cCxcblx0XHRcdFx0YSwgY3VyUGFyZW50LCBwLCBpLCBsO1xuXHRcdFx0aWYgKHR5cGVvZihwYXJlbnQpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHBhcmVudCA9IFR3ZWVuTGl0ZS5zZWxlY3RvcihwYXJlbnQpIHx8IHBhcmVudDtcblx0XHRcdH1cblx0XHRcdGlmIChfaXNTZWxlY3RvcihwYXJlbnQpKSB7XG5cdFx0XHRcdHBhcmVudCA9IF9zbGljZShwYXJlbnQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKF9pc0FycmF5KHBhcmVudCkpIHtcblx0XHRcdFx0aSA9IHBhcmVudC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFR3ZWVuTWF4LmtpbGxDaGlsZFR3ZWVuc09mKHBhcmVudFtpXSwgY29tcGxldGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGEgPSBbXTtcblx0XHRcdGZvciAocCBpbiB0bCkge1xuXHRcdFx0XHRjdXJQYXJlbnQgPSB0bFtwXS50YXJnZXQucGFyZW50Tm9kZTtcblx0XHRcdFx0d2hpbGUgKGN1clBhcmVudCkge1xuXHRcdFx0XHRcdGlmIChjdXJQYXJlbnQgPT09IHBhcmVudCkge1xuXHRcdFx0XHRcdFx0YSA9IGEuY29uY2F0KHRsW3BdLnR3ZWVucyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN1clBhcmVudCA9IGN1clBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsID0gYS5sZW5ndGg7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChjb21wbGV0ZSkge1xuXHRcdFx0XHRcdGFbaV0udG90YWxUaW1lKGFbaV0udG90YWxEdXJhdGlvbigpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhW2ldLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciBfY2hhbmdlUGF1c2UgPSBmdW5jdGlvbihwYXVzZSwgdHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0dHdlZW5zID0gKHR3ZWVucyAhPT0gZmFsc2UpO1xuXHRcdFx0ZGVsYXllZENhbGxzID0gKGRlbGF5ZWRDYWxscyAhPT0gZmFsc2UpO1xuXHRcdFx0dGltZWxpbmVzID0gKHRpbWVsaW5lcyAhPT0gZmFsc2UpO1xuXHRcdFx0dmFyIGEgPSBnZXRBbGxUd2VlbnModGltZWxpbmVzKSxcblx0XHRcdFx0YWxsVHJ1ZSA9ICh0d2VlbnMgJiYgZGVsYXllZENhbGxzICYmIHRpbWVsaW5lcyksXG5cdFx0XHRcdGkgPSBhLmxlbmd0aCxcblx0XHRcdFx0aXNEQywgdHdlZW47XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0dHdlZW4gPSBhW2ldO1xuXHRcdFx0XHRpZiAoYWxsVHJ1ZSB8fCAodHdlZW4gaW5zdGFuY2VvZiBTaW1wbGVUaW1lbGluZSkgfHwgKChpc0RDID0gKHR3ZWVuLnRhcmdldCA9PT0gdHdlZW4udmFycy5vbkNvbXBsZXRlKSkgJiYgZGVsYXllZENhbGxzKSB8fCAodHdlZW5zICYmICFpc0RDKSkge1xuXHRcdFx0XHRcdHR3ZWVuLnBhdXNlZChwYXVzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnBhdXNlQWxsID0gZnVuY3Rpb24odHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0X2NoYW5nZVBhdXNlKHRydWUsIHR3ZWVucywgZGVsYXllZENhbGxzLCB0aW1lbGluZXMpO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXgucmVzdW1lQWxsID0gZnVuY3Rpb24odHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0X2NoYW5nZVBhdXNlKGZhbHNlLCB0d2VlbnMsIGRlbGF5ZWRDYWxscywgdGltZWxpbmVzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5NYXguZ2xvYmFsVGltZVNjYWxlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciB0bCA9IEFuaW1hdGlvbi5fcm9vdFRpbWVsaW5lLFxuXHRcdFx0XHR0ID0gVHdlZW5MaXRlLnRpY2tlci50aW1lO1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0bC5fdGltZVNjYWxlO1xuXHRcdFx0fVxuXHRcdFx0dmFsdWUgPSB2YWx1ZSB8fCBfdGlueU51bTsgLy9jYW4ndCBhbGxvdyB6ZXJvIGJlY2F1c2UgaXQnbGwgdGhyb3cgdGhlIG1hdGggb2ZmXG5cdFx0XHR0bC5fc3RhcnRUaW1lID0gdCAtICgodCAtIHRsLl9zdGFydFRpbWUpICogdGwuX3RpbWVTY2FsZSAvIHZhbHVlKTtcblx0XHRcdHRsID0gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmU7XG5cdFx0XHR0ID0gVHdlZW5MaXRlLnRpY2tlci5mcmFtZTtcblx0XHRcdHRsLl9zdGFydFRpbWUgPSB0IC0gKCh0IC0gdGwuX3N0YXJ0VGltZSkgKiB0bC5fdGltZVNjYWxlIC8gdmFsdWUpO1xuXHRcdFx0dGwuX3RpbWVTY2FsZSA9IEFuaW1hdGlvbi5fcm9vdFRpbWVsaW5lLl90aW1lU2NhbGUgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9O1xuXHRcdFxuXHRcbi8vLS0tLSBHRVRURVJTIC8gU0VUVEVSUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XG5cdFx0cC5wcm9ncmVzcyA9IGZ1bmN0aW9uKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0cmV0dXJuICghYXJndW1lbnRzLmxlbmd0aCkgPyB0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbigpIDogdGhpcy50b3RhbFRpbWUoIHRoaXMuZHVyYXRpb24oKSAqICgodGhpcy5feW95byAmJiAodGhpcy5fY3ljbGUgJiAxKSAhPT0gMCkgPyAxIC0gdmFsdWUgOiB2YWx1ZSkgKyAodGhpcy5fY3ljbGUgKiAodGhpcy5fZHVyYXRpb24gKyB0aGlzLl9yZXBlYXREZWxheSkpLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0fTtcblx0XHRcblx0XHRwLnRvdGFsUHJvZ3Jlc3MgPSBmdW5jdGlvbih2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdHJldHVybiAoIWFyZ3VtZW50cy5sZW5ndGgpID8gdGhpcy5fdG90YWxUaW1lIC8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLnRvdGFsVGltZSggdGhpcy50b3RhbER1cmF0aW9uKCkgKiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cdFx0XG5cdFx0cC50aW1lID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0dGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsdWUgPiB0aGlzLl9kdXJhdGlvbikge1xuXHRcdFx0XHR2YWx1ZSA9IHRoaXMuX2R1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX3lveW8gJiYgKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0dmFsdWUgPSAodGhpcy5fZHVyYXRpb24gLSB2YWx1ZSkgKyAodGhpcy5fY3ljbGUgKiAodGhpcy5fZHVyYXRpb24gKyB0aGlzLl9yZXBlYXREZWxheSkpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl9yZXBlYXQgIT09IDApIHtcblx0XHRcdFx0dmFsdWUgKz0gdGhpcy5fY3ljbGUgKiAodGhpcy5fZHVyYXRpb24gKyB0aGlzLl9yZXBlYXREZWxheSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUodmFsdWUsIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXG5cdFx0cC5kdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uOyAvL2Rvbid0IHNldCBfZGlydHkgPSBmYWxzZSBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIHJlcGVhdHMgdGhhdCBoYXZlbid0IGJlZW4gZmFjdG9yZWQgaW50byB0aGUgX3RvdGFsRHVyYXRpb24geWV0LiBPdGhlcndpc2UsIGlmIHlvdSBjcmVhdGUgYSByZXBlYXRlZCBUd2Vlbk1heCBhbmQgdGhlbiBpbW1lZGlhdGVseSBjaGVjayBpdHMgZHVyYXRpb24oKSwgaXQgd291bGQgY2FjaGUgdGhlIHZhbHVlIGFuZCB0aGUgdG90YWxEdXJhdGlvbiB3b3VsZCBub3QgYmUgY29ycmVjdCwgdGh1cyByZXBlYXRzIHdvdWxkbid0IHRha2UgZWZmZWN0LlxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIEFuaW1hdGlvbi5wcm90b3R5cGUuZHVyYXRpb24uY2FsbCh0aGlzLCB2YWx1ZSk7XG5cdFx0fTtcblxuXHRcdHAudG90YWxEdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdFx0Ly9pbnN0ZWFkIG9mIEluZmluaXR5LCB3ZSB1c2UgOTk5OTk5OTk5OTk5IHNvIHRoYXQgd2UgY2FuIGFjY29tbW9kYXRlIHJldmVyc2VzXG5cdFx0XHRcdFx0dGhpcy5fdG90YWxEdXJhdGlvbiA9ICh0aGlzLl9yZXBlYXQgPT09IC0xKSA/IDk5OTk5OTk5OTk5OSA6IHRoaXMuX2R1cmF0aW9uICogKHRoaXMuX3JlcGVhdCArIDEpICsgKHRoaXMuX3JlcGVhdERlbGF5ICogdGhpcy5fcmVwZWF0KTtcblx0XHRcdFx0XHR0aGlzLl9kaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLl90b3RhbER1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh0aGlzLl9yZXBlYXQgPT09IC0xKSA/IHRoaXMgOiB0aGlzLmR1cmF0aW9uKCAodmFsdWUgLSAodGhpcy5fcmVwZWF0ICogdGhpcy5fcmVwZWF0RGVsYXkpKSAvICh0aGlzLl9yZXBlYXQgKyAxKSApO1xuXHRcdH07XG5cdFx0XG5cdFx0cC5yZXBlYXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9yZXBlYXQ7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9yZXBlYXQgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdH07XG5cdFx0XG5cdFx0cC5yZXBlYXREZWxheSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3JlcGVhdERlbGF5O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVwZWF0RGVsYXkgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdH07XG5cdFx0XG5cdFx0cC55b3lvID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5feW95bztcblx0XHRcdH1cblx0XHRcdHRoaXMuX3lveW8gPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0cmV0dXJuIFR3ZWVuTWF4O1xuXHRcdFxuXHR9LCB0cnVlKTtcblxuXG5cblxuXG5cblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogVGltZWxpbmVMaXRlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0X2dzU2NvcGUuX2dzRGVmaW5lKFwiVGltZWxpbmVMaXRlXCIsIFtcImNvcmUuQW5pbWF0aW9uXCIsXCJjb3JlLlNpbXBsZVRpbWVsaW5lXCIsXCJUd2VlbkxpdGVcIl0sIGZ1bmN0aW9uKEFuaW1hdGlvbiwgU2ltcGxlVGltZWxpbmUsIFR3ZWVuTGl0ZSkge1xuXG5cdFx0dmFyIFRpbWVsaW5lTGl0ZSA9IGZ1bmN0aW9uKHZhcnMpIHtcblx0XHRcdFx0U2ltcGxlVGltZWxpbmUuY2FsbCh0aGlzLCB2YXJzKTtcblx0XHRcdFx0dGhpcy5fbGFiZWxzID0ge307XG5cdFx0XHRcdHRoaXMuYXV0b1JlbW92ZUNoaWxkcmVuID0gKHRoaXMudmFycy5hdXRvUmVtb3ZlQ2hpbGRyZW4gPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLnNtb290aENoaWxkVGltaW5nID0gKHRoaXMudmFycy5zbW9vdGhDaGlsZFRpbWluZyA9PT0gdHJ1ZSk7XG5cdFx0XHRcdHRoaXMuX3NvcnRDaGlsZHJlbiA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX29uVXBkYXRlID0gdGhpcy52YXJzLm9uVXBkYXRlO1xuXHRcdFx0XHR2YXIgdiA9IHRoaXMudmFycyxcblx0XHRcdFx0XHR2YWwsIHA7XG5cdFx0XHRcdGZvciAocCBpbiB2KSB7XG5cdFx0XHRcdFx0dmFsID0gdltwXTtcblx0XHRcdFx0XHRpZiAoX2lzQXJyYXkodmFsKSkgaWYgKHZhbC5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHR2W3BdID0gdGhpcy5fc3dhcFNlbGZJblBhcmFtcyh2YWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX2lzQXJyYXkodi50d2VlbnMpKSB7XG5cdFx0XHRcdFx0dGhpcy5hZGQodi50d2VlbnMsIDAsIHYuYWxpZ24sIHYuc3RhZ2dlcik7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRfdGlueU51bSA9IDAuMDAwMDAwMDAwMSxcblx0XHRcdFR3ZWVuTGl0ZUludGVybmFscyA9IFR3ZWVuTGl0ZS5faW50ZXJuYWxzLFxuXHRcdFx0X2ludGVybmFscyA9IFRpbWVsaW5lTGl0ZS5faW50ZXJuYWxzID0ge30sXG5cdFx0XHRfaXNTZWxlY3RvciA9IFR3ZWVuTGl0ZUludGVybmFscy5pc1NlbGVjdG9yLFxuXHRcdFx0X2lzQXJyYXkgPSBUd2VlbkxpdGVJbnRlcm5hbHMuaXNBcnJheSxcblx0XHRcdF9sYXp5VHdlZW5zID0gVHdlZW5MaXRlSW50ZXJuYWxzLmxhenlUd2VlbnMsXG5cdFx0XHRfbGF6eVJlbmRlciA9IFR3ZWVuTGl0ZUludGVybmFscy5sYXp5UmVuZGVyLFxuXHRcdFx0X2dsb2JhbHMgPSBfZ3NTY29wZS5fZ3NEZWZpbmUuZ2xvYmFscyxcblx0XHRcdF9jb3B5ID0gZnVuY3Rpb24odmFycykge1xuXHRcdFx0XHR2YXIgY29weSA9IHt9LCBwO1xuXHRcdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRcdGNvcHlbcF0gPSB2YXJzW3BdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBjb3B5O1xuXHRcdFx0fSxcblx0XHRcdF9hcHBseUN5Y2xlID0gZnVuY3Rpb24odmFycywgdGFyZ2V0cywgaSkge1xuXHRcdFx0XHR2YXIgYWx0ID0gdmFycy5jeWNsZSxcblx0XHRcdFx0XHRwLCB2YWw7XG5cdFx0XHRcdGZvciAocCBpbiBhbHQpIHtcblx0XHRcdFx0XHR2YWwgPSBhbHRbcF07XG5cdFx0XHRcdFx0dmFyc1twXSA9ICh0eXBlb2YodmFsKSA9PT0gXCJmdW5jdGlvblwiKSA/IHZhbC5jYWxsKHRhcmdldHNbaV0sIGkpIDogdmFsW2kgJSB2YWwubGVuZ3RoXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgdmFycy5jeWNsZTtcblx0XHRcdH0sXG5cdFx0XHRfcGF1c2VDYWxsYmFjayA9IF9pbnRlcm5hbHMucGF1c2VDYWxsYmFjayA9IGZ1bmN0aW9uKCkge30sXG5cdFx0XHRfc2xpY2UgPSBmdW5jdGlvbihhKSB7IC8vZG9uJ3QgdXNlIFtdLnNsaWNlIGJlY2F1c2UgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUU4IHdpdGggYSBOb2RlTGlzdCB0aGF0J3MgcmV0dXJuZWQgYnkgcXVlcnlTZWxlY3RvckFsbCgpXG5cdFx0XHRcdHZhciBiID0gW10sXG5cdFx0XHRcdFx0bCA9IGEubGVuZ3RoLFxuXHRcdFx0XHRcdGk7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgIT09IGw7IGIucHVzaChhW2krK10pKTtcblx0XHRcdFx0cmV0dXJuIGI7XG5cdFx0XHR9LFxuXHRcdFx0cCA9IFRpbWVsaW5lTGl0ZS5wcm90b3R5cGUgPSBuZXcgU2ltcGxlVGltZWxpbmUoKTtcblxuXHRcdFRpbWVsaW5lTGl0ZS52ZXJzaW9uID0gXCIxLjE5LjBcIjtcblx0XHRwLmNvbnN0cnVjdG9yID0gVGltZWxpbmVMaXRlO1xuXHRcdHAua2lsbCgpLl9nYyA9IHAuX2ZvcmNpbmdQbGF5aGVhZCA9IHAuX2hhc1BhdXNlID0gZmFsc2U7XG5cblx0XHQvKiBtaWdodCB1c2UgbGF0ZXIuLi5cblx0XHQvL3RyYW5zbGF0ZXMgYSBsb2NhbCB0aW1lIGluc2lkZSBhbiBhbmltYXRpb24gdG8gdGhlIGNvcnJlc3BvbmRpbmcgdGltZSBvbiB0aGUgcm9vdC9nbG9iYWwgdGltZWxpbmUsIGZhY3RvcmluZyBpbiBhbGwgbmVzdGluZyBhbmQgdGltZVNjYWxlcy5cblx0XHRmdW5jdGlvbiBsb2NhbFRvR2xvYmFsKHRpbWUsIGFuaW1hdGlvbikge1xuXHRcdFx0d2hpbGUgKGFuaW1hdGlvbikge1xuXHRcdFx0XHR0aW1lID0gKHRpbWUgLyBhbmltYXRpb24uX3RpbWVTY2FsZSkgKyBhbmltYXRpb24uX3N0YXJ0VGltZTtcblx0XHRcdFx0YW5pbWF0aW9uID0gYW5pbWF0aW9uLnRpbWVsaW5lO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRpbWU7XG5cdFx0fVxuXG5cdFx0Ly90cmFuc2xhdGVzIHRoZSBzdXBwbGllZCB0aW1lIG9uIHRoZSByb290L2dsb2JhbCB0aW1lbGluZSBpbnRvIHRoZSBjb3JyZXNwb25kaW5nIGxvY2FsIHRpbWUgaW5zaWRlIGEgcGFydGljdWxhciBhbmltYXRpb24sIGZhY3RvcmluZyBpbiBhbGwgbmVzdGluZyBhbmQgdGltZVNjYWxlc1xuXHRcdGZ1bmN0aW9uIGdsb2JhbFRvTG9jYWwodGltZSwgYW5pbWF0aW9uKSB7XG5cdFx0XHR2YXIgc2NhbGUgPSAxO1xuXHRcdFx0dGltZSAtPSBsb2NhbFRvR2xvYmFsKDAsIGFuaW1hdGlvbik7XG5cdFx0XHR3aGlsZSAoYW5pbWF0aW9uKSB7XG5cdFx0XHRcdHNjYWxlICo9IGFuaW1hdGlvbi5fdGltZVNjYWxlO1xuXHRcdFx0XHRhbmltYXRpb24gPSBhbmltYXRpb24udGltZWxpbmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGltZSAqIHNjYWxlO1xuXHRcdH1cblx0XHQqL1xuXG5cdFx0cC50byA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMsIHBvc2l0aW9uKSB7XG5cdFx0XHR2YXIgRW5naW5lID0gKHZhcnMucmVwZWF0ICYmIF9nbG9iYWxzLlR3ZWVuTWF4KSB8fCBUd2VlbkxpdGU7XG5cdFx0XHRyZXR1cm4gZHVyYXRpb24gPyB0aGlzLmFkZCggbmV3IEVuZ2luZSh0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSwgcG9zaXRpb24pIDogdGhpcy5zZXQodGFyZ2V0LCB2YXJzLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAuZnJvbSA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMsIHBvc2l0aW9uKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQoICgodmFycy5yZXBlYXQgJiYgX2dsb2JhbHMuVHdlZW5NYXgpIHx8IFR3ZWVuTGl0ZSkuZnJvbSh0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSwgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLmZyb21UbyA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMsIHBvc2l0aW9uKSB7XG5cdFx0XHR2YXIgRW5naW5lID0gKHRvVmFycy5yZXBlYXQgJiYgX2dsb2JhbHMuVHdlZW5NYXgpIHx8IFR3ZWVuTGl0ZTtcblx0XHRcdHJldHVybiBkdXJhdGlvbiA/IHRoaXMuYWRkKCBFbmdpbmUuZnJvbVRvKHRhcmdldCwgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMpLCBwb3NpdGlvbikgOiB0aGlzLnNldCh0YXJnZXQsIHRvVmFycywgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLnN0YWdnZXJUbyA9IGZ1bmN0aW9uKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKSB7XG5cdFx0XHR2YXIgdGwgPSBuZXcgVGltZWxpbmVMaXRlKHtvbkNvbXBsZXRlOm9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVQYXJhbXM6b25Db21wbGV0ZUFsbFBhcmFtcywgY2FsbGJhY2tTY29wZTpvbkNvbXBsZXRlQWxsU2NvcGUsIHNtb290aENoaWxkVGltaW5nOnRoaXMuc21vb3RoQ2hpbGRUaW1pbmd9KSxcblx0XHRcdFx0Y3ljbGUgPSB2YXJzLmN5Y2xlLFxuXHRcdFx0XHRjb3B5LCBpO1xuXHRcdFx0aWYgKHR5cGVvZih0YXJnZXRzKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHR0YXJnZXRzID0gVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldHMpIHx8IHRhcmdldHM7XG5cdFx0XHR9XG5cdFx0XHR0YXJnZXRzID0gdGFyZ2V0cyB8fCBbXTtcblx0XHRcdGlmIChfaXNTZWxlY3Rvcih0YXJnZXRzKSkgeyAvL3NlbnNlcyBpZiB0aGUgdGFyZ2V0cyBvYmplY3QgaXMgYSBzZWxlY3Rvci4gSWYgaXQgaXMsIHdlIHNob3VsZCB0cmFuc2xhdGUgaXQgaW50byBhbiBhcnJheS5cblx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdH1cblx0XHRcdHN0YWdnZXIgPSBzdGFnZ2VyIHx8IDA7XG5cdFx0XHRpZiAoc3RhZ2dlciA8IDApIHtcblx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdFx0dGFyZ2V0cy5yZXZlcnNlKCk7XG5cdFx0XHRcdHN0YWdnZXIgKj0gLTE7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb3B5ID0gX2NvcHkodmFycyk7XG5cdFx0XHRcdGlmIChjb3B5LnN0YXJ0QXQpIHtcblx0XHRcdFx0XHRjb3B5LnN0YXJ0QXQgPSBfY29weShjb3B5LnN0YXJ0QXQpO1xuXHRcdFx0XHRcdGlmIChjb3B5LnN0YXJ0QXQuY3ljbGUpIHtcblx0XHRcdFx0XHRcdF9hcHBseUN5Y2xlKGNvcHkuc3RhcnRBdCwgdGFyZ2V0cywgaSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjeWNsZSkge1xuXHRcdFx0XHRcdF9hcHBseUN5Y2xlKGNvcHksIHRhcmdldHMsIGkpO1xuXHRcdFx0XHRcdGlmIChjb3B5LmR1cmF0aW9uICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGR1cmF0aW9uID0gY29weS5kdXJhdGlvbjtcblx0XHRcdFx0XHRcdGRlbGV0ZSBjb3B5LmR1cmF0aW9uO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0bC50byh0YXJnZXRzW2ldLCBkdXJhdGlvbiwgY29weSwgaSAqIHN0YWdnZXIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuYWRkKHRsLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAuc3RhZ2dlckZyb20gPSBmdW5jdGlvbih0YXJnZXRzLCBkdXJhdGlvbiwgdmFycywgc3RhZ2dlciwgcG9zaXRpb24sIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSkge1xuXHRcdFx0dmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0dmFycy5ydW5CYWNrd2FyZHMgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuc3RhZ2dlclRvKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKTtcblx0XHR9O1xuXG5cdFx0cC5zdGFnZ2VyRnJvbVRvID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpIHtcblx0XHRcdHRvVmFycy5zdGFydEF0ID0gZnJvbVZhcnM7XG5cdFx0XHR0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UgJiYgZnJvbVZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHJldHVybiB0aGlzLnN0YWdnZXJUbyh0YXJnZXRzLCBkdXJhdGlvbiwgdG9WYXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKTtcblx0XHR9O1xuXG5cdFx0cC5jYWxsID0gZnVuY3Rpb24oY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUsIHBvc2l0aW9uKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQoIFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbCgwLCBjYWxsYmFjaywgcGFyYW1zLCBzY29wZSksIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0cC5zZXQgPSBmdW5jdGlvbih0YXJnZXQsIHZhcnMsIHBvc2l0aW9uKSB7XG5cdFx0XHRwb3NpdGlvbiA9IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwocG9zaXRpb24sIDAsIHRydWUpO1xuXHRcdFx0aWYgKHZhcnMuaW1tZWRpYXRlUmVuZGVyID09IG51bGwpIHtcblx0XHRcdFx0dmFycy5pbW1lZGlhdGVSZW5kZXIgPSAocG9zaXRpb24gPT09IHRoaXMuX3RpbWUgJiYgIXRoaXMuX3BhdXNlZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQoIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCAwLCB2YXJzKSwgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRUaW1lbGluZUxpdGUuZXhwb3J0Um9vdCA9IGZ1bmN0aW9uKHZhcnMsIGlnbm9yZURlbGF5ZWRDYWxscykge1xuXHRcdFx0dmFycyA9IHZhcnMgfHwge307XG5cdFx0XHRpZiAodmFycy5zbW9vdGhDaGlsZFRpbWluZyA9PSBudWxsKSB7XG5cdFx0XHRcdHZhcnMuc21vb3RoQ2hpbGRUaW1pbmcgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRsID0gbmV3IFRpbWVsaW5lTGl0ZSh2YXJzKSxcblx0XHRcdFx0cm9vdCA9IHRsLl90aW1lbGluZSxcblx0XHRcdFx0dHdlZW4sIG5leHQ7XG5cdFx0XHRpZiAoaWdub3JlRGVsYXllZENhbGxzID09IG51bGwpIHtcblx0XHRcdFx0aWdub3JlRGVsYXllZENhbGxzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJvb3QuX3JlbW92ZSh0bCwgdHJ1ZSk7XG5cdFx0XHR0bC5fc3RhcnRUaW1lID0gMDtcblx0XHRcdHRsLl9yYXdQcmV2VGltZSA9IHRsLl90aW1lID0gdGwuX3RvdGFsVGltZSA9IHJvb3QuX3RpbWU7XG5cdFx0XHR0d2VlbiA9IHJvb3QuX2ZpcnN0O1xuXHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdG5leHQgPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0aWYgKCFpZ25vcmVEZWxheWVkQ2FsbHMgfHwgISh0d2VlbiBpbnN0YW5jZW9mIFR3ZWVuTGl0ZSAmJiB0d2Vlbi50YXJnZXQgPT09IHR3ZWVuLnZhcnMub25Db21wbGV0ZSkpIHtcblx0XHRcdFx0XHR0bC5hZGQodHdlZW4sIHR3ZWVuLl9zdGFydFRpbWUgLSB0d2Vlbi5fZGVsYXkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdH1cblx0XHRcdHJvb3QuYWRkKHRsLCAwKTtcblx0XHRcdHJldHVybiB0bDtcblx0XHR9O1xuXG5cdFx0cC5hZGQgPSBmdW5jdGlvbih2YWx1ZSwgcG9zaXRpb24sIGFsaWduLCBzdGFnZ2VyKSB7XG5cdFx0XHR2YXIgY3VyVGltZSwgbCwgaSwgY2hpbGQsIHRsLCBiZWZvcmVSYXdUaW1lO1xuXHRcdFx0aWYgKHR5cGVvZihwb3NpdGlvbikgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0cG9zaXRpb24gPSB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKHBvc2l0aW9uLCAwLCB0cnVlLCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIEFuaW1hdGlvbikpIHtcblx0XHRcdFx0aWYgKCh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB8fCAodmFsdWUgJiYgdmFsdWUucHVzaCAmJiBfaXNBcnJheSh2YWx1ZSkpKSB7XG5cdFx0XHRcdFx0YWxpZ24gPSBhbGlnbiB8fCBcIm5vcm1hbFwiO1xuXHRcdFx0XHRcdHN0YWdnZXIgPSBzdGFnZ2VyIHx8IDA7XG5cdFx0XHRcdFx0Y3VyVGltZSA9IHBvc2l0aW9uO1xuXHRcdFx0XHRcdGwgPSB2YWx1ZS5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKF9pc0FycmF5KGNoaWxkID0gdmFsdWVbaV0pKSB7XG5cdFx0XHRcdFx0XHRcdGNoaWxkID0gbmV3IFRpbWVsaW5lTGl0ZSh7dHdlZW5zOmNoaWxkfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLmFkZChjaGlsZCwgY3VyVGltZSk7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mKGNoaWxkKSAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YoY2hpbGQpICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFsaWduID09PSBcInNlcXVlbmNlXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRjdXJUaW1lID0gY2hpbGQuX3N0YXJ0VGltZSArIChjaGlsZC50b3RhbER1cmF0aW9uKCkgLyBjaGlsZC5fdGltZVNjYWxlKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChhbGlnbiA9PT0gXCJzdGFydFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2hpbGQuX3N0YXJ0VGltZSAtPSBjaGlsZC5kZWxheSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJUaW1lICs9IHN0YWdnZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZih2YWx1ZSkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRMYWJlbCh2YWx1ZSwgcG9zaXRpb24pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZih2YWx1ZSkgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdHZhbHVlID0gVHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAsIHZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyhcIkNhbm5vdCBhZGQgXCIgKyB2YWx1ZSArIFwiIGludG8gdGhlIHRpbWVsaW5lOyBpdCBpcyBub3QgYSB0d2VlbiwgdGltZWxpbmUsIGZ1bmN0aW9uLCBvciBzdHJpbmcuXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdFNpbXBsZVRpbWVsaW5lLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCB2YWx1ZSwgcG9zaXRpb24pO1xuXG5cdFx0XHQvL2lmIHRoZSB0aW1lbGluZSBoYXMgYWxyZWFkeSBlbmRlZCBidXQgdGhlIGluc2VydGVkIHR3ZWVuL3RpbWVsaW5lIGV4dGVuZHMgdGhlIGR1cmF0aW9uLCB3ZSBzaG91bGQgZW5hYmxlIHRoaXMgdGltZWxpbmUgYWdhaW4gc28gdGhhdCBpdCByZW5kZXJzIHByb3Blcmx5LiBXZSBzaG91bGQgYWxzbyBhbGlnbiB0aGUgcGxheWhlYWQgd2l0aCB0aGUgcGFyZW50IHRpbWVsaW5lJ3Mgd2hlbiBhcHByb3ByaWF0ZS5cblx0XHRcdGlmICh0aGlzLl9nYyB8fCB0aGlzLl90aW1lID09PSB0aGlzLl9kdXJhdGlvbikgaWYgKCF0aGlzLl9wYXVzZWQpIGlmICh0aGlzLl9kdXJhdGlvbiA8IHRoaXMuZHVyYXRpb24oKSkge1xuXHRcdFx0XHQvL2luIGNhc2UgYW55IG9mIHRoZSBhbmNlc3RvcnMgaGFkIGNvbXBsZXRlZCBidXQgc2hvdWxkIG5vdyBiZSBlbmFibGVkLi4uXG5cdFx0XHRcdHRsID0gdGhpcztcblx0XHRcdFx0YmVmb3JlUmF3VGltZSA9ICh0bC5yYXdUaW1lKCkgPiB2YWx1ZS5fc3RhcnRUaW1lKTsgLy9pZiB0aGUgdHdlZW4gaXMgcGxhY2VkIG9uIHRoZSB0aW1lbGluZSBzbyB0aGF0IGl0IHN0YXJ0cyBCRUZPUkUgdGhlIGN1cnJlbnQgcmF3VGltZSwgd2Ugc2hvdWxkIGFsaWduIHRoZSBwbGF5aGVhZCAobW92ZSB0aGUgdGltZWxpbmUpLiBUaGlzIGlzIGJlY2F1c2Ugc29tZXRpbWVzIHVzZXJzIHdpbGwgY3JlYXRlIGEgdGltZWxpbmUsIGxldCBpdCBmaW5pc2gsIGFuZCBtdWNoIGxhdGVyIGFwcGVuZCBhIHR3ZWVuIGFuZCBleHBlY3QgaXQgdG8gcnVuIGluc3RlYWQgb2YganVtcGluZyB0byBpdHMgZW5kIHN0YXRlLiBXaGlsZSB0ZWNobmljYWxseSBvbmUgY291bGQgYXJndWUgdGhhdCBpdCBzaG91bGQganVtcCB0byBpdHMgZW5kIHN0YXRlLCB0aGF0J3Mgbm90IHdoYXQgdXNlcnMgaW50dWl0aXZlbHkgZXhwZWN0LlxuXHRcdFx0XHR3aGlsZSAodGwuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdFx0aWYgKGJlZm9yZVJhd1RpbWUgJiYgdGwuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdFx0XHR0bC50b3RhbFRpbWUodGwuX3RvdGFsVGltZSwgdHJ1ZSk7IC8vbW92ZXMgdGhlIHRpbWVsaW5lIChzaGlmdHMgaXRzIHN0YXJ0VGltZSkgaWYgbmVjZXNzYXJ5LCBhbmQgYWxzbyBlbmFibGVzIGl0LlxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGwuX2djKSB7XG5cdFx0XHRcdFx0XHR0bC5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRsID0gdGwuX3RpbWVsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnJlbW92ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBBbmltYXRpb24pIHtcblx0XHRcdFx0dGhpcy5fcmVtb3ZlKHZhbHVlLCBmYWxzZSk7XG5cdFx0XHRcdHZhciB0bCA9IHZhbHVlLl90aW1lbGluZSA9IHZhbHVlLnZhcnMudXNlRnJhbWVzID8gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUgOiBBbmltYXRpb24uX3Jvb3RUaW1lbGluZTsgLy9ub3cgdGhhdCBpdCdzIHJlbW92ZWQsIGRlZmF1bHQgaXQgdG8gdGhlIHJvb3QgdGltZWxpbmUgc28gdGhhdCBpZiBpdCBnZXRzIHBsYXllZCBhZ2FpbiwgaXQgZG9lc24ndCBqdW1wIGJhY2sgaW50byB0aGlzIHRpbWVsaW5lLlxuXHRcdFx0XHR2YWx1ZS5fc3RhcnRUaW1lID0gKHZhbHVlLl9wYXVzZWQgPyB2YWx1ZS5fcGF1c2VUaW1lIDogdGwuX3RpbWUpIC0gKCghdmFsdWUuX3JldmVyc2VkID8gdmFsdWUuX3RvdGFsVGltZSA6IHZhbHVlLnRvdGFsRHVyYXRpb24oKSAtIHZhbHVlLl90b3RhbFRpbWUpIC8gdmFsdWUuX3RpbWVTY2FsZSk7IC8vZW5zdXJlIHRoYXQgaWYgaXQgZ2V0cyBwbGF5ZWQgYWdhaW4sIHRoZSB0aW1pbmcgaXMgY29ycmVjdC5cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgfHwgKHZhbHVlICYmIHZhbHVlLnB1c2ggJiYgX2lzQXJyYXkodmFsdWUpKSkge1xuXHRcdFx0XHR2YXIgaSA9IHZhbHVlLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0dGhpcy5yZW1vdmUodmFsdWVbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodmFsdWUpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlbW92ZUxhYmVsKHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLmtpbGwobnVsbCwgdmFsdWUpO1xuXHRcdH07XG5cblx0XHRwLl9yZW1vdmUgPSBmdW5jdGlvbih0d2Vlbiwgc2tpcERpc2FibGUpIHtcblx0XHRcdFNpbXBsZVRpbWVsaW5lLnByb3RvdHlwZS5fcmVtb3ZlLmNhbGwodGhpcywgdHdlZW4sIHNraXBEaXNhYmxlKTtcblx0XHRcdHZhciBsYXN0ID0gdGhpcy5fbGFzdDtcblx0XHRcdGlmICghbGFzdCkge1xuXHRcdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lID0gdGhpcy5fZHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uID0gMDtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdGltZSA+IGxhc3QuX3N0YXJ0VGltZSArIGxhc3QuX3RvdGFsRHVyYXRpb24gLyBsYXN0Ll90aW1lU2NhbGUpIHtcblx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuZHVyYXRpb24oKTtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdG90YWxEdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmFwcGVuZCA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXRPckxhYmVsKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQodmFsdWUsIHRoaXMuX3BhcnNlVGltZU9yTGFiZWwobnVsbCwgb2Zmc2V0T3JMYWJlbCwgdHJ1ZSwgdmFsdWUpKTtcblx0XHR9O1xuXG5cdFx0cC5pbnNlcnQgPSBwLmluc2VydE11bHRpcGxlID0gZnVuY3Rpb24odmFsdWUsIHBvc2l0aW9uLCBhbGlnbiwgc3RhZ2dlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMuYWRkKHZhbHVlLCBwb3NpdGlvbiB8fCAwLCBhbGlnbiwgc3RhZ2dlcik7XG5cdFx0fTtcblxuXHRcdHAuYXBwZW5kTXVsdGlwbGUgPSBmdW5jdGlvbih0d2VlbnMsIG9mZnNldE9yTGFiZWwsIGFsaWduLCBzdGFnZ2VyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQodHdlZW5zLCB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKG51bGwsIG9mZnNldE9yTGFiZWwsIHRydWUsIHR3ZWVucyksIGFsaWduLCBzdGFnZ2VyKTtcblx0XHR9O1xuXG5cdFx0cC5hZGRMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsLCBwb3NpdGlvbikge1xuXHRcdFx0dGhpcy5fbGFiZWxzW2xhYmVsXSA9IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwocG9zaXRpb24pO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuYWRkUGF1c2UgPSBmdW5jdGlvbihwb3NpdGlvbiwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUpIHtcblx0XHRcdHZhciB0ID0gVHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAsIF9wYXVzZUNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlIHx8IHRoaXMpO1xuXHRcdFx0dC52YXJzLm9uQ29tcGxldGUgPSB0LnZhcnMub25SZXZlcnNlQ29tcGxldGUgPSBjYWxsYmFjaztcblx0XHRcdHQuZGF0YSA9IFwiaXNQYXVzZVwiO1xuXHRcdFx0dGhpcy5faGFzUGF1c2UgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuYWRkKHQsIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0cC5yZW1vdmVMYWJlbCA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdFx0XHRkZWxldGUgdGhpcy5fbGFiZWxzW2xhYmVsXTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmdldExhYmVsVGltZSA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuX2xhYmVsc1tsYWJlbF0gIT0gbnVsbCkgPyB0aGlzLl9sYWJlbHNbbGFiZWxdIDogLTE7XG5cdFx0fTtcblxuXHRcdHAuX3BhcnNlVGltZU9yTGFiZWwgPSBmdW5jdGlvbih0aW1lT3JMYWJlbCwgb2Zmc2V0T3JMYWJlbCwgYXBwZW5kSWZBYnNlbnQsIGlnbm9yZSkge1xuXHRcdFx0dmFyIGk7XG5cdFx0XHQvL2lmIHdlJ3JlIGFib3V0IHRvIGFkZCBhIHR3ZWVuL3RpbWVsaW5lIChvciBhbiBhcnJheSBvZiB0aGVtKSB0aGF0J3MgYWxyZWFkeSBhIGNoaWxkIG9mIHRoaXMgdGltZWxpbmUsIHdlIHNob3VsZCByZW1vdmUgaXQgZmlyc3Qgc28gdGhhdCBpdCBkb2Vzbid0IGNvbnRhbWluYXRlIHRoZSBkdXJhdGlvbigpLlxuXHRcdFx0aWYgKGlnbm9yZSBpbnN0YW5jZW9mIEFuaW1hdGlvbiAmJiBpZ25vcmUudGltZWxpbmUgPT09IHRoaXMpIHtcblx0XHRcdFx0dGhpcy5yZW1vdmUoaWdub3JlKTtcblx0XHRcdH0gZWxzZSBpZiAoaWdub3JlICYmICgoaWdub3JlIGluc3RhbmNlb2YgQXJyYXkpIHx8IChpZ25vcmUucHVzaCAmJiBfaXNBcnJheShpZ25vcmUpKSkpIHtcblx0XHRcdFx0aSA9IGlnbm9yZS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChpZ25vcmVbaV0gaW5zdGFuY2VvZiBBbmltYXRpb24gJiYgaWdub3JlW2ldLnRpbWVsaW5lID09PSB0aGlzKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbW92ZShpZ25vcmVbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZihvZmZzZXRPckxhYmVsKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChvZmZzZXRPckxhYmVsLCAoYXBwZW5kSWZBYnNlbnQgJiYgdHlwZW9mKHRpbWVPckxhYmVsKSA9PT0gXCJudW1iZXJcIiAmJiB0aGlzLl9sYWJlbHNbb2Zmc2V0T3JMYWJlbF0gPT0gbnVsbCkgPyB0aW1lT3JMYWJlbCAtIHRoaXMuZHVyYXRpb24oKSA6IDAsIGFwcGVuZElmQWJzZW50KTtcblx0XHRcdH1cblx0XHRcdG9mZnNldE9yTGFiZWwgPSBvZmZzZXRPckxhYmVsIHx8IDA7XG5cdFx0XHRpZiAodHlwZW9mKHRpbWVPckxhYmVsKSA9PT0gXCJzdHJpbmdcIiAmJiAoaXNOYU4odGltZU9yTGFiZWwpIHx8IHRoaXMuX2xhYmVsc1t0aW1lT3JMYWJlbF0gIT0gbnVsbCkpIHsgLy9pZiB0aGUgc3RyaW5nIGlzIGEgbnVtYmVyIGxpa2UgXCIxXCIsIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSdzIGEgbGFiZWwgd2l0aCB0aGF0IG5hbWUsIG90aGVyd2lzZSBpbnRlcnByZXQgaXQgYXMgYSBudW1iZXIgKGFic29sdXRlIHZhbHVlKS5cblx0XHRcdFx0aSA9IHRpbWVPckxhYmVsLmluZGV4T2YoXCI9XCIpO1xuXHRcdFx0XHRpZiAoaSA9PT0gLTEpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fbGFiZWxzW3RpbWVPckxhYmVsXSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYXBwZW5kSWZBYnNlbnQgPyAodGhpcy5fbGFiZWxzW3RpbWVPckxhYmVsXSA9IHRoaXMuZHVyYXRpb24oKSArIG9mZnNldE9yTGFiZWwpIDogb2Zmc2V0T3JMYWJlbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2xhYmVsc1t0aW1lT3JMYWJlbF0gKyBvZmZzZXRPckxhYmVsO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9mZnNldE9yTGFiZWwgPSBwYXJzZUludCh0aW1lT3JMYWJlbC5jaGFyQXQoaS0xKSArIFwiMVwiLCAxMCkgKiBOdW1iZXIodGltZU9yTGFiZWwuc3Vic3RyKGkrMSkpO1xuXHRcdFx0XHR0aW1lT3JMYWJlbCA9IChpID4gMSkgPyB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKHRpbWVPckxhYmVsLnN1YnN0cigwLCBpLTEpLCAwLCBhcHBlbmRJZkFic2VudCkgOiB0aGlzLmR1cmF0aW9uKCk7XG5cdFx0XHR9IGVsc2UgaWYgKHRpbWVPckxhYmVsID09IG51bGwpIHtcblx0XHRcdFx0dGltZU9yTGFiZWwgPSB0aGlzLmR1cmF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gTnVtYmVyKHRpbWVPckxhYmVsKSArIG9mZnNldE9yTGFiZWw7XG5cdFx0fTtcblxuXHRcdHAuc2VlayA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0cmV0dXJuIHRoaXMudG90YWxUaW1lKCh0eXBlb2YocG9zaXRpb24pID09PSBcIm51bWJlclwiKSA/IHBvc2l0aW9uIDogdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChwb3NpdGlvbiksIChzdXBwcmVzc0V2ZW50cyAhPT0gZmFsc2UpKTtcblx0XHR9O1xuXG5cdFx0cC5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXVzZWQodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAuZ290b0FuZFBsYXkgPSBmdW5jdGlvbihwb3NpdGlvbiwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdHJldHVybiB0aGlzLnBsYXkocG9zaXRpb24sIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXG5cdFx0cC5nb3RvQW5kU3RvcCA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0cmV0dXJuIHRoaXMucGF1c2UocG9zaXRpb24sIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXG5cdFx0cC5yZW5kZXIgPSBmdW5jdGlvbih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcblx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdHZhciB0b3RhbER1ciA9ICghdGhpcy5fZGlydHkpID8gdGhpcy5fdG90YWxEdXJhdGlvbiA6IHRoaXMudG90YWxEdXJhdGlvbigpLFxuXHRcdFx0XHRwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG5cdFx0XHRcdHByZXZTdGFydCA9IHRoaXMuX3N0YXJ0VGltZSxcblx0XHRcdFx0cHJldlRpbWVTY2FsZSA9IHRoaXMuX3RpbWVTY2FsZSxcblx0XHRcdFx0cHJldlBhdXNlZCA9IHRoaXMuX3BhdXNlZCxcblx0XHRcdFx0dHdlZW4sIGlzQ29tcGxldGUsIG5leHQsIGNhbGxiYWNrLCBpbnRlcm5hbEZvcmNlLCBwYXVzZVR3ZWVuLCBjdXJUaW1lO1xuXHRcdFx0aWYgKHRpbWUgPj0gdG90YWxEdXIgLSAwLjAwMDAwMDEpIHsgLy90byB3b3JrIGFyb3VuZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IG1hdGggYXJ0aWZhY3RzLlxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gdG90YWxEdXI7XG5cdFx0XHRcdGlmICghdGhpcy5fcmV2ZXJzZWQpIGlmICghdGhpcy5faGFzUGF1c2VkQ2hpbGQoKSkge1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvbkNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9ICEhdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuOyAvL290aGVyd2lzZSwgaWYgdGhlIGFuaW1hdGlvbiBpcyB1bnBhdXNlZC9hY3RpdmF0ZWQgYWZ0ZXIgaXQncyBhbHJlYWR5IGZpbmlzaGVkLCBpdCBkb2Vzbid0IGdldCByZW1vdmVkIGZyb20gdGhlIHBhcmVudCB0aW1lbGluZS5cblx0XHRcdFx0XHRpZiAodGhpcy5fZHVyYXRpb24gPT09IDApIGlmICgodGltZSA8PSAwICYmIHRpbWUgPj0gLTAuMDAwMDAwMSkgfHwgdGhpcy5fcmF3UHJldlRpbWUgPCAwIHx8IHRoaXMuX3Jhd1ByZXZUaW1lID09PSBfdGlueU51bSkgaWYgKHRoaXMuX3Jhd1ByZXZUaW1lICE9PSB0aW1lICYmIHRoaXMuX2ZpcnN0KSB7XG5cdFx0XHRcdFx0XHRpbnRlcm5hbEZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9yYXdQcmV2VGltZSA+IF90aW55TnVtKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9ICh0aGlzLl9kdXJhdGlvbiB8fCAhc3VwcHJlc3NFdmVudHMgfHwgdGltZSB8fCB0aGlzLl9yYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdGltZWxpbmUgb3IgdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdHRpbWUgPSB0b3RhbER1ciArIDAuMDAwMTsgLy90byBhdm9pZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9ycyAtIHNvbWV0aW1lcyBjaGlsZCB0d2VlbnMvdGltZWxpbmVzIHdlcmUgbm90IGJlaW5nIGZ1bGx5IGNvbXBsZXRlZCAodGhlaXIgcHJvZ3Jlc3MgbWlnaHQgYmUgMC45OTk5OTk5OTk5OTk5OTggaW5zdGVhZCBvZiAxIGJlY2F1c2Ugd2hlbiBfdGltZSAtIHR3ZWVuLl9zdGFydFRpbWUgaXMgcGVyZm9ybWVkLCBmbG9hdGluZyBwb2ludCBlcnJvcnMgd291bGQgcmV0dXJuIGEgdmFsdWUgdGhhdCB3YXMgU0xJR0hUTFkgb2ZmKS4gVHJ5ICg5OTk5OTk5OTk5OTkuNyAtIDk5OTk5OTk5OTk5OSkgKiAxID0gMC42OTk5NTExNzE4NzUgaW5zdGVhZCBvZiAwLjcuXG5cblx0XHRcdH0gZWxzZSBpZiAodGltZSA8IDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMsIHJvdW5kIHN1cGVyIHNtYWxsIHZhbHVlcyB0byAwLlxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gMDtcblx0XHRcdFx0aWYgKHByZXZUaW1lICE9PSAwIHx8ICh0aGlzLl9kdXJhdGlvbiA9PT0gMCAmJiB0aGlzLl9yYXdQcmV2VGltZSAhPT0gX3RpbnlOdW0gJiYgKHRoaXMuX3Jhd1ByZXZUaW1lID4gMCB8fCAodGltZSA8IDAgJiYgdGhpcy5fcmF3UHJldlRpbWUgPj0gMCkpKSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0aGlzLl9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGltZSA8IDApIHtcblx0XHRcdFx0XHR0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuICYmIHRoaXMuX3JldmVyc2VkKSB7IC8vZW5zdXJlcyBwcm9wZXIgR0MgaWYgYSB0aW1lbGluZSBpcyByZXN1bWVkIGFmdGVyIGl0J3MgZmluaXNoZWQgcmV2ZXJzaW5nLlxuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9yYXdQcmV2VGltZSA+PSAwICYmIHRoaXMuX2ZpcnN0KSB7IC8vd2hlbiBnb2luZyBiYWNrIGJleW9uZCB0aGUgc3RhcnQsIGZvcmNlIGEgcmVuZGVyIHNvIHRoYXQgemVyby1kdXJhdGlvbiB0d2VlbnMgdGhhdCBzaXQgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIHJlbmRlciB0aGVpciBzdGFydCB2YWx1ZXMgcHJvcGVybHkuIE90aGVyd2lzZSwgaWYgdGhlIHBhcmVudCB0aW1lbGluZSdzIHBsYXloZWFkIGxhbmRzIGV4YWN0bHkgYXQgdGhpcyB0aW1lbGluZSdzIHN0YXJ0VGltZSwgYW5kIHRoZW4gbW92ZXMgYmFja3dhcmRzLCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbnMgYXQgdGhlIGJlZ2lubmluZyB3b3VsZCBzdGlsbCBiZSBhdCB0aGVpciBlbmQgc3RhdGUuXG5cdFx0XHRcdFx0XHRpbnRlcm5hbEZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSB0aW1lO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gKHRoaXMuX2R1cmF0aW9uIHx8ICFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHRoaXMuX3Jhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0aW1lbGluZSBvciB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0XHRpZiAodGltZSA9PT0gMCAmJiBpc0NvbXBsZXRlKSB7IC8vaWYgdGhlcmUncyBhIHplcm8tZHVyYXRpb24gdHdlZW4gYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIGEgdGltZWxpbmUgYW5kIHRoZSBwbGF5aGVhZCBsYW5kcyBFWEFDVExZIGF0IHRpbWUgMCwgdGhhdCB0d2VlbiB3aWxsIGNvcnJlY3RseSByZW5kZXIgaXRzIGVuZCB2YWx1ZXMsIGJ1dCB3ZSBuZWVkIHRvIGtlZXAgdGhlIHRpbWVsaW5lIGFsaXZlIGZvciBvbmUgbW9yZSByZW5kZXIgc28gdGhhdCB0aGUgYmVnaW5uaW5nIHZhbHVlcyByZW5kZXIgcHJvcGVybHkgYXMgdGhlIHBhcmVudCdzIHBsYXloZWFkIGtlZXBzIG1vdmluZyBiZXlvbmQgdGhlIGJlZ2luaW5nLiBJbWFnaW5lIG9iai54IHN0YXJ0cyBhdCAwIGFuZCB0aGVuIHdlIGRvIHRsLnNldChvYmosIHt4OjEwMH0pLnRvKG9iaiwgMSwge3g6MjAwfSkgYW5kIHRoZW4gbGF0ZXIgd2UgdGwucmV2ZXJzZSgpLi4udGhlIGdvYWwgaXMgdG8gaGF2ZSBvYmoueCByZXZlcnQgdG8gMC4gSWYgdGhlIHBsYXloZWFkIGhhcHBlbnMgdG8gbGFuZCBvbiBleGFjdGx5IDAsIHdpdGhvdXQgdGhpcyBjaHVuayBvZiBjb2RlLCBpdCdkIGNvbXBsZXRlIHRoZSB0aW1lbGluZSBhbmQgcmVtb3ZlIGl0IGZyb20gdGhlIHJlbmRlcmluZyBxdWV1ZSAobm90IGdvb2QpLlxuXHRcdFx0XHRcdFx0dHdlZW4gPSB0aGlzLl9maXJzdDtcblx0XHRcdFx0XHRcdHdoaWxlICh0d2VlbiAmJiB0d2Vlbi5fc3RhcnRUaW1lID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdHdlZW4uX2R1cmF0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aXNDb21wbGV0ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRpbWUgPSAwOyAvL3RvIGF2b2lkIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIChjb3VsZCBjYXVzZSBwcm9ibGVtcyBlc3BlY2lhbGx5IHdpdGggemVyby1kdXJhdGlvbiB0d2VlbnMgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIHRoZSB0aW1lbGluZSlcblx0XHRcdFx0XHRpZiAoIXRoaXMuX2luaXR0ZWQpIHtcblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmICh0aGlzLl9oYXNQYXVzZSAmJiAhdGhpcy5fZm9yY2luZ1BsYXloZWFkICYmICFzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0XHRcdGlmICh0aW1lID49IHByZXZUaW1lKSB7XG5cdFx0XHRcdFx0XHR0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHRcdFx0d2hpbGUgKHR3ZWVuICYmIHR3ZWVuLl9zdGFydFRpbWUgPD0gdGltZSAmJiAhcGF1c2VUd2Vlbikge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9kdXJhdGlvbikgaWYgKHR3ZWVuLmRhdGEgPT09IFwiaXNQYXVzZVwiICYmICF0d2Vlbi5yYXRpbyAmJiAhKHR3ZWVuLl9zdGFydFRpbWUgPT09IDAgJiYgdGhpcy5fcmF3UHJldlRpbWUgPT09IDApKSB7XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VUd2VlbiA9IHR3ZWVuO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHR3ZWVuID0gdGhpcy5fbGFzdDtcblx0XHRcdFx0XHRcdHdoaWxlICh0d2VlbiAmJiB0d2Vlbi5fc3RhcnRUaW1lID49IHRpbWUgJiYgIXBhdXNlVHdlZW4pIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fZHVyYXRpb24pIGlmICh0d2Vlbi5kYXRhID09PSBcImlzUGF1c2VcIiAmJiB0d2Vlbi5fcmF3UHJldlRpbWUgPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VUd2VlbiA9IHR3ZWVuO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHR3ZWVuID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwYXVzZVR3ZWVuKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gdGltZSA9IHBhdXNlVHdlZW4uX3N0YXJ0VGltZTtcblx0XHRcdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRpbWUgKyAodGhpcy5fY3ljbGUgKiAodGhpcy5fdG90YWxEdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdH1cblx0XHRcdGlmICgodGhpcy5fdGltZSA9PT0gcHJldlRpbWUgfHwgIXRoaXMuX2ZpcnN0KSAmJiAhZm9yY2UgJiYgIWludGVybmFsRm9yY2UgJiYgIXBhdXNlVHdlZW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0dGVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLl9hY3RpdmUpIGlmICghdGhpcy5fcGF1c2VkICYmIHRoaXMuX3RpbWUgIT09IHByZXZUaW1lICYmIHRpbWUgPiAwKSB7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRydWU7ICAvL3NvIHRoYXQgaWYgdGhlIHVzZXIgcmVuZGVycyB0aGUgdGltZWxpbmUgKGFzIG9wcG9zZWQgdG8gdGhlIHBhcmVudCB0aW1lbGluZSByZW5kZXJpbmcgaXQpLCBpdCBpcyBmb3JjZWQgdG8gcmUtcmVuZGVyIGFuZCBhbGlnbiBpdCB3aXRoIHRoZSBwcm9wZXIgdGltZS9mcmFtZSBvbiB0aGUgbmV4dCByZW5kZXJpbmcgY3ljbGUuIE1heWJlIHRoZSB0aW1lbGluZSBhbHJlYWR5IGZpbmlzaGVkIGJ1dCB0aGUgdXNlciBtYW51YWxseSByZS1yZW5kZXJzIGl0IGFzIGhhbGZ3YXkgZG9uZSwgZm9yIGV4YW1wbGUuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcmV2VGltZSA9PT0gMCkgaWYgKHRoaXMudmFycy5vblN0YXJ0KSBpZiAodGhpcy5fdGltZSAhPT0gMCB8fCAhdGhpcy5fZHVyYXRpb24pIGlmICghc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRjdXJUaW1lID0gdGhpcy5fdGltZTtcblx0XHRcdGlmIChjdXJUaW1lID49IHByZXZUaW1lKSB7XG5cdFx0XHRcdHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdG5leHQgPSB0d2Vlbi5fbmV4dDsgLy9yZWNvcmQgaXQgaGVyZSBiZWNhdXNlIHRoZSB2YWx1ZSBjb3VsZCBjaGFuZ2UgYWZ0ZXIgcmVuZGVyaW5nLi4uXG5cdFx0XHRcdFx0aWYgKGN1clRpbWUgIT09IHRoaXMuX3RpbWUgfHwgKHRoaXMuX3BhdXNlZCAmJiAhcHJldlBhdXNlZCkpIHsgLy9pbiBjYXNlIGEgdHdlZW4gcGF1c2VzIG9yIHNlZWtzIHRoZSB0aW1lbGluZSB3aGVuIHJlbmRlcmluZywgbGlrZSBpbnNpZGUgb2YgYW4gb25VcGRhdGUvb25Db21wbGV0ZVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0d2Vlbi5fYWN0aXZlIHx8ICh0d2Vlbi5fc3RhcnRUaW1lIDw9IGN1clRpbWUgJiYgIXR3ZWVuLl9wYXVzZWQgJiYgIXR3ZWVuLl9nYykpIHtcblx0XHRcdFx0XHRcdGlmIChwYXVzZVR3ZWVuID09PSB0d2Vlbikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKCghdHdlZW4uX2RpcnR5KSA/IHR3ZWVuLl90b3RhbER1cmF0aW9uIDogdHdlZW4udG90YWxEdXJhdGlvbigpKSAtICgodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHdlZW4gPSB0aGlzLl9sYXN0O1xuXHRcdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0XHRuZXh0ID0gdHdlZW4uX3ByZXY7IC8vcmVjb3JkIGl0IGhlcmUgYmVjYXVzZSB0aGUgdmFsdWUgY291bGQgY2hhbmdlIGFmdGVyIHJlbmRlcmluZy4uLlxuXHRcdFx0XHRcdGlmIChjdXJUaW1lICE9PSB0aGlzLl90aW1lIHx8ICh0aGlzLl9wYXVzZWQgJiYgIXByZXZQYXVzZWQpKSB7IC8vaW4gY2FzZSBhIHR3ZWVuIHBhdXNlcyBvciBzZWVrcyB0aGUgdGltZWxpbmUgd2hlbiByZW5kZXJpbmcsIGxpa2UgaW5zaWRlIG9mIGFuIG9uVXBkYXRlL29uQ29tcGxldGVcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHdlZW4uX2FjdGl2ZSB8fCAodHdlZW4uX3N0YXJ0VGltZSA8PSBwcmV2VGltZSAmJiAhdHdlZW4uX3BhdXNlZCAmJiAhdHdlZW4uX2djKSkge1xuXHRcdFx0XHRcdFx0aWYgKHBhdXNlVHdlZW4gPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSB0d2Vlbi5fcHJldjsgLy90aGUgbGlua2VkIGxpc3QgaXMgb3JnYW5pemVkIGJ5IF9zdGFydFRpbWUsIHRodXMgaXQncyBwb3NzaWJsZSB0aGF0IGEgdHdlZW4gY291bGQgc3RhcnQgQkVGT1JFIHRoZSBwYXVzZSBhbmQgZW5kIGFmdGVyIGl0LCBpbiB3aGljaCBjYXNlIGl0IHdvdWxkIGJlIHBvc2l0aW9uZWQgYmVmb3JlIHRoZSBwYXVzZSB0d2VlbiBpbiB0aGUgbGlua2VkIGxpc3QsIGJ1dCB3ZSBzaG91bGQgcmVuZGVyIGl0IGJlZm9yZSB3ZSBwYXVzZSgpIHRoZSB0aW1lbGluZSBhbmQgY2Vhc2UgcmVuZGVyaW5nLiBUaGlzIGlzIG9ubHkgYSBjb25jZXJuIHdoZW4gZ29pbmcgaW4gcmV2ZXJzZS5cblx0XHRcdFx0XHRcdFx0d2hpbGUgKHBhdXNlVHdlZW4gJiYgcGF1c2VUd2Vlbi5lbmRUaW1lKCkgPiB0aGlzLl90aW1lKSB7XG5cdFx0XHRcdFx0XHRcdFx0cGF1c2VUd2Vlbi5yZW5kZXIoIChwYXVzZVR3ZWVuLl9yZXZlcnNlZCA/IHBhdXNlVHdlZW4udG90YWxEdXJhdGlvbigpIC0gKCh0aW1lIC0gcGF1c2VUd2Vlbi5fc3RhcnRUaW1lKSAqIHBhdXNlVHdlZW4uX3RpbWVTY2FsZSkgOiAodGltZSAtIHBhdXNlVHdlZW4uX3N0YXJ0VGltZSkgKiBwYXVzZVR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSBwYXVzZVR3ZWVuLl9wcmV2O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4gPSBudWxsO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBhdXNlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKCghdHdlZW4uX2RpcnR5KSA/IHR3ZWVuLl90b3RhbER1cmF0aW9uIDogdHdlZW4udG90YWxEdXJhdGlvbigpKSAtICgodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fb25VcGRhdGUpIGlmICghc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2luIGNhc2UgcmVuZGVyaW5nIGNhdXNlZCBhbnkgdHdlZW5zIHRvIGxhenktaW5pdCwgd2Ugc2hvdWxkIHJlbmRlciB0aGVtIGJlY2F1c2UgdHlwaWNhbGx5IHdoZW4gYSB0aW1lbGluZSBmaW5pc2hlcywgdXNlcnMgZXhwZWN0IHRoaW5ncyB0byBoYXZlIHJlbmRlcmVkIGZ1bGx5LiBJbWFnaW5lIGFuIG9uVXBkYXRlIG9uIGEgdGltZWxpbmUgdGhhdCByZXBvcnRzL2NoZWNrcyB0d2VlbmVkIHZhbHVlcy5cblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25VcGRhdGVcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjYWxsYmFjaykgaWYgKCF0aGlzLl9nYykgaWYgKHByZXZTdGFydCA9PT0gdGhpcy5fc3RhcnRUaW1lIHx8IHByZXZUaW1lU2NhbGUgIT09IHRoaXMuX3RpbWVTY2FsZSkgaWYgKHRoaXMuX3RpbWUgPT09IDAgfHwgdG90YWxEdXIgPj0gdGhpcy50b3RhbER1cmF0aW9uKCkpIHsgLy9pZiBvbmUgb2YgdGhlIHR3ZWVucyB0aGF0IHdhcyByZW5kZXJlZCBhbHRlcmVkIHRoaXMgdGltZWxpbmUncyBzdGFydFRpbWUgKGxpa2UgaWYgYW4gb25Db21wbGV0ZSByZXZlcnNlZCB0aGUgdGltZWxpbmUpLCBpdCBwcm9iYWJseSBpc24ndCBjb21wbGV0ZS4gSWYgaXQgaXMsIGRvbid0IHdvcnJ5LCBiZWNhdXNlIHdoYXRldmVyIGNhbGwgYWx0ZXJlZCB0aGUgc3RhcnRUaW1lIHdvdWxkIGNvbXBsZXRlIGlmIGl0IHdhcyBuZWNlc3NhcnkgYXQgdGhlIG5ldyB0aW1lLiBUaGUgb25seSBleGNlcHRpb24gaXMgdGhlIHRpbWVTY2FsZSBwcm9wZXJ0eS4gQWxzbyBjaGVjayBfZ2MgYmVjYXVzZSB0aGVyZSdzIGEgY2hhbmNlIHRoYXQga2lsbCgpIGNvdWxkIGJlIGNhbGxlZCBpbiBhbiBvblVwZGF0ZVxuXHRcdFx0XHRpZiAoaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIGEgdGltZWxpbmUgZmluaXNoZXMsIHVzZXJzIGV4cGVjdCB0aGluZ3MgdG8gaGF2ZSByZW5kZXJlZCBmdWxseS4gSW1hZ2luZSBhbiBvbkNvbXBsZXRlIG9uIGEgdGltZWxpbmUgdGhhdCByZXBvcnRzL2NoZWNrcyB0d2VlbmVkIHZhbHVlcy5cblx0XHRcdFx0XHRcdF9sYXp5UmVuZGVyKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cyAmJiB0aGlzLnZhcnNbY2FsbGJhY2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuX2hhc1BhdXNlZENoaWxkID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdDtcblx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRpZiAodHdlZW4uX3BhdXNlZCB8fCAoKHR3ZWVuIGluc3RhbmNlb2YgVGltZWxpbmVMaXRlKSAmJiB0d2Vlbi5faGFzUGF1c2VkQ2hpbGQoKSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0XHRwLmdldENoaWxkcmVuID0gZnVuY3Rpb24obmVzdGVkLCB0d2VlbnMsIHRpbWVsaW5lcywgaWdub3JlQmVmb3JlVGltZSkge1xuXHRcdFx0aWdub3JlQmVmb3JlVGltZSA9IGlnbm9yZUJlZm9yZVRpbWUgfHwgLTk5OTk5OTk5OTk7XG5cdFx0XHR2YXIgYSA9IFtdLFxuXHRcdFx0XHR0d2VlbiA9IHRoaXMuX2ZpcnN0LFxuXHRcdFx0XHRjbnQgPSAwO1xuXHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdGlmICh0d2Vlbi5fc3RhcnRUaW1lIDwgaWdub3JlQmVmb3JlVGltZSkge1xuXHRcdFx0XHRcdC8vZG8gbm90aGluZ1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR3ZWVuIGluc3RhbmNlb2YgVHdlZW5MaXRlKSB7XG5cdFx0XHRcdFx0aWYgKHR3ZWVucyAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdGFbY250KytdID0gdHdlZW47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh0aW1lbGluZXMgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobmVzdGVkICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0YSA9IGEuY29uY2F0KHR3ZWVuLmdldENoaWxkcmVuKHRydWUsIHR3ZWVucywgdGltZWxpbmVzKSk7XG5cdFx0XHRcdFx0XHRjbnQgPSBhLmxlbmd0aDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhO1xuXHRcdH07XG5cblx0XHRwLmdldFR3ZWVuc09mID0gZnVuY3Rpb24odGFyZ2V0LCBuZXN0ZWQpIHtcblx0XHRcdHZhciBkaXNhYmxlZCA9IHRoaXMuX2djLFxuXHRcdFx0XHRhID0gW10sXG5cdFx0XHRcdGNudCA9IDAsXG5cdFx0XHRcdHR3ZWVucywgaTtcblx0XHRcdGlmIChkaXNhYmxlZCkge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUsIHRydWUpOyAvL2dldFR3ZWVuc09mKCkgZmlsdGVycyBvdXQgZGlzYWJsZWQgdHdlZW5zLCBhbmQgd2UgaGF2ZSB0byBtYXJrIHRoZW0gYXMgX2djID0gdHJ1ZSB3aGVuIHRoZSB0aW1lbGluZSBjb21wbGV0ZXMgaW4gb3JkZXIgdG8gYWxsb3cgY2xlYW4gZ2FyYmFnZSBjb2xsZWN0aW9uLCBzbyB0ZW1wb3JhcmlseSByZS1lbmFibGUgdGhlIHRpbWVsaW5lIGhlcmUuXG5cdFx0XHR9XG5cdFx0XHR0d2VlbnMgPSBUd2VlbkxpdGUuZ2V0VHdlZW5zT2YodGFyZ2V0KTtcblx0XHRcdGkgPSB0d2VlbnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGlmICh0d2VlbnNbaV0udGltZWxpbmUgPT09IHRoaXMgfHwgKG5lc3RlZCAmJiB0aGlzLl9jb250YWlucyh0d2VlbnNbaV0pKSkge1xuXHRcdFx0XHRcdGFbY250KytdID0gdHdlZW5zW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGlzYWJsZWQpIHtcblx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cdFx0cC5yZWNlbnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9yZWNlbnQ7XG5cdFx0fTtcblxuXHRcdHAuX2NvbnRhaW5zID0gZnVuY3Rpb24odHdlZW4pIHtcblx0XHRcdHZhciB0bCA9IHR3ZWVuLnRpbWVsaW5lO1xuXHRcdFx0d2hpbGUgKHRsKSB7XG5cdFx0XHRcdGlmICh0bCA9PT0gdGhpcykge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRsID0gdGwudGltZWxpbmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHRcdHAuc2hpZnRDaGlsZHJlbiA9IGZ1bmN0aW9uKGFtb3VudCwgYWRqdXN0TGFiZWxzLCBpZ25vcmVCZWZvcmVUaW1lKSB7XG5cdFx0XHRpZ25vcmVCZWZvcmVUaW1lID0gaWdub3JlQmVmb3JlVGltZSB8fCAwO1xuXHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fZmlyc3QsXG5cdFx0XHRcdGxhYmVscyA9IHRoaXMuX2xhYmVscyxcblx0XHRcdFx0cDtcblx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRpZiAodHdlZW4uX3N0YXJ0VGltZSA+PSBpZ25vcmVCZWZvcmVUaW1lKSB7XG5cdFx0XHRcdFx0dHdlZW4uX3N0YXJ0VGltZSArPSBhbW91bnQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdH1cblx0XHRcdGlmIChhZGp1c3RMYWJlbHMpIHtcblx0XHRcdFx0Zm9yIChwIGluIGxhYmVscykge1xuXHRcdFx0XHRcdGlmIChsYWJlbHNbcF0gPj0gaWdub3JlQmVmb3JlVGltZSkge1xuXHRcdFx0XHRcdFx0bGFiZWxzW3BdICs9IGFtb3VudDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdH07XG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24odmFycywgdGFyZ2V0KSB7XG5cdFx0XHRpZiAoIXZhcnMgJiYgIXRhcmdldCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHR3ZWVucyA9ICghdGFyZ2V0KSA/IHRoaXMuZ2V0Q2hpbGRyZW4odHJ1ZSwgdHJ1ZSwgZmFsc2UpIDogdGhpcy5nZXRUd2VlbnNPZih0YXJnZXQpLFxuXHRcdFx0XHRpID0gdHdlZW5zLmxlbmd0aCxcblx0XHRcdFx0Y2hhbmdlZCA9IGZhbHNlO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGlmICh0d2VlbnNbaV0uX2tpbGwodmFycywgdGFyZ2V0KSkge1xuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHR9O1xuXG5cdFx0cC5jbGVhciA9IGZ1bmN0aW9uKGxhYmVscykge1xuXHRcdFx0dmFyIHR3ZWVucyA9IHRoaXMuZ2V0Q2hpbGRyZW4oZmFsc2UsIHRydWUsIHRydWUpLFxuXHRcdFx0XHRpID0gdHdlZW5zLmxlbmd0aDtcblx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl90b3RhbFRpbWUgPSAwO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdHR3ZWVuc1tpXS5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxhYmVscyAhPT0gZmFsc2UpIHtcblx0XHRcdFx0dGhpcy5fbGFiZWxzID0ge307XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdDtcblx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHR0d2Vlbi5pbnZhbGlkYXRlKCk7XG5cdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gQW5pbWF0aW9uLnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyk7O1xuXHRcdH07XG5cblx0XHRwLl9lbmFibGVkID0gZnVuY3Rpb24oZW5hYmxlZCwgaWdub3JlVGltZWxpbmUpIHtcblx0XHRcdGlmIChlbmFibGVkID09PSB0aGlzLl9nYykge1xuXHRcdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdDtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0dHdlZW4uX2VuYWJsZWQoZW5hYmxlZCwgdHJ1ZSk7XG5cdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFNpbXBsZVRpbWVsaW5lLnByb3RvdHlwZS5fZW5hYmxlZC5jYWxsKHRoaXMsIGVuYWJsZWQsIGlnbm9yZVRpbWVsaW5lKTtcblx0XHR9O1xuXG5cdFx0cC50b3RhbFRpbWUgPSBmdW5jdGlvbih0aW1lLCBzdXBwcmVzc0V2ZW50cywgdW5jYXBwZWQpIHtcblx0XHRcdHRoaXMuX2ZvcmNpbmdQbGF5aGVhZCA9IHRydWU7XG5cdFx0XHR2YXIgdmFsID0gQW5pbWF0aW9uLnByb3RvdHlwZS50b3RhbFRpbWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdHRoaXMuX2ZvcmNpbmdQbGF5aGVhZCA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9O1xuXG5cdFx0cC5kdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdFx0dGhpcy50b3RhbER1cmF0aW9uKCk7IC8vanVzdCB0cmlnZ2VycyByZWNhbGN1bGF0aW9uXG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuZHVyYXRpb24oKSAhPT0gMCAmJiB2YWx1ZSAhPT0gMCkge1xuXHRcdFx0XHR0aGlzLnRpbWVTY2FsZSh0aGlzLl9kdXJhdGlvbiAvIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsRHVyYXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9kaXJ0eSkge1xuXHRcdFx0XHRcdHZhciBtYXggPSAwLFxuXHRcdFx0XHRcdFx0dHdlZW4gPSB0aGlzLl9sYXN0LFxuXHRcdFx0XHRcdFx0cHJldlN0YXJ0ID0gOTk5OTk5OTk5OTk5LFxuXHRcdFx0XHRcdFx0cHJldiwgZW5kO1xuXHRcdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdFx0cHJldiA9IHR3ZWVuLl9wcmV2OyAvL3JlY29yZCBpdCBoZXJlIGluIGNhc2UgdGhlIHR3ZWVuIGNoYW5nZXMgcG9zaXRpb24gaW4gdGhlIHNlcXVlbmNlLi4uXG5cdFx0XHRcdFx0XHRpZiAodHdlZW4uX2RpcnR5KSB7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLnRvdGFsRHVyYXRpb24oKTsgLy9jb3VsZCBjaGFuZ2UgdGhlIHR3ZWVuLl9zdGFydFRpbWUsIHNvIG1ha2Ugc3VyZSB0aGUgdHdlZW4ncyBjYWNoZSBpcyBjbGVhbiBiZWZvcmUgYW5hbHl6aW5nIGl0LlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHR3ZWVuLl9zdGFydFRpbWUgPiBwcmV2U3RhcnQgJiYgdGhpcy5fc29ydENoaWxkcmVuICYmICF0d2Vlbi5fcGF1c2VkKSB7IC8vaW4gY2FzZSBvbmUgb2YgdGhlIHR3ZWVucyBzaGlmdGVkIG91dCBvZiBvcmRlciwgaXQgbmVlZHMgdG8gYmUgcmUtaW5zZXJ0ZWQgaW50byB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiB0aGUgc2VxdWVuY2Vcblx0XHRcdFx0XHRcdFx0dGhpcy5hZGQodHdlZW4sIHR3ZWVuLl9zdGFydFRpbWUgLSB0d2Vlbi5fZGVsYXkpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cHJldlN0YXJ0ID0gdHdlZW4uX3N0YXJ0VGltZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh0d2Vlbi5fc3RhcnRUaW1lIDwgMCAmJiAhdHdlZW4uX3BhdXNlZCkgeyAvL2NoaWxkcmVuIGFyZW4ndCBhbGxvd2VkIHRvIGhhdmUgbmVnYXRpdmUgc3RhcnRUaW1lcyB1bmxlc3Mgc21vb3RoQ2hpbGRUaW1pbmcgaXMgdHJ1ZSwgc28gYWRqdXN0IGhlcmUgaWYgb25lIGlzIGZvdW5kLlxuXHRcdFx0XHRcdFx0XHRtYXggLT0gdHdlZW4uX3N0YXJ0VGltZTtcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lICs9IHR3ZWVuLl9zdGFydFRpbWUgLyB0aGlzLl90aW1lU2NhbGU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGhpcy5zaGlmdENoaWxkcmVuKC10d2Vlbi5fc3RhcnRUaW1lLCBmYWxzZSwgLTk5OTk5OTk5OTkpO1xuXHRcdFx0XHRcdFx0XHRwcmV2U3RhcnQgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZW5kID0gdHdlZW4uX3N0YXJ0VGltZSArICh0d2Vlbi5fdG90YWxEdXJhdGlvbiAvIHR3ZWVuLl90aW1lU2NhbGUpO1xuXHRcdFx0XHRcdFx0aWYgKGVuZCA+IG1heCkge1xuXHRcdFx0XHRcdFx0XHRtYXggPSBlbmQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0d2VlbiA9IHByZXY7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fdG90YWxEdXJhdGlvbiA9IG1heDtcblx0XHRcdFx0XHR0aGlzLl9kaXJ0eSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLl90b3RhbER1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh2YWx1ZSAmJiB0aGlzLnRvdGFsRHVyYXRpb24oKSkgPyB0aGlzLnRpbWVTY2FsZSh0aGlzLl90b3RhbER1cmF0aW9uIC8gdmFsdWUpIDogdGhpcztcblx0XHR9O1xuXG5cdFx0cC5wYXVzZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCF2YWx1ZSkgeyAvL2lmIHRoZXJlJ3MgYSBwYXVzZSBkaXJlY3RseSBhdCB0aGUgc3BvdCBmcm9tIHdoZXJlIHdlJ3JlIHVucGF1c2luZywgc2tpcCBpdC5cblx0XHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fZmlyc3QsXG5cdFx0XHRcdFx0dGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdGlmICh0d2Vlbi5fc3RhcnRUaW1lID09PSB0aW1lICYmIHR3ZWVuLmRhdGEgPT09IFwiaXNQYXVzZVwiKSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5fcmF3UHJldlRpbWUgPSAwOyAvL3JlbWVtYmVyLCBfcmF3UHJldlRpbWUgaXMgaG93IHplcm8tZHVyYXRpb24gdHdlZW5zL2NhbGxiYWNrcyBzZW5zZSBkaXJlY3Rpb25hbGl0eSBhbmQgZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGZpcmUuIElmIF9yYXdQcmV2VGltZSBpcyB0aGUgc2FtZSBhcyBfc3RhcnRUaW1lIG9uIHRoZSBuZXh0IHJlbmRlciwgaXQgd29uJ3QgZmlyZS5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIEFuaW1hdGlvbi5wcm90b3R5cGUucGF1c2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblxuXHRcdHAudXNlc0ZyYW1lcyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRsID0gdGhpcy5fdGltZWxpbmU7XG5cdFx0XHR3aGlsZSAodGwuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdHRsID0gdGwuX3RpbWVsaW5lO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh0bCA9PT0gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUpO1xuXHRcdH07XG5cblx0XHRwLnJhd1RpbWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9wYXVzZWQgPyB0aGlzLl90b3RhbFRpbWUgOiAodGhpcy5fdGltZWxpbmUucmF3VGltZSgpIC0gdGhpcy5fc3RhcnRUaW1lKSAqIHRoaXMuX3RpbWVTY2FsZTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIFRpbWVsaW5lTGl0ZTtcblxuXHR9LCB0cnVlKTtcblxuXG5cblxuXG5cblxuXG5cdFxuXHRcblx0XG5cdFxuXHRcbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUaW1lbGluZU1heFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcIlRpbWVsaW5lTWF4XCIsIFtcIlRpbWVsaW5lTGl0ZVwiLFwiVHdlZW5MaXRlXCIsXCJlYXNpbmcuRWFzZVwiXSwgZnVuY3Rpb24oVGltZWxpbmVMaXRlLCBUd2VlbkxpdGUsIEVhc2UpIHtcblxuXHRcdHZhciBUaW1lbGluZU1heCA9IGZ1bmN0aW9uKHZhcnMpIHtcblx0XHRcdFx0VGltZWxpbmVMaXRlLmNhbGwodGhpcywgdmFycyk7XG5cdFx0XHRcdHRoaXMuX3JlcGVhdCA9IHRoaXMudmFycy5yZXBlYXQgfHwgMDtcblx0XHRcdFx0dGhpcy5fcmVwZWF0RGVsYXkgPSB0aGlzLnZhcnMucmVwZWF0RGVsYXkgfHwgMDtcblx0XHRcdFx0dGhpcy5fY3ljbGUgPSAwO1xuXHRcdFx0XHR0aGlzLl95b3lvID0gKHRoaXMudmFycy55b3lvID09PSB0cnVlKTtcblx0XHRcdFx0dGhpcy5fZGlydHkgPSB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdF90aW55TnVtID0gMC4wMDAwMDAwMDAxLFxuXHRcdFx0VHdlZW5MaXRlSW50ZXJuYWxzID0gVHdlZW5MaXRlLl9pbnRlcm5hbHMsXG5cdFx0XHRfbGF6eVR3ZWVucyA9IFR3ZWVuTGl0ZUludGVybmFscy5sYXp5VHdlZW5zLFxuXHRcdFx0X2xhenlSZW5kZXIgPSBUd2VlbkxpdGVJbnRlcm5hbHMubGF6eVJlbmRlcixcblx0XHRcdF9nbG9iYWxzID0gX2dzU2NvcGUuX2dzRGVmaW5lLmdsb2JhbHMsXG5cdFx0XHRfZWFzZU5vbmUgPSBuZXcgRWFzZShudWxsLCBudWxsLCAxLCAwKSxcblx0XHRcdHAgPSBUaW1lbGluZU1heC5wcm90b3R5cGUgPSBuZXcgVGltZWxpbmVMaXRlKCk7XG5cblx0XHRwLmNvbnN0cnVjdG9yID0gVGltZWxpbmVNYXg7XG5cdFx0cC5raWxsKCkuX2djID0gZmFsc2U7XG5cdFx0VGltZWxpbmVNYXgudmVyc2lvbiA9IFwiMS4xOS4wXCI7XG5cblx0XHRwLmludmFsaWRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuX3lveW8gPSAodGhpcy52YXJzLnlveW8gPT09IHRydWUpO1xuXHRcdFx0dGhpcy5fcmVwZWF0ID0gdGhpcy52YXJzLnJlcGVhdCB8fCAwO1xuXHRcdFx0dGhpcy5fcmVwZWF0RGVsYXkgPSB0aGlzLnZhcnMucmVwZWF0RGVsYXkgfHwgMDtcblx0XHRcdHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0XHRyZXR1cm4gVGltZWxpbmVMaXRlLnByb3RvdHlwZS5pbnZhbGlkYXRlLmNhbGwodGhpcyk7XG5cdFx0fTtcblxuXHRcdHAuYWRkQ2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjaywgcG9zaXRpb24sIHBhcmFtcywgc2NvcGUpIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCggVHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAsIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlKSwgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLnJlbW92ZUNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2ssIHBvc2l0aW9uKSB7XG5cdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0aWYgKHBvc2l0aW9uID09IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLl9raWxsKG51bGwsIGNhbGxiYWNrKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgYSA9IHRoaXMuZ2V0VHdlZW5zT2YoY2FsbGJhY2ssIGZhbHNlKSxcblx0XHRcdFx0XHRcdGkgPSBhLmxlbmd0aCxcblx0XHRcdFx0XHRcdHRpbWUgPSB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKHBvc2l0aW9uKTtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmIChhW2ldLl9zdGFydFRpbWUgPT09IHRpbWUpIHtcblx0XHRcdFx0XHRcdFx0YVtpXS5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAucmVtb3ZlUGF1c2UgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVtb3ZlQ2FsbGJhY2soVGltZWxpbmVMaXRlLl9pbnRlcm5hbHMucGF1c2VDYWxsYmFjaywgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLnR3ZWVuVG8gPSBmdW5jdGlvbihwb3NpdGlvbiwgdmFycykge1xuXHRcdFx0dmFycyA9IHZhcnMgfHwge307XG5cdFx0XHR2YXIgY29weSA9IHtlYXNlOl9lYXNlTm9uZSwgdXNlRnJhbWVzOnRoaXMudXNlc0ZyYW1lcygpLCBpbW1lZGlhdGVSZW5kZXI6ZmFsc2V9LFxuXHRcdFx0XHRFbmdpbmUgPSAodmFycy5yZXBlYXQgJiYgX2dsb2JhbHMuVHdlZW5NYXgpIHx8IFR3ZWVuTGl0ZSxcblx0XHRcdFx0ZHVyYXRpb24sIHAsIHQ7XG5cdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRjb3B5W3BdID0gdmFyc1twXTtcblx0XHRcdH1cblx0XHRcdGNvcHkudGltZSA9IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwocG9zaXRpb24pO1xuXHRcdFx0ZHVyYXRpb24gPSAoTWF0aC5hYnMoTnVtYmVyKGNvcHkudGltZSkgLSB0aGlzLl90aW1lKSAvIHRoaXMuX3RpbWVTY2FsZSkgfHwgMC4wMDE7XG5cdFx0XHR0ID0gbmV3IEVuZ2luZSh0aGlzLCBkdXJhdGlvbiwgY29weSk7XG5cdFx0XHRjb3B5Lm9uU3RhcnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dC50YXJnZXQucGF1c2VkKHRydWUpO1xuXHRcdFx0XHRpZiAodC52YXJzLnRpbWUgIT09IHQudGFyZ2V0LnRpbWUoKSAmJiBkdXJhdGlvbiA9PT0gdC5kdXJhdGlvbigpKSB7IC8vZG9uJ3QgbWFrZSB0aGUgZHVyYXRpb24gemVybyAtIGlmIGl0J3Mgc3VwcG9zZWQgdG8gYmUgemVybywgZG9uJ3Qgd29ycnkgYmVjYXVzZSBpdCdzIGFscmVhZHkgaW5pdHRpbmcgdGhlIHR3ZWVuIGFuZCB3aWxsIGNvbXBsZXRlIGltbWVkaWF0ZWx5LCBlZmZlY3RpdmVseSBtYWtpbmcgdGhlIGR1cmF0aW9uIHplcm8gYW55d2F5LiBJZiB3ZSBtYWtlIGR1cmF0aW9uIHplcm8sIHRoZSB0d2VlbiB3b24ndCBydW4gYXQgYWxsLlxuXHRcdFx0XHRcdHQuZHVyYXRpb24oIE1hdGguYWJzKCB0LnZhcnMudGltZSAtIHQudGFyZ2V0LnRpbWUoKSkgLyB0LnRhcmdldC5fdGltZVNjYWxlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHZhcnMub25TdGFydCkgeyAvL2luIGNhc2UgdGhlIHVzZXIgaGFkIGFuIG9uU3RhcnQgaW4gdGhlIHZhcnMgLSB3ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSBpdC5cblx0XHRcdFx0XHR0Ll9jYWxsYmFjayhcIm9uU3RhcnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9O1xuXG5cdFx0cC50d2VlbkZyb21UbyA9IGZ1bmN0aW9uKGZyb21Qb3NpdGlvbiwgdG9Qb3NpdGlvbiwgdmFycykge1xuXHRcdFx0dmFycyA9IHZhcnMgfHwge307XG5cdFx0XHRmcm9tUG9zaXRpb24gPSB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKGZyb21Qb3NpdGlvbik7XG5cdFx0XHR2YXJzLnN0YXJ0QXQgPSB7b25Db21wbGV0ZTp0aGlzLnNlZWssIG9uQ29tcGxldGVQYXJhbXM6W2Zyb21Qb3NpdGlvbl0sIGNhbGxiYWNrU2NvcGU6dGhpc307XG5cdFx0XHR2YXJzLmltbWVkaWF0ZVJlbmRlciA9ICh2YXJzLmltbWVkaWF0ZVJlbmRlciAhPT0gZmFsc2UpO1xuXHRcdFx0dmFyIHQgPSB0aGlzLnR3ZWVuVG8odG9Qb3NpdGlvbiwgdmFycyk7XG5cdFx0XHRyZXR1cm4gdC5kdXJhdGlvbigoTWF0aC5hYnMoIHQudmFycy50aW1lIC0gZnJvbVBvc2l0aW9uKSAvIHRoaXMuX3RpbWVTY2FsZSkgfHwgMC4wMDEpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0aWYgKHRoaXMuX2djKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRvdGFsRHVyID0gKCF0aGlzLl9kaXJ0eSkgPyB0aGlzLl90b3RhbER1cmF0aW9uIDogdGhpcy50b3RhbER1cmF0aW9uKCksXG5cdFx0XHRcdGR1ciA9IHRoaXMuX2R1cmF0aW9uLFxuXHRcdFx0XHRwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG5cdFx0XHRcdHByZXZUb3RhbFRpbWUgPSB0aGlzLl90b3RhbFRpbWUsXG5cdFx0XHRcdHByZXZTdGFydCA9IHRoaXMuX3N0YXJ0VGltZSxcblx0XHRcdFx0cHJldlRpbWVTY2FsZSA9IHRoaXMuX3RpbWVTY2FsZSxcblx0XHRcdFx0cHJldlJhd1ByZXZUaW1lID0gdGhpcy5fcmF3UHJldlRpbWUsXG5cdFx0XHRcdHByZXZQYXVzZWQgPSB0aGlzLl9wYXVzZWQsXG5cdFx0XHRcdHByZXZDeWNsZSA9IHRoaXMuX2N5Y2xlLFxuXHRcdFx0XHR0d2VlbiwgaXNDb21wbGV0ZSwgbmV4dCwgY2FsbGJhY2ssIGludGVybmFsRm9yY2UsIGN5Y2xlRHVyYXRpb24sIHBhdXNlVHdlZW4sIGN1clRpbWU7XG5cdFx0XHRpZiAodGltZSA+PSB0b3RhbER1ciAtIDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMuXG5cdFx0XHRcdGlmICghdGhpcy5fbG9ja2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdG90YWxEdXI7XG5cdFx0XHRcdFx0dGhpcy5fY3ljbGUgPSB0aGlzLl9yZXBlYXQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLl9yZXZlcnNlZCkgaWYgKCF0aGlzLl9oYXNQYXVzZWRDaGlsZCgpKSB7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRydWU7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpbnRlcm5hbEZvcmNlID0gISF0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW47IC8vb3RoZXJ3aXNlLCBpZiB0aGUgYW5pbWF0aW9uIGlzIHVucGF1c2VkL2FjdGl2YXRlZCBhZnRlciBpdCdzIGFscmVhZHkgZmluaXNoZWQsIGl0IGRvZXNuJ3QgZ2V0IHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IHRpbWVsaW5lLlxuXHRcdFx0XHRcdGlmICh0aGlzLl9kdXJhdGlvbiA9PT0gMCkgaWYgKCh0aW1lIDw9IDAgJiYgdGltZSA+PSAtMC4wMDAwMDAxKSB8fCBwcmV2UmF3UHJldlRpbWUgPCAwIHx8IHByZXZSYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0pIGlmIChwcmV2UmF3UHJldlRpbWUgIT09IHRpbWUgJiYgdGhpcy5fZmlyc3QpIHtcblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYgKHByZXZSYXdQcmV2VGltZSA+IF90aW55TnVtKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9ICh0aGlzLl9kdXJhdGlvbiB8fCAhc3VwcHJlc3NFdmVudHMgfHwgdGltZSB8fCB0aGlzLl9yYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdGltZWxpbmUgb3IgdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdGlmICh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRpbWUgPSAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXI7XG5cdFx0XHRcdFx0dGltZSA9IGR1ciArIDAuMDAwMTsgLy90byBhdm9pZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9ycyAtIHNvbWV0aW1lcyBjaGlsZCB0d2VlbnMvdGltZWxpbmVzIHdlcmUgbm90IGJlaW5nIGZ1bGx5IGNvbXBsZXRlZCAodGhlaXIgcHJvZ3Jlc3MgbWlnaHQgYmUgMC45OTk5OTk5OTk5OTk5OTggaW5zdGVhZCBvZiAxIGJlY2F1c2Ugd2hlbiBfdGltZSAtIHR3ZWVuLl9zdGFydFRpbWUgaXMgcGVyZm9ybWVkLCBmbG9hdGluZyBwb2ludCBlcnJvcnMgd291bGQgcmV0dXJuIGEgdmFsdWUgdGhhdCB3YXMgU0xJR0hUTFkgb2ZmKS4gVHJ5ICg5OTk5OTk5OTk5OTkuNyAtIDk5OTk5OTk5OTk5OSkgKiAxID0gMC42OTk5NTExNzE4NzUgaW5zdGVhZCBvZiAwLjcuIFdlIGNhbm5vdCBkbyBsZXNzIHRoZW4gMC4wMDAxIGJlY2F1c2UgdGhlIHNhbWUgaXNzdWUgY2FuIG9jY3VyIHdoZW4gdGhlIGR1cmF0aW9uIGlzIGV4dHJlbWVseSBsYXJnZSBsaWtlIDk5OTk5OTk5OTk5OSBpbiB3aGljaCBjYXNlIGFkZGluZyAwLjAwMDAwMDAxLCBmb3IgZXhhbXBsZSwgY2F1c2VzIGl0IHRvIGFjdCBsaWtlIG5vdGhpbmcgd2FzIGFkZGVkLlxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAodGltZSA8IDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMsIHJvdW5kIHN1cGVyIHNtYWxsIHZhbHVlcyB0byAwLlxuXHRcdFx0XHRpZiAoIXRoaXMuX2xvY2tlZCkge1xuXHRcdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX2N5Y2xlID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl90aW1lID0gMDtcblx0XHRcdFx0aWYgKHByZXZUaW1lICE9PSAwIHx8IChkdXIgPT09IDAgJiYgcHJldlJhd1ByZXZUaW1lICE9PSBfdGlueU51bSAmJiAocHJldlJhd1ByZXZUaW1lID4gMCB8fCAodGltZSA8IDAgJiYgcHJldlJhd1ByZXZUaW1lID49IDApKSAmJiAhdGhpcy5fbG9ja2VkKSkgeyAvL2VkZ2UgY2FzZSBmb3IgY2hlY2tpbmcgdGltZSA8IDAgJiYgcHJldlJhd1ByZXZUaW1lID49IDA6IGEgemVyby1kdXJhdGlvbiBmcm9tVG8oKSB0d2VlbiBpbnNpZGUgYSB6ZXJvLWR1cmF0aW9uIHRpbWVsaW5lICh5ZWFoLCB2ZXJ5IHJhcmUpXG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRoaXMuX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aW1lIDwgMCkge1xuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4gJiYgdGhpcy5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSBpc0NvbXBsZXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHJldlJhd1ByZXZUaW1lID49IDAgJiYgdGhpcy5fZmlyc3QpIHsgLy93aGVuIGdvaW5nIGJhY2sgYmV5b25kIHRoZSBzdGFydCwgZm9yY2UgYSByZW5kZXIgc28gdGhhdCB6ZXJvLWR1cmF0aW9uIHR3ZWVucyB0aGF0IHNpdCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgcmVuZGVyIHRoZWlyIHN0YXJ0IHZhbHVlcyBwcm9wZXJseS4gT3RoZXJ3aXNlLCBpZiB0aGUgcGFyZW50IHRpbWVsaW5lJ3MgcGxheWhlYWQgbGFuZHMgZXhhY3RseSBhdCB0aGlzIHRpbWVsaW5lJ3Mgc3RhcnRUaW1lLCBhbmQgdGhlbiBtb3ZlcyBiYWNrd2FyZHMsIHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVucyBhdCB0aGUgYmVnaW5uaW5nIHdvdWxkIHN0aWxsIGJlIGF0IHRoZWlyIGVuZCBzdGF0ZS5cblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHRpbWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAoZHVyIHx8ICFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHRoaXMuX3Jhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0aW1lbGluZSBvciB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0XHRpZiAodGltZSA9PT0gMCAmJiBpc0NvbXBsZXRlKSB7IC8vaWYgdGhlcmUncyBhIHplcm8tZHVyYXRpb24gdHdlZW4gYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIGEgdGltZWxpbmUgYW5kIHRoZSBwbGF5aGVhZCBsYW5kcyBFWEFDVExZIGF0IHRpbWUgMCwgdGhhdCB0d2VlbiB3aWxsIGNvcnJlY3RseSByZW5kZXIgaXRzIGVuZCB2YWx1ZXMsIGJ1dCB3ZSBuZWVkIHRvIGtlZXAgdGhlIHRpbWVsaW5lIGFsaXZlIGZvciBvbmUgbW9yZSByZW5kZXIgc28gdGhhdCB0aGUgYmVnaW5uaW5nIHZhbHVlcyByZW5kZXIgcHJvcGVybHkgYXMgdGhlIHBhcmVudCdzIHBsYXloZWFkIGtlZXBzIG1vdmluZyBiZXlvbmQgdGhlIGJlZ2luaW5nLiBJbWFnaW5lIG9iai54IHN0YXJ0cyBhdCAwIGFuZCB0aGVuIHdlIGRvIHRsLnNldChvYmosIHt4OjEwMH0pLnRvKG9iaiwgMSwge3g6MjAwfSkgYW5kIHRoZW4gbGF0ZXIgd2UgdGwucmV2ZXJzZSgpLi4udGhlIGdvYWwgaXMgdG8gaGF2ZSBvYmoueCByZXZlcnQgdG8gMC4gSWYgdGhlIHBsYXloZWFkIGhhcHBlbnMgdG8gbGFuZCBvbiBleGFjdGx5IDAsIHdpdGhvdXQgdGhpcyBjaHVuayBvZiBjb2RlLCBpdCdkIGNvbXBsZXRlIHRoZSB0aW1lbGluZSBhbmQgcmVtb3ZlIGl0IGZyb20gdGhlIHJlbmRlcmluZyBxdWV1ZSAobm90IGdvb2QpLlxuXHRcdFx0XHRcdFx0dHdlZW4gPSB0aGlzLl9maXJzdDtcblx0XHRcdFx0XHRcdHdoaWxlICh0d2VlbiAmJiB0d2Vlbi5fc3RhcnRUaW1lID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdHdlZW4uX2R1cmF0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0aXNDb21wbGV0ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRpbWUgPSAwOyAvL3RvIGF2b2lkIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIChjb3VsZCBjYXVzZSBwcm9ibGVtcyBlc3BlY2lhbGx5IHdpdGggemVyby1kdXJhdGlvbiB0d2VlbnMgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIHRoZSB0aW1lbGluZSlcblx0XHRcdFx0XHRpZiAoIXRoaXMuX2luaXR0ZWQpIHtcblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoZHVyID09PSAwICYmIHByZXZSYXdQcmV2VGltZSA8IDApIHsgLy93aXRob3V0IHRoaXMsIHplcm8tZHVyYXRpb24gcmVwZWF0aW5nIHRpbWVsaW5lcyAobGlrZSB3aXRoIGEgc2ltcGxlIGNhbGxiYWNrIG5lc3RlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgYW5kIGEgcmVwZWF0RGVsYXkpIHdvdWxkbid0IHJlbmRlciB0aGUgZmlyc3QgdGltZSB0aHJvdWdoLlxuXHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSA9IHRpbWU7XG5cdFx0XHRcdGlmICghdGhpcy5fbG9ja2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGltZTtcblx0XHRcdFx0XHRpZiAodGhpcy5fcmVwZWF0ICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRjeWNsZUR1cmF0aW9uID0gZHVyICsgdGhpcy5fcmVwZWF0RGVsYXk7XG5cdFx0XHRcdFx0XHR0aGlzLl9jeWNsZSA9ICh0aGlzLl90b3RhbFRpbWUgLyBjeWNsZUR1cmF0aW9uKSA+PiAwOyAvL29yaWdpbmFsbHkgX3RvdGFsVGltZSAlIGN5Y2xlRHVyYXRpb24gYnV0IGZsb2F0aW5nIHBvaW50IGVycm9ycyBjYXVzZWQgcHJvYmxlbXMsIHNvIEkgbm9ybWFsaXplZCBpdC4gKDQgJSAwLjggc2hvdWxkIGJlIDAgYnV0IGl0IGdldHMgcmVwb3J0ZWQgYXMgMC43OTk5OTk5OSEpXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fY3ljbGUgIT09IDApIGlmICh0aGlzLl9jeWNsZSA9PT0gdGhpcy5fdG90YWxUaW1lIC8gY3ljbGVEdXJhdGlvbiAmJiBwcmV2VG90YWxUaW1lIDw9IHRpbWUpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fY3ljbGUtLTsgLy9vdGhlcndpc2Ugd2hlbiByZW5kZXJlZCBleGFjdGx5IGF0IHRoZSBlbmQgdGltZSwgaXQgd2lsbCBhY3QgYXMgdGhvdWdoIGl0IGlzIHJlcGVhdGluZyAoYXQgdGhlIGJlZ2lubmluZylcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl90b3RhbFRpbWUgLSAodGhpcy5fY3ljbGUgKiBjeWNsZUR1cmF0aW9uKTtcblx0XHRcdFx0XHRcdGlmICh0aGlzLl95b3lvKSBpZiAoKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fdGltZSA9IGR1ciAtIHRoaXMuX3RpbWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fdGltZSA+IGR1cikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gZHVyO1xuXHRcdFx0XHRcdFx0XHR0aW1lID0gZHVyICsgMC4wMDAxOyAvL3RvIGF2b2lkIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3Jcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdGltZSA8IDApIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRpbWUgPSAwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX2hhc1BhdXNlICYmICF0aGlzLl9mb3JjaW5nUGxheWhlYWQgJiYgIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdFx0dGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHRcdFx0aWYgKHRpbWUgPj0gcHJldlRpbWUpIHtcblx0XHRcdFx0XHRcdHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdFx0XHR3aGlsZSAodHdlZW4gJiYgdHdlZW4uX3N0YXJ0VGltZSA8PSB0aW1lICYmICFwYXVzZVR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdHdlZW4uX2R1cmF0aW9uKSBpZiAodHdlZW4uZGF0YSA9PT0gXCJpc1BhdXNlXCIgJiYgIXR3ZWVuLnJhdGlvICYmICEodHdlZW4uX3N0YXJ0VGltZSA9PT0gMCAmJiB0aGlzLl9yYXdQcmV2VGltZSA9PT0gMCkpIHtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuID0gdHdlZW47XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dHdlZW4gPSB0aGlzLl9sYXN0O1xuXHRcdFx0XHRcdFx0d2hpbGUgKHR3ZWVuICYmIHR3ZWVuLl9zdGFydFRpbWUgPj0gdGltZSAmJiAhcGF1c2VUd2Vlbikge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9kdXJhdGlvbikgaWYgKHR3ZWVuLmRhdGEgPT09IFwiaXNQYXVzZVwiICYmIHR3ZWVuLl9yYXdQcmV2VGltZSA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuID0gdHdlZW47XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fcHJldjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBhdXNlVHdlZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSB0aW1lID0gcGF1c2VUd2Vlbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGltZSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl90b3RhbER1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fY3ljbGUgIT09IHByZXZDeWNsZSkgaWYgKCF0aGlzLl9sb2NrZWQpIHtcblx0XHRcdFx0Lypcblx0XHRcdFx0bWFrZSBzdXJlIGNoaWxkcmVuIGF0IHRoZSBlbmQvYmVnaW5uaW5nIG9mIHRoZSB0aW1lbGluZSBhcmUgcmVuZGVyZWQgcHJvcGVybHkuIElmLCBmb3IgZXhhbXBsZSxcblx0XHRcdFx0YSAzLXNlY29uZCBsb25nIHRpbWVsaW5lIHJlbmRlcmVkIGF0IDIuOSBzZWNvbmRzIHByZXZpb3VzbHksIGFuZCBub3cgcmVuZGVycyBhdCAzLjIgc2Vjb25kcyAod2hpY2hcblx0XHRcdFx0d291bGQgZ2V0IHRyYW5zYXRlZCB0byAyLjggc2Vjb25kcyBpZiB0aGUgdGltZWxpbmUgeW95b3Mgb3IgMC4yIHNlY29uZHMgaWYgaXQganVzdCByZXBlYXRzKSwgdGhlcmVcblx0XHRcdFx0Y291bGQgYmUgYSBjYWxsYmFjayBvciBhIHNob3J0IHR3ZWVuIHRoYXQncyBhdCAyLjk1IG9yIDMgc2Vjb25kcyBpbiB3aGljaCB3b3VsZG4ndCByZW5kZXIuIFNvXG5cdFx0XHRcdHdlIG5lZWQgdG8gcHVzaCB0aGUgdGltZWxpbmUgdG8gdGhlIGVuZCAoYW5kL29yIGJlZ2lubmluZyBkZXBlbmRpbmcgb24gaXRzIHlveW8gdmFsdWUpLiBBbHNvIHdlIG11c3Rcblx0XHRcdFx0ZW5zdXJlIHRoYXQgemVyby1kdXJhdGlvbiB0d2VlbnMgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9yIGVuZCBvZiB0aGUgVGltZWxpbmVNYXggd29yay5cblx0XHRcdFx0Ki9cblx0XHRcdFx0dmFyIGJhY2t3YXJkcyA9ICh0aGlzLl95b3lvICYmIChwcmV2Q3ljbGUgJiAxKSAhPT0gMCksXG5cdFx0XHRcdFx0d3JhcCA9IChiYWNrd2FyZHMgPT09ICh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSksXG5cdFx0XHRcdFx0cmVjVG90YWxUaW1lID0gdGhpcy5fdG90YWxUaW1lLFxuXHRcdFx0XHRcdHJlY0N5Y2xlID0gdGhpcy5fY3ljbGUsXG5cdFx0XHRcdFx0cmVjUmF3UHJldlRpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSxcblx0XHRcdFx0XHRyZWNUaW1lID0gdGhpcy5fdGltZTtcblxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSBwcmV2Q3ljbGUgKiBkdXI7XG5cdFx0XHRcdGlmICh0aGlzLl9jeWNsZSA8IHByZXZDeWNsZSkge1xuXHRcdFx0XHRcdGJhY2t3YXJkcyA9ICFiYWNrd2FyZHM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lICs9IGR1cjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl90aW1lID0gcHJldlRpbWU7IC8vdGVtcG9yYXJpbHkgcmV2ZXJ0IF90aW1lIHNvIHRoYXQgcmVuZGVyKCkgcmVuZGVycyB0aGUgY2hpbGRyZW4gaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIFdpdGhvdXQgdGhpcywgdHdlZW5zIHdvbid0IHJld2luZCBjb3JyZWN0bHkuIFdlIGNvdWxkIGFyaGljdGVjdCB0aGluZ3MgaW4gYSBcImNsZWFuZXJcIiB3YXkgYnkgc3BsaXR0aW5nIG91dCB0aGUgcmVuZGVyaW5nIHF1ZXVlIGludG8gYSBzZXBhcmF0ZSBtZXRob2QgYnV0IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSBrZXB0IGl0IGFsbCBpbnNpZGUgdGhpcyBtZXRob2QuXG5cblx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAoZHVyID09PSAwKSA/IHByZXZSYXdQcmV2VGltZSAtIDAuMDAwMSA6IHByZXZSYXdQcmV2VGltZTtcblx0XHRcdFx0dGhpcy5fY3ljbGUgPSBwcmV2Q3ljbGU7XG5cdFx0XHRcdHRoaXMuX2xvY2tlZCA9IHRydWU7IC8vcHJldmVudHMgY2hhbmdlcyB0byB0b3RhbFRpbWUgYW5kIHNraXBzIHJlcGVhdC95b3lvIGJlaGF2aW9yIHdoZW4gd2UgcmVjdXJzaXZlbHkgY2FsbCByZW5kZXIoKVxuXHRcdFx0XHRwcmV2VGltZSA9IChiYWNrd2FyZHMpID8gMCA6IGR1cjtcblx0XHRcdFx0dGhpcy5yZW5kZXIocHJldlRpbWUsIHN1cHByZXNzRXZlbnRzLCAoZHVyID09PSAwKSk7XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMpIGlmICghdGhpcy5fZ2MpIHtcblx0XHRcdFx0XHRpZiAodGhpcy52YXJzLm9uUmVwZWF0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uUmVwZWF0XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJldlRpbWUgIT09IHRoaXMuX3RpbWUpIHsgLy9pbiBjYXNlIHRoZXJlJ3MgYSBjYWxsYmFjayBsaWtlIG9uQ29tcGxldGUgaW4gYSBuZXN0ZWQgdHdlZW4vdGltZWxpbmUgdGhhdCBjaGFuZ2VzIHRoZSBwbGF5aGVhZCBwb3NpdGlvbiwgbGlrZSB2aWEgc2VlaygpLCB3ZSBzaG91bGQganVzdCBhYm9ydC5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHdyYXApIHtcblx0XHRcdFx0XHRwcmV2VGltZSA9IChiYWNrd2FyZHMpID8gZHVyICsgMC4wMDAxIDogLTAuMDAwMTtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcihwcmV2VGltZSwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2xvY2tlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZiAodGhpcy5fcGF1c2VkICYmICFwcmV2UGF1c2VkKSB7IC8vaWYgdGhlIHJlbmRlcigpIHRyaWdnZXJlZCBjYWxsYmFjayB0aGF0IHBhdXNlZCB0aGlzIHRpbWVsaW5lLCB3ZSBzaG91bGQgYWJvcnQgKHZlcnkgcmFyZSwgYnV0IHBvc3NpYmxlKVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl90aW1lID0gcmVjVGltZTtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gcmVjVG90YWxUaW1lO1xuXHRcdFx0XHR0aGlzLl9jeWNsZSA9IHJlY0N5Y2xlO1xuXHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHJlY1Jhd1ByZXZUaW1lO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoKHRoaXMuX3RpbWUgPT09IHByZXZUaW1lIHx8ICF0aGlzLl9maXJzdCkgJiYgIWZvcmNlICYmICFpbnRlcm5hbEZvcmNlICYmICFwYXVzZVR3ZWVuKSB7XG5cdFx0XHRcdGlmIChwcmV2VG90YWxUaW1lICE9PSB0aGlzLl90b3RhbFRpbWUpIGlmICh0aGlzLl9vblVwZGF0ZSkgaWYgKCFzdXBwcmVzc0V2ZW50cykgeyAvL3NvIHRoYXQgb25VcGRhdGUgZmlyZXMgZXZlbiBkdXJpbmcgdGhlIHJlcGVhdERlbGF5IC0gYXMgbG9uZyBhcyB0aGUgdG90YWxUaW1lIGNoYW5nZWQsIHdlIHNob3VsZCB0cmlnZ2VyIG9uVXBkYXRlLlxuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25VcGRhdGVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0dGVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLl9hY3RpdmUpIGlmICghdGhpcy5fcGF1c2VkICYmIHRoaXMuX3RvdGFsVGltZSAhPT0gcHJldlRvdGFsVGltZSAmJiB0aW1lID4gMCkge1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSB0cnVlOyAgLy9zbyB0aGF0IGlmIHRoZSB1c2VyIHJlbmRlcnMgdGhlIHRpbWVsaW5lIChhcyBvcHBvc2VkIHRvIHRoZSBwYXJlbnQgdGltZWxpbmUgcmVuZGVyaW5nIGl0KSwgaXQgaXMgZm9yY2VkIHRvIHJlLXJlbmRlciBhbmQgYWxpZ24gaXQgd2l0aCB0aGUgcHJvcGVyIHRpbWUvZnJhbWUgb24gdGhlIG5leHQgcmVuZGVyaW5nIGN5Y2xlLiBNYXliZSB0aGUgdGltZWxpbmUgYWxyZWFkeSBmaW5pc2hlZCBidXQgdGhlIHVzZXIgbWFudWFsbHkgcmUtcmVuZGVycyBpdCBhcyBoYWxmd2F5IGRvbmUsIGZvciBleGFtcGxlLlxuXHRcdFx0fVxuXG5cdFx0XHRpZiAocHJldlRvdGFsVGltZSA9PT0gMCkgaWYgKHRoaXMudmFycy5vblN0YXJ0KSBpZiAodGhpcy5fdG90YWxUaW1lICE9PSAwIHx8ICF0aGlzLl90b3RhbER1cmF0aW9uKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25TdGFydFwiKTtcblx0XHRcdH1cblxuXHRcdFx0Y3VyVGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHRpZiAoY3VyVGltZSA+PSBwcmV2VGltZSkge1xuXHRcdFx0XHR0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0XHRuZXh0ID0gdHdlZW4uX25leHQ7IC8vcmVjb3JkIGl0IGhlcmUgYmVjYXVzZSB0aGUgdmFsdWUgY291bGQgY2hhbmdlIGFmdGVyIHJlbmRlcmluZy4uLlxuXHRcdFx0XHRcdGlmIChjdXJUaW1lICE9PSB0aGlzLl90aW1lIHx8ICh0aGlzLl9wYXVzZWQgJiYgIXByZXZQYXVzZWQpKSB7IC8vaW4gY2FzZSBhIHR3ZWVuIHBhdXNlcyBvciBzZWVrcyB0aGUgdGltZWxpbmUgd2hlbiByZW5kZXJpbmcsIGxpa2UgaW5zaWRlIG9mIGFuIG9uVXBkYXRlL29uQ29tcGxldGVcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHdlZW4uX2FjdGl2ZSB8fCAodHdlZW4uX3N0YXJ0VGltZSA8PSB0aGlzLl90aW1lICYmICF0d2Vlbi5fcGF1c2VkICYmICF0d2Vlbi5fZ2MpKSB7XG5cdFx0XHRcdFx0XHRpZiAocGF1c2VUd2VlbiA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCgoIXR3ZWVuLl9kaXJ0eSkgPyB0d2Vlbi5fdG90YWxEdXJhdGlvbiA6IHR3ZWVuLnRvdGFsRHVyYXRpb24oKSkgLSAoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHR3ZWVuID0gdGhpcy5fbGFzdDtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9wcmV2OyAvL3JlY29yZCBpdCBoZXJlIGJlY2F1c2UgdGhlIHZhbHVlIGNvdWxkIGNoYW5nZSBhZnRlciByZW5kZXJpbmcuLi5cblx0XHRcdFx0XHRpZiAoY3VyVGltZSAhPT0gdGhpcy5fdGltZSB8fCAodGhpcy5fcGF1c2VkICYmICFwcmV2UGF1c2VkKSkgeyAvL2luIGNhc2UgYSB0d2VlbiBwYXVzZXMgb3Igc2Vla3MgdGhlIHRpbWVsaW5lIHdoZW4gcmVuZGVyaW5nLCBsaWtlIGluc2lkZSBvZiBhbiBvblVwZGF0ZS9vbkNvbXBsZXRlXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR3ZWVuLl9hY3RpdmUgfHwgKHR3ZWVuLl9zdGFydFRpbWUgPD0gcHJldlRpbWUgJiYgIXR3ZWVuLl9wYXVzZWQgJiYgIXR3ZWVuLl9nYykpIHtcblx0XHRcdFx0XHRcdGlmIChwYXVzZVR3ZWVuID09PSB0d2Vlbikge1xuXHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuID0gdHdlZW4uX3ByZXY7IC8vdGhlIGxpbmtlZCBsaXN0IGlzIG9yZ2FuaXplZCBieSBfc3RhcnRUaW1lLCB0aHVzIGl0J3MgcG9zc2libGUgdGhhdCBhIHR3ZWVuIGNvdWxkIHN0YXJ0IEJFRk9SRSB0aGUgcGF1c2UgYW5kIGVuZCBhZnRlciBpdCwgaW4gd2hpY2ggY2FzZSBpdCB3b3VsZCBiZSBwb3NpdGlvbmVkIGJlZm9yZSB0aGUgcGF1c2UgdHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0LCBidXQgd2Ugc2hvdWxkIHJlbmRlciBpdCBiZWZvcmUgd2UgcGF1c2UoKSB0aGUgdGltZWxpbmUgYW5kIGNlYXNlIHJlbmRlcmluZy4gVGhpcyBpcyBvbmx5IGEgY29uY2VybiB3aGVuIGdvaW5nIGluIHJldmVyc2UuXG5cdFx0XHRcdFx0XHRcdHdoaWxlIChwYXVzZVR3ZWVuICYmIHBhdXNlVHdlZW4uZW5kVGltZSgpID4gdGhpcy5fdGltZSkge1xuXHRcdFx0XHRcdFx0XHRcdHBhdXNlVHdlZW4ucmVuZGVyKCAocGF1c2VUd2Vlbi5fcmV2ZXJzZWQgPyBwYXVzZVR3ZWVuLnRvdGFsRHVyYXRpb24oKSAtICgodGltZSAtIHBhdXNlVHdlZW4uX3N0YXJ0VGltZSkgKiBwYXVzZVR3ZWVuLl90aW1lU2NhbGUpIDogKHRpbWUgLSBwYXVzZVR3ZWVuLl9zdGFydFRpbWUpICogcGF1c2VUd2Vlbi5fdGltZVNjYWxlKSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuID0gcGF1c2VUd2Vlbi5fcHJldjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwYXVzZVR3ZWVuID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0dGhpcy5wYXVzZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCgoIXR3ZWVuLl9kaXJ0eSkgPyB0d2Vlbi5fdG90YWxEdXJhdGlvbiA6IHR3ZWVuLnRvdGFsRHVyYXRpb24oKSkgLSAoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX29uVXBkYXRlKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIGEgdGltZWxpbmUgZmluaXNoZXMsIHVzZXJzIGV4cGVjdCB0aGluZ3MgdG8gaGF2ZSByZW5kZXJlZCBmdWxseS4gSW1hZ2luZSBhbiBvblVwZGF0ZSBvbiBhIHRpbWVsaW5lIHRoYXQgcmVwb3J0cy9jaGVja3MgdHdlZW5lZCB2YWx1ZXMuXG5cdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNhbGxiYWNrKSBpZiAoIXRoaXMuX2xvY2tlZCkgaWYgKCF0aGlzLl9nYykgaWYgKHByZXZTdGFydCA9PT0gdGhpcy5fc3RhcnRUaW1lIHx8IHByZXZUaW1lU2NhbGUgIT09IHRoaXMuX3RpbWVTY2FsZSkgaWYgKHRoaXMuX3RpbWUgPT09IDAgfHwgdG90YWxEdXIgPj0gdGhpcy50b3RhbER1cmF0aW9uKCkpIHsgLy9pZiBvbmUgb2YgdGhlIHR3ZWVucyB0aGF0IHdhcyByZW5kZXJlZCBhbHRlcmVkIHRoaXMgdGltZWxpbmUncyBzdGFydFRpbWUgKGxpa2UgaWYgYW4gb25Db21wbGV0ZSByZXZlcnNlZCB0aGUgdGltZWxpbmUpLCBpdCBwcm9iYWJseSBpc24ndCBjb21wbGV0ZS4gSWYgaXQgaXMsIGRvbid0IHdvcnJ5LCBiZWNhdXNlIHdoYXRldmVyIGNhbGwgYWx0ZXJlZCB0aGUgc3RhcnRUaW1lIHdvdWxkIGNvbXBsZXRlIGlmIGl0IHdhcyBuZWNlc3NhcnkgYXQgdGhlIG5ldyB0aW1lLiBUaGUgb25seSBleGNlcHRpb24gaXMgdGhlIHRpbWVTY2FsZSBwcm9wZXJ0eS4gQWxzbyBjaGVjayBfZ2MgYmVjYXVzZSB0aGVyZSdzIGEgY2hhbmNlIHRoYXQga2lsbCgpIGNvdWxkIGJlIGNhbGxlZCBpbiBhbiBvblVwZGF0ZVxuXHRcdFx0XHRpZiAoaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIGEgdGltZWxpbmUgZmluaXNoZXMsIHVzZXJzIGV4cGVjdCB0aGluZ3MgdG8gaGF2ZSByZW5kZXJlZCBmdWxseS4gSW1hZ2luZSBhbiBvbkNvbXBsZXRlIG9uIGEgdGltZWxpbmUgdGhhdCByZXBvcnRzL2NoZWNrcyB0d2VlbmVkIHZhbHVlcy5cblx0XHRcdFx0XHRcdF9sYXp5UmVuZGVyKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cyAmJiB0aGlzLnZhcnNbY2FsbGJhY2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuZ2V0QWN0aXZlID0gZnVuY3Rpb24obmVzdGVkLCB0d2VlbnMsIHRpbWVsaW5lcykge1xuXHRcdFx0aWYgKG5lc3RlZCA9PSBudWxsKSB7XG5cdFx0XHRcdG5lc3RlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHdlZW5zID09IG51bGwpIHtcblx0XHRcdFx0dHdlZW5zID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aW1lbGluZXMgPT0gbnVsbCkge1xuXHRcdFx0XHR0aW1lbGluZXMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdGFsbCA9IHRoaXMuZ2V0Q2hpbGRyZW4obmVzdGVkLCB0d2VlbnMsIHRpbWVsaW5lcyksXG5cdFx0XHRcdGNudCA9IDAsXG5cdFx0XHRcdGwgPSBhbGwubGVuZ3RoLFxuXHRcdFx0XHRpLCB0d2Vlbjtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0dHdlZW4gPSBhbGxbaV07XG5cdFx0XHRcdGlmICh0d2Vlbi5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRcdFx0YVtjbnQrK10gPSB0d2Vlbjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fTtcblxuXG5cdFx0cC5nZXRMYWJlbEFmdGVyID0gZnVuY3Rpb24odGltZSkge1xuXHRcdFx0aWYgKCF0aW1lKSBpZiAodGltZSAhPT0gMCkgeyAvL2Zhc3RlciB0aGFuIGlzTmFuKClcblx0XHRcdFx0dGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbGFiZWxzID0gdGhpcy5nZXRMYWJlbHNBcnJheSgpLFxuXHRcdFx0XHRsID0gbGFiZWxzLmxlbmd0aCxcblx0XHRcdFx0aTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0aWYgKGxhYmVsc1tpXS50aW1lID4gdGltZSkge1xuXHRcdFx0XHRcdHJldHVybiBsYWJlbHNbaV0ubmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fTtcblxuXHRcdHAuZ2V0TGFiZWxCZWZvcmUgPSBmdW5jdGlvbih0aW1lKSB7XG5cdFx0XHRpZiAodGltZSA9PSBudWxsKSB7XG5cdFx0XHRcdHRpbWUgPSB0aGlzLl90aW1lO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGxhYmVscyA9IHRoaXMuZ2V0TGFiZWxzQXJyYXkoKSxcblx0XHRcdFx0aSA9IGxhYmVscy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKGxhYmVsc1tpXS50aW1lIDwgdGltZSkge1xuXHRcdFx0XHRcdHJldHVybiBsYWJlbHNbaV0ubmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fTtcblxuXHRcdHAuZ2V0TGFiZWxzQXJyYXkgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdGNudCA9IDAsXG5cdFx0XHRcdHA7XG5cdFx0XHRmb3IgKHAgaW4gdGhpcy5fbGFiZWxzKSB7XG5cdFx0XHRcdGFbY250KytdID0ge3RpbWU6dGhpcy5fbGFiZWxzW3BdLCBuYW1lOnB9O1xuXHRcdFx0fVxuXHRcdFx0YS5zb3J0KGZ1bmN0aW9uKGEsYikge1xuXHRcdFx0XHRyZXR1cm4gYS50aW1lIC0gYi50aW1lO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cbi8vLS0tLSBHRVRURVJTIC8gU0VUVEVSUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRwLnByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uKCkgOiB0aGlzLnRvdGFsVGltZSggdGhpcy5kdXJhdGlvbigpICogKCh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSA/IDEgLSB2YWx1ZSA6IHZhbHVlKSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KSksIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXG5cdFx0cC50b3RhbFByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RvdGFsVGltZSAvIHRoaXMudG90YWxEdXJhdGlvbigpIDogdGhpcy50b3RhbFRpbWUoIHRoaXMudG90YWxEdXJhdGlvbigpICogdmFsdWUsIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0XHRUaW1lbGluZUxpdGUucHJvdG90eXBlLnRvdGFsRHVyYXRpb24uY2FsbCh0aGlzKTsgLy9qdXN0IGZvcmNlcyByZWZyZXNoXG5cdFx0XHRcdFx0Ly9JbnN0ZWFkIG9mIEluZmluaXR5LCB3ZSB1c2UgOTk5OTk5OTk5OTk5IHNvIHRoYXQgd2UgY2FuIGFjY29tbW9kYXRlIHJldmVyc2VzLlxuXHRcdFx0XHRcdHRoaXMuX3RvdGFsRHVyYXRpb24gPSAodGhpcy5fcmVwZWF0ID09PSAtMSkgPyA5OTk5OTk5OTk5OTkgOiB0aGlzLl9kdXJhdGlvbiAqICh0aGlzLl9yZXBlYXQgKyAxKSArICh0aGlzLl9yZXBlYXREZWxheSAqIHRoaXMuX3JlcGVhdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RvdGFsRHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHRoaXMuX3JlcGVhdCA9PT0gLTEgfHwgIXZhbHVlKSA/IHRoaXMgOiB0aGlzLnRpbWVTY2FsZSggdGhpcy50b3RhbER1cmF0aW9uKCkgLyB2YWx1ZSApO1xuXHRcdH07XG5cblx0XHRwLnRpbWUgPSBmdW5jdGlvbih2YWx1ZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9kaXJ0eSkge1xuXHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSA+IHRoaXMuX2R1cmF0aW9uKSB7XG5cdFx0XHRcdHZhbHVlID0gdGhpcy5fZHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5feW95byAmJiAodGhpcy5fY3ljbGUgJiAxKSAhPT0gMCkge1xuXHRcdFx0XHR2YWx1ZSA9ICh0aGlzLl9kdXJhdGlvbiAtIHZhbHVlKSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KSk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3JlcGVhdCAhPT0gMCkge1xuXHRcdFx0XHR2YWx1ZSArPSB0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnRvdGFsVGltZSh2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnJlcGVhdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3JlcGVhdDtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3JlcGVhdCA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAucmVwZWF0RGVsYXkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9yZXBlYXREZWxheTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3JlcGVhdERlbGF5ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC55b3lvID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5feW95bztcblx0XHRcdH1cblx0XHRcdHRoaXMuX3lveW8gPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmN1cnJlbnRMYWJlbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0TGFiZWxCZWZvcmUodGhpcy5fdGltZSArIDAuMDAwMDAwMDEpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuc2Vlayh2YWx1ZSwgdHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHJldHVybiBUaW1lbGluZU1heDtcblxuXHR9LCB0cnVlKTtcblx0XG5cblxuXG5cblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQmV6aWVyUGx1Z2luXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0KGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIF9SQUQyREVHID0gMTgwIC8gTWF0aC5QSSxcblx0XHRcdF9yMSA9IFtdLFxuXHRcdFx0X3IyID0gW10sXG5cdFx0XHRfcjMgPSBbXSxcblx0XHRcdF9jb3JQcm9wcyA9IHt9LFxuXHRcdFx0X2dsb2JhbHMgPSBfZ3NTY29wZS5fZ3NEZWZpbmUuZ2xvYmFscyxcblx0XHRcdFNlZ21lbnQgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG5cdFx0XHRcdGlmIChjID09PSBkKSB7IC8vaWYgYyBhbmQgZCBtYXRjaCwgdGhlIGZpbmFsIGF1dG9Sb3RhdGUgdmFsdWUgY291bGQgbG9jayBhdCAtOTAgZGVncmVlcywgc28gZGlmZmVyZW50aWF0ZSB0aGVtIHNsaWdodGx5LlxuXHRcdFx0XHRcdGMgPSBkIC0gKGQgLSBiKSAvIDEwMDAwMDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGEgPT09IGIpIHsgLy9pZiBhIGFuZCBiIG1hdGNoLCB0aGUgc3RhcnRpbmcgYXV0b1JvdGF0ZSB2YWx1ZSBjb3VsZCBsb2NrIGF0IC05MCBkZWdyZWVzLCBzbyBkaWZmZXJlbnRpYXRlIHRoZW0gc2xpZ2h0bHkuXG5cdFx0XHRcdFx0YiA9IGEgKyAoYyAtIGEpIC8gMTAwMDAwMDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmEgPSBhO1xuXHRcdFx0XHR0aGlzLmIgPSBiO1xuXHRcdFx0XHR0aGlzLmMgPSBjO1xuXHRcdFx0XHR0aGlzLmQgPSBkO1xuXHRcdFx0XHR0aGlzLmRhID0gZCAtIGE7XG5cdFx0XHRcdHRoaXMuY2EgPSBjIC0gYTtcblx0XHRcdFx0dGhpcy5iYSA9IGIgLSBhO1xuXHRcdFx0fSxcblx0XHRcdF9jb3JyZWxhdGUgPSBcIix4LHkseixsZWZ0LHRvcCxyaWdodCxib3R0b20sbWFyZ2luVG9wLG1hcmdpbkxlZnQsbWFyZ2luUmlnaHQsbWFyZ2luQm90dG9tLHBhZGRpbmdMZWZ0LHBhZGRpbmdUb3AscGFkZGluZ1JpZ2h0LHBhZGRpbmdCb3R0b20sYmFja2dyb3VuZFBvc2l0aW9uLGJhY2tncm91bmRQb3NpdGlvbl95LFwiLFxuXHRcdFx0Y3ViaWNUb1F1YWRyYXRpYyA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcblx0XHRcdFx0dmFyIHExID0ge2E6YX0sXG5cdFx0XHRcdFx0cTIgPSB7fSxcblx0XHRcdFx0XHRxMyA9IHt9LFxuXHRcdFx0XHRcdHE0ID0ge2M6ZH0sXG5cdFx0XHRcdFx0bWFiID0gKGEgKyBiKSAvIDIsXG5cdFx0XHRcdFx0bWJjID0gKGIgKyBjKSAvIDIsXG5cdFx0XHRcdFx0bWNkID0gKGMgKyBkKSAvIDIsXG5cdFx0XHRcdFx0bWFiYyA9IChtYWIgKyBtYmMpIC8gMixcblx0XHRcdFx0XHRtYmNkID0gKG1iYyArIG1jZCkgLyAyLFxuXHRcdFx0XHRcdG04ID0gKG1iY2QgLSBtYWJjKSAvIDg7XG5cdFx0XHRcdHExLmIgPSBtYWIgKyAoYSAtIG1hYikgLyA0O1xuXHRcdFx0XHRxMi5iID0gbWFiYyArIG04O1xuXHRcdFx0XHRxMS5jID0gcTIuYSA9IChxMS5iICsgcTIuYikgLyAyO1xuXHRcdFx0XHRxMi5jID0gcTMuYSA9IChtYWJjICsgbWJjZCkgLyAyO1xuXHRcdFx0XHRxMy5iID0gbWJjZCAtIG04O1xuXHRcdFx0XHRxNC5iID0gbWNkICsgKGQgLSBtY2QpIC8gNDtcblx0XHRcdFx0cTMuYyA9IHE0LmEgPSAocTMuYiArIHE0LmIpIC8gMjtcblx0XHRcdFx0cmV0dXJuIFtxMSwgcTIsIHEzLCBxNF07XG5cdFx0XHR9LFxuXHRcdFx0X2NhbGN1bGF0ZUNvbnRyb2xQb2ludHMgPSBmdW5jdGlvbihhLCBjdXJ2aW5lc3MsIHF1YWQsIGJhc2ljLCBjb3JyZWxhdGUpIHtcblx0XHRcdFx0dmFyIGwgPSBhLmxlbmd0aCAtIDEsXG5cdFx0XHRcdFx0aWkgPSAwLFxuXHRcdFx0XHRcdGNwMSA9IGFbMF0uYSxcblx0XHRcdFx0XHRpLCBwMSwgcDIsIHAzLCBzZWcsIG0xLCBtMiwgbW0sIGNwMiwgcWIsIHIxLCByMiwgdGw7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRzZWcgPSBhW2lpXTtcblx0XHRcdFx0XHRwMSA9IHNlZy5hO1xuXHRcdFx0XHRcdHAyID0gc2VnLmQ7XG5cdFx0XHRcdFx0cDMgPSBhW2lpKzFdLmQ7XG5cblx0XHRcdFx0XHRpZiAoY29ycmVsYXRlKSB7XG5cdFx0XHRcdFx0XHRyMSA9IF9yMVtpXTtcblx0XHRcdFx0XHRcdHIyID0gX3IyW2ldO1xuXHRcdFx0XHRcdFx0dGwgPSAoKHIyICsgcjEpICogY3VydmluZXNzICogMC4yNSkgLyAoYmFzaWMgPyAwLjUgOiBfcjNbaV0gfHwgMC41KTtcblx0XHRcdFx0XHRcdG0xID0gcDIgLSAocDIgLSBwMSkgKiAoYmFzaWMgPyBjdXJ2aW5lc3MgKiAwLjUgOiAocjEgIT09IDAgPyB0bCAvIHIxIDogMCkpO1xuXHRcdFx0XHRcdFx0bTIgPSBwMiArIChwMyAtIHAyKSAqIChiYXNpYyA/IGN1cnZpbmVzcyAqIDAuNSA6IChyMiAhPT0gMCA/IHRsIC8gcjIgOiAwKSk7XG5cdFx0XHRcdFx0XHRtbSA9IHAyIC0gKG0xICsgKCgobTIgLSBtMSkgKiAoKHIxICogMyAvIChyMSArIHIyKSkgKyAwLjUpIC8gNCkgfHwgMCkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtMSA9IHAyIC0gKHAyIC0gcDEpICogY3VydmluZXNzICogMC41O1xuXHRcdFx0XHRcdFx0bTIgPSBwMiArIChwMyAtIHAyKSAqIGN1cnZpbmVzcyAqIDAuNTtcblx0XHRcdFx0XHRcdG1tID0gcDIgLSAobTEgKyBtMikgLyAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtMSArPSBtbTtcblx0XHRcdFx0XHRtMiArPSBtbTtcblxuXHRcdFx0XHRcdHNlZy5jID0gY3AyID0gbTE7XG5cdFx0XHRcdFx0aWYgKGkgIT09IDApIHtcblx0XHRcdFx0XHRcdHNlZy5iID0gY3AxO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWcuYiA9IGNwMSA9IHNlZy5hICsgKHNlZy5jIC0gc2VnLmEpICogMC42OyAvL2luc3RlYWQgb2YgcGxhY2luZyBiIG9uIGEgZXhhY3RseSwgd2UgbW92ZSBpdCBpbmxpbmUgd2l0aCBjIHNvIHRoYXQgaWYgdGhlIHVzZXIgc3BlY2lmaWVzIGFuIGVhc2UgbGlrZSBCYWNrLmVhc2VJbiBvciBFbGFzdGljLmVhc2VJbiB3aGljaCBnb2VzIEJFWU9ORCB0aGUgYmVnaW5uaW5nLCBpdCB3aWxsIGRvIHNvIHNtb290aGx5LlxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNlZy5kYSA9IHAyIC0gcDE7XG5cdFx0XHRcdFx0c2VnLmNhID0gY3AyIC0gcDE7XG5cdFx0XHRcdFx0c2VnLmJhID0gY3AxIC0gcDE7XG5cblx0XHRcdFx0XHRpZiAocXVhZCkge1xuXHRcdFx0XHRcdFx0cWIgPSBjdWJpY1RvUXVhZHJhdGljKHAxLCBjcDEsIGNwMiwgcDIpO1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoaWksIDEsIHFiWzBdLCBxYlsxXSwgcWJbMl0sIHFiWzNdKTtcblx0XHRcdFx0XHRcdGlpICs9IDQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlpKys7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3AxID0gbTI7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2VnID0gYVtpaV07XG5cdFx0XHRcdHNlZy5iID0gY3AxO1xuXHRcdFx0XHRzZWcuYyA9IGNwMSArIChzZWcuZCAtIGNwMSkgKiAwLjQ7IC8vaW5zdGVhZCBvZiBwbGFjaW5nIGMgb24gZCBleGFjdGx5LCB3ZSBtb3ZlIGl0IGlubGluZSB3aXRoIGIgc28gdGhhdCBpZiB0aGUgdXNlciBzcGVjaWZpZXMgYW4gZWFzZSBsaWtlIEJhY2suZWFzZU91dCBvciBFbGFzdGljLmVhc2VPdXQgd2hpY2ggZ29lcyBCRVlPTkQgdGhlIGVuZCwgaXQgd2lsbCBkbyBzbyBzbW9vdGhseS5cblx0XHRcdFx0c2VnLmRhID0gc2VnLmQgLSBzZWcuYTtcblx0XHRcdFx0c2VnLmNhID0gc2VnLmMgLSBzZWcuYTtcblx0XHRcdFx0c2VnLmJhID0gY3AxIC0gc2VnLmE7XG5cdFx0XHRcdGlmIChxdWFkKSB7XG5cdFx0XHRcdFx0cWIgPSBjdWJpY1RvUXVhZHJhdGljKHNlZy5hLCBjcDEsIHNlZy5jLCBzZWcuZCk7XG5cdFx0XHRcdFx0YS5zcGxpY2UoaWksIDEsIHFiWzBdLCBxYlsxXSwgcWJbMl0sIHFiWzNdKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF9wYXJzZUFuY2hvcnMgPSBmdW5jdGlvbih2YWx1ZXMsIHAsIGNvcnJlbGF0ZSwgcHJlcGVuZCkge1xuXHRcdFx0XHR2YXIgYSA9IFtdLFxuXHRcdFx0XHRcdGwsIGksIHAxLCBwMiwgcDMsIHRtcDtcblx0XHRcdFx0aWYgKHByZXBlbmQpIHtcblx0XHRcdFx0XHR2YWx1ZXMgPSBbcHJlcGVuZF0uY29uY2F0KHZhbHVlcyk7XG5cdFx0XHRcdFx0aSA9IHZhbHVlcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mKCAodG1wID0gdmFsdWVzW2ldW3BdKSApID09PSBcInN0cmluZ1wiKSBpZiAodG1wLmNoYXJBdCgxKSA9PT0gXCI9XCIpIHtcblx0XHRcdFx0XHRcdFx0dmFsdWVzW2ldW3BdID0gcHJlcGVuZFtwXSArIE51bWJlcih0bXAuY2hhckF0KDApICsgdG1wLnN1YnN0cigyKSk7IC8vYWNjb21tb2RhdGUgcmVsYXRpdmUgdmFsdWVzLiBEbyBpdCBpbmxpbmUgaW5zdGVhZCBvZiBicmVha2luZyBpdCBvdXQgaW50byBhIGZ1bmN0aW9uIGZvciBzcGVlZCByZWFzb25zXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGwgPSB2YWx1ZXMubGVuZ3RoIC0gMjtcblx0XHRcdFx0aWYgKGwgPCAwKSB7XG5cdFx0XHRcdFx0YVswXSA9IG5ldyBTZWdtZW50KHZhbHVlc1swXVtwXSwgMCwgMCwgdmFsdWVzWyhsIDwgLTEpID8gMCA6IDFdW3BdKTtcblx0XHRcdFx0XHRyZXR1cm4gYTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0cDEgPSB2YWx1ZXNbaV1bcF07XG5cdFx0XHRcdFx0cDIgPSB2YWx1ZXNbaSsxXVtwXTtcblx0XHRcdFx0XHRhW2ldID0gbmV3IFNlZ21lbnQocDEsIDAsIDAsIHAyKTtcblx0XHRcdFx0XHRpZiAoY29ycmVsYXRlKSB7XG5cdFx0XHRcdFx0XHRwMyA9IHZhbHVlc1tpKzJdW3BdO1xuXHRcdFx0XHRcdFx0X3IxW2ldID0gKF9yMVtpXSB8fCAwKSArIChwMiAtIHAxKSAqIChwMiAtIHAxKTtcblx0XHRcdFx0XHRcdF9yMltpXSA9IChfcjJbaV0gfHwgMCkgKyAocDMgLSBwMikgKiAocDMgLSBwMik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGFbaV0gPSBuZXcgU2VnbWVudCh2YWx1ZXNbaV1bcF0sIDAsIDAsIHZhbHVlc1tpKzFdW3BdKTtcblx0XHRcdFx0cmV0dXJuIGE7XG5cdFx0XHR9LFxuXHRcdFx0YmV6aWVyVGhyb3VnaCA9IGZ1bmN0aW9uKHZhbHVlcywgY3VydmluZXNzLCBxdWFkcmF0aWMsIGJhc2ljLCBjb3JyZWxhdGUsIHByZXBlbmQpIHtcblx0XHRcdFx0dmFyIG9iaiA9IHt9LFxuXHRcdFx0XHRcdHByb3BzID0gW10sXG5cdFx0XHRcdFx0Zmlyc3QgPSBwcmVwZW5kIHx8IHZhbHVlc1swXSxcblx0XHRcdFx0XHRpLCBwLCBhLCBqLCByLCBsLCBzZWFtbGVzcywgbGFzdDtcblx0XHRcdFx0Y29ycmVsYXRlID0gKHR5cGVvZihjb3JyZWxhdGUpID09PSBcInN0cmluZ1wiKSA/IFwiLFwiK2NvcnJlbGF0ZStcIixcIiA6IF9jb3JyZWxhdGU7XG5cdFx0XHRcdGlmIChjdXJ2aW5lc3MgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGN1cnZpbmVzcyA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yIChwIGluIHZhbHVlc1swXSkge1xuXHRcdFx0XHRcdHByb3BzLnB1c2gocCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9jaGVjayB0byBzZWUgaWYgdGhlIGxhc3QgYW5kIGZpcnN0IHZhbHVlcyBhcmUgaWRlbnRpY2FsICh3ZWxsLCB3aXRoaW4gMC4wNSkuIElmIHNvLCBtYWtlIHNlYW1sZXNzIGJ5IGFwcGVuZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQgdG8gdGhlIHZlcnkgZW5kIG9mIHRoZSB2YWx1ZXMgYXJyYXkgYW5kIHRoZSAybmQtdG8tbGFzdCBlbGVtZW50IHRvIHRoZSB2ZXJ5IGJlZ2lubmluZyAod2UnbGwgcmVtb3ZlIHRob3NlIHNlZ21lbnRzIGxhdGVyKVxuXHRcdFx0XHRpZiAodmFsdWVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRsYXN0ID0gdmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRzZWFtbGVzcyA9IHRydWU7XG5cdFx0XHRcdFx0aSA9IHByb3BzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdHAgPSBwcm9wc1tpXTtcblx0XHRcdFx0XHRcdGlmIChNYXRoLmFicyhmaXJzdFtwXSAtIGxhc3RbcF0pID4gMC4wNSkgeyAvL2J1aWxkIGluIGEgdG9sZXJhbmNlIG9mICsvLTAuMDUgdG8gYWNjb21tb2RhdGUgcm91bmRpbmcgZXJyb3JzLlxuXHRcdFx0XHRcdFx0XHRzZWFtbGVzcyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHNlYW1sZXNzKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KCk7IC8vZHVwbGljYXRlIHRoZSBhcnJheSB0byBhdm9pZCBjb250YW1pbmF0aW5nIHRoZSBvcmlnaW5hbCB3aGljaCB0aGUgdXNlciBtYXkgYmUgcmV1c2luZyBmb3Igb3RoZXIgdHdlZW5zXG5cdFx0XHRcdFx0XHRpZiAocHJlcGVuZCkge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZXMudW5zaGlmdChwcmVwZW5kKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZhbHVlcy5wdXNoKHZhbHVlc1sxXSk7XG5cdFx0XHRcdFx0XHRwcmVwZW5kID0gdmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAzXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0X3IxLmxlbmd0aCA9IF9yMi5sZW5ndGggPSBfcjMubGVuZ3RoID0gMDtcblx0XHRcdFx0aSA9IHByb3BzLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0cCA9IHByb3BzW2ldO1xuXHRcdFx0XHRcdF9jb3JQcm9wc1twXSA9IChjb3JyZWxhdGUuaW5kZXhPZihcIixcIitwK1wiLFwiKSAhPT0gLTEpO1xuXHRcdFx0XHRcdG9ialtwXSA9IF9wYXJzZUFuY2hvcnModmFsdWVzLCBwLCBfY29yUHJvcHNbcF0sIHByZXBlbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGkgPSBfcjEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRfcjFbaV0gPSBNYXRoLnNxcnQoX3IxW2ldKTtcblx0XHRcdFx0XHRfcjJbaV0gPSBNYXRoLnNxcnQoX3IyW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWJhc2ljKSB7XG5cdFx0XHRcdFx0aSA9IHByb3BzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmIChfY29yUHJvcHNbcF0pIHtcblx0XHRcdFx0XHRcdFx0YSA9IG9ialtwcm9wc1tpXV07XG5cdFx0XHRcdFx0XHRcdGwgPSBhLmxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBsOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0XHRyID0gKGFbaisxXS5kYSAvIF9yMltqXSArIGFbal0uZGEgLyBfcjFbal0pIHx8IDA7XG5cdFx0XHRcdFx0XHRcdFx0X3IzW2pdID0gKF9yM1tqXSB8fCAwKSArIHIgKiByO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGkgPSBfcjMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0X3IzW2ldID0gTWF0aC5zcXJ0KF9yM1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGkgPSBwcm9wcy5sZW5ndGg7XG5cdFx0XHRcdGogPSBxdWFkcmF0aWMgPyA0IDogMTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0cCA9IHByb3BzW2ldO1xuXHRcdFx0XHRcdGEgPSBvYmpbcF07XG5cdFx0XHRcdFx0X2NhbGN1bGF0ZUNvbnRyb2xQb2ludHMoYSwgY3VydmluZXNzLCBxdWFkcmF0aWMsIGJhc2ljLCBfY29yUHJvcHNbcF0pOyAvL3RoaXMgbWV0aG9kIHJlcXVpcmVzIHRoYXQgX3BhcnNlQW5jaG9ycygpIGFuZCBfc2V0U2VnbWVudFJhdGlvcygpIHJhbiBmaXJzdCBzbyB0aGF0IF9yMSwgX3IyLCBhbmQgX3IzIHZhbHVlcyBhcmUgcG9wdWxhdGVkIGZvciBhbGwgcHJvcGVydGllc1xuXHRcdFx0XHRcdGlmIChzZWFtbGVzcykge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoMCwgaik7XG5cdFx0XHRcdFx0XHRhLnNwbGljZShhLmxlbmd0aCAtIGosIGopO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fSxcblx0XHRcdF9wYXJzZUJlemllckRhdGEgPSBmdW5jdGlvbih2YWx1ZXMsIHR5cGUsIHByZXBlbmQpIHtcblx0XHRcdFx0dHlwZSA9IHR5cGUgfHwgXCJzb2Z0XCI7XG5cdFx0XHRcdHZhciBvYmogPSB7fSxcblx0XHRcdFx0XHRpbmMgPSAodHlwZSA9PT0gXCJjdWJpY1wiKSA/IDMgOiAyLFxuXHRcdFx0XHRcdHNvZnQgPSAodHlwZSA9PT0gXCJzb2Z0XCIpLFxuXHRcdFx0XHRcdHByb3BzID0gW10sXG5cdFx0XHRcdFx0YSwgYiwgYywgZCwgY3VyLCBpLCBqLCBsLCBwLCBjbnQsIHRtcDtcblx0XHRcdFx0aWYgKHNvZnQgJiYgcHJlcGVuZCkge1xuXHRcdFx0XHRcdHZhbHVlcyA9IFtwcmVwZW5kXS5jb25jYXQodmFsdWVzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodmFsdWVzID09IG51bGwgfHwgdmFsdWVzLmxlbmd0aCA8IGluYyArIDEpIHsgdGhyb3cgXCJpbnZhbGlkIEJlemllciBkYXRhXCI7IH1cblx0XHRcdFx0Zm9yIChwIGluIHZhbHVlc1swXSkge1xuXHRcdFx0XHRcdHByb3BzLnB1c2gocCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aSA9IHByb3BzLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0cCA9IHByb3BzW2ldO1xuXHRcdFx0XHRcdG9ialtwXSA9IGN1ciA9IFtdO1xuXHRcdFx0XHRcdGNudCA9IDA7XG5cdFx0XHRcdFx0bCA9IHZhbHVlcy5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IGw7IGorKykge1xuXHRcdFx0XHRcdFx0YSA9IChwcmVwZW5kID09IG51bGwpID8gdmFsdWVzW2pdW3BdIDogKHR5cGVvZiggKHRtcCA9IHZhbHVlc1tqXVtwXSkgKSA9PT0gXCJzdHJpbmdcIiAmJiB0bXAuY2hhckF0KDEpID09PSBcIj1cIikgPyBwcmVwZW5kW3BdICsgTnVtYmVyKHRtcC5jaGFyQXQoMCkgKyB0bXAuc3Vic3RyKDIpKSA6IE51bWJlcih0bXApO1xuXHRcdFx0XHRcdFx0aWYgKHNvZnQpIGlmIChqID4gMSkgaWYgKGogPCBsIC0gMSkge1xuXHRcdFx0XHRcdFx0XHRjdXJbY250KytdID0gKGEgKyBjdXJbY250LTJdKSAvIDI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJbY250KytdID0gYTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bCA9IGNudCAtIGluYyArIDE7XG5cdFx0XHRcdFx0Y250ID0gMDtcblx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbDsgaiArPSBpbmMpIHtcblx0XHRcdFx0XHRcdGEgPSBjdXJbal07XG5cdFx0XHRcdFx0XHRiID0gY3VyW2orMV07XG5cdFx0XHRcdFx0XHRjID0gY3VyW2orMl07XG5cdFx0XHRcdFx0XHRkID0gKGluYyA9PT0gMikgPyAwIDogY3VyW2orM107XG5cdFx0XHRcdFx0XHRjdXJbY250KytdID0gdG1wID0gKGluYyA9PT0gMykgPyBuZXcgU2VnbWVudChhLCBiLCBjLCBkKSA6IG5ldyBTZWdtZW50KGEsICgyICogYiArIGEpIC8gMywgKDIgKiBiICsgYykgLyAzLCBjKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VyLmxlbmd0aCA9IGNudDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fSxcblx0XHRcdF9hZGRDdWJpY0xlbmd0aHMgPSBmdW5jdGlvbihhLCBzdGVwcywgcmVzb2x1dGlvbikge1xuXHRcdFx0XHR2YXIgaW5jID0gMSAvIHJlc29sdXRpb24sXG5cdFx0XHRcdFx0aiA9IGEubGVuZ3RoLFxuXHRcdFx0XHRcdGQsIGQxLCBzLCBkYSwgY2EsIGJhLCBwLCBpLCBpbnYsIGJleiwgaW5kZXg7XG5cdFx0XHRcdHdoaWxlICgtLWogPiAtMSkge1xuXHRcdFx0XHRcdGJleiA9IGFbal07XG5cdFx0XHRcdFx0cyA9IGJlei5hO1xuXHRcdFx0XHRcdGRhID0gYmV6LmQgLSBzO1xuXHRcdFx0XHRcdGNhID0gYmV6LmMgLSBzO1xuXHRcdFx0XHRcdGJhID0gYmV6LmIgLSBzO1xuXHRcdFx0XHRcdGQgPSBkMSA9IDA7XG5cdFx0XHRcdFx0Zm9yIChpID0gMTsgaSA8PSByZXNvbHV0aW9uOyBpKyspIHtcblx0XHRcdFx0XHRcdHAgPSBpbmMgKiBpO1xuXHRcdFx0XHRcdFx0aW52ID0gMSAtIHA7XG5cdFx0XHRcdFx0XHRkID0gZDEgLSAoZDEgPSAocCAqIHAgKiBkYSArIDMgKiBpbnYgKiAocCAqIGNhICsgaW52ICogYmEpKSAqIHApO1xuXHRcdFx0XHRcdFx0aW5kZXggPSBqICogcmVzb2x1dGlvbiArIGkgLSAxO1xuXHRcdFx0XHRcdFx0c3RlcHNbaW5kZXhdID0gKHN0ZXBzW2luZGV4XSB8fCAwKSArIGQgKiBkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF9wYXJzZUxlbmd0aERhdGEgPSBmdW5jdGlvbihvYmosIHJlc29sdXRpb24pIHtcblx0XHRcdFx0cmVzb2x1dGlvbiA9IHJlc29sdXRpb24gPj4gMCB8fCA2O1xuXHRcdFx0XHR2YXIgYSA9IFtdLFxuXHRcdFx0XHRcdGxlbmd0aHMgPSBbXSxcblx0XHRcdFx0XHRkID0gMCxcblx0XHRcdFx0XHR0b3RhbCA9IDAsXG5cdFx0XHRcdFx0dGhyZXNob2xkID0gcmVzb2x1dGlvbiAtIDEsXG5cdFx0XHRcdFx0c2VnbWVudHMgPSBbXSxcblx0XHRcdFx0XHRjdXJMUyA9IFtdLCAvL2N1cnJlbnQgbGVuZ3RoIHNlZ21lbnRzIGFycmF5XG5cdFx0XHRcdFx0cCwgaSwgbCwgaW5kZXg7XG5cdFx0XHRcdGZvciAocCBpbiBvYmopIHtcblx0XHRcdFx0XHRfYWRkQ3ViaWNMZW5ndGhzKG9ialtwXSwgYSwgcmVzb2x1dGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0bCA9IGEubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0ZCArPSBNYXRoLnNxcnQoYVtpXSk7XG5cdFx0XHRcdFx0aW5kZXggPSBpICUgcmVzb2x1dGlvbjtcblx0XHRcdFx0XHRjdXJMU1tpbmRleF0gPSBkO1xuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gdGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0XHR0b3RhbCArPSBkO1xuXHRcdFx0XHRcdFx0aW5kZXggPSAoaSAvIHJlc29sdXRpb24pID4+IDA7XG5cdFx0XHRcdFx0XHRzZWdtZW50c1tpbmRleF0gPSBjdXJMUztcblx0XHRcdFx0XHRcdGxlbmd0aHNbaW5kZXhdID0gdG90YWw7XG5cdFx0XHRcdFx0XHRkID0gMDtcblx0XHRcdFx0XHRcdGN1ckxTID0gW107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7bGVuZ3RoOnRvdGFsLCBsZW5ndGhzOmxlbmd0aHMsIHNlZ21lbnRzOnNlZ21lbnRzfTtcblx0XHRcdH0sXG5cblxuXG5cdFx0XHRCZXppZXJQbHVnaW4gPSBfZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtcblx0XHRcdFx0XHRwcm9wTmFtZTogXCJiZXppZXJcIixcblx0XHRcdFx0XHRwcmlvcml0eTogLTEsXG5cdFx0XHRcdFx0dmVyc2lvbjogXCIxLjMuN1wiLFxuXHRcdFx0XHRcdEFQSTogMixcblx0XHRcdFx0XHRnbG9iYWw6dHJ1ZSxcblxuXHRcdFx0XHRcdC8vZ2V0cyBjYWxsZWQgd2hlbiB0aGUgdHdlZW4gcmVuZGVycyBmb3IgdGhlIGZpcnN0IHRpbWUuIFRoaXMgaXMgd2hlcmUgaW5pdGlhbCB2YWx1ZXMgc2hvdWxkIGJlIHJlY29yZGVkIGFuZCBhbnkgc2V0dXAgcm91dGluZXMgc2hvdWxkIHJ1bi5cblx0XHRcdFx0XHRpbml0OiBmdW5jdGlvbih0YXJnZXQsIHZhcnMsIHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRpZiAodmFycyBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdFx0XHRcdHZhcnMgPSB7dmFsdWVzOnZhcnN9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fZnVuYyA9IHt9O1xuXHRcdFx0XHRcdFx0dGhpcy5fbW9kID0ge307XG5cdFx0XHRcdFx0XHR0aGlzLl9wcm9wcyA9IFtdO1xuXHRcdFx0XHRcdFx0dGhpcy5fdGltZVJlcyA9ICh2YXJzLnRpbWVSZXNvbHV0aW9uID09IG51bGwpID8gNiA6IHBhcnNlSW50KHZhcnMudGltZVJlc29sdXRpb24sIDEwKTtcblx0XHRcdFx0XHRcdHZhciB2YWx1ZXMgPSB2YXJzLnZhbHVlcyB8fCBbXSxcblx0XHRcdFx0XHRcdFx0Zmlyc3QgPSB7fSxcblx0XHRcdFx0XHRcdFx0c2Vjb25kID0gdmFsdWVzWzBdLFxuXHRcdFx0XHRcdFx0XHRhdXRvUm90YXRlID0gdmFycy5hdXRvUm90YXRlIHx8IHR3ZWVuLnZhcnMub3JpZW50VG9CZXppZXIsXG5cdFx0XHRcdFx0XHRcdHAsIGlzRnVuYywgaSwgaiwgcHJlcGVuZDtcblxuXHRcdFx0XHRcdFx0dGhpcy5fYXV0b1JvdGF0ZSA9IGF1dG9Sb3RhdGUgPyAoYXV0b1JvdGF0ZSBpbnN0YW5jZW9mIEFycmF5KSA/IGF1dG9Sb3RhdGUgOiBbW1wieFwiLFwieVwiLFwicm90YXRpb25cIiwoKGF1dG9Sb3RhdGUgPT09IHRydWUpID8gMCA6IE51bWJlcihhdXRvUm90YXRlKSB8fCAwKV1dIDogbnVsbDtcblx0XHRcdFx0XHRcdGZvciAocCBpbiBzZWNvbmQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fcHJvcHMucHVzaChwKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aSA9IHRoaXMuX3Byb3BzLmxlbmd0aDtcblx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRwID0gdGhpcy5fcHJvcHNbaV07XG5cblx0XHRcdFx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChwKTtcblx0XHRcdFx0XHRcdFx0aXNGdW5jID0gdGhpcy5fZnVuY1twXSA9ICh0eXBlb2YodGFyZ2V0W3BdKSA9PT0gXCJmdW5jdGlvblwiKTtcblx0XHRcdFx0XHRcdFx0Zmlyc3RbcF0gPSAoIWlzRnVuYykgPyBwYXJzZUZsb2F0KHRhcmdldFtwXSkgOiB0YXJnZXRbICgocC5pbmRleE9mKFwic2V0XCIpIHx8IHR5cGVvZih0YXJnZXRbXCJnZXRcIiArIHAuc3Vic3RyKDMpXSkgIT09IFwiZnVuY3Rpb25cIikgPyBwIDogXCJnZXRcIiArIHAuc3Vic3RyKDMpKSBdKCk7XG5cdFx0XHRcdFx0XHRcdGlmICghcHJlcGVuZCkgaWYgKGZpcnN0W3BdICE9PSB2YWx1ZXNbMF1bcF0pIHtcblx0XHRcdFx0XHRcdFx0XHRwcmVwZW5kID0gZmlyc3Q7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX2JlemllcnMgPSAodmFycy50eXBlICE9PSBcImN1YmljXCIgJiYgdmFycy50eXBlICE9PSBcInF1YWRyYXRpY1wiICYmIHZhcnMudHlwZSAhPT0gXCJzb2Z0XCIpID8gYmV6aWVyVGhyb3VnaCh2YWx1ZXMsIGlzTmFOKHZhcnMuY3VydmluZXNzKSA/IDEgOiB2YXJzLmN1cnZpbmVzcywgZmFsc2UsICh2YXJzLnR5cGUgPT09IFwidGhydUJhc2ljXCIpLCB2YXJzLmNvcnJlbGF0ZSwgcHJlcGVuZCkgOiBfcGFyc2VCZXppZXJEYXRhKHZhbHVlcywgdmFycy50eXBlLCBmaXJzdCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9zZWdDb3VudCA9IHRoaXMuX2JlemllcnNbcF0ubGVuZ3RoO1xuXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fdGltZVJlcykge1xuXHRcdFx0XHRcdFx0XHR2YXIgbGQgPSBfcGFyc2VMZW5ndGhEYXRhKHRoaXMuX2JlemllcnMsIHRoaXMuX3RpbWVSZXMpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9sZW5ndGggPSBsZC5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xlbmd0aHMgPSBsZC5sZW5ndGhzO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9zZWdtZW50cyA9IGxkLnNlZ21lbnRzO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9sMSA9IHRoaXMuX2xpID0gdGhpcy5fczEgPSB0aGlzLl9zaSA9IDA7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2wyID0gdGhpcy5fbGVuZ3Roc1swXTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fY3VyU2VnID0gdGhpcy5fc2VnbWVudHNbMF07XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3MyID0gdGhpcy5fY3VyU2VnWzBdO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9wcmVjID0gMSAvIHRoaXMuX2N1clNlZy5sZW5ndGg7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICgoYXV0b1JvdGF0ZSA9IHRoaXMuX2F1dG9Sb3RhdGUpKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2luaXRpYWxSb3RhdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRcdFx0aWYgKCEoYXV0b1JvdGF0ZVswXSBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2F1dG9Sb3RhdGUgPSBhdXRvUm90YXRlID0gW2F1dG9Sb3RhdGVdO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGkgPSBhdXRvUm90YXRlLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IDM7IGorKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0cCA9IGF1dG9Sb3RhdGVbaV1bal07XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9mdW5jW3BdID0gKHR5cGVvZih0YXJnZXRbcF0pID09PSBcImZ1bmN0aW9uXCIpID8gdGFyZ2V0WyAoKHAuaW5kZXhPZihcInNldFwiKSB8fCB0eXBlb2YodGFyZ2V0W1wiZ2V0XCIgKyBwLnN1YnN0cigzKV0pICE9PSBcImZ1bmN0aW9uXCIpID8gcCA6IFwiZ2V0XCIgKyBwLnN1YnN0cigzKSkgXSA6IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRwID0gYXV0b1JvdGF0ZVtpXVsyXTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9pbml0aWFsUm90YXRpb25zW2ldID0gKHRoaXMuX2Z1bmNbcF0gPyB0aGlzLl9mdW5jW3BdLmNhbGwodGhpcy5fdGFyZ2V0KSA6IHRoaXMuX3RhcmdldFtwXSkgfHwgMDtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydFJhdGlvID0gdHdlZW4udmFycy5ydW5CYWNrd2FyZHMgPyAxIDogMDsgLy93ZSBkZXRlcm1pbmUgdGhlIHN0YXJ0aW5nIHJhdGlvIHdoZW4gdGhlIHR3ZWVuIGluaXRzIHdoaWNoIGlzIGFsd2F5cyAwIHVubGVzcyB0aGUgdHdlZW4gaGFzIHJ1bkJhY2t3YXJkczp0cnVlIChpbmRpY2F0aW5nIGl0J3MgYSBmcm9tKCkgdHdlZW4pIGluIHdoaWNoIGNhc2UgaXQncyAxLlxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdC8vY2FsbGVkIGVhY2ggdGltZSB0aGUgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkLCBhbmQgdGhlIHJhdGlvIGdldHMgcGFzc2VkIGFzIHRoZSBvbmx5IHBhcmFtZXRlciAodHlwaWNhbGx5IGl0J3MgYSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEsIGJ1dCBpdCBjYW4gZXhjZWVkIHRob3NlIHdoZW4gdXNpbmcgYW4gZWFzZSBsaWtlIEVsYXN0aWMuZWFzZU91dCBvciBCYWNrLmVhc2VPdXQsIGV0Yy4pXG5cdFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0XHR2YXIgc2VnbWVudHMgPSB0aGlzLl9zZWdDb3VudCxcblx0XHRcdFx0XHRcdFx0ZnVuYyA9IHRoaXMuX2Z1bmMsXG5cdFx0XHRcdFx0XHRcdHRhcmdldCA9IHRoaXMuX3RhcmdldCxcblx0XHRcdFx0XHRcdFx0bm90U3RhcnQgPSAodiAhPT0gdGhpcy5fc3RhcnRSYXRpbyksXG5cdFx0XHRcdFx0XHRcdGN1ckluZGV4LCBpbnYsIGksIHAsIGIsIHQsIHZhbCwgbCwgbGVuZ3RocywgY3VyU2VnO1xuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLl90aW1lUmVzKSB7XG5cdFx0XHRcdFx0XHRcdGN1ckluZGV4ID0gKHYgPCAwKSA/IDAgOiAodiA+PSAxKSA/IHNlZ21lbnRzIC0gMSA6IChzZWdtZW50cyAqIHYpID4+IDA7XG5cdFx0XHRcdFx0XHRcdHQgPSAodiAtIChjdXJJbmRleCAqICgxIC8gc2VnbWVudHMpKSkgKiBzZWdtZW50cztcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGxlbmd0aHMgPSB0aGlzLl9sZW5ndGhzO1xuXHRcdFx0XHRcdFx0XHRjdXJTZWcgPSB0aGlzLl9jdXJTZWc7XG5cdFx0XHRcdFx0XHRcdHYgKj0gdGhpcy5fbGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRpID0gdGhpcy5fbGk7XG5cdFx0XHRcdFx0XHRcdC8vZmluZCB0aGUgYXBwcm9wcmlhdGUgc2VnbWVudCAoaWYgdGhlIGN1cnJlbnRseSBjYWNoZWQgb25lIGlzbid0IGNvcnJlY3QpXG5cdFx0XHRcdFx0XHRcdGlmICh2ID4gdGhpcy5fbDIgJiYgaSA8IHNlZ21lbnRzIC0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdGwgPSBzZWdtZW50cyAtIDE7XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKGkgPCBsICYmICh0aGlzLl9sMiA9IGxlbmd0aHNbKytpXSkgPD0gdikge1x0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2wxID0gbGVuZ3Roc1tpLTFdO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2xpID0gaTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9jdXJTZWcgPSBjdXJTZWcgPSB0aGlzLl9zZWdtZW50c1tpXTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zMiA9IGN1clNlZ1sodGhpcy5fczEgPSB0aGlzLl9zaSA9IDApXTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh2IDwgdGhpcy5fbDEgJiYgaSA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoaSA+IDAgJiYgKHRoaXMuX2wxID0gbGVuZ3Roc1stLWldKSA+PSB2KSB7IH1cblx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCAmJiB2IDwgdGhpcy5fbDEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2wxID0gMDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9sMiA9IGxlbmd0aHNbaV07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fbGkgPSBpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2N1clNlZyA9IGN1clNlZyA9IHRoaXMuX3NlZ21lbnRzW2ldO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MxID0gY3VyU2VnWyh0aGlzLl9zaSA9IGN1clNlZy5sZW5ndGggLSAxKSAtIDFdIHx8IDA7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fczIgPSBjdXJTZWdbdGhpcy5fc2ldO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGN1ckluZGV4ID0gaTtcblx0XHRcdFx0XHRcdFx0Ly9ub3cgZmluZCB0aGUgYXBwcm9wcmlhdGUgc3ViLXNlZ21lbnQgKHdlIHNwbGl0IGl0IGludG8gdGhlIG51bWJlciBvZiBwaWVjZXMgdGhhdCB3YXMgZGVmaW5lZCBieSBcInByZWNpc2lvblwiIGFuZCBtZWFzdXJlZCBlYWNoIG9uZSlcblx0XHRcdFx0XHRcdFx0diAtPSB0aGlzLl9sMTtcblx0XHRcdFx0XHRcdFx0aSA9IHRoaXMuX3NpO1xuXHRcdFx0XHRcdFx0XHRpZiAodiA+IHRoaXMuX3MyICYmIGkgPCBjdXJTZWcubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0XHRcdGwgPSBjdXJTZWcubGVuZ3RoIC0gMTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoaSA8IGwgJiYgKHRoaXMuX3MyID0gY3VyU2VnWysraV0pIDw9IHYpIHtcdH1cblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zMSA9IGN1clNlZ1tpLTFdO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3NpID0gaTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh2IDwgdGhpcy5fczEgJiYgaSA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoaSA+IDAgJiYgKHRoaXMuX3MxID0gY3VyU2VnWy0taV0pID49IHYpIHtcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAoaSA9PT0gMCAmJiB2IDwgdGhpcy5fczEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MxID0gMDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zMiA9IGN1clNlZ1tpXTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zaSA9IGk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dCA9ICgoaSArICh2IC0gdGhpcy5fczEpIC8gKHRoaXMuX3MyIC0gdGhpcy5fczEpKSAqIHRoaXMuX3ByZWMpIHx8IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpbnYgPSAxIC0gdDtcblxuXHRcdFx0XHRcdFx0aSA9IHRoaXMuX3Byb3BzLmxlbmd0aDtcblx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRwID0gdGhpcy5fcHJvcHNbaV07XG5cdFx0XHRcdFx0XHRcdGIgPSB0aGlzLl9iZXppZXJzW3BdW2N1ckluZGV4XTtcblx0XHRcdFx0XHRcdFx0dmFsID0gKHQgKiB0ICogYi5kYSArIDMgKiBpbnYgKiAodCAqIGIuY2EgKyBpbnYgKiBiLmJhKSkgKiB0ICsgYi5hO1xuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5fbW9kW3BdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsID0gdGhpcy5fbW9kW3BdKHZhbCwgdGFyZ2V0KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoZnVuY1twXSkge1xuXHRcdFx0XHRcdFx0XHRcdHRhcmdldFtwXSh2YWwpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRhcmdldFtwXSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fYXV0b1JvdGF0ZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgYXIgPSB0aGlzLl9hdXRvUm90YXRlLFxuXHRcdFx0XHRcdFx0XHRcdGIyLCB4MSwgeTEsIHgyLCB5MiwgYWRkLCBjb252O1xuXHRcdFx0XHRcdFx0XHRpID0gYXIubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRwID0gYXJbaV1bMl07XG5cdFx0XHRcdFx0XHRcdFx0YWRkID0gYXJbaV1bM10gfHwgMDtcblx0XHRcdFx0XHRcdFx0XHRjb252ID0gKGFyW2ldWzRdID09PSB0cnVlKSA/IDEgOiBfUkFEMkRFRztcblx0XHRcdFx0XHRcdFx0XHRiID0gdGhpcy5fYmV6aWVyc1thcltpXVswXV07XG5cdFx0XHRcdFx0XHRcdFx0YjIgPSB0aGlzLl9iZXppZXJzW2FyW2ldWzFdXTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChiICYmIGIyKSB7IC8vaW4gY2FzZSBvbmUgb2YgdGhlIHByb3BlcnRpZXMgZ290IG92ZXJ3cml0dGVuLlxuXHRcdFx0XHRcdFx0XHRcdFx0YiA9IGJbY3VySW5kZXhdO1xuXHRcdFx0XHRcdFx0XHRcdFx0YjIgPSBiMltjdXJJbmRleF07XG5cblx0XHRcdFx0XHRcdFx0XHRcdHgxID0gYi5hICsgKGIuYiAtIGIuYSkgKiB0O1xuXHRcdFx0XHRcdFx0XHRcdFx0eDIgPSBiLmIgKyAoYi5jIC0gYi5iKSAqIHQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR4MSArPSAoeDIgLSB4MSkgKiB0O1xuXHRcdFx0XHRcdFx0XHRcdFx0eDIgKz0gKChiLmMgKyAoYi5kIC0gYi5jKSAqIHQpIC0geDIpICogdDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0eTEgPSBiMi5hICsgKGIyLmIgLSBiMi5hKSAqIHQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR5MiA9IGIyLmIgKyAoYjIuYyAtIGIyLmIpICogdDtcblx0XHRcdFx0XHRcdFx0XHRcdHkxICs9ICh5MiAtIHkxKSAqIHQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR5MiArPSAoKGIyLmMgKyAoYjIuZCAtIGIyLmMpICogdCkgLSB5MikgKiB0O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWwgPSBub3RTdGFydCA/IE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSkgKiBjb252ICsgYWRkIDogdGhpcy5faW5pdGlhbFJvdGF0aW9uc1tpXTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX21vZFtwXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YWwgPSB0aGlzLl9tb2RbcF0odmFsLCB0YXJnZXQpOyAvL2ZvciBtb2RQcm9wc1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZnVuY1twXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YXJnZXRbcF0odmFsKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhcmdldFtwXSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHR9KSxcblx0XHRcdHAgPSBCZXppZXJQbHVnaW4ucHJvdG90eXBlO1xuXG5cblx0XHRCZXppZXJQbHVnaW4uYmV6aWVyVGhyb3VnaCA9IGJlemllclRocm91Z2g7XG5cdFx0QmV6aWVyUGx1Z2luLmN1YmljVG9RdWFkcmF0aWMgPSBjdWJpY1RvUXVhZHJhdGljO1xuXHRcdEJlemllclBsdWdpbi5fYXV0b0NTUyA9IHRydWU7IC8vaW5kaWNhdGVzIHRoYXQgdGhpcyBwbHVnaW4gY2FuIGJlIGluc2VydGVkIGludG8gdGhlIFwiY3NzXCIgb2JqZWN0IHVzaW5nIHRoZSBhdXRvQ1NTIGZlYXR1cmUgb2YgVHdlZW5MaXRlXG5cdFx0QmV6aWVyUGx1Z2luLnF1YWRyYXRpY1RvQ3ViaWMgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFNlZ21lbnQoYSwgKDIgKiBiICsgYSkgLyAzLCAoMiAqIGIgKyBjKSAvIDMsIGMpO1xuXHRcdH07XG5cblx0XHRCZXppZXJQbHVnaW4uX2Nzc1JlZ2lzdGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgQ1NTUGx1Z2luID0gX2dsb2JhbHMuQ1NTUGx1Z2luO1xuXHRcdFx0aWYgKCFDU1NQbHVnaW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dmFyIF9pbnRlcm5hbHMgPSBDU1NQbHVnaW4uX2ludGVybmFscyxcblx0XHRcdFx0X3BhcnNlVG9Qcm94eSA9IF9pbnRlcm5hbHMuX3BhcnNlVG9Qcm94eSxcblx0XHRcdFx0X3NldFBsdWdpblJhdGlvID0gX2ludGVybmFscy5fc2V0UGx1Z2luUmF0aW8sXG5cdFx0XHRcdENTU1Byb3BUd2VlbiA9IF9pbnRlcm5hbHMuQ1NTUHJvcFR3ZWVuO1xuXHRcdFx0X2ludGVybmFscy5fcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJiZXppZXJcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwcm9wLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHRcdGlmIChlIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdFx0XHRlID0ge3ZhbHVlczplfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwbHVnaW4gPSBuZXcgQmV6aWVyUGx1Z2luKCk7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBlLnZhbHVlcyxcblx0XHRcdFx0XHRsID0gdmFsdWVzLmxlbmd0aCAtIDEsXG5cdFx0XHRcdFx0cGx1Z2luVmFsdWVzID0gW10sXG5cdFx0XHRcdFx0diA9IHt9LFxuXHRcdFx0XHRcdGksIHAsIGRhdGE7XG5cdFx0XHRcdGlmIChsIDwgMCkge1xuXHRcdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IGw7IGkrKykge1xuXHRcdFx0XHRcdGRhdGEgPSBfcGFyc2VUb1Byb3h5KHQsIHZhbHVlc1tpXSwgY3NzcCwgcHQsIHBsdWdpbiwgKGwgIT09IGkpKTtcblx0XHRcdFx0XHRwbHVnaW5WYWx1ZXNbaV0gPSBkYXRhLmVuZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKHAgaW4gZSkge1xuXHRcdFx0XHRcdHZbcF0gPSBlW3BdOyAvL2R1cGxpY2F0ZSB0aGUgdmFycyBvYmplY3QgYmVjYXVzZSB3ZSBuZWVkIHRvIGFsdGVyIHNvbWUgdGhpbmdzIHdoaWNoIHdvdWxkIGNhdXNlIHByb2JsZW1zIGlmIHRoZSB1c2VyIHBsYW5zIHRvIHJldXNlIHRoZSBzYW1lIHZhcnMgb2JqZWN0IGZvciBhbm90aGVyIHR3ZWVuLlxuXHRcdFx0XHR9XG5cdFx0XHRcdHYudmFsdWVzID0gcGx1Z2luVmFsdWVzO1xuXHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4odCwgXCJiZXppZXJcIiwgMCwgMCwgZGF0YS5wdCwgMik7XG5cdFx0XHRcdHB0LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdHB0LnNldFJhdGlvID0gX3NldFBsdWdpblJhdGlvO1xuXHRcdFx0XHRpZiAodi5hdXRvUm90YXRlID09PSAwKSB7XG5cdFx0XHRcdFx0di5hdXRvUm90YXRlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodi5hdXRvUm90YXRlICYmICEodi5hdXRvUm90YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRcdFx0aSA9ICh2LmF1dG9Sb3RhdGUgPT09IHRydWUpID8gMCA6IE51bWJlcih2LmF1dG9Sb3RhdGUpO1xuXHRcdFx0XHRcdHYuYXV0b1JvdGF0ZSA9IChkYXRhLmVuZC5sZWZ0ICE9IG51bGwpID8gW1tcImxlZnRcIixcInRvcFwiLFwicm90YXRpb25cIixpLGZhbHNlXV0gOiAoZGF0YS5lbmQueCAhPSBudWxsKSA/IFtbXCJ4XCIsXCJ5XCIsXCJyb3RhdGlvblwiLGksZmFsc2VdXSA6IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2LmF1dG9Sb3RhdGUpIHtcblx0XHRcdFx0XHRpZiAoIWNzc3AuX3RyYW5zZm9ybSkge1xuXHRcdFx0XHRcdFx0Y3NzcC5fZW5hYmxlVHJhbnNmb3JtcyhmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGEuYXV0b1JvdGF0ZSA9IGNzc3AuX3RhcmdldC5fZ3NUcmFuc2Zvcm07XG5cdFx0XHRcdFx0ZGF0YS5wcm94eS5yb3RhdGlvbiA9IGRhdGEuYXV0b1JvdGF0ZS5yb3RhdGlvbiB8fCAwO1xuXHRcdFx0XHRcdGNzc3AuX292ZXJ3cml0ZVByb3BzLnB1c2goXCJyb3RhdGlvblwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwbHVnaW4uX29uSW5pdFR3ZWVuKGRhdGEucHJveHksIHYsIGNzc3AuX3R3ZWVuKTtcblx0XHRcdFx0cmV0dXJuIHB0O1xuXHRcdFx0fX0pO1xuXHRcdH07XG5cblx0XHRwLl9tb2QgPSBmdW5jdGlvbihsb29rdXApIHtcblx0XHRcdHZhciBvcCA9IHRoaXMuX292ZXJ3cml0ZVByb3BzLFxuXHRcdFx0XHRpID0gb3AubGVuZ3RoLFxuXHRcdFx0XHR2YWw7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0dmFsID0gbG9va3VwW29wW2ldXTtcblx0XHRcdFx0aWYgKHZhbCAmJiB0eXBlb2YodmFsKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0dGhpcy5fbW9kW29wW2ldXSA9IHZhbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24obG9va3VwKSB7XG5cdFx0XHR2YXIgYSA9IHRoaXMuX3Byb3BzLFxuXHRcdFx0XHRwLCBpO1xuXHRcdFx0Zm9yIChwIGluIHRoaXMuX2JlemllcnMpIHtcblx0XHRcdFx0aWYgKHAgaW4gbG9va3VwKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX2JlemllcnNbcF07XG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX2Z1bmNbcF07XG5cdFx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKGFbaV0gPT09IHApIHtcblx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRhID0gdGhpcy5fYXV0b1JvdGF0ZTtcblx0XHRcdGlmIChhKSB7XG5cdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKGxvb2t1cFthW2ldWzJdXSkge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3VwZXIuX2tpbGwuY2FsbCh0aGlzLCBsb29rdXApO1xuXHRcdH07XG5cblx0fSgpKTtcblxuXG5cblxuXG5cblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENTU1BsdWdpblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcInBsdWdpbnMuQ1NTUGx1Z2luXCIsIFtcInBsdWdpbnMuVHdlZW5QbHVnaW5cIixcIlR3ZWVuTGl0ZVwiXSwgZnVuY3Rpb24oVHdlZW5QbHVnaW4sIFR3ZWVuTGl0ZSkge1xuXG5cdFx0LyoqIEBjb25zdHJ1Y3RvciAqKi9cblx0XHR2YXIgQ1NTUGx1Z2luID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFR3ZWVuUGx1Z2luLmNhbGwodGhpcywgXCJjc3NcIik7XG5cdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLmxlbmd0aCA9IDA7XG5cdFx0XHRcdHRoaXMuc2V0UmF0aW8gPSBDU1NQbHVnaW4ucHJvdG90eXBlLnNldFJhdGlvOyAvL3NwZWVkIG9wdGltaXphdGlvbiAoYXZvaWQgcHJvdG90eXBlIGxvb2t1cCBvbiB0aGlzIFwiaG90XCIgbWV0aG9kKVxuXHRcdFx0fSxcblx0XHRcdF9nbG9iYWxzID0gX2dzU2NvcGUuX2dzRGVmaW5lLmdsb2JhbHMsXG5cdFx0XHRfaGFzUHJpb3JpdHksIC8vdHVybnMgdHJ1ZSB3aGVuZXZlciBhIENTU1Byb3BUd2VlbiBpbnN0YW5jZSBpcyBjcmVhdGVkIHRoYXQgaGFzIGEgcHJpb3JpdHkgb3RoZXIgdGhhbiAwLiBUaGlzIGhlbHBzIHVzIGRpc2Nlcm4gd2hldGhlciBvciBub3Qgd2Ugc2hvdWxkIHNwZW5kIHRoZSB0aW1lIG9yZ2FuaXppbmcgdGhlIGxpbmtlZCBsaXN0IG9yIG5vdCBhZnRlciBhIENTU1BsdWdpbidzIF9vbkluaXRUd2VlbigpIG1ldGhvZCBpcyBjYWxsZWQuXG5cdFx0XHRfc3VmZml4TWFwLCAvL3dlIHNldCB0aGlzIGluIF9vbkluaXRUd2VlbigpIGVhY2ggdGltZSBhcyBhIHdheSB0byBoYXZlIGEgcGVyc2lzdGVudCB2YXJpYWJsZSB3ZSBjYW4gdXNlIGluIG90aGVyIG1ldGhvZHMgbGlrZSBfcGFyc2UoKSB3aXRob3V0IGhhdmluZyB0byBwYXNzIGl0IGFyb3VuZCBhcyBhIHBhcmFtZXRlciBhbmQgd2Uga2VlcCBfcGFyc2UoKSBkZWNvdXBsZWQgZnJvbSBhIHBhcnRpY3VsYXIgQ1NTUGx1Z2luIGluc3RhbmNlXG5cdFx0XHRfY3MsIC8vY29tcHV0ZWQgc3R5bGUgKHdlIHN0b3JlIHRoaXMgaW4gYSBzaGFyZWQgdmFyaWFibGUgdG8gY29uc2VydmUgbWVtb3J5IGFuZCBtYWtlIG1pbmlmaWNhdGlvbiB0aWdodGVyXG5cdFx0XHRfb3ZlcndyaXRlUHJvcHMsIC8vYWxpYXMgdG8gdGhlIGN1cnJlbnRseSBpbnN0YW50aWF0aW5nIENTU1BsdWdpbidzIF9vdmVyd3JpdGVQcm9wcyBhcnJheS4gV2UgdXNlIHRoaXMgY2xvc3VyZSBpbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gcGFzcyBhIHJlZmVyZW5jZSBhcm91bmQgZnJvbSBtZXRob2QgdG8gbWV0aG9kIGFuZCBhaWQgaW4gbWluaWZpY2F0aW9uLlxuXHRcdFx0X3NwZWNpYWxQcm9wcyA9IHt9LFxuXHRcdFx0cCA9IENTU1BsdWdpbi5wcm90b3R5cGUgPSBuZXcgVHdlZW5QbHVnaW4oXCJjc3NcIik7XG5cblx0XHRwLmNvbnN0cnVjdG9yID0gQ1NTUGx1Z2luO1xuXHRcdENTU1BsdWdpbi52ZXJzaW9uID0gXCIxLjE5LjBcIjtcblx0XHRDU1NQbHVnaW4uQVBJID0gMjtcblx0XHRDU1NQbHVnaW4uZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlID0gMDtcblx0XHRDU1NQbHVnaW4uZGVmYXVsdFNrZXdUeXBlID0gXCJjb21wZW5zYXRlZFwiO1xuXHRcdENTU1BsdWdpbi5kZWZhdWx0U21vb3RoT3JpZ2luID0gdHJ1ZTtcblx0XHRwID0gXCJweFwiOyAvL3dlJ2xsIHJldXNlIHRoZSBcInBcIiB2YXJpYWJsZSB0byBrZWVwIGZpbGUgc2l6ZSBkb3duXG5cdFx0Q1NTUGx1Z2luLnN1ZmZpeE1hcCA9IHt0b3A6cCwgcmlnaHQ6cCwgYm90dG9tOnAsIGxlZnQ6cCwgd2lkdGg6cCwgaGVpZ2h0OnAsIGZvbnRTaXplOnAsIHBhZGRpbmc6cCwgbWFyZ2luOnAsIHBlcnNwZWN0aXZlOnAsIGxpbmVIZWlnaHQ6XCJcIn07XG5cblxuXHRcdHZhciBfbnVtRXhwID0gLyg/OlxcLXxcXC58XFxiKShcXGR8XFwufGVcXC0pKy9nLFxuXHRcdFx0X3JlbE51bUV4cCA9IC8oPzpcXGR8XFwtXFxkfFxcLlxcZHxcXC1cXC5cXGR8XFwrPVxcZHxcXC09XFxkfFxcKz0uXFxkfFxcLT1cXC5cXGQpKy9nLFxuXHRcdFx0X3ZhbHVlc0V4cCA9IC8oPzpcXCs9fFxcLT18XFwtfFxcYilbXFxkXFwtXFwuXStbYS16QS1aMC05XSooPzolfFxcYikvZ2ksIC8vZmluZHMgYWxsIHRoZSB2YWx1ZXMgdGhhdCBiZWdpbiB3aXRoIG51bWJlcnMgb3IgKz0gb3IgLT0gYW5kIHRoZW4gYSBudW1iZXIuIEluY2x1ZGVzIHN1ZmZpeGVzLiBXZSB1c2UgdGhpcyB0byBzcGxpdCBjb21wbGV4IHZhbHVlcyBhcGFydCBsaWtlIFwiMXB4IDVweCAyMHB4IHJnYigyNTUsMTAyLDUxKVwiXG5cdFx0XHRfTmFORXhwID0gLyg/IVsrLV0/XFxkKlxcLj9cXGQrfFsrLV18ZVsrLV1cXGQrKVteMC05XS9nLCAvL2Fsc28gYWxsb3dzIHNjaWVudGlmaWMgbm90YXRpb24gYW5kIGRvZXNuJ3Qga2lsbCB0aGUgbGVhZGluZyAtLysgaW4gLT0gYW5kICs9XG5cdFx0XHRfc3VmZml4RXhwID0gLyg/OlxcZHxcXC18XFwrfD18I3xcXC4pKi9nLFxuXHRcdFx0X29wYWNpdHlFeHAgPSAvb3BhY2l0eSAqPSAqKFteKV0qKS9pLFxuXHRcdFx0X29wYWNpdHlWYWxFeHAgPSAvb3BhY2l0eTooW147XSopL2ksXG5cdFx0XHRfYWxwaGFGaWx0ZXJFeHAgPSAvYWxwaGFcXChvcGFjaXR5ICo9Lis/XFwpL2ksXG5cdFx0XHRfcmdiaHNsRXhwID0gL14ocmdifGhzbCkvLFxuXHRcdFx0X2NhcHNFeHAgPSAvKFtBLVpdKS9nLFxuXHRcdFx0X2NhbWVsRXhwID0gLy0oW2Etel0pL2dpLFxuXHRcdFx0X3VybEV4cCA9IC8oXig/OnVybFxcKFxcXCJ8dXJsXFwoKSl8KD86KFxcXCJcXCkpJHxcXCkkKS9naSwgLy9mb3IgcHVsbGluZyBvdXQgdXJscyBmcm9tIHVybCguLi4pIG9yIHVybChcIi4uLlwiKSBzdHJpbmdzIChzb21lIGJyb3dzZXJzIHdyYXAgdXJscyBpbiBxdW90ZXMsIHNvbWUgZG9uJ3Qgd2hlbiByZXBvcnRpbmcgdGhpbmdzIGxpa2UgYmFja2dyb3VuZEltYWdlKVxuXHRcdFx0X2NhbWVsRnVuYyA9IGZ1bmN0aW9uKHMsIGcpIHsgcmV0dXJuIGcudG9VcHBlckNhc2UoKTsgfSxcblx0XHRcdF9ob3JpekV4cCA9IC8oPzpMZWZ0fFJpZ2h0fFdpZHRoKS9pLFxuXHRcdFx0X2llR2V0TWF0cml4RXhwID0gLyhNMTF8TTEyfE0yMXxNMjIpPVtcXGRcXC1cXC5lXSsvZ2ksXG5cdFx0XHRfaWVTZXRNYXRyaXhFeHAgPSAvcHJvZ2lkXFw6RFhJbWFnZVRyYW5zZm9ybVxcLk1pY3Jvc29mdFxcLk1hdHJpeFxcKC4rP1xcKS9pLFxuXHRcdFx0X2NvbW1hc091dHNpZGVQYXJlbkV4cCA9IC8sKD89W15cXCldKig/OlxcKHwkKSkvZ2ksIC8vZmluZHMgYW55IGNvbW1hcyB0aGF0IGFyZSBub3Qgd2l0aGluIHBhcmVudGhlc2lzXG5cdFx0XHRfY29tcGxleEV4cCA9IC9bXFxzLFxcKF0vaSwgLy9mb3IgdGVzdGluZyBhIHN0cmluZyB0byBmaW5kIGlmIGl0IGhhcyBhIHNwYWNlLCBjb21tYSwgb3Igb3BlbiBwYXJlbnRoZXNpcyAoY2x1ZXMgdGhhdCBpdCdzIGEgY29tcGxleCB2YWx1ZSlcblx0XHRcdF9ERUcyUkFEID0gTWF0aC5QSSAvIDE4MCxcblx0XHRcdF9SQUQyREVHID0gMTgwIC8gTWF0aC5QSSxcblx0XHRcdF9mb3JjZVBUID0ge30sXG5cdFx0XHRfZG9jID0gZG9jdW1lbnQsXG5cdFx0XHRfY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdFx0cmV0dXJuIF9kb2MuY3JlYXRlRWxlbWVudE5TID8gX2RvYy5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsIHR5cGUpIDogX2RvYy5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXHRcdFx0fSxcblx0XHRcdF90ZW1wRGl2ID0gX2NyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRfdGVtcEltZyA9IF9jcmVhdGVFbGVtZW50KFwiaW1nXCIpLFxuXHRcdFx0X2ludGVybmFscyA9IENTU1BsdWdpbi5faW50ZXJuYWxzID0ge19zcGVjaWFsUHJvcHM6X3NwZWNpYWxQcm9wc30sIC8vcHJvdmlkZXMgYSBob29rIHRvIGEgZmV3IGludGVybmFsIG1ldGhvZHMgdGhhdCB3ZSBuZWVkIHRvIGFjY2VzcyBmcm9tIGluc2lkZSBvdGhlciBwbHVnaW5zXG5cdFx0XHRfYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LFxuXHRcdFx0X2F1dG9Sb3VuZCxcblx0XHRcdF9yZXFTYWZhcmlGaXgsIC8vd2Ugd29uJ3QgYXBwbHkgdGhlIFNhZmFyaSB0cmFuc2Zvcm0gZml4IHVudGlsIHdlIGFjdHVhbGx5IGNvbWUgYWNyb3NzIGEgdHdlZW4gdGhhdCBhZmZlY3RzIGEgdHJhbnNmb3JtIHByb3BlcnR5ICh0byBtYWludGFpbiBiZXN0IHBlcmZvcm1hbmNlKS5cblxuXHRcdFx0X2lzU2FmYXJpLFxuXHRcdFx0X2lzRmlyZWZveCwgLy9GaXJlZm94IGhhcyBhIGJ1ZyB0aGF0IGNhdXNlcyAzRCB0cmFuc2Zvcm1lZCBlbGVtZW50cyB0byByYW5kb21seSBkaXNhcHBlYXIgdW5sZXNzIGEgcmVwYWludCBpcyBmb3JjZWQgYWZ0ZXIgZWFjaCB1cGRhdGUgb24gZWFjaCBlbGVtZW50LlxuXHRcdFx0X2lzU2FmYXJpTFQ2LCAvL1NhZmFyaSAoYW5kIEFuZHJvaWQgNCB3aGljaCB1c2VzIGEgZmxhdm9yIG9mIFNhZmFyaSkgaGFzIGEgYnVnIHRoYXQgcHJldmVudHMgY2hhbmdlcyB0byBcInRvcFwiIGFuZCBcImxlZnRcIiBwcm9wZXJ0aWVzIGZyb20gcmVuZGVyaW5nIHByb3Blcmx5IGlmIGNoYW5nZWQgb24gdGhlIHNhbWUgZnJhbWUgYXMgYSB0cmFuc2Zvcm0gVU5MRVNTIHdlIHNldCB0aGUgZWxlbWVudCdzIFdlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eSB0byBoaWRkZW4gKHdlaXJkLCBJIGtub3cpLiBEb2luZyB0aGlzIGZvciBBbmRyb2lkIDMgYW5kIGVhcmxpZXIgc2VlbXMgdG8gYWN0dWFsbHkgY2F1c2Ugb3RoZXIgcHJvYmxlbXMsIHRob3VnaCAoZnVuISlcblx0XHRcdF9pZVZlcnMsXG5cdFx0XHRfc3VwcG9ydHNPcGFjaXR5ID0gKGZ1bmN0aW9uKCkgeyAvL3dlIHNldCBfaXNTYWZhcmksIF9pZVZlcnMsIF9pc0ZpcmVmb3gsIGFuZCBfc3VwcG9ydHNPcGFjaXR5IGFsbCBpbiBvbmUgZnVuY3Rpb24gaGVyZSB0byByZWR1Y2UgZmlsZSBzaXplIHNsaWdodGx5LCBlc3BlY2lhbGx5IGluIHRoZSBtaW5pZmllZCB2ZXJzaW9uLlxuXHRcdFx0XHR2YXIgaSA9IF9hZ2VudC5pbmRleE9mKFwiQW5kcm9pZFwiKSxcblx0XHRcdFx0XHRhID0gX2NyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRcdFx0XHRfaXNTYWZhcmkgPSAoX2FnZW50LmluZGV4T2YoXCJTYWZhcmlcIikgIT09IC0xICYmIF9hZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpID09PSAtMSAmJiAoaSA9PT0gLTEgfHwgTnVtYmVyKF9hZ2VudC5zdWJzdHIoaSs4LCAxKSkgPiAzKSk7XG5cdFx0XHRcdF9pc1NhZmFyaUxUNiA9IChfaXNTYWZhcmkgJiYgKE51bWJlcihfYWdlbnQuc3Vic3RyKF9hZ2VudC5pbmRleE9mKFwiVmVyc2lvbi9cIikrOCwgMSkpIDwgNikpO1xuXHRcdFx0XHRfaXNGaXJlZm94ID0gKF9hZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSAhPT0gLTEpO1xuXHRcdFx0XHRpZiAoKC9NU0lFIChbMC05XXsxLH1bXFwuMC05XXswLH0pLykuZXhlYyhfYWdlbnQpIHx8ICgvVHJpZGVudFxcLy4qcnY6KFswLTldezEsfVtcXC4wLTldezAsfSkvKS5leGVjKF9hZ2VudCkpIHtcblx0XHRcdFx0XHRfaWVWZXJzID0gcGFyc2VGbG9hdCggUmVnRXhwLiQxICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuc3R5bGUuY3NzVGV4dCA9IFwidG9wOjFweDtvcGFjaXR5Oi41NTtcIjtcblx0XHRcdFx0cmV0dXJuIC9eMC41NS8udGVzdChhLnN0eWxlLm9wYWNpdHkpO1xuXHRcdFx0fSgpKSxcblx0XHRcdF9nZXRJRU9wYWNpdHkgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHJldHVybiAoX29wYWNpdHlFeHAudGVzdCggKCh0eXBlb2YodikgPT09IFwic3RyaW5nXCIpID8gdiA6ICh2LmN1cnJlbnRTdHlsZSA/IHYuY3VycmVudFN0eWxlLmZpbHRlciA6IHYuc3R5bGUuZmlsdGVyKSB8fCBcIlwiKSApID8gKCBwYXJzZUZsb2F0KCBSZWdFeHAuJDEgKSAvIDEwMCApIDogMSk7XG5cdFx0XHR9LFxuXHRcdFx0X2xvZyA9IGZ1bmN0aW9uKHMpIHsvL2ZvciBsb2dnaW5nIG1lc3NhZ2VzLCBidXQgaW4gYSB3YXkgdGhhdCB3b24ndCB0aHJvdyBlcnJvcnMgaW4gb2xkIHZlcnNpb25zIG9mIElFLlxuXHRcdFx0XHRpZiAod2luZG93LmNvbnNvbGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF90YXJnZXQsIC8vd2hlbiBpbml0dGluZyBhIENTU1BsdWdpbiwgd2Ugc2V0IHRoaXMgdmFyaWFibGUgc28gdGhhdCB3ZSBjYW4gYWNjZXNzIGl0IGZyb20gd2l0aGluIG1hbnkgb3RoZXIgZnVuY3Rpb25zIHdpdGhvdXQgaGF2aW5nIHRvIHBhc3MgaXQgYXJvdW5kIGFzIHBhcmFtc1xuXHRcdFx0X2luZGV4LCAvL3doZW4gaW5pdHRpbmcgYSBDU1NQbHVnaW4sIHdlIHNldCB0aGlzIHZhcmlhYmxlIHNvIHRoYXQgd2UgY2FuIGFjY2VzcyBpdCBmcm9tIHdpdGhpbiBtYW55IG90aGVyIGZ1bmN0aW9ucyB3aXRob3V0IGhhdmluZyB0byBwYXNzIGl0IGFyb3VuZCBhcyBwYXJhbXNcblxuXHRcdFx0X3ByZWZpeENTUyA9IFwiXCIsIC8vdGhlIG5vbi1jYW1lbENhc2UgdmVuZG9yIHByZWZpeCBsaWtlIFwiLW8tXCIsIFwiLW1vei1cIiwgXCItbXMtXCIsIG9yIFwiLXdlYmtpdC1cIlxuXHRcdFx0X3ByZWZpeCA9IFwiXCIsIC8vY2FtZWxDYXNlIHZlbmRvciBwcmVmaXggbGlrZSBcIk9cIiwgXCJtc1wiLCBcIldlYmtpdFwiLCBvciBcIk1velwiLlxuXG5cdFx0XHQvLyBAcHJpdmF0ZSBmZWVkIGluIGEgY2FtZWxDYXNlIHByb3BlcnR5IG5hbWUgbGlrZSBcInRyYW5zZm9ybVwiIGFuZCBpdCB3aWxsIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyB2YWxpZCBhcy1pcyBvciBpZiBpdCBuZWVkcyBhIHZlbmRvciBwcmVmaXguIEl0IHJldHVybnMgdGhlIGNvcnJlY3RlZCBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSAoaS5lLiBcIldlYmtpdFRyYW5zZm9ybVwiIG9yIFwiTW96VHJhbnNmb3JtXCIgb3IgXCJ0cmFuc2Zvcm1cIiBvciBudWxsIGlmIG5vIHN1Y2ggcHJvcGVydHkgaXMgZm91bmQsIGxpa2UgaWYgdGhlIGJyb3dzZXIgaXMgSUU4IG9yIGJlZm9yZSwgXCJ0cmFuc2Zvcm1cIiB3b24ndCBiZSBmb3VuZCBhdCBhbGwpXG5cdFx0XHRfY2hlY2tQcm9wUHJlZml4ID0gZnVuY3Rpb24ocCwgZSkge1xuXHRcdFx0XHRlID0gZSB8fCBfdGVtcERpdjtcblx0XHRcdFx0dmFyIHMgPSBlLnN0eWxlLFxuXHRcdFx0XHRcdGEsIGk7XG5cdFx0XHRcdGlmIChzW3BdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwID0gcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHAuc3Vic3RyKDEpO1xuXHRcdFx0XHRhID0gW1wiT1wiLFwiTW96XCIsXCJtc1wiLFwiTXNcIixcIldlYmtpdFwiXTtcblx0XHRcdFx0aSA9IDU7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSAmJiBzW2FbaV0rcF0gPT09IHVuZGVmaW5lZCkgeyB9XG5cdFx0XHRcdGlmIChpID49IDApIHtcblx0XHRcdFx0XHRfcHJlZml4ID0gKGkgPT09IDMpID8gXCJtc1wiIDogYVtpXTtcblx0XHRcdFx0XHRfcHJlZml4Q1NTID0gXCItXCIgKyBfcHJlZml4LnRvTG93ZXJDYXNlKCkgKyBcIi1cIjtcblx0XHRcdFx0XHRyZXR1cm4gX3ByZWZpeCArIHA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9LFxuXG5cdFx0XHRfZ2V0Q29tcHV0ZWRTdHlsZSA9IF9kb2MuZGVmYXVsdFZpZXcgPyBfZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUgOiBmdW5jdGlvbigpIHt9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFJldHVybnMgdGhlIGNzcyBzdHlsZSBmb3IgYSBwYXJ0aWN1bGFyIHByb3BlcnR5IG9mIGFuIGVsZW1lbnQuIEZvciBleGFtcGxlLCB0byBnZXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnQgXCJsZWZ0XCIgY3NzIHZhbHVlIGZvciBhbiBlbGVtZW50IHdpdGggYW4gSUQgb2YgXCJteUVsZW1lbnRcIiwgeW91IGNvdWxkIGRvOlxuXHRcdFx0ICogdmFyIGN1cnJlbnRMZWZ0ID0gQ1NTUGx1Z2luLmdldFN0eWxlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15RWxlbWVudFwiKSwgXCJsZWZ0XCIpO1xuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgZWxlbWVudCB3aG9zZSBzdHlsZSBwcm9wZXJ0eSB5b3Ugd2FudCB0byBxdWVyeVxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKGxpa2UgXCJsZWZ0XCIgb3IgXCJ0b3BcIiBvciBcIm1hcmdpblRvcFwiLCBldGMuKVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBjcyBDb21wdXRlZCBzdHlsZSBvYmplY3QuIFRoaXMganVzdCBwcm92aWRlcyBhIHdheSB0byBzcGVlZCBwcm9jZXNzaW5nIGlmIHlvdSdyZSBnb2luZyB0byBnZXQgc2V2ZXJhbCBwcm9wZXJ0aWVzIG9uIHRoZSBzYW1lIGVsZW1lbnQgaW4gcXVpY2sgc3VjY2Vzc2lvbiAtIHlvdSBjYW4gcmV1c2UgdGhlIHJlc3VsdCBvZiB0aGUgZ2V0Q29tcHV0ZWRTdHlsZSgpIGNhbGwuXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBjYWxjIElmIHRydWUsIHRoZSB2YWx1ZSB3aWxsIG5vdCBiZSByZWFkIGRpcmVjdGx5IGZyb20gdGhlIGVsZW1lbnQncyBcInN0eWxlXCIgcHJvcGVydHkgKGlmIGl0IGV4aXN0cyB0aGVyZSksIGJ1dCBpbnN0ZWFkIHRoZSBnZXRDb21wdXRlZFN0eWxlKCkgcmVzdWx0IHdpbGwgYmUgdXNlZC4gVGhpcyBjYW4gYmUgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gZW5zdXJlIHRoYXQgdGhlIGJyb3dzZXIgaXRzZWxmIGlzIGludGVycHJldGluZyB0aGUgdmFsdWUuXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZz19IGRmbHQgRGVmYXVsdCB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZXR1cm5lZCBpbiB0aGUgcGxhY2Ugb2YgbnVsbCwgXCJub25lXCIsIFwiYXV0b1wiIG9yIFwiYXV0byBhdXRvXCIuXG5cdFx0XHQgKiBAcmV0dXJuIHs/c3RyaW5nfSBUaGUgY3VycmVudCBwcm9wZXJ0eSB2YWx1ZVxuXHRcdFx0ICovXG5cdFx0XHRfZ2V0U3R5bGUgPSBDU1NQbHVnaW4uZ2V0U3R5bGUgPSBmdW5jdGlvbih0LCBwLCBjcywgY2FsYywgZGZsdCkge1xuXHRcdFx0XHR2YXIgcnY7XG5cdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSkgaWYgKHAgPT09IFwib3BhY2l0eVwiKSB7IC8vc2V2ZXJhbCB2ZXJzaW9ucyBvZiBJRSBkb24ndCB1c2UgdGhlIHN0YW5kYXJkIFwib3BhY2l0eVwiIHByb3BlcnR5IC0gdGhleSB1c2UgdGhpbmdzIGxpa2UgZmlsdGVyOmFscGhhKG9wYWNpdHk9NTApLCBzbyB3ZSBwYXJzZSB0aGF0IGhlcmUuXG5cdFx0XHRcdFx0cmV0dXJuIF9nZXRJRU9wYWNpdHkodCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFjYWxjICYmIHQuc3R5bGVbcF0pIHtcblx0XHRcdFx0XHRydiA9IHQuc3R5bGVbcF07XG5cdFx0XHRcdH0gZWxzZSBpZiAoKGNzID0gY3MgfHwgX2dldENvbXB1dGVkU3R5bGUodCkpKSB7XG5cdFx0XHRcdFx0cnYgPSBjc1twXSB8fCBjcy5nZXRQcm9wZXJ0eVZhbHVlKHApIHx8IGNzLmdldFByb3BlcnR5VmFsdWUocC5yZXBsYWNlKF9jYXBzRXhwLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0LmN1cnJlbnRTdHlsZSkge1xuXHRcdFx0XHRcdHJ2ID0gdC5jdXJyZW50U3R5bGVbcF07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChkZmx0ICE9IG51bGwgJiYgKCFydiB8fCBydiA9PT0gXCJub25lXCIgfHwgcnYgPT09IFwiYXV0b1wiIHx8IHJ2ID09PSBcImF1dG8gYXV0b1wiKSkgPyBkZmx0IDogcnY7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFBhc3MgdGhlIHRhcmdldCBlbGVtZW50LCB0aGUgcHJvcGVydHkgbmFtZSwgdGhlIG51bWVyaWMgdmFsdWUsIGFuZCB0aGUgc3VmZml4IChsaWtlIFwiJVwiLCBcImVtXCIsIFwicHhcIiwgZXRjLikgYW5kIGl0IHdpbGwgc3BpdCBiYWNrIHRoZSBlcXVpdmFsZW50IHBpeGVsIG51bWJlci5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKGxpa2UgXCJsZWZ0XCIsIFwidG9wXCIsIFwibWFyZ2luTGVmdFwiLCBldGMuKVxuXHRcdFx0ICogQHBhcmFtIHshbnVtYmVyfSB2IFZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZz19IHNmeCBTdWZmaXggKGxpa2UgXCJweFwiIG9yIFwiJVwiIG9yIFwiZW1cIilcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlY3Vyc2UgSWYgdHJ1ZSwgdGhlIGNhbGwgaXMgYSByZWN1cnNpdmUgb25lLiBJbiBzb21lIGJyb3dzZXJzIChsaWtlIElFNy84KSwgb2NjYXNpb25hbGx5IHRoZSB2YWx1ZSBpc24ndCBhY2N1cmF0ZWx5IHJlcG9ydGVkIGluaXRpYWxseSwgYnV0IGlmIHdlIHJ1biB0aGUgZnVuY3Rpb24gYWdhaW4gaXQgd2lsbCB0YWtlIGVmZmVjdC5cblx0XHRcdCAqIEByZXR1cm4ge251bWJlcn0gdmFsdWUgaW4gcGl4ZWxzXG5cdFx0XHQgKi9cblx0XHRcdF9jb252ZXJ0VG9QaXhlbHMgPSBfaW50ZXJuYWxzLmNvbnZlcnRUb1BpeGVscyA9IGZ1bmN0aW9uKHQsIHAsIHYsIHNmeCwgcmVjdXJzZSkge1xuXHRcdFx0XHRpZiAoc2Z4ID09PSBcInB4XCIgfHwgIXNmeCkgeyByZXR1cm4gdjsgfVxuXHRcdFx0XHRpZiAoc2Z4ID09PSBcImF1dG9cIiB8fCAhdikgeyByZXR1cm4gMDsgfVxuXHRcdFx0XHR2YXIgaG9yaXogPSBfaG9yaXpFeHAudGVzdChwKSxcblx0XHRcdFx0XHRub2RlID0gdCxcblx0XHRcdFx0XHRzdHlsZSA9IF90ZW1wRGl2LnN0eWxlLFxuXHRcdFx0XHRcdG5lZyA9ICh2IDwgMCksXG5cdFx0XHRcdFx0cHJlY2lzZSA9ICh2ID09PSAxKSxcblx0XHRcdFx0XHRwaXgsIGNhY2hlLCB0aW1lO1xuXHRcdFx0XHRpZiAobmVnKSB7XG5cdFx0XHRcdFx0diA9IC12O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwcmVjaXNlKSB7XG5cdFx0XHRcdFx0diAqPSAxMDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHNmeCA9PT0gXCIlXCIgJiYgcC5pbmRleE9mKFwiYm9yZGVyXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdHBpeCA9ICh2IC8gMTAwKSAqIChob3JpeiA/IHQuY2xpZW50V2lkdGggOiB0LmNsaWVudEhlaWdodCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3R5bGUuY3NzVGV4dCA9IFwiYm9yZGVyOjAgc29saWQgcmVkO3Bvc2l0aW9uOlwiICsgX2dldFN0eWxlKHQsIFwicG9zaXRpb25cIikgKyBcIjtsaW5lLWhlaWdodDowO1wiO1xuXHRcdFx0XHRcdGlmIChzZnggPT09IFwiJVwiIHx8ICFub2RlLmFwcGVuZENoaWxkIHx8IHNmeC5jaGFyQXQoMCkgPT09IFwidlwiIHx8IHNmeCA9PT0gXCJyZW1cIikge1xuXHRcdFx0XHRcdFx0bm9kZSA9IHQucGFyZW50Tm9kZSB8fCBfZG9jLmJvZHk7XG5cdFx0XHRcdFx0XHRjYWNoZSA9IG5vZGUuX2dzQ2FjaGU7XG5cdFx0XHRcdFx0XHR0aW1lID0gVHdlZW5MaXRlLnRpY2tlci5mcmFtZTtcblx0XHRcdFx0XHRcdGlmIChjYWNoZSAmJiBob3JpeiAmJiBjYWNoZS50aW1lID09PSB0aW1lKSB7IC8vcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uOiB3ZSByZWNvcmQgdGhlIHdpZHRoIG9mIGVsZW1lbnRzIGFsb25nIHdpdGggdGhlIHRpY2tlciBmcmFtZSBzbyB0aGF0IHdlIGNhbiBxdWlja2x5IGdldCBpdCBhZ2FpbiBvbiB0aGUgc2FtZSB0aWNrIChzZWVtcyByZWxhdGl2ZWx5IHNhZmUgdG8gYXNzdW1lIGl0IHdvdWxkbid0IGNoYW5nZSBvbiB0aGUgc2FtZSB0aWNrKVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FjaGUud2lkdGggKiB2IC8gMTAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c3R5bGVbKGhvcml6ID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIildID0gdiArIHNmeDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGVbKGhvcml6ID8gXCJib3JkZXJMZWZ0V2lkdGhcIiA6IFwiYm9yZGVyVG9wV2lkdGhcIildID0gdiArIHNmeDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9kZS5hcHBlbmRDaGlsZChfdGVtcERpdik7XG5cdFx0XHRcdFx0cGl4ID0gcGFyc2VGbG9hdChfdGVtcERpdlsoaG9yaXogPyBcIm9mZnNldFdpZHRoXCIgOiBcIm9mZnNldEhlaWdodFwiKV0pO1xuXHRcdFx0XHRcdG5vZGUucmVtb3ZlQ2hpbGQoX3RlbXBEaXYpO1xuXHRcdFx0XHRcdGlmIChob3JpeiAmJiBzZnggPT09IFwiJVwiICYmIENTU1BsdWdpbi5jYWNoZVdpZHRocyAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdGNhY2hlID0gbm9kZS5fZ3NDYWNoZSA9IG5vZGUuX2dzQ2FjaGUgfHwge307XG5cdFx0XHRcdFx0XHRjYWNoZS50aW1lID0gdGltZTtcblx0XHRcdFx0XHRcdGNhY2hlLndpZHRoID0gcGl4IC8gdiAqIDEwMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBpeCA9PT0gMCAmJiAhcmVjdXJzZSkge1xuXHRcdFx0XHRcdFx0cGl4ID0gX2NvbnZlcnRUb1BpeGVscyh0LCBwLCB2LCBzZngsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJlY2lzZSkge1xuXHRcdFx0XHRcdHBpeCAvPSAxMDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5lZyA/IC1waXggOiBwaXg7XG5cdFx0XHR9LFxuXHRcdFx0X2NhbGN1bGF0ZU9mZnNldCA9IF9pbnRlcm5hbHMuY2FsY3VsYXRlT2Zmc2V0ID0gZnVuY3Rpb24odCwgcCwgY3MpIHsgLy9mb3IgZmlndXJpbmcgb3V0IFwidG9wXCIgb3IgXCJsZWZ0XCIgaW4gcHggd2hlbiBpdCdzIFwiYXV0b1wiLiBXZSBuZWVkIHRvIGZhY3RvciBpbiBtYXJnaW4gd2l0aCB0aGUgb2Zmc2V0TGVmdC9vZmZzZXRUb3Bcblx0XHRcdFx0aWYgKF9nZXRTdHlsZSh0LCBcInBvc2l0aW9uXCIsIGNzKSAhPT0gXCJhYnNvbHV0ZVwiKSB7IHJldHVybiAwOyB9XG5cdFx0XHRcdHZhciBkaW0gPSAoKHAgPT09IFwibGVmdFwiKSA/IFwiTGVmdFwiIDogXCJUb3BcIiksXG5cdFx0XHRcdFx0diA9IF9nZXRTdHlsZSh0LCBcIm1hcmdpblwiICsgZGltLCBjcyk7XG5cdFx0XHRcdHJldHVybiB0W1wib2Zmc2V0XCIgKyBkaW1dIC0gKF9jb252ZXJ0VG9QaXhlbHModCwgcCwgcGFyc2VGbG9hdCh2KSwgdi5yZXBsYWNlKF9zdWZmaXhFeHAsIFwiXCIpKSB8fCAwKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vIEBwcml2YXRlIHJldHVybnMgYXQgb2JqZWN0IGNvbnRhaW5pbmcgQUxMIG9mIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIGluIGNhbWVsQ2FzZSBhbmQgdGhlaXIgYXNzb2NpYXRlZCB2YWx1ZXMuXG5cdFx0XHRfZ2V0QWxsU3R5bGVzID0gZnVuY3Rpb24odCwgY3MpIHtcblx0XHRcdFx0dmFyIHMgPSB7fSxcblx0XHRcdFx0XHRpLCB0ciwgcDtcblx0XHRcdFx0aWYgKChjcyA9IGNzIHx8IF9nZXRDb21wdXRlZFN0eWxlKHQsIG51bGwpKSkge1xuXHRcdFx0XHRcdGlmICgoaSA9IGNzLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRwID0gY3NbaV07XG5cdFx0XHRcdFx0XHRcdGlmIChwLmluZGV4T2YoXCItdHJhbnNmb3JtXCIpID09PSAtMSB8fCBfdHJhbnNmb3JtUHJvcENTUyA9PT0gcCkgeyAvL1NvbWUgd2Via2l0IGJyb3dzZXJzIGR1cGxpY2F0ZSB0cmFuc2Zvcm0gdmFsdWVzLCBvbmUgbm9uLXByZWZpeGVkIGFuZCBvbmUgcHJlZml4ZWQgKFwidHJhbnNmb3JtXCIgYW5kIFwiV2Via2l0VHJhbnNmb3JtXCIpLCBzbyB3ZSBtdXN0IHdlZWQgb3V0IHRoZSBleHRyYSBvbmUgaGVyZS5cblx0XHRcdFx0XHRcdFx0XHRzW3AucmVwbGFjZShfY2FtZWxFeHAsIF9jYW1lbEZ1bmMpXSA9IGNzLmdldFByb3BlcnR5VmFsdWUocCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgeyAvL3NvbWUgYnJvd3NlcnMgYmVoYXZlIGRpZmZlcmVudGx5IC0gY3MubGVuZ3RoIGlzIGFsd2F5cyAwLCBzbyB3ZSBtdXN0IGRvIGEgZm9yLi4uaW4gbG9vcC5cblx0XHRcdFx0XHRcdGZvciAoaSBpbiBjcykge1xuXHRcdFx0XHRcdFx0XHRpZiAoaS5pbmRleE9mKFwiVHJhbnNmb3JtXCIpID09PSAtMSB8fCBfdHJhbnNmb3JtUHJvcCA9PT0gaSkgeyAvL1NvbWUgd2Via2l0IGJyb3dzZXJzIGR1cGxpY2F0ZSB0cmFuc2Zvcm0gdmFsdWVzLCBvbmUgbm9uLXByZWZpeGVkIGFuZCBvbmUgcHJlZml4ZWQgKFwidHJhbnNmb3JtXCIgYW5kIFwiV2Via2l0VHJhbnNmb3JtXCIpLCBzbyB3ZSBtdXN0IHdlZWQgb3V0IHRoZSBleHRyYSBvbmUgaGVyZS5cblx0XHRcdFx0XHRcdFx0XHRzW2ldID0gY3NbaV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoKGNzID0gdC5jdXJyZW50U3R5bGUgfHwgdC5zdHlsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGkgaW4gY3MpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YoaSkgPT09IFwic3RyaW5nXCIgJiYgc1tpXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHNbaS5yZXBsYWNlKF9jYW1lbEV4cCwgX2NhbWVsRnVuYyldID0gY3NbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSkge1xuXHRcdFx0XHRcdHMub3BhY2l0eSA9IF9nZXRJRU9wYWNpdHkodCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHIgPSBfZ2V0VHJhbnNmb3JtKHQsIGNzLCBmYWxzZSk7XG5cdFx0XHRcdHMucm90YXRpb24gPSB0ci5yb3RhdGlvbjtcblx0XHRcdFx0cy5za2V3WCA9IHRyLnNrZXdYO1xuXHRcdFx0XHRzLnNjYWxlWCA9IHRyLnNjYWxlWDtcblx0XHRcdFx0cy5zY2FsZVkgPSB0ci5zY2FsZVk7XG5cdFx0XHRcdHMueCA9IHRyLng7XG5cdFx0XHRcdHMueSA9IHRyLnk7XG5cdFx0XHRcdGlmIChfc3VwcG9ydHMzRCkge1xuXHRcdFx0XHRcdHMueiA9IHRyLno7XG5cdFx0XHRcdFx0cy5yb3RhdGlvblggPSB0ci5yb3RhdGlvblg7XG5cdFx0XHRcdFx0cy5yb3RhdGlvblkgPSB0ci5yb3RhdGlvblk7XG5cdFx0XHRcdFx0cy5zY2FsZVogPSB0ci5zY2FsZVo7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHMuZmlsdGVycykge1xuXHRcdFx0XHRcdGRlbGV0ZSBzLmZpbHRlcnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHM7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBAcHJpdmF0ZSBhbmFseXplcyB0d28gc3R5bGUgb2JqZWN0cyAoYXMgcmV0dXJuZWQgYnkgX2dldEFsbFN0eWxlcygpKSBhbmQgb25seSBsb29rcyBmb3IgZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGVtIHRoYXQgY29udGFpbiB0d2VlbmFibGUgdmFsdWVzIChsaWtlIGEgbnVtYmVyIG9yIGNvbG9yKS4gSXQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIFwiZGlmc1wiIHByb3BlcnR5IHdoaWNoIHJlZmVycyB0byBhbiBvYmplY3QgY29udGFpbmluZyBvbmx5IHRob3NlIGlzb2xhdGVkIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBmb3IgdHdlZW5pbmcsIGFuZCBhIFwiZmlyc3RNUFRcIiBwcm9wZXJ0eSB3aGljaCByZWZlcnMgdG8gdGhlIGZpcnN0IE1pbmlQcm9wVHdlZW4gaW5zdGFuY2UgaW4gYSBsaW5rZWQgbGlzdCB0aGF0IHJlY29yZGVkIGFsbCB0aGUgc3RhcnRpbmcgdmFsdWVzIG9mIHRoZSBkaWZmZXJlbnQgcHJvcGVydGllcyBzbyB0aGF0IHdlIGNhbiByZXZlcnQgdG8gdGhlbSBhdCB0aGUgZW5kIG9yIGJlZ2lubmluZyBvZiB0aGUgdHdlZW4gLSB3ZSBkb24ndCB3YW50IHRoZSBjYXNjYWRpbmcgdG8gZ2V0IG1lc3NlZCB1cC4gVGhlIGZvcmNlTG9va3VwIHBhcmFtZXRlciBpcyBhbiBvcHRpb25hbCBnZW5lcmljIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgYmUgZm9yY2VkIGludG8gdGhlIHJlc3VsdHMgLSB0aGlzIGlzIG5lY2Vzc2FyeSBmb3IgY2xhc3NOYW1lIHR3ZWVucyB0aGF0IGFyZSBvdmVyd3JpdGluZyBvdGhlcnMgYmVjYXVzZSBpbWFnaW5lIGEgc2NlbmFyaW8gd2hlcmUgYSByb2xsb3Zlci9yb2xsb3V0IGFkZHMvcmVtb3ZlcyBhIGNsYXNzIGFuZCB0aGUgdXNlciBzd2lwZXMgdGhlIG1vdXNlIG92ZXIgdGhlIHRhcmdldCBTVVBFUiBmYXN0LCB0aHVzIG5vdGhpbmcgYWN0dWFsbHkgY2hhbmdlZCB5ZXQgYW5kIHRoZSBzdWJzZXF1ZW50IGNvbXBhcmlzb24gb2YgdGhlIHByb3BlcnRpZXMgd291bGQgaW5kaWNhdGUgdGhleSBtYXRjaCAoZXNwZWNpYWxseSB3aGVuIHB4IHJvdW5kaW5nIGlzIHRha2VuIGludG8gY29uc2lkZXJhdGlvbiksIHRodXMgbm8gdHdlZW5pbmcgaXMgbmVjZXNzYXJ5IGV2ZW4gdGhvdWdoIGl0IFNIT1VMRCB0d2VlbiBhbmQgcmVtb3ZlIHRob3NlIHByb3BlcnRpZXMgYWZ0ZXIgdGhlIHR3ZWVuIChvdGhlcndpc2UgdGhlIGlubGluZSBzdHlsZXMgd2lsbCBjb250YW1pbmF0ZSB0aGluZ3MpLiBTZWUgdGhlIGNsYXNzTmFtZSBTcGVjaWFsUHJvcCBjb2RlIGZvciBkZXRhaWxzLlxuXHRcdFx0X2Nzc0RpZiA9IGZ1bmN0aW9uKHQsIHMxLCBzMiwgdmFycywgZm9yY2VMb29rdXApIHtcblx0XHRcdFx0dmFyIGRpZnMgPSB7fSxcblx0XHRcdFx0XHRzdHlsZSA9IHQuc3R5bGUsXG5cdFx0XHRcdFx0dmFsLCBwLCBtcHQ7XG5cdFx0XHRcdGZvciAocCBpbiBzMikge1xuXHRcdFx0XHRcdGlmIChwICE9PSBcImNzc1RleHRcIikgaWYgKHAgIT09IFwibGVuZ3RoXCIpIGlmIChpc05hTihwKSkgaWYgKHMxW3BdICE9PSAodmFsID0gczJbcF0pIHx8IChmb3JjZUxvb2t1cCAmJiBmb3JjZUxvb2t1cFtwXSkpIGlmIChwLmluZGV4T2YoXCJPcmlnaW5cIikgPT09IC0xKSBpZiAodHlwZW9mKHZhbCkgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mKHZhbCkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdGRpZnNbcF0gPSAodmFsID09PSBcImF1dG9cIiAmJiAocCA9PT0gXCJsZWZ0XCIgfHwgcCA9PT0gXCJ0b3BcIikpID8gX2NhbGN1bGF0ZU9mZnNldCh0LCBwKSA6ICgodmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCJhdXRvXCIgfHwgdmFsID09PSBcIm5vbmVcIikgJiYgdHlwZW9mKHMxW3BdKSA9PT0gXCJzdHJpbmdcIiAmJiBzMVtwXS5yZXBsYWNlKF9OYU5FeHAsIFwiXCIpICE9PSBcIlwiKSA/IDAgOiB2YWw7IC8vaWYgdGhlIGVuZGluZyB2YWx1ZSBpcyBkZWZhdWx0aW5nIChcIlwiIG9yIFwiYXV0b1wiKSwgd2UgY2hlY2sgdGhlIHN0YXJ0aW5nIHZhbHVlIGFuZCBpZiBpdCBjYW4gYmUgcGFyc2VkIGludG8gYSBudW1iZXIgKGEgc3RyaW5nIHdoaWNoIGNvdWxkIGhhdmUgYSBzdWZmaXggdG9vLCBsaWtlIDcwMHB4KSwgdGhlbiB3ZSBzd2FwIGluIDAgZm9yIFwiXCIgb3IgXCJhdXRvXCIgc28gdGhhdCB0aGluZ3MgYWN0dWFsbHkgdHdlZW4uXG5cdFx0XHRcdFx0XHRpZiAoc3R5bGVbcF0gIT09IHVuZGVmaW5lZCkgeyAvL2ZvciBjbGFzc05hbWUgdHdlZW5zLCB3ZSBtdXN0IHJlbWVtYmVyIHdoaWNoIHByb3BlcnRpZXMgYWxyZWFkeSBleGlzdGVkIGlubGluZSAtIHRoZSBvbmVzIHRoYXQgZGlkbid0IHNob3VsZCBiZSByZW1vdmVkIHdoZW4gdGhlIHR3ZWVuIGlzbid0IGluIHByb2dyZXNzIGJlY2F1c2UgdGhleSB3ZXJlIG9ubHkgaW50cm9kdWNlZCB0byBmYWNpbGl0YXRlIHRoZSB0cmFuc2l0aW9uIGJldHdlZW4gY2xhc3Nlcy5cblx0XHRcdFx0XHRcdFx0bXB0ID0gbmV3IE1pbmlQcm9wVHdlZW4oc3R5bGUsIHAsIHN0eWxlW3BdLCBtcHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodmFycykge1xuXHRcdFx0XHRcdGZvciAocCBpbiB2YXJzKSB7IC8vY29weSBwcm9wZXJ0aWVzIChleGNlcHQgY2xhc3NOYW1lKVxuXHRcdFx0XHRcdFx0aWYgKHAgIT09IFwiY2xhc3NOYW1lXCIpIHtcblx0XHRcdFx0XHRcdFx0ZGlmc1twXSA9IHZhcnNbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7ZGlmczpkaWZzLCBmaXJzdE1QVDptcHR9O1xuXHRcdFx0fSxcblx0XHRcdF9kaW1lbnNpb25zID0ge3dpZHRoOltcIkxlZnRcIixcIlJpZ2h0XCJdLCBoZWlnaHQ6W1wiVG9wXCIsXCJCb3R0b21cIl19LFxuXHRcdFx0X21hcmdpbnMgPSBbXCJtYXJnaW5MZWZ0XCIsXCJtYXJnaW5SaWdodFwiLFwibWFyZ2luVG9wXCIsXCJtYXJnaW5Cb3R0b21cIl0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgR2V0cyB0aGUgd2lkdGggb3IgaGVpZ2h0IG9mIGFuIGVsZW1lbnRcblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKFwid2lkdGhcIiBvciBcImhlaWdodFwiKVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBjcyBDb21wdXRlZCBzdHlsZSBvYmplY3QgKGlmIG9uZSBleGlzdHMpLiBKdXN0IGEgc3BlZWQgb3B0aW1pemF0aW9uLlxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSBEaW1lbnNpb24gKGluIHBpeGVscylcblx0XHRcdCAqL1xuXHRcdFx0X2dldERpbWVuc2lvbiA9IGZ1bmN0aW9uKHQsIHAsIGNzKSB7XG5cdFx0XHRcdGlmICgodC5ub2RlTmFtZSArIFwiXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwic3ZnXCIpIHsgLy9DaHJvbWUgbm8gbG9uZ2VyIHN1cHBvcnRzIG9mZnNldFdpZHRoL29mZnNldEhlaWdodCBvbiBTVkcgZWxlbWVudHMuXG5cdFx0XHRcdFx0cmV0dXJuIChjcyB8fCBfZ2V0Q29tcHV0ZWRTdHlsZSh0KSlbcF0gfHwgMDtcblx0XHRcdFx0fSBlbHNlIGlmICh0LmdldEJCb3ggJiYgX2lzU1ZHKHQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQuZ2V0QkJveCgpW3BdIHx8IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHYgPSBwYXJzZUZsb2F0KChwID09PSBcIndpZHRoXCIpID8gdC5vZmZzZXRXaWR0aCA6IHQub2Zmc2V0SGVpZ2h0KSxcblx0XHRcdFx0XHRhID0gX2RpbWVuc2lvbnNbcF0sXG5cdFx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHRjcyA9IGNzIHx8IF9nZXRDb21wdXRlZFN0eWxlKHQsIG51bGwpO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHR2IC09IHBhcnNlRmxvYXQoIF9nZXRTdHlsZSh0LCBcInBhZGRpbmdcIiArIGFbaV0sIGNzLCB0cnVlKSApIHx8IDA7XG5cdFx0XHRcdFx0diAtPSBwYXJzZUZsb2F0KCBfZ2V0U3R5bGUodCwgXCJib3JkZXJcIiArIGFbaV0gKyBcIldpZHRoXCIsIGNzLCB0cnVlKSApIHx8IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHY7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBAcHJpdmF0ZSBQYXJzZXMgcG9zaXRpb24tcmVsYXRlZCBjb21wbGV4IHN0cmluZ3MgbGlrZSBcInRvcCBsZWZ0XCIgb3IgXCI1MHB4IDEwcHhcIiBvciBcIjcwJSAyMCVcIiwgZXRjLiB3aGljaCBhcmUgdXNlZCBmb3IgdGhpbmdzIGxpa2UgdHJhbnNmb3JtT3JpZ2luIG9yIGJhY2tncm91bmRQb3NpdGlvbi4gT3B0aW9uYWxseSBkZWNvcmF0ZXMgYSBzdXBwbGllZCBvYmplY3QgKHJlY09iaikgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6IFwib3hcIiAob2Zmc2V0WCksIFwib3lcIiAob2Zmc2V0WSksIFwib3hwXCIgKGlmIHRydWUsIFwib3hcIiBpcyBhIHBlcmNlbnRhZ2Ugbm90IGEgcGl4ZWwgdmFsdWUpLCBhbmQgXCJveHlcIiAoaWYgdHJ1ZSwgXCJveVwiIGlzIGEgcGVyY2VudGFnZSBub3QgYSBwaXhlbCB2YWx1ZSlcblx0XHRcdF9wYXJzZVBvc2l0aW9uID0gZnVuY3Rpb24odiwgcmVjT2JqKSB7XG5cdFx0XHRcdGlmICh2ID09PSBcImNvbnRhaW5cIiB8fCB2ID09PSBcImF1dG9cIiB8fCB2ID09PSBcImF1dG8gYXV0b1wiKSB7IC8vbm90ZTogRmlyZWZveCB1c2VzIFwiYXV0byBhdXRvXCIgYXMgZGVmYXVsdCB3aGVyZWFzIENocm9tZSB1c2VzIFwiYXV0b1wiLlxuXHRcdFx0XHRcdHJldHVybiB2ICsgXCIgXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHYgPT0gbnVsbCB8fCB2ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0diA9IFwiMCAwXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGEgPSB2LnNwbGl0KFwiIFwiKSxcblx0XHRcdFx0XHR4ID0gKHYuaW5kZXhPZihcImxlZnRcIikgIT09IC0xKSA/IFwiMCVcIiA6ICh2LmluZGV4T2YoXCJyaWdodFwiKSAhPT0gLTEpID8gXCIxMDAlXCIgOiBhWzBdLFxuXHRcdFx0XHRcdHkgPSAodi5pbmRleE9mKFwidG9wXCIpICE9PSAtMSkgPyBcIjAlXCIgOiAodi5pbmRleE9mKFwiYm90dG9tXCIpICE9PSAtMSkgPyBcIjEwMCVcIiA6IGFbMV0sXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0aWYgKGEubGVuZ3RoID4gMyAmJiAhcmVjT2JqKSB7IC8vbXVsdGlwbGUgcG9zaXRpb25zXG5cdFx0XHRcdFx0YSA9IHYuc3BsaXQoXCIsIFwiKS5qb2luKFwiLFwiKS5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0diA9IFtdO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2LnB1c2goX3BhcnNlUG9zaXRpb24oYVtpXSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdi5qb2luKFwiLFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoeSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0eSA9ICh4ID09PSBcImNlbnRlclwiKSA/IFwiNTAlXCIgOiBcIjBcIjtcblx0XHRcdFx0fSBlbHNlIGlmICh5ID09PSBcImNlbnRlclwiKSB7XG5cdFx0XHRcdFx0eSA9IFwiNTAlXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHggPT09IFwiY2VudGVyXCIgfHwgKGlzTmFOKHBhcnNlRmxvYXQoeCkpICYmICh4ICsgXCJcIikuaW5kZXhPZihcIj1cIikgPT09IC0xKSkgeyAvL3JlbWVtYmVyLCB0aGUgdXNlciBjb3VsZCBmbGlwLWZsb3AgdGhlIHZhbHVlcyBhbmQgc2F5IFwiYm90dG9tIGNlbnRlclwiIG9yIFwiY2VudGVyIGJvdHRvbVwiLCBldGMuIFwiY2VudGVyXCIgaXMgYW1iaWd1b3VzIGJlY2F1c2UgaXQgY291bGQgYmUgdXNlZCB0byBkZXNjcmliZSBob3Jpem9udGFsIG9yIHZlcnRpY2FsLCBoZW5jZSB0aGUgaXNOYU4oKS4gSWYgdGhlcmUncyBhbiBcIj1cIiBzaWduIGluIHRoZSB2YWx1ZSwgaXQncyByZWxhdGl2ZS5cblx0XHRcdFx0XHR4ID0gXCI1MCVcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2ID0geCArIFwiIFwiICsgeSArICgoYS5sZW5ndGggPiAyKSA/IFwiIFwiICsgYVsyXSA6IFwiXCIpO1xuXHRcdFx0XHRpZiAocmVjT2JqKSB7XG5cdFx0XHRcdFx0cmVjT2JqLm94cCA9ICh4LmluZGV4T2YoXCIlXCIpICE9PSAtMSk7XG5cdFx0XHRcdFx0cmVjT2JqLm95cCA9ICh5LmluZGV4T2YoXCIlXCIpICE9PSAtMSk7XG5cdFx0XHRcdFx0cmVjT2JqLm94ciA9ICh4LmNoYXJBdCgxKSA9PT0gXCI9XCIpO1xuXHRcdFx0XHRcdHJlY09iai5veXIgPSAoeS5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0XHRyZWNPYmoub3ggPSBwYXJzZUZsb2F0KHgucmVwbGFjZShfTmFORXhwLCBcIlwiKSk7XG5cdFx0XHRcdFx0cmVjT2JqLm95ID0gcGFyc2VGbG9hdCh5LnJlcGxhY2UoX05hTkV4cCwgXCJcIikpO1xuXHRcdFx0XHRcdHJlY09iai52ID0gdjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVjT2JqIHx8IHY7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFRha2VzIGFuIGVuZGluZyB2YWx1ZSAodHlwaWNhbGx5IGEgc3RyaW5nLCBidXQgY2FuIGJlIGEgbnVtYmVyKSBhbmQgYSBzdGFydGluZyB2YWx1ZSBhbmQgcmV0dXJucyB0aGUgY2hhbmdlIGJldHdlZW4gdGhlIHR3bywgbG9va2luZyBmb3IgcmVsYXRpdmUgdmFsdWUgaW5kaWNhdG9ycyBsaWtlICs9IGFuZCAtPSBhbmQgaXQgYWxzbyBpZ25vcmVzIHN1ZmZpeGVzIChidXQgbWFrZSBzdXJlIHRoZSBlbmRpbmcgdmFsdWUgc3RhcnRzIHdpdGggYSBudW1iZXIgb3IgKz0vLT0gYW5kIHRoYXQgdGhlIHN0YXJ0aW5nIHZhbHVlIGlzIGEgTlVNQkVSISlcblx0XHRcdCAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSBlIEVuZCB2YWx1ZSB3aGljaCBpcyB0eXBpY2FsbHkgYSBzdHJpbmcsIGJ1dCBjb3VsZCBiZSBhIG51bWJlclxuXHRcdFx0ICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IGIgQmVnaW5uaW5nIHZhbHVlIHdoaWNoIGlzIHR5cGljYWxseSBhIHN0cmluZyBidXQgY291bGQgYmUgYSBudW1iZXJcblx0XHRcdCAqIEByZXR1cm4ge251bWJlcn0gQW1vdW50IG9mIGNoYW5nZSBiZXR3ZWVuIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgKHJlbGF0aXZlIHZhbHVlcyB0aGF0IGhhdmUgYSBcIis9XCIgb3IgXCItPVwiIGFyZSByZWNvZ25pemVkKVxuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VDaGFuZ2UgPSBmdW5jdGlvbihlLCBiKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YoZSkgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGUgPSBlKF9pbmRleCwgX3RhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICh0eXBlb2YoZSkgPT09IFwic3RyaW5nXCIgJiYgZS5jaGFyQXQoMSkgPT09IFwiPVwiKSA/IHBhcnNlSW50KGUuY2hhckF0KDApICsgXCIxXCIsIDEwKSAqIHBhcnNlRmxvYXQoZS5zdWJzdHIoMikpIDogKHBhcnNlRmxvYXQoZSkgLSBwYXJzZUZsb2F0KGIpKSB8fCAwO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBUYWtlcyBhIHZhbHVlIGFuZCBhIGRlZmF1bHQgbnVtYmVyLCBjaGVja3MgaWYgdGhlIHZhbHVlIGlzIHJlbGF0aXZlLCBudWxsLCBvciBudW1lcmljIGFuZCBzcGl0cyBiYWNrIGEgbm9ybWFsaXplZCBudW1iZXIgYWNjb3JkaW5nbHkuIFByaW1hcmlseSB1c2VkIGluIHRoZSBfcGFyc2VUcmFuc2Zvcm0oKSBmdW5jdGlvbi5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSB2IFZhbHVlIHRvIGJlIHBhcnNlZFxuXHRcdFx0ICogQHBhcmFtIHshbnVtYmVyfSBkIERlZmF1bHQgdmFsdWUgKHdoaWNoIGlzIGFsc28gdXNlZCBmb3IgcmVsYXRpdmUgY2FsY3VsYXRpb25zIGlmIFwiKz1cIiBvciBcIi09XCIgaXMgZm91bmQgaW4gdGhlIGZpcnN0IHBhcmFtZXRlcilcblx0XHRcdCAqIEByZXR1cm4ge251bWJlcn0gUGFyc2VkIHZhbHVlXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZVZhbCA9IGZ1bmN0aW9uKHYsIGQpIHtcblx0XHRcdFx0aWYgKHR5cGVvZih2KSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0diA9IHYoX2luZGV4LCBfdGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKHYgPT0gbnVsbCkgPyBkIDogKHR5cGVvZih2KSA9PT0gXCJzdHJpbmdcIiAmJiB2LmNoYXJBdCgxKSA9PT0gXCI9XCIpID8gcGFyc2VJbnQodi5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogcGFyc2VGbG9hdCh2LnN1YnN0cigyKSkgKyBkIDogcGFyc2VGbG9hdCh2KSB8fCAwO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBUcmFuc2xhdGVzIHN0cmluZ3MgbGlrZSBcIjQwZGVnXCIgb3IgXCI0MFwiIG9yIDQwcmFkXCIgb3IgXCIrPTQwZGVnXCIgb3IgXCIyNzBfc2hvcnRcIiBvciBcIi05MF9jd1wiIG9yIFwiKz00NV9jY3dcIiB0byBhIG51bWVyaWMgcmFkaWFuIGFuZ2xlLiBPZiBjb3Vyc2UgYSBzdGFydGluZy9kZWZhdWx0IHZhbHVlIG11c3QgYmUgZmVkIGluIHRvbyBzbyB0aGF0IHJlbGF0aXZlIHZhbHVlcyBjYW4gYmUgY2FsY3VsYXRlZCBwcm9wZXJseS5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSB2IFZhbHVlIHRvIGJlIHBhcnNlZFxuXHRcdFx0ICogQHBhcmFtIHshbnVtYmVyfSBkIERlZmF1bHQgdmFsdWUgKHdoaWNoIGlzIGFsc28gdXNlZCBmb3IgcmVsYXRpdmUgY2FsY3VsYXRpb25zIGlmIFwiKz1cIiBvciBcIi09XCIgaXMgZm91bmQgaW4gdGhlIGZpcnN0IHBhcmFtZXRlcilcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gcCBwcm9wZXJ0eSBuYW1lIGZvciBkaXJlY3Rpb25hbEVuZCAob3B0aW9uYWwgLSBvbmx5IHVzZWQgd2hlbiB0aGUgcGFyc2VkIHZhbHVlIGlzIGRpcmVjdGlvbmFsIChcIl9zaG9ydFwiLCBcIl9jd1wiLCBvciBcIl9jY3dcIiBzdWZmaXgpLiBXZSBuZWVkIGEgd2F5IHRvIHN0b3JlIHRoZSB1bmNvbXBlbnNhdGVkIHZhbHVlIHNvIHRoYXQgYXQgdGhlIGVuZCBvZiB0aGUgdHdlZW4sIHdlIHNldCBpdCB0byBleGFjdGx5IHdoYXQgd2FzIHJlcXVlc3RlZCB3aXRoIG5vIGRpcmVjdGlvbmFsIGNvbXBlbnNhdGlvbikuIFByb3BlcnR5IG5hbWUgd291bGQgYmUgXCJyb3RhdGlvblwiLCBcInJvdGF0aW9uWFwiLCBvciBcInJvdGF0aW9uWVwiXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdD19IGRpcmVjdGlvbmFsRW5kIEFuIG9iamVjdCB0aGF0IHdpbGwgc3RvcmUgdGhlIHJhdyBlbmQgdmFsdWVzIGZvciBkaXJlY3Rpb25hbCBhbmdsZXMgKFwiX3Nob3J0XCIsIFwiX2N3XCIsIG9yIFwiX2Njd1wiIHN1ZmZpeCkuIFdlIG5lZWQgYSB3YXkgdG8gc3RvcmUgdGhlIHVuY29tcGVuc2F0ZWQgdmFsdWUgc28gdGhhdCBhdCB0aGUgZW5kIG9mIHRoZSB0d2Vlbiwgd2Ugc2V0IGl0IHRvIGV4YWN0bHkgd2hhdCB3YXMgcmVxdWVzdGVkIHdpdGggbm8gZGlyZWN0aW9uYWwgY29tcGVuc2F0aW9uLlxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSBwYXJzZWQgYW5nbGUgaW4gcmFkaWFuc1xuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VBbmdsZSA9IGZ1bmN0aW9uKHYsIGQsIHAsIGRpcmVjdGlvbmFsRW5kKSB7XG5cdFx0XHRcdHZhciBtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0XHRjYXAsIHNwbGl0LCBkaWYsIHJlc3VsdCwgaXNSZWxhdGl2ZTtcblx0XHRcdFx0aWYgKHR5cGVvZih2KSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0diA9IHYoX2luZGV4LCBfdGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodiA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gZDtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodikgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRyZXN1bHQgPSB2O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNhcCA9IDM2MDtcblx0XHRcdFx0XHRzcGxpdCA9IHYuc3BsaXQoXCJfXCIpO1xuXHRcdFx0XHRcdGlzUmVsYXRpdmUgPSAodi5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0XHRkaWYgPSAoaXNSZWxhdGl2ZSA/IHBhcnNlSW50KHYuY2hhckF0KDApICsgXCIxXCIsIDEwKSAqIHBhcnNlRmxvYXQoc3BsaXRbMF0uc3Vic3RyKDIpKSA6IHBhcnNlRmxvYXQoc3BsaXRbMF0pKSAqICgodi5pbmRleE9mKFwicmFkXCIpID09PSAtMSkgPyAxIDogX1JBRDJERUcpIC0gKGlzUmVsYXRpdmUgPyAwIDogZCk7XG5cdFx0XHRcdFx0aWYgKHNwbGl0Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGRpcmVjdGlvbmFsRW5kKSB7XG5cdFx0XHRcdFx0XHRcdGRpcmVjdGlvbmFsRW5kW3BdID0gZCArIGRpZjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh2LmluZGV4T2YoXCJzaG9ydFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gZGlmICUgY2FwO1xuXHRcdFx0XHRcdFx0XHRpZiAoZGlmICE9PSBkaWYgJSAoY2FwIC8gMikpIHtcblx0XHRcdFx0XHRcdFx0XHRkaWYgPSAoZGlmIDwgMCkgPyBkaWYgKyBjYXAgOiBkaWYgLSBjYXA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh2LmluZGV4T2YoXCJfY3dcIikgIT09IC0xICYmIGRpZiA8IDApIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gKChkaWYgKyBjYXAgKiA5OTk5OTk5OTk5KSAlIGNhcCkgLSAoKGRpZiAvIGNhcCkgfCAwKSAqIGNhcDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodi5pbmRleE9mKFwiY2N3XCIpICE9PSAtMSAmJiBkaWYgPiAwKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9ICgoZGlmIC0gY2FwICogOTk5OTk5OTk5OSkgJSBjYXApIC0gKChkaWYgLyBjYXApIHwgMCkgKiBjYXA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc3VsdCA9IGQgKyBkaWY7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlc3VsdCA8IG1pbiAmJiByZXN1bHQgPiAtbWluKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fSxcblxuXHRcdFx0X2NvbG9yTG9va3VwID0ge2FxdWE6WzAsMjU1LDI1NV0sXG5cdFx0XHRcdGxpbWU6WzAsMjU1LDBdLFxuXHRcdFx0XHRzaWx2ZXI6WzE5MiwxOTIsMTkyXSxcblx0XHRcdFx0YmxhY2s6WzAsMCwwXSxcblx0XHRcdFx0bWFyb29uOlsxMjgsMCwwXSxcblx0XHRcdFx0dGVhbDpbMCwxMjgsMTI4XSxcblx0XHRcdFx0Ymx1ZTpbMCwwLDI1NV0sXG5cdFx0XHRcdG5hdnk6WzAsMCwxMjhdLFxuXHRcdFx0XHR3aGl0ZTpbMjU1LDI1NSwyNTVdLFxuXHRcdFx0XHRmdWNoc2lhOlsyNTUsMCwyNTVdLFxuXHRcdFx0XHRvbGl2ZTpbMTI4LDEyOCwwXSxcblx0XHRcdFx0eWVsbG93OlsyNTUsMjU1LDBdLFxuXHRcdFx0XHRvcmFuZ2U6WzI1NSwxNjUsMF0sXG5cdFx0XHRcdGdyYXk6WzEyOCwxMjgsMTI4XSxcblx0XHRcdFx0cHVycGxlOlsxMjgsMCwxMjhdLFxuXHRcdFx0XHRncmVlbjpbMCwxMjgsMF0sXG5cdFx0XHRcdHJlZDpbMjU1LDAsMF0sXG5cdFx0XHRcdHBpbms6WzI1NSwxOTIsMjAzXSxcblx0XHRcdFx0Y3lhbjpbMCwyNTUsMjU1XSxcblx0XHRcdFx0dHJhbnNwYXJlbnQ6WzI1NSwyNTUsMjU1LDBdfSxcblxuXHRcdFx0X2h1ZSA9IGZ1bmN0aW9uKGgsIG0xLCBtMikge1xuXHRcdFx0XHRoID0gKGggPCAwKSA/IGggKyAxIDogKGggPiAxKSA/IGggLSAxIDogaDtcblx0XHRcdFx0cmV0dXJuICgoKChoICogNiA8IDEpID8gbTEgKyAobTIgLSBtMSkgKiBoICogNiA6IChoIDwgMC41KSA/IG0yIDogKGggKiAzIDwgMikgPyBtMSArIChtMiAtIG0xKSAqICgyIC8gMyAtIGgpICogNiA6IG0xKSAqIDI1NSkgKyAwLjUpIHwgMDtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgUGFyc2VzIGEgY29sb3IgKGxpa2UgIzlGMCwgI0ZGOTkwMCwgcmdiKDI1NSw1MSwxNTMpIG9yIGhzbCgxMDgsIDUwJSwgMTAlKSkgaW50byBhbiBhcnJheSB3aXRoIDMgZWxlbWVudHMgZm9yIHJlZCwgZ3JlZW4sIGFuZCBibHVlIG9yIGlmIHRvSFNMIHBhcmFtZXRlciBpcyB0cnVlLCBpdCB3aWxsIHBvcHVsYXRlIHRoZSBhcnJheSB3aXRoIGh1ZSwgc2F0dXJhdGlvbiwgYW5kIGxpZ2h0bmVzcyB2YWx1ZXMuIElmIGEgcmVsYXRpdmUgdmFsdWUgaXMgZm91bmQgaW4gYW4gaHNsKCkgb3IgaHNsYSgpIHN0cmluZywgaXQgd2lsbCBwcmVzZXJ2ZSB0aG9zZSByZWxhdGl2ZSBwcmVmaXhlcyBhbmQgYWxsIHRoZSB2YWx1ZXMgaW4gdGhlIGFycmF5IHdpbGwgYmUgc3RyaW5ncyBpbnN0ZWFkIG9mIG51bWJlcnMgKGluIGFsbCBvdGhlciBjYXNlcyBpdCB3aWxsIGJlIHBvcHVsYXRlZCB3aXRoIG51bWJlcnMpLlxuXHRcdFx0ICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IHYgVGhlIHZhbHVlIHRoZSBzaG91bGQgYmUgcGFyc2VkIHdoaWNoIGNvdWxkIGJlIGEgc3RyaW5nIGxpa2UgIzlGMCBvciByZ2IoMjU1LDEwMiw1MSkgb3IgcmdiYSgyNTUsMCwwLDAuNSkgb3IgaXQgY291bGQgYmUgYSBudW1iZXIgbGlrZSAweEZGMDBDQyBvciBldmVuIGEgbmFtZWQgY29sb3IgbGlrZSByZWQsIGJsdWUsIHB1cnBsZSwgZXRjLlxuXHRcdFx0ICogQHBhcmFtIHsoYm9vbGVhbil9IHRvSFNMIElmIHRydWUsIGFuIGhzbCgpIG9yIGhzbGEoKSB2YWx1ZSB3aWxsIGJlIHJldHVybmVkIGluc3RlYWQgb2YgcmdiKCkgb3IgcmdiYSgpXG5cdFx0XHQgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0gQW4gYXJyYXkgY29udGFpbmluZyByZWQsIGdyZWVuLCBhbmQgYmx1ZSAoYW5kIG9wdGlvbmFsbHkgYWxwaGEpIGluIHRoYXQgb3JkZXIsIG9yIGlmIHRoZSB0b0hTTCBwYXJhbWV0ZXIgd2FzIHRydWUsIHRoZSBhcnJheSB3aWxsIGNvbnRhaW4gaHVlLCBzYXR1cmF0aW9uIGFuZCBsaWdodG5lc3MgKGFuZCBvcHRpb25hbGx5IGFscGhhKSBpbiB0aGF0IG9yZGVyLiBBbHdheXMgbnVtYmVycyB1bmxlc3MgdGhlcmUncyBhIHJlbGF0aXZlIHByZWZpeCBmb3VuZCBpbiBhbiBoc2woKSBvciBoc2xhKCkgc3RyaW5nIGFuZCB0b0hTTCBpcyB0cnVlLlxuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VDb2xvciA9IENTU1BsdWdpbi5wYXJzZUNvbG9yID0gZnVuY3Rpb24odiwgdG9IU0wpIHtcblx0XHRcdFx0dmFyIGEsIHIsIGcsIGIsIGgsIHMsIGwsIG1heCwgbWluLCBkLCB3YXNIU0w7XG5cdFx0XHRcdGlmICghdikge1xuXHRcdFx0XHRcdGEgPSBfY29sb3JMb29rdXAuYmxhY2s7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHYpID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0YSA9IFt2ID4+IDE2LCAodiA+PiA4KSAmIDI1NSwgdiAmIDI1NV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHYuY2hhckF0KHYubGVuZ3RoIC0gMSkgPT09IFwiLFwiKSB7IC8vc29tZXRpbWVzIGEgdHJhaWxpbmcgY29tbWEgaXMgaW5jbHVkZWQgYW5kIHdlIHNob3VsZCBjaG9wIGl0IG9mZiAodHlwaWNhbGx5IGZyb20gYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiB2YWx1ZXMgbGlrZSBhIHRleHRTaGFkb3c6XCIycHggMnB4IDJweCBibHVlLCA1cHggNXB4IDVweCByZ2IoMjU1LDAsMClcIiAtIGluIHRoaXMgZXhhbXBsZSBcImJsdWUsXCIgaGFzIGEgdHJhaWxpbmcgY29tbWEuIFdlIGNvdWxkIHN0cmlwIGl0IG91dCBpbnNpZGUgcGFyc2VDb21wbGV4KCkgYnV0IHdlJ2QgbmVlZCB0byBkbyBpdCB0byB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIHBsdXMgaXQgd291bGRuJ3QgcHJvdmlkZSBwcm90ZWN0aW9uIGZyb20gb3RoZXIgcG90ZW50aWFsIHNjZW5hcmlvcyBsaWtlIGlmIHRoZSB1c2VyIHBhc3NlcyBpbiBhIHNpbWlsYXIgdmFsdWUuXG5cdFx0XHRcdFx0XHR2ID0gdi5zdWJzdHIoMCwgdi5sZW5ndGggLSAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKF9jb2xvckxvb2t1cFt2XSkge1xuXHRcdFx0XHRcdFx0YSA9IF9jb2xvckxvb2t1cFt2XTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuY2hhckF0KDApID09PSBcIiNcIikge1xuXHRcdFx0XHRcdFx0aWYgKHYubGVuZ3RoID09PSA0KSB7IC8vZm9yIHNob3J0aGFuZCBsaWtlICM5RjBcblx0XHRcdFx0XHRcdFx0ciA9IHYuY2hhckF0KDEpO1xuXHRcdFx0XHRcdFx0XHRnID0gdi5jaGFyQXQoMik7XG5cdFx0XHRcdFx0XHRcdGIgPSB2LmNoYXJBdCgzKTtcblx0XHRcdFx0XHRcdFx0diA9IFwiI1wiICsgciArIHIgKyBnICsgZyArIGIgKyBiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0diA9IHBhcnNlSW50KHYuc3Vic3RyKDEpLCAxNik7XG5cdFx0XHRcdFx0XHRhID0gW3YgPj4gMTYsICh2ID4+IDgpICYgMjU1LCB2ICYgMjU1XTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuc3Vic3RyKDAsIDMpID09PSBcImhzbFwiKSB7XG5cdFx0XHRcdFx0XHRhID0gd2FzSFNMID0gdi5tYXRjaChfbnVtRXhwKTtcblx0XHRcdFx0XHRcdGlmICghdG9IU0wpIHtcblx0XHRcdFx0XHRcdFx0aCA9IChOdW1iZXIoYVswXSkgJSAzNjApIC8gMzYwO1xuXHRcdFx0XHRcdFx0XHRzID0gTnVtYmVyKGFbMV0pIC8gMTAwO1xuXHRcdFx0XHRcdFx0XHRsID0gTnVtYmVyKGFbMl0pIC8gMTAwO1xuXHRcdFx0XHRcdFx0XHRnID0gKGwgPD0gMC41KSA/IGwgKiAocyArIDEpIDogbCArIHMgLSBsICogcztcblx0XHRcdFx0XHRcdFx0ciA9IGwgKiAyIC0gZztcblx0XHRcdFx0XHRcdFx0aWYgKGEubGVuZ3RoID4gMykge1xuXHRcdFx0XHRcdFx0XHRcdGFbM10gPSBOdW1iZXIodlszXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YVswXSA9IF9odWUoaCArIDEgLyAzLCByLCBnKTtcblx0XHRcdFx0XHRcdFx0YVsxXSA9IF9odWUoaCwgciwgZyk7XG5cdFx0XHRcdFx0XHRcdGFbMl0gPSBfaHVlKGggLSAxIC8gMywgciwgZyk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuaW5kZXhPZihcIj1cIikgIT09IC0xKSB7IC8vaWYgcmVsYXRpdmUgdmFsdWVzIGFyZSBmb3VuZCwganVzdCByZXR1cm4gdGhlIHJhdyBzdHJpbmdzIHdpdGggdGhlIHJlbGF0aXZlIHByZWZpeGVzIGluIHBsYWNlLlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdi5tYXRjaChfcmVsTnVtRXhwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YSA9IHYubWF0Y2goX251bUV4cCkgfHwgX2NvbG9yTG9va3VwLnRyYW5zcGFyZW50O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhWzBdID0gTnVtYmVyKGFbMF0pO1xuXHRcdFx0XHRcdGFbMV0gPSBOdW1iZXIoYVsxXSk7XG5cdFx0XHRcdFx0YVsyXSA9IE51bWJlcihhWzJdKTtcblx0XHRcdFx0XHRpZiAoYS5sZW5ndGggPiAzKSB7XG5cdFx0XHRcdFx0XHRhWzNdID0gTnVtYmVyKGFbM10pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9IU0wgJiYgIXdhc0hTTCkge1xuXHRcdFx0XHRcdHIgPSBhWzBdIC8gMjU1O1xuXHRcdFx0XHRcdGcgPSBhWzFdIC8gMjU1O1xuXHRcdFx0XHRcdGIgPSBhWzJdIC8gMjU1O1xuXHRcdFx0XHRcdG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuXHRcdFx0XHRcdG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuXHRcdFx0XHRcdGwgPSAobWF4ICsgbWluKSAvIDI7XG5cdFx0XHRcdFx0aWYgKG1heCA9PT0gbWluKSB7XG5cdFx0XHRcdFx0XHRoID0gcyA9IDA7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGQgPSBtYXggLSBtaW47XG5cdFx0XHRcdFx0XHRzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG5cdFx0XHRcdFx0XHRoID0gKG1heCA9PT0gcikgPyAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKSA6IChtYXggPT09IGcpID8gKGIgLSByKSAvIGQgKyAyIDogKHIgLSBnKSAvIGQgKyA0O1xuXHRcdFx0XHRcdFx0aCAqPSA2MDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YVswXSA9IChoICsgMC41KSB8IDA7XG5cdFx0XHRcdFx0YVsxXSA9IChzICogMTAwICsgMC41KSB8IDA7XG5cdFx0XHRcdFx0YVsyXSA9IChsICogMTAwICsgMC41KSB8IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGE7XG5cdFx0XHR9LFxuXHRcdFx0X2Zvcm1hdENvbG9ycyA9IGZ1bmN0aW9uKHMsIHRvSFNMKSB7XG5cdFx0XHRcdHZhciBjb2xvcnMgPSBzLm1hdGNoKF9jb2xvckV4cCkgfHwgW10sXG5cdFx0XHRcdFx0Y2hhckluZGV4ID0gMCxcblx0XHRcdFx0XHRwYXJzZWQgPSBjb2xvcnMubGVuZ3RoID8gXCJcIiA6IHMsXG5cdFx0XHRcdFx0aSwgY29sb3IsIHRlbXA7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjb2xvciA9IGNvbG9yc1tpXTtcblx0XHRcdFx0XHR0ZW1wID0gcy5zdWJzdHIoY2hhckluZGV4LCBzLmluZGV4T2YoY29sb3IsIGNoYXJJbmRleCktY2hhckluZGV4KTtcblx0XHRcdFx0XHRjaGFySW5kZXggKz0gdGVtcC5sZW5ndGggKyBjb2xvci5sZW5ndGg7XG5cdFx0XHRcdFx0Y29sb3IgPSBfcGFyc2VDb2xvcihjb2xvciwgdG9IU0wpO1xuXHRcdFx0XHRcdGlmIChjb2xvci5sZW5ndGggPT09IDMpIHtcblx0XHRcdFx0XHRcdGNvbG9yLnB1c2goMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBhcnNlZCArPSB0ZW1wICsgKHRvSFNMID8gXCJoc2xhKFwiICsgY29sb3JbMF0gKyBcIixcIiArIGNvbG9yWzFdICsgXCIlLFwiICsgY29sb3JbMl0gKyBcIiUsXCIgKyBjb2xvclszXSA6IFwicmdiYShcIiArIGNvbG9yLmpvaW4oXCIsXCIpKSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwYXJzZWQgKyBzLnN1YnN0cihjaGFySW5kZXgpO1xuXHRcdFx0fSxcblx0XHRcdF9jb2xvckV4cCA9IFwiKD86XFxcXGIoPzooPzpyZ2J8cmdiYXxoc2x8aHNsYSlcXFxcKC4rP1xcXFwpKXxcXFxcQiMoPzpbMC05YS1mXXszfSl7MSwyfVxcXFxiXCI7IC8vd2UnbGwgZHluYW1pY2FsbHkgYnVpbGQgdGhpcyBSZWd1bGFyIEV4cHJlc3Npb24gdG8gY29uc2VydmUgZmlsZSBzaXplLiBBZnRlciBidWlsZGluZyBpdCwgaXQgd2lsbCBiZSBhYmxlIHRvIGZpbmQgcmdiKCksIHJnYmEoKSwgIyAoaGV4YWRlY2ltYWwpLCBhbmQgbmFtZWQgY29sb3IgdmFsdWVzIGxpa2UgcmVkLCBibHVlLCBwdXJwbGUsIGV0Yy5cblxuXHRcdGZvciAocCBpbiBfY29sb3JMb29rdXApIHtcblx0XHRcdF9jb2xvckV4cCArPSBcInxcIiArIHAgKyBcIlxcXFxiXCI7XG5cdFx0fVxuXHRcdF9jb2xvckV4cCA9IG5ldyBSZWdFeHAoX2NvbG9yRXhwK1wiKVwiLCBcImdpXCIpO1xuXG5cdFx0Q1NTUGx1Z2luLmNvbG9yU3RyaW5nRmlsdGVyID0gZnVuY3Rpb24oYSkge1xuXHRcdFx0dmFyIGNvbWJpbmVkID0gYVswXSArIGFbMV0sXG5cdFx0XHRcdHRvSFNMO1xuXHRcdFx0aWYgKF9jb2xvckV4cC50ZXN0KGNvbWJpbmVkKSkge1xuXHRcdFx0XHR0b0hTTCA9IChjb21iaW5lZC5pbmRleE9mKFwiaHNsKFwiKSAhPT0gLTEgfHwgY29tYmluZWQuaW5kZXhPZihcImhzbGEoXCIpICE9PSAtMSk7XG5cdFx0XHRcdGFbMF0gPSBfZm9ybWF0Q29sb3JzKGFbMF0sIHRvSFNMKTtcblx0XHRcdFx0YVsxXSA9IF9mb3JtYXRDb2xvcnMoYVsxXSwgdG9IU0wpO1xuXHRcdFx0fVxuXHRcdFx0X2NvbG9yRXhwLmxhc3RJbmRleCA9IDA7XG5cdFx0fTtcblxuXHRcdGlmICghVHdlZW5MaXRlLmRlZmF1bHRTdHJpbmdGaWx0ZXIpIHtcblx0XHRcdFR3ZWVuTGl0ZS5kZWZhdWx0U3RyaW5nRmlsdGVyID0gQ1NTUGx1Z2luLmNvbG9yU3RyaW5nRmlsdGVyO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEBwcml2YXRlIFJldHVybnMgYSBmb3JtYXR0ZXIgZnVuY3Rpb24gdGhhdCBoYW5kbGVzIHRha2luZyBhIHN0cmluZyAob3IgbnVtYmVyIGluIHNvbWUgY2FzZXMpIGFuZCByZXR1cm5pbmcgYSBjb25zaXN0ZW50bHkgZm9ybWF0dGVkIG9uZSBpbiB0ZXJtcyBvZiBkZWxpbWl0ZXJzLCBxdWFudGl0eSBvZiB2YWx1ZXMsIGV0Yy4gRm9yIGV4YW1wbGUsIHdlIG1heSBnZXQgYm94U2hhZG93IHZhbHVlcyBkZWZpbmVkIGFzIFwiMHB4IHJlZFwiIG9yIFwiMHB4IDBweCAxMHB4IHJnYigyNTUsMCwwKVwiIG9yIFwiMHB4IDBweCAyMHB4IDIwcHggI0YwMFwiIGFuZCB3ZSBuZWVkIHRvIGVuc3VyZSB0aGF0IHdoYXQgd2UgZ2V0IGJhY2sgaXMgZGVzY3JpYmVkIHdpdGggNCBudW1iZXJzIGFuZCBhIGNvbG9yLiBUaGlzIGFsbG93cyB1cyB0byBmZWVkIGl0IGludG8gdGhlIF9wYXJzZUNvbXBsZXgoKSBtZXRob2QgYW5kIHNwbGl0IHRoZSB2YWx1ZXMgdXAgYXBwcm9wcmlhdGVseS4gVGhlIG5lYXQgdGhpbmcgYWJvdXQgdGhpcyBfZ2V0Rm9ybWF0dGVyKCkgZnVuY3Rpb24gaXMgdGhhdCB0aGUgZGZsdCBkZWZpbmVzIGEgcGF0dGVybiBhcyB3ZWxsIGFzIGEgZGVmYXVsdCwgc28gZm9yIGV4YW1wbGUsIF9nZXRGb3JtYXR0ZXIoXCIwcHggMHB4IDBweCAwcHggIzc3N1wiLCB0cnVlKSBub3Qgb25seSBzZXRzIHRoZSBkZWZhdWx0IGFzIDBweCBmb3IgYWxsIGRpc3RhbmNlcyBhbmQgIzc3NyBmb3IgdGhlIGNvbG9yLCBidXQgYWxzbyBzZXRzIHRoZSBwYXR0ZXJuIHN1Y2ggdGhhdCA0IG51bWJlcnMgYW5kIGEgY29sb3Igd2lsbCBhbHdheXMgZ2V0IHJldHVybmVkLlxuXHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gZGZsdCBUaGUgZGVmYXVsdCB2YWx1ZSBhbmQgcGF0dGVybiB0byBmb2xsb3cuIFNvIFwiMHB4IDBweCAwcHggMHB4ICM3NzdcIiB3aWxsIGVuc3VyZSB0aGF0IDQgbnVtYmVycyBhbmQgYSBjb2xvciB3aWxsIGFsd2F5cyBnZXQgcmV0dXJuZWQuXG5cdFx0ICogQHBhcmFtIHtib29sZWFuPX0gY2xyIElmIHRydWUsIHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHNlYXJjaGVkIGZvciBjb2xvci1yZWxhdGVkIGRhdGEuIEZvciBleGFtcGxlLCBib3hTaGFkb3cgdmFsdWVzIHR5cGljYWxseSBjb250YWluIGEgY29sb3Igd2hlcmVhcyBib3JkZXJSYWRpdXMgZG9uJ3QuXG5cdFx0ICogQHBhcmFtIHtib29sZWFuPX0gY29sbGFwc2libGUgSWYgdHJ1ZSwgdGhlIHZhbHVlIGlzIGEgdG9wL2xlZnQvcmlnaHQvYm90dG9tIHN0eWxlIG9uZSB0aGF0IGFjdHMgbGlrZSBtYXJnaW4gb3IgcGFkZGluZywgd2hlcmUgaWYgb25seSBvbmUgdmFsdWUgaXMgcmVjZWl2ZWQsIGl0J3MgdXNlZCBmb3IgYWxsIDQ7IGlmIDIgYXJlIHJlY2VpdmVkLCB0aGUgZmlyc3QgaXMgZHVwbGljYXRlZCBmb3IgM3JkIChib3R0b20pIGFuZCB0aGUgMm5kIGlzIGR1cGxpY2F0ZWQgZm9yIHRoZSA0dGggc3BvdCAobGVmdCksIGV0Yy5cblx0XHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZm9ybWF0dGVyIGZ1bmN0aW9uXG5cdFx0ICovXG5cdFx0dmFyIF9nZXRGb3JtYXR0ZXIgPSBmdW5jdGlvbihkZmx0LCBjbHIsIGNvbGxhcHNpYmxlLCBtdWx0aSkge1xuXHRcdFx0XHRpZiAoZGZsdCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYpIHtyZXR1cm4gdjt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBkQ29sb3IgPSBjbHIgPyAoZGZsdC5tYXRjaChfY29sb3JFeHApIHx8IFtcIlwiXSlbMF0gOiBcIlwiLFxuXHRcdFx0XHRcdGRWYWxzID0gZGZsdC5zcGxpdChkQ29sb3IpLmpvaW4oXCJcIikubWF0Y2goX3ZhbHVlc0V4cCkgfHwgW10sXG5cdFx0XHRcdFx0cGZ4ID0gZGZsdC5zdWJzdHIoMCwgZGZsdC5pbmRleE9mKGRWYWxzWzBdKSksXG5cdFx0XHRcdFx0c2Z4ID0gKGRmbHQuY2hhckF0KGRmbHQubGVuZ3RoIC0gMSkgPT09IFwiKVwiKSA/IFwiKVwiIDogXCJcIixcblx0XHRcdFx0XHRkZWxpbSA9IChkZmx0LmluZGV4T2YoXCIgXCIpICE9PSAtMSkgPyBcIiBcIiA6IFwiLFwiLFxuXHRcdFx0XHRcdG51bVZhbHMgPSBkVmFscy5sZW5ndGgsXG5cdFx0XHRcdFx0ZFNmeCA9IChudW1WYWxzID4gMCkgPyBkVmFsc1swXS5yZXBsYWNlKF9udW1FeHAsIFwiXCIpIDogXCJcIixcblx0XHRcdFx0XHRmb3JtYXR0ZXI7XG5cdFx0XHRcdGlmICghbnVtVmFscykge1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih2KSB7cmV0dXJuIHY7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2xyKSB7XG5cdFx0XHRcdFx0Zm9ybWF0dGVyID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yLCB2YWxzLCBpLCBhO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZih2KSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdFx0XHR2ICs9IGRTZng7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG11bHRpICYmIF9jb21tYXNPdXRzaWRlUGFyZW5FeHAudGVzdCh2KSkge1xuXHRcdFx0XHRcdFx0XHRhID0gdi5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwifFwiKS5zcGxpdChcInxcIik7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0YVtpXSA9IGZvcm1hdHRlcihhW2ldKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYS5qb2luKFwiLFwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNvbG9yID0gKHYubWF0Y2goX2NvbG9yRXhwKSB8fCBbZENvbG9yXSlbMF07XG5cdFx0XHRcdFx0XHR2YWxzID0gdi5zcGxpdChjb2xvcikuam9pbihcIlwiKS5tYXRjaChfdmFsdWVzRXhwKSB8fCBbXTtcblx0XHRcdFx0XHRcdGkgPSB2YWxzLmxlbmd0aDtcblx0XHRcdFx0XHRcdGlmIChudW1WYWxzID4gaS0tKSB7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICgrK2kgPCBudW1WYWxzKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsc1tpXSA9IGNvbGxhcHNpYmxlID8gdmFsc1soKChpIC0gMSkgLyAyKSB8IDApXSA6IGRWYWxzW2ldO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGZ4ICsgdmFscy5qb2luKGRlbGltKSArIGRlbGltICsgY29sb3IgKyBzZnggKyAodi5pbmRleE9mKFwiaW5zZXRcIikgIT09IC0xID8gXCIgaW5zZXRcIiA6IFwiXCIpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcjtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGZvcm1hdHRlciA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR2YXIgdmFscywgYSwgaTtcblx0XHRcdFx0XHRpZiAodHlwZW9mKHYpID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0XHR2ICs9IGRTZng7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChtdWx0aSAmJiBfY29tbWFzT3V0c2lkZVBhcmVuRXhwLnRlc3QodikpIHtcblx0XHRcdFx0XHRcdGEgPSB2LnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGFbaV0gPSBmb3JtYXR0ZXIoYVtpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gYS5qb2luKFwiLFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFscyA9IHYubWF0Y2goX3ZhbHVlc0V4cCkgfHwgW107XG5cdFx0XHRcdFx0aSA9IHZhbHMubGVuZ3RoO1xuXHRcdFx0XHRcdGlmIChudW1WYWxzID4gaS0tKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoKytpIDwgbnVtVmFscykge1xuXHRcdFx0XHRcdFx0XHR2YWxzW2ldID0gY29sbGFwc2libGUgPyB2YWxzWygoKGkgLSAxKSAvIDIpIHwgMCldIDogZFZhbHNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBwZnggKyB2YWxzLmpvaW4oZGVsaW0pICsgc2Z4O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVyO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSByZXR1cm5zIGEgZm9ybWF0dGVyIGZ1bmN0aW9uIHRoYXQncyB1c2VkIGZvciBlZGdlLXJlbGF0ZWQgdmFsdWVzIGxpa2UgbWFyZ2luVG9wLCBtYXJnaW5MZWZ0LCBwYWRkaW5nQm90dG9tLCBwYWRkaW5nUmlnaHQsIGV0Yy4gSnVzdCBwYXNzIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgcHJvcGVydHkgbmFtZXMgcmVsYXRlZCB0byB0aGUgZWRnZXMuXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHByb3BzIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgcHJvcGVydHkgbmFtZXMgaW4gb3JkZXIgZnJvbSB0b3AgdG8gbGVmdCwgbGlrZSBcIm1hcmdpblRvcCxtYXJnaW5SaWdodCxtYXJnaW5Cb3R0b20sbWFyZ2luTGVmdFwiXG5cdFx0XHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBmb3JtYXR0ZXIgZnVuY3Rpb25cblx0XHRcdCAqL1xuXHRcdFx0X2dldEVkZ2VQYXJzZXIgPSBmdW5jdGlvbihwcm9wcykge1xuXHRcdFx0XHRwcm9wcyA9IHByb3BzLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0XHR2YXIgYSA9IChlICsgXCJcIikuc3BsaXQoXCIgXCIpLFxuXHRcdFx0XHRcdFx0aTtcblx0XHRcdFx0XHR2YXJzID0ge307XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IDQ7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyc1twcm9wc1tpXV0gPSBhW2ldID0gYVtpXSB8fCBhWygoKGkgLSAxKSAvIDIpID4+IDApXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGNzc3AucGFyc2UodCwgdmFycywgcHQsIHBsdWdpbik7XG5cdFx0XHRcdH07XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBAcHJpdmF0ZSB1c2VkIHdoZW4gb3RoZXIgcGx1Z2lucyBtdXN0IHR3ZWVuIHZhbHVlcyBmaXJzdCwgbGlrZSBCZXppZXJQbHVnaW4gb3IgVGhyb3dQcm9wc1BsdWdpbiwgZXRjLiBUaGF0IHBsdWdpbidzIHNldFJhdGlvKCkgZ2V0cyBjYWxsZWQgZmlyc3Qgc28gdGhhdCB0aGUgdmFsdWVzIGFyZSB1cGRhdGVkLCBhbmQgdGhlbiB3ZSBsb29wIHRocm91Z2ggdGhlIE1pbmlQcm9wVHdlZW5zIHdoaWNoIGhhbmRsZSBjb3B5aW5nIHRoZSB2YWx1ZXMgaW50byB0aGVpciBhcHByb3ByaWF0ZSBzbG90cyBzbyB0aGF0IHRoZXkgY2FuIHRoZW4gYmUgYXBwbGllZCBjb3JyZWN0bHkgaW4gdGhlIG1haW4gQ1NTUGx1Z2luIHNldFJhdGlvKCkgbWV0aG9kLiBSZW1lbWJlciwgd2UgdHlwaWNhbGx5IGNyZWF0ZSBhIHByb3h5IG9iamVjdCB0aGF0IGhhcyBhIGJ1bmNoIG9mIHVuaXF1ZWx5LW5hbWVkIHByb3BlcnRpZXMgdGhhdCB3ZSBmZWVkIHRvIHRoZSBzdWItcGx1Z2luIGFuZCBpdCBkb2VzIGl0cyBtYWdpYyBub3JtYWxseSwgYW5kIHRoZW4gd2UgbXVzdCBpbnRlcnByZXQgdGhvc2UgdmFsdWVzIGFuZCBhcHBseSB0aGVtIHRvIHRoZSBjc3MgYmVjYXVzZSBvZnRlbiBudW1iZXJzIG11c3QgZ2V0IGNvbWJpbmVkL2NvbmNhdGVuYXRlZCwgc3VmZml4ZXMgYWRkZWQsIGV0Yy4gdG8gd29yayB3aXRoIGNzcywgbGlrZSBib3hTaGFkb3cgY291bGQgaGF2ZSA0IHZhbHVlcyBwbHVzIGEgY29sb3IuXG5cdFx0XHRfc2V0UGx1Z2luUmF0aW8gPSBfaW50ZXJuYWxzLl9zZXRQbHVnaW5SYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0UmF0aW8odik7XG5cdFx0XHRcdHZhciBkID0gdGhpcy5kYXRhLFxuXHRcdFx0XHRcdHByb3h5ID0gZC5wcm94eSxcblx0XHRcdFx0XHRtcHQgPSBkLmZpcnN0TVBULFxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHRcdHZhbCwgcHQsIGksIHN0ciwgcDtcblx0XHRcdFx0d2hpbGUgKG1wdCkge1xuXHRcdFx0XHRcdHZhbCA9IHByb3h5W21wdC52XTtcblx0XHRcdFx0XHRpZiAobXB0LnIpIHtcblx0XHRcdFx0XHRcdHZhbCA9IE1hdGgucm91bmQodmFsKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHZhbCA8IG1pbiAmJiB2YWwgPiAtbWluKSB7XG5cdFx0XHRcdFx0XHR2YWwgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtcHQudFttcHQucF0gPSB2YWw7XG5cdFx0XHRcdFx0bXB0ID0gbXB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkLmF1dG9Sb3RhdGUpIHtcblx0XHRcdFx0XHRkLmF1dG9Sb3RhdGUucm90YXRpb24gPSBkLm1vZCA/IGQubW9kKHByb3h5LnJvdGF0aW9uLCB0aGlzLnQpIDogcHJveHkucm90YXRpb247IC8vc3BlY2lhbCBjYXNlIGZvciBNb2RpZnlQbHVnaW4gdG8gaG9vayBpbnRvIGFuIGF1dG8tcm90YXRpbmcgYmV6aWVyXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9hdCB0aGUgZW5kLCB3ZSBtdXN0IHNldCB0aGUgQ1NTUHJvcFR3ZWVuJ3MgXCJlXCIgKGVuZCkgdmFsdWUgZHluYW1pY2FsbHkgaGVyZSBiZWNhdXNlIHRoYXQncyB3aGF0IGlzIHVzZWQgaW4gdGhlIGZpbmFsIHNldFJhdGlvKCkgbWV0aG9kLiBTYW1lIGZvciBcImJcIiBhdCB0aGUgYmVnaW5uaW5nLlxuXHRcdFx0XHRpZiAodiA9PT0gMSB8fCB2ID09PSAwKSB7XG5cdFx0XHRcdFx0bXB0ID0gZC5maXJzdE1QVDtcblx0XHRcdFx0XHRwID0gKHYgPT09IDEpID8gXCJlXCIgOiBcImJcIjtcblx0XHRcdFx0XHR3aGlsZSAobXB0KSB7XG5cdFx0XHRcdFx0XHRwdCA9IG1wdC50O1xuXHRcdFx0XHRcdFx0aWYgKCFwdC50eXBlKSB7XG5cdFx0XHRcdFx0XHRcdHB0W3BdID0gcHQucyArIHB0LnhzMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRzdHIgPSBwdC54czAgKyBwdC5zICsgcHQueHMxO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0c3RyICs9IHB0W1wieG5cIitpXSArIHB0W1wieHNcIisoaSsxKV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHRbcF0gPSBzdHI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtcHQgPSBtcHQuX25leHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIEBjb25zdHJ1Y3RvciBVc2VkIGJ5IGEgZmV3IFNwZWNpYWxQcm9wcyB0byBob2xkIGltcG9ydGFudCB2YWx1ZXMgZm9yIHByb3hpZXMuIEZvciBleGFtcGxlLCBfcGFyc2VUb1Byb3h5KCkgY3JlYXRlcyBhIE1pbmlQcm9wVHdlZW4gaW5zdGFuY2UgZm9yIGVhY2ggcHJvcGVydHkgdGhhdCBtdXN0IGdldCB0d2VlbmVkIG9uIHRoZSBwcm94eSwgYW5kIHdlIHJlY29yZCB0aGUgb3JpZ2luYWwgcHJvcGVydHkgbmFtZSBhcyB3ZWxsIGFzIHRoZSB1bmlxdWUgb25lIHdlIGNyZWF0ZSBmb3IgdGhlIHByb3h5LCBwbHVzIHdoZXRoZXIgb3Igbm90IHRoZSB2YWx1ZSBuZWVkcyB0byBiZSByb3VuZGVkIHBsdXMgdGhlIG9yaWdpbmFsIHZhbHVlLlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IHRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydHkgd2UncmUgdHdlZW5pbmcgKG9mdGVuIGEgQ1NTUHJvcFR3ZWVuKVxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIHByb3BlcnR5IG5hbWVcblx0XHRcdCAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmd8b2JqZWN0KX0gdiB2YWx1ZVxuXHRcdFx0ICogQHBhcmFtIHtNaW5pUHJvcFR3ZWVuPX0gbmV4dCBuZXh0IE1pbmlQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0XG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSByIGlmIHRydWUsIHRoZSB0d2VlbmVkIHZhbHVlIHNob3VsZCBiZSByb3VuZGVkIHRvIHRoZSBuZWFyZXN0IGludGVnZXJcblx0XHRcdCAqL1xuXHRcdFx0TWluaVByb3BUd2VlbiA9IGZ1bmN0aW9uKHQsIHAsIHYsIG5leHQsIHIpIHtcblx0XHRcdFx0dGhpcy50ID0gdDtcblx0XHRcdFx0dGhpcy5wID0gcDtcblx0XHRcdFx0dGhpcy52ID0gdjtcblx0XHRcdFx0dGhpcy5yID0gcjtcblx0XHRcdFx0aWYgKG5leHQpIHtcblx0XHRcdFx0XHRuZXh0Ll9wcmV2ID0gdGhpcztcblx0XHRcdFx0XHR0aGlzLl9uZXh0ID0gbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBNb3N0IG90aGVyIHBsdWdpbnMgKGxpa2UgQmV6aWVyUGx1Z2luIGFuZCBUaHJvd1Byb3BzUGx1Z2luIGFuZCBvdGhlcnMpIGNhbiBvbmx5IHR3ZWVuIG51bWVyaWMgdmFsdWVzLCBidXQgQ1NTUGx1Z2luIG11c3QgYWNjb21tb2RhdGUgc3BlY2lhbCB2YWx1ZXMgdGhhdCBoYXZlIGEgYnVuY2ggb2YgZXh0cmEgZGF0YSAobGlrZSBhIHN1ZmZpeCBvciBzdHJpbmdzIGJldHdlZW4gbnVtZXJpYyB2YWx1ZXMsIGV0Yy4pLiBGb3IgZXhhbXBsZSwgYm94U2hhZG93IGhhcyB2YWx1ZXMgbGlrZSBcIjEwcHggMTBweCAyMHB4IDMwcHggcmdiKDI1NSwwLDApXCIgd2hpY2ggd291bGQgdXR0ZXJseSBjb25mdXNlIG90aGVyIHBsdWdpbnMuIFRoaXMgbWV0aG9kIGFsbG93cyB1cyB0byBzcGxpdCB0aGF0IGRhdGEgYXBhcnQgYW5kIGdyYWIgb25seSB0aGUgbnVtZXJpYyBkYXRhIGFuZCBhdHRhY2ggaXQgdG8gdW5pcXVlbHktbmFtZWQgcHJvcGVydGllcyBvZiBhIGdlbmVyaWMgcHJveHkgb2JqZWN0ICh7fSkgc28gdGhhdCB3ZSBjYW4gZmVlZCB0aGF0IHRvIHZpcnR1YWxseSBhbnkgcGx1Z2luIHRvIGhhdmUgdGhlIG51bWJlcnMgdHdlZW5lZC4gSG93ZXZlciwgd2UgbXVzdCBhbHNvIGtlZXAgdHJhY2sgb2Ygd2hpY2ggcHJvcGVydGllcyBmcm9tIHRoZSBwcm94eSBnbyB3aXRoIHdoaWNoIENTU1Byb3BUd2VlbiB2YWx1ZXMgYW5kIGluc3RhbmNlcy4gU28gd2UgY3JlYXRlIGEgbGlua2VkIGxpc3Qgb2YgTWluaVByb3BUd2VlbnMuIEVhY2ggb25lIHJlY29yZHMgYSB0YXJnZXQgKHRoZSBvcmlnaW5hbCBDU1NQcm9wVHdlZW4pLCBwcm9wZXJ0eSAobGlrZSBcInNcIiBvciBcInhuMVwiIG9yIFwieG4yXCIpIHRoYXQgd2UncmUgdHdlZW5pbmcgYW5kIHRoZSB1bmlxdWUgcHJvcGVydHkgbmFtZSB0aGF0IHdhcyB1c2VkIGZvciB0aGUgcHJveHkgKGxpa2UgXCJib3hTaGFkb3dfeG4xXCIgYW5kIFwiYm94U2hhZG93X3huMlwiKSBhbmQgd2hldGhlciBvciBub3QgdGhleSBuZWVkIHRvIGJlIHJvdW5kZWQuIFRoYXQgd2F5LCBpbiB0aGUgX3NldFBsdWdpblJhdGlvKCkgbWV0aG9kIHdlIGNhbiBzaW1wbHkgY29weSB0aGUgdmFsdWVzIG92ZXIgZnJvbSB0aGUgcHJveHkgdG8gdGhlIENTU1Byb3BUd2VlbiBpbnN0YW5jZShzKS4gVGhlbiwgd2hlbiB0aGUgbWFpbiBDU1NQbHVnaW4gc2V0UmF0aW8oKSBtZXRob2QgcnVucyBhbmQgYXBwbGllcyB0aGUgQ1NTUHJvcFR3ZWVuIHZhbHVlcyBhY2NvcmRpbmdseSwgdGhleSdyZSB1cGRhdGVkIG5pY2VseS4gU28gdGhlIGV4dGVybmFsIHBsdWdpbiB0d2VlbnMgdGhlIG51bWJlcnMsIF9zZXRQbHVnaW5SYXRpbygpIGNvcGllcyB0aGVtIG92ZXIsIGFuZCBzZXRSYXRpbygpIGFjdHMgbm9ybWFsbHksIGFwcGx5aW5nIGNzcy1zcGVjaWZpYyB2YWx1ZXMgdG8gdGhlIGVsZW1lbnQuXG5cdFx0XHQgKiBUaGlzIG1ldGhvZCByZXR1cm5zIGFuIG9iamVjdCB0aGF0IGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cdFx0XHQgKiAgLSBwcm94eTogYSBnZW5lcmljIG9iamVjdCBjb250YWluaW5nIHRoZSBzdGFydGluZyB2YWx1ZXMgZm9yIGFsbCB0aGUgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgdHdlZW5lZCBieSB0aGUgZXh0ZXJuYWwgcGx1Z2luLiAgVGhpcyBpcyB3aGF0IHdlIGZlZWQgdG8gdGhlIGV4dGVybmFsIF9vbkluaXRUd2VlbigpIGFzIHRoZSB0YXJnZXRcblx0XHRcdCAqICAtIGVuZDogYSBnZW5lcmljIG9iamVjdCBjb250YWluaW5nIHRoZSBlbmRpbmcgdmFsdWVzIGZvciBhbGwgdGhlIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIHR3ZWVuZWQgYnkgdGhlIGV4dGVybmFsIHBsdWdpbi4gVGhpcyBpcyB3aGF0IHdlIGZlZWQgdG8gdGhlIGV4dGVybmFsIHBsdWdpbidzIF9vbkluaXRUd2VlbigpIGFzIHRoZSBkZXN0aW5hdGlvbiB2YWx1ZXNcblx0XHRcdCAqICAtIGZpcnN0TVBUOiB0aGUgZmlyc3QgTWluaVByb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Rcblx0XHRcdCAqICAtIHB0OiB0aGUgZmlyc3QgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdCB0aGF0IHdhcyBjcmVhdGVkIHdoZW4gcGFyc2luZy4gSWYgc2hhbGxvdyBpcyB0cnVlLCB0aGlzIGxpbmtlZCBsaXN0IHdpbGwgTk9UIGF0dGFjaCB0byB0aGUgb25lIHBhc3NlZCBpbnRvIHRoZSBfcGFyc2VUb1Byb3h5KCkgYXMgdGhlIFwicHRcIiAoNHRoKSBwYXJhbWV0ZXIuXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgdGFyZ2V0IG9iamVjdCB0byBiZSB0d2VlbmVkXG5cdFx0XHQgKiBAcGFyYW0geyEoT2JqZWN0fHN0cmluZyl9IHZhcnMgdGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgdHdlZW5pbmcgdmFsdWVzICh0eXBpY2FsbHkgdGhlIGVuZC9kZXN0aW5hdGlvbiB2YWx1ZXMpIHRoYXQgc2hvdWxkIGJlIHBhcnNlZFxuXHRcdFx0ICogQHBhcmFtIHshQ1NTUGx1Z2lufSBjc3NwIFRoZSBDU1NQbHVnaW4gaW5zdGFuY2Vcblx0XHRcdCAqIEBwYXJhbSB7Q1NTUHJvcFR3ZWVuPX0gcHQgdGhlIG5leHQgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdFx0ICogQHBhcmFtIHtUd2VlblBsdWdpbj19IHBsdWdpbiB0aGUgZXh0ZXJuYWwgVHdlZW5QbHVnaW4gaW5zdGFuY2UgdGhhdCB3aWxsIGJlIGhhbmRsaW5nIHR3ZWVuaW5nIHRoZSBudW1lcmljIHZhbHVlc1xuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gc2hhbGxvdyBpZiB0cnVlLCB0aGUgcmVzdWx0aW5nIGxpbmtlZCBsaXN0IGZyb20gdGhlIHBhcnNlIHdpbGwgTk9UIGJlIGF0dGFjaGVkIHRvIHRoZSBDU1NQcm9wVHdlZW4gdGhhdCB3YXMgcGFzc2VkIGluIGFzIHRoZSBcInB0XCIgKDR0aCkgcGFyYW1ldGVyLlxuXHRcdFx0ICogQHJldHVybiBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6IHByb3h5LCBlbmQsIGZpcnN0TVBULCBhbmQgcHQgKHNlZSBhYm92ZSBmb3IgZGVzY3JpcHRpb25zKVxuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VUb1Byb3h5ID0gX2ludGVybmFscy5fcGFyc2VUb1Byb3h5ID0gZnVuY3Rpb24odCwgdmFycywgY3NzcCwgcHQsIHBsdWdpbiwgc2hhbGxvdykge1xuXHRcdFx0XHR2YXIgYnB0ID0gcHQsXG5cdFx0XHRcdFx0c3RhcnQgPSB7fSxcblx0XHRcdFx0XHRlbmQgPSB7fSxcblx0XHRcdFx0XHR0cmFuc2Zvcm0gPSBjc3NwLl90cmFuc2Zvcm0sXG5cdFx0XHRcdFx0b2xkRm9yY2UgPSBfZm9yY2VQVCxcblx0XHRcdFx0XHRpLCBwLCB4cCwgbXB0LCBmaXJzdFBUO1xuXHRcdFx0XHRjc3NwLl90cmFuc2Zvcm0gPSBudWxsO1xuXHRcdFx0XHRfZm9yY2VQVCA9IHZhcnM7XG5cdFx0XHRcdHB0ID0gZmlyc3RQVCA9IGNzc3AucGFyc2UodCwgdmFycywgcHQsIHBsdWdpbik7XG5cdFx0XHRcdF9mb3JjZVBUID0gb2xkRm9yY2U7XG5cdFx0XHRcdC8vYnJlYWsgb2ZmIGZyb20gdGhlIGxpbmtlZCBsaXN0IHNvIHRoZSBuZXcgb25lcyBhcmUgaXNvbGF0ZWQuXG5cdFx0XHRcdGlmIChzaGFsbG93KSB7XG5cdFx0XHRcdFx0Y3NzcC5fdHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXHRcdFx0XHRcdGlmIChicHQpIHtcblx0XHRcdFx0XHRcdGJwdC5fcHJldiA9IG51bGw7XG5cdFx0XHRcdFx0XHRpZiAoYnB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0XHRcdGJwdC5fcHJldi5fbmV4dCA9IG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHdoaWxlIChwdCAmJiBwdCAhPT0gYnB0KSB7XG5cdFx0XHRcdFx0aWYgKHB0LnR5cGUgPD0gMSkge1xuXHRcdFx0XHRcdFx0cCA9IHB0LnA7XG5cdFx0XHRcdFx0XHRlbmRbcF0gPSBwdC5zICsgcHQuYztcblx0XHRcdFx0XHRcdHN0YXJ0W3BdID0gcHQucztcblx0XHRcdFx0XHRcdGlmICghc2hhbGxvdykge1xuXHRcdFx0XHRcdFx0XHRtcHQgPSBuZXcgTWluaVByb3BUd2VlbihwdCwgXCJzXCIsIHAsIG1wdCwgcHQucik7XG5cdFx0XHRcdFx0XHRcdHB0LmMgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHB0LnR5cGUgPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0aSA9IHB0Lmw7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0eHAgPSBcInhuXCIgKyBpO1xuXHRcdFx0XHRcdFx0XHRcdHAgPSBwdC5wICsgXCJfXCIgKyB4cDtcblx0XHRcdFx0XHRcdFx0XHRlbmRbcF0gPSBwdC5kYXRhW3hwXTtcblx0XHRcdFx0XHRcdFx0XHRzdGFydFtwXSA9IHB0W3hwXTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIXNoYWxsb3cpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG1wdCA9IG5ldyBNaW5pUHJvcFR3ZWVuKHB0LCB4cCwgcCwgbXB0LCBwdC5yeHBbeHBdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4ge3Byb3h5OnN0YXJ0LCBlbmQ6ZW5kLCBmaXJzdE1QVDptcHQsIHB0OmZpcnN0UFR9O1xuXHRcdFx0fSxcblxuXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQGNvbnN0cnVjdG9yIEVhY2ggcHJvcGVydHkgdGhhdCBpcyB0d2VlbmVkIGhhcyBhdCBsZWFzdCBvbmUgQ1NTUHJvcFR3ZWVuIGFzc29jaWF0ZWQgd2l0aCBpdC4gVGhlc2UgaW5zdGFuY2VzIHN0b3JlIGltcG9ydGFudCBpbmZvcm1hdGlvbiBsaWtlIHRoZSB0YXJnZXQsIHByb3BlcnR5LCBzdGFydGluZyB2YWx1ZSwgYW1vdW50IG9mIGNoYW5nZSwgZXRjLiBUaGV5IGNhbiBhbHNvIG9wdGlvbmFsbHkgaGF2ZSBhIG51bWJlciBvZiBcImV4dHJhXCIgc3RyaW5ncyBhbmQgbnVtZXJpYyB2YWx1ZXMgbmFtZWQgeHMxLCB4bjEsIHhzMiwgeG4yLCB4czMsIHhuMywgZXRjLiB3aGVyZSBcInNcIiBpbmRpY2F0ZXMgc3RyaW5nIGFuZCBcIm5cIiBpbmRpY2F0ZXMgbnVtYmVyLiBUaGVzZSBjYW4gYmUgcGllY2VkIHRvZ2V0aGVyIGluIGEgY29tcGxleC12YWx1ZSB0d2VlbiAodHlwZToxKSB0aGF0IGhhcyBhbHRlcm5hdGluZyB0eXBlcyBvZiBkYXRhIGxpa2UgYSBzdHJpbmcsIG51bWJlciwgc3RyaW5nLCBudW1iZXIsIGV0Yy4gRm9yIGV4YW1wbGUsIGJveFNoYWRvdyBjb3VsZCBiZSBcIjVweCA1cHggOHB4IHJnYigxMDIsIDEwMiwgNTEpXCIuIEluIHRoYXQgdmFsdWUsIHRoZXJlIGFyZSA2IG51bWJlcnMgdGhhdCBtYXkgbmVlZCB0byB0d2VlbiBhbmQgdGhlbiBwaWVjZWQgYmFjayB0b2dldGhlciBpbnRvIGEgc3RyaW5nIGFnYWluIHdpdGggc3BhY2VzLCBzdWZmaXhlcywgZXRjLiB4czAgaXMgc3BlY2lhbCBpbiB0aGF0IGl0IHN0b3JlcyB0aGUgc3VmZml4IGZvciBzdGFuZGFyZCAodHlwZTowKSB0d2VlbnMsIC1PUi0gdGhlIGZpcnN0IHN0cmluZyAocHJlZml4KSBpbiBhIGNvbXBsZXgtdmFsdWUgKHR5cGU6MSkgQ1NTUHJvcFR3ZWVuIC1PUi0gaXQgY2FuIGJlIHRoZSBub24tdHdlZW5pbmcgdmFsdWUgaW4gYSB0eXBlOi0xIENTU1Byb3BUd2Vlbi4gV2UgZG8gdGhpcyB0byBjb25zZXJ2ZSBtZW1vcnkuXG5cdFx0XHQgKiBDU1NQcm9wVHdlZW5zIGhhdmUgdGhlIGZvbGxvd2luZyBvcHRpb25hbCBwcm9wZXJ0aWVzIGFzIHdlbGwgKG5vdCBkZWZpbmVkIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yKTpcblx0XHRcdCAqICAtIGw6IExlbmd0aCBpbiB0ZXJtcyBvZiB0aGUgbnVtYmVyIG9mIGV4dHJhIHByb3BlcnRpZXMgdGhhdCB0aGUgQ1NTUHJvcFR3ZWVuIGhhcyAoZGVmYXVsdDogMCkuIEZvciBleGFtcGxlLCBmb3IgYSBib3hTaGFkb3cgd2UgbWF5IG5lZWQgdG8gdHdlZW4gNSBudW1iZXJzIGluIHdoaWNoIGNhc2UgbCB3b3VsZCBiZSA1OyBLZWVwIGluIG1pbmQgdGhhdCB0aGUgc3RhcnQvZW5kIHZhbHVlcyBmb3IgdGhlIGZpcnN0IG51bWJlciB0aGF0J3MgdHdlZW5lZCBhcmUgYWx3YXlzIHN0b3JlZCBpbiB0aGUgcyBhbmQgYyBwcm9wZXJ0aWVzIHRvIGNvbnNlcnZlIG1lbW9yeS4gQWxsIGFkZGl0aW9uYWwgdmFsdWVzIHRoZXJlYWZ0ZXIgYXJlIHN0b3JlZCBpbiB4bjEsIHhuMiwgZXRjLlxuXHRcdFx0ICogIC0geGZpcnN0OiBUaGUgZmlyc3QgaW5zdGFuY2Ugb2YgYW55IHN1Yi1DU1NQcm9wVHdlZW5zIHRoYXQgYXJlIHR3ZWVuaW5nIHByb3BlcnRpZXMgb2YgdGhpcyBpbnN0YW5jZS4gRm9yIGV4YW1wbGUsIHdlIG1heSBzcGxpdCB1cCBhIGJveFNoYWRvdyB0d2VlbiBzbyB0aGF0IHRoZXJlJ3MgYSBtYWluIENTU1Byb3BUd2VlbiBvZiB0eXBlOjEgdGhhdCBoYXMgdmFyaW91cyB4cyogYW5kIHhuKiB2YWx1ZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBoLXNoYWRvdywgdi1zaGFkb3csIGJsdXIsIGNvbG9yLCBldGMuIFRoZW4gd2Ugc3Bhd24gYSBDU1NQcm9wVHdlZW4gZm9yIGVhY2ggb2YgdGhvc2UgdGhhdCBoYXMgYSBoaWdoZXIgcHJpb3JpdHkgYW5kIHJ1bnMgQkVGT1JFIHRoZSBtYWluIENTU1Byb3BUd2VlbiBzbyB0aGF0IHRoZSB2YWx1ZXMgYXJlIGFsbCBzZXQgYnkgdGhlIHRpbWUgaXQgbmVlZHMgdG8gcmUtYXNzZW1ibGUgdGhlbS4gVGhlIHhmaXJzdCBnaXZlcyB1cyBhbiBlYXN5IHdheSB0byBpZGVudGlmeSB0aGUgZmlyc3Qgb25lIGluIHRoYXQgY2hhaW4gd2hpY2ggdHlwaWNhbGx5IGVuZHMgYXQgdGhlIG1haW4gb25lIChiZWNhdXNlIHRoZXkncmUgYWxsIHByZXBlbmRlIHRvIHRoZSBsaW5rZWQgbGlzdClcblx0XHRcdCAqICAtIHBsdWdpbjogVGhlIFR3ZWVuUGx1Z2luIGluc3RhbmNlIHRoYXQgd2lsbCBoYW5kbGUgdGhlIHR3ZWVuaW5nIG9mIGFueSBjb21wbGV4IHZhbHVlcy4gRm9yIGV4YW1wbGUsIHNvbWV0aW1lcyB3ZSBkb24ndCB3YW50IHRvIHVzZSBub3JtYWwgc3VidHdlZW5zIChsaWtlIHhmaXJzdCByZWZlcnMgdG8pIHRvIHR3ZWVuIHRoZSB2YWx1ZXMgLSB3ZSBtaWdodCB3YW50IFRocm93UHJvcHNQbHVnaW4gb3IgQmV6aWVyUGx1Z2luIHNvbWUgb3RoZXIgcGx1Z2luIHRvIGRvIHRoZSBhY3R1YWwgdHdlZW5pbmcsIHNvIHdlIGNyZWF0ZSBhIHBsdWdpbiBpbnN0YW5jZSBhbmQgc3RvcmUgYSByZWZlcmVuY2UgaGVyZS4gV2UgbmVlZCB0aGlzIHJlZmVyZW5jZSBzbyB0aGF0IGlmIHdlIGdldCBhIHJlcXVlc3QgdG8gcm91bmQgdmFsdWVzIG9yIGRpc2FibGUgYSB0d2Vlbiwgd2UgY2FuIHBhc3MgYWxvbmcgdGhhdCByZXF1ZXN0LlxuXHRcdFx0ICogIC0gZGF0YTogQXJiaXRyYXJ5IGRhdGEgdGhhdCBuZWVkcyB0byBiZSBzdG9yZWQgd2l0aCB0aGUgQ1NTUHJvcFR3ZWVuLiBUeXBpY2FsbHkgaWYgd2UncmUgZ29pbmcgdG8gaGF2ZSBhIHBsdWdpbiBoYW5kbGUgdGhlIHR3ZWVuaW5nIG9mIGEgY29tcGxleC12YWx1ZSB0d2Vlbiwgd2UgY3JlYXRlIGEgZ2VuZXJpYyBvYmplY3QgdGhhdCBzdG9yZXMgdGhlIEVORCB2YWx1ZXMgdGhhdCB3ZSdyZSB0d2VlbmluZyB0byBhbmQgdGhlIENTU1Byb3BUd2VlbidzIHhzMSwgeHMyLCBldGMuIGhhdmUgdGhlIHN0YXJ0aW5nIHZhbHVlcy4gV2Ugc3RvcmUgdGhhdCBvYmplY3QgYXMgZGF0YS4gVGhhdCB3YXksIHdlIGNhbiBzaW1wbHkgcGFzcyB0aGF0IG9iamVjdCB0byB0aGUgcGx1Z2luIGFuZCB1c2UgdGhlIENTU1Byb3BUd2VlbiBhcyB0aGUgdGFyZ2V0LlxuXHRcdFx0ICogIC0gc2V0UmF0aW86IE9ubHkgdXNlZCBmb3IgdHlwZToyIHR3ZWVucyB0aGF0IHJlcXVpcmUgY3VzdG9tIGZ1bmN0aW9uYWxpdHkuIEluIHRoaXMgY2FzZSwgd2UgY2FsbCB0aGUgQ1NTUHJvcFR3ZWVuJ3Mgc2V0UmF0aW8oKSBtZXRob2QgYW5kIHBhc3MgdGhlIHJhdGlvIGVhY2ggdGltZSB0aGUgdHdlZW4gdXBkYXRlcy4gVGhpcyBpc24ndCBxdWl0ZSBhcyBlZmZpY2llbnQgYXMgZG9pbmcgdGhpbmdzIGRpcmVjdGx5IGluIHRoZSBDU1NQbHVnaW4ncyBzZXRSYXRpbygpIG1ldGhvZCwgYnV0IGl0J3MgdmVyeSBjb252ZW5pZW50IGFuZCBmbGV4aWJsZS5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgb2JqZWN0IHdob3NlIHByb3BlcnR5IHdpbGwgYmUgdHdlZW5lZC4gT2Z0ZW4gYSBET00gZWxlbWVudCwgYnV0IG5vdCBhbHdheXMuIEl0IGNvdWxkIGJlIGFueXRoaW5nLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmd9IHAgUHJvcGVydHkgdG8gdHdlZW4gKG5hbWUpLiBGb3IgZXhhbXBsZSwgdG8gdHdlZW4gZWxlbWVudC53aWR0aCwgcCB3b3VsZCBiZSBcIndpZHRoXCIuXG5cdFx0XHQgKiBAcGFyYW0ge251bWJlcn0gcyBTdGFydGluZyBudW1lcmljIHZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge251bWJlcn0gYyBDaGFuZ2UgaW4gbnVtZXJpYyB2YWx1ZSBvdmVyIHRoZSBjb3Vyc2Ugb2YgdGhlIGVudGlyZSB0d2Vlbi4gRm9yIGV4YW1wbGUsIGlmIGVsZW1lbnQud2lkdGggc3RhcnRzIGF0IDUgYW5kIHNob3VsZCBlbmQgYXQgMTAwLCBjIHdvdWxkIGJlIDk1LlxuXHRcdFx0ICogQHBhcmFtIHtDU1NQcm9wVHdlZW49fSBuZXh0IFRoZSBuZXh0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3QuIElmIG9uZSBpcyBkZWZpbmVkLCB3ZSB3aWxsIGRlZmluZSBpdHMgX3ByZXYgYXMgdGhlIG5ldyBpbnN0YW5jZSwgYW5kIHRoZSBuZXcgaW5zdGFuY2UncyBfbmV4dCB3aWxsIGJlIHBvaW50ZWQgYXQgaXQuXG5cdFx0XHQgKiBAcGFyYW0ge251bWJlcj19IHR5cGUgVGhlIHR5cGUgb2YgQ1NTUHJvcFR3ZWVuIHdoZXJlIC0xID0gYSBub24tdHdlZW5pbmcgdmFsdWUsIDAgPSBhIHN0YW5kYXJkIHNpbXBsZSB0d2VlbiwgMSA9IGEgY29tcGxleCB2YWx1ZSAobGlrZSBvbmUgdGhhdCBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbiBhIGNvbW1hLSBvciBzcGFjZS1kZWxpbWl0ZWQgc3RyaW5nIGxpa2UgYm9yZGVyOlwiMXB4IHNvbGlkIHJlZFwiKSwgYW5kIDIgPSBvbmUgdGhhdCB1c2VzIGEgY3VzdG9tIHNldFJhdGlvIGZ1bmN0aW9uIHRoYXQgZG9lcyBhbGwgb2YgdGhlIHdvcmsgb2YgYXBwbHlpbmcgdGhlIHZhbHVlcyBvbiBlYWNoIHVwZGF0ZS5cblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gbiBOYW1lIG9mIHRoZSBwcm9wZXJ0eSB0aGF0IHNob3VsZCBiZSB1c2VkIGZvciBvdmVyd3JpdGluZyBwdXJwb3NlcyB3aGljaCBpcyB0eXBpY2FsbHkgdGhlIHNhbWUgYXMgcCBidXQgbm90IGFsd2F5cy4gRm9yIGV4YW1wbGUsIHdlIG1heSBuZWVkIHRvIGNyZWF0ZSBhIHN1YnR3ZWVuIGZvciB0aGUgMm5kIHBhcnQgb2YgYSBcImNsaXA6cmVjdCguLi4pXCIgdHdlZW4gaW4gd2hpY2ggY2FzZSBcInBcIiBtaWdodCBiZSB4czEgYnV0IFwiblwiIGlzIHN0aWxsIFwiY2xpcFwiXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSByIElmIHRydWUsIHRoZSB2YWx1ZShzKSBzaG91bGQgYmUgcm91bmRlZFxuXHRcdFx0ICogQHBhcmFtIHtudW1iZXI9fSBwciBQcmlvcml0eSBpbiB0aGUgbGlua2VkIGxpc3Qgb3JkZXIuIEhpZ2hlciBwcmlvcml0eSBDU1NQcm9wVHdlZW5zIHdpbGwgYmUgdXBkYXRlZCBiZWZvcmUgbG93ZXIgcHJpb3JpdHkgb25lcy4gVGhlIGRlZmF1bHQgcHJpb3JpdHkgaXMgMC5cblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gYiBCZWdpbm5pbmcgdmFsdWUuIFdlIHN0b3JlIHRoaXMgdG8gZW5zdXJlIHRoYXQgaXQgaXMgRVhBQ1RMWSB3aGF0IGl0IHdhcyB3aGVuIHRoZSB0d2VlbiBiZWdhbiB3aXRob3V0IGFueSByaXNrIG9mIGludGVycHJldGF0aW9uIGlzc3Vlcy5cblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gZSBFbmRpbmcgdmFsdWUuIFdlIHN0b3JlIHRoaXMgdG8gZW5zdXJlIHRoYXQgaXQgaXMgRVhBQ1RMWSB3aGF0IHRoZSB1c2VyIGRlZmluZWQgYXQgdGhlIGVuZCBvZiB0aGUgdHdlZW4gd2l0aG91dCBhbnkgcmlzayBvZiBpbnRlcnByZXRhdGlvbiBpc3N1ZXMuXG5cdFx0XHQgKi9cblx0XHRcdENTU1Byb3BUd2VlbiA9IF9pbnRlcm5hbHMuQ1NTUHJvcFR3ZWVuID0gZnVuY3Rpb24odCwgcCwgcywgYywgbmV4dCwgdHlwZSwgbiwgciwgcHIsIGIsIGUpIHtcblx0XHRcdFx0dGhpcy50ID0gdDsgLy90YXJnZXRcblx0XHRcdFx0dGhpcy5wID0gcDsgLy9wcm9wZXJ0eVxuXHRcdFx0XHR0aGlzLnMgPSBzOyAvL3N0YXJ0aW5nIHZhbHVlXG5cdFx0XHRcdHRoaXMuYyA9IGM7IC8vY2hhbmdlIHZhbHVlXG5cdFx0XHRcdHRoaXMubiA9IG4gfHwgcDsgLy9uYW1lIHRoYXQgdGhpcyBDU1NQcm9wVHdlZW4gc2hvdWxkIGJlIGFzc29jaWF0ZWQgdG8gKHVzdWFsbHkgdGhlIHNhbWUgYXMgcCwgYnV0IG5vdCBhbHdheXMgLSBuIGlzIHdoYXQgb3ZlcndyaXRpbmcgbG9va3MgYXQpXG5cdFx0XHRcdGlmICghKHQgaW5zdGFuY2VvZiBDU1NQcm9wVHdlZW4pKSB7XG5cdFx0XHRcdFx0X292ZXJ3cml0ZVByb3BzLnB1c2godGhpcy5uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnIgPSByOyAvL3JvdW5kIChib29sZWFuKVxuXHRcdFx0XHR0aGlzLnR5cGUgPSB0eXBlIHx8IDA7IC8vMCA9IG5vcm1hbCB0d2VlbiwgLTEgPSBub24tdHdlZW5pbmcgKGluIHdoaWNoIGNhc2UgeHMwIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgdGFyZ2V0J3MgcHJvcGVydHksIGxpa2UgdHAudFt0cC5wXSA9IHRwLnhzMCksIDEgPSBjb21wbGV4LXZhbHVlIFNwZWNpYWxQcm9wLCAyID0gY3VzdG9tIHNldFJhdGlvKCkgdGhhdCBkb2VzIGFsbCB0aGUgd29ya1xuXHRcdFx0XHRpZiAocHIpIHtcblx0XHRcdFx0XHR0aGlzLnByID0gcHI7XG5cdFx0XHRcdFx0X2hhc1ByaW9yaXR5ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmIgPSAoYiA9PT0gdW5kZWZpbmVkKSA/IHMgOiBiO1xuXHRcdFx0XHR0aGlzLmUgPSAoZSA9PT0gdW5kZWZpbmVkKSA/IHMgKyBjIDogZTtcblx0XHRcdFx0aWYgKG5leHQpIHtcblx0XHRcdFx0XHR0aGlzLl9uZXh0ID0gbmV4dDtcblx0XHRcdFx0XHRuZXh0Ll9wcmV2ID0gdGhpcztcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0X2FkZE5vblR3ZWVuaW5nTnVtZXJpY1BUID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wLCBzdGFydCwgZW5kLCBuZXh0LCBvdmVyd3JpdGVQcm9wKSB7IC8vY2xlYW5zIHVwIHNvbWUgY29kZSByZWR1bmRhbmNpZXMgYW5kIGhlbHBzIG1pbmlmaWNhdGlvbi4gSnVzdCBhIGZhc3Qgd2F5IHRvIGFkZCBhIE5VTUVSSUMgbm9uLXR3ZWVuaW5nIENTU1Byb3BUd2VlblxuXHRcdFx0XHR2YXIgcHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHRhcmdldCwgcHJvcCwgc3RhcnQsIGVuZCAtIHN0YXJ0LCBuZXh0LCAtMSwgb3ZlcndyaXRlUHJvcCk7XG5cdFx0XHRcdHB0LmIgPSBzdGFydDtcblx0XHRcdFx0cHQuZSA9IHB0LnhzMCA9IGVuZDtcblx0XHRcdFx0cmV0dXJuIHB0O1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBUYWtlcyBhIHRhcmdldCwgdGhlIGJlZ2lubmluZyB2YWx1ZSBhbmQgZW5kaW5nIHZhbHVlIChhcyBzdHJpbmdzKSBhbmQgcGFyc2VzIHRoZW0gaW50byBhIENTU1Byb3BUd2VlbiAocG9zc2libHkgd2l0aCBjaGlsZCBDU1NQcm9wVHdlZW5zKSB0aGF0IGFjY29tbW9kYXRlcyBtdWx0aXBsZSBudW1iZXJzLCBjb2xvcnMsIGNvbW1hLWRlbGltaXRlZCB2YWx1ZXMsIGV0Yy4gRm9yIGV4YW1wbGU6XG5cdFx0XHQgKiBzcC5wYXJzZUNvbXBsZXgoZWxlbWVudCwgXCJib3hTaGFkb3dcIiwgXCI1cHggMTBweCAyMHB4IHJnYigyNTUsMTAyLDUxKVwiLCBcIjBweCAwcHggMHB4IHJlZFwiLCB0cnVlLCBcIjBweCAwcHggMHB4IHJnYigwLDAsMCwwKVwiLCBwdCk7XG5cdFx0XHQgKiBJdCB3aWxsIHdhbGsgdGhyb3VnaCB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzICh3aGljaCBzaG91bGQgYmUgaW4gdGhlIHNhbWUgZm9ybWF0IHdpdGggdGhlIHNhbWUgbnVtYmVyIGFuZCB0eXBlIG9mIHZhbHVlcykgYW5kIGZpZ3VyZSBvdXQgd2hpY2ggcGFydHMgYXJlIG51bWJlcnMsIHdoYXQgc3RyaW5ncyBzZXBhcmF0ZSB0aGUgbnVtZXJpYy90d2VlbmFibGUgdmFsdWVzLCBhbmQgdGhlbiBjcmVhdGUgdGhlIENTU1Byb3BUd2VlbnMgYWNjb3JkaW5nbHkuIElmIGEgcGx1Z2luIGlzIGRlZmluZWQsIG5vIGNoaWxkIENTU1Byb3BUd2VlbnMgd2lsbCBiZSBjcmVhdGVkLiBJbnN0ZWFkLCB0aGUgZW5kaW5nIHZhbHVlcyB3aWxsIGJlIHN0b3JlZCBpbiB0aGUgXCJkYXRhXCIgcHJvcGVydHkgb2YgdGhlIHJldHVybmVkIENTU1Byb3BUd2VlbiBsaWtlOiB7czotNSwgeG4xOi0xMCwgeG4yOi0yMCwgeG4zOjI1NSwgeG40OjAsIHhuNTowfSBzbyB0aGF0IGl0IGNhbiBiZSBmZWQgdG8gYW55IG90aGVyIHBsdWdpbiBhbmQgaXQnbGwgYmUgcGxhaW4gbnVtZXJpYyB0d2VlbnMgYnV0IHRoZSByZWNvbXBvc2l0aW9uIG9mIHRoZSBjb21wbGV4IHZhbHVlIHdpbGwgYmUgaGFuZGxlZCBpbnNpZGUgQ1NTUGx1Z2luJ3Mgc2V0UmF0aW8oKS5cblx0XHRcdCAqIElmIGEgc2V0UmF0aW8gaXMgZGVmaW5lZCwgdGhlIHR5cGUgb2YgdGhlIENTU1Byb3BUd2VlbiB3aWxsIGJlIHNldCB0byAyIGFuZCByZWNvbXBvc2l0aW9uIG9mIHRoZSB2YWx1ZXMgd2lsbCBiZSB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhhdCBtZXRob2QuXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCB3aG9zZSBwcm9wZXJ0eSB3aWxsIGJlIHR3ZWVuZWRcblx0XHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gcCBQcm9wZXJ0eSB0aGF0IHdpbGwgYmUgdHdlZW5lZCAoaXRzIG5hbWUsIGxpa2UgXCJsZWZ0XCIgb3IgXCJiYWNrZ3JvdW5kQ29sb3JcIiBvciBcImJveFNoYWRvd1wiKVxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmd9IGIgQmVnaW5uaW5nIHZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gZSBFbmRpbmcgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gY2xycyBJZiB0cnVlLCB0aGUgdmFsdWUgY291bGQgY29udGFpbiBhIGNvbG9yIHZhbHVlIGxpa2UgXCJyZ2IoMjU1LDAsMClcIiBvciBcIiNGMDBcIiBvciBcInJlZFwiLiBUaGUgZGVmYXVsdCBpcyBmYWxzZSwgc28gbm8gY29sb3JzIHdpbGwgYmUgcmVjb2duaXplZCAoYSBwZXJmb3JtYW5jZSBvcHRpbWl6YXRpb24pXG5cdFx0XHQgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyfE9iamVjdCl9IGRmbHQgVGhlIGRlZmF1bHQgYmVnaW5uaW5nIHZhbHVlIHRoYXQgc2hvdWxkIGJlIHVzZWQgaWYgbm8gdmFsaWQgYmVnaW5uaW5nIHZhbHVlIGlzIGRlZmluZWQgb3IgaWYgdGhlIG51bWJlciBvZiB2YWx1ZXMgaW5zaWRlIHRoZSBjb21wbGV4IGJlZ2lubmluZyBhbmQgZW5kaW5nIHZhbHVlcyBkb24ndCBtYXRjaFxuXHRcdFx0ICogQHBhcmFtIHs/Q1NTUHJvcFR3ZWVufSBwdCBDU1NQcm9wVHdlZW4gaW5zdGFuY2UgdGhhdCBpcyB0aGUgY3VycmVudCBoZWFkIG9mIHRoZSBsaW5rZWQgbGlzdCAod2UnbGwgcHJlcGVuZCB0byB0aGlzKS5cblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyPX0gcHIgUHJpb3JpdHkgaW4gdGhlIGxpbmtlZCBsaXN0IG9yZGVyLiBIaWdoZXIgcHJpb3JpdHkgcHJvcGVydGllcyB3aWxsIGJlIHVwZGF0ZWQgYmVmb3JlIGxvd2VyIHByaW9yaXR5IG9uZXMuIFRoZSBkZWZhdWx0IHByaW9yaXR5IGlzIDAuXG5cdFx0XHQgKiBAcGFyYW0ge1R3ZWVuUGx1Z2luPX0gcGx1Z2luIElmIGEgcGx1Z2luIHNob3VsZCBoYW5kbGUgdGhlIHR3ZWVuaW5nIG9mIGV4dHJhIHByb3BlcnRpZXMsIHBhc3MgdGhlIHBsdWdpbiBpbnN0YW5jZSBoZXJlLiBJZiBvbmUgaXMgZGVmaW5lZCwgdGhlbiBOTyBzdWJ0d2VlbnMgd2lsbCBiZSBjcmVhdGVkIGZvciBhbnkgZXh0cmEgcHJvcGVydGllcyAodGhlIHByb3BlcnRpZXMgd2lsbCBiZSBjcmVhdGVkIC0ganVzdCBub3QgYWRkaXRpb25hbCBDU1NQcm9wVHdlZW4gaW5zdGFuY2VzIHRvIHR3ZWVuIHRoZW0pIGJlY2F1c2UgdGhlIHBsdWdpbiBpcyBleHBlY3RlZCB0byBkbyBzby4gSG93ZXZlciwgdGhlIGVuZCB2YWx1ZXMgV0lMTCBiZSBwb3B1bGF0ZWQgaW4gdGhlIFwiZGF0YVwiIHByb3BlcnR5LCBsaWtlIHtzOjEwMCwgeG4xOjUwLCB4bjI6MzAwfVxuXHRcdFx0ICogQHBhcmFtIHtmdW5jdGlvbihudW1iZXIpPX0gc2V0UmF0aW8gSWYgdmFsdWVzIHNob3VsZCBiZSBzZXQgaW4gYSBjdXN0b20gZnVuY3Rpb24gaW5zdGVhZCBvZiBiZWluZyBwaWVjZWQgdG9nZXRoZXIgaW4gYSB0eXBlOjEgKGNvbXBsZXgtdmFsdWUpIENTU1Byb3BUd2VlbiwgZGVmaW5lIHRoYXQgY3VzdG9tIGZ1bmN0aW9uIGhlcmUuXG5cdFx0XHQgKiBAcmV0dXJuIHtDU1NQcm9wVHdlZW59IFRoZSBmaXJzdCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0IHdoaWNoIGluY2x1ZGVzIHRoZSBuZXcgb25lKHMpIGFkZGVkIGJ5IHRoZSBwYXJzZUNvbXBsZXgoKSBjYWxsLlxuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VDb21wbGV4ID0gQ1NTUGx1Z2luLnBhcnNlQ29tcGxleCA9IGZ1bmN0aW9uKHQsIHAsIGIsIGUsIGNscnMsIGRmbHQsIHB0LCBwciwgcGx1Z2luLCBzZXRSYXRpbykge1xuXHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwicGFyc2VDb21wbGV4OiBcIitwK1wiLCBiOiBcIitiK1wiLCBlOiBcIitlKTtcblx0XHRcdFx0YiA9IGIgfHwgZGZsdCB8fCBcIlwiO1xuXHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRlID0gZShfaW5kZXgsIF90YXJnZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgKHNldFJhdGlvID8gMiA6IDEpLCBudWxsLCBmYWxzZSwgcHIsIGIsIGUpO1xuXHRcdFx0XHRlICs9IFwiXCI7IC8vZW5zdXJlcyBpdCdzIGEgc3RyaW5nXG5cdFx0XHRcdGlmIChjbHJzICYmIF9jb2xvckV4cC50ZXN0KGUgKyBiKSkgeyAvL2lmIGNvbG9ycyBhcmUgZm91bmQsIG5vcm1hbGl6ZSB0aGUgZm9ybWF0dGluZyB0byByZ2JhKCkgb3IgaHNsYSgpLlxuXHRcdFx0XHRcdGUgPSBbYiwgZV07XG5cdFx0XHRcdFx0Q1NTUGx1Z2luLmNvbG9yU3RyaW5nRmlsdGVyKGUpO1xuXHRcdFx0XHRcdGIgPSBlWzBdO1xuXHRcdFx0XHRcdGUgPSBlWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBiYSA9IGIuc3BsaXQoXCIsIFwiKS5qb2luKFwiLFwiKS5zcGxpdChcIiBcIiksIC8vYmVnaW5uaW5nIGFycmF5XG5cdFx0XHRcdFx0ZWEgPSBlLnNwbGl0KFwiLCBcIikuam9pbihcIixcIikuc3BsaXQoXCIgXCIpLCAvL2VuZGluZyBhcnJheVxuXHRcdFx0XHRcdGwgPSBiYS5sZW5ndGgsXG5cdFx0XHRcdFx0YXV0b1JvdW5kID0gKF9hdXRvUm91bmQgIT09IGZhbHNlKSxcblx0XHRcdFx0XHRpLCB4aSwgbmksIGJ2LCBldiwgYm51bXMsIGVudW1zLCBibiwgaGFzQWxwaGEsIHRlbXAsIGN2LCBzdHIsIHVzZUhTTDtcblx0XHRcdFx0aWYgKGUuaW5kZXhPZihcIixcIikgIT09IC0xIHx8IGIuaW5kZXhPZihcIixcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0YmEgPSBiYS5qb2luKFwiIFwiKS5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwiLCBcIikuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGVhID0gZWEuam9pbihcIiBcIikucmVwbGFjZShfY29tbWFzT3V0c2lkZVBhcmVuRXhwLCBcIiwgXCIpLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRsID0gYmEubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChsICE9PSBlYS5sZW5ndGgpIHtcblx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwibWlzbWF0Y2hlZCBmb3JtYXR0aW5nIGRldGVjdGVkIG9uIFwiICsgcCArIFwiIChcIiArIGIgKyBcIiB2cyBcIiArIGUgKyBcIilcIik7XG5cdFx0XHRcdFx0YmEgPSAoZGZsdCB8fCBcIlwiKS5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0bCA9IGJhLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdHB0LnNldFJhdGlvID0gc2V0UmF0aW87XG5cdFx0XHRcdF9jb2xvckV4cC5sYXN0SW5kZXggPSAwO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0YnYgPSBiYVtpXTtcblx0XHRcdFx0XHRldiA9IGVhW2ldO1xuXHRcdFx0XHRcdGJuID0gcGFyc2VGbG9hdChidik7XG5cdFx0XHRcdFx0Ly9pZiB0aGUgdmFsdWUgYmVnaW5zIHdpdGggYSBudW1iZXIgKG1vc3QgY29tbW9uKS4gSXQncyBmaW5lIGlmIGl0IGhhcyBhIHN1ZmZpeCBsaWtlIHB4XG5cdFx0XHRcdFx0aWYgKGJuIHx8IGJuID09PSAwKSB7XG5cdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKFwiXCIsIGJuLCBfcGFyc2VDaGFuZ2UoZXYsIGJuKSwgZXYucmVwbGFjZShfcmVsTnVtRXhwLCBcIlwiKSwgKGF1dG9Sb3VuZCAmJiBldi5pbmRleE9mKFwicHhcIikgIT09IC0xKSwgdHJ1ZSk7XG5cblx0XHRcdFx0XHQvL2lmIHRoZSB2YWx1ZSBpcyBhIGNvbG9yXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjbHJzICYmIF9jb2xvckV4cC50ZXN0KGJ2KSkge1xuXHRcdFx0XHRcdFx0c3RyID0gZXYuaW5kZXhPZihcIilcIikgKyAxO1xuXHRcdFx0XHRcdFx0c3RyID0gXCIpXCIgKyAoc3RyID8gZXYuc3Vic3RyKHN0cikgOiBcIlwiKTsgLy9pZiB0aGVyZSdzIGEgY29tbWEgb3IgKSBhdCB0aGUgZW5kLCByZXRhaW4gaXQuXG5cdFx0XHRcdFx0XHR1c2VIU0wgPSAoZXYuaW5kZXhPZihcImhzbFwiKSAhPT0gLTEgJiYgX3N1cHBvcnRzT3BhY2l0eSk7XG5cdFx0XHRcdFx0XHRidiA9IF9wYXJzZUNvbG9yKGJ2LCB1c2VIU0wpO1xuXHRcdFx0XHRcdFx0ZXYgPSBfcGFyc2VDb2xvcihldiwgdXNlSFNMKTtcblx0XHRcdFx0XHRcdGhhc0FscGhhID0gKGJ2Lmxlbmd0aCArIGV2Lmxlbmd0aCA+IDYpO1xuXHRcdFx0XHRcdFx0aWYgKGhhc0FscGhhICYmICFfc3VwcG9ydHNPcGFjaXR5ICYmIGV2WzNdID09PSAwKSB7IC8vb2xkZXIgdmVyc2lvbnMgb2YgSUUgZG9uJ3Qgc3VwcG9ydCByZ2JhKCksIHNvIGlmIHRoZSBkZXN0aW5hdGlvbiBhbHBoYSBpcyAwLCBqdXN0IHVzZSBcInRyYW5zcGFyZW50XCIgZm9yIHRoZSBlbmQgY29sb3Jcblx0XHRcdFx0XHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gKz0gcHQubCA/IFwiIHRyYW5zcGFyZW50XCIgOiBcInRyYW5zcGFyZW50XCI7XG5cdFx0XHRcdFx0XHRcdHB0LmUgPSBwdC5lLnNwbGl0KGVhW2ldKS5qb2luKFwidHJhbnNwYXJlbnRcIik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAoIV9zdXBwb3J0c09wYWNpdHkpIHsgLy9vbGQgdmVyc2lvbnMgb2YgSUUgZG9uJ3Qgc3VwcG9ydCByZ2JhKCkuXG5cdFx0XHRcdFx0XHRcdFx0aGFzQWxwaGEgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAodXNlSFNMKSB7XG5cdFx0XHRcdFx0XHRcdFx0cHQuYXBwZW5kWHRyYSgoaGFzQWxwaGEgPyBcImhzbGEoXCIgOiBcImhzbChcIiksIGJ2WzBdLCBfcGFyc2VDaGFuZ2UoZXZbMF0sIGJ2WzBdKSwgXCIsXCIsIGZhbHNlLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMV0sIF9wYXJzZUNoYW5nZShldlsxXSwgYnZbMV0pLCBcIiUsXCIsIGZhbHNlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMl0sIF9wYXJzZUNoYW5nZShldlsyXSwgYnZbMl0pLCAoaGFzQWxwaGEgPyBcIiUsXCIgOiBcIiVcIiArIHN0ciksIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKChoYXNBbHBoYSA/IFwicmdiYShcIiA6IFwicmdiKFwiKSwgYnZbMF0sIGV2WzBdIC0gYnZbMF0sIFwiLFwiLCB0cnVlLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMV0sIGV2WzFdIC0gYnZbMV0sIFwiLFwiLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMl0sIGV2WzJdIC0gYnZbMl0sIChoYXNBbHBoYSA/IFwiLFwiIDogc3RyKSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoaGFzQWxwaGEpIHtcblx0XHRcdFx0XHRcdFx0XHRidiA9IChidi5sZW5ndGggPCA0KSA/IDEgOiBidlszXTtcblx0XHRcdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKFwiXCIsIGJ2LCAoKGV2Lmxlbmd0aCA8IDQpID8gMSA6IGV2WzNdKSAtIGJ2LCBzdHIsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0X2NvbG9yRXhwLmxhc3RJbmRleCA9IDA7IC8vb3RoZXJ3aXNlIHRoZSB0ZXN0KCkgb24gdGhlIFJlZ0V4cCBjb3VsZCBtb3ZlIHRoZSBsYXN0SW5kZXggYW5kIHRhaW50IGZ1dHVyZSByZXN1bHRzLlxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJudW1zID0gYnYubWF0Y2goX251bUV4cCk7IC8vZ2V0cyBlYWNoIGdyb3VwIG9mIG51bWJlcnMgaW4gdGhlIGJlZ2lubmluZyB2YWx1ZSBzdHJpbmcgYW5kIGRyb3BzIHRoZW0gaW50byBhbiBhcnJheVxuXG5cdFx0XHRcdFx0XHQvL2lmIG5vIG51bWJlciBpcyBmb3VuZCwgdHJlYXQgaXQgYXMgYSBub24tdHdlZW5pbmcgdmFsdWUgYW5kIGp1c3QgYXBwZW5kIHRoZSBzdHJpbmcgdG8gdGhlIGN1cnJlbnQgeHMuXG5cdFx0XHRcdFx0XHRpZiAoIWJudW1zKSB7XG5cdFx0XHRcdFx0XHRcdHB0W1wieHNcIiArIHB0LmxdICs9IChwdC5sIHx8IHB0W1wieHNcIiArIHB0LmxdKSA/IFwiIFwiICsgZXYgOiBldjtcblxuXHRcdFx0XHRcdFx0Ly9sb29wIHRocm91Z2ggYWxsIHRoZSBudW1iZXJzIHRoYXQgYXJlIGZvdW5kIGFuZCBjb25zdHJ1Y3QgdGhlIGV4dHJhIHZhbHVlcyBvbiB0aGUgcHQuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRlbnVtcyA9IGV2Lm1hdGNoKF9yZWxOdW1FeHApOyAvL2dldCBlYWNoIGdyb3VwIG9mIG51bWJlcnMgaW4gdGhlIGVuZCB2YWx1ZSBzdHJpbmcgYW5kIGRyb3AgdGhlbSBpbnRvIGFuIGFycmF5LiBXZSBhbGxvdyByZWxhdGl2ZSB2YWx1ZXMgdG9vLCBsaWtlICs9NTAgb3IgLT0uNVxuXHRcdFx0XHRcdFx0XHRpZiAoIWVudW1zIHx8IGVudW1zLmxlbmd0aCAhPT0gYm51bXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly9ERUJVRzogX2xvZyhcIm1pc21hdGNoZWQgZm9ybWF0dGluZyBkZXRlY3RlZCBvbiBcIiArIHAgKyBcIiAoXCIgKyBiICsgXCIgdnMgXCIgKyBlICsgXCIpXCIpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRuaSA9IDA7XG5cdFx0XHRcdFx0XHRcdGZvciAoeGkgPSAwOyB4aSA8IGJudW1zLmxlbmd0aDsgeGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGN2ID0gYm51bXNbeGldO1xuXHRcdFx0XHRcdFx0XHRcdHRlbXAgPSBidi5pbmRleE9mKGN2LCBuaSk7XG5cdFx0XHRcdFx0XHRcdFx0cHQuYXBwZW5kWHRyYShidi5zdWJzdHIobmksIHRlbXAgLSBuaSksIE51bWJlcihjdiksIF9wYXJzZUNoYW5nZShlbnVtc1t4aV0sIGN2KSwgXCJcIiwgKGF1dG9Sb3VuZCAmJiBidi5zdWJzdHIodGVtcCArIGN2Lmxlbmd0aCwgMikgPT09IFwicHhcIiksICh4aSA9PT0gMCkpO1xuXHRcdFx0XHRcdFx0XHRcdG5pID0gdGVtcCArIGN2Lmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwdFtcInhzXCIgKyBwdC5sXSArPSBidi5zdWJzdHIobmkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvL2lmIHRoZXJlIGFyZSByZWxhdGl2ZSB2YWx1ZXMgKFwiKz1cIiBvciBcIi09XCIgcHJlZml4KSwgd2UgbmVlZCB0byBhZGp1c3QgdGhlIGVuZGluZyB2YWx1ZSB0byBlbGltaW5hdGUgdGhlIHByZWZpeGVzIGFuZCBjb21iaW5lIHRoZSB2YWx1ZXMgcHJvcGVybHkuXG5cdFx0XHRcdGlmIChlLmluZGV4T2YoXCI9XCIpICE9PSAtMSkgaWYgKHB0LmRhdGEpIHtcblx0XHRcdFx0XHRzdHIgPSBwdC54czAgKyBwdC5kYXRhLnM7XG5cdFx0XHRcdFx0Zm9yIChpID0gMTsgaSA8IHB0Lmw7IGkrKykge1xuXHRcdFx0XHRcdFx0c3RyICs9IHB0W1wieHNcIiArIGldICsgcHQuZGF0YVtcInhuXCIgKyBpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQuZSA9IHN0ciArIHB0W1wieHNcIiArIGldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghcHQubCkge1xuXHRcdFx0XHRcdHB0LnR5cGUgPSAtMTtcblx0XHRcdFx0XHRwdC54czAgPSBwdC5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwdC54Zmlyc3QgfHwgcHQ7XG5cdFx0XHR9LFxuXHRcdFx0aSA9IDk7XG5cblxuXHRcdHAgPSBDU1NQcm9wVHdlZW4ucHJvdG90eXBlO1xuXHRcdHAubCA9IHAucHIgPSAwOyAvL2xlbmd0aCAobnVtYmVyIG9mIGV4dHJhIHByb3BlcnRpZXMgbGlrZSB4bjEsIHhuMiwgeG4zLCBldGMuXG5cdFx0d2hpbGUgKC0taSA+IDApIHtcblx0XHRcdHBbXCJ4blwiICsgaV0gPSAwO1xuXHRcdFx0cFtcInhzXCIgKyBpXSA9IFwiXCI7XG5cdFx0fVxuXHRcdHAueHMwID0gXCJcIjtcblx0XHRwLl9uZXh0ID0gcC5fcHJldiA9IHAueGZpcnN0ID0gcC5kYXRhID0gcC5wbHVnaW4gPSBwLnNldFJhdGlvID0gcC5yeHAgPSBudWxsO1xuXG5cblx0XHQvKipcblx0XHQgKiBBcHBlbmRzIGFuZCBleHRyYSB0d2VlbmluZyB2YWx1ZSB0byBhIENTU1Byb3BUd2VlbiBhbmQgYXV0b21hdGljYWxseSBtYW5hZ2VzIGFueSBwcmVmaXggYW5kIHN1ZmZpeCBzdHJpbmdzLiBUaGUgZmlyc3QgZXh0cmEgdmFsdWUgaXMgc3RvcmVkIGluIHRoZSBzIGFuZCBjIG9mIHRoZSBtYWluIENTU1Byb3BUd2VlbiBpbnN0YW5jZSwgYnV0IHRoZXJlYWZ0ZXIgYW55IGV4dHJhcyBhcmUgc3RvcmVkIGluIHRoZSB4bjEsIHhuMiwgeG4zLCBldGMuIFRoZSBwcmVmaXhlcyBhbmQgc3VmZml4ZXMgYXJlIHN0b3JlZCBpbiB0aGUgeHMwLCB4czEsIHhzMiwgZXRjLiBwcm9wZXJ0aWVzLiBGb3IgZXhhbXBsZSwgaWYgSSB3YWxrIHRocm91Z2ggYSBjbGlwIHZhbHVlIGxpa2UgXCJyZWN0KDEwcHgsIDVweCwgMHB4LCAyMHB4KVwiLCB0aGUgdmFsdWVzIHdvdWxkIGJlIHN0b3JlZCBsaWtlIHRoaXM6XG5cdFx0ICogeHMwOlwicmVjdChcIiwgczoxMCwgeHMxOlwicHgsIFwiLCB4bjE6NSwgeHMyOlwicHgsIFwiLCB4bjI6MCwgeHMzOlwicHgsIFwiLCB4bjM6MjAsIHhuNDpcInB4KVwiXG5cdFx0ICogQW5kIHRoZXknZCBhbGwgZ2V0IGpvaW5lZCB0b2dldGhlciB3aGVuIHRoZSBDU1NQbHVnaW4gcmVuZGVycyAoaW4gdGhlIHNldFJhdGlvKCkgbWV0aG9kKS5cblx0XHQgKiBAcGFyYW0ge3N0cmluZz19IHBmeCBQcmVmaXggKGlmIGFueSlcblx0XHQgKiBAcGFyYW0geyFudW1iZXJ9IHMgU3RhcnRpbmcgdmFsdWVcblx0XHQgKiBAcGFyYW0geyFudW1iZXJ9IGMgQ2hhbmdlIGluIG51bWVyaWMgdmFsdWUgb3ZlciB0aGUgY291cnNlIG9mIHRoZSBlbnRpcmUgdHdlZW4uIEZvciBleGFtcGxlLCBpZiB0aGUgc3RhcnQgaXMgNSBhbmQgdGhlIGVuZCBpcyAxMDAsIHRoZSBjaGFuZ2Ugd291bGQgYmUgOTUuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBzZnggU3VmZml4IChpZiBhbnkpXG5cdFx0ICogQHBhcmFtIHtib29sZWFuPX0gciBSb3VuZCAoaWYgdHJ1ZSkuXG5cdFx0ICogQHBhcmFtIHtib29sZWFuPX0gcGFkIElmIHRydWUsIHRoaXMgZXh0cmEgdmFsdWUgc2hvdWxkIGJlIHNlcGFyYXRlZCBieSB0aGUgcHJldmlvdXMgb25lIGJ5IGEgc3BhY2UuIElmIHRoZXJlIGlzIG5vIHByZXZpb3VzIGV4dHJhIGFuZCBwYWQgaXMgdHJ1ZSwgaXQgd2lsbCBhdXRvbWF0aWNhbGx5IGRyb3AgdGhlIHNwYWNlLlxuXHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbn0gcmV0dXJucyBpdHNlbGYgc28gdGhhdCBtdWx0aXBsZSBtZXRob2RzIGNhbiBiZSBjaGFpbmVkIHRvZ2V0aGVyLlxuXHRcdCAqL1xuXHRcdHAuYXBwZW5kWHRyYSA9IGZ1bmN0aW9uKHBmeCwgcywgYywgc2Z4LCByLCBwYWQpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMsXG5cdFx0XHRcdGwgPSBwdC5sO1xuXHRcdFx0cHRbXCJ4c1wiICsgbF0gKz0gKHBhZCAmJiAobCB8fCBwdFtcInhzXCIgKyBsXSkpID8gXCIgXCIgKyBwZnggOiBwZnggfHwgXCJcIjtcblx0XHRcdGlmICghYykgaWYgKGwgIT09IDAgJiYgIXB0LnBsdWdpbikgeyAvL3R5cGljYWxseSB3ZSdsbCBjb21iaW5lIG5vbi1jaGFuZ2luZyB2YWx1ZXMgcmlnaHQgaW50byB0aGUgeHMgdG8gb3B0aW1pemUgcGVyZm9ybWFuY2UsIGJ1dCB3ZSBkb24ndCBjb21iaW5lIHRoZW0gd2hlbiB0aGVyZSdzIGEgcGx1Z2luIHRoYXQgd2lsbCBiZSB0d2VlbmluZyB0aGUgdmFsdWVzIGJlY2F1c2UgaXQgbWF5IGRlcGVuZCBvbiB0aGUgdmFsdWVzIGJlaW5nIHNwbGl0IGFwYXJ0LCBsaWtlIGZvciBhIGJlemllciwgaWYgYSB2YWx1ZSBkb2Vzbid0IGNoYW5nZSBiZXR3ZWVuIHRoZSBmaXJzdCBhbmQgc2Vjb25kIGl0ZXJhdGlvbiBidXQgdGhlbiBpdCBkb2VzIG9uIHRoZSAzcmQsIHdlJ2xsIHJ1biBpbnRvIHRyb3VibGUgYmVjYXVzZSB0aGVyZSdzIG5vIHhuIHNsb3QgZm9yIHRoYXQgdmFsdWUhXG5cdFx0XHRcdHB0W1wieHNcIiArIGxdICs9IHMgKyAoc2Z4IHx8IFwiXCIpO1xuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9XG5cdFx0XHRwdC5sKys7XG5cdFx0XHRwdC50eXBlID0gcHQuc2V0UmF0aW8gPyAyIDogMTtcblx0XHRcdHB0W1wieHNcIiArIHB0LmxdID0gc2Z4IHx8IFwiXCI7XG5cdFx0XHRpZiAobCA+IDApIHtcblx0XHRcdFx0cHQuZGF0YVtcInhuXCIgKyBsXSA9IHMgKyBjO1xuXHRcdFx0XHRwdC5yeHBbXCJ4blwiICsgbF0gPSByOyAvL3JvdW5kIGV4dHJhIHByb3BlcnR5ICh3ZSBuZWVkIHRvIHRhcCBpbnRvIHRoaXMgaW4gdGhlIF9wYXJzZVRvUHJveHkoKSBtZXRob2QpXG5cdFx0XHRcdHB0W1wieG5cIiArIGxdID0gcztcblx0XHRcdFx0aWYgKCFwdC5wbHVnaW4pIHtcblx0XHRcdFx0XHRwdC54Zmlyc3QgPSBuZXcgQ1NTUHJvcFR3ZWVuKHB0LCBcInhuXCIgKyBsLCBzLCBjLCBwdC54Zmlyc3QgfHwgcHQsIDAsIHB0Lm4sIHIsIHB0LnByKTtcblx0XHRcdFx0XHRwdC54Zmlyc3QueHMwID0gMDsgLy9qdXN0IHRvIGVuc3VyZSB0aGF0IHRoZSBwcm9wZXJ0eSBzdGF5cyBudW1lcmljIHdoaWNoIGhlbHBzIG1vZGVybiBicm93c2VycyBzcGVlZCB1cCBwcm9jZXNzaW5nLiBSZW1lbWJlciwgaW4gdGhlIHNldFJhdGlvKCkgbWV0aG9kLCB3ZSBkbyBwdC50W3B0LnBdID0gdmFsICsgcHQueHMwIHNvIGlmIHB0LnhzMCBpcyBcIlwiICh0aGUgZGVmYXVsdCksIGl0J2xsIGNhc3QgdGhlIGVuZCB2YWx1ZSBhcyBhIHN0cmluZy4gV2hlbiBhIHByb3BlcnR5IGlzIGEgbnVtYmVyIHNvbWV0aW1lcyBhbmQgYSBzdHJpbmcgc29tZXRpbWVzLCBpdCBwcmV2ZW50cyB0aGUgY29tcGlsZXIgZnJvbSBsb2NraW5nIGluIHRoZSBkYXRhIHR5cGUsIHNsb3dpbmcgdGhpbmdzIGRvd24gc2xpZ2h0bHkuXG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHB0O1xuXHRcdFx0fVxuXHRcdFx0cHQuZGF0YSA9IHtzOnMgKyBjfTtcblx0XHRcdHB0LnJ4cCA9IHt9O1xuXHRcdFx0cHQucyA9IHM7XG5cdFx0XHRwdC5jID0gYztcblx0XHRcdHB0LnIgPSByO1xuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBAY29uc3RydWN0b3IgQSBTcGVjaWFsUHJvcCBpcyBiYXNpY2FsbHkgYSBjc3MgcHJvcGVydHkgdGhhdCBuZWVkcyB0byBiZSB0cmVhdGVkIGluIGEgbm9uLXN0YW5kYXJkIHdheSwgbGlrZSBpZiBpdCBtYXkgY29udGFpbiBhIGNvbXBsZXggdmFsdWUgbGlrZSBib3hTaGFkb3c6XCI1cHggMTBweCAxNXB4IHJnYigyNTUsIDEwMiwgNTEpXCIgb3IgaWYgaXQgaXMgYXNzb2NpYXRlZCB3aXRoIGFub3RoZXIgcGx1Z2luIGxpa2UgVGhyb3dQcm9wc1BsdWdpbiBvciBCZXppZXJQbHVnaW4uIEV2ZXJ5IFNwZWNpYWxQcm9wIGlzIGFzc29jaWF0ZWQgd2l0aCBhIHBhcnRpY3VsYXIgcHJvcGVydHkgbmFtZSBsaWtlIFwiYm94U2hhZG93XCIgb3IgXCJ0aHJvd1Byb3BzXCIgb3IgXCJiZXppZXJcIiBhbmQgaXQgd2lsbCBpbnRlcmNlcHQgdGhvc2UgdmFsdWVzIGluIHRoZSB2YXJzIG9iamVjdCB0aGF0J3MgcGFzc2VkIHRvIHRoZSBDU1NQbHVnaW4gYW5kIGhhbmRsZSB0aGVtIGFjY29yZGluZ2x5LlxuXHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gcCBQcm9wZXJ0eSBuYW1lIChsaWtlIFwiYm94U2hhZG93XCIgb3IgXCJ0aHJvd1Byb3BzXCIpXG5cdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBvcHRpb25zIEFuIG9iamVjdCBjb250YWluaW5nIGFueSBvZiB0aGUgZm9sbG93aW5nIGNvbmZpZ3VyYXRpb24gb3B0aW9uczpcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGRlZmF1bHRWYWx1ZTogdGhlIGRlZmF1bHQgdmFsdWVcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIHBhcnNlcjogQSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBjYWxsZWQgd2hlbiB0aGUgYXNzb2NpYXRlZCBwcm9wZXJ0eSBuYW1lIGlzIGZvdW5kIGluIHRoZSB2YXJzLiBUaGlzIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBDU1NQcm9wVHdlZW4gaW5zdGFuY2UgYW5kIGl0IHNob3VsZCBlbnN1cmUgdGhhdCBpdCBpcyBwcm9wZXJseSBpbnNlcnRlZCBpbnRvIHRoZSBsaW5rZWQgbGlzdC4gSXQgd2lsbCByZWNlaXZlIDQgcGFyYW10ZXJzOiAxKSBUaGUgdGFyZ2V0LCAyKSBUaGUgdmFsdWUgZGVmaW5lZCBpbiB0aGUgdmFycywgMykgVGhlIENTU1BsdWdpbiBpbnN0YW5jZSAod2hvc2UgX2ZpcnN0UFQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZSBsaW5rZWQgbGlzdCksIGFuZCA0KSBBIGNvbXB1dGVkIHN0eWxlIG9iamVjdCBpZiBvbmUgd2FzIGNhbGN1bGF0ZWQgKHRoaXMgaXMgYSBzcGVlZCBvcHRpbWl6YXRpb24gdGhhdCBhbGxvd3MgcmV0cmlldmFsIG9mIHN0YXJ0aW5nIHZhbHVlcyBxdWlja2VyKVxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gZm9ybWF0dGVyOiBhIGZ1bmN0aW9uIHRoYXQgZm9ybWF0cyBhbnkgdmFsdWUgcmVjZWl2ZWQgZm9yIHRoaXMgc3BlY2lhbCBwcm9wZXJ0eSAoZm9yIGV4YW1wbGUsIGJveFNoYWRvdyBjb3VsZCB0YWtlIFwiNXB4IDVweCByZWRcIiBhbmQgZm9ybWF0IGl0IHRvIFwiNXB4IDVweCAwcHggMHB4IHJlZFwiIHNvIHRoYXQgYm90aCB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIGhhdmUgYSBjb21tb24gb3JkZXIgYW5kIHF1YW50aXR5IG9mIHZhbHVlcy4pXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBwcmVmaXg6IGlmIHRydWUsIHdlJ2xsIGRldGVybWluZSB3aGV0aGVyIG9yIG5vdCB0aGlzIHByb3BlcnR5IHJlcXVpcmVzIGEgdmVuZG9yIHByZWZpeCAobGlrZSBXZWJraXQgb3IgTW96IG9yIG1zIG9yIE8pXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBjb2xvcjogc2V0IHRoaXMgdG8gdHJ1ZSBpZiB0aGUgdmFsdWUgZm9yIHRoaXMgU3BlY2lhbFByb3AgbWF5IGNvbnRhaW4gY29sb3ItcmVsYXRlZCB2YWx1ZXMgbGlrZSByZ2IoKSwgcmdiYSgpLCBldGMuXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBwcmlvcml0eTogcHJpb3JpdHkgaW4gdGhlIGxpbmtlZCBsaXN0IG9yZGVyLiBIaWdoZXIgcHJpb3JpdHkgU3BlY2lhbFByb3BzIHdpbGwgYmUgdXBkYXRlZCBiZWZvcmUgbG93ZXIgcHJpb3JpdHkgb25lcy4gVGhlIGRlZmF1bHQgcHJpb3JpdHkgaXMgMC5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIG11bHRpOiBpZiB0cnVlLCB0aGUgZm9ybWF0dGVyIHNob3VsZCBhY2NvbW1vZGF0ZSBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IG9mIHZhbHVlcywgbGlrZSBib3hTaGFkb3cgY291bGQgaGF2ZSBtdWx0aXBsZSBib3hTaGFkb3dzIGxpc3RlZCBvdXQuXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBjb2xsYXBzaWJsZTogaWYgdHJ1ZSwgdGhlIGZvcm1hdHRlciBzaG91bGQgdHJlYXQgdGhlIHZhbHVlIGxpa2UgaXQncyBhIHRvcC9yaWdodC9ib3R0b20vbGVmdCB2YWx1ZSB0aGF0IGNvdWxkIGJlIGNvbGxhcHNlZCwgbGlrZSBcIjVweFwiIHdvdWxkIGFwcGx5IHRvIGFsbCwgXCI1cHgsIDEwcHhcIiB3b3VsZCB1c2UgNXB4IGZvciB0b3AvYm90dG9tIGFuZCAxMHB4IGZvciByaWdodC9sZWZ0LCBldGMuXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBrZXl3b3JkOiBhIHNwZWNpYWwga2V5d29yZCB0aGF0IGNhbiBbb3B0aW9uYWxseV0gYmUgZm91bmQgaW5zaWRlIHRoZSB2YWx1ZSAobGlrZSBcImluc2V0XCIgZm9yIGJveFNoYWRvdykuIFRoaXMgYWxsb3dzIHVzIHRvIHZhbGlkYXRlIGJlZ2lubmluZy9lbmRpbmcgdmFsdWVzIHRvIG1ha2Ugc3VyZSB0aGV5IG1hdGNoIChpZiB0aGUga2V5d29yZCBpcyBmb3VuZCBpbiBvbmUsIGl0J2xsIGJlIGFkZGVkIHRvIHRoZSBvdGhlciBmb3IgY29uc2lzdGVuY3kgYnkgZGVmYXVsdCkuXG5cdFx0ICovXG5cdFx0dmFyIFNwZWNpYWxQcm9wID0gZnVuY3Rpb24ocCwgb3B0aW9ucykge1xuXHRcdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XHRcdFx0dGhpcy5wID0gb3B0aW9ucy5wcmVmaXggPyBfY2hlY2tQcm9wUHJlZml4KHApIHx8IHAgOiBwO1xuXHRcdFx0XHRfc3BlY2lhbFByb3BzW3BdID0gX3NwZWNpYWxQcm9wc1t0aGlzLnBdID0gdGhpcztcblx0XHRcdFx0dGhpcy5mb3JtYXQgPSBvcHRpb25zLmZvcm1hdHRlciB8fCBfZ2V0Rm9ybWF0dGVyKG9wdGlvbnMuZGVmYXVsdFZhbHVlLCBvcHRpb25zLmNvbG9yLCBvcHRpb25zLmNvbGxhcHNpYmxlLCBvcHRpb25zLm11bHRpKTtcblx0XHRcdFx0aWYgKG9wdGlvbnMucGFyc2VyKSB7XG5cdFx0XHRcdFx0dGhpcy5wYXJzZSA9IG9wdGlvbnMucGFyc2VyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2xycyA9IG9wdGlvbnMuY29sb3I7XG5cdFx0XHRcdHRoaXMubXVsdGkgPSBvcHRpb25zLm11bHRpO1xuXHRcdFx0XHR0aGlzLmtleXdvcmQgPSBvcHRpb25zLmtleXdvcmQ7XG5cdFx0XHRcdHRoaXMuZGZsdCA9IG9wdGlvbnMuZGVmYXVsdFZhbHVlO1xuXHRcdFx0XHR0aGlzLnByID0gb3B0aW9ucy5wcmlvcml0eSB8fCAwO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly9zaG9ydGN1dCBmb3IgY3JlYXRpbmcgYSBuZXcgU3BlY2lhbFByb3AgdGhhdCBjYW4gYWNjZXB0IG11bHRpcGxlIHByb3BlcnRpZXMgYXMgYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCAoaGVscHMgbWluaWZpY2F0aW9uKS4gZGZsdCBjYW4gYmUgYW4gYXJyYXkgZm9yIG11bHRpcGxlIHZhbHVlcyAod2UgZG9uJ3QgZG8gYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBiZWNhdXNlIHRoZSBkZWZhdWx0IHZhbHVlIG1heSBjb250YWluIGNvbW1hcywgbGlrZSByZWN0KDBweCwwcHgsMHB4LDBweCkpLiBXZSBhdHRhY2ggdGhpcyBtZXRob2QgdG8gdGhlIFNwZWNpYWxQcm9wIGNsYXNzL29iamVjdCBpbnN0ZWFkIG9mIHVzaW5nIGEgcHJpdmF0ZSBfY3JlYXRlU3BlY2lhbFByb3AoKSBtZXRob2Qgc28gdGhhdCB3ZSBjYW4gdGFwIGludG8gaXQgZXh0ZXJuYWxseSBpZiBuZWNlc3NhcnksIGxpa2UgZnJvbSBhbm90aGVyIHBsdWdpbi5cblx0XHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcCA9IF9pbnRlcm5hbHMuX3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wID0gZnVuY3Rpb24ocCwgb3B0aW9ucywgZGVmYXVsdHMpIHtcblx0XHRcdFx0aWYgKHR5cGVvZihvcHRpb25zKSAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdG9wdGlvbnMgPSB7cGFyc2VyOmRlZmF1bHRzfTsgLy90byBtYWtlIGJhY2t3YXJkcyBjb21wYXRpYmxlIHdpdGggb2xkZXIgdmVyc2lvbnMgb2YgQmV6aWVyUGx1Z2luIGFuZCBUaHJvd1Byb3BzUGx1Z2luXG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGEgPSBwLnNwbGl0KFwiLFwiKSxcblx0XHRcdFx0XHRkID0gb3B0aW9ucy5kZWZhdWx0VmFsdWUsXG5cdFx0XHRcdFx0aSwgdGVtcDtcblx0XHRcdFx0ZGVmYXVsdHMgPSBkZWZhdWx0cyB8fCBbZF07XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5wcmVmaXggPSAoaSA9PT0gMCAmJiBvcHRpb25zLnByZWZpeCk7XG5cdFx0XHRcdFx0b3B0aW9ucy5kZWZhdWx0VmFsdWUgPSBkZWZhdWx0c1tpXSB8fCBkO1xuXHRcdFx0XHRcdHRlbXAgPSBuZXcgU3BlY2lhbFByb3AoYVtpXSwgb3B0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vY3JlYXRlcyBhIHBsYWNlaG9sZGVyIHNwZWNpYWwgcHJvcCBmb3IgYSBwbHVnaW4gc28gdGhhdCB0aGUgcHJvcGVydHkgZ2V0cyBjYXVnaHQgdGhlIGZpcnN0IHRpbWUgYSB0d2VlbiBvZiBpdCBpcyBhdHRlbXB0ZWQsIGFuZCBhdCB0aGF0IHRpbWUgaXQgbWFrZXMgdGhlIHBsdWdpbiByZWdpc3RlciBpdHNlbGYsIHRodXMgdGFraW5nIG92ZXIgZm9yIGFsbCBmdXR1cmUgdHdlZW5zIG9mIHRoYXQgcHJvcGVydHkuIFRoaXMgYWxsb3dzIHVzIHRvIG5vdCBtYW5kYXRlIHRoYXQgdGhpbmdzIGxvYWQgaW4gYSBwYXJ0aWN1bGFyIG9yZGVyIGFuZCBpdCBhbHNvIGFsbG93cyB1cyB0byBsb2coKSBhbiBlcnJvciB0aGF0IGluZm9ybXMgdGhlIHVzZXIgd2hlbiB0aGV5IGF0dGVtcHQgdG8gdHdlZW4gYW4gZXh0ZXJuYWwgcGx1Z2luLXJlbGF0ZWQgcHJvcGVydHkgd2l0aG91dCBsb2FkaW5nIGl0cyAuanMgZmlsZS5cblx0XHRcdF9yZWdpc3RlclBsdWdpblByb3AgPSBfaW50ZXJuYWxzLl9yZWdpc3RlclBsdWdpblByb3AgPSBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdGlmICghX3NwZWNpYWxQcm9wc1twXSkge1xuXHRcdFx0XHRcdHZhciBwbHVnaW5OYW1lID0gcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHAuc3Vic3RyKDEpICsgXCJQbHVnaW5cIjtcblx0XHRcdFx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AocCwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luLCB2YXJzKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGx1Z2luQ2xhc3MgPSBfZ2xvYmFscy5jb20uZ3JlZW5zb2NrLnBsdWdpbnNbcGx1Z2luTmFtZV07XG5cdFx0XHRcdFx0XHRpZiAoIXBsdWdpbkNsYXNzKSB7XG5cdFx0XHRcdFx0XHRcdF9sb2coXCJFcnJvcjogXCIgKyBwbHVnaW5OYW1lICsgXCIganMgZmlsZSBub3QgbG9hZGVkLlwiKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHB0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cGx1Z2luQ2xhc3MuX2Nzc1JlZ2lzdGVyKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gX3NwZWNpYWxQcm9wc1twXS5wYXJzZSh0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luLCB2YXJzKTtcblx0XHRcdFx0XHR9fSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblxuXHRcdHAgPSBTcGVjaWFsUHJvcC5wcm90b3R5cGU7XG5cblx0XHQvKipcblx0XHQgKiBBbGlhcyBmb3IgX3BhcnNlQ29tcGxleCgpIHRoYXQgYXV0b21hdGljYWxseSBwbHVncyBpbiBjZXJ0YWluIHZhbHVlcyBmb3IgdGhpcyBTcGVjaWFsUHJvcCwgbGlrZSBpdHMgcHJvcGVydHkgbmFtZSwgd2hldGhlciBvciBub3QgY29sb3JzIHNob3VsZCBiZSBzZW5zZWQsIHRoZSBkZWZhdWx0IHZhbHVlLCBhbmQgcHJpb3JpdHkuIEl0IGFsc28gbG9va3MgZm9yIGFueSBrZXl3b3JkIHRoYXQgdGhlIFNwZWNpYWxQcm9wIGRlZmluZXMgKGxpa2UgXCJpbnNldFwiIGZvciBib3hTaGFkb3cpIGFuZCBlbnN1cmVzIHRoYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kaW5nIHZhbHVlcyBoYXZlIHRoZSBzYW1lIG51bWJlciBvZiB2YWx1ZXMgZm9yIFNwZWNpYWxQcm9wcyB3aGVyZSBtdWx0aSBpcyB0cnVlIChsaWtlIGJveFNoYWRvdyBhbmQgdGV4dFNoYWRvdyBjYW4gaGF2ZSBhIGNvbW1hLWRlbGltaXRlZCBsaXN0KVxuXHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCB0YXJnZXQgZWxlbWVudFxuXHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8b2JqZWN0KX0gYiBiZWdpbm5pbmcgdmFsdWVcblx0XHQgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyfG9iamVjdCl9IGUgZW5kaW5nIChkZXN0aW5hdGlvbikgdmFsdWVcblx0XHQgKiBAcGFyYW0ge0NTU1Byb3BUd2Vlbj19IHB0IG5leHQgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdCAqIEBwYXJhbSB7VHdlZW5QbHVnaW49fSBwbHVnaW4gSWYgYW5vdGhlciBwbHVnaW4gd2lsbCBiZSB0d2VlbmluZyB0aGUgY29tcGxleCB2YWx1ZSwgdGhhdCBUd2VlblBsdWdpbiBpbnN0YW5jZSBnb2VzIGhlcmUuXG5cdFx0ICogQHBhcmFtIHtmdW5jdGlvbj19IHNldFJhdGlvIElmIGEgY3VzdG9tIHNldFJhdGlvKCkgbWV0aG9kIHNob3VsZCBiZSB1c2VkIHRvIGhhbmRsZSB0aGlzIGNvbXBsZXggdmFsdWUsIHRoYXQgZ29lcyBoZXJlLlxuXHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbj19IEZpcnN0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Rcblx0XHQgKi9cblx0XHRwLnBhcnNlQ29tcGxleCA9IGZ1bmN0aW9uKHQsIGIsIGUsIHB0LCBwbHVnaW4sIHNldFJhdGlvKSB7XG5cdFx0XHR2YXIga3dkID0gdGhpcy5rZXl3b3JkLFxuXHRcdFx0XHRpLCBiYSwgZWEsIGwsIGJpLCBlaTtcblx0XHRcdC8vaWYgdGhpcyBTcGVjaWFsUHJvcCdzIHZhbHVlIGNhbiBjb250YWluIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgdmFsdWVzIChsaWtlIGJveFNoYWRvdyBvciB0ZXh0U2hhZG93KSwgd2UgbXVzdCBwYXJzZSB0aGVtIGluIGEgc3BlY2lhbCB3YXksIGFuZCBsb29rIGZvciBhIGtleXdvcmQgKGxpa2UgXCJpbnNldFwiIGZvciBib3hTaGFkb3cpIGFuZCBlbnN1cmUgdGhhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgQk9USCBoYXZlIGl0IGlmIHRoZSBlbmQgZGVmaW5lcyBpdCBhcyBzdWNoLiBXZSBhbHNvIG11c3QgZW5zdXJlIHRoYXQgdGhlcmUgYXJlIGFuIGVxdWFsIG51bWJlciBvZiB2YWx1ZXMgc3BlY2lmaWVkICh3ZSBjYW4ndCB0d2VlbiAxIGJveFNoYWRvdyB0byAzIGZvciBleGFtcGxlKVxuXHRcdFx0aWYgKHRoaXMubXVsdGkpIGlmIChfY29tbWFzT3V0c2lkZVBhcmVuRXhwLnRlc3QoZSkgfHwgX2NvbW1hc091dHNpZGVQYXJlbkV4cC50ZXN0KGIpKSB7XG5cdFx0XHRcdGJhID0gYi5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwifFwiKS5zcGxpdChcInxcIik7XG5cdFx0XHRcdGVhID0gZS5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwifFwiKS5zcGxpdChcInxcIik7XG5cdFx0XHR9IGVsc2UgaWYgKGt3ZCkge1xuXHRcdFx0XHRiYSA9IFtiXTtcblx0XHRcdFx0ZWEgPSBbZV07XG5cdFx0XHR9XG5cdFx0XHRpZiAoZWEpIHtcblx0XHRcdFx0bCA9IChlYS5sZW5ndGggPiBiYS5sZW5ndGgpID8gZWEubGVuZ3RoIDogYmEubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0YiA9IGJhW2ldID0gYmFbaV0gfHwgdGhpcy5kZmx0O1xuXHRcdFx0XHRcdGUgPSBlYVtpXSA9IGVhW2ldIHx8IHRoaXMuZGZsdDtcblx0XHRcdFx0XHRpZiAoa3dkKSB7XG5cdFx0XHRcdFx0XHRiaSA9IGIuaW5kZXhPZihrd2QpO1xuXHRcdFx0XHRcdFx0ZWkgPSBlLmluZGV4T2Yoa3dkKTtcblx0XHRcdFx0XHRcdGlmIChiaSAhPT0gZWkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGVpID09PSAtMSkgeyAvL2lmIHRoZSBrZXl3b3JkIGlzbid0IGluIHRoZSBlbmQgdmFsdWUsIHJlbW92ZSBpdCBmcm9tIHRoZSBiZWdpbm5pbmcgb25lLlxuXHRcdFx0XHRcdFx0XHRcdGJhW2ldID0gYmFbaV0uc3BsaXQoa3dkKS5qb2luKFwiXCIpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGJpID09PSAtMSkgeyAvL2lmIHRoZSBrZXl3b3JkIGlzbid0IGluIHRoZSBiZWdpbm5pbmcsIGFkZCBpdC5cblx0XHRcdFx0XHRcdFx0XHRiYVtpXSArPSBcIiBcIiArIGt3ZDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRiID0gYmEuam9pbihcIiwgXCIpO1xuXHRcdFx0XHRlID0gZWEuam9pbihcIiwgXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIF9wYXJzZUNvbXBsZXgodCwgdGhpcy5wLCBiLCBlLCB0aGlzLmNscnMsIHRoaXMuZGZsdCwgcHQsIHRoaXMucHIsIHBsdWdpbiwgc2V0UmF0aW8pO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBBY2NlcHRzIGEgdGFyZ2V0IGFuZCBlbmQgdmFsdWUgYW5kIHNwaXRzIGJhY2sgYSBDU1NQcm9wVHdlZW4gdGhhdCBoYXMgYmVlbiBpbnNlcnRlZCBpbnRvIHRoZSBDU1NQbHVnaW4ncyBsaW5rZWQgbGlzdCBhbmQgY29uZm9ybXMgd2l0aCBhbGwgdGhlIGNvbnZlbnRpb25zIHdlIHVzZSBpbnRlcm5hbGx5LCBsaWtlIHR5cGU6LTEsIDAsIDEsIG9yIDIsIHNldHRpbmcgdXAgYW55IGV4dHJhIHByb3BlcnR5IHR3ZWVucywgcHJpb3JpdHksIGV0Yy4gRm9yIGV4YW1wbGUsIGlmIHdlIGhhdmUgYSBib3hTaGFkb3cgU3BlY2lhbFByb3AgYW5kIGNhbGw6XG5cdFx0ICogdGhpcy5fZmlyc3RQVCA9IHNwLnBhcnNlKGVsZW1lbnQsIFwiNXB4IDEwcHggMjBweCByZ2IoMjU1MCwxMDIsNTEpXCIsIFwiYm94U2hhZG93XCIsIHRoaXMpO1xuXHRcdCAqIEl0IHNob3VsZCBmaWd1cmUgb3V0IHRoZSBzdGFydGluZyB2YWx1ZSBvZiB0aGUgZWxlbWVudCdzIGJveFNoYWRvdywgY29tcGFyZSBpdCB0byB0aGUgcHJvdmlkZWQgZW5kIHZhbHVlIGFuZCBjcmVhdGUgYWxsIHRoZSBuZWNlc3NhcnkgQ1NTUHJvcFR3ZWVucyBvZiB0aGUgYXBwcm9wcmlhdGUgdHlwZXMgdG8gdHdlZW4gdGhlIGJveFNoYWRvdy4gVGhlIENTU1Byb3BUd2VlbiB0aGF0IGdldHMgc3BpdCBiYWNrIHNob3VsZCBhbHJlYWR5IGJlIGluc2VydGVkIGludG8gdGhlIGxpbmtlZCBsaXN0ICh0aGUgNHRoIHBhcmFtZXRlciBpcyB0aGUgY3VycmVudCBoZWFkLCBzbyBwcmVwZW5kIHRvIHRoYXQpLlxuXHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgb2JqZWN0IHdob3NlIHByb3BlcnR5IGlzIGJlaW5nIHR3ZWVuZWRcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gZSBFbmQgdmFsdWUgYXMgcHJvdmlkZWQgaW4gdGhlIHZhcnMgb2JqZWN0ICh0eXBpY2FsbHkgYSBzdHJpbmcsIGJ1dCBub3QgYWx3YXlzIC0gbGlrZSBhIHRocm93UHJvcHMgd291bGQgYmUgYW4gb2JqZWN0KS5cblx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgUHJvcGVydHkgbmFtZVxuXHRcdCAqIEBwYXJhbSB7IUNTU1BsdWdpbn0gY3NzcCBUaGUgQ1NTUGx1Z2luIGluc3RhbmNlIHRoYXQgc2hvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHR3ZWVuLlxuXHRcdCAqIEBwYXJhbSB7P0NTU1Byb3BUd2Vlbn0gcHQgVGhlIENTU1Byb3BUd2VlbiB0aGF0IGlzIHRoZSBjdXJyZW50IGhlYWQgb2YgdGhlIGxpbmtlZCBsaXN0ICh3ZSdsbCBwcmVwZW5kIHRvIGl0KVxuXHRcdCAqIEBwYXJhbSB7VHdlZW5QbHVnaW49fSBwbHVnaW4gSWYgYSBwbHVnaW4gd2lsbCBiZSB1c2VkIHRvIHR3ZWVuIHRoZSBwYXJzZWQgdmFsdWUsIHRoaXMgaXMgdGhlIHBsdWdpbiBpbnN0YW5jZS5cblx0XHQgKiBAcGFyYW0ge09iamVjdD19IHZhcnMgT3JpZ2luYWwgdmFycyBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0YSBmb3IgcGFyc2luZy5cblx0XHQgKiBAcmV0dXJuIHtDU1NQcm9wVHdlZW59IFRoZSBmaXJzdCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0IHdoaWNoIGluY2x1ZGVzIHRoZSBuZXcgb25lKHMpIGFkZGVkIGJ5IHRoZSBwYXJzZSgpIGNhbGwuXG5cdFx0ICovXG5cdFx0cC5wYXJzZSA9IGZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLCB0aGlzLmZvcm1hdChfZ2V0U3R5bGUodCwgdGhpcy5wLCBfY3MsIGZhbHNlLCB0aGlzLmRmbHQpKSwgdGhpcy5mb3JtYXQoZSksIHB0LCBwbHVnaW4pO1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBSZWdpc3RlcnMgYSBzcGVjaWFsIHByb3BlcnR5IHRoYXQgc2hvdWxkIGJlIGludGVyY2VwdGVkIGZyb20gYW55IFwiY3NzXCIgb2JqZWN0cyBkZWZpbmVkIGluIHR3ZWVucy4gVGhpcyBhbGxvd3MgeW91IHRvIGhhbmRsZSB0aGVtIGhvd2V2ZXIgeW91IHdhbnQgd2l0aG91dCBDU1NQbHVnaW4gZG9pbmcgaXQgZm9yIHlvdS4gVGhlIDJuZCBwYXJhbWV0ZXIgc2hvdWxkIGJlIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIDMgcGFyYW1ldGVyczpcblx0XHQgKiAgMSkgVGFyZ2V0IG9iamVjdCB3aG9zZSBwcm9wZXJ0eSBzaG91bGQgYmUgdHdlZW5lZCAodHlwaWNhbGx5IGEgRE9NIGVsZW1lbnQpXG5cdFx0ICogIDIpIFRoZSBlbmQvZGVzdGluYXRpb24gdmFsdWUgKGNvdWxkIGJlIGEgc3RyaW5nLCBudW1iZXIsIG9iamVjdCwgb3Igd2hhdGV2ZXIgeW91IHdhbnQpXG5cdFx0ICogIDMpIFRoZSB0d2VlbiBpbnN0YW5jZSAoeW91IHByb2JhYmx5IGRvbid0IG5lZWQgdG8gd29ycnkgYWJvdXQgdGhpcywgYnV0IGl0IGNhbiBiZSB1c2VmdWwgZm9yIGxvb2tpbmcgdXAgaW5mb3JtYXRpb24gbGlrZSB0aGUgZHVyYXRpb24pXG5cdFx0ICpcblx0XHQgKiBUaGVuLCB5b3VyIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCBlYWNoIHRpbWUgdGhlIHR3ZWVuIGdldHMgcmVuZGVyZWQsIHBhc3NpbmcgYSBudW1lcmljIFwicmF0aW9cIiBwYXJhbWV0ZXIgdG8geW91ciBmdW5jdGlvbiB0aGF0IGluZGljYXRlcyB0aGUgY2hhbmdlIGZhY3RvciAodXN1YWxseSBiZXR3ZWVuIDAgYW5kIDEpLiBGb3IgZXhhbXBsZTpcblx0XHQgKlxuXHRcdCAqIENTU1BsdWdpbi5yZWdpc3RlclNwZWNpYWxQcm9wKFwibXlDdXN0b21Qcm9wXCIsIGZ1bmN0aW9uKHRhcmdldCwgdmFsdWUsIHR3ZWVuKSB7XG5cdFx0ICogICAgICB2YXIgc3RhcnQgPSB0YXJnZXQuc3R5bGUud2lkdGg7XG5cdFx0ICogICAgICByZXR1cm4gZnVuY3Rpb24ocmF0aW8pIHtcblx0XHQgKiAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLndpZHRoID0gKHN0YXJ0ICsgdmFsdWUgKiByYXRpbykgKyBcInB4XCI7XG5cdFx0ICogICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0IHdpZHRoIHRvIFwiICsgdGFyZ2V0LnN0eWxlLndpZHRoKTtcblx0XHQgKiAgICAgICAgICB9XG5cdFx0ICogfSwgMCk7XG5cdFx0ICpcblx0XHQgKiBUaGVuLCB3aGVuIEkgZG8gdGhpcyB0d2VlbiwgaXQgd2lsbCB0cmlnZ2VyIG15IHNwZWNpYWwgcHJvcGVydHk6XG5cdFx0ICpcblx0XHQgKiBUd2VlbkxpdGUudG8oZWxlbWVudCwgMSwge2Nzczp7bXlDdXN0b21Qcm9wOjEwMH19KTtcblx0XHQgKlxuXHRcdCAqIEluIHRoZSBleGFtcGxlLCBvZiBjb3Vyc2UsIHdlJ3JlIGp1c3QgY2hhbmdpbmcgdGhlIHdpZHRoLCBidXQgeW91IGNhbiBkbyBhbnl0aGluZyB5b3Ugd2FudC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gbmFtZSBQcm9wZXJ0eSBuYW1lIChvciBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcykgdGhhdCBzaG91bGQgYmUgaW50ZXJjZXB0ZWQgYW5kIGhhbmRsZWQgYnkgeW91ciBmdW5jdGlvbi4gRm9yIGV4YW1wbGUsIGlmIEkgZGVmaW5lIFwibXlDdXN0b21Qcm9wXCIsIHRoZW4gaXQgd291bGQgaGFuZGxlIHRoYXQgcG9ydGlvbiBvZiB0aGUgZm9sbG93aW5nIHR3ZWVuOiBUd2VlbkxpdGUudG8oZWxlbWVudCwgMSwge2Nzczp7bXlDdXN0b21Qcm9wOjEwMH19KVxuXHRcdCAqIEBwYXJhbSB7IWZ1bmN0aW9uKE9iamVjdCwgT2JqZWN0LCBPYmplY3QsIHN0cmluZyk6ZnVuY3Rpb24obnVtYmVyKX0gb25Jbml0VHdlZW4gVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiBhIHR3ZWVuIG9mIHRoaXMgc3BlY2lhbCBwcm9wZXJ0eSBpcyBwZXJmb3JtZWQuIFRoZSBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgNCBwYXJhbWV0ZXJzOiAxKSBUYXJnZXQgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIHR3ZWVuZWQsIDIpIFZhbHVlIHRoYXQgd2FzIHBhc3NlZCB0byB0aGUgdHdlZW4sIDMpIFRoZSB0d2VlbiBpbnN0YW5jZSBpdHNlbGYgKHJhcmVseSB1c2VkKSwgYW5kIDQpIFRoZSBwcm9wZXJ0eSBuYW1lIHRoYXQncyBiZWluZyB0d2VlbmVkLiBZb3VyIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBjYWxsZWQgb24gZXZlcnkgdXBkYXRlIG9mIHRoZSB0d2Vlbi4gVGhhdCBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgYSBzaW5nbGUgcGFyYW1ldGVyIHRoYXQgaXMgYSBcImNoYW5nZSBmYWN0b3JcIiB2YWx1ZSAodHlwaWNhbGx5IGJldHdlZW4gMCBhbmQgMSkgaW5kaWNhdGluZyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcyBhIHJhdGlvLiBZb3UgY2FuIHVzZSB0aGlzIHRvIGRldGVybWluZSBob3cgdG8gc2V0IHRoZSB2YWx1ZXMgYXBwcm9wcmlhdGVseSBpbiB5b3VyIGZ1bmN0aW9uLlxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyPX0gcHJpb3JpdHkgUHJpb3JpdHkgdGhhdCBoZWxwcyB0aGUgZW5naW5lIGRldGVybWluZSB0aGUgb3JkZXIgaW4gd2hpY2ggdG8gc2V0IHRoZSBwcm9wZXJ0aWVzIChkZWZhdWx0OiAwKS4gSGlnaGVyIHByaW9yaXR5IHByb3BlcnRpZXMgd2lsbCBiZSB1cGRhdGVkIGJlZm9yZSBsb3dlciBwcmlvcml0eSBvbmVzLlxuXHRcdCAqL1xuXHRcdENTU1BsdWdpbi5yZWdpc3RlclNwZWNpYWxQcm9wID0gZnVuY3Rpb24obmFtZSwgb25Jbml0VHdlZW4sIHByaW9yaXR5KSB7XG5cdFx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AobmFtZSwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luLCB2YXJzKSB7XG5cdFx0XHRcdHZhciBydiA9IG5ldyBDU1NQcm9wVHdlZW4odCwgcCwgMCwgMCwgcHQsIDIsIHAsIGZhbHNlLCBwcmlvcml0eSk7XG5cdFx0XHRcdHJ2LnBsdWdpbiA9IHBsdWdpbjtcblx0XHRcdFx0cnYuc2V0UmF0aW8gPSBvbkluaXRUd2Vlbih0LCBlLCBjc3NwLl90d2VlbiwgcCk7XG5cdFx0XHRcdHJldHVybiBydjtcblx0XHRcdH0sIHByaW9yaXR5OnByaW9yaXR5fSk7XG5cdFx0fTtcblxuXG5cblxuXG5cblx0XHQvL3RyYW5zZm9ybS1yZWxhdGVkIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcblx0XHRDU1NQbHVnaW4udXNlU1ZHVHJhbnNmb3JtQXR0ciA9IF9pc1NhZmFyaSB8fCBfaXNGaXJlZm94OyAvL1NhZmFyaSBhbmQgRmlyZWZveCBib3RoIGhhdmUgc29tZSByZW5kZXJpbmcgYnVncyB3aGVuIGFwcGx5aW5nIENTUyB0cmFuc2Zvcm1zIHRvIFNWRyBlbGVtZW50cywgc28gZGVmYXVsdCB0byB1c2luZyB0aGUgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUgaW5zdGVhZCAodXNlcnMgY2FuIG92ZXJyaWRlIHRoaXMpLlxuXHRcdHZhciBfdHJhbnNmb3JtUHJvcHMgPSAoXCJzY2FsZVgsc2NhbGVZLHNjYWxlWix4LHkseixza2V3WCxza2V3WSxyb3RhdGlvbixyb3RhdGlvblgscm90YXRpb25ZLHBlcnNwZWN0aXZlLHhQZXJjZW50LHlQZXJjZW50XCIpLnNwbGl0KFwiLFwiKSxcblx0XHRcdF90cmFuc2Zvcm1Qcm9wID0gX2NoZWNrUHJvcFByZWZpeChcInRyYW5zZm9ybVwiKSwgLy90aGUgSmF2YXNjcmlwdCAoY2FtZWxDYXNlKSB0cmFuc2Zvcm0gcHJvcGVydHksIGxpa2UgbXNUcmFuc2Zvcm0sIFdlYmtpdFRyYW5zZm9ybSwgTW96VHJhbnNmb3JtLCBvciBPVHJhbnNmb3JtLlxuXHRcdFx0X3RyYW5zZm9ybVByb3BDU1MgPSBfcHJlZml4Q1NTICsgXCJ0cmFuc2Zvcm1cIixcblx0XHRcdF90cmFuc2Zvcm1PcmlnaW5Qcm9wID0gX2NoZWNrUHJvcFByZWZpeChcInRyYW5zZm9ybU9yaWdpblwiKSxcblx0XHRcdF9zdXBwb3J0czNEID0gKF9jaGVja1Byb3BQcmVmaXgoXCJwZXJzcGVjdGl2ZVwiKSAhPT0gbnVsbCksXG5cdFx0XHRUcmFuc2Zvcm0gPSBfaW50ZXJuYWxzLlRyYW5zZm9ybSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnBlcnNwZWN0aXZlID0gcGFyc2VGbG9hdChDU1NQbHVnaW4uZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlKSB8fCAwO1xuXHRcdFx0XHR0aGlzLmZvcmNlM0QgPSAoQ1NTUGx1Z2luLmRlZmF1bHRGb3JjZTNEID09PSBmYWxzZSB8fCAhX3N1cHBvcnRzM0QpID8gZmFsc2UgOiBDU1NQbHVnaW4uZGVmYXVsdEZvcmNlM0QgfHwgXCJhdXRvXCI7XG5cdFx0XHR9LFxuXHRcdFx0X1NWR0VsZW1lbnQgPSB3aW5kb3cuU1ZHRWxlbWVudCxcblx0XHRcdF91c2VTVkdUcmFuc2Zvcm1BdHRyLFxuXHRcdFx0Ly9Tb21lIGJyb3dzZXJzIChsaWtlIEZpcmVmb3ggYW5kIElFKSBkb24ndCBob25vciB0cmFuc2Zvcm0tb3JpZ2luIHByb3Blcmx5IGluIFNWRyBlbGVtZW50cywgc28gd2UgbmVlZCB0byBtYW51YWxseSBhZGp1c3QgdGhlIG1hdHJpeCBhY2NvcmRpbmdseS4gV2UgZmVhdHVyZSBkZXRlY3QgaGVyZSByYXRoZXIgdGhhbiBhbHdheXMgZG9pbmcgdGhlIGNvbnZlcnNpb24gZm9yIGNlcnRhaW4gYnJvd3NlcnMgYmVjYXVzZSB0aGV5IG1heSBmaXggdGhlIHByb2JsZW0gYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlLlxuXG5cdFx0XHRfY3JlYXRlU1ZHID0gZnVuY3Rpb24odHlwZSwgY29udGFpbmVyLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHZhciBlbGVtZW50ID0gX2RvYy5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCB0eXBlKSxcblx0XHRcdFx0XHRyZWcgPSAvKFthLXpdKShbQS1aXSkvZyxcblx0XHRcdFx0XHRwO1xuXHRcdFx0XHRmb3IgKHAgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlTlMobnVsbCwgcC5yZXBsYWNlKHJlZywgXCIkMS0kMlwiKS50b0xvd2VyQ2FzZSgpLCBhdHRyaWJ1dGVzW3BdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0fSxcblx0XHRcdF9kb2NFbGVtZW50ID0gX2RvYy5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRfZm9yY2VTVkdUcmFuc2Zvcm1BdHRyID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvL0lFIGFuZCBBbmRyb2lkIHN0b2NrIGRvbid0IHN1cHBvcnQgQ1NTIHRyYW5zZm9ybXMgb24gU1ZHIGVsZW1lbnRzLCBzbyB3ZSBtdXN0IHdyaXRlIHRoZW0gdG8gdGhlIFwidHJhbnNmb3JtXCIgYXR0cmlidXRlLiBXZSBwb3B1bGF0ZSB0aGlzIHZhcmlhYmxlIGluIHRoZSBfcGFyc2VUcmFuc2Zvcm0oKSBtZXRob2QsIGFuZCBvbmx5IGlmL3doZW4gd2UgY29tZSBhY3Jvc3MgYW4gU1ZHIGVsZW1lbnRcblx0XHRcdFx0dmFyIGZvcmNlID0gX2llVmVycyB8fCAoL0FuZHJvaWQvaS50ZXN0KF9hZ2VudCkgJiYgIXdpbmRvdy5jaHJvbWUpLFxuXHRcdFx0XHRcdHN2ZywgcmVjdCwgd2lkdGg7XG5cdFx0XHRcdGlmIChfZG9jLmNyZWF0ZUVsZW1lbnROUyAmJiAhZm9yY2UpIHsgLy9JRTggYW5kIGVhcmxpZXIgZG9lc24ndCBzdXBwb3J0IFNWRyBhbnl3YXlcblx0XHRcdFx0XHRzdmcgPSBfY3JlYXRlU1ZHKFwic3ZnXCIsIF9kb2NFbGVtZW50KTtcblx0XHRcdFx0XHRyZWN0ID0gX2NyZWF0ZVNWRyhcInJlY3RcIiwgc3ZnLCB7d2lkdGg6MTAwLCBoZWlnaHQ6NTAsIHg6MTAwfSk7XG5cdFx0XHRcdFx0d2lkdGggPSByZWN0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuXHRcdFx0XHRcdHJlY3Quc3R5bGVbX3RyYW5zZm9ybU9yaWdpblByb3BdID0gXCI1MCUgNTAlXCI7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZVtfdHJhbnNmb3JtUHJvcF0gPSBcInNjYWxlWCgwLjUpXCI7XG5cdFx0XHRcdFx0Zm9yY2UgPSAod2lkdGggPT09IHJlY3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggJiYgIShfaXNGaXJlZm94ICYmIF9zdXBwb3J0czNEKSk7IC8vbm90ZTogRmlyZWZveCBmYWlscyB0aGUgdGVzdCBldmVuIHRob3VnaCBpdCBkb2VzIHN1cHBvcnQgQ1NTIHRyYW5zZm9ybXMgaW4gM0QuIFNpbmNlIHdlIGNhbid0IHB1c2ggM0Qgc3R1ZmYgaW50byB0aGUgdHJhbnNmb3JtIGF0dHJpYnV0ZSwgd2UgZm9yY2UgRmlyZWZveCB0byBwYXNzIHRoZSB0ZXN0IGhlcmUgKGFzIGxvbmcgYXMgaXQgZG9lcyB0cnVseSBzdXBwb3J0IDNEKS5cblx0XHRcdFx0XHRfZG9jRWxlbWVudC5yZW1vdmVDaGlsZChzdmcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0pKCksXG5cdFx0XHRfcGFyc2VTVkdPcmlnaW4gPSBmdW5jdGlvbihlLCBsb2NhbCwgZGVjb3JhdGVlLCBhYnNvbHV0ZSwgc21vb3RoT3JpZ2luLCBza2lwUmVjb3JkKSB7XG5cdFx0XHRcdHZhciB0bSA9IGUuX2dzVHJhbnNmb3JtLFxuXHRcdFx0XHRcdG0gPSBfZ2V0TWF0cml4KGUsIHRydWUpLFxuXHRcdFx0XHRcdHYsIHgsIHksIHhPcmlnaW4sIHlPcmlnaW4sIGEsIGIsIGMsIGQsIHR4LCB0eSwgZGV0ZXJtaW5hbnQsIHhPcmlnaW5PbGQsIHlPcmlnaW5PbGQ7XG5cdFx0XHRcdGlmICh0bSkge1xuXHRcdFx0XHRcdHhPcmlnaW5PbGQgPSB0bS54T3JpZ2luOyAvL3JlY29yZCB0aGUgb3JpZ2luYWwgdmFsdWVzIGJlZm9yZSB3ZSBhbHRlciB0aGVtLlxuXHRcdFx0XHRcdHlPcmlnaW5PbGQgPSB0bS55T3JpZ2luO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghYWJzb2x1dGUgfHwgKHYgPSBhYnNvbHV0ZS5zcGxpdChcIiBcIikpLmxlbmd0aCA8IDIpIHtcblx0XHRcdFx0XHRiID0gZS5nZXRCQm94KCk7XG5cdFx0XHRcdFx0bG9jYWwgPSBfcGFyc2VQb3NpdGlvbihsb2NhbCkuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdHYgPSBbKGxvY2FsWzBdLmluZGV4T2YoXCIlXCIpICE9PSAtMSA/IHBhcnNlRmxvYXQobG9jYWxbMF0pIC8gMTAwICogYi53aWR0aCA6IHBhcnNlRmxvYXQobG9jYWxbMF0pKSArIGIueCxcblx0XHRcdFx0XHRcdCAobG9jYWxbMV0uaW5kZXhPZihcIiVcIikgIT09IC0xID8gcGFyc2VGbG9hdChsb2NhbFsxXSkgLyAxMDAgKiBiLmhlaWdodCA6IHBhcnNlRmxvYXQobG9jYWxbMV0pKSArIGIueV07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGVjb3JhdGVlLnhPcmlnaW4gPSB4T3JpZ2luID0gcGFyc2VGbG9hdCh2WzBdKTtcblx0XHRcdFx0ZGVjb3JhdGVlLnlPcmlnaW4gPSB5T3JpZ2luID0gcGFyc2VGbG9hdCh2WzFdKTtcblx0XHRcdFx0aWYgKGFic29sdXRlICYmIG0gIT09IF9pZGVudGl0eTJETWF0cml4KSB7IC8vaWYgc3ZnT3JpZ2luIGlzIGJlaW5nIHNldCwgd2UgbXVzdCBpbnZlcnQgdGhlIG1hdHJpeCBhbmQgZGV0ZXJtaW5lIHdoZXJlIHRoZSBhYnNvbHV0ZSBwb2ludCBpcywgZmFjdG9yaW5nIGluIHRoZSBjdXJyZW50IHRyYW5zZm9ybXMuIE90aGVyd2lzZSwgdGhlIHN2Z09yaWdpbiB3b3VsZCBiZSBiYXNlZCBvbiB0aGUgZWxlbWVudCdzIG5vbi10cmFuc2Zvcm1lZCBwb3NpdGlvbiBvbiB0aGUgY2FudmFzLlxuXHRcdFx0XHRcdGEgPSBtWzBdO1xuXHRcdFx0XHRcdGIgPSBtWzFdO1xuXHRcdFx0XHRcdGMgPSBtWzJdO1xuXHRcdFx0XHRcdGQgPSBtWzNdO1xuXHRcdFx0XHRcdHR4ID0gbVs0XTtcblx0XHRcdFx0XHR0eSA9IG1bNV07XG5cdFx0XHRcdFx0ZGV0ZXJtaW5hbnQgPSAoYSAqIGQgLSBiICogYyk7XG5cdFx0XHRcdFx0eCA9IHhPcmlnaW4gKiAoZCAvIGRldGVybWluYW50KSArIHlPcmlnaW4gKiAoLWMgLyBkZXRlcm1pbmFudCkgKyAoKGMgKiB0eSAtIGQgKiB0eCkgLyBkZXRlcm1pbmFudCk7XG5cdFx0XHRcdFx0eSA9IHhPcmlnaW4gKiAoLWIgLyBkZXRlcm1pbmFudCkgKyB5T3JpZ2luICogKGEgLyBkZXRlcm1pbmFudCkgLSAoKGEgKiB0eSAtIGIgKiB0eCkgLyBkZXRlcm1pbmFudCk7XG5cdFx0XHRcdFx0eE9yaWdpbiA9IGRlY29yYXRlZS54T3JpZ2luID0gdlswXSA9IHg7XG5cdFx0XHRcdFx0eU9yaWdpbiA9IGRlY29yYXRlZS55T3JpZ2luID0gdlsxXSA9IHk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRtKSB7IC8vYXZvaWQganVtcCB3aGVuIHRyYW5zZm9ybU9yaWdpbiBpcyBjaGFuZ2VkIC0gYWRqdXN0IHRoZSB4L3kgdmFsdWVzIGFjY29yZGluZ2x5XG5cdFx0XHRcdFx0aWYgKHNraXBSZWNvcmQpIHtcblx0XHRcdFx0XHRcdGRlY29yYXRlZS54T2Zmc2V0ID0gdG0ueE9mZnNldDtcblx0XHRcdFx0XHRcdGRlY29yYXRlZS55T2Zmc2V0ID0gdG0ueU9mZnNldDtcblx0XHRcdFx0XHRcdHRtID0gZGVjb3JhdGVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoc21vb3RoT3JpZ2luIHx8IChzbW9vdGhPcmlnaW4gIT09IGZhbHNlICYmIENTU1BsdWdpbi5kZWZhdWx0U21vb3RoT3JpZ2luICE9PSBmYWxzZSkpIHtcblx0XHRcdFx0XHRcdHggPSB4T3JpZ2luIC0geE9yaWdpbk9sZDtcblx0XHRcdFx0XHRcdHkgPSB5T3JpZ2luIC0geU9yaWdpbk9sZDtcblx0XHRcdFx0XHRcdC8vb3JpZ2luYWxseSwgd2Ugc2ltcGx5IGFkanVzdGVkIHRoZSB4IGFuZCB5IHZhbHVlcywgYnV0IHRoYXQgd291bGQgY2F1c2UgcHJvYmxlbXMgaWYsIGZvciBleGFtcGxlLCB5b3UgY3JlYXRlZCBhIHJvdGF0aW9uYWwgdHdlZW4gcGFydC13YXkgdGhyb3VnaCBhbiB4L3kgdHdlZW4uIE1hbmFnaW5nIHRoZSBvZmZzZXQgaW4gYSBzZXBhcmF0ZSB2YXJpYWJsZSBnaXZlcyB1cyB1bHRpbWF0ZSBmbGV4aWJpbGl0eS5cblx0XHRcdFx0XHRcdC8vdG0ueCAtPSB4IC0gKHggKiBtWzBdICsgeSAqIG1bMl0pO1xuXHRcdFx0XHRcdFx0Ly90bS55IC09IHkgLSAoeCAqIG1bMV0gKyB5ICogbVszXSk7XG5cdFx0XHRcdFx0XHR0bS54T2Zmc2V0ICs9ICh4ICogbVswXSArIHkgKiBtWzJdKSAtIHg7XG5cdFx0XHRcdFx0XHR0bS55T2Zmc2V0ICs9ICh4ICogbVsxXSArIHkgKiBtWzNdKSAtIHk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRtLnhPZmZzZXQgPSB0bS55T2Zmc2V0ID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFza2lwUmVjb3JkKSB7XG5cdFx0XHRcdFx0ZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN2Zy1vcmlnaW5cIiwgdi5qb2luKFwiIFwiKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRfY2FuR2V0QkJveCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXR1cm4gZS5nZXRCQm94KCk7IC8vRmlyZWZveCB0aHJvd3MgZXJyb3JzIGlmIHlvdSB0cnkgY2FsbGluZyBnZXRCQm94KCkgb24gYW4gU1ZHIGVsZW1lbnQgdGhhdCdzIG5vdCByZW5kZXJlZCAobGlrZSBpbiBhIDxzeW1ib2w+IG9yIDxkZWZzPikuIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTYxMjExOFxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fSxcblx0XHRcdF9pc1NWRyA9IGZ1bmN0aW9uKGUpIHsgLy9yZXBvcnRzIGlmIHRoZSBlbGVtZW50IGlzIGFuIFNWRyBvbiB3aGljaCBnZXRCQm94KCkgYWN0dWFsbHkgd29ya3Ncblx0XHRcdFx0cmV0dXJuICEhKF9TVkdFbGVtZW50ICYmIGUuZ2V0QkJveCAmJiBlLmdldENUTSAmJiBfY2FuR2V0QkJveChlKSAmJiAoIWUucGFyZW50Tm9kZSB8fCAoZS5wYXJlbnROb2RlLmdldEJCb3ggJiYgZS5wYXJlbnROb2RlLmdldENUTSkpKTtcblx0XHRcdH0sXG5cdFx0XHRfaWRlbnRpdHkyRE1hdHJpeCA9IFsxLDAsMCwxLDAsMF0sXG5cdFx0XHRfZ2V0TWF0cml4ID0gZnVuY3Rpb24oZSwgZm9yY2UyRCkge1xuXHRcdFx0XHR2YXIgdG0gPSBlLl9nc1RyYW5zZm9ybSB8fCBuZXcgVHJhbnNmb3JtKCksXG5cdFx0XHRcdFx0cm5kID0gMTAwMDAwLFxuXHRcdFx0XHRcdHN0eWxlID0gZS5zdHlsZSxcblx0XHRcdFx0XHRpc0RlZmF1bHQsIHMsIG0sIG4sIGRlYywgbm9uZTtcblx0XHRcdFx0aWYgKF90cmFuc2Zvcm1Qcm9wKSB7XG5cdFx0XHRcdFx0cyA9IF9nZXRTdHlsZShlLCBfdHJhbnNmb3JtUHJvcENTUywgbnVsbCwgdHJ1ZSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZS5jdXJyZW50U3R5bGUpIHtcblx0XHRcdFx0XHQvL2ZvciBvbGRlciB2ZXJzaW9ucyBvZiBJRSwgd2UgbmVlZCB0byBpbnRlcnByZXQgdGhlIGZpbHRlciBwb3J0aW9uIHRoYXQgaXMgaW4gdGhlIGZvcm1hdDogcHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0Lk1hdHJpeChNMTE9Ni4xMjMyMzM5OTU3MzY3NjZlLTE3LCBNMTI9LTEsIE0yMT0xLCBNMjI9Ni4xMjMyMzM5OTU3MzY3NjZlLTE3LCBzaXppbmdNZXRob2Q9J2F1dG8gZXhwYW5kJykgTm90aWNlIHRoYXQgd2UgbmVlZCB0byBzd2FwIGIgYW5kIGMgY29tcGFyZWQgdG8gYSBub3JtYWwgbWF0cml4LlxuXHRcdFx0XHRcdHMgPSBlLmN1cnJlbnRTdHlsZS5maWx0ZXIubWF0Y2goX2llR2V0TWF0cml4RXhwKTtcblx0XHRcdFx0XHRzID0gKHMgJiYgcy5sZW5ndGggPT09IDQpID8gW3NbMF0uc3Vic3RyKDQpLCBOdW1iZXIoc1syXS5zdWJzdHIoNCkpLCBOdW1iZXIoc1sxXS5zdWJzdHIoNCkpLCBzWzNdLnN1YnN0cig0KSwgKHRtLnggfHwgMCksICh0bS55IHx8IDApXS5qb2luKFwiLFwiKSA6IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aXNEZWZhdWx0ID0gKCFzIHx8IHMgPT09IFwibm9uZVwiIHx8IHMgPT09IFwibWF0cml4KDEsIDAsIDAsIDEsIDAsIDApXCIpO1xuXHRcdFx0XHRpZiAoaXNEZWZhdWx0ICYmIF90cmFuc2Zvcm1Qcm9wICYmICgobm9uZSA9IChfZ2V0Q29tcHV0ZWRTdHlsZShlKS5kaXNwbGF5ID09PSBcIm5vbmVcIikpIHx8ICFlLnBhcmVudE5vZGUpKSB7XG5cdFx0XHRcdFx0aWYgKG5vbmUpIHsgLy9icm93c2VycyBkb24ndCByZXBvcnQgdHJhbnNmb3JtcyBhY2N1cmF0ZWx5IHVubGVzcyB0aGUgZWxlbWVudCBpcyBpbiB0aGUgRE9NIGFuZCBoYXMgYSBkaXNwbGF5IHZhbHVlIHRoYXQncyBub3QgXCJub25lXCIuXG5cdFx0XHRcdFx0XHRuID0gc3R5bGUuZGlzcGxheTtcblx0XHRcdFx0XHRcdHN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghZS5wYXJlbnROb2RlKSB7XG5cdFx0XHRcdFx0XHRkZWMgPSAxOyAvL2ZsYWdcblx0XHRcdFx0XHRcdF9kb2NFbGVtZW50LmFwcGVuZENoaWxkKGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzID0gX2dldFN0eWxlKGUsIF90cmFuc2Zvcm1Qcm9wQ1NTLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0XHRpc0RlZmF1bHQgPSAoIXMgfHwgcyA9PT0gXCJub25lXCIgfHwgcyA9PT0gXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIik7XG5cdFx0XHRcdFx0aWYgKG4pIHtcblx0XHRcdFx0XHRcdHN0eWxlLmRpc3BsYXkgPSBuO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobm9uZSkge1xuXHRcdFx0XHRcdFx0X3JlbW92ZVByb3Aoc3R5bGUsIFwiZGlzcGxheVwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGRlYykge1xuXHRcdFx0XHRcdFx0X2RvY0VsZW1lbnQucmVtb3ZlQ2hpbGQoZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0bS5zdmcgfHwgKGUuZ2V0QkJveCAmJiBfaXNTVkcoZSkpKSB7XG5cdFx0XHRcdFx0aWYgKGlzRGVmYXVsdCAmJiAoc3R5bGVbX3RyYW5zZm9ybVByb3BdICsgXCJcIikuaW5kZXhPZihcIm1hdHJpeFwiKSAhPT0gLTEpIHsgLy9zb21lIGJyb3dzZXJzIChsaWtlIENocm9tZSA0MCkgZG9uJ3QgY29ycmVjdGx5IHJlcG9ydCB0cmFuc2Zvcm1zIHRoYXQgYXJlIGFwcGxpZWQgaW5saW5lIG9uIGFuIFNWRyBlbGVtZW50ICh0aGV5IGRvbid0IGdldCBpbmNsdWRlZCBpbiB0aGUgY29tcHV0ZWQgc3R5bGUpLCBzbyB3ZSBkb3VibGUtY2hlY2sgaGVyZSBhbmQgYWNjZXB0IG1hdHJpeCB2YWx1ZXNcblx0XHRcdFx0XHRcdHMgPSBzdHlsZVtfdHJhbnNmb3JtUHJvcF07XG5cdFx0XHRcdFx0XHRpc0RlZmF1bHQgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtID0gZS5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG5cdFx0XHRcdFx0aWYgKGlzRGVmYXVsdCAmJiBtKSB7XG5cdFx0XHRcdFx0XHRpZiAobS5pbmRleE9mKFwibWF0cml4XCIpICE9PSAtMSkgeyAvL2p1c3QgaW4gY2FzZSB0aGVyZSdzIGEgXCJ0cmFuc2Zvcm1cIiB2YWx1ZSBzcGVjaWZpZWQgYXMgYW4gYXR0cmlidXRlIGluc3RlYWQgb2YgQ1NTIHN0eWxlLiBBY2NlcHQgZWl0aGVyIGEgbWF0cml4KCkgb3Igc2ltcGxlIHRyYW5zbGF0ZSgpIHZhbHVlIHRob3VnaC5cblx0XHRcdFx0XHRcdFx0cyA9IG07XG5cdFx0XHRcdFx0XHRcdGlzRGVmYXVsdCA9IDA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG0uaW5kZXhPZihcInRyYW5zbGF0ZVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0cyA9IFwibWF0cml4KDEsMCwwLDEsXCIgKyBtLm1hdGNoKC8oPzpcXC18XFxiKVtcXGRcXC1cXC5lXStcXGIvZ2kpLmpvaW4oXCIsXCIpICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRcdGlzRGVmYXVsdCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpc0RlZmF1bHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gX2lkZW50aXR5MkRNYXRyaXg7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9zcGxpdCB0aGUgbWF0cml4IHZhbHVlcyBvdXQgaW50byBhbiBhcnJheSAobSBmb3IgbWF0cml4KVxuXHRcdFx0XHRtID0gKHMgfHwgXCJcIikubWF0Y2goX251bUV4cCkgfHwgW107XG5cdFx0XHRcdGkgPSBtLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0biA9IE51bWJlcihtW2ldKTtcblx0XHRcdFx0XHRtW2ldID0gKGRlYyA9IG4gLSAobiB8PSAwKSkgPyAoKGRlYyAqIHJuZCArIChkZWMgPCAwID8gLTAuNSA6IDAuNSkpIHwgMCkgLyBybmQgKyBuIDogbjsgLy9jb252ZXJ0IHN0cmluZ3MgdG8gTnVtYmVycyBhbmQgcm91bmQgdG8gNSBkZWNpbWFsIHBsYWNlcyB0byBhdm9pZCBpc3N1ZXMgd2l0aCB0aW55IG51bWJlcnMuIFJvdWdobHkgMjB4IGZhc3RlciB0aGFuIE51bWJlci50b0ZpeGVkKCkuIFdlIGFsc28gbXVzdCBtYWtlIHN1cmUgdG8gcm91bmQgYmVmb3JlIGRpdmlkaW5nIHNvIHRoYXQgdmFsdWVzIGxpa2UgMC45OTk5OTk5OTk5IGJlY29tZSAxIHRvIGF2b2lkIGdsaXRjaGVzIGluIGJyb3dzZXIgcmVuZGVyaW5nIGFuZCBpbnRlcnByZXRhdGlvbiBvZiBmbGlwcGVkL3JvdGF0ZWQgM0QgbWF0cmljZXMuIEFuZCBkb24ndCBqdXN0IG11bHRpcGx5IHRoZSBudW1iZXIgYnkgcm5kLCBmbG9vciBpdCwgYW5kIHRoZW4gZGl2aWRlIGJ5IHJuZCBiZWNhdXNlIHRoZSBiaXR3aXNlIG9wZXJhdGlvbnMgbWF4IG91dCBhdCBhIDMyLWJpdCBzaWduZWQgaW50ZWdlciwgdGh1cyBpdCBjb3VsZCBnZXQgY2xpcHBlZCBhdCBhIHJlbGF0aXZlbHkgbG93IHZhbHVlIChsaWtlIDIyLDAwMC4wMDAwMCBmb3IgZXhhbXBsZSkuXG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChmb3JjZTJEICYmIG0ubGVuZ3RoID4gNikgPyBbbVswXSwgbVsxXSwgbVs0XSwgbVs1XSwgbVsxMl0sIG1bMTNdXSA6IG07XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFBhcnNlcyB0aGUgdHJhbnNmb3JtIHZhbHVlcyBmb3IgYW4gZWxlbWVudCwgcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIHgsIHksIHosIHNjYWxlWCwgc2NhbGVZLCBzY2FsZVosIHJvdGF0aW9uLCByb3RhdGlvblgsIHJvdGF0aW9uWSwgc2tld1gsIGFuZCBza2V3WSBwcm9wZXJ0aWVzLiBOb3RlOiBieSBkZWZhdWx0IChmb3IgcGVyZm9ybWFuY2UgcmVhc29ucyksIGFsbCBza2V3aW5nIGlzIGNvbWJpbmVkIGludG8gc2tld1ggYW5kIHJvdGF0aW9uIGJ1dCBza2V3WSBzdGlsbCBoYXMgYSBwbGFjZSBpbiB0aGUgdHJhbnNmb3JtIG9iamVjdCBzbyB0aGF0IHdlIGNhbiByZWNvcmQgaG93IG11Y2ggb2YgdGhlIHNrZXcgaXMgYXR0cmlidXRlZCB0byBza2V3WCB2cyBza2V3WS4gUmVtZW1iZXIsIGEgc2tld1kgb2YgMTAgbG9va3MgdGhlIHNhbWUgYXMgYSByb3RhdGlvbiBvZiAxMCBhbmQgc2tld1ggb2YgLTEwLlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IHRhcmdldCBlbGVtZW50XG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdD19IGNzIGNvbXB1dGVkIHN0eWxlIG9iamVjdCAob3B0aW9uYWwpXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSByZWMgaWYgdHJ1ZSwgdGhlIHRyYW5zZm9ybSB2YWx1ZXMgd2lsbCBiZSByZWNvcmRlZCB0byB0aGUgdGFyZ2V0IGVsZW1lbnQncyBfZ3NUcmFuc2Zvcm0gb2JqZWN0LCBsaWtlIHRhcmdldC5fZ3NUcmFuc2Zvcm0gPSB7eDowLCB5OjAsIHo6MCwgc2NhbGVYOjEuLi59XG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBwYXJzZSBpZiB0cnVlLCB3ZSdsbCBpZ25vcmUgYW55IF9nc1RyYW5zZm9ybSB2YWx1ZXMgdGhhdCBhbHJlYWR5IGV4aXN0IG9uIHRoZSBlbGVtZW50LCBhbmQgZm9yY2UgYSByZXBhcnNpbmcgb2YgdGhlIGNzcyAoY2FsY3VsYXRlZCBzdHlsZSlcblx0XHRcdCAqIEByZXR1cm4ge29iamVjdH0gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB0cmFuc2Zvcm0gcHJvcGVydGllcy92YWx1ZXMgbGlrZSB7eDowLCB5OjAsIHo6MCwgc2NhbGVYOjEuLi59XG5cdFx0XHQgKi9cblx0XHRcdF9nZXRUcmFuc2Zvcm0gPSBfaW50ZXJuYWxzLmdldFRyYW5zZm9ybSA9IGZ1bmN0aW9uKHQsIGNzLCByZWMsIHBhcnNlKSB7XG5cdFx0XHRcdGlmICh0Ll9nc1RyYW5zZm9ybSAmJiByZWMgJiYgIXBhcnNlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHQuX2dzVHJhbnNmb3JtOyAvL2lmIHRoZSBlbGVtZW50IGFscmVhZHkgaGFzIGEgX2dzVHJhbnNmb3JtLCB1c2UgdGhhdC4gTm90ZTogc29tZSBicm93c2VycyBkb24ndCBhY2N1cmF0ZWx5IHJldHVybiB0aGUgY2FsY3VsYXRlZCBzdHlsZSBmb3IgdGhlIHRyYW5zZm9ybSAocGFydGljdWxhcmx5IGZvciBTVkcpLCBzbyBpdCdzIGFsbW9zdCBhbHdheXMgc2FmZXN0IHRvIGp1c3QgdXNlIHRoZSB2YWx1ZXMgd2UndmUgYWxyZWFkeSBhcHBsaWVkIHJhdGhlciB0aGFuIHJlLXBhcnNpbmcgdGhpbmdzLlxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciB0bSA9IHJlYyA/IHQuX2dzVHJhbnNmb3JtIHx8IG5ldyBUcmFuc2Zvcm0oKSA6IG5ldyBUcmFuc2Zvcm0oKSxcblx0XHRcdFx0XHRpbnZYID0gKHRtLnNjYWxlWCA8IDApLCAvL2luIG9yZGVyIHRvIGludGVycHJldCB0aGluZ3MgcHJvcGVybHksIHdlIG5lZWQgdG8ga25vdyBpZiB0aGUgdXNlciBhcHBsaWVkIGEgbmVnYXRpdmUgc2NhbGVYIHByZXZpb3VzbHkgc28gdGhhdCB3ZSBjYW4gYWRqdXN0IHRoZSByb3RhdGlvbiBhbmQgc2tld1ggYWNjb3JkaW5nbHkuIE90aGVyd2lzZSwgaWYgd2UgYWx3YXlzIGludGVycHJldCBhIGZsaXBwZWQgbWF0cml4IGFzIGFmZmVjdGluZyBzY2FsZVkgYW5kIHRoZSB1c2VyIG9ubHkgd2FudHMgdG8gdHdlZW4gdGhlIHNjYWxlWCBvbiBtdWx0aXBsZSBzZXF1ZW50aWFsIHR3ZWVucywgaXQgd291bGQga2VlcCB0aGUgbmVnYXRpdmUgc2NhbGVZIHdpdGhvdXQgdGhhdCBiZWluZyB0aGUgdXNlcidzIGludGVudC5cblx0XHRcdFx0XHRtaW4gPSAwLjAwMDAyLFxuXHRcdFx0XHRcdHJuZCA9IDEwMDAwMCxcblx0XHRcdFx0XHR6T3JpZ2luID0gX3N1cHBvcnRzM0QgPyBwYXJzZUZsb2F0KF9nZXRTdHlsZSh0LCBfdHJhbnNmb3JtT3JpZ2luUHJvcCwgY3MsIGZhbHNlLCBcIjAgMCAwXCIpLnNwbGl0KFwiIFwiKVsyXSkgfHwgdG0uek9yaWdpbiAgfHwgMCA6IDAsXG5cdFx0XHRcdFx0ZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlID0gcGFyc2VGbG9hdChDU1NQbHVnaW4uZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlKSB8fCAwLFxuXHRcdFx0XHRcdG0sIGksIHNjYWxlWCwgc2NhbGVZLCByb3RhdGlvbiwgc2tld1g7XG5cblx0XHRcdFx0dG0uc3ZnID0gISEodC5nZXRCQm94ICYmIF9pc1NWRyh0KSk7XG5cdFx0XHRcdGlmICh0bS5zdmcpIHtcblx0XHRcdFx0XHRfcGFyc2VTVkdPcmlnaW4odCwgX2dldFN0eWxlKHQsIF90cmFuc2Zvcm1PcmlnaW5Qcm9wLCBjcywgZmFsc2UsIFwiNTAlIDUwJVwiKSArIFwiXCIsIHRtLCB0LmdldEF0dHJpYnV0ZShcImRhdGEtc3ZnLW9yaWdpblwiKSk7XG5cdFx0XHRcdFx0X3VzZVNWR1RyYW5zZm9ybUF0dHIgPSBDU1NQbHVnaW4udXNlU1ZHVHJhbnNmb3JtQXR0ciB8fCBfZm9yY2VTVkdUcmFuc2Zvcm1BdHRyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG0gPSBfZ2V0TWF0cml4KHQpO1xuXHRcdFx0XHRpZiAobSAhPT0gX2lkZW50aXR5MkRNYXRyaXgpIHtcblxuXHRcdFx0XHRcdGlmIChtLmxlbmd0aCA9PT0gMTYpIHtcblx0XHRcdFx0XHRcdC8vd2UnbGwgb25seSBsb29rIGF0IHRoZXNlIHBvc2l0aW9uLXJlbGF0ZWQgNiB2YXJpYWJsZXMgZmlyc3QgYmVjYXVzZSBpZiB4L3kveiBhbGwgbWF0Y2gsIGl0J3MgcmVsYXRpdmVseSBzYWZlIHRvIGFzc3VtZSB3ZSBkb24ndCBuZWVkIHRvIHJlLXBhcnNlIGV2ZXJ5dGhpbmcgd2hpY2ggcmlza3MgbG9zaW5nIGltcG9ydGFudCByb3RhdGlvbmFsIGluZm9ybWF0aW9uIChsaWtlIHJvdGF0aW9uWDoxODAgcGx1cyByb3RhdGlvblk6MTgwIHdvdWxkIGxvb2sgdGhlIHNhbWUgYXMgcm90YXRpb246MTgwIC0gdGhlcmUncyBubyB3YXkgdG8ga25vdyBmb3Igc3VyZSB3aGljaCBkaXJlY3Rpb24gd2FzIHRha2VuIGJhc2VkIHNvbGVseSBvbiB0aGUgbWF0cml4M2QoKSB2YWx1ZXMpXG5cdFx0XHRcdFx0XHR2YXIgYTExID0gbVswXSwgYTIxID0gbVsxXSwgYTMxID0gbVsyXSwgYTQxID0gbVszXSxcblx0XHRcdFx0XHRcdFx0YTEyID0gbVs0XSwgYTIyID0gbVs1XSwgYTMyID0gbVs2XSwgYTQyID0gbVs3XSxcblx0XHRcdFx0XHRcdFx0YTEzID0gbVs4XSwgYTIzID0gbVs5XSwgYTMzID0gbVsxMF0sXG5cdFx0XHRcdFx0XHRcdGExNCA9IG1bMTJdLCBhMjQgPSBtWzEzXSwgYTM0ID0gbVsxNF0sXG5cdFx0XHRcdFx0XHRcdGE0MyA9IG1bMTFdLFxuXHRcdFx0XHRcdFx0XHRhbmdsZSA9IE1hdGguYXRhbjIoYTMyLCBhMzMpLFxuXHRcdFx0XHRcdFx0XHR0MSwgdDIsIHQzLCB0NCwgY29zLCBzaW47XG5cblx0XHRcdFx0XHRcdC8vd2UgbWFudWFsbHkgY29tcGVuc2F0ZSBmb3Igbm9uLXplcm8geiBjb21wb25lbnQgb2YgdHJhbnNmb3JtT3JpZ2luIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gU2FmYXJpXG5cdFx0XHRcdFx0XHRpZiAodG0uek9yaWdpbikge1xuXHRcdFx0XHRcdFx0XHRhMzQgPSAtdG0uek9yaWdpbjtcblx0XHRcdFx0XHRcdFx0YTE0ID0gYTEzKmEzNC1tWzEyXTtcblx0XHRcdFx0XHRcdFx0YTI0ID0gYTIzKmEzNC1tWzEzXTtcblx0XHRcdFx0XHRcdFx0YTM0ID0gYTMzKmEzNCt0bS56T3JpZ2luLW1bMTRdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dG0ucm90YXRpb25YID0gYW5nbGUgKiBfUkFEMkRFRztcblx0XHRcdFx0XHRcdC8vcm90YXRpb25YXG5cdFx0XHRcdFx0XHRpZiAoYW5nbGUpIHtcblx0XHRcdFx0XHRcdFx0Y29zID0gTWF0aC5jb3MoLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0c2luID0gTWF0aC5zaW4oLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0dDEgPSBhMTIqY29zK2ExMypzaW47XG5cdFx0XHRcdFx0XHRcdHQyID0gYTIyKmNvcythMjMqc2luO1xuXHRcdFx0XHRcdFx0XHR0MyA9IGEzMipjb3MrYTMzKnNpbjtcblx0XHRcdFx0XHRcdFx0YTEzID0gYTEyKi1zaW4rYTEzKmNvcztcblx0XHRcdFx0XHRcdFx0YTIzID0gYTIyKi1zaW4rYTIzKmNvcztcblx0XHRcdFx0XHRcdFx0YTMzID0gYTMyKi1zaW4rYTMzKmNvcztcblx0XHRcdFx0XHRcdFx0YTQzID0gYTQyKi1zaW4rYTQzKmNvcztcblx0XHRcdFx0XHRcdFx0YTEyID0gdDE7XG5cdFx0XHRcdFx0XHRcdGEyMiA9IHQyO1xuXHRcdFx0XHRcdFx0XHRhMzIgPSB0Mztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vcm90YXRpb25ZXG5cdFx0XHRcdFx0XHRhbmdsZSA9IE1hdGguYXRhbjIoLWEzMSwgYTMzKTtcblx0XHRcdFx0XHRcdHRtLnJvdGF0aW9uWSA9IGFuZ2xlICogX1JBRDJERUc7XG5cdFx0XHRcdFx0XHRpZiAoYW5nbGUpIHtcblx0XHRcdFx0XHRcdFx0Y29zID0gTWF0aC5jb3MoLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0c2luID0gTWF0aC5zaW4oLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0dDEgPSBhMTEqY29zLWExMypzaW47XG5cdFx0XHRcdFx0XHRcdHQyID0gYTIxKmNvcy1hMjMqc2luO1xuXHRcdFx0XHRcdFx0XHR0MyA9IGEzMSpjb3MtYTMzKnNpbjtcblx0XHRcdFx0XHRcdFx0YTIzID0gYTIxKnNpbithMjMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMzMgPSBhMzEqc2luK2EzMypjb3M7XG5cdFx0XHRcdFx0XHRcdGE0MyA9IGE0MSpzaW4rYTQzKmNvcztcblx0XHRcdFx0XHRcdFx0YTExID0gdDE7XG5cdFx0XHRcdFx0XHRcdGEyMSA9IHQyO1xuXHRcdFx0XHRcdFx0XHRhMzEgPSB0Mztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vcm90YXRpb25aXG5cdFx0XHRcdFx0XHRhbmdsZSA9IE1hdGguYXRhbjIoYTIxLCBhMTEpO1xuXHRcdFx0XHRcdFx0dG0ucm90YXRpb24gPSBhbmdsZSAqIF9SQUQyREVHO1xuXHRcdFx0XHRcdFx0aWYgKGFuZ2xlKSB7XG5cdFx0XHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKC1hbmdsZSk7XG5cdFx0XHRcdFx0XHRcdHNpbiA9IE1hdGguc2luKC1hbmdsZSk7XG5cdFx0XHRcdFx0XHRcdGExMSA9IGExMSpjb3MrYTEyKnNpbjtcblx0XHRcdFx0XHRcdFx0dDIgPSBhMjEqY29zK2EyMipzaW47XG5cdFx0XHRcdFx0XHRcdGEyMiA9IGEyMSotc2luK2EyMipjb3M7XG5cdFx0XHRcdFx0XHRcdGEzMiA9IGEzMSotc2luK2EzMipjb3M7XG5cdFx0XHRcdFx0XHRcdGEyMSA9IHQyO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodG0ucm90YXRpb25YICYmIE1hdGguYWJzKHRtLnJvdGF0aW9uWCkgKyBNYXRoLmFicyh0bS5yb3RhdGlvbikgPiAzNTkuOSkgeyAvL3doZW4gcm90YXRpb25ZIGlzIHNldCwgaXQgd2lsbCBvZnRlbiBiZSBwYXJzZWQgYXMgMTgwIGRlZ3JlZXMgZGlmZmVyZW50IHRoYW4gaXQgc2hvdWxkIGJlLCBhbmQgcm90YXRpb25YIGFuZCByb3RhdGlvbiBib3RoIGJlaW5nIDE4MCAoaXQgbG9va3MgdGhlIHNhbWUpLCBzbyB3ZSBhZGp1c3QgZm9yIHRoYXQgaGVyZS5cblx0XHRcdFx0XHRcdFx0dG0ucm90YXRpb25YID0gdG0ucm90YXRpb24gPSAwO1xuXHRcdFx0XHRcdFx0XHR0bS5yb3RhdGlvblkgPSAxODAgLSB0bS5yb3RhdGlvblk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRtLnNjYWxlWCA9ICgoTWF0aC5zcXJ0KGExMSAqIGExMSArIGEyMSAqIGEyMSkgKiBybmQgKyAwLjUpIHwgMCkgLyBybmQ7XG5cdFx0XHRcdFx0XHR0bS5zY2FsZVkgPSAoKE1hdGguc3FydChhMjIgKiBhMjIgKyBhMjMgKiBhMjMpICogcm5kICsgMC41KSB8IDApIC8gcm5kO1xuXHRcdFx0XHRcdFx0dG0uc2NhbGVaID0gKChNYXRoLnNxcnQoYTMyICogYTMyICsgYTMzICogYTMzKSAqIHJuZCArIDAuNSkgfCAwKSAvIHJuZDtcblx0XHRcdFx0XHRcdGlmICh0bS5yb3RhdGlvblggfHwgdG0ucm90YXRpb25ZKSB7XG5cdFx0XHRcdFx0XHRcdHRtLnNrZXdYID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRtLnNrZXdYID0gKGExMiB8fCBhMjIpID8gTWF0aC5hdGFuMihhMTIsIGEyMikgKiBfUkFEMkRFRyArIHRtLnJvdGF0aW9uIDogdG0uc2tld1ggfHwgMDtcblx0XHRcdFx0XHRcdFx0aWYgKE1hdGguYWJzKHRtLnNrZXdYKSA+IDkwICYmIE1hdGguYWJzKHRtLnNrZXdYKSA8IDI3MCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChpbnZYKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5zY2FsZVggKj0gLTE7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5za2V3WCArPSAodG0ucm90YXRpb24gPD0gMCkgPyAxODAgOiAtMTgwO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG0ucm90YXRpb24gKz0gKHRtLnJvdGF0aW9uIDw9IDApID8gMTgwIDogLTE4MDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0dG0uc2NhbGVZICo9IC0xO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG0uc2tld1ggKz0gKHRtLnNrZXdYIDw9IDApID8gMTgwIDogLTE4MDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRtLnBlcnNwZWN0aXZlID0gYTQzID8gMSAvICgoYTQzIDwgMCkgPyAtYTQzIDogYTQzKSA6IDA7XG5cdFx0XHRcdFx0XHR0bS54ID0gYTE0O1xuXHRcdFx0XHRcdFx0dG0ueSA9IGEyNDtcblx0XHRcdFx0XHRcdHRtLnogPSBhMzQ7XG5cdFx0XHRcdFx0XHRpZiAodG0uc3ZnKSB7XG5cdFx0XHRcdFx0XHRcdHRtLnggLT0gdG0ueE9yaWdpbiAtICh0bS54T3JpZ2luICogYTExIC0gdG0ueU9yaWdpbiAqIGExMik7XG5cdFx0XHRcdFx0XHRcdHRtLnkgLT0gdG0ueU9yaWdpbiAtICh0bS55T3JpZ2luICogYTIxIC0gdG0ueE9yaWdpbiAqIGEyMik7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKCghX3N1cHBvcnRzM0QgfHwgcGFyc2UgfHwgIW0ubGVuZ3RoIHx8IHRtLnggIT09IG1bNF0gfHwgdG0ueSAhPT0gbVs1XSB8fCAoIXRtLnJvdGF0aW9uWCAmJiAhdG0ucm90YXRpb25ZKSkpIHsgLy9zb21ldGltZXMgYSA2LWVsZW1lbnQgbWF0cml4IGlzIHJldHVybmVkIGV2ZW4gd2hlbiB3ZSBwZXJmb3JtZWQgM0QgdHJhbnNmb3JtcywgbGlrZSBpZiByb3RhdGlvblggYW5kIHJvdGF0aW9uWSBhcmUgMTgwLiBJbiBjYXNlcyBsaWtlIHRoaXMsIHdlIHN0aWxsIG5lZWQgdG8gaG9ub3IgdGhlIDNEIHRyYW5zZm9ybXMuIElmIHdlIGp1c3QgcmVseSBvbiB0aGUgMkQgaW5mbywgaXQgY291bGQgYWZmZWN0IGhvdyB0aGUgZGF0YSBpcyBpbnRlcnByZXRlZCwgbGlrZSBzY2FsZVkgbWlnaHQgZ2V0IHNldCB0byAtMSBvciByb3RhdGlvbiBjb3VsZCBnZXQgb2Zmc2V0IGJ5IDE4MCBkZWdyZWVzLiBGb3IgZXhhbXBsZSwgZG8gYSBUd2VlbkxpdGUudG8oZWxlbWVudCwgMSwge2Nzczp7cm90YXRpb25YOjE4MCwgcm90YXRpb25ZOjE4MH19KSBhbmQgdGhlbiBsYXRlciwgVHdlZW5MaXRlLnRvKGVsZW1lbnQsIDEsIHtjc3M6e3JvdGF0aW9uWDowfX0pIGFuZCB3aXRob3V0IHRoaXMgY29uZGl0aW9uYWwgbG9naWMgaW4gcGxhY2UsIGl0J2QganVtcCB0byBhIHN0YXRlIG9mIGJlaW5nIHVucm90YXRlZCB3aGVuIHRoZSAybmQgdHdlZW4gc3RhcnRzLiBUaGVuIGFnYWluLCB3ZSBuZWVkIHRvIGhvbm9yIHRoZSBmYWN0IHRoYXQgdGhlIHVzZXIgQ09VTEQgYWx0ZXIgdGhlIHRyYW5zZm9ybXMgb3V0c2lkZSBvZiBDU1NQbHVnaW4sIGxpa2UgYnkgbWFudWFsbHkgYXBwbHlpbmcgbmV3IGNzcywgc28gd2UgdHJ5IHRvIHNlbnNlIHRoYXQgYnkgbG9va2luZyBhdCB4IGFuZCB5IGJlY2F1c2UgaWYgdGhvc2UgY2hhbmdlZCwgd2Uga25vdyB0aGUgY2hhbmdlcyB3ZXJlIG1hZGUgb3V0c2lkZSBDU1NQbHVnaW4gYW5kIHdlIGZvcmNlIGEgcmVpbnRlcnByZXRhdGlvbiBvZiB0aGUgbWF0cml4IHZhbHVlcy4gQWxzbywgaW4gV2Via2l0IGJyb3dzZXJzLCBpZiB0aGUgZWxlbWVudCdzIFwiZGlzcGxheVwiIGlzIFwibm9uZVwiLCBpdHMgY2FsY3VsYXRlZCBzdHlsZSB2YWx1ZSB3aWxsIGFsd2F5cyByZXR1cm4gZW1wdHksIHNvIGlmIHdlJ3ZlIGFscmVhZHkgcmVjb3JkZWQgdGhlIHZhbHVlcyBpbiB0aGUgX2dzVHJhbnNmb3JtIG9iamVjdCwgd2UnbGwganVzdCByZWx5IG9uIHRob3NlLlxuXHRcdFx0XHRcdFx0dmFyIGsgPSAobS5sZW5ndGggPj0gNiksXG5cdFx0XHRcdFx0XHRcdGEgPSBrID8gbVswXSA6IDEsXG5cdFx0XHRcdFx0XHRcdGIgPSBtWzFdIHx8IDAsXG5cdFx0XHRcdFx0XHRcdGMgPSBtWzJdIHx8IDAsXG5cdFx0XHRcdFx0XHRcdGQgPSBrID8gbVszXSA6IDE7XG5cdFx0XHRcdFx0XHR0bS54ID0gbVs0XSB8fCAwO1xuXHRcdFx0XHRcdFx0dG0ueSA9IG1bNV0gfHwgMDtcblx0XHRcdFx0XHRcdHNjYWxlWCA9IE1hdGguc3FydChhICogYSArIGIgKiBiKTtcblx0XHRcdFx0XHRcdHNjYWxlWSA9IE1hdGguc3FydChkICogZCArIGMgKiBjKTtcblx0XHRcdFx0XHRcdHJvdGF0aW9uID0gKGEgfHwgYikgPyBNYXRoLmF0YW4yKGIsIGEpICogX1JBRDJERUcgOiB0bS5yb3RhdGlvbiB8fCAwOyAvL25vdGU6IGlmIHNjYWxlWCBpcyAwLCB3ZSBjYW5ub3QgYWNjdXJhdGVseSBtZWFzdXJlIHJvdGF0aW9uLiBTYW1lIGZvciBza2V3WCB3aXRoIGEgc2NhbGVZIG9mIDAuIFRoZXJlZm9yZSwgd2UgZGVmYXVsdCB0byB0aGUgcHJldmlvdXNseSByZWNvcmRlZCB2YWx1ZSAob3IgemVybyBpZiB0aGF0IGRvZXNuJ3QgZXhpc3QpLlxuXHRcdFx0XHRcdFx0c2tld1ggPSAoYyB8fCBkKSA/IE1hdGguYXRhbjIoYywgZCkgKiBfUkFEMkRFRyArIHJvdGF0aW9uIDogdG0uc2tld1ggfHwgMDtcblx0XHRcdFx0XHRcdGlmIChNYXRoLmFicyhza2V3WCkgPiA5MCAmJiBNYXRoLmFicyhza2V3WCkgPCAyNzApIHtcblx0XHRcdFx0XHRcdFx0aWYgKGludlgpIHtcblx0XHRcdFx0XHRcdFx0XHRzY2FsZVggKj0gLTE7XG5cdFx0XHRcdFx0XHRcdFx0c2tld1ggKz0gKHJvdGF0aW9uIDw9IDApID8gMTgwIDogLTE4MDtcblx0XHRcdFx0XHRcdFx0XHRyb3RhdGlvbiArPSAocm90YXRpb24gPD0gMCkgPyAxODAgOiAtMTgwO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHNjYWxlWSAqPSAtMTtcblx0XHRcdFx0XHRcdFx0XHRza2V3WCArPSAoc2tld1ggPD0gMCkgPyAxODAgOiAtMTgwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0bS5zY2FsZVggPSBzY2FsZVg7XG5cdFx0XHRcdFx0XHR0bS5zY2FsZVkgPSBzY2FsZVk7XG5cdFx0XHRcdFx0XHR0bS5yb3RhdGlvbiA9IHJvdGF0aW9uO1xuXHRcdFx0XHRcdFx0dG0uc2tld1ggPSBza2V3WDtcblx0XHRcdFx0XHRcdGlmIChfc3VwcG9ydHMzRCkge1xuXHRcdFx0XHRcdFx0XHR0bS5yb3RhdGlvblggPSB0bS5yb3RhdGlvblkgPSB0bS56ID0gMDtcblx0XHRcdFx0XHRcdFx0dG0ucGVyc3BlY3RpdmUgPSBkZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmU7XG5cdFx0XHRcdFx0XHRcdHRtLnNjYWxlWiA9IDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodG0uc3ZnKSB7XG5cdFx0XHRcdFx0XHRcdHRtLnggLT0gdG0ueE9yaWdpbiAtICh0bS54T3JpZ2luICogYSArIHRtLnlPcmlnaW4gKiBjKTtcblx0XHRcdFx0XHRcdFx0dG0ueSAtPSB0bS55T3JpZ2luIC0gKHRtLnhPcmlnaW4gKiBiICsgdG0ueU9yaWdpbiAqIGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0bS56T3JpZ2luID0gek9yaWdpbjtcblx0XHRcdFx0XHQvL3NvbWUgYnJvd3NlcnMgaGF2ZSBhIGhhcmQgdGltZSB3aXRoIHZlcnkgc21hbGwgdmFsdWVzIGxpa2UgMi40NDkyOTM1OTgyOTQ3MDY0ZS0xNiAobm90aWNlIHRoZSBcImUtXCIgdG93YXJkcyB0aGUgZW5kKSBhbmQgd291bGQgcmVuZGVyIHRoZSBvYmplY3Qgc2xpZ2h0bHkgb2ZmLiBTbyB3ZSByb3VuZCB0byAwIGluIHRoZXNlIGNhc2VzLiBUaGUgY29uZGl0aW9uYWwgbG9naWMgaGVyZSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIE1hdGguYWJzKCkuIEFsc28sIGJyb3dzZXJzIHRlbmQgdG8gcmVuZGVyIGEgU0xJR0hUTFkgcm90YXRlZCBvYmplY3QgaW4gYSBmdXp6eSB3YXksIHNvIHdlIG5lZWQgdG8gc25hcCB0byBleGFjdGx5IDAgd2hlbiBhcHByb3ByaWF0ZS5cblx0XHRcdFx0XHRmb3IgKGkgaW4gdG0pIHtcblx0XHRcdFx0XHRcdGlmICh0bVtpXSA8IG1pbikgaWYgKHRtW2ldID4gLW1pbikge1xuXHRcdFx0XHRcdFx0XHR0bVtpXSA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vREVCVUc6IF9sb2coXCJwYXJzZWQgcm90YXRpb24gb2YgXCIgKyB0LmdldEF0dHJpYnV0ZShcImlkXCIpK1wiOiBcIisodG0ucm90YXRpb25YKStcIiwgXCIrKHRtLnJvdGF0aW9uWSkrXCIsIFwiKyh0bS5yb3RhdGlvbikrXCIsIHNjYWxlOiBcIit0bS5zY2FsZVgrXCIsIFwiK3RtLnNjYWxlWStcIiwgXCIrdG0uc2NhbGVaK1wiLCBwb3NpdGlvbjogXCIrdG0ueCtcIiwgXCIrdG0ueStcIiwgXCIrdG0ueitcIiwgcGVyc3BlY3RpdmU6IFwiK3RtLnBlcnNwZWN0aXZlKyBcIiwgb3JpZ2luOiBcIisgdG0ueE9yaWdpbisgXCIsXCIrIHRtLnlPcmlnaW4pO1xuXHRcdFx0XHRpZiAocmVjKSB7XG5cdFx0XHRcdFx0dC5fZ3NUcmFuc2Zvcm0gPSB0bTsgLy9yZWNvcmQgdG8gdGhlIG9iamVjdCdzIF9nc1RyYW5zZm9ybSB3aGljaCB3ZSB1c2Ugc28gdGhhdCB0d2VlbnMgY2FuIGNvbnRyb2wgaW5kaXZpZHVhbCBwcm9wZXJ0aWVzIGluZGVwZW5kZW50bHkgKHdlIG5lZWQgYWxsIHRoZSBwcm9wZXJ0aWVzIHRvIGFjY3VyYXRlbHkgcmVjb21wb3NlIHRoZSBtYXRyaXggaW4gdGhlIHNldFJhdGlvKCkgbWV0aG9kKVxuXHRcdFx0XHRcdGlmICh0bS5zdmcpIHsgLy9pZiB3ZSdyZSBzdXBwb3NlZCB0byBhcHBseSB0cmFuc2Zvcm1zIHRvIHRoZSBTVkcgZWxlbWVudCdzIFwidHJhbnNmb3JtXCIgYXR0cmlidXRlLCBtYWtlIHN1cmUgdGhlcmUgYXJlbid0IGFueSBDU1MgdHJhbnNmb3JtcyBhcHBsaWVkIG9yIHRoZXknbGwgb3ZlcnJpZGUgdGhlIGF0dHJpYnV0ZSBvbmVzLiBBbHNvIGNsZWFyIHRoZSB0cmFuc2Zvcm0gYXR0cmlidXRlIGlmIHdlJ3JlIHVzaW5nIENTUywganVzdCB0byBiZSBjbGVhbi5cblx0XHRcdFx0XHRcdGlmIChfdXNlU1ZHVHJhbnNmb3JtQXR0ciAmJiB0LnN0eWxlW190cmFuc2Zvcm1Qcm9wXSkge1xuXHRcdFx0XHRcdFx0XHRUd2VlbkxpdGUuZGVsYXllZENhbGwoMC4wMDEsIGZ1bmN0aW9uKCl7IC8vaWYgd2UgYXBwbHkgdGhpcyByaWdodCBhd2F5IChiZWZvcmUgYW55dGhpbmcgaGFzIHJlbmRlcmVkKSwgd2UgcmlzayB0aGVyZSBiZWluZyBubyB0cmFuc2Zvcm1zIGZvciBhIGJyaWVmIG1vbWVudCBhbmQgaXQgYWxzbyBpbnRlcmZlcmVzIHdpdGggYWRqdXN0aW5nIHRoZSB0cmFuc2Zvcm1PcmlnaW4gaW4gYSB0d2VlbiB3aXRoIGltbWVkaWF0ZVJlbmRlcjp0cnVlIChpdCdkIHRyeSByZWFkaW5nIHRoZSBtYXRyaXggYW5kIGl0IHdvdWxkbid0IGhhdmUgdGhlIGFwcHJvcHJpYXRlIGRhdGEgaW4gcGxhY2UgYmVjYXVzZSB3ZSBqdXN0IHJlbW92ZWQgaXQpLlxuXHRcdFx0XHRcdFx0XHRcdF9yZW1vdmVQcm9wKHQuc3R5bGUsIF90cmFuc2Zvcm1Qcm9wKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFfdXNlU1ZHVHJhbnNmb3JtQXR0ciAmJiB0LmdldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKSkge1xuXHRcdFx0XHRcdFx0XHRUd2VlbkxpdGUuZGVsYXllZENhbGwoMC4wMDEsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0dC5yZW1vdmVBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdG07XG5cdFx0XHR9LFxuXG5cdFx0XHQvL2ZvciBzZXR0aW5nIDJEIHRyYW5zZm9ybXMgaW4gSUU2LCBJRTcsIGFuZCBJRTggKG11c3QgdXNlIGEgXCJmaWx0ZXJcIiB0byBlbXVsYXRlIHRoZSBiZWhhdmlvciBvZiBtb2Rlcm4gZGF5IGJyb3dzZXIgdHJhbnNmb3Jtcylcblx0XHRcdF9zZXRJRVRyYW5zZm9ybVJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR2YXIgdCA9IHRoaXMuZGF0YSwgLy9yZWZlcnMgdG8gdGhlIGVsZW1lbnQncyBfZ3NUcmFuc2Zvcm0gb2JqZWN0XG5cdFx0XHRcdFx0YW5nID0gLXQucm90YXRpb24gKiBfREVHMlJBRCxcblx0XHRcdFx0XHRza2V3ID0gYW5nICsgdC5za2V3WCAqIF9ERUcyUkFELFxuXHRcdFx0XHRcdHJuZCA9IDEwMDAwMCxcblx0XHRcdFx0XHRhID0gKChNYXRoLmNvcyhhbmcpICogdC5zY2FsZVggKiBybmQpIHwgMCkgLyBybmQsXG5cdFx0XHRcdFx0YiA9ICgoTWF0aC5zaW4oYW5nKSAqIHQuc2NhbGVYICogcm5kKSB8IDApIC8gcm5kLFxuXHRcdFx0XHRcdGMgPSAoKE1hdGguc2luKHNrZXcpICogLXQuc2NhbGVZICogcm5kKSB8IDApIC8gcm5kLFxuXHRcdFx0XHRcdGQgPSAoKE1hdGguY29zKHNrZXcpICogdC5zY2FsZVkgKiBybmQpIHwgMCkgLyBybmQsXG5cdFx0XHRcdFx0c3R5bGUgPSB0aGlzLnQuc3R5bGUsXG5cdFx0XHRcdFx0Y3MgPSB0aGlzLnQuY3VycmVudFN0eWxlLFxuXHRcdFx0XHRcdGZpbHRlcnMsIHZhbDtcblx0XHRcdFx0aWYgKCFjcykge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YWwgPSBiOyAvL2p1c3QgZm9yIHN3YXBwaW5nIHRoZSB2YXJpYWJsZXMgYW4gaW52ZXJ0aW5nIHRoZW0gKHJldXNlZCBcInZhbFwiIHRvIGF2b2lkIGNyZWF0aW5nIGFub3RoZXIgdmFyaWFibGUgaW4gbWVtb3J5KS4gSUUncyBmaWx0ZXIgbWF0cml4IHVzZXMgYSBub24tc3RhbmRhcmQgbWF0cml4IGNvbmZpZ3VyYXRpb24gKGFuZ2xlIGdvZXMgdGhlIG9wcG9zaXRlIHdheSwgYW5kIGIgYW5kIGMgYXJlIHJldmVyc2VkIGFuZCBpbnZlcnRlZClcblx0XHRcdFx0YiA9IC1jO1xuXHRcdFx0XHRjID0gLXZhbDtcblx0XHRcdFx0ZmlsdGVycyA9IGNzLmZpbHRlcjtcblx0XHRcdFx0c3R5bGUuZmlsdGVyID0gXCJcIjsgLy9yZW1vdmUgZmlsdGVycyBzbyB0aGF0IHdlIGNhbiBhY2N1cmF0ZWx5IG1lYXN1cmUgb2Zmc2V0V2lkdGgvb2Zmc2V0SGVpZ2h0XG5cdFx0XHRcdHZhciB3ID0gdGhpcy50Lm9mZnNldFdpZHRoLFxuXHRcdFx0XHRcdGggPSB0aGlzLnQub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0XHRcdGNsaXAgPSAoY3MucG9zaXRpb24gIT09IFwiYWJzb2x1dGVcIiksXG5cdFx0XHRcdFx0bSA9IFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0Lk1hdHJpeChNMTE9XCIgKyBhICsgXCIsIE0xMj1cIiArIGIgKyBcIiwgTTIxPVwiICsgYyArIFwiLCBNMjI9XCIgKyBkLFxuXHRcdFx0XHRcdG94ID0gdC54ICsgKHcgKiB0LnhQZXJjZW50IC8gMTAwKSxcblx0XHRcdFx0XHRveSA9IHQueSArIChoICogdC55UGVyY2VudCAvIDEwMCksXG5cdFx0XHRcdFx0ZHgsIGR5O1xuXG5cdFx0XHRcdC8vaWYgdHJhbnNmb3JtT3JpZ2luIGlzIGJlaW5nIHVzZWQsIGFkanVzdCB0aGUgb2Zmc2V0IHggYW5kIHlcblx0XHRcdFx0aWYgKHQub3ggIT0gbnVsbCkge1xuXHRcdFx0XHRcdGR4ID0gKCh0Lm94cCkgPyB3ICogdC5veCAqIDAuMDEgOiB0Lm94KSAtIHcgLyAyO1xuXHRcdFx0XHRcdGR5ID0gKCh0Lm95cCkgPyBoICogdC5veSAqIDAuMDEgOiB0Lm95KSAtIGggLyAyO1xuXHRcdFx0XHRcdG94ICs9IGR4IC0gKGR4ICogYSArIGR5ICogYik7XG5cdFx0XHRcdFx0b3kgKz0gZHkgLSAoZHggKiBjICsgZHkgKiBkKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghY2xpcCkge1xuXHRcdFx0XHRcdG0gKz0gXCIsIHNpemluZ01ldGhvZD0nYXV0byBleHBhbmQnKVwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGR4ID0gKHcgLyAyKTtcblx0XHRcdFx0XHRkeSA9IChoIC8gMik7XG5cdFx0XHRcdFx0Ly90cmFuc2xhdGUgdG8gZW5zdXJlIHRoYXQgdHJhbnNmb3JtYXRpb25zIG9jY3VyIGFyb3VuZCB0aGUgY29ycmVjdCBvcmlnaW4gKGRlZmF1bHQgaXMgY2VudGVyKS5cblx0XHRcdFx0XHRtICs9IFwiLCBEeD1cIiArIChkeCAtIChkeCAqIGEgKyBkeSAqIGIpICsgb3gpICsgXCIsIER5PVwiICsgKGR5IC0gKGR4ICogYyArIGR5ICogZCkgKyBveSkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZmlsdGVycy5pbmRleE9mKFwiRFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuTWF0cml4KFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRzdHlsZS5maWx0ZXIgPSBmaWx0ZXJzLnJlcGxhY2UoX2llU2V0TWF0cml4RXhwLCBtKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdHlsZS5maWx0ZXIgPSBtICsgXCIgXCIgKyBmaWx0ZXJzOyAvL3dlIG11c3QgYWx3YXlzIHB1dCB0aGUgdHJhbnNmb3JtL21hdHJpeCBGSVJTVCAoYmVmb3JlIGFscGhhKG9wYWNpdHk9eHgpKSB0byBhdm9pZCBhbiBJRSBidWcgdGhhdCBzbGljZXMgcGFydCBvZiB0aGUgb2JqZWN0IHdoZW4gcm90YXRpb24gaXMgYXBwbGllZCB3aXRoIGFscGhhLlxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9hdCB0aGUgZW5kIG9yIGJlZ2lubmluZyBvZiB0aGUgdHdlZW4sIGlmIHRoZSBtYXRyaXggaXMgbm9ybWFsICgxLCAwLCAwLCAxKSBhbmQgb3BhY2l0eSBpcyAxMDAgKG9yIGRvZXNuJ3QgZXhpc3QpLCByZW1vdmUgdGhlIGZpbHRlciB0byBpbXByb3ZlIGJyb3dzZXIgcGVyZm9ybWFuY2UuXG5cdFx0XHRcdGlmICh2ID09PSAwIHx8IHYgPT09IDEpIGlmIChhID09PSAxKSBpZiAoYiA9PT0gMCkgaWYgKGMgPT09IDApIGlmIChkID09PSAxKSBpZiAoIWNsaXAgfHwgbS5pbmRleE9mKFwiRHg9MCwgRHk9MFwiKSAhPT0gLTEpIGlmICghX29wYWNpdHlFeHAudGVzdChmaWx0ZXJzKSB8fCBwYXJzZUZsb2F0KFJlZ0V4cC4kMSkgPT09IDEwMCkgaWYgKGZpbHRlcnMuaW5kZXhPZihcImdyYWRpZW50KFwiICYmIGZpbHRlcnMuaW5kZXhPZihcIkFscGhhXCIpKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRzdHlsZS5yZW1vdmVBdHRyaWJ1dGUoXCJmaWx0ZXJcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL3dlIG11c3Qgc2V0IHRoZSBtYXJnaW5zIEFGVEVSIGFwcGx5aW5nIHRoZSBmaWx0ZXIgaW4gb3JkZXIgdG8gYXZvaWQgc29tZSBidWdzIGluIElFOCB0aGF0IGNvdWxkIChpbiByYXJlIHNjZW5hcmlvcykgY2F1c2UgdGhlbSB0byBiZSBpZ25vcmVkIGludGVybWl0dGVudGx5ICh2aWJyYXRpb24pLlxuXHRcdFx0XHRpZiAoIWNsaXApIHtcblx0XHRcdFx0XHR2YXIgbXVsdCA9IChfaWVWZXJzIDwgOCkgPyAxIDogLTEsIC8vaW4gSW50ZXJuZXQgRXhwbG9yZXIgNyBhbmQgYmVmb3JlLCB0aGUgYm94IG1vZGVsIGlzIGJyb2tlbiwgY2F1c2luZyB0aGUgYnJvd3NlciB0byB0cmVhdCB0aGUgd2lkdGgvaGVpZ2h0IG9mIHRoZSBhY3R1YWwgcm90YXRlZCBmaWx0ZXJlZCBpbWFnZSBhcyB0aGUgd2lkdGgvaGVpZ2h0IG9mIHRoZSBib3ggaXRzZWxmLCBidXQgTWljcm9zb2Z0IGNvcnJlY3RlZCB0aGF0IGluIElFOC4gV2UgbXVzdCB1c2UgYSBuZWdhdGl2ZSBvZmZzZXQgaW4gSUU4IG9uIHRoZSByaWdodC9ib3R0b21cblx0XHRcdFx0XHRcdG1hcmcsIHByb3AsIGRpZjtcblx0XHRcdFx0XHRkeCA9IHQuaWVPZmZzZXRYIHx8IDA7XG5cdFx0XHRcdFx0ZHkgPSB0LmllT2Zmc2V0WSB8fCAwO1xuXHRcdFx0XHRcdHQuaWVPZmZzZXRYID0gTWF0aC5yb3VuZCgodyAtICgoYSA8IDAgPyAtYSA6IGEpICogdyArIChiIDwgMCA/IC1iIDogYikgKiBoKSkgLyAyICsgb3gpO1xuXHRcdFx0XHRcdHQuaWVPZmZzZXRZID0gTWF0aC5yb3VuZCgoaCAtICgoZCA8IDAgPyAtZCA6IGQpICogaCArIChjIDwgMCA/IC1jIDogYykgKiB3KSkgLyAyICsgb3kpO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCA0OyBpKyspIHtcblx0XHRcdFx0XHRcdHByb3AgPSBfbWFyZ2luc1tpXTtcblx0XHRcdFx0XHRcdG1hcmcgPSBjc1twcm9wXTtcblx0XHRcdFx0XHRcdC8vd2UgbmVlZCB0byBnZXQgdGhlIGN1cnJlbnQgbWFyZ2luIGluIGNhc2UgaXQgaXMgYmVpbmcgdHdlZW5lZCBzZXBhcmF0ZWx5ICh3ZSB3YW50IHRvIHJlc3BlY3QgdGhhdCB0d2VlbidzIGNoYW5nZXMpXG5cdFx0XHRcdFx0XHR2YWwgPSAobWFyZy5pbmRleE9mKFwicHhcIikgIT09IC0xKSA/IHBhcnNlRmxvYXQobWFyZykgOiBfY29udmVydFRvUGl4ZWxzKHRoaXMudCwgcHJvcCwgcGFyc2VGbG9hdChtYXJnKSwgbWFyZy5yZXBsYWNlKF9zdWZmaXhFeHAsIFwiXCIpKSB8fCAwO1xuXHRcdFx0XHRcdFx0aWYgKHZhbCAhPT0gdFtwcm9wXSkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoaSA8IDIpID8gLXQuaWVPZmZzZXRYIDogLXQuaWVPZmZzZXRZOyAvL2lmIGFub3RoZXIgdHdlZW4gaXMgY29udHJvbGxpbmcgYSBtYXJnaW4sIHdlIGNhbm5vdCBvbmx5IGFwcGx5IHRoZSBkaWZmZXJlbmNlIGluIHRoZSBpZU9mZnNldHMsIHNvIHdlIGVzc2VudGlhbGx5IHplcm8tb3V0IHRoZSBkeCBhbmQgZHkgaGVyZSBpbiB0aGF0IGNhc2UuIFdlIHJlY29yZCB0aGUgbWFyZ2luKHMpIGxhdGVyIHNvIHRoYXQgd2UgY2FuIGtlZXAgY29tcGFyaW5nIHRoZW0sIG1ha2luZyB0aGlzIGNvZGUgdmVyeSBmbGV4aWJsZS5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9IChpIDwgMikgPyBkeCAtIHQuaWVPZmZzZXRYIDogZHkgLSB0LmllT2Zmc2V0WTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHN0eWxlW3Byb3BdID0gKHRbcHJvcF0gPSBNYXRoLnJvdW5kKCB2YWwgLSBkaWYgKiAoKGkgPT09IDAgfHwgaSA9PT0gMikgPyAxIDogbXVsdCkgKSkgKyBcInB4XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvKiB0cmFuc2xhdGVzIGEgc3VwZXIgc21hbGwgZGVjaW1hbCB0byBhIHN0cmluZyBXSVRIT1VUIHNjaWVudGlmaWMgbm90YXRpb25cblx0XHRcdF9zYWZlRGVjaW1hbCA9IGZ1bmN0aW9uKG4pIHtcblx0XHRcdFx0dmFyIHMgPSAobiA8IDAgPyAtbiA6IG4pICsgXCJcIixcblx0XHRcdFx0XHRhID0gcy5zcGxpdChcImUtXCIpO1xuXHRcdFx0XHRyZXR1cm4gKG4gPCAwID8gXCItMC5cIiA6IFwiMC5cIikgKyBuZXcgQXJyYXkocGFyc2VJbnQoYVsxXSwgMTApIHx8IDApLmpvaW4oXCIwXCIpICsgYVswXS5zcGxpdChcIi5cIikuam9pbihcIlwiKTtcblx0XHRcdH0sXG5cdFx0XHQqL1xuXG5cdFx0XHRfc2V0VHJhbnNmb3JtUmF0aW8gPSBfaW50ZXJuYWxzLnNldDNEVHJhbnNmb3JtUmF0aW8gPSBfaW50ZXJuYWxzLnNldFRyYW5zZm9ybVJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR2YXIgdCA9IHRoaXMuZGF0YSwgLy9yZWZlcnMgdG8gdGhlIGVsZW1lbnQncyBfZ3NUcmFuc2Zvcm0gb2JqZWN0XG5cdFx0XHRcdFx0c3R5bGUgPSB0aGlzLnQuc3R5bGUsXG5cdFx0XHRcdFx0YW5nbGUgPSB0LnJvdGF0aW9uLFxuXHRcdFx0XHRcdHJvdGF0aW9uWCA9IHQucm90YXRpb25YLFxuXHRcdFx0XHRcdHJvdGF0aW9uWSA9IHQucm90YXRpb25ZLFxuXHRcdFx0XHRcdHN4ID0gdC5zY2FsZVgsXG5cdFx0XHRcdFx0c3kgPSB0LnNjYWxlWSxcblx0XHRcdFx0XHRzeiA9IHQuc2NhbGVaLFxuXHRcdFx0XHRcdHggPSB0LngsXG5cdFx0XHRcdFx0eSA9IHQueSxcblx0XHRcdFx0XHR6ID0gdC56LFxuXHRcdFx0XHRcdGlzU1ZHID0gdC5zdmcsXG5cdFx0XHRcdFx0cGVyc3BlY3RpdmUgPSB0LnBlcnNwZWN0aXZlLFxuXHRcdFx0XHRcdGZvcmNlM0QgPSB0LmZvcmNlM0QsXG5cdFx0XHRcdFx0YTExLCBhMTIsIGExMywgYTIxLCBhMjIsIGEyMywgYTMxLCBhMzIsIGEzMywgYTQxLCBhNDIsIGE0Myxcblx0XHRcdFx0XHR6T3JpZ2luLCBtaW4sIGNvcywgc2luLCB0MSwgdDIsIHRyYW5zZm9ybSwgY29tbWEsIHplcm8sIHNrZXcsIHJuZDtcblx0XHRcdFx0Ly9jaGVjayB0byBzZWUgaWYgd2Ugc2hvdWxkIHJlbmRlciBhcyAyRCAoYW5kIFNWR3MgbXVzdCB1c2UgMkQgd2hlbiBfdXNlU1ZHVHJhbnNmb3JtQXR0ciBpcyB0cnVlKVxuXHRcdFx0XHRpZiAoKCgoKHYgPT09IDEgfHwgdiA9PT0gMCkgJiYgZm9yY2UzRCA9PT0gXCJhdXRvXCIgJiYgKHRoaXMudHdlZW4uX3RvdGFsVGltZSA9PT0gdGhpcy50d2Vlbi5fdG90YWxEdXJhdGlvbiB8fCAhdGhpcy50d2Vlbi5fdG90YWxUaW1lKSkgfHwgIWZvcmNlM0QpICYmICF6ICYmICFwZXJzcGVjdGl2ZSAmJiAhcm90YXRpb25ZICYmICFyb3RhdGlvblggJiYgc3ogPT09IDEpIHx8IChfdXNlU1ZHVHJhbnNmb3JtQXR0ciAmJiBpc1NWRykgfHwgIV9zdXBwb3J0czNEKSB7IC8vb24gdGhlIGZpbmFsIHJlbmRlciAod2hpY2ggY291bGQgYmUgMCBmb3IgYSBmcm9tIHR3ZWVuKSwgaWYgdGhlcmUgYXJlIG5vIDNEIGFzcGVjdHMsIHJlbmRlciBpbiAyRCB0byBmcmVlIHVwIG1lbW9yeSBhbmQgaW1wcm92ZSBwZXJmb3JtYW5jZSBlc3BlY2lhbGx5IG9uIG1vYmlsZSBkZXZpY2VzLiBDaGVjayB0aGUgdHdlZW4ncyB0b3RhbFRpbWUvdG90YWxEdXJhdGlvbiB0b28gaW4gb3JkZXIgdG8gbWFrZSBzdXJlIGl0IGRvZXNuJ3QgaGFwcGVuIGJldHdlZW4gcmVwZWF0cyBpZiBpdCdzIGEgcmVwZWF0aW5nIHR3ZWVuLlxuXG5cdFx0XHRcdFx0Ly8yRFxuXHRcdFx0XHRcdGlmIChhbmdsZSB8fCB0LnNrZXdYIHx8IGlzU1ZHKSB7XG5cdFx0XHRcdFx0XHRhbmdsZSAqPSBfREVHMlJBRDtcblx0XHRcdFx0XHRcdHNrZXcgPSB0LnNrZXdYICogX0RFRzJSQUQ7XG5cdFx0XHRcdFx0XHRybmQgPSAxMDAwMDA7XG5cdFx0XHRcdFx0XHRhMTEgPSBNYXRoLmNvcyhhbmdsZSkgKiBzeDtcblx0XHRcdFx0XHRcdGEyMSA9IE1hdGguc2luKGFuZ2xlKSAqIHN4O1xuXHRcdFx0XHRcdFx0YTEyID0gTWF0aC5zaW4oYW5nbGUgLSBza2V3KSAqIC1zeTtcblx0XHRcdFx0XHRcdGEyMiA9IE1hdGguY29zKGFuZ2xlIC0gc2tldykgKiBzeTtcblx0XHRcdFx0XHRcdGlmIChza2V3ICYmIHQuc2tld1R5cGUgPT09IFwic2ltcGxlXCIpIHsgLy9ieSBkZWZhdWx0LCB3ZSBjb21wZW5zYXRlIHNrZXdpbmcgb24gdGhlIG90aGVyIGF4aXMgdG8gbWFrZSBpdCBsb29rIG1vcmUgbmF0dXJhbCwgYnV0IHlvdSBjYW4gc2V0IHRoZSBza2V3VHlwZSB0byBcInNpbXBsZVwiIHRvIHVzZSB0aGUgdW5jb21wZW5zYXRlZCBza2V3aW5nIHRoYXQgQ1NTIGRvZXNcblx0XHRcdFx0XHRcdFx0dDEgPSBNYXRoLnRhbihza2V3IC0gdC5za2V3WSAqIF9ERUcyUkFEKTtcblx0XHRcdFx0XHRcdFx0dDEgPSBNYXRoLnNxcnQoMSArIHQxICogdDEpO1xuXHRcdFx0XHRcdFx0XHRhMTIgKj0gdDE7XG5cdFx0XHRcdFx0XHRcdGEyMiAqPSB0MTtcblx0XHRcdFx0XHRcdFx0aWYgKHQuc2tld1kpIHtcblx0XHRcdFx0XHRcdFx0XHR0MSA9IE1hdGgudGFuKHQuc2tld1kgKiBfREVHMlJBRCk7XG5cdFx0XHRcdFx0XHRcdFx0dDEgPSBNYXRoLnNxcnQoMSArIHQxICogdDEpO1xuXHRcdFx0XHRcdFx0XHRcdGExMSAqPSB0MTtcblx0XHRcdFx0XHRcdFx0XHRhMjEgKj0gdDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChpc1NWRykge1xuXHRcdFx0XHRcdFx0XHR4ICs9IHQueE9yaWdpbiAtICh0LnhPcmlnaW4gKiBhMTEgKyB0LnlPcmlnaW4gKiBhMTIpICsgdC54T2Zmc2V0O1xuXHRcdFx0XHRcdFx0XHR5ICs9IHQueU9yaWdpbiAtICh0LnhPcmlnaW4gKiBhMjEgKyB0LnlPcmlnaW4gKiBhMjIpICsgdC55T2Zmc2V0O1xuXHRcdFx0XHRcdFx0XHRpZiAoX3VzZVNWR1RyYW5zZm9ybUF0dHIgJiYgKHQueFBlcmNlbnQgfHwgdC55UGVyY2VudCkpIHsgLy9UaGUgU1ZHIHNwZWMgZG9lc24ndCBzdXBwb3J0IHBlcmNlbnRhZ2UtYmFzZWQgdHJhbnNsYXRpb24gaW4gdGhlIFwidHJhbnNmb3JtXCIgYXR0cmlidXRlLCBzbyB3ZSBtZXJnZSBpdCBpbnRvIHRoZSBtYXRyaXggdG8gc2ltdWxhdGUgaXQuXG5cdFx0XHRcdFx0XHRcdFx0bWluID0gdGhpcy50LmdldEJCb3goKTtcblx0XHRcdFx0XHRcdFx0XHR4ICs9IHQueFBlcmNlbnQgKiAwLjAxICogbWluLndpZHRoO1xuXHRcdFx0XHRcdFx0XHRcdHkgKz0gdC55UGVyY2VudCAqIDAuMDEgKiBtaW4uaGVpZ2h0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG1pbiA9IDAuMDAwMDAxO1xuXHRcdFx0XHRcdFx0XHRpZiAoeCA8IG1pbikgaWYgKHggPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRcdFx0eCA9IDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHkgPCBtaW4pIGlmICh5ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0XHRcdHkgPSAwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm0gPSAoKChhMTEgKiBybmQpIHwgMCkgLyBybmQpICsgXCIsXCIgKyAoKChhMjEgKiBybmQpIHwgMCkgLyBybmQpICsgXCIsXCIgKyAoKChhMTIgKiBybmQpIHwgMCkgLyBybmQpICsgXCIsXCIgKyAoKChhMjIgKiBybmQpIHwgMCkgLyBybmQpICsgXCIsXCIgKyB4ICsgXCIsXCIgKyB5ICsgXCIpXCI7XG5cdFx0XHRcdFx0XHRpZiAoaXNTVkcgJiYgX3VzZVNWR1RyYW5zZm9ybUF0dHIpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcIm1hdHJpeChcIiArIHRyYW5zZm9ybSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvL3NvbWUgYnJvd3NlcnMgaGF2ZSBhIGhhcmQgdGltZSB3aXRoIHZlcnkgc21hbGwgdmFsdWVzIGxpa2UgMi40NDkyOTM1OTgyOTQ3MDY0ZS0xNiAobm90aWNlIHRoZSBcImUtXCIgdG93YXJkcyB0aGUgZW5kKSBhbmQgd291bGQgcmVuZGVyIHRoZSBvYmplY3Qgc2xpZ2h0bHkgb2ZmLiBTbyB3ZSByb3VuZCB0byA1IGRlY2ltYWwgcGxhY2VzLlxuXHRcdFx0XHRcdFx0XHRzdHlsZVtfdHJhbnNmb3JtUHJvcF0gPSAoKHQueFBlcmNlbnQgfHwgdC55UGVyY2VudCkgPyBcInRyYW5zbGF0ZShcIiArIHQueFBlcmNlbnQgKyBcIiUsXCIgKyB0LnlQZXJjZW50ICsgXCIlKSBtYXRyaXgoXCIgOiBcIm1hdHJpeChcIikgKyB0cmFuc2Zvcm07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9ICgodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSA/IFwidHJhbnNsYXRlKFwiICsgdC54UGVyY2VudCArIFwiJSxcIiArIHQueVBlcmNlbnQgKyBcIiUpIG1hdHJpeChcIiA6IFwibWF0cml4KFwiKSArIHN4ICsgXCIsMCwwLFwiICsgc3kgKyBcIixcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKF9pc0ZpcmVmb3gpIHsgLy9GaXJlZm94IGhhcyBhIGJ1ZyAoYXQgbGVhc3QgaW4gdjI1KSB0aGF0IGNhdXNlcyBpdCB0byByZW5kZXIgdGhlIHRyYW5zcGFyZW50IHBhcnQgb2YgMzItYml0IFBORyBpbWFnZXMgYXMgYmxhY2sgd2hlbiBkaXNwbGF5ZWQgaW5zaWRlIGFuIGlmcmFtZSBhbmQgdGhlIDNEIHNjYWxlIGlzIHZlcnkgc21hbGwgYW5kIGRvZXNuJ3QgY2hhbmdlIHN1ZmZpY2llbnRseSBlbm91Z2ggYmV0d2VlbiByZW5kZXJzIChsaWtlIGlmIHlvdSB1c2UgYSBQb3dlcjQuZWFzZUluT3V0IHRvIHNjYWxlIGZyb20gMCB0byAxIHdoZXJlIHRoZSBiZWdpbm5pbmcgdmFsdWVzIG9ubHkgY2hhbmdlIGEgdGlueSBhbW91bnQgdG8gYmVnaW4gdGhlIHR3ZWVuIGJlZm9yZSBhY2NlbGVyYXRpbmcpLiBJbiB0aGlzIGNhc2UsIHdlIGZvcmNlIHRoZSBzY2FsZSB0byBiZSAwLjAwMDAyIGluc3RlYWQgd2hpY2ggaXMgdmlzdWFsbHkgdGhlIHNhbWUgYnV0IHdvcmtzIGFyb3VuZCB0aGUgRmlyZWZveCBpc3N1ZS5cblx0XHRcdFx0XHRtaW4gPSAwLjAwMDE7XG5cdFx0XHRcdFx0aWYgKHN4IDwgbWluICYmIHN4ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0c3ggPSBzeiA9IDAuMDAwMDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChzeSA8IG1pbiAmJiBzeSA+IC1taW4pIHtcblx0XHRcdFx0XHRcdHN5ID0gc3ogPSAwLjAwMDAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGVyc3BlY3RpdmUgJiYgIXQueiAmJiAhdC5yb3RhdGlvblggJiYgIXQucm90YXRpb25ZKSB7IC8vRmlyZWZveCBoYXMgYSBidWcgdGhhdCBjYXVzZXMgZWxlbWVudHMgdG8gaGF2ZSBhbiBvZGQgc3VwZXItdGhpbiwgYnJva2VuL2RvdHRlZCBibGFjayBib3JkZXIgb24gZWxlbWVudHMgdGhhdCBoYXZlIGEgcGVyc3BlY3RpdmUgc2V0IGJ1dCBhcmVuJ3QgdXRpbGl6aW5nIDNEIHNwYWNlIChubyByb3RhdGlvblgsIHJvdGF0aW9uWSwgb3IgeikuXG5cdFx0XHRcdFx0XHRwZXJzcGVjdGl2ZSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChhbmdsZSB8fCB0LnNrZXdYKSB7XG5cdFx0XHRcdFx0YW5nbGUgKj0gX0RFRzJSQUQ7XG5cdFx0XHRcdFx0Y29zID0gYTExID0gTWF0aC5jb3MoYW5nbGUpO1xuXHRcdFx0XHRcdHNpbiA9IGEyMSA9IE1hdGguc2luKGFuZ2xlKTtcblx0XHRcdFx0XHRpZiAodC5za2V3WCkge1xuXHRcdFx0XHRcdFx0YW5nbGUgLT0gdC5za2V3WCAqIF9ERUcyUkFEO1xuXHRcdFx0XHRcdFx0Y29zID0gTWF0aC5jb3MoYW5nbGUpO1xuXHRcdFx0XHRcdFx0c2luID0gTWF0aC5zaW4oYW5nbGUpO1xuXHRcdFx0XHRcdFx0aWYgKHQuc2tld1R5cGUgPT09IFwic2ltcGxlXCIpIHsgLy9ieSBkZWZhdWx0LCB3ZSBjb21wZW5zYXRlIHNrZXdpbmcgb24gdGhlIG90aGVyIGF4aXMgdG8gbWFrZSBpdCBsb29rIG1vcmUgbmF0dXJhbCwgYnV0IHlvdSBjYW4gc2V0IHRoZSBza2V3VHlwZSB0byBcInNpbXBsZVwiIHRvIHVzZSB0aGUgdW5jb21wZW5zYXRlZCBza2V3aW5nIHRoYXQgQ1NTIGRvZXNcblx0XHRcdFx0XHRcdFx0dDEgPSBNYXRoLnRhbigodC5za2V3WCAtIHQuc2tld1kpICogX0RFRzJSQUQpO1xuXHRcdFx0XHRcdFx0XHR0MSA9IE1hdGguc3FydCgxICsgdDEgKiB0MSk7XG5cdFx0XHRcdFx0XHRcdGNvcyAqPSB0MTtcblx0XHRcdFx0XHRcdFx0c2luICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRpZiAodC5za2V3WSkge1xuXHRcdFx0XHRcdFx0XHRcdHQxID0gTWF0aC50YW4odC5za2V3WSAqIF9ERUcyUkFEKTtcblx0XHRcdFx0XHRcdFx0XHR0MSA9IE1hdGguc3FydCgxICsgdDEgKiB0MSk7XG5cdFx0XHRcdFx0XHRcdFx0YTExICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRcdGEyMSAqPSB0MTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhMTIgPSAtc2luO1xuXHRcdFx0XHRcdGEyMiA9IGNvcztcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCFyb3RhdGlvblkgJiYgIXJvdGF0aW9uWCAmJiBzeiA9PT0gMSAmJiAhcGVyc3BlY3RpdmUgJiYgIWlzU1ZHKSB7IC8vaWYgd2UncmUgb25seSB0cmFuc2xhdGluZyBhbmQvb3IgMkQgc2NhbGluZywgdGhpcyBpcyBmYXN0ZXIuLi5cblx0XHRcdFx0XHRzdHlsZVtfdHJhbnNmb3JtUHJvcF0gPSAoKHQueFBlcmNlbnQgfHwgdC55UGVyY2VudCkgPyBcInRyYW5zbGF0ZShcIiArIHQueFBlcmNlbnQgKyBcIiUsXCIgKyB0LnlQZXJjZW50ICsgXCIlKSB0cmFuc2xhdGUzZChcIiA6IFwidHJhbnNsYXRlM2QoXCIpICsgeCArIFwicHgsXCIgKyB5ICsgXCJweCxcIiArIHogK1wicHgpXCIgKyAoKHN4ICE9PSAxIHx8IHN5ICE9PSAxKSA/IFwiIHNjYWxlKFwiICsgc3ggKyBcIixcIiArIHN5ICsgXCIpXCIgOiBcIlwiKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YTExID0gYTIyID0gMTtcblx0XHRcdFx0XHRhMTIgPSBhMjEgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEtFWSAgSU5ERVggICBBRkZFQ1RTXG5cdFx0XHRcdC8vIGExMSAgMCAgICAgICByb3RhdGlvbiwgcm90YXRpb25ZLCBzY2FsZVhcblx0XHRcdFx0Ly8gYTIxICAxICAgICAgIHJvdGF0aW9uLCByb3RhdGlvblksIHNjYWxlWFxuXHRcdFx0XHQvLyBhMzEgIDIgICAgICAgcm90YXRpb25ZLCBzY2FsZVhcblx0XHRcdFx0Ly8gYTQxICAzICAgICAgIHJvdGF0aW9uWSwgc2NhbGVYXG5cdFx0XHRcdC8vIGExMiAgNCAgICAgICByb3RhdGlvbiwgc2tld1gsIHJvdGF0aW9uWCwgc2NhbGVZXG5cdFx0XHRcdC8vIGEyMiAgNSAgICAgICByb3RhdGlvbiwgc2tld1gsIHJvdGF0aW9uWCwgc2NhbGVZXG5cdFx0XHRcdC8vIGEzMiAgNiAgICAgICByb3RhdGlvblgsIHNjYWxlWVxuXHRcdFx0XHQvLyBhNDIgIDcgICAgICAgcm90YXRpb25YLCBzY2FsZVlcblx0XHRcdFx0Ly8gYTEzICA4ICAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTIzICA5ICAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTMzICAxMCAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTQzICAxMSAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBwZXJzcGVjdGl2ZSwgc2NhbGVaXG5cdFx0XHRcdC8vIGExNCAgMTIgICAgICB4LCB6T3JpZ2luLCBzdmdPcmlnaW5cblx0XHRcdFx0Ly8gYTI0ICAxMyAgICAgIHksIHpPcmlnaW4sIHN2Z09yaWdpblxuXHRcdFx0XHQvLyBhMzQgIDE0ICAgICAgeiwgek9yaWdpblxuXHRcdFx0XHQvLyBhNDQgIDE1XG5cdFx0XHRcdC8vIHJvdGF0aW9uOiBNYXRoLmF0YW4yKGEyMSwgYTExKVxuXHRcdFx0XHQvLyByb3RhdGlvblk6IE1hdGguYXRhbjIoYTEzLCBhMzMpIChvciBNYXRoLmF0YW4yKGExMywgYTExKSlcblx0XHRcdFx0Ly8gcm90YXRpb25YOiBNYXRoLmF0YW4yKGEzMiwgYTMzKVxuXHRcdFx0XHRhMzMgPSAxO1xuXHRcdFx0XHRhMTMgPSBhMjMgPSBhMzEgPSBhMzIgPSBhNDEgPSBhNDIgPSAwO1xuXHRcdFx0XHRhNDMgPSAocGVyc3BlY3RpdmUpID8gLTEgLyBwZXJzcGVjdGl2ZSA6IDA7XG5cdFx0XHRcdHpPcmlnaW4gPSB0LnpPcmlnaW47XG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxOyAvL3RocmVzaG9sZCBiZWxvdyB3aGljaCBicm93c2VycyB1c2Ugc2NpZW50aWZpYyBub3RhdGlvbiB3aGljaCB3b24ndCB3b3JrLlxuXHRcdFx0XHRjb21tYSA9IFwiLFwiO1xuXHRcdFx0XHR6ZXJvID0gXCIwXCI7XG5cdFx0XHRcdGFuZ2xlID0gcm90YXRpb25ZICogX0RFRzJSQUQ7XG5cdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcblx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0YTMxID0gLXNpbjtcblx0XHRcdFx0XHRhNDEgPSBhNDMqLXNpbjtcblx0XHRcdFx0XHRhMTMgPSBhMTEqc2luO1xuXHRcdFx0XHRcdGEyMyA9IGEyMSpzaW47XG5cdFx0XHRcdFx0YTMzID0gY29zO1xuXHRcdFx0XHRcdGE0MyAqPSBjb3M7XG5cdFx0XHRcdFx0YTExICo9IGNvcztcblx0XHRcdFx0XHRhMjEgKj0gY29zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFuZ2xlID0gcm90YXRpb25YICogX0RFRzJSQUQ7XG5cdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcblx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0dDEgPSBhMTIqY29zK2ExMypzaW47XG5cdFx0XHRcdFx0dDIgPSBhMjIqY29zK2EyMypzaW47XG5cdFx0XHRcdFx0YTMyID0gYTMzKnNpbjtcblx0XHRcdFx0XHRhNDIgPSBhNDMqc2luO1xuXHRcdFx0XHRcdGExMyA9IGExMiotc2luK2ExMypjb3M7XG5cdFx0XHRcdFx0YTIzID0gYTIyKi1zaW4rYTIzKmNvcztcblx0XHRcdFx0XHRhMzMgPSBhMzMqY29zO1xuXHRcdFx0XHRcdGE0MyA9IGE0Mypjb3M7XG5cdFx0XHRcdFx0YTEyID0gdDE7XG5cdFx0XHRcdFx0YTIyID0gdDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN6ICE9PSAxKSB7XG5cdFx0XHRcdFx0YTEzKj1zejtcblx0XHRcdFx0XHRhMjMqPXN6O1xuXHRcdFx0XHRcdGEzMyo9c3o7XG5cdFx0XHRcdFx0YTQzKj1zejtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3kgIT09IDEpIHtcblx0XHRcdFx0XHRhMTIqPXN5O1xuXHRcdFx0XHRcdGEyMio9c3k7XG5cdFx0XHRcdFx0YTMyKj1zeTtcblx0XHRcdFx0XHRhNDIqPXN5O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzeCAhPT0gMSkge1xuXHRcdFx0XHRcdGExMSo9c3g7XG5cdFx0XHRcdFx0YTIxKj1zeDtcblx0XHRcdFx0XHRhMzEqPXN4O1xuXHRcdFx0XHRcdGE0MSo9c3g7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoek9yaWdpbiB8fCBpc1NWRykge1xuXHRcdFx0XHRcdGlmICh6T3JpZ2luKSB7XG5cdFx0XHRcdFx0XHR4ICs9IGExMyotek9yaWdpbjtcblx0XHRcdFx0XHRcdHkgKz0gYTIzKi16T3JpZ2luO1xuXHRcdFx0XHRcdFx0eiArPSBhMzMqLXpPcmlnaW4rek9yaWdpbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGlzU1ZHKSB7IC8vZHVlIHRvIGJ1Z3MgaW4gc29tZSBicm93c2Vycywgd2UgbmVlZCB0byBtYW5hZ2UgdGhlIHRyYW5zZm9ybS1vcmlnaW4gb2YgU1ZHIG1hbnVhbGx5XG5cdFx0XHRcdFx0XHR4ICs9IHQueE9yaWdpbiAtICh0LnhPcmlnaW4gKiBhMTEgKyB0LnlPcmlnaW4gKiBhMTIpICsgdC54T2Zmc2V0O1xuXHRcdFx0XHRcdFx0eSArPSB0LnlPcmlnaW4gLSAodC54T3JpZ2luICogYTIxICsgdC55T3JpZ2luICogYTIyKSArIHQueU9mZnNldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHggPCBtaW4gJiYgeCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdHggPSB6ZXJvO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoeSA8IG1pbiAmJiB5ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0eSA9IHplcm87XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh6IDwgbWluICYmIHogPiAtbWluKSB7XG5cdFx0XHRcdFx0XHR6ID0gMDsgLy9kb24ndCB1c2Ugc3RyaW5nIGJlY2F1c2Ugd2UgY2FsY3VsYXRlIHBlcnNwZWN0aXZlIGxhdGVyIGFuZCBuZWVkIHRoZSBudW1iZXIuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9vcHRpbWl6ZWQgd2F5IG9mIGNvbmNhdGVuYXRpbmcgYWxsIHRoZSB2YWx1ZXMgaW50byBhIHN0cmluZy4gSWYgd2UgZG8gaXQgYWxsIGluIG9uZSBzaG90LCBpdCdzIHNsb3dlciBiZWNhdXNlIG9mIHRoZSB3YXkgYnJvd3NlcnMgaGF2ZSB0byBjcmVhdGUgdGVtcCBzdHJpbmdzIGFuZCB0aGUgd2F5IGl0IGFmZmVjdHMgbWVtb3J5LiBJZiB3ZSBkbyBpdCBwaWVjZS1ieS1waWVjZSB3aXRoICs9LCBpdCdzIGEgYml0IHNsb3dlciB0b28uIFdlIGZvdW5kIHRoYXQgZG9pbmcgaXQgaW4gdGhlc2Ugc2l6ZWQgY2h1bmtzIHdvcmtzIGJlc3Qgb3ZlcmFsbDpcblx0XHRcdFx0dHJhbnNmb3JtID0gKCh0LnhQZXJjZW50IHx8IHQueVBlcmNlbnQpID8gXCJ0cmFuc2xhdGUoXCIgKyB0LnhQZXJjZW50ICsgXCIlLFwiICsgdC55UGVyY2VudCArIFwiJSkgbWF0cml4M2QoXCIgOiBcIm1hdHJpeDNkKFwiKTtcblx0XHRcdFx0dHJhbnNmb3JtICs9ICgoYTExIDwgbWluICYmIGExMSA+IC1taW4pID8gemVybyA6IGExMSkgKyBjb21tYSArICgoYTIxIDwgbWluICYmIGEyMSA+IC1taW4pID8gemVybyA6IGEyMSkgKyBjb21tYSArICgoYTMxIDwgbWluICYmIGEzMSA+IC1taW4pID8gemVybyA6IGEzMSk7XG5cdFx0XHRcdHRyYW5zZm9ybSArPSBjb21tYSArICgoYTQxIDwgbWluICYmIGE0MSA+IC1taW4pID8gemVybyA6IGE0MSkgKyBjb21tYSArICgoYTEyIDwgbWluICYmIGExMiA+IC1taW4pID8gemVybyA6IGExMikgKyBjb21tYSArICgoYTIyIDwgbWluICYmIGEyMiA+IC1taW4pID8gemVybyA6IGEyMik7XG5cdFx0XHRcdGlmIChyb3RhdGlvblggfHwgcm90YXRpb25ZIHx8IHN6ICE9PSAxKSB7IC8vcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uIChvZnRlbiB0aGVyZSdzIG5vIHJvdGF0aW9uWCBvciByb3RhdGlvblksIHNvIHdlIGNhbiBza2lwIHRoZXNlIGNhbGN1bGF0aW9ucylcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gY29tbWEgKyAoKGEzMiA8IG1pbiAmJiBhMzIgPiAtbWluKSA/IHplcm8gOiBhMzIpICsgY29tbWEgKyAoKGE0MiA8IG1pbiAmJiBhNDIgPiAtbWluKSA/IHplcm8gOiBhNDIpICsgY29tbWEgKyAoKGExMyA8IG1pbiAmJiBhMTMgPiAtbWluKSA/IHplcm8gOiBhMTMpO1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBjb21tYSArICgoYTIzIDwgbWluICYmIGEyMyA+IC1taW4pID8gemVybyA6IGEyMykgKyBjb21tYSArICgoYTMzIDwgbWluICYmIGEzMyA+IC1taW4pID8gemVybyA6IGEzMykgKyBjb21tYSArICgoYTQzIDwgbWluICYmIGE0MyA+IC1taW4pID8gemVybyA6IGE0MykgKyBjb21tYTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gXCIsMCwwLDAsMCwxLDAsXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHJhbnNmb3JtICs9IHggKyBjb21tYSArIHkgKyBjb21tYSArIHogKyBjb21tYSArIChwZXJzcGVjdGl2ZSA/ICgxICsgKC16IC8gcGVyc3BlY3RpdmUpKSA6IDEpICsgXCIpXCI7XG5cblx0XHRcdFx0c3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtO1xuXHRcdFx0fTtcblxuXHRcdHAgPSBUcmFuc2Zvcm0ucHJvdG90eXBlO1xuXHRcdHAueCA9IHAueSA9IHAueiA9IHAuc2tld1ggPSBwLnNrZXdZID0gcC5yb3RhdGlvbiA9IHAucm90YXRpb25YID0gcC5yb3RhdGlvblkgPSBwLnpPcmlnaW4gPSBwLnhQZXJjZW50ID0gcC55UGVyY2VudCA9IHAueE9mZnNldCA9IHAueU9mZnNldCA9IDA7XG5cdFx0cC5zY2FsZVggPSBwLnNjYWxlWSA9IHAuc2NhbGVaID0gMTtcblxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInRyYW5zZm9ybSxzY2FsZSxzY2FsZVgsc2NhbGVZLHNjYWxlWix4LHkseixyb3RhdGlvbixyb3RhdGlvblgscm90YXRpb25ZLHJvdGF0aW9uWixza2V3WCxza2V3WSxzaG9ydFJvdGF0aW9uLHNob3J0Um90YXRpb25YLHNob3J0Um90YXRpb25ZLHNob3J0Um90YXRpb25aLHRyYW5zZm9ybU9yaWdpbixzdmdPcmlnaW4sdHJhbnNmb3JtUGVyc3BlY3RpdmUsZGlyZWN0aW9uYWxSb3RhdGlvbixwYXJzZVRyYW5zZm9ybSxmb3JjZTNELHNrZXdUeXBlLHhQZXJjZW50LHlQZXJjZW50LHNtb290aE9yaWdpblwiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHBhcnNpbmdQcm9wLCBjc3NwLCBwdCwgcGx1Z2luLCB2YXJzKSB7XG5cdFx0XHRpZiAoY3NzcC5fbGFzdFBhcnNlZFRyYW5zZm9ybSA9PT0gdmFycykgeyByZXR1cm4gcHQ7IH0gLy9vbmx5IG5lZWQgdG8gcGFyc2UgdGhlIHRyYW5zZm9ybSBvbmNlLCBhbmQgb25seSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdC5cblx0XHRcdGNzc3AuX2xhc3RQYXJzZWRUcmFuc2Zvcm0gPSB2YXJzO1xuXHRcdFx0dmFyIHN3YXBGdW5jO1xuXHRcdFx0aWYgKHR5cGVvZih2YXJzW3BhcnNpbmdQcm9wXSkgPT09IFwiZnVuY3Rpb25cIikgeyAvL3doYXRldmVyIHByb3BlcnR5IHRyaWdnZXJzIHRoZSBpbml0aWFsIHBhcnNpbmcgbWlnaHQgYmUgYSBmdW5jdGlvbi1iYXNlZCB2YWx1ZSBpbiB3aGljaCBjYXNlIGl0IGFscmVhZHkgZ290IGNhbGxlZCBpbiBwYXJzZSgpLCB0aHVzIHdlIGRvbid0IHdhbnQgdG8gY2FsbCBpdCBhZ2FpbiBpbiBoZXJlLiBUaGUgbW9zdCBlZmZpY2llbnQgd2F5IHRvIGF2b2lkIHRoaXMgaXMgdG8gdGVtcG9yYXJpbHkgc3dhcCB0aGUgdmFsdWUgZGlyZWN0bHkgaW50byB0aGUgdmFycyBvYmplY3QsIGFuZCB0aGVuIGFmdGVyIHdlIGRvIGFsbCBvdXIgcGFyc2luZyBpbiB0aGlzIGZ1bmN0aW9uLCB3ZSdsbCBzd2FwIGl0IGJhY2sgYWdhaW4uXG5cdFx0XHRcdHN3YXBGdW5jID0gdmFyc1twYXJzaW5nUHJvcF07XG5cdFx0XHRcdHZhcnNbcGFyc2luZ1Byb3BdID0gZTtcblx0XHRcdH1cblx0XHRcdHZhciBvcmlnaW5hbEdTVHJhbnNmb3JtID0gdC5fZ3NUcmFuc2Zvcm0sXG5cdFx0XHRcdHN0eWxlID0gdC5zdHlsZSxcblx0XHRcdFx0bWluID0gMC4wMDAwMDEsXG5cdFx0XHRcdGkgPSBfdHJhbnNmb3JtUHJvcHMubGVuZ3RoLFxuXHRcdFx0XHR2ID0gdmFycyxcblx0XHRcdFx0ZW5kUm90YXRpb25zID0ge30sXG5cdFx0XHRcdHRyYW5zZm9ybU9yaWdpblN0cmluZyA9IFwidHJhbnNmb3JtT3JpZ2luXCIsXG5cdFx0XHRcdG0xID0gX2dldFRyYW5zZm9ybSh0LCBfY3MsIHRydWUsIHYucGFyc2VUcmFuc2Zvcm0pLFxuXHRcdFx0XHRvcmlnID0gdi50cmFuc2Zvcm0gJiYgKCh0eXBlb2Yodi50cmFuc2Zvcm0pID09PSBcImZ1bmN0aW9uXCIpID8gdi50cmFuc2Zvcm0oX2luZGV4LCBfdGFyZ2V0KSA6IHYudHJhbnNmb3JtKSxcblx0XHRcdFx0bTIsIGNvcHksIGhhczNELCBoYXNDaGFuZ2UsIGRyLCB4LCB5LCBtYXRyaXgsIHA7XG5cdFx0XHRjc3NwLl90cmFuc2Zvcm0gPSBtMTtcblx0XHRcdGlmIChvcmlnICYmIHR5cGVvZihvcmlnKSA9PT0gXCJzdHJpbmdcIiAmJiBfdHJhbnNmb3JtUHJvcCkgeyAvL2ZvciB2YWx1ZXMgbGlrZSB0cmFuc2Zvcm06XCJyb3RhdGUoNjBkZWcpIHNjYWxlKDAuNSwgMC44KVwiXG5cdFx0XHRcdGNvcHkgPSBfdGVtcERpdi5zdHlsZTsgLy9kb24ndCB1c2UgdGhlIG9yaWdpbmFsIHRhcmdldCBiZWNhdXNlIGl0IG1pZ2h0IGJlIFNWRyBpbiB3aGljaCBjYXNlIHNvbWUgYnJvd3NlcnMgZG9uJ3QgcmVwb3J0IGNvbXB1dGVkIHN0eWxlIGNvcnJlY3RseS5cblx0XHRcdFx0Y29weVtfdHJhbnNmb3JtUHJvcF0gPSBvcmlnO1xuXHRcdFx0XHRjb3B5LmRpc3BsYXkgPSBcImJsb2NrXCI7IC8vaWYgZGlzcGxheSBpcyBcIm5vbmVcIiwgdGhlIGJyb3dzZXIgb2Z0ZW4gcmVmdXNlcyB0byByZXBvcnQgdGhlIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGNvcnJlY3RseS5cblx0XHRcdFx0Y29weS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0XHRcdFx0X2RvYy5ib2R5LmFwcGVuZENoaWxkKF90ZW1wRGl2KTtcblx0XHRcdFx0bTIgPSBfZ2V0VHJhbnNmb3JtKF90ZW1wRGl2LCBudWxsLCBmYWxzZSk7XG5cdFx0XHRcdGlmIChtMS5zdmcpIHsgLy9pZiBpdCdzIGFuIFNWRyBlbGVtZW50LCB4L3kgcGFydCBvZiB0aGUgbWF0cml4IHdpbGwgYmUgYWZmZWN0ZWQgYnkgd2hhdGV2ZXIgd2UgdXNlIGFzIHRoZSBvcmlnaW4gYW5kIHRoZSBvZmZzZXRzLCBzbyBjb21wZW5zYXRlIGhlcmUuLi5cblx0XHRcdFx0XHR4ID0gbTEueE9yaWdpbjtcblx0XHRcdFx0XHR5ID0gbTEueU9yaWdpbjtcblx0XHRcdFx0XHRtMi54IC09IG0xLnhPZmZzZXQ7XG5cdFx0XHRcdFx0bTIueSAtPSBtMS55T2Zmc2V0O1xuXHRcdFx0XHRcdGlmICh2LnRyYW5zZm9ybU9yaWdpbiB8fCB2LnN2Z09yaWdpbikgeyAvL2lmIHRoaXMgdHdlZW4gaXMgYWx0ZXJpbmcgdGhlIG9yaWdpbiwgd2UgbXVzdCBmYWN0b3IgdGhhdCBpbiBoZXJlLiBUaGUgYWN0dWFsIHdvcmsgb2YgcmVjb3JkaW5nIHRoZSB0cmFuc2Zvcm1PcmlnaW4gdmFsdWVzIGFuZCBzZXR0aW5nIHVwIHRoZSBQcm9wVHdlZW4gaXMgZG9uZSBsYXRlciAoc3RpbGwgaW5zaWRlIHRoaXMgZnVuY3Rpb24pIHNvIHdlIGNhbm5vdCBsZWF2ZSB0aGUgY2hhbmdlcyBpbnRhY3QgaGVyZSAtIHdlIG9ubHkgd2FudCB0byB1cGRhdGUgdGhlIHgveSBhY2NvcmRpbmdseS5cblx0XHRcdFx0XHRcdG9yaWcgPSB7fTtcblx0XHRcdFx0XHRcdF9wYXJzZVNWR09yaWdpbih0LCBfcGFyc2VQb3NpdGlvbih2LnRyYW5zZm9ybU9yaWdpbiksIG9yaWcsIHYuc3ZnT3JpZ2luLCB2LnNtb290aE9yaWdpbiwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR4ID0gb3JpZy54T3JpZ2luO1xuXHRcdFx0XHRcdFx0eSA9IG9yaWcueU9yaWdpbjtcblx0XHRcdFx0XHRcdG0yLnggLT0gb3JpZy54T2Zmc2V0IC0gbTEueE9mZnNldDtcblx0XHRcdFx0XHRcdG0yLnkgLT0gb3JpZy55T2Zmc2V0IC0gbTEueU9mZnNldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHggfHwgeSkge1xuXHRcdFx0XHRcdFx0bWF0cml4ID0gX2dldE1hdHJpeChfdGVtcERpdiwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRtMi54IC09IHggLSAoeCAqIG1hdHJpeFswXSArIHkgKiBtYXRyaXhbMl0pO1xuXHRcdFx0XHRcdFx0bTIueSAtPSB5IC0gKHggKiBtYXRyaXhbMV0gKyB5ICogbWF0cml4WzNdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0X2RvYy5ib2R5LnJlbW92ZUNoaWxkKF90ZW1wRGl2KTtcblx0XHRcdFx0aWYgKCFtMi5wZXJzcGVjdGl2ZSkge1xuXHRcdFx0XHRcdG0yLnBlcnNwZWN0aXZlID0gbTEucGVyc3BlY3RpdmU7IC8vdHdlZW5pbmcgdG8gbm8gcGVyc3BlY3RpdmUgZ2l2ZXMgdmVyeSB1bmludHVpdGl2ZSByZXN1bHRzIC0ganVzdCBrZWVwIHRoZSBzYW1lIHBlcnNwZWN0aXZlIGluIHRoYXQgY2FzZS5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodi54UGVyY2VudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bTIueFBlcmNlbnQgPSBfcGFyc2VWYWwodi54UGVyY2VudCwgbTEueFBlcmNlbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2LnlQZXJjZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRtMi55UGVyY2VudCA9IF9wYXJzZVZhbCh2LnlQZXJjZW50LCBtMS55UGVyY2VudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHYpID09PSBcIm9iamVjdFwiKSB7IC8vZm9yIHZhbHVlcyBsaWtlIHNjYWxlWCwgc2NhbGVZLCByb3RhdGlvbiwgeCwgeSwgc2tld1gsIGFuZCBza2V3WSBvciB0cmFuc2Zvcm06ey4uLn0gKG9iamVjdClcblx0XHRcdFx0bTIgPSB7c2NhbGVYOl9wYXJzZVZhbCgodi5zY2FsZVggIT0gbnVsbCkgPyB2LnNjYWxlWCA6IHYuc2NhbGUsIG0xLnNjYWxlWCksXG5cdFx0XHRcdFx0c2NhbGVZOl9wYXJzZVZhbCgodi5zY2FsZVkgIT0gbnVsbCkgPyB2LnNjYWxlWSA6IHYuc2NhbGUsIG0xLnNjYWxlWSksXG5cdFx0XHRcdFx0c2NhbGVaOl9wYXJzZVZhbCh2LnNjYWxlWiwgbTEuc2NhbGVaKSxcblx0XHRcdFx0XHR4Ol9wYXJzZVZhbCh2LngsIG0xLngpLFxuXHRcdFx0XHRcdHk6X3BhcnNlVmFsKHYueSwgbTEueSksXG5cdFx0XHRcdFx0ejpfcGFyc2VWYWwodi56LCBtMS56KSxcblx0XHRcdFx0XHR4UGVyY2VudDpfcGFyc2VWYWwodi54UGVyY2VudCwgbTEueFBlcmNlbnQpLFxuXHRcdFx0XHRcdHlQZXJjZW50Ol9wYXJzZVZhbCh2LnlQZXJjZW50LCBtMS55UGVyY2VudCksXG5cdFx0XHRcdFx0cGVyc3BlY3RpdmU6X3BhcnNlVmFsKHYudHJhbnNmb3JtUGVyc3BlY3RpdmUsIG0xLnBlcnNwZWN0aXZlKX07XG5cdFx0XHRcdGRyID0gdi5kaXJlY3Rpb25hbFJvdGF0aW9uO1xuXHRcdFx0XHRpZiAoZHIgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZHIpID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGNvcHkgaW4gZHIpIHtcblx0XHRcdFx0XHRcdFx0dltjb3B5XSA9IGRyW2NvcHldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2LnJvdGF0aW9uID0gZHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0eXBlb2Yodi54KSA9PT0gXCJzdHJpbmdcIiAmJiB2LnguaW5kZXhPZihcIiVcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0bTIueCA9IDA7XG5cdFx0XHRcdFx0bTIueFBlcmNlbnQgPSBfcGFyc2VWYWwodi54LCBtMS54UGVyY2VudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZih2LnkpID09PSBcInN0cmluZ1wiICYmIHYueS5pbmRleE9mKFwiJVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRtMi55ID0gMDtcblx0XHRcdFx0XHRtMi55UGVyY2VudCA9IF9wYXJzZVZhbCh2LnksIG0xLnlQZXJjZW50KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG0yLnJvdGF0aW9uID0gX3BhcnNlQW5nbGUoKFwicm90YXRpb25cIiBpbiB2KSA/IHYucm90YXRpb24gOiAoXCJzaG9ydFJvdGF0aW9uXCIgaW4gdikgPyB2LnNob3J0Um90YXRpb24gKyBcIl9zaG9ydFwiIDogKFwicm90YXRpb25aXCIgaW4gdikgPyB2LnJvdGF0aW9uWiA6IG0xLnJvdGF0aW9uIC0gbTEuc2tld1ksIG0xLnJvdGF0aW9uIC0gbTEuc2tld1ksIFwicm90YXRpb25cIiwgZW5kUm90YXRpb25zKTsgLy9zZWUgbm90ZXMgYmVsb3cgYWJvdXQgc2tld1kgZm9yIHdoeSB3ZSBzdWJ0cmFjdCBpdCBmcm9tIHJvdGF0aW9uIGhlcmVcblx0XHRcdFx0aWYgKF9zdXBwb3J0czNEKSB7XG5cdFx0XHRcdFx0bTIucm90YXRpb25YID0gX3BhcnNlQW5nbGUoKFwicm90YXRpb25YXCIgaW4gdikgPyB2LnJvdGF0aW9uWCA6IChcInNob3J0Um90YXRpb25YXCIgaW4gdikgPyB2LnNob3J0Um90YXRpb25YICsgXCJfc2hvcnRcIiA6IG0xLnJvdGF0aW9uWCB8fCAwLCBtMS5yb3RhdGlvblgsIFwicm90YXRpb25YXCIsIGVuZFJvdGF0aW9ucyk7XG5cdFx0XHRcdFx0bTIucm90YXRpb25ZID0gX3BhcnNlQW5nbGUoKFwicm90YXRpb25ZXCIgaW4gdikgPyB2LnJvdGF0aW9uWSA6IChcInNob3J0Um90YXRpb25ZXCIgaW4gdikgPyB2LnNob3J0Um90YXRpb25ZICsgXCJfc2hvcnRcIiA6IG0xLnJvdGF0aW9uWSB8fCAwLCBtMS5yb3RhdGlvblksIFwicm90YXRpb25ZXCIsIGVuZFJvdGF0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bTIuc2tld1ggPSBfcGFyc2VBbmdsZSh2LnNrZXdYLCBtMS5za2V3WCAtIG0xLnNrZXdZKTsgLy9zZWUgbm90ZXMgYmVsb3cgYWJvdXQgc2tld1kgYW5kIHdoeSB3ZSBzdWJ0cmFjdCBpdCBmcm9tIHNrZXdYIGhlcmVcblxuXHRcdFx0XHQvL25vdGU6IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSBjb21iaW5lIGFsbCBza2V3aW5nIGludG8gdGhlIHNrZXdYIGFuZCByb3RhdGlvbiB2YWx1ZXMsIGlnbm9yaW5nIHNrZXdZIGJ1dCB3ZSBtdXN0IHN0aWxsIHJlY29yZCBpdCBzbyB0aGF0IHdlIGNhbiBkaXNjZXJuIGhvdyBtdWNoIG9mIHRoZSBvdmVyYWxsIHNrZXcgaXMgYXR0cmlidXRlZCB0byBza2V3WCB2cy4gc2tld1kuIE90aGVyd2lzZSwgaWYgdGhlIHNrZXdZIHdvdWxkIGFsd2F5cyBhY3QgcmVsYXRpdmUgKHR3ZWVuIHNrZXdZIHRvIDEwZGVnLCBmb3IgZXhhbXBsZSwgbXVsdGlwbGUgdGltZXMgYW5kIGlmIHdlIGFsd2F5cyBjb21iaW5lIHRoaW5ncyBpbnRvIHNrZXdYLCB3ZSBjYW4ndCByZW1lbWJlciB0aGF0IHNrZXdZIHdhcyAxMCBmcm9tIGxhc3QgdGltZSkuIFJlbWVtYmVyLCBhIHNrZXdZIG9mIDEwIGRlZ3JlZXMgbG9va3MgdGhlIHNhbWUgYXMgYSByb3RhdGlvbiBvZiAxMCBkZWdyZWVzIHBsdXMgYSBza2V3WCBvZiAtMTAgZGVncmVlcy5cblx0XHRcdFx0aWYgKChtMi5za2V3WSA9IF9wYXJzZUFuZ2xlKHYuc2tld1ksIG0xLnNrZXdZKSkpIHtcblx0XHRcdFx0XHRtMi5za2V3WCArPSBtMi5za2V3WTtcblx0XHRcdFx0XHRtMi5yb3RhdGlvbiArPSBtMi5za2V3WTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKF9zdXBwb3J0czNEICYmIHYuZm9yY2UzRCAhPSBudWxsKSB7XG5cdFx0XHRcdG0xLmZvcmNlM0QgPSB2LmZvcmNlM0Q7XG5cdFx0XHRcdGhhc0NoYW5nZSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdG0xLnNrZXdUeXBlID0gdi5za2V3VHlwZSB8fCBtMS5za2V3VHlwZSB8fCBDU1NQbHVnaW4uZGVmYXVsdFNrZXdUeXBlO1xuXG5cdFx0XHRoYXMzRCA9IChtMS5mb3JjZTNEIHx8IG0xLnogfHwgbTEucm90YXRpb25YIHx8IG0xLnJvdGF0aW9uWSB8fCBtMi56IHx8IG0yLnJvdGF0aW9uWCB8fCBtMi5yb3RhdGlvblkgfHwgbTIucGVyc3BlY3RpdmUpO1xuXHRcdFx0aWYgKCFoYXMzRCAmJiB2LnNjYWxlICE9IG51bGwpIHtcblx0XHRcdFx0bTIuc2NhbGVaID0gMTsgLy9ubyBuZWVkIHRvIHR3ZWVuIHNjYWxlWi5cblx0XHRcdH1cblxuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdHAgPSBfdHJhbnNmb3JtUHJvcHNbaV07XG5cdFx0XHRcdG9yaWcgPSBtMltwXSAtIG0xW3BdO1xuXHRcdFx0XHRpZiAob3JpZyA+IG1pbiB8fCBvcmlnIDwgLW1pbiB8fCB2W3BdICE9IG51bGwgfHwgX2ZvcmNlUFRbcF0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdGhhc0NoYW5nZSA9IHRydWU7XG5cdFx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKG0xLCBwLCBtMVtwXSwgb3JpZywgcHQpO1xuXHRcdFx0XHRcdGlmIChwIGluIGVuZFJvdGF0aW9ucykge1xuXHRcdFx0XHRcdFx0cHQuZSA9IGVuZFJvdGF0aW9uc1twXTsgLy9kaXJlY3Rpb25hbCByb3RhdGlvbnMgdHlwaWNhbGx5IGhhdmUgY29tcGVuc2F0ZWQgdmFsdWVzIGR1cmluZyB0aGUgdHdlZW4sIGJ1dCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGV5IGVuZCBhdCBleGFjdGx5IHdoYXQgdGhlIHVzZXIgcmVxdWVzdGVkXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0LnhzMCA9IDA7IC8vZW5zdXJlcyB0aGUgdmFsdWUgc3RheXMgbnVtZXJpYyBpbiBzZXRSYXRpbygpXG5cdFx0XHRcdFx0cHQucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRcdGNzc3AuX292ZXJ3cml0ZVByb3BzLnB1c2gocHQubik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b3JpZyA9IHYudHJhbnNmb3JtT3JpZ2luO1xuXHRcdFx0aWYgKG0xLnN2ZyAmJiAob3JpZyB8fCB2LnN2Z09yaWdpbikpIHtcblx0XHRcdFx0eCA9IG0xLnhPZmZzZXQ7IC8vd2hlbiB3ZSBjaGFuZ2UgdGhlIG9yaWdpbiwgaW4gb3JkZXIgdG8gcHJldmVudCB0aGluZ3MgZnJvbSBqdW1waW5nIHdlIGFkanVzdCB0aGUgeC95IHNvIHdlIG11c3QgcmVjb3JkIHRob3NlIGhlcmUgc28gdGhhdCB3ZSBjYW4gY3JlYXRlIFByb3BUd2VlbnMgZm9yIHRoZW0gYW5kIGZsaXAgdGhlbSBhdCB0aGUgc2FtZSB0aW1lIGFzIHRoZSBvcmlnaW5cblx0XHRcdFx0eSA9IG0xLnlPZmZzZXQ7XG5cdFx0XHRcdF9wYXJzZVNWR09yaWdpbih0LCBfcGFyc2VQb3NpdGlvbihvcmlnKSwgbTIsIHYuc3ZnT3JpZ2luLCB2LnNtb290aE9yaWdpbik7XG5cdFx0XHRcdHB0ID0gX2FkZE5vblR3ZWVuaW5nTnVtZXJpY1BUKG0xLCBcInhPcmlnaW5cIiwgKG9yaWdpbmFsR1NUcmFuc2Zvcm0gPyBtMSA6IG0yKS54T3JpZ2luLCBtMi54T3JpZ2luLCBwdCwgdHJhbnNmb3JtT3JpZ2luU3RyaW5nKTsgLy9ub3RlOiBpZiB0aGVyZSB3YXNuJ3QgYSB0cmFuc2Zvcm1PcmlnaW4gZGVmaW5lZCB5ZXQsIGp1c3Qgc3RhcnQgd2l0aCB0aGUgZGVzdGluYXRpb24gb25lOyBpdCdzIHdhc3RlZnVsIG90aGVyd2lzZSwgYW5kIGl0IGNhdXNlcyBwcm9ibGVtcyB3aXRoIGZyb21UbygpIHR3ZWVucy4gRm9yIGV4YW1wbGUsIFR3ZWVuTGl0ZS50byhcIiN3aGVlbFwiLCAzLCB7cm90YXRpb246MTgwLCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCIsIGRlbGF5OjF9KTsgVHdlZW5MaXRlLmZyb21UbyhcIiN3aGVlbFwiLCAzLCB7c2NhbGU6MC41LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJ9LCB7c2NhbGU6MSwgZGVsYXk6Mn0pOyB3b3VsZCBjYXVzZSBhIGp1bXAgd2hlbiB0aGUgZnJvbSB2YWx1ZXMgcmV2ZXJ0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIDJuZCB0d2Vlbi5cblx0XHRcdFx0cHQgPSBfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQobTEsIFwieU9yaWdpblwiLCAob3JpZ2luYWxHU1RyYW5zZm9ybSA/IG0xIDogbTIpLnlPcmlnaW4sIG0yLnlPcmlnaW4sIHB0LCB0cmFuc2Zvcm1PcmlnaW5TdHJpbmcpO1xuXHRcdFx0XHRpZiAoeCAhPT0gbTEueE9mZnNldCB8fCB5ICE9PSBtMS55T2Zmc2V0KSB7XG5cdFx0XHRcdFx0cHQgPSBfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQobTEsIFwieE9mZnNldFwiLCAob3JpZ2luYWxHU1RyYW5zZm9ybSA/IHggOiBtMS54T2Zmc2V0KSwgbTEueE9mZnNldCwgcHQsIHRyYW5zZm9ybU9yaWdpblN0cmluZyk7XG5cdFx0XHRcdFx0cHQgPSBfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQobTEsIFwieU9mZnNldFwiLCAob3JpZ2luYWxHU1RyYW5zZm9ybSA/IHkgOiBtMS55T2Zmc2V0KSwgbTEueU9mZnNldCwgcHQsIHRyYW5zZm9ybU9yaWdpblN0cmluZyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3JpZyA9IF91c2VTVkdUcmFuc2Zvcm1BdHRyID8gbnVsbCA6IFwiMHB4IDBweFwiOyAvL2NlcnRhaW4gYnJvd3NlcnMgKGxpa2UgZmlyZWZveCkgY29tcGxldGVseSBib3RjaCB0cmFuc2Zvcm0tb3JpZ2luLCBzbyB3ZSBtdXN0IHJlbW92ZSBpdCB0byBwcmV2ZW50IGl0IGZyb20gY29udGFtaW5hdGluZyB0cmFuc2Zvcm1zLiBXZSBtYW5hZ2UgaXQgb3Vyc2VsdmVzIHdpdGggeE9yaWdpbiBhbmQgeU9yaWdpblxuXHRcdFx0fVxuXHRcdFx0aWYgKG9yaWcgfHwgKF9zdXBwb3J0czNEICYmIGhhczNEICYmIG0xLnpPcmlnaW4pKSB7IC8vaWYgYW55dGhpbmcgM0QgaXMgaGFwcGVuaW5nIGFuZCB0aGVyZSdzIGEgdHJhbnNmb3JtT3JpZ2luIHdpdGggYSB6IGNvbXBvbmVudCB0aGF0J3Mgbm9uLXplcm8sIHdlIG11c3QgZW5zdXJlIHRoYXQgdGhlIHRyYW5zZm9ybU9yaWdpbidzIHotY29tcG9uZW50IGlzIHNldCB0byAwIHNvIHRoYXQgd2UgY2FuIG1hbnVhbGx5IGRvIHRob3NlIGNhbGN1bGF0aW9ucyB0byBnZXQgYXJvdW5kIFNhZmFyaSBidWdzLiBFdmVuIGlmIHRoZSB1c2VyIGRpZG4ndCBzcGVjaWZpY2FsbHkgZGVmaW5lIGEgXCJ0cmFuc2Zvcm1PcmlnaW5cIiBpbiB0aGlzIHBhcnRpY3VsYXIgdHdlZW4gKG1heWJlIHRoZXkgZGlkIGl0IHZpYSBjc3MgZGlyZWN0bHkpLlxuXHRcdFx0XHRpZiAoX3RyYW5zZm9ybVByb3ApIHtcblx0XHRcdFx0XHRoYXNDaGFuZ2UgPSB0cnVlO1xuXHRcdFx0XHRcdHAgPSBfdHJhbnNmb3JtT3JpZ2luUHJvcDtcblx0XHRcdFx0XHRvcmlnID0gKG9yaWcgfHwgX2dldFN0eWxlKHQsIHAsIF9jcywgZmFsc2UsIFwiNTAlIDUwJVwiKSkgKyBcIlwiOyAvL2Nhc3QgYXMgc3RyaW5nIHRvIGF2b2lkIGVycm9yc1xuXHRcdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2VlbihzdHlsZSwgcCwgMCwgMCwgcHQsIC0xLCB0cmFuc2Zvcm1PcmlnaW5TdHJpbmcpO1xuXHRcdFx0XHRcdHB0LmIgPSBzdHlsZVtwXTtcblx0XHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdFx0aWYgKF9zdXBwb3J0czNEKSB7XG5cdFx0XHRcdFx0XHRjb3B5ID0gbTEuek9yaWdpbjtcblx0XHRcdFx0XHRcdG9yaWcgPSBvcmlnLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRcdG0xLnpPcmlnaW4gPSAoKG9yaWcubGVuZ3RoID4gMiAmJiAhKGNvcHkgIT09IDAgJiYgb3JpZ1syXSA9PT0gXCIwcHhcIikpID8gcGFyc2VGbG9hdChvcmlnWzJdKSA6IGNvcHkpIHx8IDA7IC8vU2FmYXJpIGRvZXNuJ3QgaGFuZGxlIHRoZSB6IHBhcnQgb2YgdHJhbnNmb3JtT3JpZ2luIGNvcnJlY3RseSwgc28gd2UnbGwgbWFudWFsbHkgaGFuZGxlIGl0IGluIHRoZSBfc2V0M0RUcmFuc2Zvcm1SYXRpbygpIG1ldGhvZC5cblx0XHRcdFx0XHRcdHB0LnhzMCA9IHB0LmUgPSBvcmlnWzBdICsgXCIgXCIgKyAob3JpZ1sxXSB8fCBcIjUwJVwiKSArIFwiIDBweFwiOyAvL3dlIG11c3QgZGVmaW5lIGEgeiB2YWx1ZSBvZiAwcHggc3BlY2lmaWNhbGx5IG90aGVyd2lzZSBpT1MgNSBTYWZhcmkgd2lsbCBzdGljayB3aXRoIHRoZSBvbGQgb25lIChpZiBvbmUgd2FzIGRlZmluZWQpIVxuXHRcdFx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKG0xLCBcInpPcmlnaW5cIiwgMCwgMCwgcHQsIC0xLCBwdC5uKTsgLy93ZSBtdXN0IGNyZWF0ZSBhIENTU1Byb3BUd2VlbiBmb3IgdGhlIF9nc1RyYW5zZm9ybS56T3JpZ2luIHNvIHRoYXQgaXQgZ2V0cyByZXNldCBwcm9wZXJseSBhdCB0aGUgYmVnaW5uaW5nIGlmIHRoZSB0d2VlbiBydW5zIGJhY2t3YXJkIChhcyBvcHBvc2VkIHRvIGp1c3Qgc2V0dGluZyBtMS56T3JpZ2luIGhlcmUpXG5cdFx0XHRcdFx0XHRwdC5iID0gY29weTtcblx0XHRcdFx0XHRcdHB0LnhzMCA9IHB0LmUgPSBtMS56T3JpZ2luO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwdC54czAgPSBwdC5lID0gb3JpZztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL2ZvciBvbGRlciB2ZXJzaW9ucyBvZiBJRSAoNi04KSwgd2UgbmVlZCB0byBtYW51YWxseSBjYWxjdWxhdGUgdGhpbmdzIGluc2lkZSB0aGUgc2V0UmF0aW8oKSBmdW5jdGlvbi4gV2UgcmVjb3JkIG9yaWdpbiB4IGFuZCB5IChveCBhbmQgb3kpIGFuZCB3aGV0aGVyIG9yIG5vdCB0aGUgdmFsdWVzIGFyZSBwZXJjZW50YWdlcyAob3hwIGFuZCBveXApLlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF9wYXJzZVBvc2l0aW9uKG9yaWcgKyBcIlwiLCBtMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChoYXNDaGFuZ2UpIHtcblx0XHRcdFx0Y3NzcC5fdHJhbnNmb3JtVHlwZSA9ICghKG0xLnN2ZyAmJiBfdXNlU1ZHVHJhbnNmb3JtQXR0cikgJiYgKGhhczNEIHx8IHRoaXMuX3RyYW5zZm9ybVR5cGUgPT09IDMpKSA/IDMgOiAyOyAvL3F1aWNrZXIgdGhhbiBjYWxsaW5nIGNzc3AuX2VuYWJsZVRyYW5zZm9ybXMoKTtcblx0XHRcdH1cblx0XHRcdGlmIChzd2FwRnVuYykge1xuXHRcdFx0XHR2YXJzW3BhcnNpbmdQcm9wXSA9IHN3YXBGdW5jO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH0sIHByZWZpeDp0cnVlfSk7XG5cblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJib3hTaGFkb3dcIiwge2RlZmF1bHRWYWx1ZTpcIjBweCAwcHggMHB4IDBweCAjOTk5XCIsIHByZWZpeDp0cnVlLCBjb2xvcjp0cnVlLCBtdWx0aTp0cnVlLCBrZXl3b3JkOlwiaW5zZXRcIn0pO1xuXG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYm9yZGVyUmFkaXVzXCIsIHtkZWZhdWx0VmFsdWU6XCIwcHhcIiwgcGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4pIHtcblx0XHRcdGUgPSB0aGlzLmZvcm1hdChlKTtcblx0XHRcdHZhciBwcm9wcyA9IFtcImJvcmRlclRvcExlZnRSYWRpdXNcIixcImJvcmRlclRvcFJpZ2h0UmFkaXVzXCIsXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiLFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiXSxcblx0XHRcdFx0c3R5bGUgPSB0LnN0eWxlLFxuXHRcdFx0XHRlYTEsIGksIGVzMiwgYnMyLCBicywgZXMsIGJuLCBlbiwgdywgaCwgZXNmeCwgYnNmeCwgcmVsLCBobiwgdm4sIGVtO1xuXHRcdFx0dyA9IHBhcnNlRmxvYXQodC5vZmZzZXRXaWR0aCk7XG5cdFx0XHRoID0gcGFyc2VGbG9hdCh0Lm9mZnNldEhlaWdodCk7XG5cdFx0XHRlYTEgPSBlLnNwbGl0KFwiIFwiKTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyAvL2lmIHdlJ3JlIGRlYWxpbmcgd2l0aCBwZXJjZW50YWdlcywgd2UgbXVzdCBjb252ZXJ0IHRoaW5ncyBzZXBhcmF0ZWx5IGZvciB0aGUgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgYXhpcyFcblx0XHRcdFx0aWYgKHRoaXMucC5pbmRleE9mKFwiYm9yZGVyXCIpKSB7IC8vb2xkZXIgYnJvd3NlcnMgdXNlZCBhIHByZWZpeFxuXHRcdFx0XHRcdHByb3BzW2ldID0gX2NoZWNrUHJvcFByZWZpeChwcm9wc1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnMgPSBiczIgPSBfZ2V0U3R5bGUodCwgcHJvcHNbaV0sIF9jcywgZmFsc2UsIFwiMHB4XCIpO1xuXHRcdFx0XHRpZiAoYnMuaW5kZXhPZihcIiBcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0YnMyID0gYnMuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGJzID0gYnMyWzBdO1xuXHRcdFx0XHRcdGJzMiA9IGJzMlsxXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlcyA9IGVzMiA9IGVhMVtpXTtcblx0XHRcdFx0Ym4gPSBwYXJzZUZsb2F0KGJzKTtcblx0XHRcdFx0YnNmeCA9IGJzLnN1YnN0cigoYm4gKyBcIlwiKS5sZW5ndGgpO1xuXHRcdFx0XHRyZWwgPSAoZXMuY2hhckF0KDEpID09PSBcIj1cIik7XG5cdFx0XHRcdGlmIChyZWwpIHtcblx0XHRcdFx0XHRlbiA9IHBhcnNlSW50KGVzLmNoYXJBdCgwKStcIjFcIiwgMTApO1xuXHRcdFx0XHRcdGVzID0gZXMuc3Vic3RyKDIpO1xuXHRcdFx0XHRcdGVuICo9IHBhcnNlRmxvYXQoZXMpO1xuXHRcdFx0XHRcdGVzZnggPSBlcy5zdWJzdHIoKGVuICsgXCJcIikubGVuZ3RoIC0gKGVuIDwgMCA/IDEgOiAwKSkgfHwgXCJcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbiA9IHBhcnNlRmxvYXQoZXMpO1xuXHRcdFx0XHRcdGVzZnggPSBlcy5zdWJzdHIoKGVuICsgXCJcIikubGVuZ3RoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXNmeCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdGVzZnggPSBfc3VmZml4TWFwW3BdIHx8IGJzZng7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGVzZnggIT09IGJzZngpIHtcblx0XHRcdFx0XHRobiA9IF9jb252ZXJ0VG9QaXhlbHModCwgXCJib3JkZXJMZWZ0XCIsIGJuLCBic2Z4KTsgLy9ob3Jpem9udGFsIG51bWJlciAod2UgdXNlIGEgYm9ndXMgXCJib3JkZXJMZWZ0XCIgcHJvcGVydHkganVzdCBiZWNhdXNlIHRoZSBfY29udmVydFRvUGl4ZWxzKCkgbWV0aG9kIHNlYXJjaGVzIGZvciB0aGUga2V5d29yZHMgXCJMZWZ0XCIsIFwiUmlnaHRcIiwgXCJUb3BcIiwgYW5kIFwiQm90dG9tXCIgdG8gZGV0ZXJtaW5lIG9mIGl0J3MgYSBob3Jpem9udGFsIG9yIHZlcnRpY2FsIHByb3BlcnR5LCBhbmQgd2UgbmVlZCBcImJvcmRlclwiIGluIHRoZSBuYW1lIHNvIHRoYXQgaXQga25vd3MgaXQgc2hvdWxkIG1lYXN1cmUgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQgaXRzZWxmLCBub3QgaXRzIHBhcmVudC5cblx0XHRcdFx0XHR2biA9IF9jb252ZXJ0VG9QaXhlbHModCwgXCJib3JkZXJUb3BcIiwgYm4sIGJzZngpOyAvL3ZlcnRpY2FsIG51bWJlclxuXHRcdFx0XHRcdGlmIChlc2Z4ID09PSBcIiVcIikge1xuXHRcdFx0XHRcdFx0YnMgPSAoaG4gLyB3ICogMTAwKSArIFwiJVwiO1xuXHRcdFx0XHRcdFx0YnMyID0gKHZuIC8gaCAqIDEwMCkgKyBcIiVcIjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGVzZnggPT09IFwiZW1cIikge1xuXHRcdFx0XHRcdFx0ZW0gPSBfY29udmVydFRvUGl4ZWxzKHQsIFwiYm9yZGVyTGVmdFwiLCAxLCBcImVtXCIpO1xuXHRcdFx0XHRcdFx0YnMgPSAoaG4gLyBlbSkgKyBcImVtXCI7XG5cdFx0XHRcdFx0XHRiczIgPSAodm4gLyBlbSkgKyBcImVtXCI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJzID0gaG4gKyBcInB4XCI7XG5cdFx0XHRcdFx0XHRiczIgPSB2biArIFwicHhcIjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHJlbCkge1xuXHRcdFx0XHRcdFx0ZXMgPSAocGFyc2VGbG9hdChicykgKyBlbikgKyBlc2Z4O1xuXHRcdFx0XHRcdFx0ZXMyID0gKHBhcnNlRmxvYXQoYnMyKSArIGVuKSArIGVzZng7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gX3BhcnNlQ29tcGxleChzdHlsZSwgcHJvcHNbaV0sIGJzICsgXCIgXCIgKyBiczIsIGVzICsgXCIgXCIgKyBlczIsIGZhbHNlLCBcIjBweFwiLCBwdCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fSwgcHJlZml4OnRydWUsIGZvcm1hdHRlcjpfZ2V0Rm9ybWF0dGVyKFwiMHB4IDBweCAwcHggMHB4XCIsIGZhbHNlLCB0cnVlKX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJvcmRlckJvdHRvbUxlZnRSYWRpdXMsYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMsYm9yZGVyVG9wTGVmdFJhZGl1cyxib3JkZXJUb3BSaWdodFJhZGl1c1wiLCB7ZGVmYXVsdFZhbHVlOlwiMHB4XCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHRyZXR1cm4gX3BhcnNlQ29tcGxleCh0LnN0eWxlLCBwLCB0aGlzLmZvcm1hdChfZ2V0U3R5bGUodCwgcCwgX2NzLCBmYWxzZSwgXCIwcHggMHB4XCIpKSwgdGhpcy5mb3JtYXQoZSksIGZhbHNlLCBcIjBweFwiLCBwdCk7XG5cdFx0fSwgcHJlZml4OnRydWUsIGZvcm1hdHRlcjpfZ2V0Rm9ybWF0dGVyKFwiMHB4IDBweFwiLCBmYWxzZSwgdHJ1ZSl9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJiYWNrZ3JvdW5kUG9zaXRpb25cIiwge2RlZmF1bHRWYWx1ZTpcIjAgMFwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIGJwID0gXCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIsXG5cdFx0XHRcdGNzID0gKF9jcyB8fCBfZ2V0Q29tcHV0ZWRTdHlsZSh0LCBudWxsKSksXG5cdFx0XHRcdGJzID0gdGhpcy5mb3JtYXQoICgoY3MpID8gX2llVmVycyA/IGNzLmdldFByb3BlcnR5VmFsdWUoYnAgKyBcIi14XCIpICsgXCIgXCIgKyBjcy5nZXRQcm9wZXJ0eVZhbHVlKGJwICsgXCIteVwiKSA6IGNzLmdldFByb3BlcnR5VmFsdWUoYnApIDogdC5jdXJyZW50U3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uWCArIFwiIFwiICsgdC5jdXJyZW50U3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uWSkgfHwgXCIwIDBcIiksIC8vSW50ZXJuZXQgRXhwbG9yZXIgZG9lc24ndCByZXBvcnQgYmFja2dyb3VuZC1wb3NpdGlvbiBjb3JyZWN0bHkgLSB3ZSBtdXN0IHF1ZXJ5IGJhY2tncm91bmQtcG9zaXRpb24teCBhbmQgYmFja2dyb3VuZC1wb3NpdGlvbi15IGFuZCBjb21iaW5lIHRoZW0gKGV2ZW4gaW4gSUUxMCkuIEJlZm9yZSBJRTksIHdlIG11c3QgZG8gdGhlIHNhbWUgd2l0aCB0aGUgY3VycmVudFN0eWxlIG9iamVjdCBhbmQgdXNlIGNhbWVsQ2FzZVxuXHRcdFx0XHRlcyA9IHRoaXMuZm9ybWF0KGUpLFxuXHRcdFx0XHRiYSwgZWEsIGksIHBjdCwgb3ZlcmxhcCwgc3JjO1xuXHRcdFx0aWYgKChicy5pbmRleE9mKFwiJVwiKSAhPT0gLTEpICE9PSAoZXMuaW5kZXhPZihcIiVcIikgIT09IC0xKSAmJiBlcy5zcGxpdChcIixcIikubGVuZ3RoIDwgMikge1xuXHRcdFx0XHRzcmMgPSBfZ2V0U3R5bGUodCwgXCJiYWNrZ3JvdW5kSW1hZ2VcIikucmVwbGFjZShfdXJsRXhwLCBcIlwiKTtcblx0XHRcdFx0aWYgKHNyYyAmJiBzcmMgIT09IFwibm9uZVwiKSB7XG5cdFx0XHRcdFx0YmEgPSBicy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0ZWEgPSBlcy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0X3RlbXBJbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7IC8vc2V0IHRoZSB0ZW1wIElNRydzIHNyYyB0byB0aGUgYmFja2dyb3VuZC1pbWFnZSBzbyB0aGF0IHdlIGNhbiBtZWFzdXJlIGl0cyB3aWR0aC9oZWlnaHRcblx0XHRcdFx0XHRpID0gMjtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGJzID0gYmFbaV07XG5cdFx0XHRcdFx0XHRwY3QgPSAoYnMuaW5kZXhPZihcIiVcIikgIT09IC0xKTtcblx0XHRcdFx0XHRcdGlmIChwY3QgIT09IChlYVtpXS5pbmRleE9mKFwiJVwiKSAhPT0gLTEpKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXAgPSAoaSA9PT0gMCkgPyB0Lm9mZnNldFdpZHRoIC0gX3RlbXBJbWcud2lkdGggOiB0Lm9mZnNldEhlaWdodCAtIF90ZW1wSW1nLmhlaWdodDtcblx0XHRcdFx0XHRcdFx0YmFbaV0gPSBwY3QgPyAocGFyc2VGbG9hdChicykgLyAxMDAgKiBvdmVybGFwKSArIFwicHhcIiA6IChwYXJzZUZsb2F0KGJzKSAvIG92ZXJsYXAgKiAxMDApICsgXCIlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJzID0gYmEuam9pbihcIiBcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLCBicywgZXMsIHB0LCBwbHVnaW4pO1xuXHRcdH0sIGZvcm1hdHRlcjpfcGFyc2VQb3NpdGlvbn0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJhY2tncm91bmRTaXplXCIsIHtkZWZhdWx0VmFsdWU6XCIwIDBcIiwgZm9ybWF0dGVyOmZ1bmN0aW9uKHYpIHtcblx0XHRcdHYgKz0gXCJcIjsgLy9lbnN1cmUgaXQncyBhIHN0cmluZ1xuXHRcdFx0cmV0dXJuIF9wYXJzZVBvc2l0aW9uKHYuaW5kZXhPZihcIiBcIikgPT09IC0xID8gdiArIFwiIFwiICsgdiA6IHYpOyAvL2lmIHNldCB0byBzb21ldGhpbmcgbGlrZSBcIjEwMCUgMTAwJVwiLCBTYWZhcmkgdHlwaWNhbGx5IHJlcG9ydHMgdGhlIGNvbXB1dGVkIHN0eWxlIGFzIGp1c3QgXCIxMDAlXCIgKG5vIDJuZCB2YWx1ZSksIGJ1dCB3ZSBzaG91bGQgZW5zdXJlIHRoYXQgdGhlcmUgYXJlIHR3byB2YWx1ZXMsIHNvIGNvcHkgdGhlIGZpcnN0IG9uZS4gT3RoZXJ3aXNlLCBpdCdkIGJlIGludGVycHJldGVkIGFzIFwiMTAwJSAwXCIgKHdyb25nKS5cblx0XHR9fSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwicGVyc3BlY3RpdmVcIiwge2RlZmF1bHRWYWx1ZTpcIjBweFwiLCBwcmVmaXg6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInBlcnNwZWN0aXZlT3JpZ2luXCIsIHtkZWZhdWx0VmFsdWU6XCI1MCUgNTAlXCIsIHByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwidHJhbnNmb3JtU3R5bGVcIiwge3ByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYmFja2ZhY2VWaXNpYmlsaXR5XCIsIHtwcmVmaXg6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInVzZXJTZWxlY3RcIiwge3ByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwibWFyZ2luXCIsIHtwYXJzZXI6X2dldEVkZ2VQYXJzZXIoXCJtYXJnaW5Ub3AsbWFyZ2luUmlnaHQsbWFyZ2luQm90dG9tLG1hcmdpbkxlZnRcIil9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJwYWRkaW5nXCIsIHtwYXJzZXI6X2dldEVkZ2VQYXJzZXIoXCJwYWRkaW5nVG9wLHBhZGRpbmdSaWdodCxwYWRkaW5nQm90dG9tLHBhZGRpbmdMZWZ0XCIpfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiY2xpcFwiLCB7ZGVmYXVsdFZhbHVlOlwicmVjdCgwcHgsMHB4LDBweCwwcHgpXCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKXtcblx0XHRcdHZhciBiLCBjcywgZGVsaW07XG5cdFx0XHRpZiAoX2llVmVycyA8IDkpIHsgLy9JRTggYW5kIGVhcmxpZXIgZG9uJ3QgcmVwb3J0IGEgXCJjbGlwXCIgdmFsdWUgaW4gdGhlIGN1cnJlbnRTdHlsZSAtIGluc3RlYWQsIHRoZSB2YWx1ZXMgYXJlIHNwbGl0IGFwYXJ0IGludG8gY2xpcFRvcCwgY2xpcFJpZ2h0LCBjbGlwQm90dG9tLCBhbmQgY2xpcExlZnQuIEFsc28sIGluIElFNyBhbmQgZWFybGllciwgdGhlIHZhbHVlcyBpbnNpZGUgcmVjdCgpIGFyZSBzcGFjZS1kZWxpbWl0ZWQsIG5vdCBjb21tYS1kZWxpbWl0ZWQuXG5cdFx0XHRcdGNzID0gdC5jdXJyZW50U3R5bGU7XG5cdFx0XHRcdGRlbGltID0gX2llVmVycyA8IDggPyBcIiBcIiA6IFwiLFwiO1xuXHRcdFx0XHRiID0gXCJyZWN0KFwiICsgY3MuY2xpcFRvcCArIGRlbGltICsgY3MuY2xpcFJpZ2h0ICsgZGVsaW0gKyBjcy5jbGlwQm90dG9tICsgZGVsaW0gKyBjcy5jbGlwTGVmdCArIFwiKVwiO1xuXHRcdFx0XHRlID0gdGhpcy5mb3JtYXQoZSkuc3BsaXQoXCIsXCIpLmpvaW4oZGVsaW0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YiA9IHRoaXMuZm9ybWF0KF9nZXRTdHlsZSh0LCB0aGlzLnAsIF9jcywgZmFsc2UsIHRoaXMuZGZsdCkpO1xuXHRcdFx0XHRlID0gdGhpcy5mb3JtYXQoZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSwgYiwgZSwgcHQsIHBsdWdpbik7XG5cdFx0fX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInRleHRTaGFkb3dcIiwge2RlZmF1bHRWYWx1ZTpcIjBweCAwcHggMHB4ICM5OTlcIiwgY29sb3I6dHJ1ZSwgbXVsdGk6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImF1dG9Sb3VuZCxzdHJpY3RVbml0c1wiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0KSB7cmV0dXJuIHB0O319KTsgLy9qdXN0IHNvIHRoYXQgd2UgY2FuIGlnbm9yZSB0aGVzZSBwcm9wZXJ0aWVzIChub3QgdHdlZW4gdGhlbSlcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJib3JkZXJcIiwge2RlZmF1bHRWYWx1ZTpcIjBweCBzb2xpZCAjMDAwXCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHR2YXIgYncgPSBfZ2V0U3R5bGUodCwgXCJib3JkZXJUb3BXaWR0aFwiLCBfY3MsIGZhbHNlLCBcIjBweFwiKSxcblx0XHRcdFx0ZW5kID0gdGhpcy5mb3JtYXQoZSkuc3BsaXQoXCIgXCIpLFxuXHRcdFx0XHRlc2Z4ID0gZW5kWzBdLnJlcGxhY2UoX3N1ZmZpeEV4cCwgXCJcIik7XG5cdFx0XHRpZiAoZXNmeCAhPT0gXCJweFwiKSB7IC8vaWYgd2UncmUgYW5pbWF0aW5nIHRvIGEgbm9uLXB4IHZhbHVlLCB3ZSBuZWVkIHRvIGNvbnZlcnQgdGhlIGJlZ2lubmluZyB3aWR0aCB0byB0aGF0IHVuaXQuXG5cdFx0XHRcdGJ3ID0gKHBhcnNlRmxvYXQoYncpIC8gX2NvbnZlcnRUb1BpeGVscyh0LCBcImJvcmRlclRvcFdpZHRoXCIsIDEsIGVzZngpKSArIGVzZng7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSwgdGhpcy5mb3JtYXQoYncgKyBcIiBcIiArIF9nZXRTdHlsZSh0LCBcImJvcmRlclRvcFN0eWxlXCIsIF9jcywgZmFsc2UsIFwic29saWRcIikgKyBcIiBcIiArIF9nZXRTdHlsZSh0LCBcImJvcmRlclRvcENvbG9yXCIsIF9jcywgZmFsc2UsIFwiIzAwMFwiKSksIGVuZC5qb2luKFwiIFwiKSwgcHQsIHBsdWdpbik7XG5cdFx0XHR9LCBjb2xvcjp0cnVlLCBmb3JtYXR0ZXI6ZnVuY3Rpb24odikge1xuXHRcdFx0XHR2YXIgYSA9IHYuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRyZXR1cm4gYVswXSArIFwiIFwiICsgKGFbMV0gfHwgXCJzb2xpZFwiKSArIFwiIFwiICsgKHYubWF0Y2goX2NvbG9yRXhwKSB8fCBbXCIjMDAwXCJdKVswXTtcblx0XHRcdH19KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJib3JkZXJXaWR0aFwiLCB7cGFyc2VyOl9nZXRFZGdlUGFyc2VyKFwiYm9yZGVyVG9wV2lkdGgsYm9yZGVyUmlnaHRXaWR0aCxib3JkZXJCb3R0b21XaWR0aCxib3JkZXJMZWZ0V2lkdGhcIil9KTsgLy9GaXJlZm94IGRvZXNuJ3QgcGljayB1cCBvbiBib3JkZXJXaWR0aCBzZXQgaW4gc3R5bGUgc2hlZXRzIChvbmx5IGlubGluZSkuXG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiZmxvYXQsY3NzRmxvYXQsc3R5bGVGbG9hdFwiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4pIHtcblx0XHRcdHZhciBzID0gdC5zdHlsZSxcblx0XHRcdFx0cHJvcCA9IChcImNzc0Zsb2F0XCIgaW4gcykgPyBcImNzc0Zsb2F0XCIgOiBcInN0eWxlRmxvYXRcIjtcblx0XHRcdHJldHVybiBuZXcgQ1NTUHJvcFR3ZWVuKHMsIHByb3AsIDAsIDAsIHB0LCAtMSwgcCwgZmFsc2UsIDAsIHNbcHJvcF0sIGUpO1xuXHRcdH19KTtcblxuXHRcdC8vb3BhY2l0eS1yZWxhdGVkXG5cdFx0dmFyIF9zZXRJRU9wYWNpdHlSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dmFyIHQgPSB0aGlzLnQsIC8vcmVmZXJzIHRvIHRoZSBlbGVtZW50J3Mgc3R5bGUgcHJvcGVydHlcblx0XHRcdFx0XHRmaWx0ZXJzID0gdC5maWx0ZXIgfHwgX2dldFN0eWxlKHRoaXMuZGF0YSwgXCJmaWx0ZXJcIikgfHwgXCJcIixcblx0XHRcdFx0XHR2YWwgPSAodGhpcy5zICsgdGhpcy5jICogdikgfCAwLFxuXHRcdFx0XHRcdHNraXA7XG5cdFx0XHRcdGlmICh2YWwgPT09IDEwMCkgeyAvL2ZvciBvbGRlciB2ZXJzaW9ucyBvZiBJRSB0aGF0IG5lZWQgdG8gdXNlIGEgZmlsdGVyIHRvIGFwcGx5IG9wYWNpdHksIHdlIHNob3VsZCByZW1vdmUgdGhlIGZpbHRlciBpZiBvcGFjaXR5IGhpdHMgMSBpbiBvcmRlciB0byBpbXByb3ZlIHBlcmZvcm1hbmNlLCBidXQgbWFrZSBzdXJlIHRoZXJlIGlzbid0IGEgdHJhbnNmb3JtIChtYXRyaXgpIG9yIGdyYWRpZW50IGluIHRoZSBmaWx0ZXJzLlxuXHRcdFx0XHRcdGlmIChmaWx0ZXJzLmluZGV4T2YoXCJhdHJpeChcIikgPT09IC0xICYmIGZpbHRlcnMuaW5kZXhPZihcInJhZGllbnQoXCIpID09PSAtMSAmJiBmaWx0ZXJzLmluZGV4T2YoXCJvYWRlcihcIikgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0LnJlbW92ZUF0dHJpYnV0ZShcImZpbHRlclwiKTtcblx0XHRcdFx0XHRcdHNraXAgPSAoIV9nZXRTdHlsZSh0aGlzLmRhdGEsIFwiZmlsdGVyXCIpKTsgLy9pZiBhIGNsYXNzIGlzIGFwcGxpZWQgdGhhdCBoYXMgYW4gYWxwaGEgZmlsdGVyLCBpdCB3aWxsIHRha2UgZWZmZWN0ICh3ZSBkb24ndCB3YW50IHRoYXQpLCBzbyByZS1hcHBseSBvdXIgYWxwaGEgZmlsdGVyIGluIHRoYXQgY2FzZS4gV2UgbXVzdCBmaXJzdCByZW1vdmUgaXQgYW5kIHRoZW4gY2hlY2suXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHQuZmlsdGVyID0gZmlsdGVycy5yZXBsYWNlKF9hbHBoYUZpbHRlckV4cCwgXCJcIik7XG5cdFx0XHRcdFx0XHRza2lwID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFza2lwKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMueG4xKSB7XG5cdFx0XHRcdFx0XHR0LmZpbHRlciA9IGZpbHRlcnMgPSBmaWx0ZXJzIHx8IChcImFscGhhKG9wYWNpdHk9XCIgKyB2YWwgKyBcIilcIik7IC8vd29ya3MgYXJvdW5kIGJ1ZyBpbiBJRTcvOCB0aGF0IHByZXZlbnRzIGNoYW5nZXMgdG8gXCJ2aXNpYmlsaXR5XCIgZnJvbSBiZWluZyBhcHBsaWVkIHByb3Blcmx5IGlmIHRoZSBmaWx0ZXIgaXMgY2hhbmdlZCB0byBhIGRpZmZlcmVudCBhbHBoYSBvbiB0aGUgc2FtZSBmcmFtZS5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGZpbHRlcnMuaW5kZXhPZihcInBhY2l0eVwiKSA9PT0gLTEpIHsgLy9vbmx5IHVzZWQgaWYgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdGhlIHN0YW5kYXJkIG9wYWNpdHkgc3R5bGUgcHJvcGVydHkgKElFIDcgYW5kIDgpLiBXZSBvbWl0IHRoZSBcIk9cIiB0byBhdm9pZCBjYXNlLXNlbnNpdGl2aXR5IGlzc3Vlc1xuXHRcdFx0XHRcdFx0aWYgKHZhbCAhPT0gMCB8fCAhdGhpcy54bjEpIHsgLy9idWdzIGluIElFNy84IHdvbid0IHJlbmRlciB0aGUgZmlsdGVyIHByb3Blcmx5IGlmIG9wYWNpdHkgaXMgQURERUQgb24gdGhlIHNhbWUgZnJhbWUvcmVuZGVyIGFzIFwidmlzaWJpbGl0eVwiIGNoYW5nZXMgKHRoaXMueG4xIGlzIDEgaWYgdGhpcyB0d2VlbiBpcyBhbiBcImF1dG9BbHBoYVwiIHR3ZWVuKVxuXHRcdFx0XHRcdFx0XHR0LmZpbHRlciA9IGZpbHRlcnMgKyBcIiBhbHBoYShvcGFjaXR5PVwiICsgdmFsICsgXCIpXCI7IC8vd2Ugcm91bmQgdGhlIHZhbHVlIGJlY2F1c2Ugb3RoZXJ3aXNlLCBidWdzIGluIElFNy84IGNhbiBwcmV2ZW50IFwidmlzaWJpbGl0eVwiIGNoYW5nZXMgZnJvbSBiZWluZyBhcHBsaWVkIHByb3Blcmx5LlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0LmZpbHRlciA9IGZpbHRlcnMucmVwbGFjZShfb3BhY2l0eUV4cCwgXCJvcGFjaXR5PVwiICsgdmFsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwib3BhY2l0eSxhbHBoYSxhdXRvQWxwaGFcIiwge2RlZmF1bHRWYWx1ZTpcIjFcIiwgcGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4pIHtcblx0XHRcdHZhciBiID0gcGFyc2VGbG9hdChfZ2V0U3R5bGUodCwgXCJvcGFjaXR5XCIsIF9jcywgZmFsc2UsIFwiMVwiKSksXG5cdFx0XHRcdHN0eWxlID0gdC5zdHlsZSxcblx0XHRcdFx0aXNBdXRvQWxwaGEgPSAocCA9PT0gXCJhdXRvQWxwaGFcIik7XG5cdFx0XHRpZiAodHlwZW9mKGUpID09PSBcInN0cmluZ1wiICYmIGUuY2hhckF0KDEpID09PSBcIj1cIikge1xuXHRcdFx0XHRlID0gKChlLmNoYXJBdCgwKSA9PT0gXCItXCIpID8gLTEgOiAxKSAqIHBhcnNlRmxvYXQoZS5zdWJzdHIoMikpICsgYjtcblx0XHRcdH1cblx0XHRcdGlmIChpc0F1dG9BbHBoYSAmJiBiID09PSAxICYmIF9nZXRTdHlsZSh0LCBcInZpc2liaWxpdHlcIiwgX2NzKSA9PT0gXCJoaWRkZW5cIiAmJiBlICE9PSAwKSB7IC8vaWYgdmlzaWJpbGl0eSBpcyBpbml0aWFsbHkgc2V0IHRvIFwiaGlkZGVuXCIsIHdlIHNob3VsZCBpbnRlcnByZXQgdGhhdCBhcyBpbnRlbnQgdG8gbWFrZSBvcGFjaXR5IDAgKGEgY29udmVuaWVuY2UpXG5cdFx0XHRcdGIgPSAwO1xuXHRcdFx0fVxuXHRcdFx0aWYgKF9zdXBwb3J0c09wYWNpdHkpIHtcblx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHN0eWxlLCBcIm9wYWNpdHlcIiwgYiwgZSAtIGIsIHB0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2VlbihzdHlsZSwgXCJvcGFjaXR5XCIsIGIgKiAxMDAsIChlIC0gYikgKiAxMDAsIHB0KTtcblx0XHRcdFx0cHQueG4xID0gaXNBdXRvQWxwaGEgPyAxIDogMDsgLy93ZSBuZWVkIHRvIHJlY29yZCB3aGV0aGVyIG9yIG5vdCB0aGlzIGlzIGFuIGF1dG9BbHBoYSBzbyB0aGF0IGluIHRoZSBzZXRSYXRpbygpLCB3ZSBrbm93IHRvIGR1cGxpY2F0ZSB0aGUgc2V0dGluZyBvZiB0aGUgYWxwaGEgaW4gb3JkZXIgdG8gd29yayBhcm91bmQgYSBidWcgaW4gSUU3IGFuZCBJRTggdGhhdCBwcmV2ZW50cyBjaGFuZ2VzIHRvIFwidmlzaWJpbGl0eVwiIGZyb20gdGFraW5nIGVmZmVjdCBpZiB0aGUgZmlsdGVyIGlzIGNoYW5nZWQgdG8gYSBkaWZmZXJlbnQgYWxwaGEob3BhY2l0eSkgYXQgdGhlIHNhbWUgdGltZS4gU2V0dGluZyBpdCB0byB0aGUgU0FNRSB2YWx1ZSBmaXJzdCwgdGhlbiB0aGUgbmV3IHZhbHVlIHdvcmtzIGFyb3VuZCB0aGUgSUU3LzggYnVnLlxuXHRcdFx0XHRzdHlsZS56b29tID0gMTsgLy9oZWxwcyBjb3JyZWN0IGFuIElFIGlzc3VlLlxuXHRcdFx0XHRwdC50eXBlID0gMjtcblx0XHRcdFx0cHQuYiA9IFwiYWxwaGEob3BhY2l0eT1cIiArIHB0LnMgKyBcIilcIjtcblx0XHRcdFx0cHQuZSA9IFwiYWxwaGEob3BhY2l0eT1cIiArIChwdC5zICsgcHQuYykgKyBcIilcIjtcblx0XHRcdFx0cHQuZGF0YSA9IHQ7XG5cdFx0XHRcdHB0LnBsdWdpbiA9IHBsdWdpbjtcblx0XHRcdFx0cHQuc2V0UmF0aW8gPSBfc2V0SUVPcGFjaXR5UmF0aW87XG5cdFx0XHR9XG5cdFx0XHRpZiAoaXNBdXRvQWxwaGEpIHsgLy93ZSBoYXZlIHRvIGNyZWF0ZSB0aGUgXCJ2aXNpYmlsaXR5XCIgUHJvcFR3ZWVuIGFmdGVyIHRoZSBvcGFjaXR5IG9uZSBpbiB0aGUgbGlua2VkIGxpc3Qgc28gdGhhdCB0aGV5IHJ1biBpbiB0aGUgb3JkZXIgdGhhdCB3b3JrcyBwcm9wZXJseSBpbiBJRTggYW5kIGVhcmxpZXJcblx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHN0eWxlLCBcInZpc2liaWxpdHlcIiwgMCwgMCwgcHQsIC0xLCBudWxsLCBmYWxzZSwgMCwgKChiICE9PSAwKSA/IFwiaW5oZXJpdFwiIDogXCJoaWRkZW5cIiksICgoZSA9PT0gMCkgPyBcImhpZGRlblwiIDogXCJpbmhlcml0XCIpKTtcblx0XHRcdFx0cHQueHMwID0gXCJpbmhlcml0XCI7XG5cdFx0XHRcdGNzc3AuX292ZXJ3cml0ZVByb3BzLnB1c2gocHQubik7XG5cdFx0XHRcdGNzc3AuX292ZXJ3cml0ZVByb3BzLnB1c2gocCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fX0pO1xuXG5cblx0XHR2YXIgX3JlbW92ZVByb3AgPSBmdW5jdGlvbihzLCBwKSB7XG5cdFx0XHRcdGlmIChwKSB7XG5cdFx0XHRcdFx0aWYgKHMucmVtb3ZlUHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdGlmIChwLnN1YnN0cigwLDIpID09PSBcIm1zXCIgfHwgcC5zdWJzdHIoMCw2KSA9PT0gXCJ3ZWJraXRcIikgeyAvL01pY3Jvc29mdCBhbmQgc29tZSBXZWJraXQgYnJvd3NlcnMgZG9uJ3QgY29uZm9ybSB0byB0aGUgc3RhbmRhcmQgb2YgY2FwaXRhbGl6aW5nIHRoZSBmaXJzdCBwcmVmaXggY2hhcmFjdGVyLCBzbyB3ZSBhZGp1c3Qgc28gdGhhdCB3aGVuIHdlIHByZWZpeCB0aGUgY2FwcyB3aXRoIGEgZGFzaCwgaXQncyBjb3JyZWN0IChvdGhlcndpc2UgaXQnZCBiZSBcIm1zLXRyYW5zZm9ybVwiIGluc3RlYWQgb2YgXCItbXMtdHJhbnNmb3JtXCIgZm9yIElFOSwgZm9yIGV4YW1wbGUpXG5cdFx0XHRcdFx0XHRcdHAgPSBcIi1cIiArIHA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzLnJlbW92ZVByb3BlcnR5KHAucmVwbGFjZShfY2Fwc0V4cCwgXCItJDFcIikudG9Mb3dlckNhc2UoKSk7XG5cdFx0XHRcdFx0fSBlbHNlIHsgLy9ub3RlOiBvbGQgdmVyc2lvbnMgb2YgSUUgdXNlIFwicmVtb3ZlQXR0cmlidXRlKClcIiBpbnN0ZWFkIG9mIFwicmVtb3ZlUHJvcGVydHkoKVwiXG5cdFx0XHRcdFx0XHRzLnJlbW92ZUF0dHJpYnV0ZShwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRfc2V0Q2xhc3NOYW1lUmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHRoaXMudC5fZ3NDbGFzc1BUID0gdGhpcztcblx0XHRcdFx0aWYgKHYgPT09IDEgfHwgdiA9PT0gMCkge1xuXHRcdFx0XHRcdHRoaXMudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCAodiA9PT0gMCkgPyB0aGlzLmIgOiB0aGlzLmUpO1xuXHRcdFx0XHRcdHZhciBtcHQgPSB0aGlzLmRhdGEsIC8vZmlyc3QgTWluaVByb3BUd2VlblxuXHRcdFx0XHRcdFx0cyA9IHRoaXMudC5zdHlsZTtcblx0XHRcdFx0XHR3aGlsZSAobXB0KSB7XG5cdFx0XHRcdFx0XHRpZiAoIW1wdC52KSB7XG5cdFx0XHRcdFx0XHRcdF9yZW1vdmVQcm9wKHMsIG1wdC5wKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHNbbXB0LnBdID0gbXB0LnY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtcHQgPSBtcHQuX25leHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh2ID09PSAxICYmIHRoaXMudC5fZ3NDbGFzc1BUID09PSB0aGlzKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnQuX2dzQ2xhc3NQVCA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMudC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSAhPT0gdGhpcy5lKSB7XG5cdFx0XHRcdFx0dGhpcy50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiY2xhc3NOYW1lXCIsIHtwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbiwgdmFycykge1xuXHRcdFx0dmFyIGIgPSB0LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIsIC8vZG9uJ3QgdXNlIHQuY2xhc3NOYW1lIGJlY2F1c2UgaXQgZG9lc24ndCB3b3JrIGNvbnNpc3RlbnRseSBvbiBTVkcgZWxlbWVudHM7IGdldEF0dHJpYnV0ZShcImNsYXNzXCIpIGFuZCBzZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB2YWx1ZVwiKSBpcyBtb3JlIHJlbGlhYmxlLlxuXHRcdFx0XHRjc3NUZXh0ID0gdC5zdHlsZS5jc3NUZXh0LFxuXHRcdFx0XHRkaWZEYXRhLCBicywgY25wdCwgY25wdExvb2t1cCwgbXB0O1xuXHRcdFx0cHQgPSBjc3NwLl9jbGFzc05hbWVQVCA9IG5ldyBDU1NQcm9wVHdlZW4odCwgcCwgMCwgMCwgcHQsIDIpO1xuXHRcdFx0cHQuc2V0UmF0aW8gPSBfc2V0Q2xhc3NOYW1lUmF0aW87XG5cdFx0XHRwdC5wciA9IC0xMTtcblx0XHRcdF9oYXNQcmlvcml0eSA9IHRydWU7XG5cdFx0XHRwdC5iID0gYjtcblx0XHRcdGJzID0gX2dldEFsbFN0eWxlcyh0LCBfY3MpO1xuXHRcdFx0Ly9pZiB0aGVyZSdzIGEgY2xhc3NOYW1lIHR3ZWVuIGFscmVhZHkgb3BlcmF0aW5nIG9uIHRoZSB0YXJnZXQsIGZvcmNlIGl0IHRvIGl0cyBlbmQgc28gdGhhdCB0aGUgbmVjZXNzYXJ5IGlubGluZSBzdHlsZXMgYXJlIHJlbW92ZWQgYW5kIHRoZSBjbGFzcyBuYW1lIGlzIGFwcGxpZWQgYmVmb3JlIHdlIGRldGVybWluZSB0aGUgZW5kIHN0YXRlICh3ZSBkb24ndCB3YW50IGlubGluZSBzdHlsZXMgaW50ZXJmZXJpbmcgdGhhdCB3ZXJlIHRoZXJlIGp1c3QgZm9yIGNsYXNzLXNwZWNpZmljIHZhbHVlcylcblx0XHRcdGNucHQgPSB0Ll9nc0NsYXNzUFQ7XG5cdFx0XHRpZiAoY25wdCkge1xuXHRcdFx0XHRjbnB0TG9va3VwID0ge307XG5cdFx0XHRcdG1wdCA9IGNucHQuZGF0YTsgLy9maXJzdCBNaW5pUHJvcFR3ZWVuIHdoaWNoIHN0b3JlcyB0aGUgaW5saW5lIHN0eWxlcyAtIHdlIG5lZWQgdG8gZm9yY2UgdGhlc2Ugc28gdGhhdCB0aGUgaW5saW5lIHN0eWxlcyBkb24ndCBjb250YW1pbmF0ZSB0aGluZ3MuIE90aGVyd2lzZSwgdGhlcmUncyBhIHNtYWxsIGNoYW5jZSB0aGF0IGEgdHdlZW4gY291bGQgc3RhcnQgYW5kIHRoZSBpbmxpbmUgdmFsdWVzIG1hdGNoIHRoZSBkZXN0aW5hdGlvbiB2YWx1ZXMgYW5kIHRoZXkgbmV2ZXIgZ2V0IGNsZWFuZWQuXG5cdFx0XHRcdHdoaWxlIChtcHQpIHtcblx0XHRcdFx0XHRjbnB0TG9va3VwW21wdC5wXSA9IDE7XG5cdFx0XHRcdFx0bXB0ID0gbXB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNucHQuc2V0UmF0aW8oMSk7XG5cdFx0XHR9XG5cdFx0XHR0Ll9nc0NsYXNzUFQgPSBwdDtcblx0XHRcdHB0LmUgPSAoZS5jaGFyQXQoMSkgIT09IFwiPVwiKSA/IGUgOiBiLnJlcGxhY2UobmV3IFJlZ0V4cChcIig/OlxcXFxzfF4pXCIgKyBlLnN1YnN0cigyKSArIFwiKD8hW1xcXFx3LV0pXCIpLCBcIlwiKSArICgoZS5jaGFyQXQoMCkgPT09IFwiK1wiKSA/IFwiIFwiICsgZS5zdWJzdHIoMikgOiBcIlwiKTtcblx0XHRcdHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgcHQuZSk7XG5cdFx0XHRkaWZEYXRhID0gX2Nzc0RpZih0LCBicywgX2dldEFsbFN0eWxlcyh0KSwgdmFycywgY25wdExvb2t1cCk7XG5cdFx0XHR0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGIpO1xuXHRcdFx0cHQuZGF0YSA9IGRpZkRhdGEuZmlyc3RNUFQ7XG5cdFx0XHR0LnN0eWxlLmNzc1RleHQgPSBjc3NUZXh0OyAvL3dlIHJlY29yZGVkIGNzc1RleHQgYmVmb3JlIHdlIHN3YXBwZWQgY2xhc3NlcyBhbmQgcmFuIF9nZXRBbGxTdHlsZXMoKSBiZWNhdXNlIGluIGNhc2VzIHdoZW4gYSBjbGFzc05hbWUgdHdlZW4gaXMgb3ZlcndyaXR0ZW4sIHdlIHJlbW92ZSBhbGwgdGhlIHJlbGF0ZWQgdHdlZW5pbmcgcHJvcGVydGllcyBmcm9tIHRoYXQgY2xhc3MgY2hhbmdlIChvdGhlcndpc2UgY2xhc3Mtc3BlY2lmaWMgc3R1ZmYgY2FuJ3Qgb3ZlcnJpZGUgcHJvcGVydGllcyB3ZSd2ZSBkaXJlY3RseSBzZXQgb24gdGhlIHRhcmdldCdzIHN0eWxlIG9iamVjdCBkdWUgdG8gc3BlY2lmaWNpdHkpLlxuXHRcdFx0cHQgPSBwdC54Zmlyc3QgPSBjc3NwLnBhcnNlKHQsIGRpZkRhdGEuZGlmcywgcHQsIHBsdWdpbik7IC8vd2UgcmVjb3JkIHRoZSBDU1NQcm9wVHdlZW4gYXMgdGhlIHhmaXJzdCBzbyB0aGF0IHdlIGNhbiBoYW5kbGUgb3ZlcndyaXRpbmcgcHJvcGVydGx5IChpZiBcImNsYXNzTmFtZVwiIGdldHMgb3ZlcndyaXR0ZW4sIHdlIG11c3Qga2lsbCBhbGwgdGhlIHByb3BlcnRpZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbGFzc05hbWUgcGFydCBvZiB0aGUgdHdlZW4sIHNvIHdlIGNhbiBsb29wIHRocm91Z2ggZnJvbSB4Zmlyc3QgdG8gdGhlIHB0IGl0c2VsZilcblx0XHRcdHJldHVybiBwdDtcblx0XHR9fSk7XG5cblxuXHRcdHZhciBfc2V0Q2xlYXJQcm9wc1JhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHYgPT09IDEgfHwgdiA9PT0gMCkgaWYgKHRoaXMuZGF0YS5fdG90YWxUaW1lID09PSB0aGlzLmRhdGEuX3RvdGFsRHVyYXRpb24gJiYgdGhpcy5kYXRhLmRhdGEgIT09IFwiaXNGcm9tU3RhcnRcIikgeyAvL3RoaXMuZGF0YSByZWZlcnMgdG8gdGhlIHR3ZWVuLiBPbmx5IGNsZWFyIGF0IHRoZSBFTkQgb2YgdGhlIHR3ZWVuIChyZW1lbWJlciwgZnJvbSgpIHR3ZWVucyBtYWtlIHRoZSByYXRpbyBnbyBmcm9tIDEgdG8gMCwgc28gd2UgY2FuJ3QganVzdCBjaGVjayB0aGF0IGFuZCBpZiB0aGUgdHdlZW4gaXMgdGhlIHplcm8tZHVyYXRpb24gb25lIHRoYXQncyBjcmVhdGVkIGludGVybmFsbHkgdG8gcmVuZGVyIHRoZSBzdGFydGluZyB2YWx1ZXMgaW4gYSBmcm9tKCkgdHdlZW4sIGlnbm9yZSB0aGF0IGJlY2F1c2Ugb3RoZXJ3aXNlLCBmb3IgZXhhbXBsZSwgZnJvbSguLi57aGVpZ2h0OjEwMCwgY2xlYXJQcm9wczpcImhlaWdodFwiLCBkZWxheToxfSkgd291bGQgd2lwZSB0aGUgaGVpZ2h0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHR3ZWVuIGFuZCBhZnRlciAxIHNlY29uZCwgaXQnZCBraWNrIGJhY2sgaW4pLlxuXHRcdFx0XHR2YXIgcyA9IHRoaXMudC5zdHlsZSxcblx0XHRcdFx0XHR0cmFuc2Zvcm1QYXJzZSA9IF9zcGVjaWFsUHJvcHMudHJhbnNmb3JtLnBhcnNlLFxuXHRcdFx0XHRcdGEsIHAsIGksIGNsZWFyVHJhbnNmb3JtLCB0cmFuc2Zvcm07XG5cdFx0XHRcdGlmICh0aGlzLmUgPT09IFwiYWxsXCIpIHtcblx0XHRcdFx0XHRzLmNzc1RleHQgPSBcIlwiO1xuXHRcdFx0XHRcdGNsZWFyVHJhbnNmb3JtID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhID0gdGhpcy5lLnNwbGl0KFwiIFwiKS5qb2luKFwiXCIpLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRwID0gYVtpXTtcblx0XHRcdFx0XHRcdGlmIChfc3BlY2lhbFByb3BzW3BdKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChfc3BlY2lhbFByb3BzW3BdLnBhcnNlID09PSB0cmFuc2Zvcm1QYXJzZSkge1xuXHRcdFx0XHRcdFx0XHRcdGNsZWFyVHJhbnNmb3JtID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwID0gKHAgPT09IFwidHJhbnNmb3JtT3JpZ2luXCIpID8gX3RyYW5zZm9ybU9yaWdpblByb3AgOiBfc3BlY2lhbFByb3BzW3BdLnA7IC8vZW5zdXJlcyB0aGF0IHNwZWNpYWwgcHJvcGVydGllcyB1c2UgdGhlIHByb3BlciBicm93c2VyLXNwZWNpZmljIHByb3BlcnR5IG5hbWUsIGxpa2UgXCJzY2FsZVhcIiBtaWdodCBiZSBcIi13ZWJraXQtdHJhbnNmb3JtXCIgb3IgXCJib3hTaGFkb3dcIiBtaWdodCBiZSBcIi1tb3otYm94LXNoYWRvd1wiXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdF9yZW1vdmVQcm9wKHMsIHApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2xlYXJUcmFuc2Zvcm0pIHtcblx0XHRcdFx0XHRfcmVtb3ZlUHJvcChzLCBfdHJhbnNmb3JtUHJvcCk7XG5cdFx0XHRcdFx0dHJhbnNmb3JtID0gdGhpcy50Ll9nc1RyYW5zZm9ybTtcblx0XHRcdFx0XHRpZiAodHJhbnNmb3JtKSB7XG5cdFx0XHRcdFx0XHRpZiAodHJhbnNmb3JtLnN2Zykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zdmctb3JpZ2luXCIpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnQucmVtb3ZlQXR0cmlidXRlKFwidHJhbnNmb3JtXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMudC5fZ3NUcmFuc2Zvcm07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9O1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImNsZWFyUHJvcHNcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCkge1xuXHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHQsIHAsIDAsIDAsIHB0LCAyKTtcblx0XHRcdHB0LnNldFJhdGlvID0gX3NldENsZWFyUHJvcHNSYXRpbztcblx0XHRcdHB0LmUgPSBlO1xuXHRcdFx0cHQucHIgPSAtMTA7XG5cdFx0XHRwdC5kYXRhID0gY3NzcC5fdHdlZW47XG5cdFx0XHRfaGFzUHJpb3JpdHkgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH19KTtcblxuXHRcdHAgPSBcImJlemllcix0aHJvd1Byb3BzLHBoeXNpY3NQcm9wcyxwaHlzaWNzMkRcIi5zcGxpdChcIixcIik7XG5cdFx0aSA9IHAubGVuZ3RoO1xuXHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdF9yZWdpc3RlclBsdWdpblByb3AocFtpXSk7XG5cdFx0fVxuXG5cblxuXG5cblxuXG5cblx0XHRwID0gQ1NTUGx1Z2luLnByb3RvdHlwZTtcblx0XHRwLl9maXJzdFBUID0gcC5fbGFzdFBhcnNlZFRyYW5zZm9ybSA9IHAuX3RyYW5zZm9ybSA9IG51bGw7XG5cblx0XHQvL2dldHMgY2FsbGVkIHdoZW4gdGhlIHR3ZWVuIHJlbmRlcnMgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGtpY2tzIGV2ZXJ5dGhpbmcgb2ZmLCByZWNvcmRpbmcgc3RhcnQvZW5kIHZhbHVlcywgZXRjLlxuXHRcdHAuX29uSW5pdFR3ZWVuID0gZnVuY3Rpb24odGFyZ2V0LCB2YXJzLCB0d2VlbiwgaW5kZXgpIHtcblx0XHRcdGlmICghdGFyZ2V0Lm5vZGVUeXBlKSB7IC8vY3NzIGlzIG9ubHkgZm9yIGRvbSBlbGVtZW50c1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl90YXJnZXQgPSBfdGFyZ2V0ID0gdGFyZ2V0O1xuXHRcdFx0dGhpcy5fdHdlZW4gPSB0d2Vlbjtcblx0XHRcdHRoaXMuX3ZhcnMgPSB2YXJzO1xuXHRcdFx0X2luZGV4ID0gaW5kZXg7XG5cdFx0XHRfYXV0b1JvdW5kID0gdmFycy5hdXRvUm91bmQ7XG5cdFx0XHRfaGFzUHJpb3JpdHkgPSBmYWxzZTtcblx0XHRcdF9zdWZmaXhNYXAgPSB2YXJzLnN1ZmZpeE1hcCB8fCBDU1NQbHVnaW4uc3VmZml4TWFwO1xuXHRcdFx0X2NzID0gX2dldENvbXB1dGVkU3R5bGUodGFyZ2V0LCBcIlwiKTtcblx0XHRcdF9vdmVyd3JpdGVQcm9wcyA9IHRoaXMuX292ZXJ3cml0ZVByb3BzO1xuXHRcdFx0dmFyIHN0eWxlID0gdGFyZ2V0LnN0eWxlLFxuXHRcdFx0XHR2LCBwdCwgcHQyLCBmaXJzdCwgbGFzdCwgbmV4dCwgekluZGV4LCB0cHQsIHRocmVlRDtcblx0XHRcdGlmIChfcmVxU2FmYXJpRml4KSBpZiAoc3R5bGUuekluZGV4ID09PSBcIlwiKSB7XG5cdFx0XHRcdHYgPSBfZ2V0U3R5bGUodGFyZ2V0LCBcInpJbmRleFwiLCBfY3MpO1xuXHRcdFx0XHRpZiAodiA9PT0gXCJhdXRvXCIgfHwgdiA9PT0gXCJcIikge1xuXHRcdFx0XHRcdC8vY29ycmVjdHMgYSBidWcgaW4gW25vbi1BbmRyb2lkXSBTYWZhcmkgdGhhdCBwcmV2ZW50cyBpdCBmcm9tIHJlcGFpbnRpbmcgZWxlbWVudHMgaW4gdGhlaXIgbmV3IHBvc2l0aW9ucyBpZiB0aGV5IGRvbid0IGhhdmUgYSB6SW5kZXggc2V0LiBXZSBhbHNvIGNhbid0IGp1c3QgYXBwbHkgdGhpcyBpbnNpZGUgX3BhcnNlVHJhbnNmb3JtKCkgYmVjYXVzZSBhbnl0aGluZyB0aGF0J3MgbW92ZWQgaW4gYW55IHdheSAobGlrZSB1c2luZyBcImxlZnRcIiBvciBcInRvcFwiIGluc3RlYWQgb2YgdHJhbnNmb3JtcyBsaWtlIFwieFwiIGFuZCBcInlcIikgY2FuIGJlIGFmZmVjdGVkLCBzbyBpdCBpcyBiZXN0IHRvIGVuc3VyZSB0aGF0IGFueXRoaW5nIHRoYXQncyB0d2VlbmluZyBoYXMgYSB6LWluZGV4LiBTZXR0aW5nIFwiV2Via2l0UGVyc3BlY3RpdmVcIiB0byBhIG5vbi16ZXJvIHZhbHVlIHdvcmtlZCB0b28gZXhjZXB0IHRoYXQgb24gaU9TIFNhZmFyaSB0aGluZ3Mgd291bGQgZmxpY2tlciByYW5kb21seS4gUGx1cyB6SW5kZXggaXMgbGVzcyBtZW1vcnktaW50ZW5zaXZlLlxuXHRcdFx0XHRcdHRoaXMuX2FkZExhenlTZXQoc3R5bGUsIFwiekluZGV4XCIsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YodmFycykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0Zmlyc3QgPSBzdHlsZS5jc3NUZXh0O1xuXHRcdFx0XHR2ID0gX2dldEFsbFN0eWxlcyh0YXJnZXQsIF9jcyk7XG5cdFx0XHRcdHN0eWxlLmNzc1RleHQgPSBmaXJzdCArIFwiO1wiICsgdmFycztcblx0XHRcdFx0diA9IF9jc3NEaWYodGFyZ2V0LCB2LCBfZ2V0QWxsU3R5bGVzKHRhcmdldCkpLmRpZnM7XG5cdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSAmJiBfb3BhY2l0eVZhbEV4cC50ZXN0KHZhcnMpKSB7XG5cdFx0XHRcdFx0di5vcGFjaXR5ID0gcGFyc2VGbG9hdCggUmVnRXhwLiQxICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFycyA9IHY7XG5cdFx0XHRcdHN0eWxlLmNzc1RleHQgPSBmaXJzdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHZhcnMuY2xhc3NOYW1lKSB7IC8vY2xhc3NOYW1lIHR3ZWVucyB3aWxsIGNvbWJpbmUgYW55IGRpZmZlcmVuY2VzIHRoZXkgZmluZCBpbiB0aGUgY3NzIHdpdGggdGhlIHZhcnMgdGhhdCBhcmUgcGFzc2VkIGluLCBzbyB7Y2xhc3NOYW1lOlwibXlDbGFzc1wiLCBzY2FsZTowLjUsIGxlZnQ6MjB9IHdvdWxkIHdvcmsuXG5cdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdCA9IF9zcGVjaWFsUHJvcHMuY2xhc3NOYW1lLnBhcnNlKHRhcmdldCwgdmFycy5jbGFzc05hbWUsIFwiY2xhc3NOYW1lXCIsIHRoaXMsIG51bGwsIG51bGwsIHZhcnMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0ID0gdGhpcy5wYXJzZSh0YXJnZXQsIHZhcnMsIG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fdHJhbnNmb3JtVHlwZSkge1xuXHRcdFx0XHR0aHJlZUQgPSAodGhpcy5fdHJhbnNmb3JtVHlwZSA9PT0gMyk7XG5cdFx0XHRcdGlmICghX3RyYW5zZm9ybVByb3ApIHtcblx0XHRcdFx0XHRzdHlsZS56b29tID0gMTsgLy9oZWxwcyBjb3JyZWN0IGFuIElFIGlzc3VlLlxuXHRcdFx0XHR9IGVsc2UgaWYgKF9pc1NhZmFyaSkge1xuXHRcdFx0XHRcdF9yZXFTYWZhcmlGaXggPSB0cnVlO1xuXHRcdFx0XHRcdC8vaWYgekluZGV4IGlzbid0IHNldCwgaU9TIFNhZmFyaSBkb2Vzbid0IHJlcGFpbnQgdGhpbmdzIGNvcnJlY3RseSBzb21ldGltZXMgKHNlZW1pbmdseSBhdCByYW5kb20pLlxuXHRcdFx0XHRcdGlmIChzdHlsZS56SW5kZXggPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdHpJbmRleCA9IF9nZXRTdHlsZSh0YXJnZXQsIFwiekluZGV4XCIsIF9jcyk7XG5cdFx0XHRcdFx0XHRpZiAoekluZGV4ID09PSBcImF1dG9cIiB8fCB6SW5kZXggPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkTGF6eVNldChzdHlsZSwgXCJ6SW5kZXhcIiwgMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vU2V0dGluZyBXZWJraXRCYWNrZmFjZVZpc2liaWxpdHkgY29ycmVjdHMgMyBidWdzOlxuXHRcdFx0XHRcdC8vIDEpIFtub24tQW5kcm9pZF0gU2FmYXJpIHNraXBzIHJlbmRlcmluZyBjaGFuZ2VzIHRvIFwidG9wXCIgYW5kIFwibGVmdFwiIHRoYXQgYXJlIG1hZGUgb24gdGhlIHNhbWUgZnJhbWUvcmVuZGVyIGFzIGEgdHJhbnNmb3JtIHVwZGF0ZS5cblx0XHRcdFx0XHQvLyAyKSBpT1MgU2FmYXJpIHNvbWV0aW1lcyBuZWdsZWN0cyB0byByZXBhaW50IGVsZW1lbnRzIGluIHRoZWlyIG5ldyBwb3NpdGlvbnMuIFNldHRpbmcgXCJXZWJraXRQZXJzcGVjdGl2ZVwiIHRvIGEgbm9uLXplcm8gdmFsdWUgd29ya2VkIHRvbyBleGNlcHQgdGhhdCBvbiBpT1MgU2FmYXJpIHRoaW5ncyB3b3VsZCBmbGlja2VyIHJhbmRvbWx5LlxuXHRcdFx0XHRcdC8vIDMpIFNhZmFyaSBzb21ldGltZXMgZGlzcGxheWVkIG9kZCBhcnRpZmFjdHMgd2hlbiB0d2VlbmluZyB0aGUgdHJhbnNmb3JtIChvciBXZWJraXRUcmFuc2Zvcm0pIHByb3BlcnR5LCBsaWtlIGdob3N0cyBvZiB0aGUgZWRnZXMgb2YgdGhlIGVsZW1lbnQgcmVtYWluZWQuIERlZmluaXRlbHkgYSBicm93c2VyIGJ1Zy5cblx0XHRcdFx0XHQvL05vdGU6IHdlIGFsbG93IHRoZSB1c2VyIHRvIG92ZXJyaWRlIHRoZSBhdXRvLXNldHRpbmcgYnkgZGVmaW5pbmcgV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5IGluIHRoZSB2YXJzIG9mIHRoZSB0d2Vlbi5cblx0XHRcdFx0XHRpZiAoX2lzU2FmYXJpTFQ2KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9hZGRMYXp5U2V0KHN0eWxlLCBcIldlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eVwiLCB0aGlzLl92YXJzLldlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eSB8fCAodGhyZWVEID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHB0MiA9IHB0O1xuXHRcdFx0XHR3aGlsZSAocHQyICYmIHB0Mi5fbmV4dCkge1xuXHRcdFx0XHRcdHB0MiA9IHB0Mi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHRhcmdldCwgXCJ0cmFuc2Zvcm1cIiwgMCwgMCwgbnVsbCwgMik7XG5cdFx0XHRcdHRoaXMuX2xpbmtDU1NQKHRwdCwgbnVsbCwgcHQyKTtcblx0XHRcdFx0dHB0LnNldFJhdGlvID0gX3RyYW5zZm9ybVByb3AgPyBfc2V0VHJhbnNmb3JtUmF0aW8gOiBfc2V0SUVUcmFuc2Zvcm1SYXRpbztcblx0XHRcdFx0dHB0LmRhdGEgPSB0aGlzLl90cmFuc2Zvcm0gfHwgX2dldFRyYW5zZm9ybSh0YXJnZXQsIF9jcywgdHJ1ZSk7XG5cdFx0XHRcdHRwdC50d2VlbiA9IHR3ZWVuO1xuXHRcdFx0XHR0cHQucHIgPSAtMTsgLy9lbnN1cmVzIHRoYXQgdGhlIHRyYW5zZm9ybXMgZ2V0IGFwcGxpZWQgYWZ0ZXIgdGhlIGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQuXG5cdFx0XHRcdF9vdmVyd3JpdGVQcm9wcy5wb3AoKTsgLy93ZSBkb24ndCB3YW50IHRvIGZvcmNlIHRoZSBvdmVyd3JpdGUgb2YgYWxsIFwidHJhbnNmb3JtXCIgdHdlZW5zIG9mIHRoZSB0YXJnZXQgLSB3ZSBvbmx5IGNhcmUgYWJvdXQgaW5kaXZpZHVhbCB0cmFuc2Zvcm0gcHJvcGVydGllcyBsaWtlIHNjYWxlWCwgcm90YXRpb24sIGV0Yy4gVGhlIENTU1Byb3BUd2VlbiBjb25zdHJ1Y3RvciBhdXRvbWF0aWNhbGx5IGFkZHMgdGhlIHByb3BlcnR5IHRvIF9vdmVyd3JpdGVQcm9wcyB3aGljaCBpcyB3aHkgd2UgbmVlZCB0byBwb3AoKSBoZXJlLlxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoX2hhc1ByaW9yaXR5KSB7XG5cdFx0XHRcdC8vcmVvcmRlcnMgdGhlIGxpbmtlZCBsaXN0IGluIG9yZGVyIG9mIHByIChwcmlvcml0eSlcblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0bmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdHB0MiA9IGZpcnN0O1xuXHRcdFx0XHRcdHdoaWxlIChwdDIgJiYgcHQyLnByID4gcHQucHIpIHtcblx0XHRcdFx0XHRcdHB0MiA9IHB0Mi5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKChwdC5fcHJldiA9IHB0MiA/IHB0Mi5fcHJldiA6IGxhc3QpKSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gcHQyKSkge1xuXHRcdFx0XHRcdFx0cHQyLl9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxhc3QgPSBwdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBmaXJzdDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cblxuXHRcdHAucGFyc2UgPSBmdW5jdGlvbih0YXJnZXQsIHZhcnMsIHB0LCBwbHVnaW4pIHtcblx0XHRcdHZhciBzdHlsZSA9IHRhcmdldC5zdHlsZSxcblx0XHRcdFx0cCwgc3AsIGJuLCBlbiwgYnMsIGVzLCBic2Z4LCBlc2Z4LCBpc1N0ciwgcmVsO1xuXHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0ZXMgPSB2YXJzW3BdOyAvL2VuZGluZyB2YWx1ZSBzdHJpbmdcblx0XHRcdFx0aWYgKHR5cGVvZihlcykgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdGVzID0gZXMoX2luZGV4LCBfdGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzcCA9IF9zcGVjaWFsUHJvcHNbcF07IC8vU3BlY2lhbFByb3AgbG9va3VwLlxuXHRcdFx0XHRpZiAoc3ApIHtcblx0XHRcdFx0XHRwdCA9IHNwLnBhcnNlKHRhcmdldCwgZXMsIHAsIHRoaXMsIHB0LCBwbHVnaW4sIHZhcnMpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YnMgPSBfZ2V0U3R5bGUodGFyZ2V0LCBwLCBfY3MpICsgXCJcIjtcblx0XHRcdFx0XHRpc1N0ciA9ICh0eXBlb2YoZXMpID09PSBcInN0cmluZ1wiKTtcblx0XHRcdFx0XHRpZiAocCA9PT0gXCJjb2xvclwiIHx8IHAgPT09IFwiZmlsbFwiIHx8IHAgPT09IFwic3Ryb2tlXCIgfHwgcC5pbmRleE9mKFwiQ29sb3JcIikgIT09IC0xIHx8IChpc1N0ciAmJiBfcmdiaHNsRXhwLnRlc3QoZXMpKSkgeyAvL09wZXJhIHVzZXMgYmFja2dyb3VuZDogdG8gZGVmaW5lIGNvbG9yIHNvbWV0aW1lcyBpbiBhZGRpdGlvbiB0byBiYWNrZ3JvdW5kQ29sb3I6XG5cdFx0XHRcdFx0XHRpZiAoIWlzU3RyKSB7XG5cdFx0XHRcdFx0XHRcdGVzID0gX3BhcnNlQ29sb3IoZXMpO1xuXHRcdFx0XHRcdFx0XHRlcyA9ICgoZXMubGVuZ3RoID4gMykgPyBcInJnYmEoXCIgOiBcInJnYihcIikgKyBlcy5qb2luKFwiLFwiKSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cHQgPSBfcGFyc2VDb21wbGV4KHN0eWxlLCBwLCBicywgZXMsIHRydWUsIFwidHJhbnNwYXJlbnRcIiwgcHQsIDAsIHBsdWdpbik7XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGlzU3RyICYmIF9jb21wbGV4RXhwLnRlc3QoZXMpKSB7XG5cdFx0XHRcdFx0XHRwdCA9IF9wYXJzZUNvbXBsZXgoc3R5bGUsIHAsIGJzLCBlcywgdHJ1ZSwgbnVsbCwgcHQsIDAsIHBsdWdpbik7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ym4gPSBwYXJzZUZsb2F0KGJzKTtcblx0XHRcdFx0XHRcdGJzZnggPSAoYm4gfHwgYm4gPT09IDApID8gYnMuc3Vic3RyKChibiArIFwiXCIpLmxlbmd0aCkgOiBcIlwiOyAvL3JlbWVtYmVyLCBicyBjb3VsZCBiZSBub24tbnVtZXJpYyBsaWtlIFwibm9ybWFsXCIgZm9yIGZvbnRXZWlnaHQsIHNvIHdlIHNob3VsZCBkZWZhdWx0IHRvIGEgYmxhbmsgc3VmZml4IGluIHRoYXQgY2FzZS5cblxuXHRcdFx0XHRcdFx0aWYgKGJzID09PSBcIlwiIHx8IGJzID09PSBcImF1dG9cIikge1xuXHRcdFx0XHRcdFx0XHRpZiAocCA9PT0gXCJ3aWR0aFwiIHx8IHAgPT09IFwiaGVpZ2h0XCIpIHtcblx0XHRcdFx0XHRcdFx0XHRibiA9IF9nZXREaW1lbnNpb24odGFyZ2V0LCBwLCBfY3MpO1xuXHRcdFx0XHRcdFx0XHRcdGJzZnggPSBcInB4XCI7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocCA9PT0gXCJsZWZ0XCIgfHwgcCA9PT0gXCJ0b3BcIikge1xuXHRcdFx0XHRcdFx0XHRcdGJuID0gX2NhbGN1bGF0ZU9mZnNldCh0YXJnZXQsIHAsIF9jcyk7XG5cdFx0XHRcdFx0XHRcdFx0YnNmeCA9IFwicHhcIjtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRibiA9IChwICE9PSBcIm9wYWNpdHlcIikgPyAwIDogMTtcblx0XHRcdFx0XHRcdFx0XHRic2Z4ID0gXCJcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZWwgPSAoaXNTdHIgJiYgZXMuY2hhckF0KDEpID09PSBcIj1cIik7XG5cdFx0XHRcdFx0XHRpZiAocmVsKSB7XG5cdFx0XHRcdFx0XHRcdGVuID0gcGFyc2VJbnQoZXMuY2hhckF0KDApICsgXCIxXCIsIDEwKTtcblx0XHRcdFx0XHRcdFx0ZXMgPSBlcy5zdWJzdHIoMik7XG5cdFx0XHRcdFx0XHRcdGVuICo9IHBhcnNlRmxvYXQoZXMpO1xuXHRcdFx0XHRcdFx0XHRlc2Z4ID0gZXMucmVwbGFjZShfc3VmZml4RXhwLCBcIlwiKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGVuID0gcGFyc2VGbG9hdChlcyk7XG5cdFx0XHRcdFx0XHRcdGVzZnggPSBpc1N0ciA/IGVzLnJlcGxhY2UoX3N1ZmZpeEV4cCwgXCJcIikgOiBcIlwiO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoZXNmeCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRlc2Z4ID0gKHAgaW4gX3N1ZmZpeE1hcCkgPyBfc3VmZml4TWFwW3BdIDogYnNmeDsgLy9wb3B1bGF0ZSB0aGUgZW5kIHN1ZmZpeCwgcHJpb3JpdGl6aW5nIHRoZSBtYXAsIHRoZW4gaWYgbm9uZSBpcyBmb3VuZCwgdXNlIHRoZSBiZWdpbm5pbmcgc3VmZml4LlxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRlcyA9IChlbiB8fCBlbiA9PT0gMCkgPyAocmVsID8gZW4gKyBibiA6IGVuKSArIGVzZnggOiB2YXJzW3BdOyAvL2Vuc3VyZXMgdGhhdCBhbnkgKz0gb3IgLT0gcHJlZml4ZXMgYXJlIHRha2VuIGNhcmUgb2YuIFJlY29yZCB0aGUgZW5kIHZhbHVlIGJlZm9yZSBub3JtYWxpemluZyB0aGUgc3VmZml4IGJlY2F1c2Ugd2UgYWx3YXlzIHdhbnQgdG8gZW5kIHRoZSB0d2VlbiBvbiBleGFjdGx5IHdoYXQgdGhleSBpbnRlbmRlZCBldmVuIGlmIGl0IGRvZXNuJ3QgbWF0Y2ggdGhlIGJlZ2lubmluZyB2YWx1ZSdzIHN1ZmZpeC5cblxuXHRcdFx0XHRcdFx0Ly9pZiB0aGUgYmVnaW5uaW5nL2VuZGluZyBzdWZmaXhlcyBkb24ndCBtYXRjaCwgbm9ybWFsaXplIHRoZW0uLi5cblx0XHRcdFx0XHRcdGlmIChic2Z4ICE9PSBlc2Z4KSBpZiAoZXNmeCAhPT0gXCJcIikgaWYgKGVuIHx8IGVuID09PSAwKSBpZiAoYm4pIHsgLy9ub3RlOiBpZiB0aGUgYmVnaW5uaW5nIHZhbHVlIChibikgaXMgMCwgd2UgZG9uJ3QgbmVlZCB0byBjb252ZXJ0IHVuaXRzIVxuXHRcdFx0XHRcdFx0XHRibiA9IF9jb252ZXJ0VG9QaXhlbHModGFyZ2V0LCBwLCBibiwgYnNmeCk7XG5cdFx0XHRcdFx0XHRcdGlmIChlc2Z4ID09PSBcIiVcIikge1xuXHRcdFx0XHRcdFx0XHRcdGJuIC89IF9jb252ZXJ0VG9QaXhlbHModGFyZ2V0LCBwLCAxMDAsIFwiJVwiKSAvIDEwMDtcblx0XHRcdFx0XHRcdFx0XHRpZiAodmFycy5zdHJpY3RVbml0cyAhPT0gdHJ1ZSkgeyAvL3NvbWUgYnJvd3NlcnMgcmVwb3J0IG9ubHkgXCJweFwiIHZhbHVlcyBpbnN0ZWFkIG9mIGFsbG93aW5nIFwiJVwiIHdpdGggZ2V0Q29tcHV0ZWRTdHlsZSgpLCBzbyB3ZSBhc3N1bWUgdGhhdCBpZiB3ZSdyZSB0d2VlbmluZyB0byBhICUsIHdlIHNob3VsZCBzdGFydCB0aGVyZSB0b28gdW5sZXNzIHN0cmljdFVuaXRzOnRydWUgaXMgZGVmaW5lZC4gVGhpcyBhcHByb2FjaCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciByZXNwb25zaXZlIGRlc2lnbnMgdGhhdCB1c2UgZnJvbSgpIHR3ZWVucy5cblx0XHRcdFx0XHRcdFx0XHRcdGJzID0gYm4gKyBcIiVcIjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChlc2Z4ID09PSBcImVtXCIgfHwgZXNmeCA9PT0gXCJyZW1cIiB8fCBlc2Z4ID09PSBcInZ3XCIgfHwgZXNmeCA9PT0gXCJ2aFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gLz0gX2NvbnZlcnRUb1BpeGVscyh0YXJnZXQsIHAsIDEsIGVzZngpO1xuXG5cdFx0XHRcdFx0XHRcdC8vb3RoZXJ3aXNlIGNvbnZlcnQgdG8gcGl4ZWxzLlxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVzZnggIT09IFwicHhcIikge1xuXHRcdFx0XHRcdFx0XHRcdGVuID0gX2NvbnZlcnRUb1BpeGVscyh0YXJnZXQsIHAsIGVuLCBlc2Z4KTtcblx0XHRcdFx0XHRcdFx0XHRlc2Z4ID0gXCJweFwiOyAvL3dlIGRvbid0IHVzZSBic2Z4IGFmdGVyIHRoaXMsIHNvIHdlIGRvbid0IG5lZWQgdG8gc2V0IGl0IHRvIHB4IHRvby5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAocmVsKSBpZiAoZW4gfHwgZW4gPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRlcyA9IChlbiArIGJuKSArIGVzZng7IC8vdGhlIGNoYW5nZXMgd2UgbWFkZSBhZmZlY3QgcmVsYXRpdmUgY2FsY3VsYXRpb25zLCBzbyBhZGp1c3QgdGhlIGVuZCB2YWx1ZSBoZXJlLlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChyZWwpIHtcblx0XHRcdFx0XHRcdFx0ZW4gKz0gYm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICgoYm4gfHwgYm4gPT09IDApICYmIChlbiB8fCBlbiA9PT0gMCkpIHsgLy9mYXN0ZXIgdGhhbiBpc05hTigpLiBBbHNvLCBwcmV2aW91c2x5IHdlIHJlcXVpcmVkIGVuICE9PSBibiBidXQgdGhhdCBkb2Vzbid0IHJlYWxseSBnYWluIG11Y2ggcGVyZm9ybWFuY2UgYW5kIGl0IHByZXZlbnRzIF9wYXJzZVRvUHJveHkoKSBmcm9tIHdvcmtpbmcgcHJvcGVybHkgaWYgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIG1hdGNoIGJ1dCBuZWVkIHRvIGdldCB0d2VlbmVkIGJ5IGFuIGV4dGVybmFsIHBsdWdpbiBhbnl3YXkuIEZvciBleGFtcGxlLCBhIGJlemllciB0d2VlbiB3aGVyZSB0aGUgdGFyZ2V0IHN0YXJ0cyBhdCBsZWZ0OjAgYW5kIGhhcyB0aGVzZSBwb2ludHM6IFt7bGVmdDo1MH0se2xlZnQ6MH1dIHdvdWxkbid0IHdvcmsgcHJvcGVybHkgYmVjYXVzZSB3aGVuIHBhcnNpbmcgdGhlIGxhc3QgcG9pbnQsIGl0J2QgbWF0Y2ggdGhlIGZpcnN0IChjdXJyZW50KSBvbmUgYW5kIGEgbm9uLXR3ZWVuaW5nIENTU1Byb3BUd2VlbiB3b3VsZCBiZSByZWNvcmRlZCB3aGVuIHdlIGFjdHVhbGx5IG5lZWQgYSBub3JtYWwgdHdlZW4gKHR5cGU6MCkgc28gdGhhdCB0aGluZ3MgZ2V0IHVwZGF0ZWQgZHVyaW5nIHRoZSB0d2VlbiBwcm9wZXJseS5cblx0XHRcdFx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHN0eWxlLCBwLCBibiwgZW4gLSBibiwgcHQsIDAsIHAsIChfYXV0b1JvdW5kICE9PSBmYWxzZSAmJiAoZXNmeCA9PT0gXCJweFwiIHx8IHAgPT09IFwiekluZGV4XCIpKSwgMCwgYnMsIGVzKTtcblx0XHRcdFx0XHRcdFx0cHQueHMwID0gZXNmeDtcblx0XHRcdFx0XHRcdFx0Ly9ERUJVRzogX2xvZyhcInR3ZWVuIFwiK3ArXCIgZnJvbSBcIitwdC5iK1wiIChcIitibitlc2Z4K1wiKSB0byBcIitwdC5lK1wiIHdpdGggc3VmZml4OiBcIitwdC54czApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzdHlsZVtwXSA9PT0gdW5kZWZpbmVkIHx8ICFlcyAmJiAoZXMgKyBcIlwiID09PSBcIk5hTlwiIHx8IGVzID09IG51bGwpKSB7XG5cdFx0XHRcdFx0XHRcdF9sb2coXCJpbnZhbGlkIFwiICsgcCArIFwiIHR3ZWVuIHZhbHVlOiBcIiArIHZhcnNbcF0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHN0eWxlLCBwLCBlbiB8fCBibiB8fCAwLCAwLCBwdCwgLTEsIHAsIGZhbHNlLCAwLCBicywgZXMpO1xuXHRcdFx0XHRcdFx0XHRwdC54czAgPSAoZXMgPT09IFwibm9uZVwiICYmIChwID09PSBcImRpc3BsYXlcIiB8fCBwLmluZGV4T2YoXCJTdHlsZVwiKSAhPT0gLTEpKSA/IGJzIDogZXM7IC8vaW50ZXJtZWRpYXRlIHZhbHVlIHNob3VsZCB0eXBpY2FsbHkgYmUgc2V0IGltbWVkaWF0ZWx5IChlbmQgdmFsdWUpIGV4Y2VwdCBmb3IgXCJkaXNwbGF5XCIgb3IgdGhpbmdzIGxpa2UgYm9yZGVyVG9wU3R5bGUsIGJvcmRlckJvdHRvbVN0eWxlLCBldGMuIHdoaWNoIHNob3VsZCB1c2UgdGhlIGJlZ2lubmluZyB2YWx1ZSBkdXJpbmcgdGhlIHR3ZWVuLlxuXHRcdFx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwibm9uLXR3ZWVuaW5nIHZhbHVlIFwiK3ArXCI6IFwiK3B0LnhzMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwbHVnaW4pIGlmIChwdCAmJiAhcHQucGx1Z2luKSB7XG5cdFx0XHRcdFx0cHQucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fTtcblxuXG5cdFx0Ly9nZXRzIGNhbGxlZCBldmVyeSB0aW1lIHRoZSB0d2VlbiB1cGRhdGVzLCBwYXNzaW5nIHRoZSBuZXcgcmF0aW8gKHR5cGljYWxseSBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgYnV0IG5vdCBhbHdheXMgKGZvciBleGFtcGxlLCBpZiBhbiBFbGFzdGljLmVhc2VPdXQgaXMgdXNlZCwgdGhlIHZhbHVlIGNhbiBqdW1wIGFib3ZlIDEgbWlkLXR3ZWVuKS4gSXQgd2lsbCBhbHdheXMgc3RhcnQgYW5kIDAgYW5kIGVuZCBhdCAxLlxuXHRcdHAuc2V0UmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHR2YXIgcHQgPSB0aGlzLl9maXJzdFBULFxuXHRcdFx0XHRtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0dmFsLCBzdHIsIGk7XG5cdFx0XHQvL2F0IHRoZSBlbmQgb2YgdGhlIHR3ZWVuLCB3ZSBzZXQgdGhlIHZhbHVlcyB0byBleGFjdGx5IHdoYXQgd2UgcmVjZWl2ZWQgaW4gb3JkZXIgdG8gbWFrZSBzdXJlIG5vbi10d2VlbmluZyB2YWx1ZXMgKGxpa2UgXCJwb3NpdGlvblwiIG9yIFwiZmxvYXRcIiBvciB3aGF0ZXZlcikgYXJlIHNldCBhbmQgc28gdGhhdCBpZiB0aGUgYmVnaW5uaW5nL2VuZGluZyBzdWZmaXhlcyAodW5pdHMpIGRpZG4ndCBtYXRjaCBhbmQgd2Ugbm9ybWFsaXplZCB0byBweCwgdGhlIHZhbHVlIHRoYXQgdGhlIHVzZXIgcGFzc2VkIGluIGlzIHVzZWQgaGVyZS4gV2UgY2hlY2sgdG8gc2VlIGlmIHRoZSB0d2VlbiBpcyBhdCBpdHMgYmVnaW5uaW5nIGluIGNhc2UgaXQncyBhIGZyb20oKSB0d2VlbiBpbiB3aGljaCBjYXNlIHRoZSByYXRpbyB3aWxsIGFjdHVhbGx5IGdvIGZyb20gMSB0byAwIG92ZXIgdGhlIGNvdXJzZSBvZiB0aGUgdHdlZW4gKGJhY2t3YXJkcykuXG5cdFx0XHRpZiAodiA9PT0gMSAmJiAodGhpcy5fdHdlZW4uX3RpbWUgPT09IHRoaXMuX3R3ZWVuLl9kdXJhdGlvbiB8fCB0aGlzLl90d2Vlbi5fdGltZSA9PT0gMCkpIHtcblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0aWYgKHB0LnR5cGUgIT09IDIpIHtcblx0XHRcdFx0XHRcdGlmIChwdC5yICYmIHB0LnR5cGUgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHZhbCA9IE1hdGgucm91bmQocHQucyArIHB0LmMpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIXB0LnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gdmFsICsgcHQueHMwO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LnR5cGUgPT09IDEpIHsgLy9jb21wbGV4IHZhbHVlIChvbmUgdGhhdCB0eXBpY2FsbHkgaGFzIG11bHRpcGxlIG51bWJlcnMgaW5zaWRlIGEgc3RyaW5nLCBsaWtlIFwicmVjdCg1cHgsMTBweCwyMHB4LDI1cHgpXCJcblx0XHRcdFx0XHRcdFx0XHRpID0gcHQubDtcblx0XHRcdFx0XHRcdFx0XHRzdHIgPSBwdC54czAgKyB2YWwgKyBwdC54czE7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMTsgaSA8IHB0Lmw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3RyICs9IHB0W1wieG5cIitpXSArIHB0W1wieHNcIisoaSsxKV07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBzdHI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC5lO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwdC5zZXRSYXRpbyh2KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKHYgfHwgISh0aGlzLl90d2Vlbi5fdGltZSA9PT0gdGhpcy5fdHdlZW4uX2R1cmF0aW9uIHx8IHRoaXMuX3R3ZWVuLl90aW1lID09PSAwKSB8fCB0aGlzLl90d2Vlbi5fcmF3UHJldlRpbWUgPT09IC0wLjAwMDAwMSkge1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHR2YWwgPSBwdC5jICogdiArIHB0LnM7XG5cdFx0XHRcdFx0aWYgKHB0LnIpIHtcblx0XHRcdFx0XHRcdHZhbCA9IE1hdGgucm91bmQodmFsKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHZhbCA8IG1pbikgaWYgKHZhbCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdHZhbCA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghcHQudHlwZSkge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHZhbCArIHB0LnhzMDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LnR5cGUgPT09IDEpIHsgLy9jb21wbGV4IHZhbHVlIChvbmUgdGhhdCB0eXBpY2FsbHkgaGFzIG11bHRpcGxlIG51bWJlcnMgaW5zaWRlIGEgc3RyaW5nLCBsaWtlIFwicmVjdCg1cHgsMTBweCwyMHB4LDI1cHgpXCJcblx0XHRcdFx0XHRcdGkgPSBwdC5sO1xuXHRcdFx0XHRcdFx0aWYgKGkgPT09IDIpIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LnhzMCArIHZhbCArIHB0LnhzMSArIHB0LnhuMSArIHB0LnhzMjtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaSA9PT0gMykge1xuXHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwICsgdmFsICsgcHQueHMxICsgcHQueG4xICsgcHQueHMyICsgcHQueG4yICsgcHQueHMzO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpID09PSA0KSB7XG5cdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC54czAgKyB2YWwgKyBwdC54czEgKyBwdC54bjEgKyBwdC54czIgKyBwdC54bjIgKyBwdC54czMgKyBwdC54bjMgKyBwdC54czQ7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGkgPT09IDUpIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LnhzMCArIHZhbCArIHB0LnhzMSArIHB0LnhuMSArIHB0LnhzMiArIHB0LnhuMiArIHB0LnhzMyArIHB0LnhuMyArIHB0LnhzNCArIHB0LnhuNCArIHB0LnhzNTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHN0ciA9IHB0LnhzMCArIHZhbCArIHB0LnhzMTtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMTsgaSA8IHB0Lmw7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdHN0ciArPSBwdFtcInhuXCIraV0gKyBwdFtcInhzXCIrKGkrMSldO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBzdHI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LnR5cGUgPT09IC0xKSB7IC8vbm9uLXR3ZWVuaW5nIHZhbHVlXG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwO1xuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwdC5zZXRSYXRpbykgeyAvL2N1c3RvbSBzZXRSYXRpbygpIGZvciB0aGluZ3MgbGlrZSBTcGVjaWFsUHJvcHMsIGV4dGVybmFsIHBsdWdpbnMsIGV0Yy5cblx0XHRcdFx0XHRcdHB0LnNldFJhdGlvKHYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cblx0XHRcdC8vaWYgdGhlIHR3ZWVuIGlzIHJldmVyc2VkIGFsbCB0aGUgd2F5IGJhY2sgdG8gdGhlIGJlZ2lubmluZywgd2UgbmVlZCB0byByZXN0b3JlIHRoZSBvcmlnaW5hbCB2YWx1ZXMgd2hpY2ggbWF5IGhhdmUgZGlmZmVyZW50IHVuaXRzIChsaWtlICUgaW5zdGVhZCBvZiBweCBvciBlbSBvciB3aGF0ZXZlcikuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRpZiAocHQudHlwZSAhPT0gMikge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0LnNldFJhdGlvKHYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogRm9yY2VzIHJlbmRlcmluZyBvZiB0aGUgdGFyZ2V0J3MgdHJhbnNmb3JtcyAocm90YXRpb24sIHNjYWxlLCBldGMuKSB3aGVuZXZlciB0aGUgQ1NTUGx1Z2luJ3Mgc2V0UmF0aW8oKSBpcyBjYWxsZWQuXG5cdFx0ICogQmFzaWNhbGx5LCB0aGlzIHRlbGxzIHRoZSBDU1NQbHVnaW4gdG8gY3JlYXRlIGEgQ1NTUHJvcFR3ZWVuICh0eXBlIDIpIGFmdGVyIGluc3RhbnRpYXRpb24gdGhhdCBydW5zIGxhc3QgaW4gdGhlIGxpbmtlZFxuXHRcdCAqIGxpc3QgYW5kIGNhbGxzIHRoZSBhcHByb3ByaWF0ZSAoM0Qgb3IgMkQpIHJlbmRlcmluZyBmdW5jdGlvbi4gV2Ugc2VwYXJhdGUgdGhpcyBpbnRvIGl0cyBvd24gbWV0aG9kIHNvIHRoYXQgd2UgY2FuIGNhbGxcblx0XHQgKiBpdCBmcm9tIG90aGVyIHBsdWdpbnMgbGlrZSBCZXppZXJQbHVnaW4gaWYsIGZvciBleGFtcGxlLCBpdCBuZWVkcyB0byBhcHBseSBhbiBhdXRvUm90YXRpb24gYW5kIHRoaXMgQ1NTUGx1Z2luXG5cdFx0ICogZG9lc24ndCBoYXZlIGFueSB0cmFuc2Zvcm0tcmVsYXRlZCBwcm9wZXJ0aWVzIG9mIGl0cyBvd24uIFlvdSBjYW4gY2FsbCB0aGlzIG1ldGhvZCBhcyBtYW55IHRpbWVzIGFzIHlvdVxuXHRcdCAqIHdhbnQgYW5kIGl0IHdvbid0IGNyZWF0ZSBkdXBsaWNhdGUgQ1NTUHJvcFR3ZWVucy5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbn0gdGhyZWVEIGlmIHRydWUsIGl0IHNob3VsZCBhcHBseSAzRCB0d2VlbnMgKG90aGVyd2lzZSwganVzdCAyRCBvbmVzIGFyZSBmaW5lIGFuZCB0eXBpY2FsbHkgZmFzdGVyKVxuXHRcdCAqL1xuXHRcdHAuX2VuYWJsZVRyYW5zZm9ybXMgPSBmdW5jdGlvbih0aHJlZUQpIHtcblx0XHRcdHRoaXMuX3RyYW5zZm9ybSA9IHRoaXMuX3RyYW5zZm9ybSB8fCBfZ2V0VHJhbnNmb3JtKHRoaXMuX3RhcmdldCwgX2NzLCB0cnVlKTsgLy9lbnN1cmVzIHRoYXQgdGhlIGVsZW1lbnQgaGFzIGEgX2dzVHJhbnNmb3JtIHByb3BlcnR5IHdpdGggdGhlIGFwcHJvcHJpYXRlIHZhbHVlcy5cblx0XHRcdHRoaXMuX3RyYW5zZm9ybVR5cGUgPSAoISh0aGlzLl90cmFuc2Zvcm0uc3ZnICYmIF91c2VTVkdUcmFuc2Zvcm1BdHRyKSAmJiAodGhyZWVEIHx8IHRoaXMuX3RyYW5zZm9ybVR5cGUgPT09IDMpKSA/IDMgOiAyO1xuXHRcdH07XG5cblx0XHR2YXIgbGF6eVNldCA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdHRoaXMudFt0aGlzLnBdID0gdGhpcy5lO1xuXHRcdFx0dGhpcy5kYXRhLl9saW5rQ1NTUCh0aGlzLCB0aGlzLl9uZXh0LCBudWxsLCB0cnVlKTsgLy93ZSBwdXJwb3NlZnVsbHkga2VlcCB0aGlzLl9uZXh0IGV2ZW4gdGhvdWdoIGl0J2QgbWFrZSBzZW5zZSB0byBudWxsIGl0LCBidXQgdGhpcyBpcyBhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbiwgYXMgdGhpcyBoYXBwZW5zIGR1cmluZyB0aGUgd2hpbGUgKHB0KSB7fSBsb29wIGluIHNldFJhdGlvKCkgYXQgdGhlIGJvdHRvbSBvZiB3aGljaCBpdCBzZXRzIHB0ID0gcHQuX25leHQsIHNvIGlmIHdlIG51bGwgaXQsIHRoZSBsaW5rZWQgbGlzdCB3aWxsIGJlIGJyb2tlbiBpbiB0aGF0IGxvb3AuXG5cdFx0fTtcblx0XHQvKiogQHByaXZhdGUgR2l2ZXMgdXMgYSB3YXkgdG8gc2V0IGEgdmFsdWUgb24gdGhlIGZpcnN0IHJlbmRlciAoYW5kIG9ubHkgdGhlIGZpcnN0IHJlbmRlcikuICoqL1xuXHRcdHAuX2FkZExhenlTZXQgPSBmdW5jdGlvbih0LCBwLCB2KSB7XG5cdFx0XHR2YXIgcHQgPSB0aGlzLl9maXJzdFBUID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCB0aGlzLl9maXJzdFBULCAyKTtcblx0XHRcdHB0LmUgPSB2O1xuXHRcdFx0cHQuc2V0UmF0aW8gPSBsYXp5U2V0O1xuXHRcdFx0cHQuZGF0YSA9IHRoaXM7XG5cdFx0fTtcblxuXHRcdC8qKiBAcHJpdmF0ZSAqKi9cblx0XHRwLl9saW5rQ1NTUCA9IGZ1bmN0aW9uKHB0LCBuZXh0LCBwcmV2LCByZW1vdmUpIHtcblx0XHRcdGlmIChwdCkge1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdG5leHQuX3ByZXYgPSBwdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHQuX25leHQpIHtcblx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0Ll9wcmV2O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwdC5fcHJldikge1xuXHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fZmlyc3RQVCA9PT0gcHQpIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0cmVtb3ZlID0gdHJ1ZTsgLy9qdXN0IHRvIHByZXZlbnQgcmVzZXR0aW5nIHRoaXMuX2ZpcnN0UFQgNSBsaW5lcyBkb3duIGluIGNhc2UgcHQuX25leHQgaXMgbnVsbC4gKG9wdGltaXplZCBmb3Igc3BlZWQpXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHByZXYpIHtcblx0XHRcdFx0XHRwcmV2Ll9uZXh0ID0gcHQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIXJlbW92ZSAmJiB0aGlzLl9maXJzdFBUID09PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0Ll9uZXh0ID0gbmV4dDtcblx0XHRcdFx0cHQuX3ByZXYgPSBwcmV2O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH07XG5cblx0XHRwLl9tb2QgPSBmdW5jdGlvbihsb29rdXApIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKHR5cGVvZihsb29rdXBbcHQucF0pID09PSBcImZ1bmN0aW9uXCIgJiYgbG9va3VwW3B0LnBdID09PSBNYXRoLnJvdW5kKSB7IC8vb25seSBnZXRzIGNhbGxlZCBieSBSb3VuZFByb3BzUGx1Z2luIChNb2RpZnlQbHVnaW4gbWFuYWdlcyBhbGwgdGhlIHJlbmRlcmluZyBpbnRlcm5hbGx5IGZvciBDU1NQbHVnaW4gcHJvcGVydGllcyB0aGF0IG5lZWQgbW9kaWZpY2F0aW9uKS4gUmVtZW1iZXIsIHdlIGhhbmRsZSByb3VuZGluZyBhIGJpdCBkaWZmZXJlbnRseSBpbiB0aGlzIHBsdWdpbiBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgbGV2ZXJhZ2luZyBcInJcIiBhcyBhbiBpbmRpY2F0b3IgdGhhdCB0aGUgdmFsdWUgc2hvdWxkIGJlIHJvdW5kZWQgaW50ZXJuYWxseS4uXG5cdFx0XHRcdFx0cHQuciA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly93ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGlmIGFscGhhIG9yIGF1dG9BbHBoYSBpcyBraWxsZWQsIG9wYWNpdHkgaXMgdG9vLiBBbmQgYXV0b0FscGhhIGFmZmVjdHMgdGhlIFwidmlzaWJpbGl0eVwiIHByb3BlcnR5LlxuXHRcdHAuX2tpbGwgPSBmdW5jdGlvbihsb29rdXApIHtcblx0XHRcdHZhciBjb3B5ID0gbG9va3VwLFxuXHRcdFx0XHRwdCwgcCwgeGZpcnN0O1xuXHRcdFx0aWYgKGxvb2t1cC5hdXRvQWxwaGEgfHwgbG9va3VwLmFscGhhKSB7XG5cdFx0XHRcdGNvcHkgPSB7fTtcblx0XHRcdFx0Zm9yIChwIGluIGxvb2t1cCkgeyAvL2NvcHkgdGhlIGxvb2t1cCBzbyB0aGF0IHdlJ3JlIG5vdCBjaGFuZ2luZyB0aGUgb3JpZ2luYWwgd2hpY2ggbWF5IGJlIHBhc3NlZCBlbHNld2hlcmUuXG5cdFx0XHRcdFx0Y29weVtwXSA9IGxvb2t1cFtwXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb3B5Lm9wYWNpdHkgPSAxO1xuXHRcdFx0XHRpZiAoY29weS5hdXRvQWxwaGEpIHtcblx0XHRcdFx0XHRjb3B5LnZpc2liaWxpdHkgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9va3VwLmNsYXNzTmFtZSAmJiAocHQgPSB0aGlzLl9jbGFzc05hbWVQVCkpIHsgLy9mb3IgY2xhc3NOYW1lIHR3ZWVucywgd2UgbmVlZCB0byBraWxsIGFueSBhc3NvY2lhdGVkIENTU1Byb3BUd2VlbnMgdG9vOyBhIGxpbmtlZCBsaXN0IHN0YXJ0cyBhdCB0aGUgY2xhc3NOYW1lJ3MgXCJ4Zmlyc3RcIi5cblx0XHRcdFx0eGZpcnN0ID0gcHQueGZpcnN0O1xuXHRcdFx0XHRpZiAoeGZpcnN0ICYmIHhmaXJzdC5fcHJldikge1xuXHRcdFx0XHRcdHRoaXMuX2xpbmtDU1NQKHhmaXJzdC5fcHJldiwgcHQuX25leHQsIHhmaXJzdC5fcHJldi5fcHJldik7IC8vYnJlYWsgb2ZmIHRoZSBwcmV2XG5cdFx0XHRcdH0gZWxzZSBpZiAoeGZpcnN0ID09PSB0aGlzLl9maXJzdFBUKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdHRoaXMuX2xpbmtDU1NQKHB0Ll9uZXh0LCBwdC5fbmV4dC5fbmV4dCwgeGZpcnN0Ll9wcmV2KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jbGFzc05hbWVQVCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKHB0LnBsdWdpbiAmJiBwdC5wbHVnaW4gIT09IHAgJiYgcHQucGx1Z2luLl9raWxsKSB7IC8vZm9yIHBsdWdpbnMgdGhhdCBhcmUgcmVnaXN0ZXJlZCB3aXRoIENTU1BsdWdpbiwgd2Ugc2hvdWxkIG5vdGlmeSB0aGVtIG9mIHRoZSBraWxsLlxuXHRcdFx0XHRcdHB0LnBsdWdpbi5fa2lsbChsb29rdXApO1xuXHRcdFx0XHRcdHAgPSBwdC5wbHVnaW47XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBUd2VlblBsdWdpbi5wcm90b3R5cGUuX2tpbGwuY2FsbCh0aGlzLCBjb3B5KTtcblx0XHR9O1xuXG5cblxuXHRcdC8vdXNlZCBieSBjYXNjYWRlVG8oKSBmb3IgZ2F0aGVyaW5nIGFsbCB0aGUgc3R5bGUgcHJvcGVydGllcyBvZiBlYWNoIGNoaWxkIGVsZW1lbnQgaW50byBhbiBhcnJheSBmb3IgY29tcGFyaXNvbi5cblx0XHR2YXIgX2dldENoaWxkU3R5bGVzID0gZnVuY3Rpb24oZSwgcHJvcHMsIHRhcmdldHMpIHtcblx0XHRcdFx0dmFyIGNoaWxkcmVuLCBpLCBjaGlsZCwgdHlwZTtcblx0XHRcdFx0aWYgKGUuc2xpY2UpIHtcblx0XHRcdFx0XHRpID0gZS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRfZ2V0Q2hpbGRTdHlsZXMoZVtpXSwgcHJvcHMsIHRhcmdldHMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2hpbGRyZW4gPSBlLmNoaWxkTm9kZXM7XG5cdFx0XHRcdGkgPSBjaGlsZHJlbi5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGNoaWxkID0gY2hpbGRyZW5baV07XG5cdFx0XHRcdFx0dHlwZSA9IGNoaWxkLnR5cGU7XG5cdFx0XHRcdFx0aWYgKGNoaWxkLnN0eWxlKSB7XG5cdFx0XHRcdFx0XHRwcm9wcy5wdXNoKF9nZXRBbGxTdHlsZXMoY2hpbGQpKTtcblx0XHRcdFx0XHRcdGlmICh0YXJnZXRzKSB7XG5cdFx0XHRcdFx0XHRcdHRhcmdldHMucHVzaChjaGlsZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgodHlwZSA9PT0gMSB8fCB0eXBlID09PSA5IHx8IHR5cGUgPT09IDExKSAmJiBjaGlsZC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0X2dldENoaWxkU3R5bGVzKGNoaWxkLCBwcm9wcywgdGFyZ2V0cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogVHlwaWNhbGx5IG9ubHkgdXNlZnVsIGZvciBjbGFzc05hbWUgdHdlZW5zIHRoYXQgbWF5IGFmZmVjdCBjaGlsZCBlbGVtZW50cywgdGhpcyBtZXRob2QgY3JlYXRlcyBhIFR3ZWVuTGl0ZVxuXHRcdCAqIGFuZCB0aGVuIGNvbXBhcmVzIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIG9mIGFsbCB0aGUgdGFyZ2V0J3MgY2hpbGQgZWxlbWVudHMgYXQgdGhlIHR3ZWVuJ3Mgc3RhcnQgYW5kIGVuZCwgYW5kXG5cdFx0ICogaWYgYW55IGFyZSBkaWZmZXJlbnQsIGl0IGFsc28gY3JlYXRlcyB0d2VlbnMgZm9yIHRob3NlIGFuZCByZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgQUxMIG9mIHRoZSByZXN1bHRpbmdcblx0XHQgKiB0d2VlbnMgKHNvIHRoYXQgeW91IGNhbiBlYXNpbHkgYWRkKCkgdGhlbSB0byBhIFRpbWVsaW5lTGl0ZSwgZm9yIGV4YW1wbGUpLiBUaGUgcmVhc29uIHRoaXMgZnVuY3Rpb25hbGl0eSBpc1xuXHRcdCAqIHdyYXBwZWQgaW50byBhIHNlcGFyYXRlIHN0YXRpYyBtZXRob2Qgb2YgQ1NTUGx1Z2luIGluc3RlYWQgb2YgYmVpbmcgaW50ZWdyYXRlZCBpbnRvIGFsbCByZWd1bGFyIGNsYXNzTmFtZSB0d2VlbnNcblx0XHQgKiBpcyBiZWNhdXNlIGl0IGNyZWF0ZXMgZW50aXJlbHkgbmV3IHR3ZWVucyB0aGF0IG1heSBoYXZlIGNvbXBsZXRlbHkgZGlmZmVyZW50IHRhcmdldHMgdGhhbiB0aGUgb3JpZ2luYWwgdHdlZW4sXG5cdFx0ICogc28gaWYgdGhleSB3ZXJlIGFsbCBsdW1wZWQgaW50byB0aGUgb3JpZ2luYWwgdHdlZW4gaW5zdGFuY2UsIGl0IHdvdWxkIGJlIGluY29uc2lzdGVudCB3aXRoIHRoZSByZXN0IG9mIHRoZSBBUElcblx0XHQgKiBhbmQgaXQgd291bGQgY3JlYXRlIG90aGVyIHByb2JsZW1zLiBGb3IgZXhhbXBsZTpcblx0XHQgKiAgLSBJZiBJIGNyZWF0ZSBhIHR3ZWVuIG9mIGVsZW1lbnRBLCB0aGF0IHR3ZWVuIGluc3RhbmNlIG1heSBzdWRkZW5seSBjaGFuZ2UgaXRzIHRhcmdldCB0byBpbmNsdWRlIDUwIG90aGVyIGVsZW1lbnRzICh1bmludHVpdGl2ZSBpZiBJIHNwZWNpZmljYWxseSBkZWZpbmVkIHRoZSB0YXJnZXQgSSB3YW50ZWQpXG5cdFx0ICogIC0gV2UgY2FuJ3QganVzdCBjcmVhdGUgbmV3IGluZGVwZW5kZW50IHR3ZWVucyBiZWNhdXNlIG90aGVyd2lzZSwgd2hhdCBoYXBwZW5zIGlmIHRoZSBvcmlnaW5hbC9wYXJlbnQgdHdlZW4gaXMgcmV2ZXJzZWQgb3IgcGF1c2Ugb3IgZHJvcHBlZCBpbnRvIGEgVGltZWxpbmVMaXRlIGZvciB0aWdodCBjb250cm9sPyBZb3UnZCBleHBlY3QgdGhhdCB0d2VlbidzIGJlaGF2aW9yIHRvIGFmZmVjdCBhbGwgdGhlIG90aGVycy5cblx0XHQgKiAgLSBBbmFseXppbmcgZXZlcnkgc3R5bGUgcHJvcGVydHkgb2YgZXZlcnkgY2hpbGQgYmVmb3JlIGFuZCBhZnRlciB0aGUgdHdlZW4gaXMgYW4gZXhwZW5zaXZlIG9wZXJhdGlvbiB3aGVuIHRoZXJlIGFyZSBtYW55IGNoaWxkcmVuLCBzbyB0aGlzIGJlaGF2aW9yIHNob3VsZG4ndCBiZSBpbXBvc2VkIG9uIGFsbCBjbGFzc05hbWUgdHdlZW5zIGJ5IGRlZmF1bHQsIGVzcGVjaWFsbHkgc2luY2UgaXQncyBwcm9iYWJseSByYXJlIHRoYXQgdGhpcyBleHRyYSBmdW5jdGlvbmFsaXR5IGlzIG5lZWRlZC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgb2JqZWN0IHRvIGJlIHR3ZWVuZWRcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gRHVyYXRpb24gaW4gc2Vjb25kcyAob3IgZnJhbWVzIGZvciBmcmFtZXMtYmFzZWQgdHdlZW5zKVxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgZW5kIHZhbHVlcywgbGlrZSB7Y2xhc3NOYW1lOlwibmV3Q2xhc3NcIiwgZWFzZTpMaW5lYXIuZWFzZU5vbmV9XG5cdFx0ICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIFR3ZWVuTGl0ZSBpbnN0YW5jZXNcblx0XHQgKi9cblx0XHRDU1NQbHVnaW4uY2FzY2FkZVRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0dmFyIHR3ZWVuID0gVHdlZW5MaXRlLnRvKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpLFxuXHRcdFx0XHRyZXN1bHRzID0gW3R3ZWVuXSxcblx0XHRcdFx0YiA9IFtdLFxuXHRcdFx0XHRlID0gW10sXG5cdFx0XHRcdHRhcmdldHMgPSBbXSxcblx0XHRcdFx0X3Jlc2VydmVkUHJvcHMgPSBUd2VlbkxpdGUuX2ludGVybmFscy5yZXNlcnZlZFByb3BzLFxuXHRcdFx0XHRpLCBkaWZzLCBwLCBmcm9tO1xuXHRcdFx0dGFyZ2V0ID0gdHdlZW4uX3RhcmdldHMgfHwgdHdlZW4udGFyZ2V0O1xuXHRcdFx0X2dldENoaWxkU3R5bGVzKHRhcmdldCwgYiwgdGFyZ2V0cyk7XG5cdFx0XHR0d2Vlbi5yZW5kZXIoZHVyYXRpb24sIHRydWUsIHRydWUpO1xuXHRcdFx0X2dldENoaWxkU3R5bGVzKHRhcmdldCwgZSk7XG5cdFx0XHR0d2Vlbi5yZW5kZXIoMCwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHR0d2Vlbi5fZW5hYmxlZCh0cnVlKTtcblx0XHRcdGkgPSB0YXJnZXRzLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRkaWZzID0gX2Nzc0RpZih0YXJnZXRzW2ldLCBiW2ldLCBlW2ldKTtcblx0XHRcdFx0aWYgKGRpZnMuZmlyc3RNUFQpIHtcblx0XHRcdFx0XHRkaWZzID0gZGlmcy5kaWZzO1xuXHRcdFx0XHRcdGZvciAocCBpbiB2YXJzKSB7XG5cdFx0XHRcdFx0XHRpZiAoX3Jlc2VydmVkUHJvcHNbcF0pIHtcblx0XHRcdFx0XHRcdFx0ZGlmc1twXSA9IHZhcnNbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZyb20gPSB7fTtcblx0XHRcdFx0XHRmb3IgKHAgaW4gZGlmcykge1xuXHRcdFx0XHRcdFx0ZnJvbVtwXSA9IGJbaV1bcF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc3VsdHMucHVzaChUd2VlbkxpdGUuZnJvbVRvKHRhcmdldHNbaV0sIGR1cmF0aW9uLCBmcm9tLCBkaWZzKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0XHRUd2VlblBsdWdpbi5hY3RpdmF0ZShbQ1NTUGx1Z2luXSk7XG5cdFx0cmV0dXJuIENTU1BsdWdpbjtcblxuXHR9LCB0cnVlKTtcblxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSb3VuZFByb3BzUGx1Z2luXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0KGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIFJvdW5kUHJvcHNQbHVnaW4gPSBfZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtcblx0XHRcdFx0cHJvcE5hbWU6IFwicm91bmRQcm9wc1wiLFxuXHRcdFx0XHR2ZXJzaW9uOiBcIjEuNi4wXCIsXG5cdFx0XHRcdHByaW9yaXR5OiAtMSxcblx0XHRcdFx0QVBJOiAyLFxuXG5cdFx0XHRcdC8vY2FsbGVkIHdoZW4gdGhlIHR3ZWVuIHJlbmRlcnMgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGlzIHdoZXJlIGluaXRpYWwgdmFsdWVzIHNob3VsZCBiZSByZWNvcmRlZCBhbmQgYW55IHNldHVwIHJvdXRpbmVzIHNob3VsZCBydW4uXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKHRhcmdldCwgdmFsdWUsIHR3ZWVuKSB7XG5cdFx0XHRcdFx0dGhpcy5fdHdlZW4gPSB0d2Vlbjtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KSxcblx0XHRcdF9yb3VuZExpbmtlZExpc3QgPSBmdW5jdGlvbihub2RlKSB7XG5cdFx0XHRcdHdoaWxlIChub2RlKSB7XG5cdFx0XHRcdFx0aWYgKCFub2RlLmYgJiYgIW5vZGUuYmxvYikge1xuXHRcdFx0XHRcdFx0bm9kZS5tID0gTWF0aC5yb3VuZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bm9kZSA9IG5vZGUuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRwID0gUm91bmRQcm9wc1BsdWdpbi5wcm90b3R5cGU7XG5cblx0XHRwLl9vbkluaXRBbGxQcm9wcyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fdHdlZW4sXG5cdFx0XHRcdHJwID0gKHR3ZWVuLnZhcnMucm91bmRQcm9wcy5qb2luKSA/IHR3ZWVuLnZhcnMucm91bmRQcm9wcyA6IHR3ZWVuLnZhcnMucm91bmRQcm9wcy5zcGxpdChcIixcIiksXG5cdFx0XHRcdGkgPSBycC5sZW5ndGgsXG5cdFx0XHRcdGxvb2t1cCA9IHt9LFxuXHRcdFx0XHRycHQgPSB0d2Vlbi5fcHJvcExvb2t1cC5yb3VuZFByb3BzLFxuXHRcdFx0XHRwcm9wLCBwdCwgbmV4dDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRsb29rdXBbcnBbaV1dID0gTWF0aC5yb3VuZDtcblx0XHRcdH1cblx0XHRcdGkgPSBycC5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0cHJvcCA9IHJwW2ldO1xuXHRcdFx0XHRwdCA9IHR3ZWVuLl9maXJzdFBUO1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRuZXh0ID0gcHQuX25leHQ7IC8vcmVjb3JkIGhlcmUsIGJlY2F1c2UgaXQgbWF5IGdldCByZW1vdmVkXG5cdFx0XHRcdFx0aWYgKHB0LnBnKSB7XG5cdFx0XHRcdFx0XHRwdC50Ll9tb2QobG9va3VwKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0Lm4gPT09IHByb3ApIHtcblx0XHRcdFx0XHRcdGlmIChwdC5mID09PSAyICYmIHB0LnQpIHsgLy9hIGJsb2IgKHRleHQgY29udGFpbmluZyBtdWx0aXBsZSBudW1lcmljIHZhbHVlcylcblx0XHRcdFx0XHRcdFx0X3JvdW5kTGlua2VkTGlzdChwdC50Ll9maXJzdFBUKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2FkZChwdC50LCBwcm9wLCBwdC5zLCBwdC5jKTtcblx0XHRcdFx0XHRcdFx0Ly9yZW1vdmUgZnJvbSBsaW5rZWQgbGlzdFxuXHRcdFx0XHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdFx0XHRcdG5leHQuX3ByZXYgPSBwdC5fcHJldjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAocHQuX3ByZXYpIHtcblx0XHRcdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IG5leHQ7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodHdlZW4uX2ZpcnN0UFQgPT09IHB0KSB7XG5cdFx0XHRcdFx0XHRcdFx0dHdlZW4uX2ZpcnN0UFQgPSBuZXh0O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHB0Ll9uZXh0ID0gcHQuX3ByZXYgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5fcHJvcExvb2t1cFtwcm9wXSA9IHJwdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHRcdHAuX2FkZCA9IGZ1bmN0aW9uKHRhcmdldCwgcCwgcywgYykge1xuXHRcdFx0dGhpcy5fYWRkVHdlZW4odGFyZ2V0LCBwLCBzLCBzICsgYywgcCwgTWF0aC5yb3VuZCk7XG5cdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHApO1xuXHRcdH07XG5cblx0fSgpKTtcblxuXG5cblxuXG5cblxuXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEF0dHJQbHVnaW5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5cdChmdW5jdGlvbigpIHtcblxuXHRcdF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe1xuXHRcdFx0cHJvcE5hbWU6IFwiYXR0clwiLFxuXHRcdFx0QVBJOiAyLFxuXHRcdFx0dmVyc2lvbjogXCIwLjYuMFwiLFxuXG5cdFx0XHQvL2NhbGxlZCB3aGVuIHRoZSB0d2VlbiByZW5kZXJzIGZvciB0aGUgZmlyc3QgdGltZS4gVGhpcyBpcyB3aGVyZSBpbml0aWFsIHZhbHVlcyBzaG91bGQgYmUgcmVjb3JkZWQgYW5kIGFueSBzZXR1cCByb3V0aW5lcyBzaG91bGQgcnVuLlxuXHRcdFx0aW5pdDogZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4sIGluZGV4KSB7XG5cdFx0XHRcdHZhciBwLCBlbmQ7XG5cdFx0XHRcdGlmICh0eXBlb2YodGFyZ2V0LnNldEF0dHJpYnV0ZSkgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKHAgaW4gdmFsdWUpIHtcblx0XHRcdFx0XHRlbmQgPSB2YWx1ZVtwXTtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGVuZCkgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0ZW5kID0gZW5kKGluZGV4LCB0YXJnZXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9hZGRUd2Vlbih0YXJnZXQsIFwic2V0QXR0cmlidXRlXCIsIHRhcmdldC5nZXRBdHRyaWJ1dGUocCkgKyBcIlwiLCBlbmQgKyBcIlwiLCBwLCBmYWxzZSwgcCk7XG5cdFx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdH0oKSk7XG5cblxuXG5cblxuXG5cblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEaXJlY3Rpb25hbFJvdGF0aW9uUGx1Z2luXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0X2dzU2NvcGUuX2dzRGVmaW5lLnBsdWdpbih7XG5cdFx0cHJvcE5hbWU6IFwiZGlyZWN0aW9uYWxSb3RhdGlvblwiLFxuXHRcdHZlcnNpb246IFwiMC4zLjBcIixcblx0XHRBUEk6IDIsXG5cblx0XHQvL2NhbGxlZCB3aGVuIHRoZSB0d2VlbiByZW5kZXJzIGZvciB0aGUgZmlyc3QgdGltZS4gVGhpcyBpcyB3aGVyZSBpbml0aWFsIHZhbHVlcyBzaG91bGQgYmUgcmVjb3JkZWQgYW5kIGFueSBzZXR1cCByb3V0aW5lcyBzaG91bGQgcnVuLlxuXHRcdGluaXQ6IGZ1bmN0aW9uKHRhcmdldCwgdmFsdWUsIHR3ZWVuLCBpbmRleCkge1xuXHRcdFx0aWYgKHR5cGVvZih2YWx1ZSkgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0dmFsdWUgPSB7cm90YXRpb246dmFsdWV9O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5maW5hbHMgPSB7fTtcblx0XHRcdHZhciBjYXAgPSAodmFsdWUudXNlUmFkaWFucyA9PT0gdHJ1ZSkgPyBNYXRoLlBJICogMiA6IDM2MCxcblx0XHRcdFx0bWluID0gMC4wMDAwMDEsXG5cdFx0XHRcdHAsIHYsIHN0YXJ0LCBlbmQsIGRpZiwgc3BsaXQ7XG5cdFx0XHRmb3IgKHAgaW4gdmFsdWUpIHtcblx0XHRcdFx0aWYgKHAgIT09IFwidXNlUmFkaWFuc1wiKSB7XG5cdFx0XHRcdFx0ZW5kID0gdmFsdWVbcF07XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihlbmQpID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdGVuZCA9IGVuZChpbmRleCwgdGFyZ2V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3BsaXQgPSAoZW5kICsgXCJcIikuc3BsaXQoXCJfXCIpO1xuXHRcdFx0XHRcdHYgPSBzcGxpdFswXTtcblx0XHRcdFx0XHRzdGFydCA9IHBhcnNlRmxvYXQoICh0eXBlb2YodGFyZ2V0W3BdKSAhPT0gXCJmdW5jdGlvblwiKSA/IHRhcmdldFtwXSA6IHRhcmdldFsgKChwLmluZGV4T2YoXCJzZXRcIikgfHwgdHlwZW9mKHRhcmdldFtcImdldFwiICsgcC5zdWJzdHIoMyldKSAhPT0gXCJmdW5jdGlvblwiKSA/IHAgOiBcImdldFwiICsgcC5zdWJzdHIoMykpIF0oKSApO1xuXHRcdFx0XHRcdGVuZCA9IHRoaXMuZmluYWxzW3BdID0gKHR5cGVvZih2KSA9PT0gXCJzdHJpbmdcIiAmJiB2LmNoYXJBdCgxKSA9PT0gXCI9XCIpID8gc3RhcnQgKyBwYXJzZUludCh2LmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBOdW1iZXIodi5zdWJzdHIoMikpIDogTnVtYmVyKHYpIHx8IDA7XG5cdFx0XHRcdFx0ZGlmID0gZW5kIC0gc3RhcnQ7XG5cdFx0XHRcdFx0aWYgKHNwbGl0Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0diA9IHNwbGl0LmpvaW4oXCJfXCIpO1xuXHRcdFx0XHRcdFx0aWYgKHYuaW5kZXhPZihcInNob3J0XCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSBkaWYgJSBjYXA7XG5cdFx0XHRcdFx0XHRcdGlmIChkaWYgIT09IGRpZiAlIChjYXAgLyAyKSkge1xuXHRcdFx0XHRcdFx0XHRcdGRpZiA9IChkaWYgPCAwKSA/IGRpZiArIGNhcCA6IGRpZiAtIGNhcDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHYuaW5kZXhPZihcIl9jd1wiKSAhPT0gLTEgJiYgZGlmIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoKGRpZiArIGNhcCAqIDk5OTk5OTk5OTkpICUgY2FwKSAtICgoZGlmIC8gY2FwKSB8IDApICogY2FwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh2LmluZGV4T2YoXCJjY3dcIikgIT09IC0xICYmIGRpZiA+IDApIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gKChkaWYgLSBjYXAgKiA5OTk5OTk5OTk5KSAlIGNhcCkgLSAoKGRpZiAvIGNhcCkgfCAwKSAqIGNhcDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGRpZiA+IG1pbiB8fCBkaWYgPCAtbWluKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9hZGRUd2Vlbih0YXJnZXQsIHAsIHN0YXJ0LCBzdGFydCArIGRpZiwgcCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdC8vY2FsbGVkIGVhY2ggdGltZSB0aGUgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkLCBhbmQgdGhlIHJhdGlvIGdldHMgcGFzc2VkIGFzIHRoZSBvbmx5IHBhcmFtZXRlciAodHlwaWNhbGx5IGl0J3MgYSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEsIGJ1dCBpdCBjYW4gZXhjZWVkIHRob3NlIHdoZW4gdXNpbmcgYW4gZWFzZSBsaWtlIEVsYXN0aWMuZWFzZU91dCBvciBCYWNrLmVhc2VPdXQsIGV0Yy4pXG5cdFx0c2V0OiBmdW5jdGlvbihyYXRpbykge1xuXHRcdFx0dmFyIHB0O1xuXHRcdFx0aWYgKHJhdGlvICE9PSAxKSB7XG5cdFx0XHRcdHRoaXMuX3N1cGVyLnNldFJhdGlvLmNhbGwodGhpcywgcmF0aW8pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHQgPSB0aGlzLl9maXJzdFBUO1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRpZiAocHQuZikge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSh0aGlzLmZpbmFsc1twdC5wXSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSB0aGlzLmZpbmFsc1twdC5wXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9KS5fYXV0b0NTUyA9IHRydWU7XG5cblxuXG5cblxuXG5cblx0XG5cdFxuXHRcblx0XG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRWFzZVBhY2tcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRfZ3NTY29wZS5fZ3NEZWZpbmUoXCJlYXNpbmcuQmFja1wiLCBbXCJlYXNpbmcuRWFzZVwiXSwgZnVuY3Rpb24oRWFzZSkge1xuXHRcdFxuXHRcdHZhciB3ID0gKF9nc1Njb3BlLkdyZWVuU29ja0dsb2JhbHMgfHwgX2dzU2NvcGUpLFxuXHRcdFx0Z3MgPSB3LmNvbS5ncmVlbnNvY2ssXG5cdFx0XHRfMlBJID0gTWF0aC5QSSAqIDIsXG5cdFx0XHRfSEFMRl9QSSA9IE1hdGguUEkgLyAyLFxuXHRcdFx0X2NsYXNzID0gZ3MuX2NsYXNzLFxuXHRcdFx0X2NyZWF0ZSA9IGZ1bmN0aW9uKG4sIGYpIHtcblx0XHRcdFx0dmFyIEMgPSBfY2xhc3MoXCJlYXNpbmcuXCIgKyBuLCBmdW5jdGlvbigpe30sIHRydWUpLFxuXHRcdFx0XHRcdHAgPSBDLnByb3RvdHlwZSA9IG5ldyBFYXNlKCk7XG5cdFx0XHRcdHAuY29uc3RydWN0b3IgPSBDO1xuXHRcdFx0XHRwLmdldFJhdGlvID0gZjtcblx0XHRcdFx0cmV0dXJuIEM7XG5cdFx0XHR9LFxuXHRcdFx0X2Vhc2VSZWcgPSBFYXNlLnJlZ2lzdGVyIHx8IGZ1bmN0aW9uKCl7fSwgLy9wdXQgYW4gZW1wdHkgZnVuY3Rpb24gaW4gcGxhY2UganVzdCBhcyBhIHNhZmV0eSBtZWFzdXJlIGluIGNhc2Ugc29tZW9uZSBsb2FkcyBhbiBPTEQgdmVyc2lvbiBvZiBUd2VlbkxpdGUuanMgd2hlcmUgRWFzZS5yZWdpc3RlciBkb2Vzbid0IGV4aXN0LlxuXHRcdFx0X3dyYXAgPSBmdW5jdGlvbihuYW1lLCBFYXNlT3V0LCBFYXNlSW4sIEVhc2VJbk91dCwgYWxpYXNlcykge1xuXHRcdFx0XHR2YXIgQyA9IF9jbGFzcyhcImVhc2luZy5cIituYW1lLCB7XG5cdFx0XHRcdFx0ZWFzZU91dDpuZXcgRWFzZU91dCgpLFxuXHRcdFx0XHRcdGVhc2VJbjpuZXcgRWFzZUluKCksXG5cdFx0XHRcdFx0ZWFzZUluT3V0Om5ldyBFYXNlSW5PdXQoKVxuXHRcdFx0XHR9LCB0cnVlKTtcblx0XHRcdFx0X2Vhc2VSZWcoQywgbmFtZSk7XG5cdFx0XHRcdHJldHVybiBDO1xuXHRcdFx0fSxcblx0XHRcdEVhc2VQb2ludCA9IGZ1bmN0aW9uKHRpbWUsIHZhbHVlLCBuZXh0KSB7XG5cdFx0XHRcdHRoaXMudCA9IHRpbWU7XG5cdFx0XHRcdHRoaXMudiA9IHZhbHVlO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdHRoaXMubmV4dCA9IG5leHQ7XG5cdFx0XHRcdFx0bmV4dC5wcmV2ID0gdGhpcztcblx0XHRcdFx0XHR0aGlzLmMgPSBuZXh0LnYgLSB2YWx1ZTtcblx0XHRcdFx0XHR0aGlzLmdhcCA9IG5leHQudCAtIHRpbWU7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vQmFja1xuXHRcdFx0X2NyZWF0ZUJhY2sgPSBmdW5jdGlvbihuLCBmKSB7XG5cdFx0XHRcdHZhciBDID0gX2NsYXNzKFwiZWFzaW5nLlwiICsgbiwgZnVuY3Rpb24ob3ZlcnNob290KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9wMSA9IChvdmVyc2hvb3QgfHwgb3ZlcnNob290ID09PSAwKSA/IG92ZXJzaG9vdCA6IDEuNzAxNTg7XG5cdFx0XHRcdFx0XHR0aGlzLl9wMiA9IHRoaXMuX3AxICogMS41MjU7XG5cdFx0XHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRcdFx0cCA9IEMucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRcdFx0cC5jb25zdHJ1Y3RvciA9IEM7XG5cdFx0XHRcdHAuZ2V0UmF0aW8gPSBmO1xuXHRcdFx0XHRwLmNvbmZpZyA9IGZ1bmN0aW9uKG92ZXJzaG9vdCkge1xuXHRcdFx0XHRcdHJldHVybiBuZXcgQyhvdmVyc2hvb3QpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gQztcblx0XHRcdH0sXG5cblx0XHRcdEJhY2sgPSBfd3JhcChcIkJhY2tcIixcblx0XHRcdFx0X2NyZWF0ZUJhY2soXCJCYWNrT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0XHRyZXR1cm4gKChwID0gcCAtIDEpICogcCAqICgodGhpcy5fcDEgKyAxKSAqIHAgKyB0aGlzLl9wMSkgKyAxKTtcblx0XHRcdFx0fSksXG5cdFx0XHRcdF9jcmVhdGVCYWNrKFwiQmFja0luXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0XHRyZXR1cm4gcCAqIHAgKiAoKHRoaXMuX3AxICsgMSkgKiBwIC0gdGhpcy5fcDEpO1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0X2NyZWF0ZUJhY2soXCJCYWNrSW5PdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHJldHVybiAoKHAgKj0gMikgPCAxKSA/IDAuNSAqIHAgKiBwICogKCh0aGlzLl9wMiArIDEpICogcCAtIHRoaXMuX3AyKSA6IDAuNSAqICgocCAtPSAyKSAqIHAgKiAoKHRoaXMuX3AyICsgMSkgKiBwICsgdGhpcy5fcDIpICsgMik7XG5cdFx0XHRcdH0pXG5cdFx0XHQpLFxuXG5cblx0XHRcdC8vU2xvd01vXG5cdFx0XHRTbG93TW8gPSBfY2xhc3MoXCJlYXNpbmcuU2xvd01vXCIsIGZ1bmN0aW9uKGxpbmVhclJhdGlvLCBwb3dlciwgeW95b01vZGUpIHtcblx0XHRcdFx0cG93ZXIgPSAocG93ZXIgfHwgcG93ZXIgPT09IDApID8gcG93ZXIgOiAwLjc7XG5cdFx0XHRcdGlmIChsaW5lYXJSYXRpbyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0bGluZWFyUmF0aW8gPSAwLjc7XG5cdFx0XHRcdH0gZWxzZSBpZiAobGluZWFyUmF0aW8gPiAxKSB7XG5cdFx0XHRcdFx0bGluZWFyUmF0aW8gPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3AgPSAobGluZWFyUmF0aW8gIT09IDEpID8gcG93ZXIgOiAwO1xuXHRcdFx0XHR0aGlzLl9wMSA9ICgxIC0gbGluZWFyUmF0aW8pIC8gMjtcblx0XHRcdFx0dGhpcy5fcDIgPSBsaW5lYXJSYXRpbztcblx0XHRcdFx0dGhpcy5fcDMgPSB0aGlzLl9wMSArIHRoaXMuX3AyO1xuXHRcdFx0XHR0aGlzLl9jYWxjRW5kID0gKHlveW9Nb2RlID09PSB0cnVlKTtcblx0XHRcdH0sIHRydWUpLFxuXHRcdFx0cCA9IFNsb3dNby5wcm90b3R5cGUgPSBuZXcgRWFzZSgpLFxuXHRcdFx0U3RlcHBlZEVhc2UsIFJvdWdoRWFzZSwgX2NyZWF0ZUVsYXN0aWM7XG5cblx0XHRwLmNvbnN0cnVjdG9yID0gU2xvd01vO1xuXHRcdHAuZ2V0UmF0aW8gPSBmdW5jdGlvbihwKSB7XG5cdFx0XHR2YXIgciA9IHAgKyAoMC41IC0gcCkgKiB0aGlzLl9wO1xuXHRcdFx0aWYgKHAgPCB0aGlzLl9wMSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY2FsY0VuZCA/IDEgLSAoKHAgPSAxIC0gKHAgLyB0aGlzLl9wMSkpICogcCkgOiByIC0gKChwID0gMSAtIChwIC8gdGhpcy5fcDEpKSAqIHAgKiBwICogcCAqIHIpO1xuXHRcdFx0fSBlbHNlIGlmIChwID4gdGhpcy5fcDMpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NhbGNFbmQgPyAxIC0gKHAgPSAocCAtIHRoaXMuX3AzKSAvIHRoaXMuX3AxKSAqIHAgOiByICsgKChwIC0gcikgKiAocCA9IChwIC0gdGhpcy5fcDMpIC8gdGhpcy5fcDEpICogcCAqIHAgKiBwKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLl9jYWxjRW5kID8gMSA6IHI7XG5cdFx0fTtcblx0XHRTbG93TW8uZWFzZSA9IG5ldyBTbG93TW8oMC43LCAwLjcpO1xuXG5cdFx0cC5jb25maWcgPSBTbG93TW8uY29uZmlnID0gZnVuY3Rpb24obGluZWFyUmF0aW8sIHBvd2VyLCB5b3lvTW9kZSkge1xuXHRcdFx0cmV0dXJuIG5ldyBTbG93TW8obGluZWFyUmF0aW8sIHBvd2VyLCB5b3lvTW9kZSk7XG5cdFx0fTtcblxuXG5cdFx0Ly9TdGVwcGVkRWFzZVxuXHRcdFN0ZXBwZWRFYXNlID0gX2NsYXNzKFwiZWFzaW5nLlN0ZXBwZWRFYXNlXCIsIGZ1bmN0aW9uKHN0ZXBzKSB7XG5cdFx0XHRcdHN0ZXBzID0gc3RlcHMgfHwgMTtcblx0XHRcdFx0dGhpcy5fcDEgPSAxIC8gc3RlcHM7XG5cdFx0XHRcdHRoaXMuX3AyID0gc3RlcHMgKyAxO1xuXHRcdFx0fSwgdHJ1ZSk7XG5cdFx0cCA9IFN0ZXBwZWRFYXNlLnByb3RvdHlwZSA9IG5ldyBFYXNlKCk7XG5cdFx0cC5jb25zdHJ1Y3RvciA9IFN0ZXBwZWRFYXNlO1xuXHRcdHAuZ2V0UmF0aW8gPSBmdW5jdGlvbihwKSB7XG5cdFx0XHRpZiAocCA8IDApIHtcblx0XHRcdFx0cCA9IDA7XG5cdFx0XHR9IGVsc2UgaWYgKHAgPj0gMSkge1xuXHRcdFx0XHRwID0gMC45OTk5OTk5OTk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKCh0aGlzLl9wMiAqIHApID4+IDApICogdGhpcy5fcDE7XG5cdFx0fTtcblx0XHRwLmNvbmZpZyA9IFN0ZXBwZWRFYXNlLmNvbmZpZyA9IGZ1bmN0aW9uKHN0ZXBzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFN0ZXBwZWRFYXNlKHN0ZXBzKTtcblx0XHR9O1xuXG5cblx0XHQvL1JvdWdoRWFzZVxuXHRcdFJvdWdoRWFzZSA9IF9jbGFzcyhcImVhc2luZy5Sb3VnaEVhc2VcIiwgZnVuY3Rpb24odmFycykge1xuXHRcdFx0dmFycyA9IHZhcnMgfHwge307XG5cdFx0XHR2YXIgdGFwZXIgPSB2YXJzLnRhcGVyIHx8IFwibm9uZVwiLFxuXHRcdFx0XHRhID0gW10sXG5cdFx0XHRcdGNudCA9IDAsXG5cdFx0XHRcdHBvaW50cyA9ICh2YXJzLnBvaW50cyB8fCAyMCkgfCAwLFxuXHRcdFx0XHRpID0gcG9pbnRzLFxuXHRcdFx0XHRyYW5kb21pemUgPSAodmFycy5yYW5kb21pemUgIT09IGZhbHNlKSxcblx0XHRcdFx0Y2xhbXAgPSAodmFycy5jbGFtcCA9PT0gdHJ1ZSksXG5cdFx0XHRcdHRlbXBsYXRlID0gKHZhcnMudGVtcGxhdGUgaW5zdGFuY2VvZiBFYXNlKSA/IHZhcnMudGVtcGxhdGUgOiBudWxsLFxuXHRcdFx0XHRzdHJlbmd0aCA9ICh0eXBlb2YodmFycy5zdHJlbmd0aCkgPT09IFwibnVtYmVyXCIpID8gdmFycy5zdHJlbmd0aCAqIDAuNCA6IDAuNCxcblx0XHRcdFx0eCwgeSwgYnVtcCwgaW52WCwgb2JqLCBwbnQ7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0eCA9IHJhbmRvbWl6ZSA/IE1hdGgucmFuZG9tKCkgOiAoMSAvIHBvaW50cykgKiBpO1xuXHRcdFx0XHR5ID0gdGVtcGxhdGUgPyB0ZW1wbGF0ZS5nZXRSYXRpbyh4KSA6IHg7XG5cdFx0XHRcdGlmICh0YXBlciA9PT0gXCJub25lXCIpIHtcblx0XHRcdFx0XHRidW1wID0gc3RyZW5ndGg7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGFwZXIgPT09IFwib3V0XCIpIHtcblx0XHRcdFx0XHRpbnZYID0gMSAtIHg7XG5cdFx0XHRcdFx0YnVtcCA9IGludlggKiBpbnZYICogc3RyZW5ndGg7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGFwZXIgPT09IFwiaW5cIikge1xuXHRcdFx0XHRcdGJ1bXAgPSB4ICogeCAqIHN0cmVuZ3RoO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHggPCAwLjUpIHsgIC8vXCJib3RoXCIgKHN0YXJ0KVxuXHRcdFx0XHRcdGludlggPSB4ICogMjtcblx0XHRcdFx0XHRidW1wID0gaW52WCAqIGludlggKiAwLjUgKiBzdHJlbmd0aDtcblx0XHRcdFx0fSBlbHNlIHtcdFx0XHRcdC8vXCJib3RoXCIgKGVuZClcblx0XHRcdFx0XHRpbnZYID0gKDEgLSB4KSAqIDI7XG5cdFx0XHRcdFx0YnVtcCA9IGludlggKiBpbnZYICogMC41ICogc3RyZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJhbmRvbWl6ZSkge1xuXHRcdFx0XHRcdHkgKz0gKE1hdGgucmFuZG9tKCkgKiBidW1wKSAtIChidW1wICogMC41KTtcblx0XHRcdFx0fSBlbHNlIGlmIChpICUgMikge1xuXHRcdFx0XHRcdHkgKz0gYnVtcCAqIDAuNTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR5IC09IGJ1bXAgKiAwLjU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNsYW1wKSB7XG5cdFx0XHRcdFx0aWYgKHkgPiAxKSB7XG5cdFx0XHRcdFx0XHR5ID0gMTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHkgPCAwKSB7XG5cdFx0XHRcdFx0XHR5ID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YVtjbnQrK10gPSB7eDp4LCB5Onl9O1xuXHRcdFx0fVxuXHRcdFx0YS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0cmV0dXJuIGEueCAtIGIueDtcblx0XHRcdH0pO1xuXG5cdFx0XHRwbnQgPSBuZXcgRWFzZVBvaW50KDEsIDEsIG51bGwpO1xuXHRcdFx0aSA9IHBvaW50cztcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRvYmogPSBhW2ldO1xuXHRcdFx0XHRwbnQgPSBuZXcgRWFzZVBvaW50KG9iai54LCBvYmoueSwgcG50KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fcHJldiA9IG5ldyBFYXNlUG9pbnQoMCwgMCwgKHBudC50ICE9PSAwKSA/IHBudCA6IHBudC5uZXh0KTtcblx0XHR9LCB0cnVlKTtcblx0XHRwID0gUm91Z2hFYXNlLnByb3RvdHlwZSA9IG5ldyBFYXNlKCk7XG5cdFx0cC5jb25zdHJ1Y3RvciA9IFJvdWdoRWFzZTtcblx0XHRwLmdldFJhdGlvID0gZnVuY3Rpb24ocCkge1xuXHRcdFx0dmFyIHBudCA9IHRoaXMuX3ByZXY7XG5cdFx0XHRpZiAocCA+IHBudC50KSB7XG5cdFx0XHRcdHdoaWxlIChwbnQubmV4dCAmJiBwID49IHBudC50KSB7XG5cdFx0XHRcdFx0cG50ID0gcG50Lm5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cG50ID0gcG50LnByZXY7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aGlsZSAocG50LnByZXYgJiYgcCA8PSBwbnQudCkge1xuXHRcdFx0XHRcdHBudCA9IHBudC5wcmV2O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcmV2ID0gcG50O1xuXHRcdFx0cmV0dXJuIChwbnQudiArICgocCAtIHBudC50KSAvIHBudC5nYXApICogcG50LmMpO1xuXHRcdH07XG5cdFx0cC5jb25maWcgPSBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFJvdWdoRWFzZSh2YXJzKTtcblx0XHR9O1xuXHRcdFJvdWdoRWFzZS5lYXNlID0gbmV3IFJvdWdoRWFzZSgpO1xuXG5cblx0XHQvL0JvdW5jZVxuXHRcdF93cmFwKFwiQm91bmNlXCIsXG5cdFx0XHRfY3JlYXRlKFwiQm91bmNlT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0aWYgKHAgPCAxIC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiA3LjU2MjUgKiBwICogcDtcblx0XHRcdFx0fSBlbHNlIGlmIChwIDwgMiAvIDIuNzUpIHtcblx0XHRcdFx0XHRyZXR1cm4gNy41NjI1ICogKHAgLT0gMS41IC8gMi43NSkgKiBwICsgMC43NTtcblx0XHRcdFx0fSBlbHNlIGlmIChwIDwgMi41IC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiA3LjU2MjUgKiAocCAtPSAyLjI1IC8gMi43NSkgKiBwICsgMC45Mzc1O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAocCAtPSAyLjYyNSAvIDIuNzUpICogcCArIDAuOTg0Mzc1O1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiQm91bmNlSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRpZiAoKHAgPSAxIC0gcCkgPCAxIC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiAxIC0gKDcuNTYyNSAqIHAgKiBwKTtcblx0XHRcdFx0fSBlbHNlIGlmIChwIDwgMiAvIDIuNzUpIHtcblx0XHRcdFx0XHRyZXR1cm4gMSAtICg3LjU2MjUgKiAocCAtPSAxLjUgLyAyLjc1KSAqIHAgKyAwLjc1KTtcblx0XHRcdFx0fSBlbHNlIGlmIChwIDwgMi41IC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiAxIC0gKDcuNTYyNSAqIChwIC09IDIuMjUgLyAyLjc1KSAqIHAgKyAwLjkzNzUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAxIC0gKDcuNTYyNSAqIChwIC09IDIuNjI1IC8gMi43NSkgKiBwICsgMC45ODQzNzUpO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiQm91bmNlSW5PdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHR2YXIgaW52ZXJ0ID0gKHAgPCAwLjUpO1xuXHRcdFx0XHRpZiAoaW52ZXJ0KSB7XG5cdFx0XHRcdFx0cCA9IDEgLSAocCAqIDIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHAgPSAocCAqIDIpIC0gMTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocCA8IDEgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cCA9IDcuNTYyNSAqIHAgKiBwO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyIC8gMi43NSkge1xuXHRcdFx0XHRcdHAgPSA3LjU2MjUgKiAocCAtPSAxLjUgLyAyLjc1KSAqIHAgKyAwLjc1O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyLjUgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cCA9IDcuNTYyNSAqIChwIC09IDIuMjUgLyAyLjc1KSAqIHAgKyAwLjkzNzU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cCA9IDcuNTYyNSAqIChwIC09IDIuNjI1IC8gMi43NSkgKiBwICsgMC45ODQzNzU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGludmVydCA/ICgxIC0gcCkgKiAwLjUgOiBwICogMC41ICsgMC41O1xuXHRcdFx0fSlcblx0XHQpO1xuXG5cblx0XHQvL0NJUkNcblx0XHRfd3JhcChcIkNpcmNcIixcblx0XHRcdF9jcmVhdGUoXCJDaXJjT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIE1hdGguc3FydCgxIC0gKHAgPSBwIC0gMSkgKiBwKTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIkNpcmNJblwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAtKE1hdGguc3FydCgxIC0gKHAgKiBwKSkgLSAxKTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIkNpcmNJbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAoKHAqPTIpIDwgMSkgPyAtMC41ICogKE1hdGguc3FydCgxIC0gcCAqIHApIC0gMSkgOiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAocCAtPSAyKSAqIHApICsgMSk7XG5cdFx0XHR9KVxuXHRcdCk7XG5cblxuXHRcdC8vRWxhc3RpY1xuXHRcdF9jcmVhdGVFbGFzdGljID0gZnVuY3Rpb24obiwgZiwgZGVmKSB7XG5cdFx0XHR2YXIgQyA9IF9jbGFzcyhcImVhc2luZy5cIiArIG4sIGZ1bmN0aW9uKGFtcGxpdHVkZSwgcGVyaW9kKSB7XG5cdFx0XHRcdFx0dGhpcy5fcDEgPSAoYW1wbGl0dWRlID49IDEpID8gYW1wbGl0dWRlIDogMTsgLy9ub3RlOiBpZiBhbXBsaXR1ZGUgaXMgPCAxLCB3ZSBzaW1wbHkgYWRqdXN0IHRoZSBwZXJpb2QgZm9yIGEgbW9yZSBuYXR1cmFsIGZlZWwuIE90aGVyd2lzZSB0aGUgbWF0aCBkb2Vzbid0IHdvcmsgcmlnaHQgYW5kIHRoZSBjdXJ2ZSBzdGFydHMgYXQgMS5cblx0XHRcdFx0XHR0aGlzLl9wMiA9IChwZXJpb2QgfHwgZGVmKSAvIChhbXBsaXR1ZGUgPCAxID8gYW1wbGl0dWRlIDogMSk7XG5cdFx0XHRcdFx0dGhpcy5fcDMgPSB0aGlzLl9wMiAvIF8yUEkgKiAoTWF0aC5hc2luKDEgLyB0aGlzLl9wMSkgfHwgMCk7XG5cdFx0XHRcdFx0dGhpcy5fcDIgPSBfMlBJIC8gdGhpcy5fcDI7IC8vcHJlY2FsY3VsYXRlIHRvIG9wdGltaXplXG5cdFx0XHRcdH0sIHRydWUpLFxuXHRcdFx0XHRwID0gQy5wcm90b3R5cGUgPSBuZXcgRWFzZSgpO1xuXHRcdFx0cC5jb25zdHJ1Y3RvciA9IEM7XG5cdFx0XHRwLmdldFJhdGlvID0gZjtcblx0XHRcdHAuY29uZmlnID0gZnVuY3Rpb24oYW1wbGl0dWRlLCBwZXJpb2QpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBDKGFtcGxpdHVkZSwgcGVyaW9kKTtcblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gQztcblx0XHR9O1xuXHRcdF93cmFwKFwiRWxhc3RpY1wiLFxuXHRcdFx0X2NyZWF0ZUVsYXN0aWMoXCJFbGFzdGljT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3AxICogTWF0aC5wb3coMiwgLTEwICogcCkgKiBNYXRoLnNpbiggKHAgLSB0aGlzLl9wMykgKiB0aGlzLl9wMiApICsgMTtcblx0XHRcdH0sIDAuMyksXG5cdFx0XHRfY3JlYXRlRWxhc3RpYyhcIkVsYXN0aWNJblwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAtKHRoaXMuX3AxICogTWF0aC5wb3coMiwgMTAgKiAocCAtPSAxKSkgKiBNYXRoLnNpbiggKHAgLSB0aGlzLl9wMykgKiB0aGlzLl9wMiApKTtcblx0XHRcdH0sIDAuMyksXG5cdFx0XHRfY3JlYXRlRWxhc3RpYyhcIkVsYXN0aWNJbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAoKHAgKj0gMikgPCAxKSA/IC0wLjUgKiAodGhpcy5fcDEgKiBNYXRoLnBvdygyLCAxMCAqIChwIC09IDEpKSAqIE1hdGguc2luKCAocCAtIHRoaXMuX3AzKSAqIHRoaXMuX3AyKSkgOiB0aGlzLl9wMSAqIE1hdGgucG93KDIsIC0xMCAqKHAgLT0gMSkpICogTWF0aC5zaW4oIChwIC0gdGhpcy5fcDMpICogdGhpcy5fcDIgKSAqIDAuNSArIDE7XG5cdFx0XHR9LCAwLjQ1KVxuXHRcdCk7XG5cblxuXHRcdC8vRXhwb1xuXHRcdF93cmFwKFwiRXhwb1wiLFxuXHRcdFx0X2NyZWF0ZShcIkV4cG9PdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gMSAtIE1hdGgucG93KDIsIC0xMCAqIHApO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiRXhwb0luXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSkgLSAwLjAwMTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIkV4cG9Jbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAoKHAgKj0gMikgPCAxKSA/IDAuNSAqIE1hdGgucG93KDIsIDEwICogKHAgLSAxKSkgOiAwLjUgKiAoMiAtIE1hdGgucG93KDIsIC0xMCAqIChwIC0gMSkpKTtcblx0XHRcdH0pXG5cdFx0KTtcblxuXG5cdFx0Ly9TaW5lXG5cdFx0X3dyYXAoXCJTaW5lXCIsXG5cdFx0XHRfY3JlYXRlKFwiU2luZU91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiBNYXRoLnNpbihwICogX0hBTEZfUEkpO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiU2luZUluXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIC1NYXRoLmNvcyhwICogX0hBTEZfUEkpICsgMTtcblx0XHRcdH0pLFxuXHRcdFx0X2NyZWF0ZShcIlNpbmVJbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAtMC41ICogKE1hdGguY29zKE1hdGguUEkgKiBwKSAtIDEpO1xuXHRcdFx0fSlcblx0XHQpO1xuXG5cdFx0X2NsYXNzKFwiZWFzaW5nLkVhc2VMb29rdXBcIiwge1xuXHRcdFx0XHRmaW5kOmZ1bmN0aW9uKHMpIHtcblx0XHRcdFx0XHRyZXR1cm4gRWFzZS5tYXBbc107XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRydWUpO1xuXG5cdFx0Ly9yZWdpc3RlciB0aGUgbm9uLXN0YW5kYXJkIGVhc2VzXG5cdFx0X2Vhc2VSZWcody5TbG93TW8sIFwiU2xvd01vXCIsIFwiZWFzZSxcIik7XG5cdFx0X2Vhc2VSZWcoUm91Z2hFYXNlLCBcIlJvdWdoRWFzZVwiLCBcImVhc2UsXCIpO1xuXHRcdF9lYXNlUmVnKFN0ZXBwZWRFYXNlLCBcIlN0ZXBwZWRFYXNlXCIsIFwiZWFzZSxcIik7XG5cblx0XHRyZXR1cm4gQmFjaztcblx0XHRcblx0fSwgdHJ1ZSk7XG5cblxufSk7XG5cbmlmIChfZ3NTY29wZS5fZ3NEZWZpbmUpIHsgX2dzU2NvcGUuX2dzUXVldWUucG9wKCkoKTsgfSAvL25lY2Vzc2FyeSBpbiBjYXNlIFR3ZWVuTGl0ZSB3YXMgYWxyZWFkeSBsb2FkZWQgc2VwYXJhdGVseS5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQmFzZSBjbGFzc2VzIGxpa2UgVHdlZW5MaXRlLCBTaW1wbGVUaW1lbGluZSwgRWFzZSwgVGlja2VyLCBldGMuXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbihmdW5jdGlvbih3aW5kb3csIG1vZHVsZU5hbWUpIHtcblxuXHRcdFwidXNlIHN0cmljdFwiO1xuXHRcdHZhciBfZXhwb3J0cyA9IHt9LFxuXHRcdFx0X2dsb2JhbHMgPSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIHx8IHdpbmRvdztcblx0XHRpZiAoX2dsb2JhbHMuVHdlZW5MaXRlKSB7XG5cdFx0XHRyZXR1cm47IC8vaW4gY2FzZSB0aGUgY29yZSBzZXQgb2YgY2xhc3NlcyBpcyBhbHJlYWR5IGxvYWRlZCwgZG9uJ3QgaW5zdGFudGlhdGUgdHdpY2UuXG5cdFx0fVxuXHRcdHZhciBfbmFtZXNwYWNlID0gZnVuY3Rpb24obnMpIHtcblx0XHRcdFx0dmFyIGEgPSBucy5zcGxpdChcIi5cIiksXG5cdFx0XHRcdFx0cCA9IF9nbG9iYWxzLCBpO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHBbYVtpXV0gPSBwID0gcFthW2ldXSB8fCB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcDtcblx0XHRcdH0sXG5cdFx0XHRncyA9IF9uYW1lc3BhY2UoXCJjb20uZ3JlZW5zb2NrXCIpLFxuXHRcdFx0X3RpbnlOdW0gPSAwLjAwMDAwMDAwMDEsXG5cdFx0XHRfc2xpY2UgPSBmdW5jdGlvbihhKSB7IC8vZG9uJ3QgdXNlIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRhcmdldCwgMCkgYmVjYXVzZSB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRTggd2l0aCBhIE5vZGVMaXN0IHRoYXQncyByZXR1cm5lZCBieSBxdWVyeVNlbGVjdG9yQWxsKClcblx0XHRcdFx0dmFyIGIgPSBbXSxcblx0XHRcdFx0XHRsID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSAhPT0gbDsgYi5wdXNoKGFbaSsrXSkpIHt9XG5cdFx0XHRcdHJldHVybiBiO1xuXHRcdFx0fSxcblx0XHRcdF9lbXB0eUZ1bmMgPSBmdW5jdGlvbigpIHt9LFxuXHRcdFx0X2lzQXJyYXkgPSAoZnVuY3Rpb24oKSB7IC8vd29ya3MgYXJvdW5kIGlzc3VlcyBpbiBpZnJhbWUgZW52aXJvbm1lbnRzIHdoZXJlIHRoZSBBcnJheSBnbG9iYWwgaXNuJ3Qgc2hhcmVkLCB0aHVzIGlmIHRoZSBvYmplY3Qgb3JpZ2luYXRlcyBpbiBhIGRpZmZlcmVudCB3aW5kb3cvaWZyYW1lLCBcIihvYmogaW5zdGFuY2VvZiBBcnJheSlcIiB3aWxsIGV2YWx1YXRlIGZhbHNlLiBXZSBhZGRlZCBzb21lIHNwZWVkIG9wdGltaXphdGlvbnMgdG8gYXZvaWQgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCkgdW5sZXNzIGl0J3MgYWJzb2x1dGVseSBuZWNlc3NhcnkgYmVjYXVzZSBpdCdzIFZFUlkgc2xvdyAobGlrZSAyMHggc2xvd2VyKVxuXHRcdFx0XHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuXHRcdFx0XHRcdGFycmF5ID0gdG9TdHJpbmcuY2FsbChbXSk7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbihvYmopIHtcblx0XHRcdFx0XHRyZXR1cm4gb2JqICE9IG51bGwgJiYgKG9iaiBpbnN0YW5jZW9mIEFycmF5IHx8ICh0eXBlb2Yob2JqKSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iai5wdXNoICYmIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gYXJyYXkpKTtcblx0XHRcdFx0fTtcblx0XHRcdH0oKSksXG5cdFx0XHRhLCBpLCBwLCBfdGlja2VyLCBfdGlja2VyQWN0aXZlLFxuXHRcdFx0X2RlZkxvb2t1cCA9IHt9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBjb25zdHJ1Y3RvclxuXHRcdFx0ICogRGVmaW5lcyBhIEdyZWVuU29jayBjbGFzcywgb3B0aW9uYWxseSB3aXRoIGFuIGFycmF5IG9mIGRlcGVuZGVuY2llcyB0aGF0IG11c3QgYmUgaW5zdGFudGlhdGVkIGZpcnN0IGFuZCBwYXNzZWQgaW50byB0aGUgZGVmaW5pdGlvbi5cblx0XHRcdCAqIFRoaXMgYWxsb3dzIHVzZXJzIHRvIGxvYWQgR3JlZW5Tb2NrIEpTIGZpbGVzIGluIGFueSBvcmRlciBldmVuIGlmIHRoZXkgaGF2ZSBpbnRlcmRlcGVuZGVuY2llcyAobGlrZSBDU1NQbHVnaW4gZXh0ZW5kcyBUd2VlblBsdWdpbiB3aGljaCBpc1xuXHRcdFx0ICogaW5zaWRlIFR3ZWVuTGl0ZS5qcywgYnV0IGlmIENTU1BsdWdpbiBpcyBsb2FkZWQgZmlyc3QsIGl0IHNob3VsZCB3YWl0IHRvIHJ1biBpdHMgY29kZSB1bnRpbCBUd2VlbkxpdGUuanMgbG9hZHMgYW5kIGluc3RhbnRpYXRlcyBUd2VlblBsdWdpblxuXHRcdFx0ICogYW5kIHRoZW4gcGFzcyBUd2VlblBsdWdpbiB0byBDU1NQbHVnaW4ncyBkZWZpbml0aW9uKS4gVGhpcyBpcyBhbGwgZG9uZSBhdXRvbWF0aWNhbGx5IGFuZCBpbnRlcm5hbGx5LlxuXHRcdFx0ICpcblx0XHRcdCAqIEV2ZXJ5IGRlZmluaXRpb24gd2lsbCBiZSBhZGRlZCB0byBhIFwiY29tLmdyZWVuc29ja1wiIGdsb2JhbCBvYmplY3QgKHR5cGljYWxseSB3aW5kb3csIGJ1dCBpZiBhIHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIG9iamVjdCBpcyBmb3VuZCxcblx0XHRcdCAqIGl0IHdpbGwgZ28gdGhlcmUgYXMgb2YgdjEuNykuIEZvciBleGFtcGxlLCBUd2VlbkxpdGUgd2lsbCBiZSBmb3VuZCBhdCB3aW5kb3cuY29tLmdyZWVuc29jay5Ud2VlbkxpdGUgYW5kIHNpbmNlIGl0J3MgYSBnbG9iYWwgY2xhc3MgdGhhdCBzaG91bGQgYmUgYXZhaWxhYmxlIGFueXdoZXJlLFxuXHRcdFx0ICogaXQgaXMgQUxTTyByZWZlcmVuY2VkIGF0IHdpbmRvdy5Ud2VlbkxpdGUuIEhvd2V2ZXIgc29tZSBjbGFzc2VzIGFyZW4ndCBjb25zaWRlcmVkIGdsb2JhbCwgbGlrZSB0aGUgYmFzZSBjb20uZ3JlZW5zb2NrLmNvcmUuQW5pbWF0aW9uIGNsYXNzLCBzb1xuXHRcdFx0ICogdGhvc2Ugd2lsbCBvbmx5IGJlIGF0IHRoZSBwYWNrYWdlIGxpa2Ugd2luZG93LmNvbS5ncmVlbnNvY2suY29yZS5BbmltYXRpb24uIEFnYWluLCBpZiB5b3UgZGVmaW5lIGEgR3JlZW5Tb2NrR2xvYmFscyBvYmplY3Qgb24gdGhlIHdpbmRvdywgZXZlcnl0aGluZ1xuXHRcdFx0ICogZ2V0cyB0dWNrZWQgbmVhdGx5IGluc2lkZSB0aGVyZSBpbnN0ZWFkIG9mIG9uIHRoZSB3aW5kb3cgZGlyZWN0bHkuIFRoaXMgYWxsb3dzIHlvdSB0byBkbyBhZHZhbmNlZCB0aGluZ3MgbGlrZSBsb2FkIG11bHRpcGxlIHZlcnNpb25zIG9mIEdyZWVuU29ja1xuXHRcdFx0ICogZmlsZXMgYW5kIHB1dCB0aGVtIGludG8gZGlzdGluY3Qgb2JqZWN0cyAoaW1hZ2luZSBhIGJhbm5lciBhZCB1c2VzIGEgbmV3ZXIgdmVyc2lvbiBidXQgdGhlIG1haW4gc2l0ZSB1c2VzIGFuIG9sZGVyIG9uZSkuIEluIHRoYXQgY2FzZSwgeW91IGNvdWxkXG5cdFx0XHQgKiBzYW5kYm94IHRoZSBiYW5uZXIgb25lIGxpa2U6XG5cdFx0XHQgKlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICB2YXIgZ3MgPSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHt9OyAvL3RoZSBuZXdlciB2ZXJzaW9uIHdlJ3JlIGFib3V0IHRvIGxvYWQgY291bGQgbm93IGJlIHJlZmVyZW5jZWQgaW4gYSBcImdzXCIgb2JqZWN0LCBsaWtlIGdzLlR3ZWVuTGl0ZS50byguLi4pLiBVc2Ugd2hhdGV2ZXIgYWxpYXMgeW91IHdhbnQgYXMgbG9uZyBhcyBpdCdzIHVuaXF1ZSwgXCJnc1wiIG9yIFwiYmFubmVyXCIgb3Igd2hhdGV2ZXIuXG5cdFx0XHQgKiA8L3NjcmlwdD5cblx0XHRcdCAqIDxzY3JpcHQgc3JjPVwianMvZ3JlZW5zb2NrL3YxLjcvVHdlZW5NYXguanNcIj48L3NjcmlwdD5cblx0XHRcdCAqIDxzY3JpcHQ+XG5cdFx0XHQgKiAgICAgd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB3aW5kb3cuX2dzUXVldWUgPSB3aW5kb3cuX2dzRGVmaW5lID0gbnVsbDsgLy9yZXNldCBpdCBiYWNrIHRvIG51bGwgKGFsb25nIHdpdGggdGhlIHNwZWNpYWwgX2dzUXVldWUgdmFyaWFibGUpIHNvIHRoYXQgdGhlIG5leHQgbG9hZCBvZiBUd2Vlbk1heCBhZmZlY3RzIHRoZSB3aW5kb3cgYW5kIHdlIGNhbiByZWZlcmVuY2UgdGhpbmdzIGRpcmVjdGx5IGxpa2UgVHdlZW5MaXRlLnRvKC4uLilcblx0XHRcdCAqIDwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdCBzcmM9XCJqcy9ncmVlbnNvY2svdjEuNi9Ud2Vlbk1heC5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICBncy5Ud2VlbkxpdGUudG8oLi4uKTsgLy93b3VsZCB1c2UgdjEuN1xuXHRcdFx0ICogICAgIFR3ZWVuTGl0ZS50byguLi4pOyAvL3dvdWxkIHVzZSB2MS42XG5cdFx0XHQgKiA8L3NjcmlwdD5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IG5zIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIGNsYXNzIGRlZmluaXRpb24sIGxlYXZpbmcgb2ZmIFwiY29tLmdyZWVuc29jay5cIiBhcyB0aGF0J3MgYXNzdW1lZC4gRm9yIGV4YW1wbGUsIFwiVHdlZW5MaXRlXCIgb3IgXCJwbHVnaW5zLkNTU1BsdWdpblwiIG9yIFwiZWFzaW5nLkJhY2tcIi5cblx0XHRcdCAqIEBwYXJhbSB7IUFycmF5LjxzdHJpbmc+fSBkZXBlbmRlbmNpZXMgQW4gYXJyYXkgb2YgZGVwZW5kZW5jaWVzIChkZXNjcmliZWQgYXMgdGhlaXIgbmFtZXNwYWNlcyBtaW51cyBcImNvbS5ncmVlbnNvY2suXCIgcHJlZml4KS4gRm9yIGV4YW1wbGUgW1wiVHdlZW5MaXRlXCIsXCJwbHVnaW5zLlR3ZWVuUGx1Z2luXCIsXCJjb3JlLkFuaW1hdGlvblwiXVxuXHRcdFx0ICogQHBhcmFtIHshZnVuY3Rpb24oKTpPYmplY3R9IGZ1bmMgVGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBhbmQgcGFzc2VkIHRoZSByZXNvbHZlZCBkZXBlbmRlbmNpZXMgd2hpY2ggd2lsbCByZXR1cm4gdGhlIGFjdHVhbCBjbGFzcyBmb3IgdGhpcyBkZWZpbml0aW9uLlxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gZ2xvYmFsIElmIHRydWUsIHRoZSBjbGFzcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBnbG9iYWwgc2NvcGUgKHR5cGljYWxseSB3aW5kb3cgdW5sZXNzIHlvdSBkZWZpbmUgYSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyBvYmplY3QpXG5cdFx0XHQgKi9cblx0XHRcdERlZmluaXRpb24gPSBmdW5jdGlvbihucywgZGVwZW5kZW5jaWVzLCBmdW5jLCBnbG9iYWwpIHtcblx0XHRcdFx0dGhpcy5zYyA9IChfZGVmTG9va3VwW25zXSkgPyBfZGVmTG9va3VwW25zXS5zYyA6IFtdOyAvL3N1YmNsYXNzZXNcblx0XHRcdFx0X2RlZkxvb2t1cFtuc10gPSB0aGlzO1xuXHRcdFx0XHR0aGlzLmdzQ2xhc3MgPSBudWxsO1xuXHRcdFx0XHR0aGlzLmZ1bmMgPSBmdW5jO1xuXHRcdFx0XHR2YXIgX2NsYXNzZXMgPSBbXTtcblx0XHRcdFx0dGhpcy5jaGVjayA9IGZ1bmN0aW9uKGluaXQpIHtcblx0XHRcdFx0XHR2YXIgaSA9IGRlcGVuZGVuY2llcy5sZW5ndGgsXG5cdFx0XHRcdFx0XHRtaXNzaW5nID0gaSxcblx0XHRcdFx0XHRcdGN1ciwgYSwgbiwgY2wsIGhhc01vZHVsZTtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyID0gX2RlZkxvb2t1cFtkZXBlbmRlbmNpZXNbaV1dIHx8IG5ldyBEZWZpbml0aW9uKGRlcGVuZGVuY2llc1tpXSwgW10pKS5nc0NsYXNzKSB7XG5cdFx0XHRcdFx0XHRcdF9jbGFzc2VzW2ldID0gY3VyLmdzQ2xhc3M7XG5cdFx0XHRcdFx0XHRcdG1pc3NpbmctLTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5pdCkge1xuXHRcdFx0XHRcdFx0XHRjdXIuc2MucHVzaCh0aGlzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG1pc3NpbmcgPT09IDAgJiYgZnVuYykge1xuXHRcdFx0XHRcdFx0YSA9IChcImNvbS5ncmVlbnNvY2suXCIgKyBucykuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdFx0biA9IGEucG9wKCk7XG5cdFx0XHRcdFx0XHRjbCA9IF9uYW1lc3BhY2UoYS5qb2luKFwiLlwiKSlbbl0gPSB0aGlzLmdzQ2xhc3MgPSBmdW5jLmFwcGx5KGZ1bmMsIF9jbGFzc2VzKTtcblxuXHRcdFx0XHRcdFx0Ly9leHBvcnRzIHRvIG11bHRpcGxlIGVudmlyb25tZW50c1xuXHRcdFx0XHRcdFx0aWYgKGdsb2JhbCkge1xuXHRcdFx0XHRcdFx0XHRfZ2xvYmFsc1tuXSA9IF9leHBvcnRzW25dID0gY2w7IC8vcHJvdmlkZXMgYSB3YXkgdG8gYXZvaWQgZ2xvYmFsIG5hbWVzcGFjZSBwb2xsdXRpb24uIEJ5IGRlZmF1bHQsIHRoZSBtYWluIGNsYXNzZXMgbGlrZSBUd2VlbkxpdGUsIFBvd2VyMSwgU3Ryb25nLCBldGMuIGFyZSBhZGRlZCB0byB3aW5kb3cgdW5sZXNzIGEgR3JlZW5Tb2NrR2xvYmFscyBpcyBkZWZpbmVkLiBTbyBpZiB5b3Ugd2FudCB0byBoYXZlIHRoaW5ncyBhZGRlZCB0byBhIGN1c3RvbSBvYmplY3QgaW5zdGVhZCwganVzdCBkbyBzb21ldGhpbmcgbGlrZSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHt9IGJlZm9yZSBsb2FkaW5nIGFueSBHcmVlblNvY2sgZmlsZXMuIFlvdSBjYW4gZXZlbiBzZXQgdXAgYW4gYWxpYXMgbGlrZSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHdpbmRvd3MuZ3MgPSB7fSBzbyB0aGF0IHlvdSBjYW4gYWNjZXNzIGV2ZXJ5dGhpbmcgbGlrZSBncy5Ud2VlbkxpdGUuIEFsc28gcmVtZW1iZXIgdGhhdCBBTEwgY2xhc3NlcyBhcmUgYWRkZWQgdG8gdGhlIHdpbmRvdy5jb20uZ3JlZW5zb2NrIG9iamVjdCAoaW4gdGhlaXIgcmVzcGVjdGl2ZSBwYWNrYWdlcywgbGlrZSBjb20uZ3JlZW5zb2NrLmVhc2luZy5Qb3dlcjEsIGNvbS5ncmVlbnNvY2suVHdlZW5MaXRlLCBldGMuKVxuXHRcdFx0XHRcdFx0XHRoYXNNb2R1bGUgPSAodHlwZW9mKG1vZHVsZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpO1xuXHRcdFx0XHRcdFx0XHRpZiAoIWhhc01vZHVsZSAmJiB0eXBlb2YoZGVmaW5lKSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpeyAvL0FNRFxuXHRcdFx0XHRcdFx0XHRcdGRlZmluZSgod2luZG93LkdyZWVuU29ja0FNRFBhdGggPyB3aW5kb3cuR3JlZW5Tb2NrQU1EUGF0aCArIFwiL1wiIDogXCJcIikgKyBucy5zcGxpdChcIi5cIikucG9wKCksIFtdLCBmdW5jdGlvbigpIHsgcmV0dXJuIGNsOyB9KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChoYXNNb2R1bGUpeyAvL25vZGVcblx0XHRcdFx0XHRcdFx0XHRpZiAobnMgPT09IG1vZHVsZU5hbWUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZS5leHBvcnRzID0gX2V4cG9ydHNbbW9kdWxlTmFtZV0gPSBjbDtcblx0XHRcdFx0XHRcdFx0XHRcdGZvciAoaSBpbiBfZXhwb3J0cykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbFtpXSA9IF9leHBvcnRzW2ldO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoX2V4cG9ydHNbbW9kdWxlTmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9leHBvcnRzW21vZHVsZU5hbWVdW25dID0gY2w7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5zYy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNjW2ldLmNoZWNrKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHR0aGlzLmNoZWNrKHRydWUpO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly91c2VkIHRvIGNyZWF0ZSBEZWZpbml0aW9uIGluc3RhbmNlcyAod2hpY2ggYmFzaWNhbGx5IHJlZ2lzdGVycyBhIGNsYXNzIHRoYXQgaGFzIGRlcGVuZGVuY2llcykuXG5cdFx0XHRfZ3NEZWZpbmUgPSB3aW5kb3cuX2dzRGVmaW5lID0gZnVuY3Rpb24obnMsIGRlcGVuZGVuY2llcywgZnVuYywgZ2xvYmFsKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgRGVmaW5pdGlvbihucywgZGVwZW5kZW5jaWVzLCBmdW5jLCBnbG9iYWwpO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly9hIHF1aWNrIHdheSB0byBjcmVhdGUgYSBjbGFzcyB0aGF0IGRvZXNuJ3QgaGF2ZSBhbnkgZGVwZW5kZW5jaWVzLiBSZXR1cm5zIHRoZSBjbGFzcywgYnV0IGZpcnN0IHJlZ2lzdGVycyBpdCBpbiB0aGUgR3JlZW5Tb2NrIG5hbWVzcGFjZSBzbyB0aGF0IG90aGVyIGNsYXNzZXMgY2FuIGdyYWIgaXQgKG90aGVyIGNsYXNzZXMgbWlnaHQgYmUgZGVwZW5kZW50IG9uIHRoZSBjbGFzcykuXG5cdFx0XHRfY2xhc3MgPSBncy5fY2xhc3MgPSBmdW5jdGlvbihucywgZnVuYywgZ2xvYmFsKSB7XG5cdFx0XHRcdGZ1bmMgPSBmdW5jIHx8IGZ1bmN0aW9uKCkge307XG5cdFx0XHRcdF9nc0RlZmluZShucywgW10sIGZ1bmN0aW9uKCl7IHJldHVybiBmdW5jOyB9LCBnbG9iYWwpO1xuXHRcdFx0XHRyZXR1cm4gZnVuYztcblx0XHRcdH07XG5cblx0XHRfZ3NEZWZpbmUuZ2xvYmFscyA9IF9nbG9iYWxzO1xuXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEVhc2VcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRcdHZhciBfYmFzZVBhcmFtcyA9IFswLCAwLCAxLCAxXSxcblx0XHRcdF9ibGFua0FycmF5ID0gW10sXG5cdFx0XHRFYXNlID0gX2NsYXNzKFwiZWFzaW5nLkVhc2VcIiwgZnVuY3Rpb24oZnVuYywgZXh0cmFQYXJhbXMsIHR5cGUsIHBvd2VyKSB7XG5cdFx0XHRcdHRoaXMuX2Z1bmMgPSBmdW5jO1xuXHRcdFx0XHR0aGlzLl90eXBlID0gdHlwZSB8fCAwO1xuXHRcdFx0XHR0aGlzLl9wb3dlciA9IHBvd2VyIHx8IDA7XG5cdFx0XHRcdHRoaXMuX3BhcmFtcyA9IGV4dHJhUGFyYW1zID8gX2Jhc2VQYXJhbXMuY29uY2F0KGV4dHJhUGFyYW1zKSA6IF9iYXNlUGFyYW1zO1xuXHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRfZWFzZU1hcCA9IEVhc2UubWFwID0ge30sXG5cdFx0XHRfZWFzZVJlZyA9IEVhc2UucmVnaXN0ZXIgPSBmdW5jdGlvbihlYXNlLCBuYW1lcywgdHlwZXMsIGNyZWF0ZSkge1xuXHRcdFx0XHR2YXIgbmEgPSBuYW1lcy5zcGxpdChcIixcIiksXG5cdFx0XHRcdFx0aSA9IG5hLmxlbmd0aCxcblx0XHRcdFx0XHR0YSA9ICh0eXBlcyB8fCBcImVhc2VJbixlYXNlT3V0LGVhc2VJbk91dFwiKS5zcGxpdChcIixcIiksXG5cdFx0XHRcdFx0ZSwgbmFtZSwgaiwgdHlwZTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0bmFtZSA9IG5hW2ldO1xuXHRcdFx0XHRcdGUgPSBjcmVhdGUgPyBfY2xhc3MoXCJlYXNpbmcuXCIrbmFtZSwgbnVsbCwgdHJ1ZSkgOiBncy5lYXNpbmdbbmFtZV0gfHwge307XG5cdFx0XHRcdFx0aiA9IHRhLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1qID4gLTEpIHtcblx0XHRcdFx0XHRcdHR5cGUgPSB0YVtqXTtcblx0XHRcdFx0XHRcdF9lYXNlTWFwW25hbWUgKyBcIi5cIiArIHR5cGVdID0gX2Vhc2VNYXBbdHlwZSArIG5hbWVdID0gZVt0eXBlXSA9IGVhc2UuZ2V0UmF0aW8gPyBlYXNlIDogZWFzZVt0eXBlXSB8fCBuZXcgZWFzZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdHAgPSBFYXNlLnByb3RvdHlwZTtcblx0XHRwLl9jYWxjRW5kID0gZmFsc2U7XG5cdFx0cC5nZXRSYXRpbyA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdGlmICh0aGlzLl9mdW5jKSB7XG5cdFx0XHRcdHRoaXMuX3BhcmFtc1swXSA9IHA7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9mdW5jLmFwcGx5KG51bGwsIHRoaXMuX3BhcmFtcyk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdCA9IHRoaXMuX3R5cGUsXG5cdFx0XHRcdHB3ID0gdGhpcy5fcG93ZXIsXG5cdFx0XHRcdHIgPSAodCA9PT0gMSkgPyAxIC0gcCA6ICh0ID09PSAyKSA/IHAgOiAocCA8IDAuNSkgPyBwICogMiA6ICgxIC0gcCkgKiAyO1xuXHRcdFx0aWYgKHB3ID09PSAxKSB7XG5cdFx0XHRcdHIgKj0gcjtcblx0XHRcdH0gZWxzZSBpZiAocHcgPT09IDIpIHtcblx0XHRcdFx0ciAqPSByICogcjtcblx0XHRcdH0gZWxzZSBpZiAocHcgPT09IDMpIHtcblx0XHRcdFx0ciAqPSByICogciAqIHI7XG5cdFx0XHR9IGVsc2UgaWYgKHB3ID09PSA0KSB7XG5cdFx0XHRcdHIgKj0gciAqIHIgKiByICogcjtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodCA9PT0gMSkgPyAxIC0gciA6ICh0ID09PSAyKSA/IHIgOiAocCA8IDAuNSkgPyByIC8gMiA6IDEgLSAociAvIDIpO1xuXHRcdH07XG5cblx0XHQvL2NyZWF0ZSBhbGwgdGhlIHN0YW5kYXJkIGVhc2VzIGxpa2UgTGluZWFyLCBRdWFkLCBDdWJpYywgUXVhcnQsIFF1aW50LCBTdHJvbmcsIFBvd2VyMCwgUG93ZXIxLCBQb3dlcjIsIFBvd2VyMywgYW5kIFBvd2VyNCAoZWFjaCB3aXRoIGVhc2VJbiwgZWFzZU91dCwgYW5kIGVhc2VJbk91dClcblx0XHRhID0gW1wiTGluZWFyXCIsXCJRdWFkXCIsXCJDdWJpY1wiLFwiUXVhcnRcIixcIlF1aW50LFN0cm9uZ1wiXTtcblx0XHRpID0gYS5sZW5ndGg7XG5cdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRwID0gYVtpXStcIixQb3dlclwiK2k7XG5cdFx0XHRfZWFzZVJlZyhuZXcgRWFzZShudWxsLG51bGwsMSxpKSwgcCwgXCJlYXNlT3V0XCIsIHRydWUpO1xuXHRcdFx0X2Vhc2VSZWcobmV3IEVhc2UobnVsbCxudWxsLDIsaSksIHAsIFwiZWFzZUluXCIgKyAoKGkgPT09IDApID8gXCIsZWFzZU5vbmVcIiA6IFwiXCIpKTtcblx0XHRcdF9lYXNlUmVnKG5ldyBFYXNlKG51bGwsbnVsbCwzLGkpLCBwLCBcImVhc2VJbk91dFwiKTtcblx0XHR9XG5cdFx0X2Vhc2VNYXAubGluZWFyID0gZ3MuZWFzaW5nLkxpbmVhci5lYXNlSW47XG5cdFx0X2Vhc2VNYXAuc3dpbmcgPSBncy5lYXNpbmcuUXVhZC5lYXNlSW5PdXQ7IC8vZm9yIGpRdWVyeSBmb2xrc1xuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBFdmVudERpc3BhdGNoZXJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRcdHZhciBFdmVudERpc3BhdGNoZXIgPSBfY2xhc3MoXCJldmVudHMuRXZlbnREaXNwYXRjaGVyXCIsIGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0dGhpcy5fbGlzdGVuZXJzID0ge307XG5cdFx0XHR0aGlzLl9ldmVudFRhcmdldCA9IHRhcmdldCB8fCB0aGlzO1xuXHRcdH0pO1xuXHRcdHAgPSBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlO1xuXG5cdFx0cC5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIHNjb3BlLCB1c2VQYXJhbSwgcHJpb3JpdHkpIHtcblx0XHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRcdHZhciBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLFxuXHRcdFx0XHRpbmRleCA9IDAsXG5cdFx0XHRcdGxpc3RlbmVyLCBpO1xuXHRcdFx0aWYgKHRoaXMgPT09IF90aWNrZXIgJiYgIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobGlzdCA9PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuX2xpc3RlbmVyc1t0eXBlXSA9IGxpc3QgPSBbXTtcblx0XHRcdH1cblx0XHRcdGkgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRsaXN0ZW5lciA9IGxpc3RbaV07XG5cdFx0XHRcdGlmIChsaXN0ZW5lci5jID09PSBjYWxsYmFjayAmJiBsaXN0ZW5lci5zID09PSBzY29wZSkge1xuXHRcdFx0XHRcdGxpc3Quc3BsaWNlKGksIDEpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGluZGV4ID09PSAwICYmIGxpc3RlbmVyLnByIDwgcHJpb3JpdHkpIHtcblx0XHRcdFx0XHRpbmRleCA9IGkgKyAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsaXN0LnNwbGljZShpbmRleCwgMCwge2M6Y2FsbGJhY2ssIHM6c2NvcGUsIHVwOnVzZVBhcmFtLCBwcjpwcmlvcml0eX0pO1xuXHRcdH07XG5cblx0XHRwLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGxpc3QgPSB0aGlzLl9saXN0ZW5lcnNbdHlwZV0sIGk7XG5cdFx0XHRpZiAobGlzdCkge1xuXHRcdFx0XHRpID0gbGlzdC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChsaXN0W2ldLmMgPT09IGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRsaXN0LnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24odHlwZSkge1xuXHRcdFx0dmFyIGxpc3QgPSB0aGlzLl9saXN0ZW5lcnNbdHlwZV0sXG5cdFx0XHRcdGksIHQsIGxpc3RlbmVyO1xuXHRcdFx0aWYgKGxpc3QpIHtcblx0XHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHRpZiAoaSA+IDEpIHtcblx0XHRcdFx0XHRsaXN0ID0gbGlzdC5zbGljZSgwKTsgLy9pbiBjYXNlIGFkZEV2ZW50TGlzdGVuZXIoKSBpcyBjYWxsZWQgZnJvbSB3aXRoaW4gYSBsaXN0ZW5lci9jYWxsYmFjayAob3RoZXJ3aXNlIHRoZSBpbmRleCBjb3VsZCBjaGFuZ2UsIHJlc3VsdGluZyBpbiBhIHNraXApXG5cdFx0XHRcdH1cblx0XHRcdFx0dCA9IHRoaXMuX2V2ZW50VGFyZ2V0O1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRsaXN0ZW5lciA9IGxpc3RbaV07XG5cdFx0XHRcdFx0aWYgKGxpc3RlbmVyKSB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXIudXApIHtcblx0XHRcdFx0XHRcdFx0bGlzdGVuZXIuYy5jYWxsKGxpc3RlbmVyLnMgfHwgdCwge3R5cGU6dHlwZSwgdGFyZ2V0OnR9KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGxpc3RlbmVyLmMuY2FsbChsaXN0ZW5lci5zIHx8IHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRpY2tlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG4gXHRcdHZhciBfcmVxQW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSxcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG5cdFx0XHRfZ2V0VGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge3JldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTt9LFxuXHRcdFx0X2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpO1xuXG5cdFx0Ly9ub3cgdHJ5IHRvIGRldGVybWluZSB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGFuZCBjYW5jZWxBbmltYXRpb25GcmFtZSBmdW5jdGlvbnMgYW5kIGlmIG5vbmUgYXJlIGZvdW5kLCB3ZSdsbCB1c2UgYSBzZXRUaW1lb3V0KCkvY2xlYXJUaW1lb3V0KCkgcG9seWZpbGwuXG5cdFx0YSA9IFtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXTtcblx0XHRpID0gYS5sZW5ndGg7XG5cdFx0d2hpbGUgKC0taSA+IC0xICYmICFfcmVxQW5pbUZyYW1lKSB7XG5cdFx0XHRfcmVxQW5pbUZyYW1lID0gd2luZG93W2FbaV0gKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3dbYVtpXSArIFwiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl0gfHwgd2luZG93W2FbaV0gKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHR9XG5cblx0XHRfY2xhc3MoXCJUaWNrZXJcIiwgZnVuY3Rpb24oZnBzLCB1c2VSQUYpIHtcblx0XHRcdHZhciBfc2VsZiA9IHRoaXMsXG5cdFx0XHRcdF9zdGFydFRpbWUgPSBfZ2V0VGltZSgpLFxuXHRcdFx0XHRfdXNlUkFGID0gKHVzZVJBRiAhPT0gZmFsc2UgJiYgX3JlcUFuaW1GcmFtZSkgPyBcImF1dG9cIiA6IGZhbHNlLFxuXHRcdFx0XHRfbGFnVGhyZXNob2xkID0gNTAwLFxuXHRcdFx0XHRfYWRqdXN0ZWRMYWcgPSAzMyxcblx0XHRcdFx0X3RpY2tXb3JkID0gXCJ0aWNrXCIsIC8vaGVscHMgcmVkdWNlIGdjIGJ1cmRlblxuXHRcdFx0XHRfZnBzLCBfcmVxLCBfaWQsIF9nYXAsIF9uZXh0VGltZSxcblx0XHRcdFx0X3RpY2sgPSBmdW5jdGlvbihtYW51YWwpIHtcblx0XHRcdFx0XHR2YXIgZWxhcHNlZCA9IF9nZXRUaW1lKCkgLSBfbGFzdFVwZGF0ZSxcblx0XHRcdFx0XHRcdG92ZXJsYXAsIGRpc3BhdGNoO1xuXHRcdFx0XHRcdGlmIChlbGFwc2VkID4gX2xhZ1RocmVzaG9sZCkge1xuXHRcdFx0XHRcdFx0X3N0YXJ0VGltZSArPSBlbGFwc2VkIC0gX2FkanVzdGVkTGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRfbGFzdFVwZGF0ZSArPSBlbGFwc2VkO1xuXHRcdFx0XHRcdF9zZWxmLnRpbWUgPSAoX2xhc3RVcGRhdGUgLSBfc3RhcnRUaW1lKSAvIDEwMDA7XG5cdFx0XHRcdFx0b3ZlcmxhcCA9IF9zZWxmLnRpbWUgLSBfbmV4dFRpbWU7XG5cdFx0XHRcdFx0aWYgKCFfZnBzIHx8IG92ZXJsYXAgPiAwIHx8IG1hbnVhbCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0X3NlbGYuZnJhbWUrKztcblx0XHRcdFx0XHRcdF9uZXh0VGltZSArPSBvdmVybGFwICsgKG92ZXJsYXAgPj0gX2dhcCA/IDAuMDA0IDogX2dhcCAtIG92ZXJsYXApO1xuXHRcdFx0XHRcdFx0ZGlzcGF0Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobWFudWFsICE9PSB0cnVlKSB7IC8vbWFrZSBzdXJlIHRoZSByZXF1ZXN0IGlzIG1hZGUgYmVmb3JlIHdlIGRpc3BhdGNoIHRoZSBcInRpY2tcIiBldmVudCBzbyB0aGF0IHRpbWluZyBpcyBtYWludGFpbmVkLiBPdGhlcndpc2UsIGlmIHByb2Nlc3NpbmcgdGhlIFwidGlja1wiIHJlcXVpcmVzIGEgYnVuY2ggb2YgdGltZSAobGlrZSAxNW1zKSBhbmQgd2UncmUgdXNpbmcgYSBzZXRUaW1lb3V0KCkgdGhhdCdzIGJhc2VkIG9uIDE2LjdtcywgaXQnZCB0ZWNobmljYWxseSB0YWtlIDMxLjdtcyBiZXR3ZWVuIGZyYW1lcyBvdGhlcndpc2UuXG5cdFx0XHRcdFx0XHRfaWQgPSBfcmVxKF90aWNrKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGRpc3BhdGNoKSB7XG5cdFx0XHRcdFx0XHRfc2VsZi5kaXNwYXRjaEV2ZW50KF90aWNrV29yZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRFdmVudERpc3BhdGNoZXIuY2FsbChfc2VsZik7XG5cdFx0XHRfc2VsZi50aW1lID0gX3NlbGYuZnJhbWUgPSAwO1xuXHRcdFx0X3NlbGYudGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRfdGljayh0cnVlKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLmxhZ1Ntb290aGluZyA9IGZ1bmN0aW9uKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpIHtcblx0XHRcdFx0X2xhZ1RocmVzaG9sZCA9IHRocmVzaG9sZCB8fCAoMSAvIF90aW55TnVtKTsgLy96ZXJvIHNob3VsZCBiZSBpbnRlcnByZXRlZCBhcyBiYXNpY2FsbHkgdW5saW1pdGVkXG5cdFx0XHRcdF9hZGp1c3RlZExhZyA9IE1hdGgubWluKGFkanVzdGVkTGFnLCBfbGFnVGhyZXNob2xkLCAwKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLnNsZWVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfaWQgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV91c2VSQUYgfHwgIV9jYW5jZWxBbmltRnJhbWUpIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoX2lkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfY2FuY2VsQW5pbUZyYW1lKF9pZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3JlcSA9IF9lbXB0eUZ1bmM7XG5cdFx0XHRcdF9pZCA9IG51bGw7XG5cdFx0XHRcdGlmIChfc2VsZiA9PT0gX3RpY2tlcikge1xuXHRcdFx0XHRcdF90aWNrZXJBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0X3NlbGYud2FrZSA9IGZ1bmN0aW9uKHNlYW1sZXNzKSB7XG5cdFx0XHRcdGlmIChfaWQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRfc2VsZi5zbGVlcCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHNlYW1sZXNzKSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSArPSAtX2xhc3RVcGRhdGUgKyAoX2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpKTtcblx0XHRcdFx0fSBlbHNlIGlmIChfc2VsZi5mcmFtZSA+IDEwKSB7IC8vZG9uJ3QgdHJpZ2dlciBsYWdTbW9vdGhpbmcgaWYgd2UncmUganVzdCB3YWtpbmcgdXAsIGFuZCBtYWtlIHN1cmUgdGhhdCBhdCBsZWFzdCAxMCBmcmFtZXMgaGF2ZSBlbGFwc2VkIGJlY2F1c2Ugb2YgdGhlIGlPUyBidWcgdGhhdCB3ZSB3b3JrIGFyb3VuZCBiZWxvdyB3aXRoIHRoZSAxLjUtc2Vjb25kIHNldFRpbW91dCgpLlxuXHRcdFx0XHRcdF9sYXN0VXBkYXRlID0gX2dldFRpbWUoKSAtIF9sYWdUaHJlc2hvbGQgKyA1O1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9yZXEgPSAoX2ZwcyA9PT0gMCkgPyBfZW1wdHlGdW5jIDogKCFfdXNlUkFGIHx8ICFfcmVxQW5pbUZyYW1lKSA/IGZ1bmN0aW9uKGYpIHsgcmV0dXJuIHNldFRpbWVvdXQoZiwgKChfbmV4dFRpbWUgLSBfc2VsZi50aW1lKSAqIDEwMDAgKyAxKSB8IDApOyB9IDogX3JlcUFuaW1GcmFtZTtcblx0XHRcdFx0aWYgKF9zZWxmID09PSBfdGlja2VyKSB7XG5cdFx0XHRcdFx0X3RpY2tlckFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RpY2soMik7XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi5mcHMgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gX2Zwcztcblx0XHRcdFx0fVxuXHRcdFx0XHRfZnBzID0gdmFsdWU7XG5cdFx0XHRcdF9nYXAgPSAxIC8gKF9mcHMgfHwgNjApO1xuXHRcdFx0XHRfbmV4dFRpbWUgPSB0aGlzLnRpbWUgKyBfZ2FwO1xuXHRcdFx0XHRfc2VsZi53YWtlKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi51c2VSQUYgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gX3VzZVJBRjtcblx0XHRcdFx0fVxuXHRcdFx0XHRfc2VsZi5zbGVlcCgpO1xuXHRcdFx0XHRfdXNlUkFGID0gdmFsdWU7XG5cdFx0XHRcdF9zZWxmLmZwcyhfZnBzKTtcblx0XHRcdH07XG5cdFx0XHRfc2VsZi5mcHMoZnBzKTtcblxuXHRcdFx0Ly9hIGJ1ZyBpbiBpT1MgNiBTYWZhcmkgb2NjYXNpb25hbGx5IHByZXZlbnRzIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZnJvbSB3b3JraW5nIGluaXRpYWxseSwgc28gd2UgdXNlIGEgMS41LXNlY29uZCB0aW1lb3V0IHRoYXQgYXV0b21hdGljYWxseSBmYWxscyBiYWNrIHRvIHNldFRpbWVvdXQoKSBpZiBpdCBzZW5zZXMgdGhpcyBjb25kaXRpb24uXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoX3VzZVJBRiA9PT0gXCJhdXRvXCIgJiYgX3NlbGYuZnJhbWUgPCA1ICYmIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSAhPT0gXCJoaWRkZW5cIikge1xuXHRcdFx0XHRcdF9zZWxmLnVzZVJBRihmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXG5cdFx0cCA9IGdzLlRpY2tlci5wcm90b3R5cGUgPSBuZXcgZ3MuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlcigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBncy5UaWNrZXI7XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFuaW1hdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIEFuaW1hdGlvbiA9IF9jbGFzcyhcImNvcmUuQW5pbWF0aW9uXCIsIGZ1bmN0aW9uKGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHRcdHRoaXMudmFycyA9IHZhcnMgPSB2YXJzIHx8IHt9O1xuXHRcdFx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSBkdXJhdGlvbiB8fCAwO1xuXHRcdFx0XHR0aGlzLl9kZWxheSA9IE51bWJlcih2YXJzLmRlbGF5KSB8fCAwO1xuXHRcdFx0XHR0aGlzLl90aW1lU2NhbGUgPSAxO1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLmRhdGEgPSB2YXJzLmRhdGE7XG5cdFx0XHRcdHRoaXMuX3JldmVyc2VkID0gKHZhcnMucmV2ZXJzZWQgPT09IHRydWUpO1xuXG5cdFx0XHRcdGlmICghX3Jvb3RUaW1lbGluZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHsgLy9zb21lIGJyb3dzZXJzIChsaWtlIGlPUyA2IFNhZmFyaSkgc2h1dCBkb3duIEphdmFTY3JpcHQgZXhlY3V0aW9uIHdoZW4gdGhlIHRhYiBpcyBkaXNhYmxlZCBhbmQgdGhleSBbb2NjYXNpb25hbGx5XSBuZWdsZWN0IHRvIHN0YXJ0IHVwIHJlcXVlc3RBbmltYXRpb25GcmFtZSBhZ2FpbiB3aGVuIHJldHVybmluZyAtIHRoaXMgY29kZSBlbnN1cmVzIHRoYXQgdGhlIGVuZ2luZSBzdGFydHMgdXAgYWdhaW4gcHJvcGVybHkuXG5cdFx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGwgPSB0aGlzLnZhcnMudXNlRnJhbWVzID8gX3Jvb3RGcmFtZXNUaW1lbGluZSA6IF9yb290VGltZWxpbmU7XG5cdFx0XHRcdHRsLmFkZCh0aGlzLCB0bC5fdGltZSk7XG5cblx0XHRcdFx0aWYgKHRoaXMudmFycy5wYXVzZWQpIHtcblx0XHRcdFx0XHR0aGlzLnBhdXNlZCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRfdGlja2VyID0gQW5pbWF0aW9uLnRpY2tlciA9IG5ldyBncy5UaWNrZXIoKTtcblx0XHRwID0gQW5pbWF0aW9uLnByb3RvdHlwZTtcblx0XHRwLl9kaXJ0eSA9IHAuX2djID0gcC5faW5pdHRlZCA9IHAuX3BhdXNlZCA9IGZhbHNlO1xuXHRcdHAuX3RvdGFsVGltZSA9IHAuX3RpbWUgPSAwO1xuXHRcdHAuX3Jhd1ByZXZUaW1lID0gLTE7XG5cdFx0cC5fbmV4dCA9IHAuX2xhc3QgPSBwLl9vblVwZGF0ZSA9IHAuX3RpbWVsaW5lID0gcC50aW1lbGluZSA9IG51bGw7XG5cdFx0cC5fcGF1c2VkID0gZmFsc2U7XG5cblxuXHRcdC8vc29tZSBicm93c2VycyAobGlrZSBpT1MpIG9jY2FzaW9uYWxseSBkcm9wIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZXZlbnQgd2hlbiB0aGUgdXNlciBzd2l0Y2hlcyB0byBhIGRpZmZlcmVudCB0YWIgYW5kIHRoZW4gY29tZXMgYmFjayBhZ2Fpbiwgc28gd2UgdXNlIGEgMi1zZWNvbmQgc2V0VGltZW91dCgpIHRvIHNlbnNlIGlmL3doZW4gdGhhdCBjb25kaXRpb24gb2NjdXJzIGFuZCB0aGVuIHdha2UoKSB0aGUgdGlja2VyLlxuXHRcdHZhciBfY2hlY2tUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfdGlja2VyQWN0aXZlICYmIF9nZXRUaW1lKCkgLSBfbGFzdFVwZGF0ZSA+IDIwMDApIHtcblx0XHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZXRUaW1lb3V0KF9jaGVja1RpbWVvdXQsIDIwMDApO1xuXHRcdFx0fTtcblx0XHRfY2hlY2tUaW1lb3V0KCk7XG5cblxuXHRcdHAucGxheSA9IGZ1bmN0aW9uKGZyb20sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoZnJvbSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuc2Vlayhmcm9tLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKTtcblx0XHR9O1xuXG5cdFx0cC5wYXVzZSA9IGZ1bmN0aW9uKGF0VGltZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChhdFRpbWUgIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoYXRUaW1lLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXVzZWQodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAucmVzdW1lID0gZnVuY3Rpb24oZnJvbSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChmcm9tICE9IG51bGwpIHtcblx0XHRcdFx0dGhpcy5zZWVrKGZyb20sIHN1cHByZXNzRXZlbnRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhdXNlZChmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAuc2VlayA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoTnVtYmVyKHRpbWUpLCBzdXBwcmVzc0V2ZW50cyAhPT0gZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlc3RhcnQgPSBmdW5jdGlvbihpbmNsdWRlRGVsYXksIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKS50b3RhbFRpbWUoaW5jbHVkZURlbGF5ID8gLXRoaXMuX2RlbGF5IDogMCwgKHN1cHByZXNzRXZlbnRzICE9PSBmYWxzZSksIHRydWUpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2UgPSBmdW5jdGlvbihmcm9tLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKGZyb20gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoKGZyb20gfHwgdGhpcy50b3RhbER1cmF0aW9uKCkpLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZCh0cnVlKS5wYXVzZWQoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0Ly9zdHViIC0gd2Ugb3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4gc3ViY2xhc3Nlcy5cblx0XHR9O1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lID0gMDtcblx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0aGlzLl9nYyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAtMTtcblx0XHRcdGlmICh0aGlzLl9nYyB8fCAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLCAvL3RoZSAyIHJvb3QgdGltZWxpbmVzIHdvbid0IGhhdmUgYSBfdGltZWxpbmU7IHRoZXkncmUgYWx3YXlzIGFjdGl2ZS5cblx0XHRcdFx0c3RhcnRUaW1lID0gdGhpcy5fc3RhcnRUaW1lLFxuXHRcdFx0XHRyYXdUaW1lO1xuXHRcdFx0cmV0dXJuICghdGwgfHwgKCF0aGlzLl9nYyAmJiAhdGhpcy5fcGF1c2VkICYmIHRsLmlzQWN0aXZlKCkgJiYgKHJhd1RpbWUgPSB0bC5yYXdUaW1lKCkpID49IHN0YXJ0VGltZSAmJiByYXdUaW1lIDwgc3RhcnRUaW1lICsgdGhpcy50b3RhbER1cmF0aW9uKCkgLyB0aGlzLl90aW1lU2NhbGUpKTtcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uIChlbmFibGVkLCBpZ25vcmVUaW1lbGluZSkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZ2MgPSAhZW5hYmxlZDtcblx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdGlmIChpZ25vcmVUaW1lbGluZSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRpZiAoZW5hYmxlZCAmJiAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLmFkZCh0aGlzLCB0aGlzLl9zdGFydFRpbWUgLSB0aGlzLl9kZWxheSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLl9yZW1vdmUodGhpcywgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24odmFycywgdGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLmtpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQpIHtcblx0XHRcdHRoaXMuX2tpbGwodmFycywgdGFyZ2V0KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl91bmNhY2hlID0gZnVuY3Rpb24oaW5jbHVkZVNlbGYpIHtcblx0XHRcdHZhciB0d2VlbiA9IGluY2x1ZGVTZWxmID8gdGhpcyA6IHRoaXMudGltZWxpbmU7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0dHdlZW4uX2RpcnR5ID0gdHJ1ZTtcblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi50aW1lbGluZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9zd2FwU2VsZkluUGFyYW1zID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHR2YXIgaSA9IHBhcmFtcy5sZW5ndGgsXG5cdFx0XHRcdGNvcHkgPSBwYXJhbXMuY29uY2F0KCk7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKHBhcmFtc1tpXSA9PT0gXCJ7c2VsZn1cIikge1xuXHRcdFx0XHRcdGNvcHlbaV0gPSB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY29weTtcblx0XHR9O1xuXG5cdFx0cC5fY2FsbGJhY2sgPSBmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHR2YXIgdiA9IHRoaXMudmFycyxcblx0XHRcdFx0Y2FsbGJhY2sgPSB2W3R5cGVdLFxuXHRcdFx0XHRwYXJhbXMgPSB2W3R5cGUgKyBcIlBhcmFtc1wiXSxcblx0XHRcdFx0c2NvcGUgPSB2W3R5cGUgKyBcIlNjb3BlXCJdIHx8IHYuY2FsbGJhY2tTY29wZSB8fCB0aGlzLFxuXHRcdFx0XHRsID0gcGFyYW1zID8gcGFyYW1zLmxlbmd0aCA6IDA7XG5cdFx0XHRzd2l0Y2ggKGwpIHsgLy9zcGVlZCBvcHRpbWl6YXRpb247IGNhbGwoKSBpcyBmYXN0ZXIgdGhhbiBhcHBseSgpIHNvIHVzZSBpdCB3aGVuIHRoZXJlIGFyZSBvbmx5IGEgZmV3IHBhcmFtZXRlcnMgKHdoaWNoIGlzIGJ5IGZhciBtb3N0IGNvbW1vbikuIFByZXZpb3VzbHkgd2Ugc2ltcGx5IGRpZCB2YXIgdiA9IHRoaXMudmFyczsgdlt0eXBlXS5hcHBseSh2W3R5cGUgKyBcIlNjb3BlXCJdIHx8IHYuY2FsbGJhY2tTY29wZSB8fCB0aGlzLCB2W3R5cGUgKyBcIlBhcmFtc1wiXSB8fCBfYmxhbmtBcnJheSk7XG5cdFx0XHRcdGNhc2UgMDogY2FsbGJhY2suY2FsbChzY29wZSk7IGJyZWFrO1xuXHRcdFx0XHRjYXNlIDE6IGNhbGxiYWNrLmNhbGwoc2NvcGUsIHBhcmFtc1swXSk7IGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI6IGNhbGxiYWNrLmNhbGwoc2NvcGUsIHBhcmFtc1swXSwgcGFyYW1zWzFdKTsgYnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6IGNhbGxiYWNrLmFwcGx5KHNjb3BlLCBwYXJhbXMpO1xuXHRcdFx0fVxuXHRcdH07XG5cbi8vLS0tLUFuaW1hdGlvbiBnZXR0ZXJzL3NldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdHAuZXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlKSB7XG5cdFx0XHRpZiAoKHR5cGUgfHwgXCJcIikuc3Vic3RyKDAsMikgPT09IFwib25cIikge1xuXHRcdFx0XHR2YXIgdiA9IHRoaXMudmFycztcblx0XHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdlt0eXBlXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRlbGV0ZSB2W3R5cGVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZbdHlwZV0gPSBjYWxsYmFjaztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlBhcmFtc1wiXSA9IChfaXNBcnJheShwYXJhbXMpICYmIHBhcmFtcy5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikgIT09IC0xKSA/IHRoaXMuX3N3YXBTZWxmSW5QYXJhbXMocGFyYW1zKSA6IHBhcmFtcztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlNjb3BlXCJdID0gc2NvcGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGUgPT09IFwib25VcGRhdGVcIikge1xuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2s7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmRlbGF5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZGVsYXk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0dGhpcy5zdGFydFRpbWUoIHRoaXMuX3N0YXJ0VGltZSArIHZhbHVlIC0gdGhpcy5fZGVsYXkgKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2RlbGF5ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5kdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uID0gdmFsdWU7XG5cdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpOyAvL3RydWUgaW4gY2FzZSBpdCdzIGEgVHdlZW5NYXggb3IgVGltZWxpbmVNYXggdGhhdCBoYXMgYSByZXBlYXQgLSB3ZSdsbCBuZWVkIHRvIHJlZnJlc2ggdGhlIHRvdGFsRHVyYXRpb24uXG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIGlmICh0aGlzLl90aW1lID4gMCkgaWYgKHRoaXMuX3RpbWUgPCB0aGlzLl9kdXJhdGlvbikgaWYgKHZhbHVlICE9PSAwKSB7XG5cdFx0XHRcdHRoaXMudG90YWxUaW1lKHRoaXMuX3RvdGFsVGltZSAqICh2YWx1ZSAvIHRoaXMuX2R1cmF0aW9uKSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RvdGFsRHVyYXRpb24gOiB0aGlzLmR1cmF0aW9uKHZhbHVlKTtcblx0XHR9O1xuXG5cdFx0cC50aW1lID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0dGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoKHZhbHVlID4gdGhpcy5fZHVyYXRpb24pID8gdGhpcy5fZHVyYXRpb24gOiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsVGltZSA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCB1bmNhcHBlZCkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90b3RhbFRpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwICYmICF1bmNhcHBlZCkge1xuXHRcdFx0XHRcdHRpbWUgKz0gdGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHRvdGFsRHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uLFxuXHRcdFx0XHRcdFx0dGwgPSB0aGlzLl90aW1lbGluZTtcblx0XHRcdFx0XHRpZiAodGltZSA+IHRvdGFsRHVyYXRpb24gJiYgIXVuY2FwcGVkKSB7XG5cdFx0XHRcdFx0XHR0aW1lID0gdG90YWxEdXJhdGlvbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gKHRoaXMuX3BhdXNlZCA/IHRoaXMuX3BhdXNlVGltZSA6IHRsLl90aW1lKSAtICgoIXRoaXMuX3JldmVyc2VkID8gdGltZSA6IHRvdGFsRHVyYXRpb24gLSB0aW1lKSAvIHRoaXMuX3RpbWVTY2FsZSk7XG5cdFx0XHRcdFx0aWYgKCF0bC5fZGlydHkpIHsgLy9mb3IgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQuIElmIHRoZSBwYXJlbnQncyBjYWNoZSBpcyBhbHJlYWR5IGRpcnR5LCBpdCBhbHJlYWR5IHRvb2sgY2FyZSBvZiBtYXJraW5nIHRoZSBhbmNlc3RvcnMgYXMgZGlydHkgdG9vLCBzbyBza2lwIHRoZSBmdW5jdGlvbiBjYWxsIGhlcmUuXG5cdFx0XHRcdFx0XHR0aGlzLl91bmNhY2hlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pbiBjYXNlIGFueSBvZiB0aGUgYW5jZXN0b3IgdGltZWxpbmVzIGhhZCBjb21wbGV0ZWQgYnV0IHNob3VsZCBub3cgYmUgZW5hYmxlZCwgd2Ugc2hvdWxkIHJlc2V0IHRoZWlyIHRvdGFsVGltZSgpIHdoaWNoIHdpbGwgYWxzbyBlbnN1cmUgdGhhdCB0aGV5J3JlIGxpbmVkIHVwIHByb3Blcmx5IGFuZCBlbmFibGVkLiBTa2lwIGZvciBhbmltYXRpb25zIHRoYXQgYXJlIG9uIHRoZSByb290ICh3YXN0ZWZ1bCkuIEV4YW1wbGU6IGEgVGltZWxpbmVMaXRlLmV4cG9ydFJvb3QoKSBpcyBwZXJmb3JtZWQgd2hlbiB0aGVyZSdzIGEgcGF1c2VkIHR3ZWVuIG9uIHRoZSByb290LCB0aGUgZXhwb3J0IHdpbGwgbm90IGNvbXBsZXRlIHVudGlsIHRoYXQgdHdlZW4gaXMgdW5wYXVzZWQsIGJ1dCBpbWFnaW5lIGEgY2hpbGQgZ2V0cyByZXN0YXJ0ZWQgbGF0ZXIsIGFmdGVyIGFsbCBbdW5wYXVzZWRdIHR3ZWVucyBoYXZlIGNvbXBsZXRlZC4gVGhlIHN0YXJ0VGltZSBvZiB0aGF0IGNoaWxkIHdvdWxkIGdldCBwdXNoZWQgb3V0LCBidXQgb25lIG9mIHRoZSBhbmNlc3RvcnMgbWF5IGhhdmUgY29tcGxldGVkLlxuXHRcdFx0XHRcdGlmICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHRsLl90aW1lbGluZS5fdGltZSAhPT0gKHRsLl9zdGFydFRpbWUgKyB0bC5fdG90YWxUaW1lKSAvIHRsLl90aW1lU2NhbGUpIHtcblx0XHRcdFx0XHRcdFx0XHR0bC50b3RhbFRpbWUodGwuX3RvdGFsVGltZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGwgPSB0bC5fdGltZWxpbmU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl90b3RhbFRpbWUgIT09IHRpbWUgfHwgdGhpcy5fZHVyYXRpb24gPT09IDApIHtcblx0XHRcdFx0XHRpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZmFsc2UpO1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIHNvbWVvbmUgY2FsbHMgc2VlaygpIG9yIHRpbWUoKSBvciBwcm9ncmVzcygpLCB0aGV5IGV4cGVjdCBhbiBpbW1lZGlhdGUgcmVuZGVyLlxuXHRcdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnByb2dyZXNzID0gcC50b3RhbFByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHR2YXIgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uKCk7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IChkdXJhdGlvbiA/IHRoaXMuX3RpbWUgLyBkdXJhdGlvbiA6IHRoaXMucmF0aW8pIDogdGhpcy50b3RhbFRpbWUoZHVyYXRpb24gKiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnN0YXJ0VGltZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG5cdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAodGhpcy50aW1lbGluZSkgaWYgKHRoaXMudGltZWxpbmUuX3NvcnRDaGlsZHJlbikge1xuXHRcdFx0XHRcdHRoaXMudGltZWxpbmUuYWRkKHRoaXMsIHZhbHVlIC0gdGhpcy5fZGVsYXkpOyAvL2Vuc3VyZXMgdGhhdCBhbnkgbmVjZXNzYXJ5IHJlLXNlcXVlbmNpbmcgb2YgQW5pbWF0aW9ucyBpbiB0aGUgdGltZWxpbmUgb2NjdXJzIHRvIG1ha2Ugc3VyZSB0aGUgcmVuZGVyaW5nIG9yZGVyIGlzIGNvcnJlY3QuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmVuZFRpbWUgPSBmdW5jdGlvbihpbmNsdWRlUmVwZWF0cykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZSArICgoaW5jbHVkZVJlcGVhdHMgIT0gZmFsc2UpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLmR1cmF0aW9uKCkpIC8gdGhpcy5fdGltZVNjYWxlO1xuXHRcdH07XG5cblx0XHRwLnRpbWVTY2FsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdH1cblx0XHRcdHZhbHVlID0gdmFsdWUgfHwgX3RpbnlOdW07IC8vY2FuJ3QgYWxsb3cgemVybyBiZWNhdXNlIGl0J2xsIHRocm93IHRoZSBtYXRoIG9mZlxuXHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lICYmIHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdHZhciBwYXVzZVRpbWUgPSB0aGlzLl9wYXVzZVRpbWUsXG5cdFx0XHRcdFx0dCA9IChwYXVzZVRpbWUgfHwgcGF1c2VUaW1lID09PSAwKSA/IHBhdXNlVGltZSA6IHRoaXMuX3RpbWVsaW5lLnRvdGFsVGltZSgpO1xuXHRcdFx0XHR0aGlzLl9zdGFydFRpbWUgPSB0IC0gKCh0IC0gdGhpcy5fc3RhcnRUaW1lKSAqIHRoaXMuX3RpbWVTY2FsZSAvIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0dGhpcy5fcmV2ZXJzZWQgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy50b3RhbFRpbWUoKCh0aGlzLl90aW1lbGluZSAmJiAhdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgLSB0aGlzLl90b3RhbFRpbWUgOiB0aGlzLl90b3RhbFRpbWUpLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnBhdXNlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3BhdXNlZDtcblx0XHRcdH1cblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLFxuXHRcdFx0XHRyYXcsIGVsYXBzZWQ7XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcGF1c2VkKSBpZiAodGwpIHtcblx0XHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlICYmICF2YWx1ZSkge1xuXHRcdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJhdyA9IHRsLnJhd1RpbWUoKTtcblx0XHRcdFx0ZWxhcHNlZCA9IHJhdyAtIHRoaXMuX3BhdXNlVGltZTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiB0bC5zbW9vdGhDaGlsZFRpbWluZykge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSArPSBlbGFwc2VkO1xuXHRcdFx0XHRcdHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3BhdXNlVGltZSA9IHZhbHVlID8gcmF3IDogbnVsbDtcblx0XHRcdFx0dGhpcy5fcGF1c2VkID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiBlbGFwc2VkICE9PSAwICYmIHRoaXMuX2luaXR0ZWQgJiYgdGhpcy5kdXJhdGlvbigpKSB7XG5cdFx0XHRcdFx0cmF3ID0gdGwuc21vb3RoQ2hpbGRUaW1pbmcgPyB0aGlzLl90b3RhbFRpbWUgOiAocmF3IC0gdGhpcy5fc3RhcnRUaW1lKSAvIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcihyYXcsIChyYXcgPT09IHRoaXMuX3RvdGFsVGltZSksIHRydWUpOyAvL2luIGNhc2UgdGhlIHRhcmdldCdzIHByb3BlcnRpZXMgY2hhbmdlZCB2aWEgc29tZSBvdGhlciB0d2VlbiBvciBtYW51YWwgdXBkYXRlIGJ5IHRoZSB1c2VyLCB3ZSBzaG91bGQgZm9yY2UgYSByZW5kZXIuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9nYyAmJiAhdmFsdWUpIHtcblx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBTaW1wbGVUaW1lbGluZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIFNpbXBsZVRpbWVsaW5lID0gX2NsYXNzKFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLCBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHRBbmltYXRpb24uY2FsbCh0aGlzLCAwLCB2YXJzKTtcblx0XHRcdHRoaXMuYXV0b1JlbW92ZUNoaWxkcmVuID0gdGhpcy5zbW9vdGhDaGlsZFRpbWluZyA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRwID0gU2ltcGxlVGltZWxpbmUucHJvdG90eXBlID0gbmV3IEFuaW1hdGlvbigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBTaW1wbGVUaW1lbGluZTtcblx0XHRwLmtpbGwoKS5fZ2MgPSBmYWxzZTtcblx0XHRwLl9maXJzdCA9IHAuX2xhc3QgPSBwLl9yZWNlbnQgPSBudWxsO1xuXHRcdHAuX3NvcnRDaGlsZHJlbiA9IGZhbHNlO1xuXG5cdFx0cC5hZGQgPSBwLmluc2VydCA9IGZ1bmN0aW9uKGNoaWxkLCBwb3NpdGlvbiwgYWxpZ24sIHN0YWdnZXIpIHtcblx0XHRcdHZhciBwcmV2VHdlZW4sIHN0O1xuXHRcdFx0Y2hpbGQuX3N0YXJ0VGltZSA9IE51bWJlcihwb3NpdGlvbiB8fCAwKSArIGNoaWxkLl9kZWxheTtcblx0XHRcdGlmIChjaGlsZC5fcGF1c2VkKSBpZiAodGhpcyAhPT0gY2hpbGQuX3RpbWVsaW5lKSB7IC8vd2Ugb25seSBhZGp1c3QgdGhlIF9wYXVzZVRpbWUgaWYgaXQgd2Fzbid0IGluIHRoaXMgdGltZWxpbmUgYWxyZWFkeS4gUmVtZW1iZXIsIHNvbWV0aW1lcyBhIHR3ZWVuIHdpbGwgYmUgaW5zZXJ0ZWQgYWdhaW4gaW50byB0aGUgc2FtZSB0aW1lbGluZSB3aGVuIGl0cyBzdGFydFRpbWUgaXMgY2hhbmdlZCBzbyB0aGF0IHRoZSB0d2VlbnMgaW4gdGhlIFRpbWVsaW5lTGl0ZS9NYXggYXJlIHJlLW9yZGVyZWQgcHJvcGVybHkgaW4gdGhlIGxpbmtlZCBsaXN0IChzbyBldmVyeXRoaW5nIHJlbmRlcnMgaW4gdGhlIHByb3BlciBvcmRlcikuXG5cdFx0XHRcdGNoaWxkLl9wYXVzZVRpbWUgPSBjaGlsZC5fc3RhcnRUaW1lICsgKCh0aGlzLnJhd1RpbWUoKSAtIGNoaWxkLl9zdGFydFRpbWUpIC8gY2hpbGQuX3RpbWVTY2FsZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hpbGQudGltZWxpbmUpIHtcblx0XHRcdFx0Y2hpbGQudGltZWxpbmUuX3JlbW92ZShjaGlsZCwgdHJ1ZSk7IC8vcmVtb3ZlcyBmcm9tIGV4aXN0aW5nIHRpbWVsaW5lIHNvIHRoYXQgaXQgY2FuIGJlIHByb3Blcmx5IGFkZGVkIHRvIHRoaXMgb25lLlxuXHRcdFx0fVxuXHRcdFx0Y2hpbGQudGltZWxpbmUgPSBjaGlsZC5fdGltZWxpbmUgPSB0aGlzO1xuXHRcdFx0aWYgKGNoaWxkLl9nYykge1xuXHRcdFx0XHRjaGlsZC5fZW5hYmxlZCh0cnVlLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHByZXZUd2VlbiA9IHRoaXMuX2xhc3Q7XG5cdFx0XHRpZiAodGhpcy5fc29ydENoaWxkcmVuKSB7XG5cdFx0XHRcdHN0ID0gY2hpbGQuX3N0YXJ0VGltZTtcblx0XHRcdFx0d2hpbGUgKHByZXZUd2VlbiAmJiBwcmV2VHdlZW4uX3N0YXJ0VGltZSA+IHN0KSB7XG5cdFx0XHRcdFx0cHJldlR3ZWVuID0gcHJldlR3ZWVuLl9wcmV2O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldlR3ZWVuKSB7XG5cdFx0XHRcdGNoaWxkLl9uZXh0ID0gcHJldlR3ZWVuLl9uZXh0O1xuXHRcdFx0XHRwcmV2VHdlZW4uX25leHQgPSBjaGlsZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNoaWxkLl9uZXh0ID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdHRoaXMuX2ZpcnN0ID0gY2hpbGQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hpbGQuX25leHQpIHtcblx0XHRcdFx0Y2hpbGQuX25leHQuX3ByZXYgPSBjaGlsZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX2xhc3QgPSBjaGlsZDtcblx0XHRcdH1cblx0XHRcdGNoaWxkLl9wcmV2ID0gcHJldlR3ZWVuO1xuXHRcdFx0dGhpcy5fcmVjZW50ID0gY2hpbGQ7XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9yZW1vdmUgPSBmdW5jdGlvbih0d2Vlbiwgc2tpcERpc2FibGUpIHtcblx0XHRcdGlmICh0d2Vlbi50aW1lbGluZSA9PT0gdGhpcykge1xuXHRcdFx0XHRpZiAoIXNraXBEaXNhYmxlKSB7XG5cdFx0XHRcdFx0dHdlZW4uX2VuYWJsZWQoZmFsc2UsIHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR3ZWVuLl9wcmV2KSB7XG5cdFx0XHRcdFx0dHdlZW4uX3ByZXYuX25leHQgPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdCA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdCA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0d2Vlbi5fbmV4dCkge1xuXHRcdFx0XHRcdHR3ZWVuLl9uZXh0Ll9wcmV2ID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbGFzdCA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHR0aGlzLl9sYXN0ID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4uX25leHQgPSB0d2Vlbi5fcHJldiA9IHR3ZWVuLnRpbWVsaW5lID0gbnVsbDtcblx0XHRcdFx0aWYgKHR3ZWVuID09PSB0aGlzLl9yZWNlbnQpIHtcblx0XHRcdFx0XHR0aGlzLl9yZWNlbnQgPSB0aGlzLl9sYXN0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdCxcblx0XHRcdFx0bmV4dDtcblx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSA9IHRpbWU7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9uZXh0OyAvL3JlY29yZCBpdCBoZXJlIGJlY2F1c2UgdGhlIHZhbHVlIGNvdWxkIGNoYW5nZSBhZnRlciByZW5kZXJpbmcuLi5cblx0XHRcdFx0aWYgKHR3ZWVuLl9hY3RpdmUgfHwgKHRpbWUgPj0gdHdlZW4uX3N0YXJ0VGltZSAmJiAhdHdlZW4uX3BhdXNlZCkpIHtcblx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKCghdHdlZW4uX2RpcnR5KSA/IHR3ZWVuLl90b3RhbER1cmF0aW9uIDogdHdlZW4udG90YWxEdXJhdGlvbigpKSAtICgodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5yYXdUaW1lID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fdG90YWxUaW1lO1xuXHRcdH07XG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUd2VlbkxpdGVcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRcdHZhciBUd2VlbkxpdGUgPSBfY2xhc3MoXCJUd2VlbkxpdGVcIiwgZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0XHRBbmltYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0XHRcdHRoaXMucmVuZGVyID0gVHdlZW5MaXRlLnByb3RvdHlwZS5yZW5kZXI7IC8vc3BlZWQgb3B0aW1pemF0aW9uIChhdm9pZCBwcm90b3R5cGUgbG9va3VwIG9uIHRoaXMgXCJob3RcIiBtZXRob2QpXG5cblx0XHRcdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhyb3cgXCJDYW5ub3QgdHdlZW4gYSBudWxsIHRhcmdldC5cIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0ID0gKHR5cGVvZih0YXJnZXQpICE9PSBcInN0cmluZ1wiKSA/IHRhcmdldCA6IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnZXQpIHx8IHRhcmdldDtcblxuXHRcdFx0XHR2YXIgaXNTZWxlY3RvciA9ICh0YXJnZXQuanF1ZXJ5IHx8ICh0YXJnZXQubGVuZ3RoICYmIHRhcmdldCAhPT0gd2luZG93ICYmIHRhcmdldFswXSAmJiAodGFyZ2V0WzBdID09PSB3aW5kb3cgfHwgKHRhcmdldFswXS5ub2RlVHlwZSAmJiB0YXJnZXRbMF0uc3R5bGUgJiYgIXRhcmdldC5ub2RlVHlwZSkpKSksXG5cdFx0XHRcdFx0b3ZlcndyaXRlID0gdGhpcy52YXJzLm92ZXJ3cml0ZSxcblx0XHRcdFx0XHRpLCB0YXJnLCB0YXJnZXRzO1xuXG5cdFx0XHRcdHRoaXMuX292ZXJ3cml0ZSA9IG92ZXJ3cml0ZSA9IChvdmVyd3JpdGUgPT0gbnVsbCkgPyBfb3ZlcndyaXRlTG9va3VwW1R3ZWVuTGl0ZS5kZWZhdWx0T3ZlcndyaXRlXSA6ICh0eXBlb2Yob3ZlcndyaXRlKSA9PT0gXCJudW1iZXJcIikgPyBvdmVyd3JpdGUgPj4gMCA6IF9vdmVyd3JpdGVMb29rdXBbb3ZlcndyaXRlXTtcblxuXHRcdFx0XHRpZiAoKGlzU2VsZWN0b3IgfHwgdGFyZ2V0IGluc3RhbmNlb2YgQXJyYXkgfHwgKHRhcmdldC5wdXNoICYmIF9pc0FycmF5KHRhcmdldCkpKSAmJiB0eXBlb2YodGFyZ2V0WzBdKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdHRoaXMuX3RhcmdldHMgPSB0YXJnZXRzID0gX3NsaWNlKHRhcmdldCk7ICAvL2Rvbid0IHVzZSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0YXJnZXQsIDApIGJlY2F1c2UgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUU4IHdpdGggYSBOb2RlTGlzdCB0aGF0J3MgcmV0dXJuZWQgYnkgcXVlcnlTZWxlY3RvckFsbCgpXG5cdFx0XHRcdFx0dGhpcy5fcHJvcExvb2t1cCA9IFtdO1xuXHRcdFx0XHRcdHRoaXMuX3NpYmxpbmdzID0gW107XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHRhcmcgPSB0YXJnZXRzW2ldO1xuXHRcdFx0XHRcdFx0aWYgKCF0YXJnKSB7XG5cdFx0XHRcdFx0XHRcdHRhcmdldHMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodGFyZykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdFx0dGFyZyA9IHRhcmdldHNbaS0tXSA9IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnKTsgLy9pbiBjYXNlIGl0J3MgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mKHRhcmcpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5zcGxpY2UoaSsxLCAxKTsgLy90byBhdm9pZCBhbiBlbmRsZXNzIGxvb3AgKGNhbid0IGltYWdpbmUgd2h5IHRoZSBzZWxlY3RvciB3b3VsZCByZXR1cm4gYSBzdHJpbmcsIGJ1dCBqdXN0IGluIGNhc2UpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRhcmcubGVuZ3RoICYmIHRhcmcgIT09IHdpbmRvdyAmJiB0YXJnWzBdICYmICh0YXJnWzBdID09PSB3aW5kb3cgfHwgKHRhcmdbMF0ubm9kZVR5cGUgJiYgdGFyZ1swXS5zdHlsZSAmJiAhdGFyZy5ub2RlVHlwZSkpKSB7IC8vaW4gY2FzZSB0aGUgdXNlciBpcyBwYXNzaW5nIGluIGFuIGFycmF5IG9mIHNlbGVjdG9yIG9iamVjdHMgKGxpa2UgalF1ZXJ5IG9iamVjdHMpLCB3ZSBuZWVkIHRvIGNoZWNrIG9uZSBtb3JlIGxldmVsIGFuZCBwdWxsIHRoaW5ncyBvdXQgaWYgbmVjZXNzYXJ5LiBBbHNvIG5vdGUgdGhhdCA8c2VsZWN0PiBlbGVtZW50cyBwYXNzIGFsbCB0aGUgY3JpdGVyaWEgcmVnYXJkaW5nIGxlbmd0aCBhbmQgdGhlIGZpcnN0IGNoaWxkIGhhdmluZyBzdHlsZSwgc28gd2UgbXVzdCBhbHNvIGNoZWNrIHRvIGVuc3VyZSB0aGUgdGFyZ2V0IGlzbid0IGFuIEhUTUwgbm9kZSBpdHNlbGYuXG5cdFx0XHRcdFx0XHRcdHRhcmdldHMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3RhcmdldHMgPSB0YXJnZXRzID0gdGFyZ2V0cy5jb25jYXQoX3NsaWNlKHRhcmcpKTtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9zaWJsaW5nc1tpXSA9IF9yZWdpc3Rlcih0YXJnLCB0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRpZiAob3ZlcndyaXRlID09PSAxKSBpZiAodGhpcy5fc2libGluZ3NbaV0ubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRfYXBwbHlPdmVyd3JpdGUodGFyZywgdGhpcywgbnVsbCwgMSwgdGhpcy5fc2libGluZ3NbaV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3Byb3BMb29rdXAgPSB7fTtcblx0XHRcdFx0XHR0aGlzLl9zaWJsaW5ncyA9IF9yZWdpc3Rlcih0YXJnZXQsIHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0XHRpZiAob3ZlcndyaXRlID09PSAxKSBpZiAodGhpcy5fc2libGluZ3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0X2FwcGx5T3ZlcndyaXRlKHRhcmdldCwgdGhpcywgbnVsbCwgMSwgdGhpcy5fc2libGluZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciB8fCAoZHVyYXRpb24gPT09IDAgJiYgdGhpcy5fZGVsYXkgPT09IDAgJiYgdGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciAhPT0gZmFsc2UpKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IC1fdGlueU51bTsgLy9mb3JjZXMgYSByZW5kZXIgd2l0aG91dCBoYXZpbmcgdG8gc2V0IHRoZSByZW5kZXIoKSBcImZvcmNlXCIgcGFyYW1ldGVyIHRvIHRydWUgYmVjYXVzZSB3ZSB3YW50IHRvIGFsbG93IGxhenlpbmcgYnkgZGVmYXVsdCAodXNpbmcgdGhlIFwiZm9yY2VcIiBwYXJhbWV0ZXIgYWx3YXlzIGZvcmNlcyBhbiBpbW1lZGlhdGUgZnVsbCByZW5kZXIpXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXIoTWF0aC5taW4oMCwgLXRoaXMuX2RlbGF5KSk7IC8vaW4gY2FzZSBkZWxheSBpcyBuZWdhdGl2ZVxuXHRcdFx0XHR9XG5cdFx0XHR9LCB0cnVlKSxcblx0XHRcdF9pc1NlbGVjdG9yID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHRyZXR1cm4gKHYgJiYgdi5sZW5ndGggJiYgdiAhPT0gd2luZG93ICYmIHZbMF0gJiYgKHZbMF0gPT09IHdpbmRvdyB8fCAodlswXS5ub2RlVHlwZSAmJiB2WzBdLnN0eWxlICYmICF2Lm5vZGVUeXBlKSkpOyAvL3dlIGNhbm5vdCBjaGVjayBcIm5vZGVUeXBlXCIgaWYgdGhlIHRhcmdldCBpcyB3aW5kb3cgZnJvbSB3aXRoaW4gYW4gaWZyYW1lLCBvdGhlcndpc2UgaXQgd2lsbCB0cmlnZ2VyIGEgc2VjdXJpdHkgZXJyb3IgaW4gc29tZSBicm93c2VycyBsaWtlIEZpcmVmb3guXG5cdFx0XHR9LFxuXHRcdFx0X2F1dG9DU1MgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQpIHtcblx0XHRcdFx0dmFyIGNzcyA9IHt9LFxuXHRcdFx0XHRcdHA7XG5cdFx0XHRcdGZvciAocCBpbiB2YXJzKSB7XG5cdFx0XHRcdFx0aWYgKCFfcmVzZXJ2ZWRQcm9wc1twXSAmJiAoIShwIGluIHRhcmdldCkgfHwgcCA9PT0gXCJ0cmFuc2Zvcm1cIiB8fCBwID09PSBcInhcIiB8fCBwID09PSBcInlcIiB8fCBwID09PSBcIndpZHRoXCIgfHwgcCA9PT0gXCJoZWlnaHRcIiB8fCBwID09PSBcImNsYXNzTmFtZVwiIHx8IHAgPT09IFwiYm9yZGVyXCIpICYmICghX3BsdWdpbnNbcF0gfHwgKF9wbHVnaW5zW3BdICYmIF9wbHVnaW5zW3BdLl9hdXRvQ1NTKSkpIHsgLy9ub3RlOiA8aW1nPiBlbGVtZW50cyBjb250YWluIHJlYWQtb25seSBcInhcIiBhbmQgXCJ5XCIgcHJvcGVydGllcy4gV2Ugc2hvdWxkIGFsc28gcHJpb3JpdGl6ZSBlZGl0aW5nIGNzcyB3aWR0aC9oZWlnaHQgcmF0aGVyIHRoYW4gdGhlIGVsZW1lbnQncyBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRcdFx0Y3NzW3BdID0gdmFyc1twXTtcblx0XHRcdFx0XHRcdGRlbGV0ZSB2YXJzW3BdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR2YXJzLmNzcyA9IGNzcztcblx0XHRcdH07XG5cblx0XHRwID0gVHdlZW5MaXRlLnByb3RvdHlwZSA9IG5ldyBBbmltYXRpb24oKTtcblx0XHRwLmNvbnN0cnVjdG9yID0gVHdlZW5MaXRlO1xuXHRcdHAua2lsbCgpLl9nYyA9IGZhbHNlO1xuXG4vLy0tLS1Ud2VlbkxpdGUgZGVmYXVsdHMsIG92ZXJ3cml0ZSBtYW5hZ2VtZW50LCBhbmQgcm9vdCB1cGRhdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdHAucmF0aW8gPSAwO1xuXHRcdHAuX2ZpcnN0UFQgPSBwLl90YXJnZXRzID0gcC5fb3ZlcndyaXR0ZW5Qcm9wcyA9IHAuX3N0YXJ0QXQgPSBudWxsO1xuXHRcdHAuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQgPSBwLl9sYXp5ID0gZmFsc2U7XG5cblx0XHRUd2VlbkxpdGUudmVyc2lvbiA9IFwiMS4xOS4wXCI7XG5cdFx0VHdlZW5MaXRlLmRlZmF1bHRFYXNlID0gcC5fZWFzZSA9IG5ldyBFYXNlKG51bGwsIG51bGwsIDEsIDEpO1xuXHRcdFR3ZWVuTGl0ZS5kZWZhdWx0T3ZlcndyaXRlID0gXCJhdXRvXCI7XG5cdFx0VHdlZW5MaXRlLnRpY2tlciA9IF90aWNrZXI7XG5cdFx0VHdlZW5MaXRlLmF1dG9TbGVlcCA9IDEyMDtcblx0XHRUd2VlbkxpdGUubGFnU21vb3RoaW5nID0gZnVuY3Rpb24odGhyZXNob2xkLCBhZGp1c3RlZExhZykge1xuXHRcdFx0X3RpY2tlci5sYWdTbW9vdGhpbmcodGhyZXNob2xkLCBhZGp1c3RlZExhZyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5zZWxlY3RvciA9IHdpbmRvdy4kIHx8IHdpbmRvdy5qUXVlcnkgfHwgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHNlbGVjdG9yID0gd2luZG93LiQgfHwgd2luZG93LmpRdWVyeTtcblx0XHRcdGlmIChzZWxlY3Rvcikge1xuXHRcdFx0XHRUd2VlbkxpdGUuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHRcdFx0cmV0dXJuIHNlbGVjdG9yKGUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh0eXBlb2YoZG9jdW1lbnQpID09PSBcInVuZGVmaW5lZFwiKSA/IGUgOiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZSkgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgoZS5jaGFyQXQoMCkgPT09IFwiI1wiKSA/IGUuc3Vic3RyKDEpIDogZSkpO1xuXHRcdH07XG5cblx0XHR2YXIgX2xhenlUd2VlbnMgPSBbXSxcblx0XHRcdF9sYXp5TG9va3VwID0ge30sXG5cdFx0XHRfbnVtYmVyc0V4cCA9IC8oPzooLXwtPXxcXCs9KT9cXGQqXFwuP1xcZCooPzplW1xcLStdP1xcZCspPylbMC05XS9pZyxcblx0XHRcdC8vX25vbk51bWJlcnNFeHAgPSAvKD86KFtcXC0rXSg/IShcXGR8PSkpKXxbXlxcZFxcLSs9ZV18KGUoPyFbXFwtK11bXFxkXSkpKSsvaWcsXG5cdFx0XHRfc2V0UmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQsXG5cdFx0XHRcdFx0bWluID0gMC4wMDAwMDEsXG5cdFx0XHRcdFx0dmFsO1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHR2YWwgPSAhcHQuYmxvYiA/IHB0LmMgKiB2ICsgcHQucyA6IHYgPyB0aGlzLmpvaW4oXCJcIikgOiB0aGlzLnN0YXJ0O1xuXHRcdFx0XHRcdGlmIChwdC5tKSB7XG5cdFx0XHRcdFx0XHR2YWwgPSBwdC5tKHZhbCwgdGhpcy5fdGFyZ2V0IHx8IHB0LnQpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsIDwgbWluKSBpZiAodmFsID4gLW1pbikgeyAvL3ByZXZlbnRzIGlzc3VlcyB3aXRoIGNvbnZlcnRpbmcgdmVyeSBzbWFsbCBudW1iZXJzIHRvIHN0cmluZ3MgaW4gdGhlIGJyb3dzZXJcblx0XHRcdFx0XHRcdHZhbCA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghcHQuZikge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHZhbDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LmZwKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LmZwLCB2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHZhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvL2NvbXBhcmVzIHR3byBzdHJpbmdzIChzdGFydC9lbmQpLCBmaW5kcyB0aGUgbnVtYmVycyB0aGF0IGFyZSBkaWZmZXJlbnQgYW5kIHNwaXRzIGJhY2sgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSB3aG9sZSB2YWx1ZSBidXQgd2l0aCB0aGUgY2hhbmdpbmcgdmFsdWVzIGlzb2xhdGVkIGFzIGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgXCJyZ2IoMCwwLDApXCIgYW5kIFwicmdiKDEwMCw1MCwwKVwiIHdvdWxkIGJlY29tZSBbXCJyZ2IoXCIsIDAsIFwiLFwiLCA1MCwgXCIsMClcIl0uIE5vdGljZSBpdCBtZXJnZXMgdGhlIHBhcnRzIHRoYXQgYXJlIGlkZW50aWNhbCAocGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uKS4gVGhlIGFycmF5IGFsc28gaGFzIGEgbGlua2VkIGxpc3Qgb2YgUHJvcFR3ZWVucyBhdHRhY2hlZCBzdGFydGluZyB3aXRoIF9maXJzdFBUIHRoYXQgY29udGFpbiB0aGUgdHdlZW5pbmcgZGF0YSAodCwgcCwgcywgYywgZiwgZXRjLikuIEl0IGFsc28gc3RvcmVzIHRoZSBzdGFydGluZyB2YWx1ZSBhcyBhIFwic3RhcnRcIiBwcm9wZXJ0eSBzbyB0aGF0IHdlIGNhbiByZXZlcnQgdG8gaXQgaWYvd2hlbiBuZWNlc3NhcnksIGxpa2Ugd2hlbiBhIHR3ZWVuIHJld2luZHMgZnVsbHkuIElmIHRoZSBxdWFudGl0eSBvZiBudW1iZXJzIGRpZmZlcnMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCwgaXQgd2lsbCBhbHdheXMgcHJpb3JpdGl6ZSB0aGUgZW5kIHZhbHVlKHMpLiBUaGUgcHQgcGFyYW1ldGVyIGlzIG9wdGlvbmFsIC0gaXQncyBmb3IgYSBQcm9wVHdlZW4gdGhhdCB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpbmtlZCBsaXN0IGFuZCBpcyB0eXBpY2FsbHkgZm9yIGFjdHVhbGx5IHNldHRpbmcgdGhlIHZhbHVlIGFmdGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQgKHdpdGggYXJyYXkuam9pbihcIlwiKSkuXG5cdFx0XHRfYmxvYkRpZiA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGZpbHRlciwgcHQpIHtcblx0XHRcdFx0dmFyIGEgPSBbc3RhcnQsIGVuZF0sXG5cdFx0XHRcdFx0Y2hhckluZGV4ID0gMCxcblx0XHRcdFx0XHRzID0gXCJcIixcblx0XHRcdFx0XHRjb2xvciA9IDAsXG5cdFx0XHRcdFx0c3RhcnROdW1zLCBlbmROdW1zLCBudW0sIGksIGwsIG5vbk51bWJlcnMsIGN1cnJlbnROdW07XG5cdFx0XHRcdGEuc3RhcnQgPSBzdGFydDtcblx0XHRcdFx0aWYgKGZpbHRlcikge1xuXHRcdFx0XHRcdGZpbHRlcihhKTsgLy9wYXNzIGFuIGFycmF5IHdpdGggdGhlIHN0YXJ0aW5nIGFuZCBlbmRpbmcgdmFsdWVzIGFuZCBsZXQgdGhlIGZpbHRlciBkbyB3aGF0ZXZlciBpdCBuZWVkcyB0byB0aGUgdmFsdWVzLlxuXHRcdFx0XHRcdHN0YXJ0ID0gYVswXTtcblx0XHRcdFx0XHRlbmQgPSBhWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEubGVuZ3RoID0gMDtcblx0XHRcdFx0c3RhcnROdW1zID0gc3RhcnQubWF0Y2goX251bWJlcnNFeHApIHx8IFtdO1xuXHRcdFx0XHRlbmROdW1zID0gZW5kLm1hdGNoKF9udW1iZXJzRXhwKSB8fCBbXTtcblx0XHRcdFx0aWYgKHB0KSB7XG5cdFx0XHRcdFx0cHQuX25leHQgPSBudWxsO1xuXHRcdFx0XHRcdHB0LmJsb2IgPSAxO1xuXHRcdFx0XHRcdGEuX2ZpcnN0UFQgPSBhLl9hcHBseVBUID0gcHQ7IC8vYXBwbHkgbGFzdCBpbiB0aGUgbGlua2VkIGxpc3QgKHdoaWNoIG1lYW5zIGluc2VydGluZyBpdCBmaXJzdClcblx0XHRcdFx0fVxuXHRcdFx0XHRsID0gZW5kTnVtcy5sZW5ndGg7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRjdXJyZW50TnVtID0gZW5kTnVtc1tpXTtcblx0XHRcdFx0XHRub25OdW1iZXJzID0gZW5kLnN1YnN0cihjaGFySW5kZXgsIGVuZC5pbmRleE9mKGN1cnJlbnROdW0sIGNoYXJJbmRleCktY2hhckluZGV4KTtcblx0XHRcdFx0XHRzICs9IChub25OdW1iZXJzIHx8ICFpKSA/IG5vbk51bWJlcnMgOiBcIixcIjsgLy9ub3RlOiBTVkcgc3BlYyBhbGxvd3Mgb21pc3Npb24gb2YgY29tbWEvc3BhY2Ugd2hlbiBhIG5lZ2F0aXZlIHNpZ24gaXMgd2VkZ2VkIGJldHdlZW4gdHdvIG51bWJlcnMsIGxpa2UgMi41LTUuMyBpbnN0ZWFkIG9mIDIuNSwtNS4zIGJ1dCB3aGVuIHR3ZWVuaW5nLCB0aGUgbmVnYXRpdmUgdmFsdWUgbWF5IHN3aXRjaCB0byBwb3NpdGl2ZSwgc28gd2UgaW5zZXJ0IHRoZSBjb21tYSBqdXN0IGluIGNhc2UuXG5cdFx0XHRcdFx0Y2hhckluZGV4ICs9IG5vbk51bWJlcnMubGVuZ3RoO1xuXHRcdFx0XHRcdGlmIChjb2xvcikgeyAvL3NlbnNlIHJnYmEoKSB2YWx1ZXMgYW5kIHJvdW5kIHRoZW0uXG5cdFx0XHRcdFx0XHRjb2xvciA9IChjb2xvciArIDEpICUgNTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG5vbk51bWJlcnMuc3Vic3RyKC01KSA9PT0gXCJyZ2JhKFwiKSB7XG5cdFx0XHRcdFx0XHRjb2xvciA9IDE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChjdXJyZW50TnVtID09PSBzdGFydE51bXNbaV0gfHwgc3RhcnROdW1zLmxlbmd0aCA8PSBpKSB7XG5cdFx0XHRcdFx0XHRzICs9IGN1cnJlbnROdW07XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChzKSB7XG5cdFx0XHRcdFx0XHRcdGEucHVzaChzKTtcblx0XHRcdFx0XHRcdFx0cyA9IFwiXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRudW0gPSBwYXJzZUZsb2F0KHN0YXJ0TnVtc1tpXSk7XG5cdFx0XHRcdFx0XHRhLnB1c2gobnVtKTtcblx0XHRcdFx0XHRcdGEuX2ZpcnN0UFQgPSB7X25leHQ6IGEuX2ZpcnN0UFQsIHQ6YSwgcDogYS5sZW5ndGgtMSwgczpudW0sIGM6KChjdXJyZW50TnVtLmNoYXJBdCgxKSA9PT0gXCI9XCIpID8gcGFyc2VJbnQoY3VycmVudE51bS5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogcGFyc2VGbG9hdChjdXJyZW50TnVtLnN1YnN0cigyKSkgOiAocGFyc2VGbG9hdChjdXJyZW50TnVtKSAtIG51bSkpIHx8IDAsIGY6MCwgbTooY29sb3IgJiYgY29sb3IgPCA0KSA/IE1hdGgucm91bmQgOiAwfTtcblx0XHRcdFx0XHRcdC8vbm90ZTogd2UgZG9uJ3Qgc2V0IF9wcmV2IGJlY2F1c2Ugd2UnbGwgbmV2ZXIgbmVlZCB0byByZW1vdmUgaW5kaXZpZHVhbCBQcm9wVHdlZW5zIGZyb20gdGhpcyBsaXN0LlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaGFySW5kZXggKz0gY3VycmVudE51bS5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdFx0cyArPSBlbmQuc3Vic3RyKGNoYXJJbmRleCk7XG5cdFx0XHRcdGlmIChzKSB7XG5cdFx0XHRcdFx0YS5wdXNoKHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuc2V0UmF0aW8gPSBfc2V0UmF0aW87XG5cdFx0XHRcdHJldHVybiBhO1xuXHRcdFx0fSxcblx0XHRcdC8vbm90ZTogXCJmdW5jUGFyYW1cIiBpcyBvbmx5IG5lY2Vzc2FyeSBmb3IgZnVuY3Rpb24tYmFzZWQgZ2V0dGVycy9zZXR0ZXJzIHRoYXQgcmVxdWlyZSBhbiBleHRyYSBwYXJhbWV0ZXIgbGlrZSBnZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSBhbmQgc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdmFsdWUpLiBJbiB0aGlzIGV4YW1wbGUsIGZ1bmNQYXJhbSB3b3VsZCBiZSBcIndpZHRoXCIuIFVzZWQgYnkgQXR0clBsdWdpbiBmb3IgZXhhbXBsZS5cblx0XHRcdF9hZGRQcm9wVHdlZW4gPSBmdW5jdGlvbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIG92ZXJ3cml0ZVByb3AsIG1vZCwgZnVuY1BhcmFtLCBzdHJpbmdGaWx0ZXIsIGluZGV4KSB7XG5cdFx0XHRcdGlmICh0eXBlb2YoZW5kKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0ZW5kID0gZW5kKGluZGV4IHx8IDAsIHRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIHMgPSAoc3RhcnQgPT09IFwiZ2V0XCIpID8gdGFyZ2V0W3Byb3BdIDogc3RhcnQsXG5cdFx0XHRcdFx0dHlwZSA9IHR5cGVvZih0YXJnZXRbcHJvcF0pLFxuXHRcdFx0XHRcdGlzUmVsYXRpdmUgPSAodHlwZW9mKGVuZCkgPT09IFwic3RyaW5nXCIgJiYgZW5kLmNoYXJBdCgxKSA9PT0gXCI9XCIpLFxuXHRcdFx0XHRcdHB0ID0ge3Q6dGFyZ2V0LCBwOnByb3AsIHM6cywgZjoodHlwZSA9PT0gXCJmdW5jdGlvblwiKSwgcGc6MCwgbjpvdmVyd3JpdGVQcm9wIHx8IHByb3AsIG06KCFtb2QgPyAwIDogKHR5cGVvZihtb2QpID09PSBcImZ1bmN0aW9uXCIpID8gbW9kIDogTWF0aC5yb3VuZCksIHByOjAsIGM6aXNSZWxhdGl2ZSA/IHBhcnNlSW50KGVuZC5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogcGFyc2VGbG9hdChlbmQuc3Vic3RyKDIpKSA6IChwYXJzZUZsb2F0KGVuZCkgLSBzKSB8fCAwfSxcblx0XHRcdFx0XHRibG9iLCBnZXR0ZXJOYW1lO1xuXHRcdFx0XHRpZiAodHlwZSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIgJiYgc3RhcnQgPT09IFwiZ2V0XCIpIHtcblx0XHRcdFx0XHRcdGdldHRlck5hbWUgPSAoKHByb3AuaW5kZXhPZihcInNldFwiKSB8fCB0eXBlb2YodGFyZ2V0W1wiZ2V0XCIgKyBwcm9wLnN1YnN0cigzKV0pICE9PSBcImZ1bmN0aW9uXCIpID8gcHJvcCA6IFwiZ2V0XCIgKyBwcm9wLnN1YnN0cigzKSk7XG5cdFx0XHRcdFx0XHRwdC5zID0gcyA9IGZ1bmNQYXJhbSA/IHRhcmdldFtnZXR0ZXJOYW1lXShmdW5jUGFyYW0pIDogdGFyZ2V0W2dldHRlck5hbWVdKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0eXBlb2YocykgPT09IFwic3RyaW5nXCIgJiYgKGZ1bmNQYXJhbSB8fCBpc05hTihzKSkpIHtcblx0XHRcdFx0XHRcdC8vYSBibG9iIChzdHJpbmcgdGhhdCBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbiBpdClcblx0XHRcdFx0XHRcdHB0LmZwID0gZnVuY1BhcmFtO1xuXHRcdFx0XHRcdFx0YmxvYiA9IF9ibG9iRGlmKHMsIGVuZCwgc3RyaW5nRmlsdGVyIHx8IFR3ZWVuTGl0ZS5kZWZhdWx0U3RyaW5nRmlsdGVyLCBwdCk7XG5cdFx0XHRcdFx0XHRwdCA9IHt0OmJsb2IsIHA6XCJzZXRSYXRpb1wiLCBzOjAsIGM6MSwgZjoyLCBwZzowLCBuOm92ZXJ3cml0ZVByb3AgfHwgcHJvcCwgcHI6MCwgbTowfTsgLy9cIjJcIiBpbmRpY2F0ZXMgaXQncyBhIEJsb2IgcHJvcGVydHkgdHdlZW4uIE5lZWRlZCBmb3IgUm91bmRQcm9wc1BsdWdpbiBmb3IgZXhhbXBsZS5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFpc1JlbGF0aXZlKSB7XG5cdFx0XHRcdFx0XHRwdC5zID0gcGFyc2VGbG9hdChzKTtcblx0XHRcdFx0XHRcdHB0LmMgPSAocGFyc2VGbG9hdChlbmQpIC0gcHQucykgfHwgMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0LmMpIHsgLy9vbmx5IGFkZCBpdCB0byB0aGUgbGlua2VkIGxpc3QgaWYgdGhlcmUncyBhIGNoYW5nZS5cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gdGhpcy5fZmlyc3RQVCkpIHtcblx0XHRcdFx0XHRcdHB0Ll9uZXh0Ll9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdDtcblx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRfaW50ZXJuYWxzID0gVHdlZW5MaXRlLl9pbnRlcm5hbHMgPSB7aXNBcnJheTpfaXNBcnJheSwgaXNTZWxlY3RvcjpfaXNTZWxlY3RvciwgbGF6eVR3ZWVuczpfbGF6eVR3ZWVucywgYmxvYkRpZjpfYmxvYkRpZn0sIC8vZ2l2ZXMgdXMgYSB3YXkgdG8gZXhwb3NlIGNlcnRhaW4gcHJpdmF0ZSB2YWx1ZXMgdG8gb3RoZXIgR3JlZW5Tb2NrIGNsYXNzZXMgd2l0aG91dCBjb250YW1pbmF0aW5nIHRoYSBtYWluIFR3ZWVuTGl0ZSBvYmplY3QuXG5cdFx0XHRfcGx1Z2lucyA9IFR3ZWVuTGl0ZS5fcGx1Z2lucyA9IHt9LFxuXHRcdFx0X3R3ZWVuTG9va3VwID0gX2ludGVybmFscy50d2Vlbkxvb2t1cCA9IHt9LFxuXHRcdFx0X3R3ZWVuTG9va3VwTnVtID0gMCxcblx0XHRcdF9yZXNlcnZlZFByb3BzID0gX2ludGVybmFscy5yZXNlcnZlZFByb3BzID0ge2Vhc2U6MSwgZGVsYXk6MSwgb3ZlcndyaXRlOjEsIG9uQ29tcGxldGU6MSwgb25Db21wbGV0ZVBhcmFtczoxLCBvbkNvbXBsZXRlU2NvcGU6MSwgdXNlRnJhbWVzOjEsIHJ1bkJhY2t3YXJkczoxLCBzdGFydEF0OjEsIG9uVXBkYXRlOjEsIG9uVXBkYXRlUGFyYW1zOjEsIG9uVXBkYXRlU2NvcGU6MSwgb25TdGFydDoxLCBvblN0YXJ0UGFyYW1zOjEsIG9uU3RhcnRTY29wZToxLCBvblJldmVyc2VDb21wbGV0ZToxLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczoxLCBvblJldmVyc2VDb21wbGV0ZVNjb3BlOjEsIG9uUmVwZWF0OjEsIG9uUmVwZWF0UGFyYW1zOjEsIG9uUmVwZWF0U2NvcGU6MSwgZWFzZVBhcmFtczoxLCB5b3lvOjEsIGltbWVkaWF0ZVJlbmRlcjoxLCByZXBlYXQ6MSwgcmVwZWF0RGVsYXk6MSwgZGF0YToxLCBwYXVzZWQ6MSwgcmV2ZXJzZWQ6MSwgYXV0b0NTUzoxLCBsYXp5OjEsIG9uT3ZlcndyaXRlOjEsIGNhbGxiYWNrU2NvcGU6MSwgc3RyaW5nRmlsdGVyOjEsIGlkOjF9LFxuXHRcdFx0X292ZXJ3cml0ZUxvb2t1cCA9IHtub25lOjAsIGFsbDoxLCBhdXRvOjIsIGNvbmN1cnJlbnQ6MywgYWxsT25TdGFydDo0LCBwcmVleGlzdGluZzo1LCBcInRydWVcIjoxLCBcImZhbHNlXCI6MH0sXG5cdFx0XHRfcm9vdEZyYW1lc1RpbWVsaW5lID0gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUgPSBuZXcgU2ltcGxlVGltZWxpbmUoKSxcblx0XHRcdF9yb290VGltZWxpbmUgPSBBbmltYXRpb24uX3Jvb3RUaW1lbGluZSA9IG5ldyBTaW1wbGVUaW1lbGluZSgpLFxuXHRcdFx0X25leHRHQ0ZyYW1lID0gMzAsXG5cdFx0XHRfbGF6eVJlbmRlciA9IF9pbnRlcm5hbHMubGF6eVJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgaSA9IF9sYXp5VHdlZW5zLmxlbmd0aCxcblx0XHRcdFx0XHR0d2Vlbjtcblx0XHRcdFx0X2xhenlMb29rdXAgPSB7fTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0dHdlZW4gPSBfbGF6eVR3ZWVuc1tpXTtcblx0XHRcdFx0XHRpZiAodHdlZW4gJiYgdHdlZW4uX2xhenkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIodHdlZW4uX2xhenlbMF0sIHR3ZWVuLl9sYXp5WzFdLCB0cnVlKTtcblx0XHRcdFx0XHRcdHR3ZWVuLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdF9sYXp5VHdlZW5zLmxlbmd0aCA9IDA7XG5cdFx0XHR9O1xuXG5cdFx0X3Jvb3RUaW1lbGluZS5fc3RhcnRUaW1lID0gX3RpY2tlci50aW1lO1xuXHRcdF9yb290RnJhbWVzVGltZWxpbmUuX3N0YXJ0VGltZSA9IF90aWNrZXIuZnJhbWU7XG5cdFx0X3Jvb3RUaW1lbGluZS5fYWN0aXZlID0gX3Jvb3RGcmFtZXNUaW1lbGluZS5fYWN0aXZlID0gdHJ1ZTtcblx0XHRzZXRUaW1lb3V0KF9sYXp5UmVuZGVyLCAxKTsgLy9vbiBzb21lIG1vYmlsZSBkZXZpY2VzLCB0aGVyZSBpc24ndCBhIFwidGlja1wiIGJlZm9yZSBjb2RlIHJ1bnMgd2hpY2ggbWVhbnMgYW55IGxhenkgcmVuZGVycyB3b3VsZG4ndCBydW4gYmVmb3JlIHRoZSBuZXh0IG9mZmljaWFsIFwidGlja1wiLlxuXG5cdFx0QW5pbWF0aW9uLl91cGRhdGVSb290ID0gVHdlZW5MaXRlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgaSwgYSwgcDtcblx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2lmIGNvZGUgaXMgcnVuIG91dHNpZGUgb2YgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wLCB0aGVyZSBtYXkgYmUgdHdlZW5zIHF1ZXVlZCBBRlRFUiB0aGUgZW5naW5lIHJlZnJlc2hlZCwgc28gd2UgbmVlZCB0byBlbnN1cmUgYW55IHBlbmRpbmcgcmVuZGVycyBvY2N1ciBiZWZvcmUgd2UgcmVmcmVzaCBhZ2Fpbi5cblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9yb290VGltZWxpbmUucmVuZGVyKChfdGlja2VyLnRpbWUgLSBfcm9vdFRpbWVsaW5lLl9zdGFydFRpbWUpICogX3Jvb3RUaW1lbGluZS5fdGltZVNjYWxlLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRfcm9vdEZyYW1lc1RpbWVsaW5lLnJlbmRlcigoX3RpY2tlci5mcmFtZSAtIF9yb290RnJhbWVzVGltZWxpbmUuX3N0YXJ0VGltZSkgKiBfcm9vdEZyYW1lc1RpbWVsaW5lLl90aW1lU2NhbGUsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChfdGlja2VyLmZyYW1lID49IF9uZXh0R0NGcmFtZSkgeyAvL2R1bXAgZ2FyYmFnZSBldmVyeSAxMjAgZnJhbWVzIG9yIHdoYXRldmVyIHRoZSB1c2VyIHNldHMgVHdlZW5MaXRlLmF1dG9TbGVlcCB0b1xuXHRcdFx0XHRcdF9uZXh0R0NGcmFtZSA9IF90aWNrZXIuZnJhbWUgKyAocGFyc2VJbnQoVHdlZW5MaXRlLmF1dG9TbGVlcCwgMTApIHx8IDEyMCk7XG5cdFx0XHRcdFx0Zm9yIChwIGluIF90d2Vlbkxvb2t1cCkge1xuXHRcdFx0XHRcdFx0YSA9IF90d2Vlbkxvb2t1cFtwXS50d2VlbnM7XG5cdFx0XHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFbaV0uX2djKSB7XG5cdFx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChhLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgX3R3ZWVuTG9va3VwW3BdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2lmIHRoZXJlIGFyZSBubyBtb3JlIHR3ZWVucyBpbiB0aGUgcm9vdCB0aW1lbGluZXMsIG9yIGlmIHRoZXkncmUgYWxsIHBhdXNlZCwgbWFrZSB0aGUgX3RpbWVyIHNsZWVwIHRvIHJlZHVjZSBsb2FkIG9uIHRoZSBDUFUgc2xpZ2h0bHlcblx0XHRcdFx0XHRwID0gX3Jvb3RUaW1lbGluZS5fZmlyc3Q7XG5cdFx0XHRcdFx0aWYgKCFwIHx8IHAuX3BhdXNlZCkgaWYgKFR3ZWVuTGl0ZS5hdXRvU2xlZXAgJiYgIV9yb290RnJhbWVzVGltZWxpbmUuX2ZpcnN0ICYmIF90aWNrZXIuX2xpc3RlbmVycy50aWNrLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKHAgJiYgcC5fcGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdHAgPSBwLl9uZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCFwKSB7XG5cdFx0XHRcdFx0XHRcdF90aWNrZXIuc2xlZXAoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRfdGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aWNrXCIsIEFuaW1hdGlvbi5fdXBkYXRlUm9vdCk7XG5cblx0XHR2YXIgX3JlZ2lzdGVyID0gZnVuY3Rpb24odGFyZ2V0LCB0d2Vlbiwgc2NydWIpIHtcblx0XHRcdFx0dmFyIGlkID0gdGFyZ2V0Ll9nc1R3ZWVuSUQsIGEsIGk7XG5cdFx0XHRcdGlmICghX3R3ZWVuTG9va3VwW2lkIHx8ICh0YXJnZXQuX2dzVHdlZW5JRCA9IGlkID0gXCJ0XCIgKyAoX3R3ZWVuTG9va3VwTnVtKyspKV0pIHtcblx0XHRcdFx0XHRfdHdlZW5Mb29rdXBbaWRdID0ge3RhcmdldDp0YXJnZXQsIHR3ZWVuczpbXX07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0YSA9IF90d2Vlbkxvb2t1cFtpZF0udHdlZW5zO1xuXHRcdFx0XHRcdGFbKGkgPSBhLmxlbmd0aCldID0gdHdlZW47XG5cdFx0XHRcdFx0aWYgKHNjcnViKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFbaV0gPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIF90d2Vlbkxvb2t1cFtpZF0udHdlZW5zO1xuXHRcdFx0fSxcblx0XHRcdF9vbk92ZXJ3cml0ZSA9IGZ1bmN0aW9uKG92ZXJ3cml0dGVuVHdlZW4sIG92ZXJ3cml0aW5nVHdlZW4sIHRhcmdldCwga2lsbGVkUHJvcHMpIHtcblx0XHRcdFx0dmFyIGZ1bmMgPSBvdmVyd3JpdHRlblR3ZWVuLnZhcnMub25PdmVyd3JpdGUsIHIxLCByMjtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMSA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuYyA9IFR3ZWVuTGl0ZS5vbk92ZXJ3cml0ZTtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMiA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChyMSAhPT0gZmFsc2UgJiYgcjIgIT09IGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0XHRfYXBwbHlPdmVyd3JpdGUgPSBmdW5jdGlvbih0YXJnZXQsIHR3ZWVuLCBwcm9wcywgbW9kZSwgc2libGluZ3MpIHtcblx0XHRcdFx0dmFyIGksIGNoYW5nZWQsIGN1clR3ZWVuLCBsO1xuXHRcdFx0XHRpZiAobW9kZSA9PT0gMSB8fCBtb2RlID49IDQpIHtcblx0XHRcdFx0XHRsID0gc2libGluZ3MubGVuZ3RoO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgIT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghY3VyVHdlZW4uX2djKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9raWxsKG51bGwsIHRhcmdldCwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gNSkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9OT1RFOiBBZGQgMC4wMDAwMDAwMDAxIHRvIG92ZXJjb21lIGZsb2F0aW5nIHBvaW50IGVycm9ycyB0aGF0IGNhbiBjYXVzZSB0aGUgc3RhcnRUaW1lIHRvIGJlIFZFUlkgc2xpZ2h0bHkgb2ZmICh3aGVuIGEgdHdlZW4ncyB0aW1lKCkgaXMgc2V0IGZvciBleGFtcGxlKVxuXHRcdFx0XHR2YXIgc3RhcnRUaW1lID0gdHdlZW4uX3N0YXJ0VGltZSArIF90aW55TnVtLFxuXHRcdFx0XHRcdG92ZXJsYXBzID0gW10sXG5cdFx0XHRcdFx0b0NvdW50ID0gMCxcblx0XHRcdFx0XHR6ZXJvRHVyID0gKHR3ZWVuLl9kdXJhdGlvbiA9PT0gMCksXG5cdFx0XHRcdFx0Z2xvYmFsU3RhcnQ7XG5cdFx0XHRcdGkgPSBzaWJsaW5ncy5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgPT09IHR3ZWVuIHx8IGN1clR3ZWVuLl9nYyB8fCBjdXJUd2Vlbi5fcGF1c2VkKSB7XG5cdFx0XHRcdFx0XHQvL2lnbm9yZVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3RpbWVsaW5lICE9PSB0d2Vlbi5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdGdsb2JhbFN0YXJ0ID0gZ2xvYmFsU3RhcnQgfHwgX2NoZWNrT3ZlcmxhcCh0d2VlbiwgMCwgemVyb0R1cik7XG5cdFx0XHRcdFx0XHRpZiAoX2NoZWNrT3ZlcmxhcChjdXJUd2VlbiwgZ2xvYmFsU3RhcnQsIHplcm9EdXIpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3N0YXJ0VGltZSA8PSBzdGFydFRpbWUpIGlmIChjdXJUd2Vlbi5fc3RhcnRUaW1lICsgY3VyVHdlZW4udG90YWxEdXJhdGlvbigpIC8gY3VyVHdlZW4uX3RpbWVTY2FsZSA+IHN0YXJ0VGltZSkgaWYgKCEoKHplcm9EdXIgfHwgIWN1clR3ZWVuLl9pbml0dGVkKSAmJiBzdGFydFRpbWUgLSBjdXJUd2Vlbi5fc3RhcnRUaW1lIDw9IDAuMDAwMDAwMDAwMikpIHtcblx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgPSBvQ291bnQ7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGN1clR3ZWVuID0gb3ZlcmxhcHNbaV07XG5cdFx0XHRcdFx0aWYgKG1vZGUgPT09IDIpIGlmIChjdXJUd2Vlbi5fa2lsbChwcm9wcywgdGFyZ2V0LCB0d2VlbikpIHtcblx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobW9kZSAhPT0gMiB8fCAoIWN1clR3ZWVuLl9maXJzdFBUICYmIGN1clR3ZWVuLl9pbml0dGVkKSkge1xuXHRcdFx0XHRcdFx0aWYgKG1vZGUgIT09IDIgJiYgIV9vbk92ZXJ3cml0ZShjdXJUd2VlbiwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9lbmFibGVkKGZhbHNlLCBmYWxzZSkpIHsgLy9pZiBhbGwgcHJvcGVydHkgdHdlZW5zIGhhdmUgYmVlbiBvdmVyd3JpdHRlbiwga2lsbCB0aGUgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdH0sXG5cdFx0XHRfY2hlY2tPdmVybGFwID0gZnVuY3Rpb24odHdlZW4sIHJlZmVyZW5jZSwgemVyb0R1cikge1xuXHRcdFx0XHR2YXIgdGwgPSB0d2Vlbi5fdGltZWxpbmUsXG5cdFx0XHRcdFx0dHMgPSB0bC5fdGltZVNjYWxlLFxuXHRcdFx0XHRcdHQgPSB0d2Vlbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHR3aGlsZSAodGwuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dCArPSB0bC5fc3RhcnRUaW1lO1xuXHRcdFx0XHRcdHRzICo9IHRsLl90aW1lU2NhbGU7XG5cdFx0XHRcdFx0aWYgKHRsLl9wYXVzZWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAtMTAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0bCA9IHRsLl90aW1lbGluZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0IC89IHRzO1xuXHRcdFx0XHRyZXR1cm4gKHQgPiByZWZlcmVuY2UpID8gdCAtIHJlZmVyZW5jZSA6ICgoemVyb0R1ciAmJiB0ID09PSByZWZlcmVuY2UpIHx8ICghdHdlZW4uX2luaXR0ZWQgJiYgdCAtIHJlZmVyZW5jZSA8IDIgKiBfdGlueU51bSkpID8gX3RpbnlOdW0gOiAoKHQgKz0gdHdlZW4udG90YWxEdXJhdGlvbigpIC8gdHdlZW4uX3RpbWVTY2FsZSAvIHRzKSA+IHJlZmVyZW5jZSArIF90aW55TnVtKSA/IDAgOiB0IC0gcmVmZXJlbmNlIC0gX3RpbnlOdW07XG5cdFx0XHR9O1xuXG5cbi8vLS0tLSBUd2VlbkxpdGUgaW5zdGFuY2UgbWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0cC5faW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHYgPSB0aGlzLnZhcnMsXG5cdFx0XHRcdG9wID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyxcblx0XHRcdFx0ZHVyID0gdGhpcy5fZHVyYXRpb24sXG5cdFx0XHRcdGltbWVkaWF0ZSA9ICEhdi5pbW1lZGlhdGVSZW5kZXIsXG5cdFx0XHRcdGVhc2UgPSB2LmVhc2UsXG5cdFx0XHRcdGksIGluaXRQbHVnaW5zLCBwdCwgcCwgc3RhcnRWYXJzLCBsO1xuXHRcdFx0aWYgKHYuc3RhcnRBdCkge1xuXHRcdFx0XHRpZiAodGhpcy5fc3RhcnRBdCkge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKC0xLCB0cnVlKTsgLy9pZiB3ZSd2ZSBydW4gYSBzdGFydEF0IHByZXZpb3VzbHkgKHdoZW4gdGhlIHR3ZWVuIGluc3RhbnRpYXRlZCksIHdlIHNob3VsZCByZXZlcnQgaXQgc28gdGhhdCB0aGUgdmFsdWVzIHJlLWluc3RhbnRpYXRlIGNvcnJlY3RseSBwYXJ0aWN1bGFybHkgZm9yIHJlbGF0aXZlIHR3ZWVucy4gV2l0aG91dCB0aGlzLCBhIFR3ZWVuTGl0ZS5mcm9tVG8ob2JqLCAxLCB7eDpcIis9MTAwXCJ9LCB7eDpcIi09MTAwXCJ9KSwgZm9yIGV4YW1wbGUsIHdvdWxkIGFjdHVhbGx5IGp1bXAgdG8gKz0yMDAgYmVjYXVzZSB0aGUgc3RhcnRBdCB3b3VsZCBydW4gdHdpY2UsIGRvdWJsaW5nIHRoZSByZWxhdGl2ZSBjaGFuZ2UuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5raWxsKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RhcnRWYXJzID0ge307XG5cdFx0XHRcdGZvciAocCBpbiB2LnN0YXJ0QXQpIHsgLy9jb3B5IHRoZSBwcm9wZXJ0aWVzL3ZhbHVlcyBpbnRvIGEgbmV3IG9iamVjdCB0byBhdm9pZCBjb2xsaXNpb25zLCBsaWtlIHZhciB0byA9IHt4OjB9LCBmcm9tID0ge3g6NTAwfTsgdGltZWxpbmUuZnJvbVRvKGUsIDEsIGZyb20sIHRvKS5mcm9tVG8oZSwgMSwgdG8sIGZyb20pO1xuXHRcdFx0XHRcdHN0YXJ0VmFyc1twXSA9IHYuc3RhcnRBdFtwXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdGFydFZhcnMub3ZlcndyaXRlID0gZmFsc2U7XG5cdFx0XHRcdHN0YXJ0VmFycy5pbW1lZGlhdGVSZW5kZXIgPSB0cnVlO1xuXHRcdFx0XHRzdGFydFZhcnMubGF6eSA9IChpbW1lZGlhdGUgJiYgdi5sYXp5ICE9PSBmYWxzZSk7XG5cdFx0XHRcdHN0YXJ0VmFycy5zdGFydEF0ID0gc3RhcnRWYXJzLmRlbGF5ID0gbnVsbDsgLy9ubyBuZXN0aW5nIG9mIHN0YXJ0QXQgb2JqZWN0cyBhbGxvd2VkIChvdGhlcndpc2UgaXQgY291bGQgY2F1c2UgYW4gaW5maW5pdGUgbG9vcCkuXG5cdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBUd2VlbkxpdGUudG8odGhpcy50YXJnZXQsIDAsIHN0YXJ0VmFycyk7XG5cdFx0XHRcdGlmIChpbW1lZGlhdGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZSA+IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsOyAvL3R3ZWVucyB0aGF0IHJlbmRlciBpbW1lZGlhdGVseSAobGlrZSBtb3N0IGZyb20oKSBhbmQgZnJvbVRvKCkgdHdlZW5zKSBzaG91bGRuJ3QgcmV2ZXJ0IHdoZW4gdGhlaXIgcGFyZW50IHRpbWVsaW5lJ3MgcGxheWhlYWQgZ29lcyBiYWNrd2FyZCBwYXN0IHRoZSBzdGFydFRpbWUgYmVjYXVzZSB0aGUgaW5pdGlhbCByZW5kZXIgY291bGQgaGF2ZSBoYXBwZW5lZCBhbnl0aW1lIGFuZCBpdCBzaG91bGRuJ3QgYmUgZGlyZWN0bHkgY29ycmVsYXRlZCB0byB0aGlzIHR3ZWVuJ3Mgc3RhcnRUaW1lLiBJbWFnaW5lIHNldHRpbmcgdXAgYSBjb21wbGV4IGFuaW1hdGlvbiB3aGVyZSB0aGUgYmVnaW5uaW5nIHN0YXRlcyBvZiB2YXJpb3VzIG9iamVjdHMgYXJlIHJlbmRlcmVkIGltbWVkaWF0ZWx5IGJ1dCB0aGUgdHdlZW4gZG9lc24ndCBoYXBwZW4gZm9yIHF1aXRlIHNvbWUgdGltZSAtIGlmIHdlIHJldmVydCB0byB0aGUgc3RhcnRpbmcgdmFsdWVzIGFzIHNvb24gYXMgdGhlIHBsYXloZWFkIGdvZXMgYmFja3dhcmQgcGFzdCB0aGUgdHdlZW4ncyBzdGFydFRpbWUsIGl0IHdpbGwgdGhyb3cgdGhpbmdzIG9mZiB2aXN1YWxseS4gUmV2ZXJzaW9uIHNob3VsZCBvbmx5IGhhcHBlbiBpbiBUaW1lbGluZUxpdGUvTWF4IGluc3RhbmNlcyB3aGVyZSBpbW1lZGlhdGVSZW5kZXIgd2FzIGZhbHNlICh3aGljaCBpcyB0aGUgZGVmYXVsdCBpbiB0aGUgY29udmVuaWVuY2UgbWV0aG9kcyBsaWtlIGZyb20oKSkuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChkdXIgIT09IDApIHtcblx0XHRcdFx0XHRcdHJldHVybjsgLy93ZSBza2lwIGluaXRpYWxpemF0aW9uIGhlcmUgc28gdGhhdCBvdmVyd3JpdGluZyBkb2Vzbid0IG9jY3VyIHVudGlsIHRoZSB0d2VlbiBhY3R1YWxseSBiZWdpbnMuIE90aGVyd2lzZSwgaWYgeW91IGNyZWF0ZSBzZXZlcmFsIGltbWVkaWF0ZVJlbmRlcjp0cnVlIHR3ZWVucyBvZiB0aGUgc2FtZSB0YXJnZXQvcHJvcGVydGllcyB0byBkcm9wIGludG8gYSBUaW1lbGluZUxpdGUgb3IgVGltZWxpbmVNYXgsIHRoZSBsYXN0IG9uZSBjcmVhdGVkIHdvdWxkIG92ZXJ3cml0ZSB0aGUgZmlyc3Qgb25lcyBiZWNhdXNlIHRoZXkgZGlkbid0IGdldCBwbGFjZWQgaW50byB0aGUgdGltZWxpbmUgeWV0IGJlZm9yZSB0aGUgZmlyc3QgcmVuZGVyIG9jY3VycyBhbmQga2lja3MgaW4gb3ZlcndyaXRpbmcuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHYucnVuQmFja3dhcmRzICYmIGR1ciAhPT0gMCkge1xuXHRcdFx0XHQvL2Zyb20oKSB0d2VlbnMgbXVzdCBiZSBoYW5kbGVkIHVuaXF1ZWx5OiB0aGVpciBiZWdpbm5pbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQgYnV0IHdlIGRvbid0IHdhbnQgb3ZlcndyaXRpbmcgdG8gb2NjdXIgeWV0ICh3aGVuIHRpbWUgaXMgc3RpbGwgMCkuIFdhaXQgdW50aWwgdGhlIHR3ZWVuIGFjdHVhbGx5IGJlZ2lucyBiZWZvcmUgZG9pbmcgYWxsIHRoZSByb3V0aW5lcyBsaWtlIG92ZXJ3cml0aW5nLiBBdCB0aGF0IHRpbWUsIHdlIHNob3VsZCByZW5kZXIgYXQgdGhlIEVORCBvZiB0aGUgdHdlZW4gdG8gZW5zdXJlIHRoYXQgdGhpbmdzIGluaXRpYWxpemUgY29ycmVjdGx5IChyZW1lbWJlciwgZnJvbSgpIHR3ZWVucyBnbyBiYWNrd2FyZHMpXG5cdFx0XHRcdGlmICh0aGlzLl9zdGFydEF0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIoLTEsIHRydWUpO1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQua2lsbCgpO1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lICE9PSAwKSB7IC8vaW4gcmFyZSBjYXNlcyAobGlrZSBpZiBhIGZyb20oKSB0d2VlbiBydW5zIGFuZCB0aGVuIGlzIGludmFsaWRhdGUoKS1lZCksIGltbWVkaWF0ZVJlbmRlciBjb3VsZCBiZSB0cnVlIGJ1dCB0aGUgaW5pdGlhbCBmb3JjZWQtcmVuZGVyIGdldHMgc2tpcHBlZCwgc28gdGhlcmUncyBubyBuZWVkIHRvIGZvcmNlIHRoZSByZW5kZXIgaW4gdGhpcyBjb250ZXh0IHdoZW4gdGhlIF90aW1lIGlzIGdyZWF0ZXIgdGhhbiAwXG5cdFx0XHRcdFx0XHRpbW1lZGlhdGUgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSB7fTtcblx0XHRcdFx0XHRmb3IgKHAgaW4gdikgeyAvL2NvcHkgcHJvcHMgaW50byBhIG5ldyBvYmplY3QgYW5kIHNraXAgYW55IHJlc2VydmVkIHByb3BzLCBvdGhlcndpc2Ugb25Db21wbGV0ZSBvciBvblVwZGF0ZSBvciBvblN0YXJ0IGNvdWxkIGZpcmUuIFdlIHNob3VsZCwgaG93ZXZlciwgcGVybWl0IGF1dG9DU1MgdG8gZ28gdGhyb3VnaC5cblx0XHRcdFx0XHRcdGlmICghX3Jlc2VydmVkUHJvcHNbcF0gfHwgcCA9PT0gXCJhdXRvQ1NTXCIpIHtcblx0XHRcdFx0XHRcdFx0cHRbcF0gPSB2W3BdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdC5vdmVyd3JpdGUgPSAwO1xuXHRcdFx0XHRcdHB0LmRhdGEgPSBcImlzRnJvbVN0YXJ0XCI7IC8vd2UgdGFnIHRoZSB0d2VlbiB3aXRoIGFzIFwiaXNGcm9tU3RhcnRcIiBzbyB0aGF0IGlmIFtpbnNpZGUgYSBwbHVnaW5dIHdlIG5lZWQgdG8gb25seSBkbyBzb21ldGhpbmcgYXQgdGhlIHZlcnkgRU5EIG9mIGEgdHdlZW4sIHdlIGhhdmUgYSB3YXkgb2YgaWRlbnRpZnlpbmcgdGhpcyB0d2VlbiBhcyBtZXJlbHkgdGhlIG9uZSB0aGF0J3Mgc2V0dGluZyB0aGUgYmVnaW5uaW5nIHZhbHVlcyBmb3IgYSBcImZyb20oKVwiIHR3ZWVuLiBGb3IgZXhhbXBsZSwgY2xlYXJQcm9wcyBpbiBDU1NQbHVnaW4gc2hvdWxkIG9ubHkgZ2V0IGFwcGxpZWQgYXQgdGhlIHZlcnkgRU5EIG9mIGEgdHdlZW4gYW5kIHdpdGhvdXQgdGhpcyB0YWcsIGZyb20oLi4ue2hlaWdodDoxMDAsIGNsZWFyUHJvcHM6XCJoZWlnaHRcIiwgZGVsYXk6MX0pIHdvdWxkIHdpcGUgdGhlIGhlaWdodCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0d2VlbiBhbmQgYWZ0ZXIgMSBzZWNvbmQsIGl0J2Qga2ljayBiYWNrIGluLlxuXHRcdFx0XHRcdHB0LmxhenkgPSAoaW1tZWRpYXRlICYmIHYubGF6eSAhPT0gZmFsc2UpO1xuXHRcdFx0XHRcdHB0LmltbWVkaWF0ZVJlbmRlciA9IGltbWVkaWF0ZTsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyByZW5kZXIgaW1tZWRpYXRlbHkgYnkgZGVmYXVsdCwgYnV0IGlmIHdlJ3JlIG5vdCBzcGVjaWZpY2FsbHkgaW5zdHJ1Y3RlZCB0byByZW5kZXIgdGhpcyB0d2VlbiBpbW1lZGlhdGVseSwgd2Ugc2hvdWxkIHNraXAgdGhpcyBhbmQgbWVyZWx5IF9pbml0KCkgdG8gcmVjb3JkIHRoZSBzdGFydGluZyB2YWx1ZXMgKHJlbmRlcmluZyB0aGVtIGltbWVkaWF0ZWx5IHdvdWxkIHB1c2ggdGhlbSB0byBjb21wbGV0aW9uIHdoaWNoIGlzIHdhc3RlZnVsIGluIHRoYXQgY2FzZSAtIHdlJ2QgaGF2ZSB0byByZW5kZXIoLTEpIGltbWVkaWF0ZWx5IGFmdGVyKVxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBUd2VlbkxpdGUudG8odGhpcy50YXJnZXQsIDAsIHB0KTtcblx0XHRcdFx0XHRpZiAoIWltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5faW5pdCgpOyAvL2Vuc3VyZXMgdGhhdCB0aGUgaW5pdGlhbCB2YWx1ZXMgYXJlIHJlY29yZGVkXG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0Ll9lbmFibGVkKGZhbHNlKTsgLy9ubyBuZWVkIHRvIGhhdmUgdGhlIHR3ZWVuIHJlbmRlciBvbiB0aGUgbmV4dCBjeWNsZS4gRGlzYWJsZSBpdCBiZWNhdXNlIHdlJ2xsIGFsd2F5cyBtYW51YWxseSBjb250cm9sIHRoZSByZW5kZXJzIG9mIHRoZSBfc3RhcnRBdCB0d2Vlbi5cblx0XHRcdFx0XHRcdGlmICh0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdGltZSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZWFzZSA9IGVhc2UgPSAoIWVhc2UpID8gVHdlZW5MaXRlLmRlZmF1bHRFYXNlIDogKGVhc2UgaW5zdGFuY2VvZiBFYXNlKSA/IGVhc2UgOiAodHlwZW9mKGVhc2UpID09PSBcImZ1bmN0aW9uXCIpID8gbmV3IEVhc2UoZWFzZSwgdi5lYXNlUGFyYW1zKSA6IF9lYXNlTWFwW2Vhc2VdIHx8IFR3ZWVuTGl0ZS5kZWZhdWx0RWFzZTtcblx0XHRcdGlmICh2LmVhc2VQYXJhbXMgaW5zdGFuY2VvZiBBcnJheSAmJiBlYXNlLmNvbmZpZykge1xuXHRcdFx0XHR0aGlzLl9lYXNlID0gZWFzZS5jb25maWcuYXBwbHkoZWFzZSwgdi5lYXNlUGFyYW1zKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2Vhc2VUeXBlID0gdGhpcy5fZWFzZS5fdHlwZTtcblx0XHRcdHRoaXMuX2Vhc2VQb3dlciA9IHRoaXMuX2Vhc2UuX3Bvd2VyO1xuXHRcdFx0dGhpcy5fZmlyc3RQVCA9IG51bGw7XG5cblx0XHRcdGlmICh0aGlzLl90YXJnZXRzKSB7XG5cdFx0XHRcdGwgPSB0aGlzLl90YXJnZXRzLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdGlmICggdGhpcy5faW5pdFByb3BzKCB0aGlzLl90YXJnZXRzW2ldLCAodGhpcy5fcHJvcExvb2t1cFtpXSA9IHt9KSwgdGhpcy5fc2libGluZ3NbaV0sIChvcCA/IG9wW2ldIDogbnVsbCksIGkpICkge1xuXHRcdFx0XHRcdFx0aW5pdFBsdWdpbnMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5pdFBsdWdpbnMgPSB0aGlzLl9pbml0UHJvcHModGhpcy50YXJnZXQsIHRoaXMuX3Byb3BMb29rdXAsIHRoaXMuX3NpYmxpbmdzLCBvcCwgMCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbml0UGx1Z2lucykge1xuXHRcdFx0XHRUd2VlbkxpdGUuX29uUGx1Z2luRXZlbnQoXCJfb25Jbml0QWxsUHJvcHNcIiwgdGhpcyk7IC8vcmVvcmRlcnMgdGhlIGFycmF5IGluIG9yZGVyIG9mIHByaW9yaXR5LiBVc2VzIGEgc3RhdGljIFR3ZWVuUGx1Z2luIG1ldGhvZCBpbiBvcmRlciB0byBtaW5pbWl6ZSBmaWxlIHNpemUgaW4gVHdlZW5MaXRlXG5cdFx0XHR9XG5cdFx0XHRpZiAob3ApIGlmICghdGhpcy5fZmlyc3RQVCkgaWYgKHR5cGVvZih0aGlzLnRhcmdldCkgIT09IFwiZnVuY3Rpb25cIikgeyAvL2lmIGFsbCB0d2VlbmluZyBwcm9wZXJ0aWVzIGhhdmUgYmVlbiBvdmVyd3JpdHRlbiwga2lsbCB0aGUgdHdlZW4uIElmIHRoZSB0YXJnZXQgaXMgYSBmdW5jdGlvbiwgaXQncyBwcm9iYWJseSBhIGRlbGF5ZWRDYWxsIHNvIGxldCBpdCBsaXZlLlxuXHRcdFx0XHR0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodi5ydW5CYWNrd2FyZHMpIHtcblx0XHRcdFx0cHQgPSB0aGlzLl9maXJzdFBUO1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRwdC5zICs9IHB0LmM7XG5cdFx0XHRcdFx0cHQuYyA9IC1wdC5jO1xuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX29uVXBkYXRlID0gdi5vblVwZGF0ZTtcblx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0cnVlO1xuXHRcdH07XG5cblx0XHRwLl9pbml0UHJvcHMgPSBmdW5jdGlvbih0YXJnZXQsIHByb3BMb29rdXAsIHNpYmxpbmdzLCBvdmVyd3JpdHRlblByb3BzLCBpbmRleCkge1xuXHRcdFx0dmFyIHAsIGksIGluaXRQbHVnaW5zLCBwbHVnaW4sIHB0LCB2O1xuXHRcdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKF9sYXp5TG9va3VwW3RhcmdldC5fZ3NUd2VlbklEXSkge1xuXHRcdFx0XHRfbGF6eVJlbmRlcigpOyAvL2lmIG90aGVyIHR3ZWVucyBvZiB0aGUgc2FtZSB0YXJnZXQgaGF2ZSByZWNlbnRseSBpbml0dGVkIGJ1dCBoYXZlbid0IHJlbmRlcmVkIHlldCwgd2UndmUgZ290IHRvIGZvcmNlIHRoZSByZW5kZXIgc28gdGhhdCB0aGUgc3RhcnRpbmcgdmFsdWVzIGFyZSBjb3JyZWN0IChpbWFnaW5lIHBvcHVsYXRpbmcgYSB0aW1lbGluZSB3aXRoIGEgYnVuY2ggb2Ygc2VxdWVudGlhbCB0d2VlbnMgYW5kIHRoZW4ganVtcGluZyB0byB0aGUgZW5kKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMudmFycy5jc3MpIGlmICh0YXJnZXQuc3R5bGUpIGlmICh0YXJnZXQgIT09IHdpbmRvdyAmJiB0YXJnZXQubm9kZVR5cGUpIGlmIChfcGx1Z2lucy5jc3MpIGlmICh0aGlzLnZhcnMuYXV0b0NTUyAhPT0gZmFsc2UpIHsgLy9pdCdzIHNvIGNvbW1vbiB0byB1c2UgVHdlZW5MaXRlL01heCB0byBhbmltYXRlIHRoZSBjc3Mgb2YgRE9NIGVsZW1lbnRzLCB3ZSBhc3N1bWUgdGhhdCBpZiB0aGUgdGFyZ2V0IGlzIGEgRE9NIGVsZW1lbnQsIHRoYXQncyB3aGF0IGlzIGludGVuZGVkIChhIGNvbnZlbmllbmNlIHNvIHRoYXQgdXNlcnMgZG9uJ3QgaGF2ZSB0byB3cmFwIHRoaW5ncyBpbiBjc3M6e30sIGFsdGhvdWdoIHdlIHN0aWxsIHJlY29tbWVuZCBpdCBmb3IgYSBzbGlnaHQgcGVyZm9ybWFuY2UgYm9vc3QgYW5kIGJldHRlciBzcGVjaWZpY2l0eSkuIE5vdGU6IHdlIGNhbm5vdCBjaGVjayBcIm5vZGVUeXBlXCIgb24gdGhlIHdpbmRvdyBpbnNpZGUgYW4gaWZyYW1lLlxuXHRcdFx0XHRfYXV0b0NTUyh0aGlzLnZhcnMsIHRhcmdldCk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHAgaW4gdGhpcy52YXJzKSB7XG5cdFx0XHRcdHYgPSB0aGlzLnZhcnNbcF07XG5cdFx0XHRcdGlmIChfcmVzZXJ2ZWRQcm9wc1twXSkge1xuXHRcdFx0XHRcdGlmICh2KSBpZiAoKHYgaW5zdGFuY2VvZiBBcnJheSkgfHwgKHYucHVzaCAmJiBfaXNBcnJheSh2KSkpIGlmICh2LmpvaW4oXCJcIikuaW5kZXhPZihcIntzZWxmfVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdHRoaXMudmFyc1twXSA9IHYgPSB0aGlzLl9zd2FwU2VsZkluUGFyYW1zKHYsIHRoaXMpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2UgaWYgKF9wbHVnaW5zW3BdICYmIChwbHVnaW4gPSBuZXcgX3BsdWdpbnNbcF0oKSkuX29uSW5pdFR3ZWVuKHRhcmdldCwgdGhpcy52YXJzW3BdLCB0aGlzLCBpbmRleCkpIHtcblxuXHRcdFx0XHRcdC8vdCAtIHRhcmdldCBcdFx0W29iamVjdF1cblx0XHRcdFx0XHQvL3AgLSBwcm9wZXJ0eSBcdFx0W3N0cmluZ11cblx0XHRcdFx0XHQvL3MgLSBzdGFydFx0XHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0Ly9jIC0gY2hhbmdlXHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0Ly9mIC0gaXNGdW5jdGlvblx0W2Jvb2xlYW5dXG5cdFx0XHRcdFx0Ly9uIC0gbmFtZVx0XHRcdFtzdHJpbmddXG5cdFx0XHRcdFx0Ly9wZyAtIGlzUGx1Z2luIFx0W2Jvb2xlYW5dXG5cdFx0XHRcdFx0Ly9wciAtIHByaW9yaXR5XHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0Ly9tIC0gbW9kICAgICAgICAgICBbZnVuY3Rpb24gfCAwXVxuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdCA9IHtfbmV4dDp0aGlzLl9maXJzdFBULCB0OnBsdWdpbiwgcDpcInNldFJhdGlvXCIsIHM6MCwgYzoxLCBmOjEsIG46cCwgcGc6MSwgcHI6cGx1Z2luLl9wcmlvcml0eSwgbTowfTtcblx0XHRcdFx0XHRpID0gcGx1Z2luLl9vdmVyd3JpdGVQcm9wcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRwcm9wTG9va3VwW3BsdWdpbi5fb3ZlcndyaXRlUHJvcHNbaV1dID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBsdWdpbi5fcHJpb3JpdHkgfHwgcGx1Z2luLl9vbkluaXRBbGxQcm9wcykge1xuXHRcdFx0XHRcdFx0aW5pdFBsdWdpbnMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGx1Z2luLl9vbkRpc2FibGUgfHwgcGx1Z2luLl9vbkVuYWJsZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcm9wTG9va3VwW3BdID0gX2FkZFByb3BUd2Vlbi5jYWxsKHRoaXMsIHRhcmdldCwgcCwgXCJnZXRcIiwgdiwgcCwgMCwgbnVsbCwgdGhpcy52YXJzLnN0cmluZ0ZpbHRlciwgaW5kZXgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvdmVyd3JpdHRlblByb3BzKSBpZiAodGhpcy5fa2lsbChvdmVyd3JpdHRlblByb3BzLCB0YXJnZXQpKSB7IC8vYW5vdGhlciB0d2VlbiBtYXkgaGF2ZSB0cmllZCB0byBvdmVyd3JpdGUgcHJvcGVydGllcyBvZiB0aGlzIHR3ZWVuIGJlZm9yZSBpbml0KCkgd2FzIGNhbGxlZCAobGlrZSBpZiB0d28gdHdlZW5zIHN0YXJ0IGF0IHRoZSBzYW1lIHRpbWUsIHRoZSBvbmUgY3JlYXRlZCBzZWNvbmQgd2lsbCBydW4gZmlyc3QpXG5cdFx0XHRcdHJldHVybiB0aGlzLl9pbml0UHJvcHModGFyZ2V0LCBwcm9wTG9va3VwLCBzaWJsaW5ncywgb3ZlcndyaXR0ZW5Qcm9wcywgaW5kZXgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX292ZXJ3cml0ZSA+IDEpIGlmICh0aGlzLl9maXJzdFBUKSBpZiAoc2libGluZ3MubGVuZ3RoID4gMSkgaWYgKF9hcHBseU92ZXJ3cml0ZSh0YXJnZXQsIHRoaXMsIHByb3BMb29rdXAsIHRoaXMuX292ZXJ3cml0ZSwgc2libGluZ3MpKSB7XG5cdFx0XHRcdHRoaXMuX2tpbGwocHJvcExvb2t1cCwgdGFyZ2V0KTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2luaXRQcm9wcyh0YXJnZXQsIHByb3BMb29rdXAsIHNpYmxpbmdzLCBvdmVyd3JpdHRlblByb3BzLCBpbmRleCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZmlyc3RQVCkgaWYgKCh0aGlzLnZhcnMubGF6eSAhPT0gZmFsc2UgJiYgdGhpcy5fZHVyYXRpb24pIHx8ICh0aGlzLnZhcnMubGF6eSAmJiAhdGhpcy5fZHVyYXRpb24pKSB7IC8vemVybyBkdXJhdGlvbiB0d2VlbnMgZG9uJ3QgbGF6eSByZW5kZXIgYnkgZGVmYXVsdDsgZXZlcnl0aGluZyBlbHNlIGRvZXMuXG5cdFx0XHRcdF9sYXp5TG9va3VwW3RhcmdldC5fZ3NUd2VlbklEXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5pdFBsdWdpbnM7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHR2YXIgcHJldlRpbWUgPSB0aGlzLl90aW1lLFxuXHRcdFx0XHRkdXJhdGlvbiA9IHRoaXMuX2R1cmF0aW9uLFxuXHRcdFx0XHRwcmV2UmF3UHJldlRpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSxcblx0XHRcdFx0aXNDb21wbGV0ZSwgY2FsbGJhY2ssIHB0LCByYXdQcmV2VGltZTtcblx0XHRcdGlmICh0aW1lID49IGR1cmF0aW9uIC0gMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cy5cblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IGR1cmF0aW9uO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMSkgOiAxO1xuXHRcdFx0XHRpZiAoIXRoaXMuX3JldmVyc2VkICkge1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvbkNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0Zm9yY2UgPSAoZm9yY2UgfHwgdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuKTsgLy9vdGhlcndpc2UsIGlmIHRoZSBhbmltYXRpb24gaXMgdW5wYXVzZWQvYWN0aXZhdGVkIGFmdGVyIGl0J3MgYWxyZWFkeSBmaW5pc2hlZCwgaXQgZG9lc24ndCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgdGltZWxpbmUuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwKSBpZiAodGhpcy5faW5pdHRlZCB8fCAhdGhpcy52YXJzLmxhenkgfHwgZm9yY2UpIHsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyBhcmUgdHJpY2t5IGJlY2F1c2Ugd2UgbXVzdCBkaXNjZXJuIHRoZSBtb21lbnR1bS9kaXJlY3Rpb24gb2YgdGltZSBpbiBvcmRlciB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgc3RhcnRpbmcgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCBvciB0aGUgZW5kaW5nIHZhbHVlcy4gSWYgdGhlIFwicGxheWhlYWRcIiBvZiBpdHMgdGltZWxpbmUgZ29lcyBwYXN0IHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGluIHRoZSBmb3J3YXJkIGRpcmVjdGlvbiBvciBsYW5kcyBkaXJlY3RseSBvbiBpdCwgdGhlIGVuZCB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBidXQgaWYgdGhlIHRpbWVsaW5lJ3MgXCJwbGF5aGVhZFwiIG1vdmVzIHBhc3QgaXQgaW4gdGhlIGJhY2t3YXJkIGRpcmVjdGlvbiAoZnJvbSBhIHBvc3RpdGl2ZSB0aW1lIHRvIGEgbmVnYXRpdmUgdGltZSksIHRoZSBzdGFydGluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZC5cblx0XHRcdFx0XHRpZiAodGhpcy5fc3RhcnRUaW1lID09PSB0aGlzLl90aW1lbGluZS5fZHVyYXRpb24pIHsgLy9pZiBhIHplcm8tZHVyYXRpb24gdHdlZW4gaXMgYXQgdGhlIFZFUlkgZW5kIG9mIGEgdGltZWxpbmUgYW5kIHRoYXQgdGltZWxpbmUgcmVuZGVycyBhdCBpdHMgZW5kLCBpdCB3aWxsIHR5cGljYWxseSBhZGQgYSB0aW55IGJpdCBvZiBjdXNoaW9uIHRvIHRoZSByZW5kZXIgdGltZSB0byBwcmV2ZW50IHJvdW5kaW5nIGVycm9ycyBmcm9tIGdldHRpbmcgaW4gdGhlIHdheSBvZiB0d2VlbnMgcmVuZGVyaW5nIHRoZWlyIFZFUlkgZW5kLiBJZiB3ZSB0aGVuIHJldmVyc2UoKSB0aGF0IHRpbWVsaW5lLCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiB3aWxsIHRyaWdnZXIgaXRzIG9uUmV2ZXJzZUNvbXBsZXRlIGV2ZW4gdGhvdWdoIHRlY2huaWNhbGx5IHRoZSBwbGF5aGVhZCBkaWRuJ3QgcGFzcyBvdmVyIGl0IGFnYWluLiBJdCdzIGEgdmVyeSBzcGVjaWZpYyBlZGdlIGNhc2Ugd2UgbXVzdCBhY2NvbW1vZGF0ZS5cblx0XHRcdFx0XHRcdHRpbWUgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lIDwgMCB8fCAodGltZSA8PSAwICYmIHRpbWUgPj0gLTAuMDAwMDAwMSkgfHwgKHByZXZSYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgdGhpcy5kYXRhICE9PSBcImlzUGF1c2VcIikpIGlmIChwcmV2UmF3UHJldlRpbWUgIT09IHRpbWUpIHsgLy9ub3RlOiB3aGVuIHRoaXMuZGF0YSBpcyBcImlzUGF1c2VcIiwgaXQncyBhIGNhbGxiYWNrIGFkZGVkIGJ5IGFkZFBhdXNlKCkgb24gYSB0aW1lbGluZSB0aGF0IHdlIHNob3VsZCBub3QgYmUgdHJpZ2dlcmVkIHdoZW4gTEVBVklORyBpdHMgZXhhY3Qgc3RhcnQgdGltZS4gSW4gb3RoZXIgd29yZHMsIHRsLmFkZFBhdXNlKDEpLnBsYXkoMSkgc2hvdWxkbid0IHBhdXNlLlxuXHRcdFx0XHRcdFx0Zm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYgKHByZXZSYXdQcmV2VGltZSA+IF90aW55TnVtKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHJhd1ByZXZUaW1lID0gKCFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHByZXZSYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmICh0aW1lIDwgMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cywgcm91bmQgc3VwZXIgc21hbGwgdmFsdWVzIHRvIDAuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSAwO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMCkgOiAwO1xuXHRcdFx0XHRpZiAocHJldlRpbWUgIT09IDAgfHwgKGR1cmF0aW9uID09PSAwICYmIHByZXZSYXdQcmV2VGltZSA+IDApKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRoaXMuX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aW1lIDwgMCkge1xuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCkgaWYgKHRoaXMuX2luaXR0ZWQgfHwgIXRoaXMudmFycy5sYXp5IHx8IGZvcmNlKSB7IC8vemVyby1kdXJhdGlvbiB0d2VlbnMgYXJlIHRyaWNreSBiZWNhdXNlIHdlIG11c3QgZGlzY2VybiB0aGUgbW9tZW50dW0vZGlyZWN0aW9uIG9mIHRpbWUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHN0YXJ0aW5nIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQgb3IgdGhlIGVuZGluZyB2YWx1ZXMuIElmIHRoZSBcInBsYXloZWFkXCIgb2YgaXRzIHRpbWVsaW5lIGdvZXMgcGFzdCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiBpbiB0aGUgZm9yd2FyZCBkaXJlY3Rpb24gb3IgbGFuZHMgZGlyZWN0bHkgb24gaXQsIHRoZSBlbmQgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCwgYnV0IGlmIHRoZSB0aW1lbGluZSdzIFwicGxheWhlYWRcIiBtb3ZlcyBwYXN0IGl0IGluIHRoZSBiYWNrd2FyZCBkaXJlY3Rpb24gKGZyb20gYSBwb3N0aXRpdmUgdGltZSB0byBhIG5lZ2F0aXZlIHRpbWUpLCB0aGUgc3RhcnRpbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQuXG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID49IDAgJiYgIShwcmV2UmF3UHJldlRpbWUgPT09IF90aW55TnVtICYmIHRoaXMuZGF0YSA9PT0gXCJpc1BhdXNlXCIpKSB7XG5cdFx0XHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmF3UHJldlRpbWUgPSAoIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgcHJldlJhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLl9pbml0dGVkKSB7IC8vaWYgd2UgcmVuZGVyIHRoZSB2ZXJ5IGJlZ2lubmluZyAodGltZSA9PSAwKSBvZiBhIGZyb21UbygpLCB3ZSBtdXN0IGZvcmNlIHRoZSByZW5kZXIgKG5vcm1hbCB0d2VlbnMgd291bGRuJ3QgbmVlZCB0byByZW5kZXIgYXQgYSB0aW1lIG9mIDAgd2hlbiB0aGUgcHJldlRpbWUgd2FzIGFsc28gMCkuIFRoaXMgaXMgYWxzbyBtYW5kYXRvcnkgdG8gbWFrZSBzdXJlIG92ZXJ3cml0aW5nIGtpY2tzIGluIGltbWVkaWF0ZWx5LlxuXHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IHRpbWU7XG5cblx0XHRcdFx0aWYgKHRoaXMuX2Vhc2VUeXBlKSB7XG5cdFx0XHRcdFx0dmFyIHIgPSB0aW1lIC8gZHVyYXRpb24sIHR5cGUgPSB0aGlzLl9lYXNlVHlwZSwgcG93ID0gdGhpcy5fZWFzZVBvd2VyO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSAxIHx8ICh0eXBlID09PSAzICYmIHIgPj0gMC41KSkge1xuXHRcdFx0XHRcdFx0ciA9IDEgLSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMykge1xuXHRcdFx0XHRcdFx0ciAqPSAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocG93ID09PSAxKSB7XG5cdFx0XHRcdFx0XHRyICo9IHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDIpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDMpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHIgKiByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocG93ID09PSA0KSB7XG5cdFx0XHRcdFx0XHRyICo9IHIgKiByICogciAqIHI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDEpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IDIpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGltZSAvIGR1cmF0aW9uIDwgMC41KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJhdGlvID0gciAvIDI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gKHIgLyAyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbyh0aW1lIC8gZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90aW1lID09PSBwcmV2VGltZSAmJiAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0KCk7XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCB8fCB0aGlzLl9nYykgeyAvL2ltbWVkaWF0ZVJlbmRlciB0d2VlbnMgdHlwaWNhbGx5IHdvbid0IGluaXRpYWxpemUgdW50aWwgdGhlIHBsYXloZWFkIGFkdmFuY2VzIChfdGltZSBpcyBncmVhdGVyIHRoYW4gMCkgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgb3ZlcndyaXRpbmcgb2NjdXJzIHByb3Blcmx5LiBBbHNvLCBpZiBhbGwgb2YgdGhlIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuICh3aGljaCB3b3VsZCBjYXVzZSBfZ2MgdG8gYmUgdHJ1ZSwgYXMgc2V0IGluIF9pbml0KCkpLCB3ZSBzaG91bGRuJ3QgY29udGludWUgb3RoZXJ3aXNlIGFuIG9uU3RhcnQgY2FsbGJhY2sgY291bGQgYmUgY2FsbGVkIGZvciBleGFtcGxlLlxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSBlbHNlIGlmICghZm9yY2UgJiYgdGhpcy5fZmlyc3RQVCAmJiAoKHRoaXMudmFycy5sYXp5ICE9PSBmYWxzZSAmJiB0aGlzLl9kdXJhdGlvbikgfHwgKHRoaXMudmFycy5sYXp5ICYmICF0aGlzLl9kdXJhdGlvbikpKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3RvdGFsVGltZSA9IHByZXZUaW1lO1xuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcHJldlJhd1ByZXZUaW1lO1xuXHRcdFx0XHRcdF9sYXp5VHdlZW5zLnB1c2godGhpcyk7XG5cdFx0XHRcdFx0dGhpcy5fbGF6eSA9IFt0aW1lLCBzdXBwcmVzc0V2ZW50c107XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vX2Vhc2UgaXMgaW5pdGlhbGx5IHNldCB0byBkZWZhdWx0RWFzZSwgc28gbm93IHRoYXQgaW5pdCgpIGhhcyBydW4sIF9lYXNlIGlzIHNldCBwcm9wZXJseSBhbmQgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSB0aGUgcmF0aW8uIE92ZXJhbGwgdGhpcyBpcyBmYXN0ZXIgdGhhbiB1c2luZyBjb25kaXRpb25hbCBsb2dpYyBlYXJsaWVyIGluIHRoZSBtZXRob2QgdG8gYXZvaWQgaGF2aW5nIHRvIHNldCByYXRpbyB0d2ljZSBiZWNhdXNlIHdlIG9ubHkgaW5pdCgpIG9uY2UgYnV0IHJlbmRlclRpbWUoKSBnZXRzIGNhbGxlZCBWRVJZIGZyZXF1ZW50bHkuXG5cdFx0XHRcdGlmICh0aGlzLl90aW1lICYmICFpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuZ2V0UmF0aW8odGhpcy5fdGltZSAvIGR1cmF0aW9uKTtcblx0XHRcdFx0fSBlbHNlIGlmIChpc0NvbXBsZXRlICYmIHRoaXMuX2Vhc2UuX2NhbGNFbmQpIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbygodGhpcy5fdGltZSA9PT0gMCkgPyAwIDogMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9sYXp5ICE9PSBmYWxzZSkgeyAvL2luIGNhc2UgYSBsYXp5IHJlbmRlciBpcyBwZW5kaW5nLCB3ZSBzaG91bGQgZmx1c2ggaXQgYmVjYXVzZSB0aGUgbmV3IHJlbmRlciBpcyBvY2N1cnJpbmcgbm93IChpbWFnaW5lIGEgbGF6eSB0d2VlbiBpbnN0YW50aWF0aW5nIGFuZCB0aGVuIGltbWVkaWF0ZWx5IHRoZSB1c2VyIGNhbGxzIHR3ZWVuLnNlZWsodHdlZW4uZHVyYXRpb24oKSksIHNraXBwaW5nIHRvIHRoZSBlbmQgLSB0aGUgZW5kIHJlbmRlciB3b3VsZCBiZSBmb3JjZWQsIGFuZCB0aGVuIGlmIHdlIGRpZG4ndCBmbHVzaCB0aGUgbGF6eSByZW5kZXIsIGl0J2QgZmlyZSBBRlRFUiB0aGUgc2VlaygpLCByZW5kZXJpbmcgaXQgYXQgdGhlIHdyb25nIHRpbWUuXG5cdFx0XHRcdHRoaXMuX2xhenkgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpcy5fYWN0aXZlKSBpZiAoIXRoaXMuX3BhdXNlZCAmJiB0aGlzLl90aW1lICE9PSBwcmV2VGltZSAmJiB0aW1lID49IDApIHtcblx0XHRcdFx0dGhpcy5fYWN0aXZlID0gdHJ1ZTsgIC8vc28gdGhhdCBpZiB0aGUgdXNlciByZW5kZXJzIGEgdHdlZW4gKGFzIG9wcG9zZWQgdG8gdGhlIHRpbWVsaW5lIHJlbmRlcmluZyBpdCksIHRoZSB0aW1lbGluZSBpcyBmb3JjZWQgdG8gcmUtcmVuZGVyIGFuZCBhbGlnbiBpdCB3aXRoIHRoZSBwcm9wZXIgdGltZS9mcmFtZSBvbiB0aGUgbmV4dCByZW5kZXJpbmcgY3ljbGUuIE1heWJlIHRoZSB0d2VlbiBhbHJlYWR5IGZpbmlzaGVkIGJ1dCB0aGUgdXNlciBtYW51YWxseSByZS1yZW5kZXJzIGl0IGFzIGhhbGZ3YXkgZG9uZS5cblx0XHRcdH1cblx0XHRcdGlmIChwcmV2VGltZSA9PT0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5fc3RhcnRBdCkge1xuXHRcdFx0XHRcdGlmICh0aW1lID49IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJfZHVtbXlHU1wiOyAvL2lmIG5vIGNhbGxiYWNrIGlzIGRlZmluZWQsIHVzZSBhIGR1bW15IHZhbHVlIGp1c3Qgc28gdGhhdCB0aGUgY29uZGl0aW9uIGF0IHRoZSBlbmQgZXZhbHVhdGVzIGFzIHRydWUgYmVjYXVzZSBfc3RhcnRBdCBzaG91bGQgcmVuZGVyIEFGVEVSIHRoZSBub3JtYWwgcmVuZGVyIGxvb3Agd2hlbiB0aGUgdGltZSBpcyBuZWdhdGl2ZS4gV2UgY291bGQgaGFuZGxlIHRoaXMgaW4gYSBtb3JlIGludHVpdGl2ZSB3YXksIG9mIGNvdXJzZSwgYnV0IHRoZSByZW5kZXIgbG9vcCBpcyB0aGUgTU9TVCBpbXBvcnRhbnQgdGhpbmcgdG8gb3B0aW1pemUsIHNvIHRoaXMgdGVjaG5pcXVlIGFsbG93cyB1cyB0byBhdm9pZCBhZGRpbmcgZXh0cmEgY29uZGl0aW9uYWwgbG9naWMgaW4gYSBoaWdoLWZyZXF1ZW5jeSBhcmVhLlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy52YXJzLm9uU3RhcnQpIGlmICh0aGlzLl90aW1lICE9PSAwIHx8IGR1cmF0aW9uID09PSAwKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKHB0LmYpIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucztcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fb25VcGRhdGUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwKSBpZiAodGhpcy5fc3RhcnRBdCAmJiB0aW1lICE9PSAtMC4wMDAxKSB7IC8vaWYgdGhlIHR3ZWVuIGlzIHBvc2l0aW9uZWQgYXQgdGhlIFZFUlkgYmVnaW5uaW5nIChfc3RhcnRUaW1lIDApIG9mIGl0cyBwYXJlbnQgdGltZWxpbmUsIGl0J3MgaWxsZWdhbCBmb3IgdGhlIHBsYXloZWFkIHRvIGdvIGJhY2sgZnVydGhlciwgc28gd2Ugc2hvdWxkIG5vdCByZW5kZXIgdGhlIHJlY29yZGVkIHN0YXJ0QXQgdmFsdWVzLlxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7IC8vbm90ZTogZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIHR1Y2sgdGhpcyBjb25kaXRpb25hbCBsb2dpYyBpbnNpZGUgbGVzcyB0cmF2ZWxlZCBhcmVhcyAobW9zdCB0d2VlbnMgZG9uJ3QgaGF2ZSBhbiBvblVwZGF0ZSkuIFdlJ2QganVzdCBoYXZlIGl0IGF0IHRoZSBlbmQgYmVmb3JlIHRoZSBvbkNvbXBsZXRlLCBidXQgdGhlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCBiZWZvcmUgYW55IG9uVXBkYXRlIGlzIGNhbGxlZCwgc28gd2UgQUxTTyBwdXQgaXQgaGVyZSBhbmQgdGhlbiBpZiBpdCdzIG5vdCBjYWxsZWQsIHdlIGRvIHNvIGxhdGVyIG5lYXIgdGhlIG9uQ29tcGxldGUuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cykgaWYgKHRoaXMuX3RpbWUgIT09IHByZXZUaW1lIHx8IGlzQ29tcGxldGUgfHwgZm9yY2UpIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2FsbGJhY2spIGlmICghdGhpcy5fZ2MgfHwgZm9yY2UpIHsgLy9jaGVjayBfZ2MgYmVjYXVzZSB0aGVyZSdzIGEgY2hhbmNlIHRoYXQga2lsbCgpIGNvdWxkIGJlIGNhbGxlZCBpbiBhbiBvblVwZGF0ZVxuXHRcdFx0XHRpZiAodGltZSA8IDAgJiYgdGhpcy5fc3RhcnRBdCAmJiAhdGhpcy5fb25VcGRhdGUgJiYgdGltZSAhPT0gLTAuMDAwMSkgeyAvLy0wLjAwMDEgaXMgYSBzcGVjaWFsIHZhbHVlIHRoYXQgd2UgdXNlIHdoZW4gbG9vcGluZyBiYWNrIHRvIHRoZSBiZWdpbm5pbmcgb2YgYSByZXBlYXRlZCBUaW1lbGluZU1heCwgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGRuJ3QgcmVuZGVyIHRoZSBfc3RhcnRBdCB2YWx1ZXMuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cyAmJiB0aGlzLnZhcnNbY2FsbGJhY2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCAmJiB0aGlzLl9yYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgcmF3UHJldlRpbWUgIT09IF90aW55TnVtKSB7IC8vdGhlIG9uQ29tcGxldGUgb3Igb25SZXZlcnNlQ29tcGxldGUgY291bGQgdHJpZ2dlciBtb3ZlbWVudCBvZiB0aGUgcGxheWhlYWQgYW5kIGZvciB6ZXJvLWR1cmF0aW9uIHR3ZWVucyAod2hpY2ggbXVzdCBkaXNjZXJuIGRpcmVjdGlvbikgdGhhdCBsYW5kIGRpcmVjdGx5IGJhY2sgb24gdGhlaXIgc3RhcnQgdGltZSwgd2UgZG9uJ3Qgd2FudCB0byBmaXJlIGFnYWluIG9uIHRoZSBuZXh0IHJlbmRlci4gVGhpbmsgb2Ygc2V2ZXJhbCBhZGRQYXVzZSgpJ3MgaW4gYSB0aW1lbGluZSB0aGF0IGZvcmNlcyB0aGUgcGxheWhlYWQgdG8gYSBjZXJ0YWluIHNwb3QsIGJ1dCB3aGF0IGlmIGl0J3MgYWxyZWFkeSBwYXVzZWQgYW5kIGFub3RoZXIgdHdlZW4gaXMgdHdlZW5pbmcgdGhlIFwidGltZVwiIG9mIHRoZSB0aW1lbGluZT8gRWFjaCB0aW1lIGl0IG1vdmVzIFtmb3J3YXJkXSBwYXN0IHRoYXQgc3BvdCwgaXQgd291bGQgbW92ZSBiYWNrLCBhbmQgc2luY2Ugc3VwcHJlc3NFdmVudHMgaXMgdHJ1ZSwgaXQnZCByZXNldCBfcmF3UHJldlRpbWUgdG8gX3RpbnlOdW0gc28gdGhhdCB3aGVuIGl0IGJlZ2lucyBhZ2FpbiwgdGhlIGNhbGxiYWNrIHdvdWxkIGZpcmUgKHNvIHVsdGltYXRlbHkgaXQgY291bGQgYm91bmNlIGJhY2sgYW5kIGZvcnRoIGR1cmluZyB0aGF0IHR3ZWVuKS4gQWdhaW4sIHRoaXMgaXMgYSB2ZXJ5IHVuY29tbW9uIHNjZW5hcmlvLCBidXQgcG9zc2libGUgbm9uZXRoZWxlc3MuXG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuX2tpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQsIG92ZXJ3cml0aW5nVHdlZW4pIHtcblx0XHRcdGlmICh2YXJzID09PSBcImFsbFwiKSB7XG5cdFx0XHRcdHZhcnMgPSBudWxsO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhcnMgPT0gbnVsbCkgaWYgKHRhcmdldCA9PSBudWxsIHx8IHRhcmdldCA9PT0gdGhpcy50YXJnZXQpIHtcblx0XHRcdFx0dGhpcy5fbGF6eSA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0ID0gKHR5cGVvZih0YXJnZXQpICE9PSBcInN0cmluZ1wiKSA/ICh0YXJnZXQgfHwgdGhpcy5fdGFyZ2V0cyB8fCB0aGlzLnRhcmdldCkgOiBUd2VlbkxpdGUuc2VsZWN0b3IodGFyZ2V0KSB8fCB0YXJnZXQ7XG5cdFx0XHR2YXIgc2ltdWx0YW5lb3VzT3ZlcndyaXRlID0gKG92ZXJ3cml0aW5nVHdlZW4gJiYgdGhpcy5fdGltZSAmJiBvdmVyd3JpdGluZ1R3ZWVuLl9zdGFydFRpbWUgPT09IHRoaXMuX3N0YXJ0VGltZSAmJiB0aGlzLl90aW1lbGluZSA9PT0gb3ZlcndyaXRpbmdUd2Vlbi5fdGltZWxpbmUpLFxuXHRcdFx0XHRpLCBvdmVyd3JpdHRlblByb3BzLCBwLCBwdCwgcHJvcExvb2t1cCwgY2hhbmdlZCwga2lsbFByb3BzLCByZWNvcmQsIGtpbGxlZDtcblx0XHRcdGlmICgoX2lzQXJyYXkodGFyZ2V0KSB8fCBfaXNTZWxlY3Rvcih0YXJnZXQpKSAmJiB0eXBlb2YodGFyZ2V0WzBdKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRpID0gdGFyZ2V0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2tpbGwodmFycywgdGFyZ2V0W2ldLCBvdmVyd3JpdGluZ1R3ZWVuKSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodGhpcy5fdGFyZ2V0cykge1xuXHRcdFx0XHRcdGkgPSB0aGlzLl90YXJnZXRzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICh0YXJnZXQgPT09IHRoaXMuX3RhcmdldHNbaV0pIHtcblx0XHRcdFx0XHRcdFx0cHJvcExvb2t1cCA9IHRoaXMuX3Byb3BMb29rdXBbaV0gfHwge307XG5cdFx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRvdmVyd3JpdHRlblByb3BzID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc1tpXSA9IHZhcnMgPyB0aGlzLl9vdmVyd3JpdHRlblByb3BzW2ldIHx8IHt9IDogXCJhbGxcIjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcmdldCAhPT0gdGhpcy50YXJnZXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHJvcExvb2t1cCA9IHRoaXMuX3Byb3BMb29rdXA7XG5cdFx0XHRcdFx0b3ZlcndyaXR0ZW5Qcm9wcyA9IHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgPSB2YXJzID8gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyB8fCB7fSA6IFwiYWxsXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocHJvcExvb2t1cCkge1xuXHRcdFx0XHRcdGtpbGxQcm9wcyA9IHZhcnMgfHwgcHJvcExvb2t1cDtcblx0XHRcdFx0XHRyZWNvcmQgPSAodmFycyAhPT0gb3ZlcndyaXR0ZW5Qcm9wcyAmJiBvdmVyd3JpdHRlblByb3BzICE9PSBcImFsbFwiICYmIHZhcnMgIT09IHByb3BMb29rdXAgJiYgKHR5cGVvZih2YXJzKSAhPT0gXCJvYmplY3RcIiB8fCAhdmFycy5fdGVtcEtpbGwpKTsgLy9fdGVtcEtpbGwgaXMgYSBzdXBlci1zZWNyZXQgd2F5IHRvIGRlbGV0ZSBhIHBhcnRpY3VsYXIgdHdlZW5pbmcgcHJvcGVydHkgYnV0IE5PVCBoYXZlIGl0IHJlbWVtYmVyZWQgYXMgYW4gb2ZmaWNpYWwgb3ZlcndyaXR0ZW4gcHJvcGVydHkgKGxpa2UgaW4gQmV6aWVyUGx1Z2luKVxuXHRcdFx0XHRcdGlmIChvdmVyd3JpdGluZ1R3ZWVuICYmIChUd2VlbkxpdGUub25PdmVyd3JpdGUgfHwgdGhpcy52YXJzLm9uT3ZlcndyaXRlKSkge1xuXHRcdFx0XHRcdFx0Zm9yIChwIGluIGtpbGxQcm9wcykge1xuXHRcdFx0XHRcdFx0XHRpZiAocHJvcExvb2t1cFtwXSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICgha2lsbGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRraWxsZWQgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0a2lsbGVkLnB1c2gocCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgoa2lsbGVkIHx8ICF2YXJzKSAmJiAhX29uT3ZlcndyaXRlKHRoaXMsIG92ZXJ3cml0aW5nVHdlZW4sIHRhcmdldCwga2lsbGVkKSkgeyAvL2lmIHRoZSBvbk92ZXJ3cml0ZSByZXR1cm5lZCBmYWxzZSwgdGhhdCBtZWFucyB0aGUgdXNlciB3YW50cyB0byBvdmVycmlkZSB0aGUgb3ZlcndyaXRpbmcgKGNhbmNlbCBpdCkuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHAgaW4ga2lsbFByb3BzKSB7XG5cdFx0XHRcdFx0XHRpZiAoKHB0ID0gcHJvcExvb2t1cFtwXSkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNpbXVsdGFuZW91c092ZXJ3cml0ZSkgeyAvL2lmIGFub3RoZXIgdHdlZW4gb3ZlcndyaXRlcyB0aGlzIG9uZSBhbmQgdGhleSBib3RoIHN0YXJ0IGF0IGV4YWN0bHkgdGhlIHNhbWUgdGltZSwgeWV0IHRoaXMgdHdlZW4gaGFzIGFscmVhZHkgcmVuZGVyZWQgb25jZSAoZm9yIGV4YW1wbGUsIGF0IDAuMDAxKSBiZWNhdXNlIGl0J3MgZmlyc3QgaW4gdGhlIHF1ZXVlLCB3ZSBzaG91bGQgcmV2ZXJ0IHRoZSB2YWx1ZXMgdG8gd2hlcmUgdGhleSB3ZXJlIGF0IDAgc28gdGhhdCB0aGUgc3RhcnRpbmcgdmFsdWVzIGFyZW4ndCBjb250YW1pbmF0ZWQgb24gdGhlIG92ZXJ3cml0aW5nIHR3ZWVuLlxuXHRcdFx0XHRcdFx0XHRcdGlmIChwdC5mKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LnMpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQucztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHB0LnBnICYmIHB0LnQuX2tpbGwoa2lsbFByb3BzKSkge1xuXHRcdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlOyAvL3NvbWUgcGx1Z2lucyBuZWVkIHRvIGJlIG5vdGlmaWVkIHNvIHRoZXkgY2FuIHBlcmZvcm0gY2xlYW51cCB0YXNrcyBmaXJzdFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghcHQucGcgfHwgcHQudC5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQgPT09IHRoaXMuX2ZpcnN0UFQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0Ll9wcmV2O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRwdC5fbmV4dCA9IHB0Ll9wcmV2ID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkZWxldGUgcHJvcExvb2t1cFtwXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChyZWNvcmQpIHtcblx0XHRcdFx0XHRcdFx0b3ZlcndyaXR0ZW5Qcm9wc1twXSA9IDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghdGhpcy5fZmlyc3RQVCAmJiB0aGlzLl9pbml0dGVkKSB7IC8vaWYgYWxsIHR3ZWVuaW5nIHByb3BlcnRpZXMgYXJlIGtpbGxlZCwga2lsbCB0aGUgdHdlZW4uIFdpdGhvdXQgdGhpcyBsaW5lLCBpZiB0aGVyZSdzIGEgdHdlZW4gd2l0aCBtdWx0aXBsZSB0YXJnZXRzIGFuZCB0aGVuIHlvdSBraWxsVHdlZW5zT2YoKSBlYWNoIHRhcmdldCBpbmRpdmlkdWFsbHksIHRoZSB0d2VlbiB3b3VsZCB0ZWNobmljYWxseSBzdGlsbCByZW1haW4gYWN0aXZlIGFuZCBmaXJlIGl0cyBvbkNvbXBsZXRlIGV2ZW4gdGhvdWdoIHRoZXJlIGFyZW4ndCBhbnkgbW9yZSBwcm9wZXJ0aWVzIHR3ZWVuaW5nLlxuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0fTtcblxuXHRcdHAuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQpIHtcblx0XHRcdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50KFwiX29uRGlzYWJsZVwiLCB0aGlzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2ZpcnN0UFQgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzID0gdGhpcy5fc3RhcnRBdCA9IHRoaXMuX29uVXBkYXRlID0gbnVsbDtcblx0XHRcdHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQgPSB0aGlzLl9hY3RpdmUgPSB0aGlzLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9wcm9wTG9va3VwID0gKHRoaXMuX3RhcmdldHMpID8ge30gOiBbXTtcblx0XHRcdEFuaW1hdGlvbi5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpO1xuXHRcdFx0aWYgKHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIpIHtcblx0XHRcdFx0dGhpcy5fdGltZSA9IC1fdGlueU51bTsgLy9mb3JjZXMgYSByZW5kZXIgd2l0aG91dCBoYXZpbmcgdG8gc2V0IHRoZSByZW5kZXIoKSBcImZvcmNlXCIgcGFyYW1ldGVyIHRvIHRydWUgYmVjYXVzZSB3ZSB3YW50IHRvIGFsbG93IGxhenlpbmcgYnkgZGVmYXVsdCAodXNpbmcgdGhlIFwiZm9yY2VcIiBwYXJhbWV0ZXIgYWx3YXlzIGZvcmNlcyBhbiBpbW1lZGlhdGUgZnVsbCByZW5kZXIpXG5cdFx0XHRcdHRoaXMucmVuZGVyKE1hdGgubWluKDAsIC10aGlzLl9kZWxheSkpOyAvL2luIGNhc2UgZGVsYXkgaXMgbmVnYXRpdmUuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uKGVuYWJsZWQsIGlnbm9yZVRpbWVsaW5lKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZW5hYmxlZCAmJiB0aGlzLl9nYykge1xuXHRcdFx0XHR2YXIgdGFyZ2V0cyA9IHRoaXMuX3RhcmdldHMsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0aWYgKHRhcmdldHMpIHtcblx0XHRcdFx0XHRpID0gdGFyZ2V0cy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zaWJsaW5nc1tpXSA9IF9yZWdpc3Rlcih0YXJnZXRzW2ldLCB0aGlzLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fc2libGluZ3MgPSBfcmVnaXN0ZXIodGhpcy50YXJnZXQsIHRoaXMsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRBbmltYXRpb24ucHJvdG90eXBlLl9lbmFibGVkLmNhbGwodGhpcywgZW5hYmxlZCwgaWdub3JlVGltZWxpbmUpO1xuXHRcdFx0aWYgKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQpIGlmICh0aGlzLl9maXJzdFBUKSB7XG5cdFx0XHRcdHJldHVybiBUd2VlbkxpdGUuX29uUGx1Z2luRXZlbnQoKGVuYWJsZWQgPyBcIl9vbkVuYWJsZVwiIDogXCJfb25EaXNhYmxlXCIpLCB0aGlzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cbi8vLS0tLVR3ZWVuTGl0ZSBzdGF0aWMgbWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0VHdlZW5MaXRlLnRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5mcm9tID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0dmFycy5ydW5CYWNrd2FyZHMgPSB0cnVlO1xuXHRcdFx0dmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5mcm9tVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBmcm9tVmFycywgdG9WYXJzKSB7XG5cdFx0XHR0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuXHRcdFx0dG9WYXJzLmltbWVkaWF0ZVJlbmRlciA9ICh0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlICYmIGZyb21WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTGl0ZSh0YXJnZXQsIGR1cmF0aW9uLCB0b1ZhcnMpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuZGVsYXllZENhbGwgPSBmdW5jdGlvbihkZWxheSwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUsIHVzZUZyYW1lcykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUoY2FsbGJhY2ssIDAsIHtkZWxheTpkZWxheSwgb25Db21wbGV0ZTpjYWxsYmFjaywgb25Db21wbGV0ZVBhcmFtczpwYXJhbXMsIGNhbGxiYWNrU2NvcGU6c2NvcGUsIG9uUmV2ZXJzZUNvbXBsZXRlOmNhbGxiYWNrLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczpwYXJhbXMsIGltbWVkaWF0ZVJlbmRlcjpmYWxzZSwgbGF6eTpmYWxzZSwgdXNlRnJhbWVzOnVzZUZyYW1lcywgb3ZlcndyaXRlOjB9KTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLnNldCA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCAwLCB2YXJzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmdldFR3ZWVuc09mID0gZnVuY3Rpb24odGFyZ2V0LCBvbmx5QWN0aXZlKSB7XG5cdFx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHsgcmV0dXJuIFtdOyB9XG5cdFx0XHR0YXJnZXQgPSAodHlwZW9mKHRhcmdldCkgIT09IFwic3RyaW5nXCIpID8gdGFyZ2V0IDogVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldCkgfHwgdGFyZ2V0O1xuXHRcdFx0dmFyIGksIGEsIGosIHQ7XG5cdFx0XHRpZiAoKF9pc0FycmF5KHRhcmdldCkgfHwgX2lzU2VsZWN0b3IodGFyZ2V0KSkgJiYgdHlwZW9mKHRhcmdldFswXSkgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0aSA9IHRhcmdldC5sZW5ndGg7XG5cdFx0XHRcdGEgPSBbXTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0YSA9IGEuY29uY2F0KFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZih0YXJnZXRbaV0sIG9ubHlBY3RpdmUpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdC8vbm93IGdldCByaWQgb2YgYW55IGR1cGxpY2F0ZXMgKHR3ZWVucyBvZiBhcnJheXMgb2Ygb2JqZWN0cyBjb3VsZCBjYXVzZSBkdXBsaWNhdGVzKVxuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHR0ID0gYVtpXTtcblx0XHRcdFx0XHRqID0gaTtcblx0XHRcdFx0XHR3aGlsZSAoLS1qID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICh0ID09PSBhW2pdKSB7XG5cdFx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YSA9IF9yZWdpc3Rlcih0YXJnZXQpLmNvbmNhdCgpO1xuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChhW2ldLl9nYyB8fCAob25seUFjdGl2ZSAmJiAhYVtpXS5pc0FjdGl2ZSgpKSkge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiA9IFR3ZWVuTGl0ZS5raWxsRGVsYXllZENhbGxzVG8gPSBmdW5jdGlvbih0YXJnZXQsIG9ubHlBY3RpdmUsIHZhcnMpIHtcblx0XHRcdGlmICh0eXBlb2Yob25seUFjdGl2ZSkgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0dmFycyA9IG9ubHlBY3RpdmU7IC8vZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IChiZWZvcmUgXCJvbmx5QWN0aXZlXCIgcGFyYW1ldGVyIHdhcyBpbnNlcnRlZClcblx0XHRcdFx0b25seUFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGEgPSBUd2VlbkxpdGUuZ2V0VHdlZW5zT2YodGFyZ2V0LCBvbmx5QWN0aXZlKSxcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGFbaV0uX2tpbGwodmFycywgdGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFR3ZWVuUGx1Z2luICAgKGNvdWxkIGVhc2lseSBiZSBzcGxpdCBvdXQgYXMgYSBzZXBhcmF0ZSBmaWxlL2NsYXNzLCBidXQgaW5jbHVkZWQgZm9yIGVhc2Ugb2YgdXNlIChzbyB0aGF0IHBlb3BsZSBkb24ndCBuZWVkIHRvIGluY2x1ZGUgYW5vdGhlciBzY3JpcHQgY2FsbCBiZWZvcmUgbG9hZGluZyBwbHVnaW5zIHdoaWNoIGlzIGVhc3kgdG8gZm9yZ2V0KVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIFR3ZWVuUGx1Z2luID0gX2NsYXNzKFwicGx1Z2lucy5Ud2VlblBsdWdpblwiLCBmdW5jdGlvbihwcm9wcywgcHJpb3JpdHkpIHtcblx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcyA9IChwcm9wcyB8fCBcIlwiKS5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0dGhpcy5fcHJvcE5hbWUgPSB0aGlzLl9vdmVyd3JpdGVQcm9wc1swXTtcblx0XHRcdFx0XHR0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0XHRcdFx0dGhpcy5fc3VwZXIgPSBUd2VlblBsdWdpbi5wcm90b3R5cGU7XG5cdFx0XHRcdH0sIHRydWUpO1xuXG5cdFx0cCA9IFR3ZWVuUGx1Z2luLnByb3RvdHlwZTtcblx0XHRUd2VlblBsdWdpbi52ZXJzaW9uID0gXCIxLjE5LjBcIjtcblx0XHRUd2VlblBsdWdpbi5BUEkgPSAyO1xuXHRcdHAuX2ZpcnN0UFQgPSBudWxsO1xuXHRcdHAuX2FkZFR3ZWVuID0gX2FkZFByb3BUd2Vlbjtcblx0XHRwLnNldFJhdGlvID0gX3NldFJhdGlvO1xuXG5cdFx0cC5fa2lsbCA9IGZ1bmN0aW9uKGxvb2t1cCkge1xuXHRcdFx0dmFyIGEgPSB0aGlzLl9vdmVyd3JpdGVQcm9wcyxcblx0XHRcdFx0cHQgPSB0aGlzLl9maXJzdFBULFxuXHRcdFx0XHRpO1xuXHRcdFx0aWYgKGxvb2t1cFt0aGlzLl9wcm9wTmFtZV0gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcyA9IFtdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobG9va3VwW2FbaV1dICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdGlmIChsb29rdXBbcHQubl0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdC5fcHJldjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0cHQuX3ByZXYgPSBudWxsO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fZmlyc3RQVCA9PT0gcHQpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0cC5fbW9kID0gcC5fcm91bmRQcm9wcyA9IGZ1bmN0aW9uKGxvb2t1cCkge1xuXHRcdFx0dmFyIHB0ID0gdGhpcy5fZmlyc3RQVCxcblx0XHRcdFx0dmFsO1xuXHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdHZhbCA9IGxvb2t1cFt0aGlzLl9wcm9wTmFtZV0gfHwgKHB0Lm4gIT0gbnVsbCAmJiBsb29rdXBbIHB0Lm4uc3BsaXQodGhpcy5fcHJvcE5hbWUgKyBcIl9cIikuam9pbihcIlwiKSBdKTtcblx0XHRcdFx0aWYgKHZhbCAmJiB0eXBlb2YodmFsKSA9PT0gXCJmdW5jdGlvblwiKSB7IC8vc29tZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIHZlcnkgcGx1Z2luLXNwZWNpZmljIGFkZCBhIHByZWZpeCBuYW1lZCBhZnRlciB0aGUgX3Byb3BOYW1lIHBsdXMgYW4gdW5kZXJzY29yZSwgc28gd2UgbmVlZCB0byBpZ25vcmUgdGhhdCBleHRyYSBzdHVmZiBoZXJlLlxuXHRcdFx0XHRcdGlmIChwdC5mID09PSAyKSB7XG5cdFx0XHRcdFx0XHRwdC50Ll9hcHBseVBULm0gPSB2YWw7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0Lm0gPSB2YWw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudCA9IGZ1bmN0aW9uKHR5cGUsIHR3ZWVuKSB7XG5cdFx0XHR2YXIgcHQgPSB0d2Vlbi5fZmlyc3RQVCxcblx0XHRcdFx0Y2hhbmdlZCwgcHQyLCBmaXJzdCwgbGFzdCwgbmV4dDtcblx0XHRcdGlmICh0eXBlID09PSBcIl9vbkluaXRBbGxQcm9wc1wiKSB7XG5cdFx0XHRcdC8vc29ydHMgdGhlIFByb3BUd2VlbiBsaW5rZWQgbGlzdCBpbiBvcmRlciBvZiBwcmlvcml0eSBiZWNhdXNlIHNvbWUgcGx1Z2lucyBuZWVkIHRvIHJlbmRlciBlYXJsaWVyL2xhdGVyIHRoYW4gb3RoZXJzLCBsaWtlIE1vdGlvbkJsdXJQbHVnaW4gYXBwbGllcyBpdHMgZWZmZWN0cyBhZnRlciBhbGwgeC95L2FscGhhIHR3ZWVucyBoYXZlIHJlbmRlcmVkIG9uIGVhY2ggZnJhbWUuXG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdG5leHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRwdDIgPSBmaXJzdDtcblx0XHRcdFx0XHR3aGlsZSAocHQyICYmIHB0Mi5wciA+IHB0LnByKSB7XG5cdFx0XHRcdFx0XHRwdDIgPSBwdDIuX25leHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgocHQuX3ByZXYgPSBwdDIgPyBwdDIuX3ByZXYgOiBsYXN0KSkge1xuXHRcdFx0XHRcdFx0cHQuX3ByZXYuX25leHQgPSBwdDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Zmlyc3QgPSBwdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKChwdC5fbmV4dCA9IHB0MikpIHtcblx0XHRcdFx0XHRcdHB0Mi5fcHJldiA9IHB0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsYXN0ID0gcHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHR3ZWVuLl9maXJzdFBUID0gZmlyc3Q7XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKHB0LnBnKSBpZiAodHlwZW9mKHB0LnRbdHlwZV0pID09PSBcImZ1bmN0aW9uXCIpIGlmIChwdC50W3R5cGVdKCkpIHtcblx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0fTtcblxuXHRcdFR3ZWVuUGx1Z2luLmFjdGl2YXRlID0gZnVuY3Rpb24ocGx1Z2lucykge1xuXHRcdFx0dmFyIGkgPSBwbHVnaW5zLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRpZiAocGx1Z2luc1tpXS5BUEkgPT09IFR3ZWVuUGx1Z2luLkFQSSkge1xuXHRcdFx0XHRcdF9wbHVnaW5zWyhuZXcgcGx1Z2luc1tpXSgpKS5fcHJvcE5hbWVdID0gcGx1Z2luc1tpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblxuXHRcdC8vcHJvdmlkZXMgYSBtb3JlIGNvbmNpc2Ugd2F5IHRvIGRlZmluZSBwbHVnaW5zIHRoYXQgaGF2ZSBubyBkZXBlbmRlbmNpZXMgYmVzaWRlcyBUd2VlblBsdWdpbiBhbmQgVHdlZW5MaXRlLCB3cmFwcGluZyBjb21tb24gYm9pbGVycGxhdGUgc3R1ZmYgaW50byBvbmUgZnVuY3Rpb24gKGFkZGVkIGluIDEuOS4wKS4gWW91IGRvbid0IE5FRUQgdG8gdXNlIHRoaXMgdG8gZGVmaW5lIGEgcGx1Z2luIC0gdGhlIG9sZCB3YXkgc3RpbGwgd29ya3MgYW5kIGNhbiBiZSB1c2VmdWwgaW4gY2VydGFpbiAocmFyZSkgc2l0dWF0aW9ucy5cblx0XHRfZ3NEZWZpbmUucGx1Z2luID0gZnVuY3Rpb24oY29uZmlnKSB7XG5cdFx0XHRpZiAoIWNvbmZpZyB8fCAhY29uZmlnLnByb3BOYW1lIHx8ICFjb25maWcuaW5pdCB8fCAhY29uZmlnLkFQSSkgeyB0aHJvdyBcImlsbGVnYWwgcGx1Z2luIGRlZmluaXRpb24uXCI7IH1cblx0XHRcdHZhciBwcm9wTmFtZSA9IGNvbmZpZy5wcm9wTmFtZSxcblx0XHRcdFx0cHJpb3JpdHkgPSBjb25maWcucHJpb3JpdHkgfHwgMCxcblx0XHRcdFx0b3ZlcndyaXRlUHJvcHMgPSBjb25maWcub3ZlcndyaXRlUHJvcHMsXG5cdFx0XHRcdG1hcCA9IHtpbml0OlwiX29uSW5pdFR3ZWVuXCIsIHNldDpcInNldFJhdGlvXCIsIGtpbGw6XCJfa2lsbFwiLCByb3VuZDpcIl9tb2RcIiwgbW9kOlwiX21vZFwiLCBpbml0QWxsOlwiX29uSW5pdEFsbFByb3BzXCJ9LFxuXHRcdFx0XHRQbHVnaW4gPSBfY2xhc3MoXCJwbHVnaW5zLlwiICsgcHJvcE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wTmFtZS5zdWJzdHIoMSkgKyBcIlBsdWdpblwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0VHdlZW5QbHVnaW4uY2FsbCh0aGlzLCBwcm9wTmFtZSwgcHJpb3JpdHkpO1xuXHRcdFx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMgPSBvdmVyd3JpdGVQcm9wcyB8fCBbXTtcblx0XHRcdFx0XHR9LCAoY29uZmlnLmdsb2JhbCA9PT0gdHJ1ZSkpLFxuXHRcdFx0XHRwID0gUGx1Z2luLnByb3RvdHlwZSA9IG5ldyBUd2VlblBsdWdpbihwcm9wTmFtZSksXG5cdFx0XHRcdHByb3A7XG5cdFx0XHRwLmNvbnN0cnVjdG9yID0gUGx1Z2luO1xuXHRcdFx0UGx1Z2luLkFQSSA9IGNvbmZpZy5BUEk7XG5cdFx0XHRmb3IgKHByb3AgaW4gbWFwKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YoY29uZmlnW3Byb3BdKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0cFttYXBbcHJvcF1dID0gY29uZmlnW3Byb3BdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRQbHVnaW4udmVyc2lvbiA9IGNvbmZpZy52ZXJzaW9uO1xuXHRcdFx0VHdlZW5QbHVnaW4uYWN0aXZhdGUoW1BsdWdpbl0pO1xuXHRcdFx0cmV0dXJuIFBsdWdpbjtcblx0XHR9O1xuXG5cblx0XHQvL25vdyBydW4gdGhyb3VnaCBhbGwgdGhlIGRlcGVuZGVuY2llcyBkaXNjb3ZlcmVkIGFuZCBpZiBhbnkgYXJlIG1pc3NpbmcsIGxvZyB0aGF0IHRvIHRoZSBjb25zb2xlIGFzIGEgd2FybmluZy4gVGhpcyBpcyB3aHkgaXQncyBiZXN0IHRvIGhhdmUgVHdlZW5MaXRlIGxvYWQgbGFzdCAtIGl0IGNhbiBjaGVjayBhbGwgdGhlIGRlcGVuZGVuY2llcyBmb3IgeW91LlxuXHRcdGEgPSB3aW5kb3cuX2dzUXVldWU7XG5cdFx0aWYgKGEpIHtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGFbaV0oKTtcblx0XHRcdH1cblx0XHRcdGZvciAocCBpbiBfZGVmTG9va3VwKSB7XG5cdFx0XHRcdGlmICghX2RlZkxvb2t1cFtwXS5mdW5jKSB7XG5cdFx0XHRcdFx0d2luZG93LmNvbnNvbGUubG9nKFwiR1NBUCBlbmNvdW50ZXJlZCBtaXNzaW5nIGRlcGVuZGVuY3k6IFwiICsgcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRfdGlja2VyQWN0aXZlID0gZmFsc2U7IC8vZW5zdXJlcyB0aGF0IHRoZSBmaXJzdCBvZmZpY2lhbCBhbmltYXRpb24gZm9yY2VzIGEgdGlja2VyLnRpY2soKSB0byB1cGRhdGUgdGhlIHRpbWUgd2hlbiBpdCBpcyBpbnN0YW50aWF0ZWRcblxufSkoKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZihnbG9iYWwpICE9PSBcInVuZGVmaW5lZFwiKSA/IGdsb2JhbCA6IHRoaXMgfHwgd2luZG93LCBcIlR3ZWVuTWF4XCIpOyIsIi8vIHJhbmRvbUNvbG9yIGJ5IERhdmlkIE1lcmZpZWxkIHVuZGVyIHRoZSBDQzAgbGljZW5zZVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2RhdmlkbWVyZmllbGQvcmFuZG9tQ29sb3IvXG5cbjsoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuXG4gIC8vIFN1cHBvcnQgQU1EXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuXG4gIC8vIFN1cHBvcnQgQ29tbW9uSlNcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICB2YXIgcmFuZG9tQ29sb3IgPSBmYWN0b3J5KCk7XG5cbiAgICAvLyBTdXBwb3J0IE5vZGVKUyAmIENvbXBvbmVudCwgd2hpY2ggYWxsb3cgbW9kdWxlLmV4cG9ydHMgdG8gYmUgYSBmdW5jdGlvblxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJhbmRvbUNvbG9yO1xuICAgIH1cblxuICAgIC8vIFN1cHBvcnQgQ29tbW9uSlMgMS4xLjEgc3BlY1xuICAgIGV4cG9ydHMucmFuZG9tQ29sb3IgPSByYW5kb21Db2xvcjtcblxuICAvLyBTdXBwb3J0IHZhbmlsbGEgc2NyaXB0IGxvYWRpbmdcbiAgfSBlbHNlIHtcbiAgICByb290LnJhbmRvbUNvbG9yID0gZmFjdG9yeSgpO1xuICB9XG5cbn0odGhpcywgZnVuY3Rpb24oKSB7XG5cbiAgLy8gU2VlZCB0byBnZXQgcmVwZWF0YWJsZSBjb2xvcnNcbiAgdmFyIHNlZWQgPSBudWxsO1xuXG4gIC8vIFNoYXJlZCBjb2xvciBkaWN0aW9uYXJ5XG4gIHZhciBjb2xvckRpY3Rpb25hcnkgPSB7fTtcblxuICAvLyBQb3B1bGF0ZSB0aGUgY29sb3IgZGljdGlvbmFyeVxuICBsb2FkQ29sb3JCb3VuZHMoKTtcblxuICB2YXIgcmFuZG9tQ29sb3IgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHNlZWQgYW5kIGVuc3VyZSBpdCdzIGFuXG4gICAgLy8gaW50ZWdlci4gT3RoZXJ3aXNlLCByZXNldCB0aGUgc2VlZCB2YWx1ZS5cbiAgICBpZiAob3B0aW9ucy5zZWVkICYmIG9wdGlvbnMuc2VlZCA9PT0gcGFyc2VJbnQob3B0aW9ucy5zZWVkLCAxMCkpIHtcbiAgICAgIHNlZWQgPSBvcHRpb25zLnNlZWQ7XG5cbiAgICAvLyBBIHN0cmluZyB3YXMgcGFzc2VkIGFzIGEgc2VlZFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuc2VlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNlZWQgPSBzdHJpbmdUb0ludGVnZXIob3B0aW9ucy5zZWVkKTtcblxuICAgIC8vIFNvbWV0aGluZyB3YXMgcGFzc2VkIGFzIGEgc2VlZCBidXQgaXQgd2Fzbid0IGFuIGludGVnZXIgb3Igc3RyaW5nXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnNlZWQgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnNlZWQgIT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBzZWVkIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlciBvciBzdHJpbmcnKTtcblxuICAgIC8vIE5vIHNlZWQsIHJlc2V0IHRoZSB2YWx1ZSBvdXRzaWRlLlxuICAgIH0gZWxzZSB7XG4gICAgICBzZWVkID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgSCxTLEI7XG5cbiAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIGdlbmVyYXRlIG11bHRpcGxlIGNvbG9yc1xuICAgIGlmIChvcHRpb25zLmNvdW50ICE9PSBudWxsICYmIG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICB2YXIgdG90YWxDb2xvcnMgPSBvcHRpb25zLmNvdW50LFxuICAgICAgICAgIGNvbG9ycyA9IFtdO1xuXG4gICAgICBvcHRpb25zLmNvdW50ID0gbnVsbDtcblxuICAgICAgd2hpbGUgKHRvdGFsQ29sb3JzID4gY29sb3JzLmxlbmd0aCkge1xuXG4gICAgICAgIC8vIFNpbmNlIHdlJ3JlIGdlbmVyYXRpbmcgbXVsdGlwbGUgY29sb3JzLFxuICAgICAgICAvLyBpbmNyZW1lbWVudCB0aGUgc2VlZC4gT3RoZXJ3aXNlIHdlJ2QganVzdFxuICAgICAgICAvLyBnZW5lcmF0ZSB0aGUgc2FtZSBjb2xvciBlYWNoIHRpbWUuLi5cbiAgICAgICAgaWYgKHNlZWQgJiYgb3B0aW9ucy5zZWVkKSBvcHRpb25zLnNlZWQgKz0gMTtcblxuICAgICAgICBjb2xvcnMucHVzaChyYW5kb21Db2xvcihvcHRpb25zKSk7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMuY291bnQgPSB0b3RhbENvbG9ycztcblxuICAgICAgcmV0dXJuIGNvbG9ycztcbiAgICB9XG5cbiAgICAvLyBGaXJzdCB3ZSBwaWNrIGEgaHVlIChIKVxuICAgIEggPSBwaWNrSHVlKG9wdGlvbnMpO1xuXG4gICAgLy8gVGhlbiB1c2UgSCB0byBkZXRlcm1pbmUgc2F0dXJhdGlvbiAoUylcbiAgICBTID0gcGlja1NhdHVyYXRpb24oSCwgb3B0aW9ucyk7XG5cbiAgICAvLyBUaGVuIHVzZSBTIGFuZCBIIHRvIGRldGVybWluZSBicmlnaHRuZXNzIChCKS5cbiAgICBCID0gcGlja0JyaWdodG5lc3MoSCwgUywgb3B0aW9ucyk7XG5cbiAgICAvLyBUaGVuIHdlIHJldHVybiB0aGUgSFNCIGNvbG9yIGluIHRoZSBkZXNpcmVkIGZvcm1hdFxuICAgIHJldHVybiBzZXRGb3JtYXQoW0gsUyxCXSwgb3B0aW9ucyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcGlja0h1ZSAob3B0aW9ucykge1xuXG4gICAgdmFyIGh1ZVJhbmdlID0gZ2V0SHVlUmFuZ2Uob3B0aW9ucy5odWUpLFxuICAgICAgICBodWUgPSByYW5kb21XaXRoaW4oaHVlUmFuZ2UpO1xuXG4gICAgLy8gSW5zdGVhZCBvZiBzdG9yaW5nIHJlZCBhcyB0d28gc2VwZXJhdGUgcmFuZ2VzLFxuICAgIC8vIHdlIGdyb3VwIHRoZW0sIHVzaW5nIG5lZ2F0aXZlIG51bWJlcnNcbiAgICBpZiAoaHVlIDwgMCkge2h1ZSA9IDM2MCArIGh1ZTt9XG5cbiAgICByZXR1cm4gaHVlO1xuXG4gIH1cblxuICBmdW5jdGlvbiBwaWNrU2F0dXJhdGlvbiAoaHVlLCBvcHRpb25zKSB7XG5cbiAgICBpZiAob3B0aW9ucy5sdW1pbm9zaXR5ID09PSAncmFuZG9tJykge1xuICAgICAgcmV0dXJuIHJhbmRvbVdpdGhpbihbMCwxMDBdKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5odWUgPT09ICdtb25vY2hyb21lJykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgdmFyIHNhdHVyYXRpb25SYW5nZSA9IGdldFNhdHVyYXRpb25SYW5nZShodWUpO1xuXG4gICAgdmFyIHNNaW4gPSBzYXR1cmF0aW9uUmFuZ2VbMF0sXG4gICAgICAgIHNNYXggPSBzYXR1cmF0aW9uUmFuZ2VbMV07XG5cbiAgICBzd2l0Y2ggKG9wdGlvbnMubHVtaW5vc2l0eSkge1xuXG4gICAgICBjYXNlICdicmlnaHQnOlxuICAgICAgICBzTWluID0gNTU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdkYXJrJzpcbiAgICAgICAgc01pbiA9IHNNYXggLSAxMDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2xpZ2h0JzpcbiAgICAgICAgc01heCA9IDU1O1xuICAgICAgICBicmVhaztcbiAgIH1cblxuICAgIHJldHVybiByYW5kb21XaXRoaW4oW3NNaW4sIHNNYXhdKTtcblxuICB9XG5cbiAgZnVuY3Rpb24gcGlja0JyaWdodG5lc3MgKEgsIFMsIG9wdGlvbnMpIHtcblxuICAgIHZhciBiTWluID0gZ2V0TWluaW11bUJyaWdodG5lc3MoSCwgUyksXG4gICAgICAgIGJNYXggPSAxMDA7XG5cbiAgICBzd2l0Y2ggKG9wdGlvbnMubHVtaW5vc2l0eSkge1xuXG4gICAgICBjYXNlICdkYXJrJzpcbiAgICAgICAgYk1heCA9IGJNaW4gKyAyMDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2xpZ2h0JzpcbiAgICAgICAgYk1pbiA9IChiTWF4ICsgYk1pbikvMjtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3JhbmRvbSc6XG4gICAgICAgIGJNaW4gPSAwO1xuICAgICAgICBiTWF4ID0gMTAwO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZG9tV2l0aGluKFtiTWluLCBiTWF4XSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRGb3JtYXQgKGhzdiwgb3B0aW9ucykge1xuXG4gICAgc3dpdGNoIChvcHRpb25zLmZvcm1hdCkge1xuXG4gICAgICBjYXNlICdoc3ZBcnJheSc6XG4gICAgICAgIHJldHVybiBoc3Y7XG5cbiAgICAgIGNhc2UgJ2hzbEFycmF5JzpcbiAgICAgICAgcmV0dXJuIEhTVnRvSFNMKGhzdik7XG5cbiAgICAgIGNhc2UgJ2hzbCc6XG4gICAgICAgIHZhciBoc2wgPSBIU1Z0b0hTTChoc3YpO1xuICAgICAgICByZXR1cm4gJ2hzbCgnK2hzbFswXSsnLCAnK2hzbFsxXSsnJSwgJytoc2xbMl0rJyUpJztcblxuICAgICAgY2FzZSAnaHNsYSc6XG4gICAgICAgIHZhciBoc2xDb2xvciA9IEhTVnRvSFNMKGhzdik7XG4gICAgICAgIHJldHVybiAnaHNsYSgnK2hzbENvbG9yWzBdKycsICcraHNsQ29sb3JbMV0rJyUsICcraHNsQ29sb3JbMl0rJyUsICcgKyBNYXRoLnJhbmRvbSgpICsgJyknO1xuXG4gICAgICBjYXNlICdyZ2JBcnJheSc6XG4gICAgICAgIHJldHVybiBIU1Z0b1JHQihoc3YpO1xuXG4gICAgICBjYXNlICdyZ2InOlxuICAgICAgICB2YXIgcmdiID0gSFNWdG9SR0IoaHN2KTtcbiAgICAgICAgcmV0dXJuICdyZ2IoJyArIHJnYi5qb2luKCcsICcpICsgJyknO1xuXG4gICAgICBjYXNlICdyZ2JhJzpcbiAgICAgICAgdmFyIHJnYkNvbG9yID0gSFNWdG9SR0IoaHN2KTtcbiAgICAgICAgcmV0dXJuICdyZ2JhKCcgKyByZ2JDb2xvci5qb2luKCcsICcpICsgJywgJyArIE1hdGgucmFuZG9tKCkgKyAnKSc7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBIU1Z0b0hleChoc3YpO1xuICAgIH1cblxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWluaW11bUJyaWdodG5lc3MoSCwgUykge1xuXG4gICAgdmFyIGxvd2VyQm91bmRzID0gZ2V0Q29sb3JJbmZvKEgpLmxvd2VyQm91bmRzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb3dlckJvdW5kcy5sZW5ndGggLSAxOyBpKyspIHtcblxuICAgICAgdmFyIHMxID0gbG93ZXJCb3VuZHNbaV1bMF0sXG4gICAgICAgICAgdjEgPSBsb3dlckJvdW5kc1tpXVsxXTtcblxuICAgICAgdmFyIHMyID0gbG93ZXJCb3VuZHNbaSsxXVswXSxcbiAgICAgICAgICB2MiA9IGxvd2VyQm91bmRzW2krMV1bMV07XG5cbiAgICAgIGlmIChTID49IHMxICYmIFMgPD0gczIpIHtcblxuICAgICAgICAgdmFyIG0gPSAodjIgLSB2MSkvKHMyIC0gczEpLFxuICAgICAgICAgICAgIGIgPSB2MSAtIG0qczE7XG5cbiAgICAgICAgIHJldHVybiBtKlMgKyBiO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRIdWVSYW5nZSAoY29sb3JJbnB1dCkge1xuXG4gICAgaWYgKHR5cGVvZiBwYXJzZUludChjb2xvcklucHV0KSA9PT0gJ251bWJlcicpIHtcblxuICAgICAgdmFyIG51bWJlciA9IHBhcnNlSW50KGNvbG9ySW5wdXQpO1xuXG4gICAgICBpZiAobnVtYmVyIDwgMzYwICYmIG51bWJlciA+IDApIHtcbiAgICAgICAgcmV0dXJuIFtudW1iZXIsIG51bWJlcl07XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbG9ySW5wdXQgPT09ICdzdHJpbmcnKSB7XG5cbiAgICAgIGlmIChjb2xvckRpY3Rpb25hcnlbY29sb3JJbnB1dF0pIHtcbiAgICAgICAgdmFyIGNvbG9yID0gY29sb3JEaWN0aW9uYXJ5W2NvbG9ySW5wdXRdO1xuICAgICAgICBpZiAoY29sb3IuaHVlUmFuZ2UpIHtyZXR1cm4gY29sb3IuaHVlUmFuZ2U7fVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbMCwzNjBdO1xuXG4gIH1cblxuICBmdW5jdGlvbiBnZXRTYXR1cmF0aW9uUmFuZ2UgKGh1ZSkge1xuICAgIHJldHVybiBnZXRDb2xvckluZm8oaHVlKS5zYXR1cmF0aW9uUmFuZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb2xvckluZm8gKGh1ZSkge1xuXG4gICAgLy8gTWFwcyByZWQgY29sb3JzIHRvIG1ha2UgcGlja2luZyBodWUgZWFzaWVyXG4gICAgaWYgKGh1ZSA+PSAzMzQgJiYgaHVlIDw9IDM2MCkge1xuICAgICAgaHVlLT0gMzYwO1xuICAgIH1cblxuICAgIGZvciAodmFyIGNvbG9yTmFtZSBpbiBjb2xvckRpY3Rpb25hcnkpIHtcbiAgICAgICB2YXIgY29sb3IgPSBjb2xvckRpY3Rpb25hcnlbY29sb3JOYW1lXTtcbiAgICAgICBpZiAoY29sb3IuaHVlUmFuZ2UgJiZcbiAgICAgICAgICAgaHVlID49IGNvbG9yLmh1ZVJhbmdlWzBdICYmXG4gICAgICAgICAgIGh1ZSA8PSBjb2xvci5odWVSYW5nZVsxXSkge1xuICAgICAgICAgIHJldHVybiBjb2xvckRpY3Rpb25hcnlbY29sb3JOYW1lXTtcbiAgICAgICB9XG4gICAgfSByZXR1cm4gJ0NvbG9yIG5vdCBmb3VuZCc7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21XaXRoaW4gKHJhbmdlKSB7XG4gICAgaWYgKHNlZWQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHJhbmdlWzBdICsgTWF0aC5yYW5kb20oKSoocmFuZ2VbMV0gKyAxIC0gcmFuZ2VbMF0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9TZWVkZWQgcmFuZG9tIGFsZ29yaXRobSBmcm9tIGh0dHA6Ly9pbmRpZWdhbXIuY29tL2dlbmVyYXRlLXJlcGVhdGFibGUtcmFuZG9tLW51bWJlcnMtaW4tanMvXG4gICAgICB2YXIgbWF4ID0gcmFuZ2VbMV0gfHwgMTtcbiAgICAgIHZhciBtaW4gPSByYW5nZVswXSB8fCAwO1xuICAgICAgc2VlZCA9IChzZWVkICogOTMwMSArIDQ5Mjk3KSAlIDIzMzI4MDtcbiAgICAgIHZhciBybmQgPSBzZWVkIC8gMjMzMjgwLjA7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihtaW4gKyBybmQgKiAobWF4IC0gbWluKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gSFNWdG9IZXggKGhzdil7XG5cbiAgICB2YXIgcmdiID0gSFNWdG9SR0IoaHN2KTtcblxuICAgIGZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGMpIHtcbiAgICAgICAgdmFyIGhleCA9IGMudG9TdHJpbmcoMTYpO1xuICAgICAgICByZXR1cm4gaGV4Lmxlbmd0aCA9PSAxID8gJzAnICsgaGV4IDogaGV4O1xuICAgIH1cblxuICAgIHZhciBoZXggPSAnIycgKyBjb21wb25lbnRUb0hleChyZ2JbMF0pICsgY29tcG9uZW50VG9IZXgocmdiWzFdKSArIGNvbXBvbmVudFRvSGV4KHJnYlsyXSk7XG5cbiAgICByZXR1cm4gaGV4O1xuXG4gIH1cblxuICBmdW5jdGlvbiBkZWZpbmVDb2xvciAobmFtZSwgaHVlUmFuZ2UsIGxvd2VyQm91bmRzKSB7XG5cbiAgICB2YXIgc01pbiA9IGxvd2VyQm91bmRzWzBdWzBdLFxuICAgICAgICBzTWF4ID0gbG93ZXJCb3VuZHNbbG93ZXJCb3VuZHMubGVuZ3RoIC0gMV1bMF0sXG5cbiAgICAgICAgYk1pbiA9IGxvd2VyQm91bmRzW2xvd2VyQm91bmRzLmxlbmd0aCAtIDFdWzFdLFxuICAgICAgICBiTWF4ID0gbG93ZXJCb3VuZHNbMF1bMV07XG5cbiAgICBjb2xvckRpY3Rpb25hcnlbbmFtZV0gPSB7XG4gICAgICBodWVSYW5nZTogaHVlUmFuZ2UsXG4gICAgICBsb3dlckJvdW5kczogbG93ZXJCb3VuZHMsXG4gICAgICBzYXR1cmF0aW9uUmFuZ2U6IFtzTWluLCBzTWF4XSxcbiAgICAgIGJyaWdodG5lc3NSYW5nZTogW2JNaW4sIGJNYXhdXG4gICAgfTtcblxuICB9XG5cbiAgZnVuY3Rpb24gbG9hZENvbG9yQm91bmRzICgpIHtcblxuICAgIGRlZmluZUNvbG9yKFxuICAgICAgJ21vbm9jaHJvbWUnLFxuICAgICAgbnVsbCxcbiAgICAgIFtbMCwwXSxbMTAwLDBdXVxuICAgICk7XG5cbiAgICBkZWZpbmVDb2xvcihcbiAgICAgICdyZWQnLFxuICAgICAgWy0yNiwxOF0sXG4gICAgICBbWzIwLDEwMF0sWzMwLDkyXSxbNDAsODldLFs1MCw4NV0sWzYwLDc4XSxbNzAsNzBdLFs4MCw2MF0sWzkwLDU1XSxbMTAwLDUwXV1cbiAgICApO1xuXG4gICAgZGVmaW5lQ29sb3IoXG4gICAgICAnb3JhbmdlJyxcbiAgICAgIFsxOSw0Nl0sXG4gICAgICBbWzIwLDEwMF0sWzMwLDkzXSxbNDAsODhdLFs1MCw4Nl0sWzYwLDg1XSxbNzAsNzBdLFsxMDAsNzBdXVxuICAgICk7XG5cbiAgICBkZWZpbmVDb2xvcihcbiAgICAgICd5ZWxsb3cnLFxuICAgICAgWzQ3LDYyXSxcbiAgICAgIFtbMjUsMTAwXSxbNDAsOTRdLFs1MCw4OV0sWzYwLDg2XSxbNzAsODRdLFs4MCw4Ml0sWzkwLDgwXSxbMTAwLDc1XV1cbiAgICApO1xuXG4gICAgZGVmaW5lQ29sb3IoXG4gICAgICAnZ3JlZW4nLFxuICAgICAgWzYzLDE3OF0sXG4gICAgICBbWzMwLDEwMF0sWzQwLDkwXSxbNTAsODVdLFs2MCw4MV0sWzcwLDc0XSxbODAsNjRdLFs5MCw1MF0sWzEwMCw0MF1dXG4gICAgKTtcblxuICAgIGRlZmluZUNvbG9yKFxuICAgICAgJ2JsdWUnLFxuICAgICAgWzE3OSwgMjU3XSxcbiAgICAgIFtbMjAsMTAwXSxbMzAsODZdLFs0MCw4MF0sWzUwLDc0XSxbNjAsNjBdLFs3MCw1Ml0sWzgwLDQ0XSxbOTAsMzldLFsxMDAsMzVdXVxuICAgICk7XG5cbiAgICBkZWZpbmVDb2xvcihcbiAgICAgICdwdXJwbGUnLFxuICAgICAgWzI1OCwgMjgyXSxcbiAgICAgIFtbMjAsMTAwXSxbMzAsODddLFs0MCw3OV0sWzUwLDcwXSxbNjAsNjVdLFs3MCw1OV0sWzgwLDUyXSxbOTAsNDVdLFsxMDAsNDJdXVxuICAgICk7XG5cbiAgICBkZWZpbmVDb2xvcihcbiAgICAgICdwaW5rJyxcbiAgICAgIFsyODMsIDMzNF0sXG4gICAgICBbWzIwLDEwMF0sWzMwLDkwXSxbNDAsODZdLFs2MCw4NF0sWzgwLDgwXSxbOTAsNzVdLFsxMDAsNzNdXVxuICAgICk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIEhTVnRvUkdCIChoc3YpIHtcblxuICAgIC8vIHRoaXMgZG9lc24ndCB3b3JrIGZvciB0aGUgdmFsdWVzIG9mIDAgYW5kIDM2MFxuICAgIC8vIGhlcmUncyB0aGUgaGFja3kgZml4XG4gICAgdmFyIGggPSBoc3ZbMF07XG4gICAgaWYgKGggPT09IDApIHtoID0gMTt9XG4gICAgaWYgKGggPT09IDM2MCkge2ggPSAzNTk7fVxuXG4gICAgLy8gUmViYXNlIHRoZSBoLHMsdiB2YWx1ZXNcbiAgICBoID0gaC8zNjA7XG4gICAgdmFyIHMgPSBoc3ZbMV0vMTAwLFxuICAgICAgICB2ID0gaHN2WzJdLzEwMDtcblxuICAgIHZhciBoX2kgPSBNYXRoLmZsb29yKGgqNiksXG4gICAgICBmID0gaCAqIDYgLSBoX2ksXG4gICAgICBwID0gdiAqICgxIC0gcyksXG4gICAgICBxID0gdiAqICgxIC0gZipzKSxcbiAgICAgIHQgPSB2ICogKDEgLSAoMSAtIGYpKnMpLFxuICAgICAgciA9IDI1NixcbiAgICAgIGcgPSAyNTYsXG4gICAgICBiID0gMjU2O1xuXG4gICAgc3dpdGNoKGhfaSkge1xuICAgICAgY2FzZSAwOiByID0gdjsgZyA9IHQ7IGIgPSBwOyAgYnJlYWs7XG4gICAgICBjYXNlIDE6IHIgPSBxOyBnID0gdjsgYiA9IHA7ICBicmVhaztcbiAgICAgIGNhc2UgMjogciA9IHA7IGcgPSB2OyBiID0gdDsgIGJyZWFrO1xuICAgICAgY2FzZSAzOiByID0gcDsgZyA9IHE7IGIgPSB2OyAgYnJlYWs7XG4gICAgICBjYXNlIDQ6IHIgPSB0OyBnID0gcDsgYiA9IHY7ICBicmVhaztcbiAgICAgIGNhc2UgNTogciA9IHY7IGcgPSBwOyBiID0gcTsgIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBbTWF0aC5mbG9vcihyKjI1NSksIE1hdGguZmxvb3IoZyoyNTUpLCBNYXRoLmZsb29yKGIqMjU1KV07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhTVnRvSFNMIChoc3YpIHtcbiAgICB2YXIgaCA9IGhzdlswXSxcbiAgICAgIHMgPSBoc3ZbMV0vMTAwLFxuICAgICAgdiA9IGhzdlsyXS8xMDAsXG4gICAgICBrID0gKDItcykqdjtcblxuICAgIHJldHVybiBbXG4gICAgICBoLFxuICAgICAgTWF0aC5yb3VuZChzKnYgLyAoazwxID8gayA6IDItaykgKiAxMDAwMCkgLyAxMDAsXG4gICAgICBrLzIgKiAxMDBcbiAgICBdO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5nVG9JbnRlZ2VyIChzdHJpbmcpIHtcbiAgICB2YXIgdG90YWwgPSAwXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IHN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRvdGFsID49IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSBicmVhaztcbiAgICAgIHRvdGFsICs9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG4gICAgfVxuICAgIHJldHVybiB0b3RhbFxuICB9XG5cbiAgcmV0dXJuIHJhbmRvbUNvbG9yO1xufSkpO1xuIl19
