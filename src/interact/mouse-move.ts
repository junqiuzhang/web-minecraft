import * as THREE from 'three';
import { MouseMoveWaitTime } from '../setting';
interface IMouseMove {
  scene: THREE.Scene;
  camera: THREE.Camera;
}
function calcMouseMove(event: MouseEvent): { moveX: number, moveY: number } {
  const { initX, initY } = window.initMousePosition;
  const { clientX, clientY } = event;
  return {
    moveX: clientX - initX,
    moveY: clientY - initY
  }
}
function mouseMove({
  scene,
  camera
}: IMouseMove) {
  let pre = Date.now();
  function handleMouseMove(this: HTMLElement, event: MouseEvent) {
    let now = Date.now();
    if (now - pre > MouseMoveWaitTime) {
      const res = calcMouseMove(event);

      pre = now;
      return;
    }
  }
  return handleMouseMove;
}
export default mouseMove;