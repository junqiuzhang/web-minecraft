import { throttle } from '../utils';
import { IInteract } from './index';
import { KeyDownWaitTime } from '../constant';
interface IBindMove extends IInteract {}
function handleKeyDown({
  engine
}: IBindMove) {
  return throttle(function (this: HTMLElement, event: KeyboardEvent) {
    const { keyCode } = event;
    if (keyCode === 38 || keyCode === 87) {
      engine.onMove('up')
    } else if (keyCode === 40 || keyCode === 83) {
      engine.onMove('down')
    } else if (keyCode === 37 || keyCode === 65) {
      engine.onMove('left')
    } else if (keyCode === 39 || keyCode === 68) {
      engine.onMove('right')
    }
  }, KeyDownWaitTime)
}
function bindMove({
  scene,
  camera,
  renderer,
  engine
}: IBindMove) {
  document.body.addEventListener('keydown', handleKeyDown({
    scene,
    camera,
    renderer,
    engine
  }));
}
export default bindMove;