import * as THREE from 'three';
import bindClick from './bind-click';
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
}
export default interact;