import * as THREE from 'three';
import { MouseMoveWaitTime } from '../setting';
import { throttle } from '../utils';
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
  function handleMouseMove(this: HTMLElement, event: MouseEvent) {
    calcMouseMove(event);
  }
  return throttle(handleMouseMove, MouseMoveWaitTime);
}
export default mouseMove;