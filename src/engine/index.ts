import * as THREE from 'three';
import Cube from '../geometry/cube';
import { ICommonParam } from '../interface';
import { round } from '../utils';
interface IEngine extends ICommonParam {}
interface IClickParam {
  position: THREE.Vector3;
  target: THREE.Object3D;
}
interface IHoverParam {
  position: THREE.Vector3;
  target: THREE.Mesh;
}
class engine {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  constructor({
    scene,
    camera
  }: IEngine) {
    this.scene = scene;
    this.camera = camera;
  }
  onClick({ position, target }: IClickParam) {
    const cube = new Cube();
    cube.position.x = round(position.x);
    cube.position.y = round(position.y);
    cube.position.z = round(position.z);
    this.scene.add(cube);
  }
  onHover({ position, target }: IHoverParam) {

  }
}
export default engine;