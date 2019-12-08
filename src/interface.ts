import * as THREE from 'three';
export interface IWindow { 
  mouse: {
    position: THREE.Vector2;
  };
}
export interface ICommonParam {
  scene: THREE.Scene;
  camera: THREE.Camera;
}