import * as THREE from 'three';
import { ICommonParam } from '../interface';
function light({
  scene,
  camera
}: ICommonParam) {
  const pointLight = new THREE.PointLight(0xffffff, 1, 1000, 0.1);
  pointLight.position.set(100, 100, 0);
  scene.add(pointLight);
  const hemiLight = new THREE.HemisphereLight(0xcce0ff, 0x000000, 0.1);
  scene.add(hemiLight);
  const ambiLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambiLight);
}
export default light;