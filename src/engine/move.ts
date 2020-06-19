import * as THREE from 'three';
import * as Constants from '../constant';
import * as Interface from '../interface';
import * as Utils from '../utils';
import CommonEngine from './common';

type Direction = 'up' | 'down' | 'left' | 'right';

class MoveEngine extends CommonEngine {
  protected overCube: THREE.Mesh;
  ground: THREE.Mesh;
  grid: THREE.GridHelper;
  constructor({
    scene,
    camera,
    renderer
  }: Interface.IEngine) {
    super({
      scene, 
      camera, 
      renderer
    });
  }
  protected isCameraCrashed(): boolean {
    const objects = Utils.filter(this.scene.children, [this.overCube, this.ground, this.grid]);
    const direction = this.camera.getWorldDirection(new THREE.Vector3());
    const crashDistance = Constants.StepLength;
    return Utils.isCrashed({
      objects,
      direction,
      crashDistance,
      position: this.camera.position,
    }) || Utils.isCrashed({
      objects,
      direction,
      crashDistance,
      position: new THREE.Vector3(this.camera.position.x, this.camera.position.y - 1, this.camera.position.z),
    })
  }
  onMove(type: Direction) {
    const isCrash = this.isCameraCrashed();
    if (isCrash) return;
    if (type === 'up') {
      this.camera.translateZ(-Constants.StepLength);
    } else if (type === 'down') {
      this.camera.translateZ(Constants.StepLength);
    } else if (type === 'left') {
      this.camera.translateX(-Constants.StepLength);
    } else if (type === 'right') {
      this.camera.translateX(Constants.StepLength);
    }
    Utils.fall({
      target: this.camera, 
      objects: this.scene.children, 
      crashDistance: 1.5
    });
  }
  onJump() {
    const target = this.camera;
    const objects = this.scene.children
    Utils.jump({
      target, 
      objects, 
      crashDistance: 0.5
    }).then(() => {
      Utils.fall({
        target: this.camera, 
        objects: this.scene.children, 
        crashDistance: 1.5
      });
    })
  }
}
export default MoveEngine;