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
  const cube = new Cube()
  scene.add(cube);
  camera.position.z = 5;
}
export default engine;