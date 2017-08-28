import "pixi.js";
import "es6-shim";


export class Charm implements ICharm {

    private renderer: string;
    private globalTweens: ICharm.Tween.ITween[];
    private easingFormulas: any;

    constructor(renderingEngine: any = PIXI) {

        if (renderingEngine === undefined) { throw new Error("Please assign a rendering engine in the constructor before using charm.js"); }

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
            linear(x: number): number {
                return x;
            },

            // Smoothstep
            smoothstep(x: number): number {
                return x * x * (3 - 2 * x);
            },
            smoothstepSquared(x: number): number {
                return Math.pow((x * x * (3 - 2 * x)), 2);
            },
            smoothstepCubed(x: number): number {
                return Math.pow((x * x * (3 - 2 * x)), 3);
            },

            // Acceleration
            acceleration(x: number): number {
                return x * x;
            },
            accelerationCubed(x: number): number {
                return Math.pow(x * x, 3);
            },

            // Deceleration
            deceleration(x: number): number {
                return 1 - Math.pow(1 - x, 2);
            },
            decelerationCubed(x: number): number {
                return 1 - Math.pow(1 - x, 3);
            },

            // Sine
            sine(x: number): number {
                return Math.sin(x * Math.PI / 2);
            },
            sineSquared(x: number): number {
                return Math.pow(Math.sin(x * Math.PI / 2), 2);
            },
            sineCubed(x: number): number {
                return Math.pow(Math.sin(x * Math.PI / 2), 2);
            },
            inverseSine(x: number): number {
                return 1 - Math.sin((1 - x) * Math.PI / 2);
            },
            inverseSineSquared(x: number): number {
                return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 2);
            },
            inverseSineCubed(x: number): number {
                return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 3);
            },

            // Spline
            spline(t: number, p0: number, p1: number, p2: number, p3: number): number {
                return 0.5 * (
                    (2 * p1) +
                    (-p0 + p2) * t +
                    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
                    (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t
                );
            },

            // Bezier curve
            cubicBezier(t: number, a: number, b: number, c: number, d: number): number {
                let t2: number = t * t;
                let t3: number = t2 * t;
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
    public tweenProperty(tweenProperties: ICharm.Tween.ITweenProperty): ICharm.Tween.ITween {

        tweenProperties.type = tweenProperties.type == undefined ? "smoothstep" : tweenProperties.type;
        tweenProperties.yoyo = tweenProperties.yoyo == undefined ? false : tweenProperties.yoyo;
        tweenProperties.delayBeforeRepeat = tweenProperties.delayBeforeRepeat == undefined ? 0 : tweenProperties.delayBeforeRepeat;

        // Create the tween object
        let o: ICharm.Tween.ITween = {} as ICharm.Tween.ITween;

        // If the tween is a bounce type (a spline), set the
        // start and end magnitude values
        let typeArray: string[] = tweenProperties.type.split(" ");
        if (typeArray[0] === "bounce") {
            o.startMagnitude = parseInt(typeArray[1], 10);
            o.endMagnitude = parseInt(typeArray[2], 10);
        }

        // Use `o.start` to make a new tween using the current
        // end point values
        o.start = (startValue: any, endValue: any) => {

            // Clone the start and end values so that any possible references to sprite
            // properties are converted to ordinary numbers
            o.startValue = JSON.parse(JSON.stringify(startValue));
            o.endValue = JSON.parse(JSON.stringify(endValue));
            o.playing = true;
            o.totalFrames = tweenProperties.totalFrames;
            o.frameCounter = 0;

            // Add the tween to the global `tweens` array. The `tweens` array is
            // updated on each frame
            this.globalTweens.push(o);
        };

        // Call `o.start` to start the tween
        o.start(tweenProperties.startValue, tweenProperties.endValue);

        // The `update` method will be called on each frame by the game loop.
        // This is what makes the tween move
        o.update = () => {

            let curvedTime: number;

            if (o.playing) {

                // If the elapsed frames are less than the total frames,
                // use the tweening formulas to move the sprite
                if (o.frameCounter < o.totalFrames) {

                    // Find the normalized value
                    let normalizedTime: number = o.frameCounter / o.totalFrames;

                    // Select the correct easing function from the
                    // `ease` object’s library of easing functions


                    // If it's not a spline, use one of the ordinary easing functions
                    if (typeArray[0] !== "bounce") {
                        curvedTime = this.easingFormulas[tweenProperties.type as string](normalizedTime);

                    } else {
                        // If it's a spline, use the `spline` function and apply the
                        // 2 additional `type` array values as the spline's start and
                        // end points

                        curvedTime = this.easingFormulas.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
                    }

                    // Interpolate the sprite's property based on the curve
                    (tweenProperties.displayObject as any)[tweenProperties.property] = (o.endValue * curvedTime) + (o.startValue * (1 - curvedTime));

                    o.frameCounter += 1;

                } else {
                    // When the tween has finished playing, run the end tasks

                    (tweenProperties.displayObject as any)[tweenProperties.property] = o.endValue;
                    o.end();
                }
            }
        };

        // The `end` method will be called when the tween is finished
        o.end = () => {

            // Set `playing` to `false`
            o.playing = false;

            // Call the tween's `onComplete` method, if it's been assigned
            if (o.onCompleted) { o.onCompleted(); }

            // Remove the tween from the `tweens` array
            this.globalTweens.splice(this.globalTweens.indexOf(o), 1);

            // If the tween's `yoyo` property is `true`, create a new tween
            // using the same values, but use the current tween's `startValue`
            // as the next tween's `endValue`
            if (tweenProperties.yoyo) {
                this.wait(tweenProperties.delayBeforeRepeat).then(() => {
                    o.start(o.endValue, o.startValue);
                });
            }
        };

        // Pause and play methods
        o.play = () => o.playing = true;
        o.pause = () => o.playing = false;

        // Return the tween object
        return o;
    }

    /**
     * `makeTween` is a general low-level method for making complex tweens
     * out of multiple `tweenProperty` functions. Its one argument.
     * @param tweensToAdd array containing multiple 'Charm.Tween.ITween' for 'tweenProperty' calls
     * @return Tween collection created
     */
    public makeTween(tweensToAdd: ICharm.Tween.ITweenProperty[]): ICharm.Tween.ITweenCollection {


        // Create an object to manage the tweens
        let o: ICharm.Tween.ITweenCollection = {} as ICharm.Tween.ITweenCollection;

        // Create a `tweens` array to store the new tweens
        o.tweens = [];

        // Make a new tween for each array
        tweensToAdd.forEach((tweenPropertyArguments: ICharm.Tween.ITweenProperty) => {

            // Use the tween property arguments to make a new tween
            let newTween: ICharm.Tween.ITween = this.tweenProperty(tweenPropertyArguments);

            // Push the new tween into this object's internal `tweens` array
            o.tweens.push(newTween);
        });

        // Add a counter to keep track of the
        // number of tweens that have completed their actions
        let completionCounter: number = 0;

        // Add `onComplete` methods to all tweens
        o.tweens.forEach((tween: ICharm.Tween.ITween) => {
            tween.onCompleted = () => {

                // Add 1 to the `completionCounter`
                completionCounter += 1;

                // If all tweens have finished, call the user-defined `onComplete`
                // method, if it's been assigned. Reset the `completionCounter`
                if (completionCounter === o.tweens.length) {
                    if (o.onCompleted) { o.onCompleted(); }
                    completionCounter = 0;
                }
            };
        });

        // Add pause and play methods to control all the tweens
        o.pause = () => {
            o.tweens.forEach((tween: ICharm.Tween.ITween) => {
                tween.playing = false;
            });
        };
        o.play = () => {
            o.tweens.forEach((tween: ICharm.Tween.ITween) => {
                tween.playing = true;
            });
        };

        // Return the tween object
        return o;
    }

    /* High level tween methods */

    /** SIMPLE TWEENS */

    /**
     * `fadeOut`
     * @param displayObject
     * @param frames (default 60)
     * @return
     */
    public fadeOut(displayObject: PIXI.DisplayObject, frames: number = 60): ICharm.Tween.ITween {
        return this.tweenProperty({
            displayObject: displayObject,
            endValue: 0,
            property: "alpha",
            startValue: displayObject.alpha,
            totalFrames: frames,
            type: "sine"
        });
    }

    /**
     * `fadeIn`
     * @param displayObject
     * @param frames (default 60)
     * @return
     */
    public fadeIn(displayObject: PIXI.DisplayObject, frames: number = 60): ICharm.Tween.ITween {
        return this.tweenProperty({
            displayObject: displayObject,
            endValue: 1,
            property: "alpha",
            startValue: displayObject.alpha,
            totalFrames: frames,
            type: "sine"
        });
    }

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
    public pulse(displayObject: PIXI.DisplayObject, frames: number = 60, minAlpha: number = 0): ICharm.Tween.ITween {
        return this.tweenProperty({
            displayObject: displayObject,
            endValue: minAlpha,
            property: "alpha",
            startValue: displayObject.alpha,
            totalFrames: frames,
            type: "smoothstep",
            yoyo: true
        });
    }

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
    public slide(displayObject: PIXI.DisplayObject, endX: number, endY: number, frames: number = 60, type: string = "smoothstep", yoyo: boolean = false,
        delayBeforeRepeat: number = 0): ICharm.Tween.ITweenCollection {
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
    }

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
    public breathe(displayObject: PIXI.DisplayObject, endScaleX: number = 0.8, endScaleY: number = 0.8, frames: number = 60, yoyo: boolean = true,
        delayBeforeRepeat: number = 0): ICharm.Tween.ITweenCollection {

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
    }

    /**
     *
     * @param displayObject
     * @param endScaleX (default 0.5)
     * @param endScaleY (default 0.5)
     * @param frames (default 60)
     * @return
     */
    public scale(displayObject: PIXI.DisplayObject, endScaleX: number = 0.5, endScaleY: number = 0.5, frames: number = 60): ICharm.Tween.ITweenCollection {

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
    }

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
    public strobe(displayObject: PIXI.DisplayObject, scaleFactor: number = 1.3, startMagnitude: number = 10, endMagnitude: number = 20,
        frames: number = 10, yoyo: boolean = true, delayBeforeRepeat: number = 0): ICharm.Tween.ITweenCollection {

        let bounce: string = "bounce " + startMagnitude + " " + endMagnitude;

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
    }

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
    public wobble(displayObject: PIXI.DisplayObject, scaleFactorX: number = 1.2, scaleFactorY: number = 1.2, frames: number = 10, xStartMagnitude: number = 10,
        xEndMagnitude: number = 10, yStartMagnitude: number = -10, yEndMagnitude: number = -10, friction: number = 0.98, yoyo: boolean = true,
        delayBeforeRepeat: number = 0): ICharm.Tween.ITweenCollection {

        let bounceX: string = "bounce " + xStartMagnitude + " " + xEndMagnitude;
        let bounceY: string = "bounce " + yStartMagnitude + " " + yEndMagnitude;

        // Add `scaleX` and `scaleY` properties to Pixi sprites
        this._addScaleProperties(displayObject);

        let o: ICharm.Tween.ITweenCollection = this.makeTween([

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
        o.tweens.forEach((tween: ICharm.Tween.ITween) => {
            tween.onCompleted = () => {

                // Add friction if the `endValue` is greater than 1
                if (tween.endValue > 1) {
                    tween.endValue *= friction;

                    // Set the `endValue` to 1 when the effect is finished and
                    // remove the tween from the global `tweens` array
                    if (tween.endValue <= 1) {
                        tween.endValue = 1;
                        this.removeTween(tween);
                    }
                }
            };
        });

        return o;
    }

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
    public followCurve(displayObject: PIXI.DisplayObject, pointsArray: number[][], totalFrames: number, type: string = "smoothstep",
        yoyo: boolean = false, delayBeforeRepeat: number = 0): ICharm.Tween.ITween {

        // Create the tween object
        let o: ICharm.Tween.ITween = {} as ICharm.Tween.ITween;

        // If the tween is a bounce type (a spline), set the
        // start and end magnitude values
        let typeArray: string[] = type.split(" ");
        if (typeArray[0] === "bounce") {
            o.startMagnitude = parseInt(typeArray[1], 10);
            o.endMagnitude = parseInt(typeArray[2], 10);
        }

        // Use `tween.start` to make a new tween using the current
        // end point values
        o.start = (_pointsArray: number[][]) => {
            o.playing = true;
            o.totalFrames = totalFrames;
            o.frameCounter = 0;

            // Clone the points array
            o.pointsArray = JSON.parse(JSON.stringify(_pointsArray));

            // Add the tween to the `globalTweens` array. The `globalTweens` array is
            // updated on each frame
            this.globalTweens.push(o);
        };

        // Call `tween.start` to start the first tween
        o.start(pointsArray);

        // The `update` method will be called on each frame by the game loop.
        // This is what makes the tween move
        o.update = () => {

            let normalizedTime: number, curvedTime: number, p: number[][] = o.pointsArray;

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
                        curvedTime = this.easingFormulas[type](normalizedTime);
                    } else {
                        // If it's a spline, use the `spline` function and apply the
                        // 2 additional `type` array values as the spline's start and
                        // end points

                        // curve = tweenFunction.spline(n, type[1], 0, 1, type[2]);
                        curvedTime = this.easingFormulas.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
                    }

                    // Apply the Bezier curve to the sprite's position
                    displayObject.x = this.easingFormulas.cubicBezier(curvedTime, p[0][0], p[1][0], p[2][0], p[3][0]);
                    displayObject.y = this.easingFormulas.cubicBezier(curvedTime, p[0][1], p[1][1], p[2][1], p[3][1]);

                    // Add one to the `elapsedFrames`
                    o.frameCounter += 1;
                } else {
                    // When the tween has finished playing, run the end tasks
                    // displayObject[property] = o.endValue;
                    o.end();
                }
            }
        };

        // The `end` method will be called when the tween is finished
        o.end = () => {

            // Set `playing` to `false`
            o.playing = false;

            // Call the tween's `onComplete` method, if it's been
            // assigned
            if (o.onCompleted) { o.onCompleted(); }

            // Remove the tween from the global `tweens` array
            this.globalTweens.splice(this.globalTweens.indexOf(o), 1);

            // If the tween's `yoyo` property is `true`, reverse the array and
            // use it to create a new tween
            if (yoyo) {
                this.wait(delayBeforeRepeat).then(() => {
                    o.pointsArray = o.pointsArray.reverse();
                    o.start(o.pointsArray);
                });
            }
        };

        // Pause and play methods
        o.pause = () => {
            o.playing = false;
        };
        o.play = () => {
            o.playing = true;
        };

        // Return the tween object
        return o;
    }

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
    public walkPath(displayObject: PIXI.DisplayObject, originalPathArray: number[][], totalFrames: number = 300, type: string = "smoothstep",
        loop: boolean = false, yoyo: boolean = false, delayBetweenSections: number = 0): ICharm.Tween.ITweenCollection {

        // Clone the path array so that any possible references to sprite
        // properties are converted into ordinary numbers
        let pathArray: any = JSON.parse(JSON.stringify(originalPathArray));

        // Figure out the duration, in frames, of each path section by
        // dividing the `totalFrames` by the length of the `pathArray`
        let frames: number = totalFrames / pathArray.length;

        // Set the current point to 0, which will be the first waypoint
        let currentPoint: number = 0;

        // The `makePath` function creates a single tween between two points and
        // then schedules the next path to be made after it
        let makePath: Function = (_currentPoint: number): ICharm.Tween.ITweenCollection => {

            // Use the `makeTween` function to tween the sprite's
            // x and y position
            let tweenCollection: ICharm.Tween.ITweenCollection = this.makeTween([

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
            tweenCollection.onCompleted = () => {

                // Advance to the next point
                currentPoint += 1;

                // If the sprite hasn't reached the end of the
                // path, tween the sprite to the next point
                if (currentPoint < pathArray.length - 1) {
                    this.wait(delayBetweenSections).then(() => {
                        tweenCollection = makePath(currentPoint);
                    });

                } else {
                    // If we've reached the end of the path, optionally
                    // loop and yoyo it


                    // Reverse the path if `loop` is `true`
                    if (loop) {

                        // Reverse the array if `yoyo` is `true`
                        if (yoyo) { pathArray.reverse(); }

                        // Optionally wait before restarting
                        this.wait(delayBetweenSections).then(() => {

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
        let tweenResult: ICharm.Tween.ITweenCollection = makePath(currentPoint);

        // Pass the tween back to the main program
        return tweenResult;
    }

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
    public walkCurve(displayObject: PIXI.DisplayObject, curvedWaypoints: number[][][], totalFrames: number = 300, type: string = "smoothstep",
        loop: boolean = false, yoyo: boolean = false, delayBeforeContinue: number = 0): ICharm.Tween.ITween {

        // Divide the `totalFrames` into sections for each part of the path
        let frames: number = totalFrames / curvedWaypoints.length;

        // Set the current curve to 0, which will be the first one
        let currentCurve: number = 0;

        // The `makePath` function
        let makePath: Function = (_currentCurve: number) => {

            // Use the custom `followCurve` function to make
            // a sprite follow a curve
            let tween: ICharm.Tween.ITween = this.followCurve(
                displayObject,
                curvedWaypoints[currentCurve],
                frames,
                type
            );

            // When the tween is complete, advance the `currentCurve` by one.
            // Add an optional delay between path segments, and then make the
            // next path
            tween.onCompleted = () => {
                currentCurve += 1;
                if (currentCurve < curvedWaypoints.length) {
                    this.wait(delayBeforeContinue).then(() => {
                        tween = makePath(currentCurve);
                    });

                } else {
                    // If we've reached the end of the path, optionally
                    // loop and reverse it

                    if (loop) {
                        if (yoyo) {

                            // Reverse order of the curves in the `pathArray`
                            curvedWaypoints.reverse();

                            // Reverse the order of the points in each curve
                            curvedWaypoints.forEach((curveArray: number[][]) => curveArray.reverse());
                        }

                        // After an optional delay, reset the sprite to the
                        // beginning of the path and make the next new path
                        this.wait(delayBeforeContinue).then(() => {
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
        let tweenResult: ICharm.Tween.ITween = makePath(currentCurve);

        // Pass the tween back to the main program
        return tweenResult;
    }

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
    public wait(duration: number = 0): any {
        return new Promise((resolve: any, _reject: any) => {
            setTimeout(resolve, duration);
        });
    }

    /**
     * A utility to remove tweens from globalTweens
     * @param tweenObject
     */
    public removeTween(tweenObject: ICharm.Tween.ITween | ICharm.Tween.ITweenCollection): void {

        // Remove the tween if `tweenObject` doesn't have any nested
        // tween objects
        if (!(tweenObject as any).tweens) {
            tweenObject.pause();

            // array.splice(-1,1) will always remove last elemnt of array, so this
            // extra check prevents that (Thank you, MCumic10! https:// github.com/kittykatattack/charm/issues/5)
            if (this.globalTweens.indexOf(tweenObject as ICharm.Tween.ITween) !== -1) {
                this.globalTweens.splice(this.globalTweens.indexOf(tweenObject as ICharm.Tween.ITween), 1);
            }

            // Otherwise, remove the nested tween objects
        } else {
            tweenObject.pause();
            (tweenObject as ICharm.Tween.ITweenCollection).tweens.forEach((element: ICharm.Tween.ITween) => {
                this.globalTweens.splice(this.globalTweens.indexOf(element), 1);
            });
        }
    }


    /**
     * Update all the tween objects in the `globalTweens` array
     */
    public update(): void {

        // Update all the tween objects in the `globalTweens` array
        if (this.globalTweens.length > 0) {
            for (let i: number = this.globalTweens.length - 1; i >= 0; i--) {
                let tween: ICharm.Tween.ITween = this.globalTweens[i];
                if (tween) { tween.update(); }
            }
        }
    }


    // Add `scaleX` and `scaleY` properties to Pixi sprites
    private _addScaleProperties(displayObject: PIXI.DisplayObject): void {

        if (this.renderer === "pixi") {
            if (!("scaleX" in displayObject) && ("scale" in displayObject) && ("x" in displayObject.scale)) {
                Object.defineProperty(
                    displayObject,
                    "scaleX", {
                        get(): number {
                            return displayObject.scale.x;
                        },
                        set(value: number): void {
                            displayObject.scale.x = value;
                        }
                    }
                );
            }

            if (!("scaleY" in displayObject) && ("scale" in displayObject) && ("y" in displayObject.scale)) {
                Object.defineProperty(
                    displayObject,
                    "scaleY", {
                        get(): number {
                            return displayObject.scale.y;
                        },
                        set(value: number): void {
                            displayObject.scale.y = value;
                        }
                    }
                );
            }
        }
    }
}
