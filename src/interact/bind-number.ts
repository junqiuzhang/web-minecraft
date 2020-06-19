import { throttle } from '../utils';
import { IInteract } from './index';
import { KeyDownWaitTime } from '../constant';
interface IBindNumber extends IInteract {}
function handleKeyDown({
  engine
}: IBindNumber) {
  return throttle(function (this: HTMLElement, event: KeyboardEvent) {
    const { keyCode } = event;
    if (keyCode >= 48 && keyCode <= 57) {
      engine.onPressNumber(keyCode - 48)
    }
  }, KeyDownWaitTime)
}
function bindNumber({
  scene,
  camera,
  renderer,
  engine
}: IBindNumber) {
  document.body.addEventListener('keydown', handleKeyDown({
    scene,
    camera,
    renderer,
    engine
  }));
}
export default bindNumber;