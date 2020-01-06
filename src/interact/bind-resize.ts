import { IInteract } from './index';
interface IBindResize extends IInteract {}
function handleResize({
  engine
}: IBindResize) {
  return function (event: Event) {
    engine.onWindowResize();
  }
}
function bindResize({
  scene,
  camera,
  renderer,
  engine
}: IBindResize) {
  window.addEventListener('resize', handleResize({
    scene,
    camera,
    renderer,
    engine
  }));
}
export default bindResize;