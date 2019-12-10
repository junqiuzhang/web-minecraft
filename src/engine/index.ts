import * as THREE from 'three';
import Cube from '../geometry/cube';
import { round } from '../utils';
type Direction = 'up' | 'down' | 'left' | 'right';
interface IEngine {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}
interface IState {
  hoverTarget: THREE.Object3D;
  hoverTargetHex: THREE.Color;
}
interface IClickParam {
  intersects?: THREE.Intersection[];
}
interface IHoverParam {
  intersects?: THREE.Intersection[];
}
interface IKeyDownParam {
  type: Direction;
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
  _getRealIntersect(intersects: THREE.Intersection[]) {
    return intersects.filter(intersect => intersect.object !== this.rollOverMesh)[0];
  }
  onClick({ intersects }: IClickParam) {
    const { point } = this._getRealIntersect(intersects);
    const cube = new Cube();
    cube.position.x = round(point.x);
    cube.position.y = round(point.y);
    cube.position.z = round(point.z);
    this.scene.add(cube);
  }
  onHover({ intersects }: IHoverParam) {
    const { point } = this._getRealIntersect(intersects);
    this.rollOverMesh.position.x = round(point.x);
    this.rollOverMesh.position.y = round(point.y);
    this.rollOverMesh.position.z = round(point.z);
  }
  onKeyDown({ type }: IKeyDownParam) {

    if (type === 'up') {
      this.camera.translateY(1);
    } else if (type === 'down') {
      // this.camera.position.addScalar(0.1);
    } else if (type === 'left') {
      // this.camera.position.addScalar(0.1);
    } else if (type === 'right') {
      // this.camera.position.addScalar(0.1);
    }
  }
}
export default engine;