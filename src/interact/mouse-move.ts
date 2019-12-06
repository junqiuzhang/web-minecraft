import * as THREE from 'three';
import { MouseMoveWaitTime } from '../setting';
interface IMouseMove {
  scene: THREE.Scene;
  camera: THREE.Camera;
}
function mouseMove({
  scene,
  camera
}: IMouseMove) {
  let pre = Date.now();
  function handleMouseMove(this: HTMLElement, event: MouseEvent) {
    let now = Date.now();
    if (now - pre > MouseMoveWaitTime) {
      console.log(1);
      pre = now;
      return;
    }
  }
  return handleMouseMove;
}
export default mouseMove;