import { PerspectiveCamera } from 'three';

export default class ThreeCamera {
    protected _camera: PerspectiveCamera;
    get camera () {
        return this._camera;
    }

    get parent () {
        return this._parent;
    }
    get perspective () {
        return this._perspective;
    }
    get near () {
        return this._near;
    }
    get far () {
        return this._far;
    }

    constructor (
        protected _parent: Element,
        protected _perspective: number,
        protected _near: number,
        protected _far: number,
    ) {
        this._camera = new PerspectiveCamera(
            this.fov,
            this.aspectRatio,
            this.near,
            this.far,
        );
        this._camera.position.set(0, 0, this.perspective);
    }

    get aspectRatio () {
        return this.width / this.height;
    }

    get width () {
        return this._parent.clientWidth;
    }
    get height () {
        return this._parent.clientHeight;
    }

    get fov () {
        return 180 * (
            (2 * Math.atan(this.height / 2 / this.perspective)) / Math.PI
        );
    }

    public resize () {
        const { camera } = this;
        camera.fov = this.fov;
        camera.aspect = this.aspectRatio;
        camera.updateProjectionMatrix();
    }
}
