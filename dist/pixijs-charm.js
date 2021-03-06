(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("pixi.js"), require("es6-shim"));
	else if(typeof define === 'function' && define.amd)
		define("pixijs-charm", ["pixi.js", "es6-shim"], factory);
	else if(typeof exports === 'object')
		exports["pixijs-charm"] = factory(require("pixi.js"), require("es6-shim"));
	else
		root["pixijs-charm"] = factory(root["pixi.js"], root["es6-shim"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(2);
__webpack_require__(3);
/* tslint:enable max-line-length */
var Charm = (function () {
    function Charm(renderingEngine) {
        if (renderingEngine === void 0) { renderingEngine = PIXI; }
        if (renderingEngine === undefined) {
            throw new Error("Please assign a rendering engine in the constructor before using charm.js");
        }
        // Find out which rendering engine is being used (the default is Pixi)
        this.renderer = "";
        // If the 'renderingEngine' is Pixi, set up Pixi object aliases
        if (renderingEngine.particles.ParticleContainer && renderingEngine.Sprite) {
            this.renderer = "pixi";
        }
        // An array to store the global tweens
        this.globalTweens = [];
        // An object that stores all the easing formulas
        this.easingFormulas = {
            // Linear
            linear: function (x) {
                return x;
            },
            // Smoothstep
            smoothstep: function (x) {
                return x * x * (3 - 2 * x);
            },
            smoothstepSquared: function (x) {
                return Math.pow((x * x * (3 - 2 * x)), 2);
            },
            smoothstepCubed: function (x) {
                return Math.pow((x * x * (3 - 2 * x)), 3);
            },
            // Acceleration
            acceleration: function (x) {
                return x * x;
            },
            accelerationCubed: function (x) {
                return Math.pow(x * x, 3);
            },
            // Deceleration
            deceleration: function (x) {
                return 1 - Math.pow(1 - x, 2);
            },
            decelerationCubed: function (x) {
                return 1 - Math.pow(1 - x, 3);
            },
            // Sine
            sine: function (x) {
                return Math.sin(x * Math.PI / 2);
            },
            sineSquared: function (x) {
                return Math.pow(Math.sin(x * Math.PI / 2), 2);
            },
            sineCubed: function (x) {
                return Math.pow(Math.sin(x * Math.PI / 2), 2);
            },
            inverseSine: function (x) {
                return 1 - Math.sin((1 - x) * Math.PI / 2);
            },
            inverseSineSquared: function (x) {
                return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 2);
            },
            inverseSineCubed: function (x) {
                return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 3);
            },
            // Spline
            spline: function (t, p0, p1, p2, p3) {
                return 0.5 * ((2 * p1) +
                    (-p0 + p2) * t +
                    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
                    (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
            },
            // Bezier curve
            cubicBezier: function (t, a, b, c, d) {
                var t2 = t * t;
                var t3 = t2 * t;
                return a + (-a * 3 + t * (3 * a - a * t)) * t + (3 * b + t * (-6 * b + b * 3 * t)) * t + (c * 3 - c * 3 * t) * t2 + d * t3;
            }
        };
    }
    /**
     * The low level `tweenProperty` function is used as the foundation
     * for the the higher level tween methods.
     * @param tweenProperties Tween properties object
     * @return Tween object
     */
    Charm.prototype.tweenProperty = function (tweenProperties) {
        var _this = this;
        tweenProperties.type = tweenProperties.type == undefined ? "smoothstep" : tweenProperties.type;
        tweenProperties.yoyo = tweenProperties.yoyo == undefined ? false : tweenProperties.yoyo;
        tweenProperties.delayBeforeRepeat = tweenProperties.delayBeforeRepeat == undefined ? 0 : tweenProperties.delayBeforeRepeat;
        // Create the tween object
        var o = {};
        // If the tween is a bounce type (a spline), set the
        // start and end magnitude values
        var typeArray = tweenProperties.type.split(" ");
        if (typeArray[0] === "bounce") {
            o.startMagnitude = parseInt(typeArray[1], 10);
            o.endMagnitude = parseInt(typeArray[2], 10);
        }
        // Use `o.start` to make a new tween using the current
        // end point values
        o.start = function (startValue, endValue) {
            // Clone the start and end values so that any possible references to sprite
            // properties are converted to ordinary numbers
            o.startValue = JSON.parse(JSON.stringify(startValue));
            o.endValue = JSON.parse(JSON.stringify(endValue));
            o.playing = true;
            o.totalFrames = tweenProperties.totalFrames;
            o.frameCounter = 0;
            // Add the tween to the global `tweens` array. The `tweens` array is
            // updated on each frame
            _this.globalTweens.push(o);
        };
        // Call `o.start` to start the tween
        o.start(tweenProperties.startValue, tweenProperties.endValue);
        // The `update` method will be called on each frame by the game loop.
        // This is what makes the tween move
        o.update = function () {
            var curvedTime;
            if (o.playing) {
                // If the elapsed frames are less than the total frames,
                // use the tweening formulas to move the sprite
                if (o.frameCounter < o.totalFrames) {
                    // Find the normalized value
                    var normalizedTime = o.frameCounter / o.totalFrames;
                    // Select the correct easing function from the
                    // `ease` object’s library of easing functions
                    // If it's not a spline, use one of the ordinary easing functions
                    if (typeArray[0] !== "bounce") {
                        curvedTime = _this.easingFormulas[tweenProperties.type](normalizedTime);
                    }
                    else {
                        // If it's a spline, use the `spline` function and apply the
                        // 2 additional `type` array values as the spline's start and
                        // end points
                        curvedTime = _this.easingFormulas.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
                    }
                    // Interpolate the sprite's property based on the curve
                    tweenProperties.displayObject[tweenProperties.property] = (o.endValue * curvedTime) + (o.startValue * (1 - curvedTime));
                    o.frameCounter += 1;
                }
                else {
                    // When the tween has finished playing, run the end tasks
                    tweenProperties.displayObject[tweenProperties.property] = o.endValue;
                    o.end();
                }
            }
        };
        // The `end` method will be called when the tween is finished
        o.end = function () {
            // Set `playing` to `false`
            o.playing = false;
            // Call the tween's `onComplete` method, if it's been assigned
            if (o.onCompleted) {
                o.onCompleted();
            }
            // Remove the tween from the `tweens` array
            _this.globalTweens.splice(_this.globalTweens.indexOf(o), 1);
            // If the tween's `yoyo` property is `true`, create a new tween
            // using the same values, but use the current tween's `startValue`
            // as the next tween's `endValue`
            if (tweenProperties.yoyo) {
                _this.wait(tweenProperties.delayBeforeRepeat).then(function () {
                    o.start(o.endValue, o.startValue);
                });
            }
        };
        // Pause and play methods
        o.play = function () { return o.playing = true; };
        o.pause = function () { return o.playing = false; };
        // Return the tween object
        return o;
    };
    /**
     * `makeTween` is a general low-level method for making complex tweens
     * out of multiple `tweenProperty` functions. Its one argument.
     * @param tweensToAdd array containing multiple 'Charm.Tween.ITween' for 'tweenProperty' calls
     * @return Tween collection created
     */
    Charm.prototype.makeTween = function (tweensToAdd) {
        var _this = this;
        // Create an object to manage the tweens
        var o = {};
        // Create a `tweens` array to store the new tweens
        o.tweens = [];
        // Make a new tween for each array
        tweensToAdd.forEach(function (tweenPropertyArguments) {
            // Use the tween property arguments to make a new tween
            var newTween = _this.tweenProperty(tweenPropertyArguments);
            // Push the new tween into this object's internal `tweens` array
            o.tweens.push(newTween);
        });
        // Add a counter to keep track of the
        // number of tweens that have completed their actions
        var completionCounter = 0;
        // Add `onComplete` methods to all tweens
        o.tweens.forEach(function (tween) {
            tween.onCompleted = function () {
                // Add 1 to the `completionCounter`
                completionCounter += 1;
                // If all tweens have finished, call the user-defined `onComplete`
                // method, if it's been assigned. Reset the `completionCounter`
                if (completionCounter === o.tweens.length) {
                    if (o.onCompleted) {
                        o.onCompleted();
                    }
                    completionCounter = 0;
                }
            };
        });
        // Add pause and play methods to control all the tweens
        o.pause = function () {
            o.tweens.forEach(function (tween) {
                tween.playing = false;
            });
        };
        o.play = function () {
            o.tweens.forEach(function (tween) {
                tween.playing = true;
            });
        };
        // Return the tween object
        return o;
    };
    /* High level tween methods */
    /** SIMPLE TWEENS */
    /**
     * `fadeOut`
     * @param displayObject
     * @param frames (default 60)
     * @return
     */
    Charm.prototype.fadeOut = function (displayObject, frames) {
        if (frames === void 0) { frames = 60; }
        return this.tweenProperty({
            displayObject: displayObject,
            endValue: 0,
            property: "alpha",
            startValue: displayObject.alpha,
            totalFrames: frames,
            type: "sine"
        });
    };
    /**
     * `fadeIn`
     * @param displayObject
     * @param frames (default 60)
     * @return
     */
    Charm.prototype.fadeIn = function (displayObject, frames) {
        if (frames === void 0) { frames = 60; }
        return this.tweenProperty({
            displayObject: displayObject,
            endValue: 1,
            property: "alpha",
            startValue: displayObject.alpha,
            totalFrames: frames,
            type: "sine"
        });
    };
    /**
     * `pulse`
     * Fades the displayObject in and out at a steady rate.
     * Set the `minAlpha` to something greater than 0 if you
     * don't want the displayObject to fade away completely
     * @param displayObject
     * @param frames (default 60)
     * @param minAlpha (default 0)
     * @return
     */
    Charm.prototype.pulse = function (displayObject, frames, minAlpha) {
        if (frames === void 0) { frames = 60; }
        if (minAlpha === void 0) { minAlpha = 0; }
        return this.tweenProperty({
            displayObject: displayObject,
            endValue: minAlpha,
            property: "alpha",
            startValue: displayObject.alpha,
            totalFrames: frames,
            type: "smoothstep",
            yoyo: true
        });
    };
    /** COMPLEX TWEENS */
    /**
     * Complex tweens
     * @param displayObject
     * @param endX
     * @param endY
     * @param frames (default 60)
     * @param type (default smoothstep)
     * @param yoyo (default false)
     * @param delayBeforeRepeat (default 0)
     * @return
     */
    Charm.prototype.slide = function (displayObject, endX, endY, frames, type, yoyo, delayBeforeRepeat) {
        if (frames === void 0) { frames = 60; }
        if (type === void 0) { type = "smoothstep"; }
        if (yoyo === void 0) { yoyo = false; }
        if (delayBeforeRepeat === void 0) { delayBeforeRepeat = 0; }
        return this.makeTween([
            // Create the x axis tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: endX,
                property: "x",
                startValue: displayObject.x,
                totalFrames: frames,
                type: type,
                yoyo: yoyo
            },
            // Create the y axis tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: endY,
                property: "y",
                startValue: displayObject.y,
                totalFrames: frames,
                type: type,
                yoyo: yoyo
            }
        ]);
    };
    /**
     *
     * @param displayObject
     * @param endScaleX (default 0.8)
     * @param endScaleY (default 0.8)
     * @param frames (default 60)
     * @param yoyo (default true)
     * @param delayBeforeRepeat (default 0)
     * @return
     */
    Charm.prototype.breathe = function (displayObject, endScaleX, endScaleY, frames, yoyo, delayBeforeRepeat) {
        if (endScaleX === void 0) { endScaleX = 0.8; }
        if (endScaleY === void 0) { endScaleY = 0.8; }
        if (frames === void 0) { frames = 60; }
        if (yoyo === void 0) { yoyo = true; }
        if (delayBeforeRepeat === void 0) { delayBeforeRepeat = 0; }
        // Add `scaleX` and `scaleY` properties to Pixi sprites
        this._addScaleProperties(displayObject);
        return this.makeTween([
            // Create the scaleX tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: endScaleX,
                property: "scaleX",
                startValue: displayObject.scale.x,
                totalFrames: frames,
                type: "smoothstepSquared",
                yoyo: yoyo
            },
            // Create the scaleY tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: endScaleY,
                property: "scaleY",
                startValue: displayObject.scale.y,
                totalFrames: frames,
                type: "smoothstepSquared",
                yoyo: yoyo
            }
        ]);
    };
    /**
     *
     * @param displayObject
     * @param endScaleX (default 0.5)
     * @param endScaleY (default 0.5)
     * @param frames (default 60)
     * @return
     */
    Charm.prototype.scale = function (displayObject, endScaleX, endScaleY, frames) {
        if (endScaleX === void 0) { endScaleX = 0.5; }
        if (endScaleY === void 0) { endScaleY = 0.5; }
        if (frames === void 0) { frames = 60; }
        // Add `scaleX` and `scaleY` properties to Pixi sprites
        this._addScaleProperties(displayObject);
        return this.makeTween([
            // Create the scaleX tween
            {
                displayObject: displayObject,
                endValue: endScaleX,
                property: "scaleX",
                startValue: displayObject.scale.x,
                totalFrames: frames,
                type: "smoothstep",
                yoyo: false
            },
            // Create the scaleY tween
            {
                displayObject: displayObject,
                endValue: endScaleY,
                property: "scaleY",
                startValue: displayObject.scale.y,
                totalFrames: frames,
                type: "smoothstep",
                yoyo: false
            }
        ]);
    };
    /**
     *
     * @param displayObject
     * @param scaleFactor (default 1.3)
     * @param startMagnitude (default 10)
     * @param endMagnitude (default 20)
     * @param frames (default 10)
     * @param yoyo (default true)
     * @param delayBeforeRepeat (default 0)
     * @return
     */
    Charm.prototype.strobe = function (displayObject, scaleFactor, startMagnitude, endMagnitude, frames, yoyo, delayBeforeRepeat) {
        if (scaleFactor === void 0) { scaleFactor = 1.3; }
        if (startMagnitude === void 0) { startMagnitude = 10; }
        if (endMagnitude === void 0) { endMagnitude = 20; }
        if (frames === void 0) { frames = 10; }
        if (yoyo === void 0) { yoyo = true; }
        if (delayBeforeRepeat === void 0) { delayBeforeRepeat = 0; }
        var bounce = "bounce " + startMagnitude + " " + endMagnitude;
        // Add `scaleX` and `scaleY` properties to Pixi sprites
        this._addScaleProperties(displayObject);
        return this.makeTween([
            // Create the scaleX tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: scaleFactor,
                property: "scaleX",
                startValue: displayObject.scale.x,
                totalFrames: frames,
                type: bounce,
                yoyo: false
            },
            // Create the scaleY tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: scaleFactor,
                property: "scaleY",
                startValue: displayObject.scale.y,
                totalFrames: frames,
                type: bounce,
                yoyo: yoyo
            }
        ]);
    };
    /**
     *
     * @param displayObject
     * @param scaleFactorX (default 1.2)
     * @param scaleFactorY (default 1.2)
     * @param frames (default 10)
     * @param xStartMagnitude (default 10)
     * @param xEndMagnitude (default 10)
     * @param yStartMagnitude (default -10)
     * @param yEndMagnitude (default -10)
     * @param friction (default 0.98)
     * @param yoyo (default true)
     * @param delayBeforeRepeat (default 0)
     * @return
     */
    Charm.prototype.wobble = function (displayObject, scaleFactorX, scaleFactorY, frames, xStartMagnitude, xEndMagnitude, yStartMagnitude, yEndMagnitude, friction, yoyo, delayBeforeRepeat) {
        var _this = this;
        if (scaleFactorX === void 0) { scaleFactorX = 1.2; }
        if (scaleFactorY === void 0) { scaleFactorY = 1.2; }
        if (frames === void 0) { frames = 10; }
        if (xStartMagnitude === void 0) { xStartMagnitude = 10; }
        if (xEndMagnitude === void 0) { xEndMagnitude = 10; }
        if (yStartMagnitude === void 0) { yStartMagnitude = -10; }
        if (yEndMagnitude === void 0) { yEndMagnitude = -10; }
        if (friction === void 0) { friction = 0.98; }
        if (yoyo === void 0) { yoyo = true; }
        if (delayBeforeRepeat === void 0) { delayBeforeRepeat = 0; }
        var bounceX = "bounce " + xStartMagnitude + " " + xEndMagnitude;
        var bounceY = "bounce " + yStartMagnitude + " " + yEndMagnitude;
        // Add `scaleX` and `scaleY` properties to Pixi sprites
        this._addScaleProperties(displayObject);
        var o = this.makeTween([
            // Create the scaleX tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: scaleFactorX,
                property: "scaleX",
                startValue: displayObject.scale.x,
                totalFrames: frames,
                type: bounceX,
                yoyo: yoyo
            },
            // Create the scaleY tween
            {
                delayBeforeRepeat: delayBeforeRepeat,
                displayObject: displayObject,
                endValue: scaleFactorY,
                property: "scaleY",
                startValue: displayObject.scale.y,
                totalFrames: frames,
                type: bounceY,
                yoyo: yoyo
            }
        ]);
        // Add some friction to the `endValue` at the end of each tween
        o.tweens.forEach(function (tween) {
            tween.onCompleted = function () {
                // Add friction if the `endValue` is greater than 1
                if (tween.endValue > 1) {
                    tween.endValue *= friction;
                    // Set the `endValue` to 1 when the effect is finished and
                    // remove the tween from the global `tweens` array
                    if (tween.endValue <= 1) {
                        tween.endValue = 1;
                        _this.removeTween(tween);
                    }
                }
            };
        });
        return o;
    };
    // 3. Motion path tweens
    /**
     *
     * @param displayObject
     * @param pointsArray Bezier curve as a 2D array of 4 x/y points
     * @param totalFrames
     * @param type (default 'smoothstep')
     * @param yoyo (default false)
     * @param delayBeforeRepeat (default 0)
     * @return
     */
    Charm.prototype.followCurve = function (displayObject, pointsArray, totalFrames, type, yoyo, delayBeforeRepeat) {
        var _this = this;
        if (type === void 0) { type = "smoothstep"; }
        if (yoyo === void 0) { yoyo = false; }
        if (delayBeforeRepeat === void 0) { delayBeforeRepeat = 0; }
        // Create the tween object
        var o = {};
        // If the tween is a bounce type (a spline), set the
        // start and end magnitude values
        var typeArray = type.split(" ");
        if (typeArray[0] === "bounce") {
            o.startMagnitude = parseInt(typeArray[1], 10);
            o.endMagnitude = parseInt(typeArray[2], 10);
        }
        // Use `tween.start` to make a new tween using the current
        // end point values
        o.start = function (_pointsArray) {
            o.playing = true;
            o.totalFrames = totalFrames;
            o.frameCounter = 0;
            // Clone the points array
            o.pointsArray = JSON.parse(JSON.stringify(_pointsArray));
            // Add the tween to the `globalTweens` array. The `globalTweens` array is
            // updated on each frame
            _this.globalTweens.push(o);
        };
        // Call `tween.start` to start the first tween
        o.start(pointsArray);
        // The `update` method will be called on each frame by the game loop.
        // This is what makes the tween move
        o.update = function () {
            var normalizedTime, curvedTime, p = o.pointsArray;
            if (o.playing) {
                // If the elapsed frames are less than the total frames,
                // use the tweening formulas to move the sprite
                if (o.frameCounter < o.totalFrames) {
                    // Find the normalized value
                    normalizedTime = o.frameCounter / o.totalFrames;
                    // Select the correct easing function
                    // If it's not a spline, use one of the ordinary tween
                    // functions
                    if (typeArray[0] !== "bounce") {
                        curvedTime = _this.easingFormulas[type](normalizedTime);
                    }
                    else {
                        // If it's a spline, use the `spline` function and apply the
                        // 2 additional `type` array values as the spline's start and
                        // end points
                        // curve = tweenFunction.spline(n, type[1], 0, 1, type[2]);
                        curvedTime = _this.easingFormulas.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
                    }
                    // Apply the Bezier curve to the sprite's position
                    displayObject.x = _this.easingFormulas.cubicBezier(curvedTime, p[0][0], p[1][0], p[2][0], p[3][0]);
                    displayObject.y = _this.easingFormulas.cubicBezier(curvedTime, p[0][1], p[1][1], p[2][1], p[3][1]);
                    // Add one to the `elapsedFrames`
                    o.frameCounter += 1;
                }
                else {
                    // When the tween has finished playing, run the end tasks
                    // displayObject[property] = o.endValue;
                    o.end();
                }
            }
        };
        // The `end` method will be called when the tween is finished
        o.end = function () {
            // Set `playing` to `false`
            o.playing = false;
            // Call the tween's `onComplete` method, if it's been
            // assigned
            if (o.onCompleted) {
                o.onCompleted();
            }
            // Remove the tween from the global `tweens` array
            _this.globalTweens.splice(_this.globalTweens.indexOf(o), 1);
            // If the tween's `yoyo` property is `true`, reverse the array and
            // use it to create a new tween
            if (yoyo) {
                _this.wait(delayBeforeRepeat).then(function () {
                    o.pointsArray = o.pointsArray.reverse();
                    o.start(o.pointsArray);
                });
            }
        };
        // Pause and play methods
        o.pause = function () {
            o.playing = false;
        };
        o.play = function () {
            o.playing = true;
        };
        // Return the tween object
        return o;
    };
    /**
     *
     * @param displayObject
     * @param originalPath Array of 2D array of x/y position waypoints that map out the path you want to follow.
     * @param totalFrames The duration, in frames (default 300)
     * @param type The easing type (default 'smoothstep')
     * @param loop Should the animation loop? (default false)
     * @param yoyo Shoud the direction reverse? (default false)
     * @param delayBetweenSections Delay, in milliseconds, between sections (default 0)
     * @return
     */
    Charm.prototype.walkPath = function (displayObject, originalPathArray, totalFrames, type, loop, yoyo, delayBetweenSections) {
        var _this = this;
        if (totalFrames === void 0) { totalFrames = 300; }
        if (type === void 0) { type = "smoothstep"; }
        if (loop === void 0) { loop = false; }
        if (yoyo === void 0) { yoyo = false; }
        if (delayBetweenSections === void 0) { delayBetweenSections = 0; }
        // Clone the path array so that any possible references to sprite
        // properties are converted into ordinary numbers
        var pathArray = JSON.parse(JSON.stringify(originalPathArray));
        // Figure out the duration, in frames, of each path section by
        // dividing the `totalFrames` by the length of the `pathArray`
        var frames = totalFrames / pathArray.length;
        // Set the current point to 0, which will be the first waypoint
        var currentPoint = 0;
        // The `makePath` function creates a single tween between two points and
        // then schedules the next path to be made after it
        var makePath = function (_currentPoint) {
            // Use the `makeTween` function to tween the sprite's
            // x and y position
            var tweenCollection = _this.makeTween([
                // Create the x axis tween between the first x value in the
                // current point and the x value in the following point
                {
                    displayObject: displayObject,
                    endValue: pathArray[currentPoint + 1][0],
                    property: "x",
                    startValue: pathArray[currentPoint][0],
                    totalFrames: frames,
                    type: type
                },
                // Create the y axis tween in the same way
                {
                    displayObject: displayObject,
                    endValue: pathArray[currentPoint + 1][1],
                    property: "y",
                    startValue: pathArray[currentPoint][1],
                    totalFrames: frames,
                    type: type
                }
            ]);
            // When the tween is complete, advance the `currentPoint` by one.
            // Add an optional delay between path segments, and then make the
            // next connecting path
            tweenCollection.onCompleted = function () {
                // Advance to the next point
                currentPoint += 1;
                // If the sprite hasn't reached the end of the
                // path, tween the sprite to the next point
                if (currentPoint < pathArray.length - 1) {
                    _this.wait(delayBetweenSections).then(function () {
                        tweenCollection = makePath(currentPoint);
                    });
                }
                else {
                    // If we've reached the end of the path, optionally
                    // loop and yoyo it
                    // Reverse the path if `loop` is `true`
                    if (loop) {
                        // Reverse the array if `yoyo` is `true`
                        if (yoyo) {
                            pathArray.reverse();
                        }
                        // Optionally wait before restarting
                        _this.wait(delayBetweenSections).then(function () {
                            // Reset the `currentPoint` to 0 so that we can
                            // restart at the first point
                            currentPoint = 0;
                            // Set the sprite to the first point
                            displayObject.x = pathArray[0][0];
                            displayObject.y = pathArray[0][1];
                            // Make the first new path
                            tweenCollection = makePath(currentPoint);
                            // ... and so it continues!
                        });
                    }
                }
            };
            // Return the path tween to the main function
            return tweenCollection;
        };
        // Make the first path using the internal `makePath` function (below)
        var tweenResult = makePath(currentPoint);
        // Pass the tween back to the main program
        return tweenResult;
    };
    /**
     *
     * @param displayObject
     * @param curvedWaypoints 2D array of Bezier curves (Bezier curves is a 2D array of 4 x/y points)
     * @param totalFrames (default 300)
     * @param type (default 'smoothstep')
     * @param loop (default false)
     * @param yoyo (default false)
     * @param delayBeforeContinue (default 0)
     * @return
     */
    Charm.prototype.walkCurve = function (displayObject, curvedWaypoints, totalFrames, type, loop, yoyo, delayBeforeContinue) {
        var _this = this;
        if (totalFrames === void 0) { totalFrames = 300; }
        if (type === void 0) { type = "smoothstep"; }
        if (loop === void 0) { loop = false; }
        if (yoyo === void 0) { yoyo = false; }
        if (delayBeforeContinue === void 0) { delayBeforeContinue = 0; }
        // Divide the `totalFrames` into sections for each part of the path
        var frames = totalFrames / curvedWaypoints.length;
        // Set the current curve to 0, which will be the first one
        var currentCurve = 0;
        // The `makePath` function
        var makePath = function (_currentCurve) {
            // Use the custom `followCurve` function to make
            // a sprite follow a curve
            var tween = _this.followCurve(displayObject, curvedWaypoints[currentCurve], frames, type);
            // When the tween is complete, advance the `currentCurve` by one.
            // Add an optional delay between path segments, and then make the
            // next path
            tween.onCompleted = function () {
                currentCurve += 1;
                if (currentCurve < curvedWaypoints.length) {
                    _this.wait(delayBeforeContinue).then(function () {
                        tween = makePath(currentCurve);
                    });
                }
                else {
                    // If we've reached the end of the path, optionally
                    // loop and reverse it
                    if (loop) {
                        if (yoyo) {
                            // Reverse order of the curves in the `pathArray`
                            curvedWaypoints.reverse();
                            // Reverse the order of the points in each curve
                            curvedWaypoints.forEach(function (curveArray) { return curveArray.reverse(); });
                        }
                        // After an optional delay, reset the sprite to the
                        // beginning of the path and make the next new path
                        _this.wait(delayBeforeContinue).then(function () {
                            currentCurve = 0;
                            displayObject.x = curvedWaypoints[0][0][0];
                            displayObject.y = curvedWaypoints[0][0][1];
                            tween = makePath(currentCurve);
                        });
                    }
                }
            };
            // Return the path tween to the main function
            return tween;
        };
        // Make the first path
        var tweenResult = makePath(currentCurve);
        // Pass the tween back to the main program
        return tweenResult;
    };
    // 4. Utilities
    /**
     * The `wait` method lets you set up a timed sequence of events
     *
     *   wait(1000)
     *     .then(() => console.log("One"))
     *     .then(() => wait(1000))
     *     .then(() => console.log("Two"))
     *     .then(() => wait(1000))
     *     .then(() => console.log("Three"))
     * @param duration
     * @return
     */
    Charm.prototype.wait = function (duration) {
        if (duration === void 0) { duration = 0; }
        return new Promise(function (resolve, _reject) {
            setTimeout(resolve, duration);
        });
    };
    /**
     * A utility to remove tweens from globalTweens
     * @param tweenObject
     */
    Charm.prototype.removeTween = function (tweenObject) {
        var _this = this;
        // Remove the tween if `tweenObject` doesn't have any nested
        // tween objects
        if (!tweenObject.tweens) {
            tweenObject.pause();
            // array.splice(-1,1) will always remove last elemnt of array, so this
            // extra check prevents that (Thank you, MCumic10! https:// github.com/kittykatattack/charm/issues/5)
            if (this.globalTweens.indexOf(tweenObject) !== -1) {
                this.globalTweens.splice(this.globalTweens.indexOf(tweenObject), 1);
            }
            // Otherwise, remove the nested tween objects
        }
        else {
            tweenObject.pause();
            tweenObject.tweens.forEach(function (element) {
                _this.globalTweens.splice(_this.globalTweens.indexOf(element), 1);
            });
        }
    };
    /**
     * Update all the tween objects in the `globalTweens` array
     */
    Charm.prototype.update = function () {
        // Update all the tween objects in the `globalTweens` array
        if (this.globalTweens.length > 0) {
            for (var i = this.globalTweens.length - 1; i >= 0; i--) {
                var tween = this.globalTweens[i];
                if (tween) {
                    tween.update();
                }
            }
        }
    };
    // Add `scaleX` and `scaleY` properties to Pixi sprites
    Charm.prototype._addScaleProperties = function (displayObject) {
        if (this.renderer === "pixi") {
            if (!("scaleX" in displayObject) && ("scale" in displayObject) && ("x" in displayObject.scale)) {
                Object.defineProperty(displayObject, "scaleX", {
                    get: function () {
                        return displayObject.scale.x;
                    },
                    set: function (value) {
                        displayObject.scale.x = value;
                    }
                });
            }
            if (!("scaleY" in displayObject) && ("scale" in displayObject) && ("y" in displayObject.scale)) {
                Object.defineProperty(displayObject, "scaleY", {
                    get: function () {
                        return displayObject.scale.y;
                    },
                    set: function (value) {
                        displayObject.scale.y = value;
                    }
                });
            }
        }
    };
    return Charm;
}());
exports.Charm = Charm;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=pixijs-charm.js.map