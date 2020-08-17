import * as THREE from 'three';
import { ICommonParam } from '../interface';
interface IRender extends ICommonParam {}
function renderLoop({
  scene,
  camera,
  renderer
}: IRender) {
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}
export default renderLoop;