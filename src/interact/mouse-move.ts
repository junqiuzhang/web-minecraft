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
  }
  return throttle(handleMouseMove, MouseMoveWaitTime);
}
export default mouseMove;