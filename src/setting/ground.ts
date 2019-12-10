import * as THREE from 'three';
import { ICommonParam } from '../interface';
function ground({
  scene,
  camera,
  engine
}: ICommonParam) {
  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  engine.addMesh(mesh);
  const grid = new THREE.GridHelper(2000, 2000);
  engine.addGrid(grid);
}
export default ground;