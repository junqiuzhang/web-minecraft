import * as THREE from 'three';
import { MouseMoveWaitTime } from '../constant';
import { throttle } from '../utils';
import { IInteract } from './index';
import Engine from '../engine';
interface IBindDrag extends IInteract {
  engine: Engine;
}
function handleMouseDown({
  scene,
  camera,
  engine
}: IBindDrag) {
  return function (this: HTMLElement, event: MouseEvent) {
    
  };
}
function handleMouseMove({
  scene,
  camera,
  engine
}: IBindDrag) {
  return throttle(function (this: HTMLElement, event: MouseEvent) {

  }, MouseMoveWaitTime);
}
function handleMouseUp({
  scene,
  camera,
  engine
}: IBindDrag) {
  return function (this: HTMLElement, event: MouseEvent) {

  }
}
function bindHandleDrag({
  scene,
  camera,
  engine
}: IBindDrag) {
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