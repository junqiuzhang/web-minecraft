import * as THREE from 'three';
import Cube from '../geometry/cube';
import { ICommonParam } from '../interface';
interface IEngine extends ICommonParam {}
class engine {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  constructor({
    scene,
    camera
  }: IEngine) {
    this.scene = scene;
    this.camera = camera;
    const cube = new Cube();
    cube.position.y = 5
    cube.position.z = -5;
    scene.add(cube);
  }
  onClick() {

  }
}
export default engine;