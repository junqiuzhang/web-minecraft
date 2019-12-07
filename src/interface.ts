import * as THREE from 'three';
export interface IWindow { 
  initMousePosition: THREE.Vector2;
  initCameraDirection: THREE.Vector3;
}
export interface ICommonParam {
  scene: THREE.Scene;
  camera: THREE.Camera;
}