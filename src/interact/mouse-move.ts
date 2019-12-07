import * as THREE from 'three';
import { MouseMoveWaitTime } from '../constant';
import { throttle } from '../utils';
import { IInteract } from './index';
function mouseMove({
  scene,
  camera
}: IInteract) {
  function handleMouseMove(this: HTMLElement, event: MouseEvent) {
    window.mouse.clickFlag = false;
    window.mouse.position = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1)
  }
  return throttle(handleMouseMove, MouseMoveWaitTime);
}
export default mouseMove;