import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { IInteract } from './index';
function bindControl({
  camera
}: IInteract) {
  const pointerLockControls = new PointerLockControls(camera, document.body);
  document.body.addEventListener('click', () => {
    pointerLockControls.lock();
  })
}
export default bindControl;