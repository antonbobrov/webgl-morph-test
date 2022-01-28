import { Scene, Vector2 } from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { DeepRequired } from 'ts-essentials';
import { AnimationFrame, Module, NModule } from 'vevet';
import { createElement, selectOne } from 'vevet-dom';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import ThreeCamera from './Camera';
import ThreeRenderer from './Renderer';

interface StaticProp extends NModule.StaticProp {
    fps?: number;
    cameraSettings?: {
        perspective?: number;
        near?: number;
        far?: number;
    }
}

export interface CallbacksTypes extends NModule.CallbacksTypes {
    'resize': false;
    'frame': false;
    'afterrender': false;
}

interface ChangeableProp extends NModule.ChangeableProp {}



export default class ThreeManager extends Module <StaticProp, ChangeableProp, CallbacksTypes> {
    protected _parent!: Element;
    get parent () {
        return this._parent;
    }

    protected _canvas: HTMLCanvasElement;
    get canvas () {
        return this._canvas;
    }

    protected _getDefaultProp <
        T extends DeepRequired<StaticProp & NModule.ChangeableProp>
    > (): T {
        return {
            ...super._getDefaultProp(),
            fps: 240,
            cameraSettings: {
                perspective: 800,
                near: 1,
                far: 10000,
            },
        };
    }

    protected _animationFrame: AnimationFrame;
    get animationFrame () {
        return this._animationFrame;
    }



    protected _cameraInstance: ThreeCamera;
    get camera () {
        return this._cameraInstance.camera;
    }

    protected _rendererInstance: ThreeRenderer;
    get renderer () {
        return this._rendererInstance.renderer;
    }

    protected _scene: Scene;
    get scene () {
        return this._scene;
    }


    protected _renderScene: RenderPass;
    protected _composer: EffectComposer;


    constructor (
        parentSelector: Element | string,
        initialProp?: (StaticProp & ChangeableProp),
    ) {
        super(initialProp, false);

        // get the parent element
        const parent = selectOne(parentSelector);
        if (parent) {
            this._parent = parent;
        } else {
            throw new Error('No Parent Element');
        }

        // create canvas
        const existingCanvas = selectOne('canvas', parent);
        if (existingCanvas) {
            this._canvas = existingCanvas;
        } else {
            this._canvas = createElement('canvas', {
                parent,
            });
        }

        // get current props
        const { prop } = this;
        const { fps, cameraSettings } = prop;

        // create base elements
        this._rendererInstance = new ThreeRenderer(parent, this.canvas);
        this._cameraInstance = new ThreeCamera(
            parent,
            cameraSettings.perspective,
            cameraSettings.near,
            cameraSettings.far,
        );
        this._scene = new Scene();


        this._renderScene = new RenderPass(this.scene, this.camera);

        const bloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85,
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 2.5;
        bloomPass.radius = 0;

        const composer = new EffectComposer(this.renderer);
        this._composer = composer;
        composer.addPass(this._renderScene);
        composer.addPass(bloomPass);



        // create an animation frame
        this._animationFrame = new AnimationFrame({
            fps,
        });
        this._animationFrame.addCallback('frame', () => {
            this.render();
        });

        // initalize the module
        this.init();
    }

    // Set scene events
    protected _setEvents () {
        super._setEvents();

        // set resize events
        this.addViewportCallback('', () => {
            this.resize();
        }, {
            name: this.name,
        });
        // resize for the first time
        this.resize();
    }

    /**
     * Resize the scnee
     */
    public resize () {
        this._rendererInstance.resize();
        this._cameraInstance.resize();
        this._composer.setSize(this.width, this.height);

        // launch resize events
        this.callbacks.tbt('resize', false);
    }



    /**
     * Play animation
     */
    public play () {
        this.animationFrame.play();
    }

    /**
     * Pause animation
     */
    public pause () {
        this.animationFrame.pause();
    }

    get width () {
        return this._rendererInstance.width;
    }
    get height () {
        return this._rendererInstance.height;
    }



    /**
     * Render the scene
     */
    public render () {
        // launch callbacks
        this.callbacks.tbt('frame', false);

        // clear
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.clearDepth();

        // render
        // this.renderer.render(this.scene, this.camera);
        this._composer.render();

        // launch callbacks
        this.callbacks.tbt('afterrender', false);
    }



    /**
     * Destroy the scene
     */
    protected _destroy () {
        super._destroy();
        this._rendererInstance.destroy();
        this._animationFrame.destroy();
    }
}
