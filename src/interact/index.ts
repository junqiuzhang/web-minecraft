import * as THREE from 'three';
import bindControl from './bind-control';
import bindClick from './bind-click';
import bindHover from './bind-hover';
import bindKeyDown from './bind-key-down';
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
  bindKeyDown({
    scene,
    camera,
    renderer,
    engine
  })
}
export default interact;