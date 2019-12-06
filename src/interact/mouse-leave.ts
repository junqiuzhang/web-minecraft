import * as THREE from 'three';
interface IMouseLeave {
  scene: THREE.Scene;
  camera: THREE.Camera;
}
function mouseLeave({
  scene,
  camera
}: IMouseLeave) {
  function handleMouseLeave(this: HTMLElement, event: MouseEvent) {

  }
  return handleMouseLeave;
}
export default mouseLeave;