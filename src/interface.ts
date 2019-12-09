import * as THREE from 'three';
import Engine from './engine';
export interface IWindow {}
export interface ICommonParam {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  engine: Engine;
}