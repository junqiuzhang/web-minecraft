import * as THREE from 'three';
export interface IWindow { 
  mousePosition: THREE.Vector2;
}
export interface ICommonParam {
  scene: THREE.Scene;
  camera: THREE.Camera;
}