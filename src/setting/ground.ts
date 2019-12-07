import * as THREE from 'three';
import { ICommonParam } from '../interface';
function ground({
  scene,
  camera
}: ICommonParam) {
  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  mesh.position.y = - 2;
  scene.add(mesh);
  const grid = new THREE.GridHelper(2000, 2000);
  grid.position.y = -2;
  scene.add(grid);
}
export default ground;