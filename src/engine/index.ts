/// @ts-nocheck
import * as THREE from 'three';
import Cube from '../geometry/cube';
import { ICommonParam } from '../interface';
import { round } from '../utils';
interface IEngine extends ICommonParam { }
interface IFuncParam {
  intersect?: THREE.Intersection;
}
interface IState {
  hoverTarget: THREE.Object3D;
  hoverTargetHex: THREE.Color;
}
class engine {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private state: IState;
  private rollOverMesh: THREE.Mesh;
  constructor({
    scene,
    camera
  }: IEngine) {
    this.scene = scene;
    this.camera = camera;
    this.state = {
      hoverTarget: new THREE.Object3D(),
      hoverTargetHex: new THREE.Color()
    }
    this._mountRollOverMesh();
  }
  _mountRollOverMesh() {
    const rollOverGeo = new THREE.BoxBufferGeometry( 1, 1, 1 );
    const rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
    const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    this.rollOverMesh = rollOverMesh;
    this.scene.add( rollOverMesh );
  }
  onClick({ intersect }: IFuncParam) {
    const cube = new Cube();
    cube.position.x = round(position.x);
    cube.position.y = round(position.y);
    cube.position.z = round(position.z);
    this.scene.add(cube);
  }
  onHover({ intersect }: IFuncParam) {
    if (intersect && intersect.point && intersect.face) {
      // this.rollOverMesh.position.x = round(intersect.point.x);
      // this.rollOverMesh.position.y = round(intersect.point.y);
      // this.rollOverMesh.position.z = round(intersect.point.z);
      this.rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
      this.rollOverMesh.position.divideScalar( 1 ).floor().multiplyScalar( 1 ).addScalar( 0.5 );
    }
  }
}
export default engine;