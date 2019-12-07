import * as THREE from 'three';
import { ICommonParam } from '../interface';
function ground({
  scene,
  camera
}: ICommonParam) {
  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  scene.add(mesh);
  var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  scene.add(grid);
}
export default ground;