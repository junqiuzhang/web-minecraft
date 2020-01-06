import bindControl from './bind-control';
import bindClick from './bind-click';
import bindHover from './bind-hover';
import bindMove from './bind-move';
import bindShift from './bind-shift';
import bindJump from './bind-jump';
import bindResize from './bind-resize';
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
  bindClick({
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
  bindShift({
    scene,
    camera,
    renderer,
    engine
  })
  bindJump({
    scene,
    camera,
    renderer,
    engine
  })
  bindResize({
    scene,
    camera,
    renderer,
    engine
  })
}
export default interact;