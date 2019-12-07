import * as THREE from 'three';
import { IInteract } from './index';
function mouseUp({
  scene,
  camera
}: IInteract) {
  let raycaster = new THREE.Raycaster();
  let intersects = raycaster.intersectObjects(scene.children);
  function handleMouseUp(this: HTMLElement, event: MouseEvent) {
    if (window.mouse.clickFlag) {
      raycaster.setFromCamera(window.mouse.position, camera);
      intersects = raycaster.intersectObjects(scene.children);
      console.log(1);
      console.log(intersects);
    }
  }
  return handleMouseUp;
}
export default mouseUp;