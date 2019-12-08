import * as THREE from 'three';
import { ICommonParam } from '../interface';
function light({
  scene,
  camera
}: ICommonParam) {
  const pointLight = new THREE.PointLight(0xffffff, 1000, 1000, 0.1);
  pointLight.position.set(0, 100, 0);
  const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x999999, 0.1);
  scene.add(hemiLight);
  const ambiLight = new THREE.AmbientLight(0x404040);
  scene.add(ambiLight);
}
export default light;