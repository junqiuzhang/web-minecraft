import * as THREE from 'three';
import bindClick from './bind-click';
import bindDrag from './bind-drag';
import Engine from '../engine';
import { ICommonParam } from '../interface';
export interface IInteract extends ICommonParam {}
function interact({
  scene,
  camera
}: IInteract) {
  const engine = new Engine({ scene, camera });
  bindClick({
    scene,
    camera,
    engine
  })
  bindDrag({
    scene,
    camera,
    engine
  })
}
export default interact;