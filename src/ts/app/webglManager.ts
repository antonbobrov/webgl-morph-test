import ThreeManager from '../webgl/Manager';

const webglManager = new ThreeManager('#scene', {
    cameraSettings: {
        perspective: 800,
    },
});
export default webglManager;

webglManager.play();
