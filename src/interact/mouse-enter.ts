import * as THREE from 'three';
interface IMouseEnter {
  scene: THREE.Scene;
  camera: THREE.Camera;
}
function mouseEnter({
  scene,
  camera
}: IMouseEnter) {
  function handleMouseEnter(this: HTMLElement, event: MouseEvent) {

  }
  return handleMouseEnter;
}
export default mouseEnter;