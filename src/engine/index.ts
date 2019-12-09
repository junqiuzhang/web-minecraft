import * as THREE from 'three';
import Cube from '../geometry/cube';
import { ICommonParam } from '../interface';
import { round } from '../utils';
interface IEngine {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}
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
  private renderer: THREE.Renderer;
  private state: IState;
  private rollOverMesh: THREE.Mesh;
  constructor({
    scene,
    camera,
    renderer
  }: IEngine) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
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
    const { point } = intersect;
    const cube = new Cube();
    cube.position.x = round(point.x);
    cube.position.y = round(point.y);
    cube.position.z = round(point.z);
    this.scene.add(cube);
  }
  onHover({ intersect }: IFuncParam) {
    const { point } = intersect;
    this.rollOverMesh.position.x = round(point.x);
    this.rollOverMesh.position.y = round(point.y);
    this.rollOverMesh.position.z = round(point.z);
  }
}
export default engine;