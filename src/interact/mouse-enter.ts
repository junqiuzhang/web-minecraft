import * as THREE from 'three';
import { IInteract } from './index';
function mouseEnter({
  scene,
  camera
}: IInteract) {
  function handleMouseEnter(this: HTMLElement, event: MouseEvent) {
    const { clientX, clientY } = event;
    window.initMousePosition = new THREE.Vector2(clientX, clientY);
  }
  return handleMouseEnter;
}
export default mouseEnter;