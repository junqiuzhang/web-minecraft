import * as THREE from 'three';
interface IMouseMove {
  scene: THREE.Scene;
  camera: THREE.Camera;
}
function mouseMove({
  scene,
  camera
}: IMouseMove) {
  function handleMouseMove(this: HTMLElement, event: MouseEvent) {

  }
  return handleMouseMove;
}
export default mouseMove;