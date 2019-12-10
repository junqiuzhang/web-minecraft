import { IInteract } from './index';
interface IBindShift extends IInteract {}
function handleKeyDown({
  engine
}: IBindShift) {
  return function (this: HTMLElement, event: KeyboardEvent) {
    const { keyCode } = event;
    if (keyCode === 16) {
      engine.onShiftChange(true);
    }
  }
}
function handleKeyUp({
  engine
}: IBindShift) {
  return function (this: HTMLElement, event: KeyboardEvent) {
    const { keyCode } = event;
    if (keyCode === 16) {
      engine.onShiftChange(false);
    }
  }
}
function bindShift({
  scene,
  camera,
  renderer,
  engine
}: IBindShift) {
  document.body.addEventListener('keydown', handleKeyDown({
    scene,
    camera,
    renderer,
    engine
  }));
  document.body.addEventListener('keyup', handleKeyUp({
    scene,
    camera,
    renderer,
    engine
  }));
}
export default bindShift;