import * as THREE from 'three';
import mouseUp from './mouse-up';
import mouseMove from './mouse-move';
import mouseDown from './mouse-down';
import { ICommonParam } from '../interface';
import Engine from '../engine';
export interface IInteract extends ICommonParam {
  engine: Engine;
}
function interact({
  scene,
  camera,
  engine
}: IInteract) {
  document.body.addEventListener('mousedown', mouseDown({
    scene,
    camera,
    engine
  }));
  document.body.addEventListener('mousemove', mouseMove({
    scene,
    camera,
    engine
  }));
  document.body.addEventListener('mouseup', mouseUp({
    scene,
    camera,
    engine
  }));
}
export default interact;