import * as THREE from 'three';
import { ICommonParam } from '../interface';
interface IRender extends ICommonParam {}
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