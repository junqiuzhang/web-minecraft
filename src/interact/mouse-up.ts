import * as THREE from 'three';
import { IInteract } from './index';
function mouseUp({
  scene,
  camera,
  engine
}: IInteract) {
  let raycaster = new THREE.Raycaster();
  let intersects = raycaster.intersectObjects(scene.children);
  function handleMouseUp(this: HTMLElement, event: MouseEvent) {
    if (window.mouse.clickFlag) {
      const mousePosition = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
    }
  }
  return handleMouseUp;
}
export default mouseUp;