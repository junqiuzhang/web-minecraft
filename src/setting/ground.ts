import * as THREE from 'three';
import { ICommonParam } from '../interface';
function ground({
  scene,
  camera,
  engine
}: ICommonParam) {
  const ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false }));
  ground.rotation.x = - Math.PI / 2;
  ground.name = 'ground';
  engine.ground = ground;
  engine.add(ground);
  const grid = new THREE.GridHelper(2000, 2000);
  grid.name = 'grid';
  engine.grid = grid;
  engine.add(grid);
}
export default ground;