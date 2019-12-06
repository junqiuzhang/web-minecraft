import * as THREE from 'three';
class Cube extends THREE.Mesh {
  constructor(color?: THREE.Color) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: color || 0x00ff00 });
    super(geometry, material);
  }
}
export default Cube;