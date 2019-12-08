import * as THREE from 'three';
import { MouseMoveWaitTime } from '../constant';
import { throttle } from '../utils';
import { IInteract } from './index';
import Engine from '../engine';
interface IBindClick extends IInteract {
  engine: Engine;
  clickOption?: {
    flag: boolean;
  }
}
function handleMouseDown({
  scene,
  camera,
  engine,
  clickOption
}: IBindClick) {
  return function (this: HTMLElement, event: MouseEvent) {
    clickOption.flag = true;
  };
}
function handleMouseMove({
  scene,
  camera,
  engine,
  clickOption
}: IBindClick) {
  return throttle(function (this: HTMLElement, event: MouseEvent) {
    if (clickOption.flag) {
      clickOption.flag = false;
    }
  }, MouseMoveWaitTime);
}
function handleMouseUp({
  scene,
  camera,
  engine,
  clickOption
}: IBindClick) {
  let raycaster = new THREE.Raycaster();
  let intersects = raycaster.intersectObjects(scene.children);
  return function (this: HTMLElement, event: MouseEvent) {
    if (clickOption.flag) {
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
function bindHandleClick({
  scene,
  camera,
  engine
}: IBindClick) {
  let clickOption = {
    flag: false
  }
  document.body.addEventListener('mousedown', handleMouseDown({
    scene,
    camera,
    engine,
    clickOption
  }));
  document.body.addEventListener('mousemove', handleMouseMove({
    scene,
    camera,
    engine,
    clickOption
  }));
  document.body.addEventListener('mouseup', handleMouseUp({
    scene,
    camera,
    engine,
    clickOption
  }));
}
export default bindHandleClick;