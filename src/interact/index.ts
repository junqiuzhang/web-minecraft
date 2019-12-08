import * as THREE from 'three';
import mouseUp from './mouse-up';
import mouseMove from './mouse-move';
import mouseDown from './mouse-down';
import Engine from '../engine';
import { ICommonParam } from '../interface';
export interface IInteract extends ICommonParam {}
function interact({
  scene,
  camera
}: IInteract) {
  const engine = new Engine({ scene, camera });
  document.body.addEventListener('mousedown', mouseDown({
    scene,
    camera
  }));
  document.body.addEventListener('mousemove', mouseMove({
    scene,
    camera
  }));
  document.body.addEventListener('mouseup', mouseUp({
    scene,
    camera
  }));
}
export default interact;