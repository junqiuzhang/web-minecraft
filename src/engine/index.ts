import * as THREE from 'three';
import Cube from '../geometry/cube';
interface IEngine {
  scene: THREE.Scene;
  camera: THREE.Camera;
}
function engine({
  scene,
  camera
}: IEngine) {
  const cube = new Cube();
  cube.position.z = -5;
  scene.add(cube);
}
export default engine;