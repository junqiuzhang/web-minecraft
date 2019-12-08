import * as THREE from 'three';
import bindControl from './bind-control';
import bindClick from './bind-click';
import bindHover from './bind-hover';
import Engine from '../engine';
import { ICommonParam } from '../interface';
export interface IInteract extends ICommonParam {}
function interact({
  scene,
  camera,
  renderer
}: IInteract) {
  const engine = new Engine({ scene, camera, renderer });
  bindControl({
    scene,
    camera,
    renderer
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
}
export default interact;