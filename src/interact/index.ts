import * as THREE from 'three';
import mouseEnter from './mouse-enter';
import mouseMove from './mouse-move';
interface IInteract {
  scene: THREE.Scene;
  camera: THREE.Camera;
}
function interact({
  scene,
  camera
}: IInteract) {
  document.body.addEventListener('mouseenter', mouseEnter({
    scene,
    camera
  }));
  document.body.addEventListener('mousemove', mouseMove({
    scene,
    camera
  }));
}
export default interact;