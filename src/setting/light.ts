import * as THREE from 'three';
import { ICommonParam } from '../interface';
function ground({
  scene,
  camera
}: ICommonParam) {
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 20, 10);
  scene.add(directionalLight);
}
export default ground;