import * as THREE from 'three';
import { IInteract } from './index';
function mouseDown({
  scene,
  camera
}: IInteract) {
  function handleMouseDown(this: HTMLElement, event: MouseEvent) {
    window.mouse.clickFlag = true;
  }
  return handleMouseDown;
}
export default mouseDown;