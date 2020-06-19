import bindControl from './bind-control';
import bindClick from './bind-click';
import bindHover from './bind-hover';
import bindMove from './bind-move';
import bindShift from './bind-shift';
import bindJump from './bind-jump';
import bindResize from './bind-resize';
import bindNumber from './bind-number';
import { ICommonParam } from '../interface';
export interface IInteract extends ICommonParam {}
const bindEnum = {
  bindControl,
  bindClick,
  bindHover,
  bindMove,
  bindShift,
  bindJump,
  bindResize,
  bindNumber
}
function interact({
  scene,
  camera,
  renderer,
  engine
}: IInteract) {
  Object
  .values(bindEnum)
  .forEach(func => func({ scene, camera, renderer, engine }));
}
export default interact;