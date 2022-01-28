import '../styles/index.scss';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Timeline } from 'vevet';
import { AmbientLight, PointLight } from 'three';
import webglManager from './app/webglManager';
import MeshMorpher from './morpher';

// set controls
const controls = new OrbitControls(
    webglManager.camera,
    document.querySelector('.scene') as HTMLElement,
);
// @ts-ignore
window.controls = controls;

const ambientLight = new AmbientLight(0xffffff, 0.5);
webglManager.scene.add(ambientLight);

const pointLight1 = new PointLight(0xffffff, 0.5);
pointLight1.position.set(300, 0, 500);
webglManager.scene.add(pointLight1);

const pointLight2 = new PointLight(0xffffff, 0.5);
pointLight2.position.set(-300, 0, 500);
webglManager.scene.add(pointLight2);



let morpher: MeshMorpher;

window.onload = () => {
    morpher = new MeshMorpher(webglManager.scene);
    morpher.addFiles(
        [
            'meshes/globe.obj',
            'meshes/plane.obj',
            'meshes/spanner.obj',
            'meshes/arrow.obj',
        ],
    );
};



let index = 0;
let timeline: Timeline | undefined;
document.querySelector('#button-next')?.addEventListener('click', () => {
    if (timeline) {
        timeline.destroy();
    }
    timeline = new Timeline({
        duration: 2000,
    });
    timeline.addCallback('progress', (data) => {
        morpher.updateGeometry(index + data.easing);
        if (data.progress === 1) {
            index += 1;
        }
    });
    timeline.play();
});
