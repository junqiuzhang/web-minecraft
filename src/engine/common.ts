import * as THREE from 'three';
import * as Interface from '../interface';

class CommonEngine {
  protected scene: THREE.Scene;
  protected camera: Interface.ICamera;
  protected renderer: THREE.Renderer;
  protected state: Interface.IState;
  constructor({
    scene,
    camera,
    renderer
  }: Interface.IEngine) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.state = {}
  }
  setState(state: Object) {
    this.state = {
      ...this.state,
      ...state
    }
  }
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
export default CommonEngine;