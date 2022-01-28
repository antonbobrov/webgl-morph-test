import { WebGLRenderer } from 'three';
import app from '../app/app';

export default class ThreeRenderer {
    get parent () {
        return this._parent;
    }
    get canvas () {
        return this._canvas;
    }

    protected _renderer: WebGLRenderer;
    get renderer () {
        return this._renderer;
    }

    constructor (
        protected _parent: Element,
        protected _canvas: HTMLCanvasElement,
    ) {
        this._width = 1;
        this._height = 1;
        this._updateSizes();

        this._renderer = new WebGLRenderer({
            canvas: this._canvas,
            alpha: true,
        });
        this._renderer.setPixelRatio(app.viewport.dpr);
        this._renderer.setSize(this.width, this.height);
    }

    protected _width: number;
    get width () {
        return this._width;
    }
    protected _height: number;
    get height () {
        return this._height;
    }

    protected _updateSizes () {
        this._width = this._parent.clientWidth;
        this._height = this._parent.clientHeight;
    }

    public resize () {
        this._updateSizes();
        // update canvas sizes
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        // update renderer sizes
        this.renderer.setSize(this.width, this.height);
    }

    public destroy () {
        this.renderer.dispose();
    }
}
