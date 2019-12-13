import { IInteract } from './index';
interface IBindJump extends IInteract {}
function handleKeyUp({
  engine
}: IBindJump) {
  return function (this: HTMLElement, event: KeyboardEvent) {
    const { keyCode } = event;
    if (keyCode === 32) {
      engine.onJump();
    }
  }
}
function bindJump({
  scene,
  camera,
  renderer,
  engine
}: IBindJump) {
  document.body.addEventListener('keyup', handleKeyUp({
    scene,
    camera,
    renderer,
    engine
  }));
}
export default bindJump;