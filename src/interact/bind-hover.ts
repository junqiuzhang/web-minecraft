import * as THREE from 'three';
import { MouseMoveWaitTime } from '../constant';
import { throttle } from '../utils';
import { IInteract } from './index';
import Engine from '../engine';
interface IBindClick extends IInteract {
  engine: Engine;
}
interface IHandleClick extends IBindClick {}
function handleMouseMove({
  scene,
  camera,
  engine
}: IHandleClick) {
  let raycaster = new THREE.Raycaster();
  let intersects = raycaster.intersectObjects(scene.children);
  return throttle(function (this: HTMLElement, event: MouseEvent) {
    const mousePosition = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
      engine.onHover({
        position: intersects[0].point,
        target: intersects[0].object
      });
    }
  }, MouseMoveWaitTime)
}
function bindHandleHover({
  scene,
  camera,
  renderer,
  engine
}: IBindClick) {
  document.body.addEventListener('mousemove', handleMouseMove({
    scene,
    camera,
    renderer,
    engine
  }));
}
export default bindHandleHover;