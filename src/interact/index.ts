import * as THREE from 'three';
import click from './click';
import mouseMove from './mouse-move';
// import mouseLeave from './mouse-leave';
import { ICommonParam } from '../interface';
export interface IInteract extends ICommonParam { }
function interact({
  scene,
  camera,
}: IInteract) {
  document.body.addEventListener('mousemove', mouseMove({
    scene,
    camera
  }));
  document.body.addEventListener('onclick', click({
    scene,
    camera
  }));
}
export default interact;