import * as THREE from 'three';
import { throttle } from '../utils';
import { IInteract } from './index';
import { KeyDownWaitTime } from '../constant';
import Engine from '../engine';
interface IBindClick extends IInteract {
  engine: Engine;
}
interface IHandleClick extends IBindClick {}
function handleKeyDown({
  scene,
  camera,
  engine
}: IHandleClick) {
  return throttle(function (this: HTMLElement, event: KeyboardEvent) {
    const { keyCode } = event;
    if (keyCode === 38 || keyCode === 87) {
      engine.onKeyDown({
        type: 'up'
      })
    } else if (keyCode === 40 || keyCode === 83) {
      engine.onKeyDown({
        type: 'down'
      })
    } else if (keyCode === 37 || keyCode === 65) {
      engine.onKeyDown({
        type: 'left'
      })
    } else if (keyCode === 39 || keyCode === 68) {
      engine.onKeyDown({
        type: 'down'
      })
    }
  }, KeyDownWaitTime)
}
function bindHandleKeyDown({
  scene,
  camera,
  renderer,
  engine
}: IBindClick) {
  document.body.addEventListener('keydown', handleKeyDown({
    scene,
    camera,
    renderer,
    engine
  }));
}
export default bindHandleKeyDown;