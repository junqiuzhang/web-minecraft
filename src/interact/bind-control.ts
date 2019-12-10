import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { IInteract } from './index';
function bindControl({
  camera
}: IInteract) {
  const controls = new PointerLockControls(camera, document.body);
  document.body.addEventListener('click', () => {
    controls.lock();
  })
}
export default bindControl;