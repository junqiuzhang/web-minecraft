import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { IInteract } from './index';
function bindControl({
  scene,
  camera,
  renderer
}: IInteract) {
  const controls = new PointerLockControls(camera, document.body);
  document.body.addEventListener('click', () => {
    controls.lock();
  })
}
export default bindControl;