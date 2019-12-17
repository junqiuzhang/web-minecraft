import * as THREE from 'three';
class Cube extends THREE.Mesh {
  constructor(param?: THREE.MeshLambertMaterialParameters) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00, ...param });
    super(geometry, material);
    this.name = 'cube';
  }
}
export default Cube;