import * as THREE from 'three';
import { MouseMoveWaitTime } from '../constant';
import { throttle } from '../utils';
import { IInteract } from './index';
interface IBindClick extends IInteract {}
interface IHandleClick extends IBindClick {
  clickOption: {
    flag: boolean;
  }
}
function handleMouseDown({
  clickOption
}: IHandleClick) {
  return function (this: HTMLElement, event: MouseEvent) {
    clickOption.flag = true;
  };
}
function handleMouseMove({
  clickOption
}: IHandleClick) {
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
}: IHandleClick) {
  let raycaster = new THREE.Raycaster();
  let intersects = raycaster.intersectObjects(scene.children);
  return function (this: HTMLElement, event: MouseEvent) {
    if (clickOption.flag) {
      const mousePosition = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(mousePosition, camera);
      intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        engine.onClick({
          intersects: intersects
        });
      }
    }
  }
}
function bindHandleClick({
  scene,
  camera,
  renderer,
  engine
}: IBindClick) {
  let clickOption = {
    flag: false
  }
  document.body.addEventListener('mousedown', handleMouseDown({
    scene,
    camera,
    renderer,
    engine,
    clickOption
  }));
  document.body.addEventListener('mousemove', handleMouseMove({
    scene,
    camera,
    renderer,
    engine,
    clickOption
  }));
  document.body.addEventListener('mouseup', handleMouseUp({
    scene,
    camera,
    renderer,
    engine,
    clickOption
  }));
}
export default bindHandleClick;