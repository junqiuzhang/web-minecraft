import * as THREE from 'three';
import Cube from '../geometry/cube';
import ground from './ground';
import { ICommonParam } from '../interface';
interface IEngine extends ICommonParam {}
function engine({
  scene,
  camera
}: IEngine) {
  ground({ scene, camera });
  const cube = new Cube();
  cube.position.y = -5
  cube.position.z = -5;
  scene.add(cube);
}
export default engine;