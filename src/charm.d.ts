// Type definitions for charm.js library, Tweening for Pixi.js
// Project: https://github.com/kittykatattack/charm
// Definitions by: David González Zornoza http://www.dgzornoza.com
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 *
 */
declare interface ICharm {

	/**
	 *
	 * @param renderingEngine
	 */
    new (renderingEngine: any): ICharm;

	/**
	 * The low level `tweenProperty` function is used as the foundation
	 * for the the higher level tween methods.
	 * @param displayObject
	 * @param property String property
	 * @param startValue Tween start value
	 * @param endValue Tween end value
	 * @param totalFrames Duration in frames
	 * @param type The easing type
	 * @param yoyo
	 * @param delayBeforeRepeat Delay in frames before repeating
	 * @return Tween object
	 */
    tweenProperty(displayObject: PIXI.DisplayObject, property: string, startValue: number, endValue: number, totalFrames: number, type: string, yoyo: boolean, delayBeforeRepeat: number): ICharm.Tween.ITween;

	/**
	 * `makeTween` is a general low-level method for making complex tweens
	 * out of multiple `tweenProperty` functions. Its one argument.
	 * @param tweensToAdd array containing multiple 'Charm.Tween.ITween' for 'tweenProperty' calls
	 * @return Tween collection created
	 */
    makeTween(tweensToAdd: ICharm.Tween.ITween[]): ICharm.Tween.ITweenCollection;


    /** SIMPLE TWEENS */

	/**
	 * `fadeOut`
	 * @param displayObject
	 * @param frames (default 60)
	 * @return
	 */
    fadeOut(displayObject: PIXI.DisplayObject, frames?: number): ICharm.Tween.ITween;

	/**
	 * `fadeIn`
	 * @param displayObject
	 * @param frames (default 60)
	 * @return
	 */
    fadeIn(displayObject: PIXI.DisplayObject, frames?: number): ICharm.Tween.ITween;

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
    pulse(displayObject: PIXI.DisplayObject, frames?: number, minAlpha?: number): ICharm.Tween.ITween;



    /** COMPLEX TWEENS */

	/**
	 * Complex tweens
	 * @param displayObject
	 * @param endX
	 * @param endY
	 * @param frames (default 60)
	 * @param type (default smoothstep)
	 * @param yoyo (dafault false)
	 * @param delayBeforeRepeat (default 0)
	 * @return
	 */
    slide(displayObject: PIXI.DisplayObject, endX: number, endY: number, frames?: number, type?: string, yoyo?: boolean, delayBeforeRepeat?: number): ICharm.Tween.ITweenCollection;

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
    breathe(displayObject: PIXI.DisplayObject, endScaleX?: number, endScaleY?: number, frames?: number, yoyo?: boolean, delayBeforeRepeat?: number): ICharm.Tween.ITweenCollection;

	/**
	 *
	 * @param displayObject
	 * @param endScaleX (default 0.5)
	 * @param endScaleY (default 0.5)
	 * @param frames (default 60)
	 * @return
	 */
    scale(displayObject: PIXI.DisplayObject, endScaleX?: number, endScaleY?: number, frames?: number): ICharm.Tween.ITweenCollection;

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
    strobe(displayObject: PIXI.DisplayObject, scaleFactor?: number, startMagnitude?: number, endMagnitude?: number, frames?: number, yoyo?: boolean, delayBeforeRepeat?: number): ICharm.Tween.ITweenCollection;

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
    wobble(displayObject: PIXI.DisplayObject, scaleFactorX?: number, scaleFactorY?: number, frames?: number, xStartMagnitude?: number, xEndMagnitude?: number, yStartMagnitude?: number, yEndMagnitude?: number, friction?: number, yoyo?: boolean, delayBeforeRepeat?: number): ICharm.Tween.ITweenCollection;



    /** MOTION PATH TWEENS */

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
    followCurve(displayObject: PIXI.DisplayObject, pointsArray: number[][], totalFrames: number, type?: string, yoyo?: boolean, delayBeforeRepeat?: number): ICharm.Tween.ITween;

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
    walkPath(displayObject: PIXI.DisplayObject, originalPathArray: number[][], totalFrames?: number, type?: string, loop?: boolean, yoyo?: boolean, delayBetweenSections?: number): ICharm.Tween.ITween;

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
    walkCurve(displayObject: PIXI.DisplayObject, curvedWaypoints: number[][][], totalFrames?: number, type?: string, loop?: boolean, yoyo?: boolean, delayBeforeContinue?: number): ICharm.Tween.ITween;

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
    wait(duration: number): any;

	/**
	 * A utility to remove tweens from globalTweens
	 * @param tweenObject
	 */
    removeTween(tweenObject: ICharm.Tween.ITween | ICharm.Tween.ITweenCollection): void;

	/**
	 * Update all the tween objects in the `globalTweens` array
	 */
    update(): void;
}


declare namespace ICharm.Tween {


    interface ITween {

		/**
		 *
		 */
        startMagnitude: number;

		/**
		 *
		 */
        endMagnitude: number;

		/**
		 *
		 */
        endValue: number;

		/**
		 * Set `playing` to `false`
		 */
        playing: boolean;

		/**
		 *
		 */
        totalFrames: number;

		/**
		 *
		 */
        frameCounter: number;

		/**
		 * Use `o.start` to make a new tween using the current
		 * end point values
		 * @param startValue
		 * @param endValue
		 */
        start(startValue: number, endValue: number): void;

		/**
		 * The `update` method will be called on each frame by the game loop.
		 * This is what makes the tween move
		 */
        update: Function;

		/**
		 * The `end` method will be called when the tween is finished
		 */
        end: Function;

		/**
		 * Pause and play methods
		 * @return
		 */
        play(): boolean;

		/**
		 *
		 * @return
		 */
        pause(): boolean;

		/**
		 *
		 */
        onComplete: Function;
    }

	/**
	 * Interface to manage the tweens
	 */
    interface ITweenCollection {

		/**
		 * Create a `tweens` array to store the new tweens
		 */
        tweens: ITween[];

		/**
		 * this method will be called each time one of the tweens finishes
		 */
        completed: Function;

		/**
		 * play method to control all the tweens
		 */
        pause(): void;

		/**
		 * Play method to control all the tweens
		 */
        play(): void;
    }

}
