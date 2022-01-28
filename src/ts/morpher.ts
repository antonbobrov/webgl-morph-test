import {
    Mesh, Points, PointsMaterial, Scene,
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { utils } from 'vevet';

const objLoader = new OBJLoader();
const scale = 200;

export default class MeshMorpher {
    private _mesh?: Mesh;
    private _vertices: number[][];

    get modelQuantity () {
        return this._vertices.length;
    }

    constructor (
        private _scene: Scene,
    ) {
        this._vertices = [];
    }

    public addFiles (
        urls: string[],
    ) {
        urls.forEach((url, pos) => {
            objLoader.load(url, (obj) => {
                const mesh = obj.children[0] as Mesh;
                if (pos === 0) {
                    this._mesh = mesh;
                    const material = new PointsMaterial({ color: 0xffffff, size: 5 });
                    const points = new Points(mesh.geometry, material);
                    points.scale.set(scale, scale, scale);
                    this._scene.add(points);
                }
                // @ts-ignore
                this._vertices[pos] = [...mesh.geometry.attributes.position.array];
            });
        });
    }

    public updateGeometry (
        progress: number,
    ) {
        if (this._vertices.length === 0 || !this._mesh) {
            return;
        }

        const percent = progress - Math.floor(progress);
        const prevIndex = Math.floor(
            utils.math.wrap(0, this._vertices.length, progress) as number,
        );
        const nextIndex = Math.round(
            utils.math.wrap(0, this._vertices.length, prevIndex + 1) as number,
        );
        const prevVertices = this._vertices[prevIndex];
        const nextVertices = this._vertices[nextIndex];
        if (!prevVertices || !nextVertices) {
            return;
        }

        const geometryVertices = this._mesh.geometry.attributes.position;

        for (let i = 0; i < prevVertices.length; i += 3) {
            // @ts-ignore
            geometryVertices.array[i] = utils.math.lerp(
                prevVertices[i],
                nextVertices[i],
                percent,
            );
            // @ts-ignore
            geometryVertices.array[i + 1] = utils.math.lerp(
                prevVertices[i + 1],
                nextVertices[i + 1],
                percent,
            );
            // @ts-ignore
            geometryVertices.array[i + 2] = utils.math.lerp(
                prevVertices[i + 2],
                nextVertices[i + 2],
                percent,
            );
        }
        geometryVertices.needsUpdate = true;
        this._mesh.geometry.computeVertexNormals();
    }
}
