import * as THREE from 'three';
interface IRender {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}
function renderLoop({
  scene,
  camera,
  renderer
}: IRender) {
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();
}
export default renderLoop;