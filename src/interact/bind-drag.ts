import * as THREE from 'three';
import { MouseMoveWaitTime } from '../constant';
import { throttle } from '../utils';
import { IInteract } from './index';
import Engine from '../engine';
interface IBind extends IInteract {
  engine: Engine;
}
function handleMouseDown({
  scene,
  camera,
  engine
}: IBind) {
  return function (this: HTMLElement, event: MouseEvent) {
    window.mouse.clickFlag = true;
  };
}
function handleMouseMove({
  scene,
  camera,
  engine
}: IBind) {
  return throttle(function (this: HTMLElement, event: MouseEvent) {
    window.mouse.clickFlag = false;
  }, MouseMoveWaitTime);
}
function handleMouseUp({
  scene,
  camera,
  engine
}: IBind) {
  let raycaster = new THREE.Raycaster();
  let intersects = raycaster.intersectObjects(scene.children);
  return function (this: HTMLElement, event: MouseEvent) {
    if (window.mouse.clickFlag) {
      const mousePosition = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        console.log(intersects[0].point);
        engine.onClick({
          position: intersects[0].point,
          target: intersects[0].object
        });
      }
    }
  }
}
function bindHandleDrag({
  scene,
  camera,
  engine
}: IBind) {
  document.body.addEventListener('mousedown', handleMouseDown({
    scene,
    camera,
    engine
  }));
  document.body.addEventListener('mousemove', handleMouseMove({
    scene,
    camera,
    engine
  }));
  document.body.addEventListener('mouseup', handleMouseUp({
    scene,
    camera,
    engine
  }));
}
export default bindHandleDrag;