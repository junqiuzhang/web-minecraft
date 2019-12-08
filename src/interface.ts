import * as THREE from 'three';
export interface IWindow {}
export interface ICommonParam {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}