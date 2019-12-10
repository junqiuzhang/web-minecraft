import bindControl from './bind-control';
import bindCreateCube from './bind-create-cube';
import bindHover from './bind-hover';
import bindMove from './bind-move';
import { ICommonParam } from '../interface';
export interface IInteract extends ICommonParam {}
function interact({
  scene,
  camera,
  renderer,
  engine
}: IInteract) {
  bindControl({
    scene,
    camera,
    renderer,
    engine
  })
  bindCreateCube({
    scene,
    camera,
    renderer,
    engine
  })
  bindHover({
    scene,
    camera,
    renderer,
    engine
  })
  bindMove({
    scene,
    camera,
    renderer,
    engine
  })
}
export default interact;