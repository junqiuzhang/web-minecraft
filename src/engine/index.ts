/// @ts-nocheck
import * as THREE from 'three';
import Cube from '../geometry/cube';
import { ICommonParam } from '../interface';
import { round } from '../utils';
interface IEngine extends ICommonParam { }
interface IClickParam {
  position: THREE.Vector3;
  target: THREE.Object3D;
}
interface IHoverParam {
  position: THREE.Vector3;
  target: THREE.Object3D;
}
interface IState {
  hoverTarget: THREE.Object3D;
  hoverTargetHex: THREE.Color;
}
class engine {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private state: IState;
  constructor({
    scene,
    camera
  }: IEngine) {
    this.scene = scene;
    this.camera = camera;
    this.state = {
      hoverTarget: new THREE.Object3D(),
      hoverTargetHex: new THREE.Color()
    }
  }
  onClick({ position, target }: IClickParam) {
    const cube = new Cube();
    cube.position.x = round(position.x);
    cube.position.y = round(position.y);
    cube.position.z = round(position.z);
    this.scene.add(cube);
  }
  onHover({ position, target }: IHoverParam) {
    if (target != this.state.hoverTarget) {
      if (this.state.hoverTarget instanceof THREE.Mesh) {
        this.state.hoverTarget.material.emissive.setHex(this.state.hoverTargetHex);
      }
      if (target instanceof THREE.Mesh) {
        target.material.emissive.setHex(0xff0000);
      }
      this.state.hoverTarget = target;
      this.state.hoverTargetHex = target.material.emissive.getHex();
    }
  }
  onHoverClear({ position, target }: IHoverParam) {
    if (this.state.hoverTarget instanceof THREE.Mesh) {
      this.state.hoverTarget.material.emissive.setHex(this.state.hoverTargetHex);
    }
    this.state.hoverTarget = null;
  }
}
export default engine;