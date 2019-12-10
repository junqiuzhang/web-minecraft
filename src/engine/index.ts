import * as THREE from 'three';
import Cube from '../geometry/cube';
import { round } from '../utils';
import { StepLength } from '../constant';
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
    const rollOverGeo = new THREE.BoxBufferGeometry(1, 1, 1);
    const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    this.rollOverMesh = rollOverMesh;
    this.scene.add(rollOverMesh);
  }
  _getRealIntersect(intersects: THREE.Intersection[]) {
    return intersects.filter(intersect => intersect.object !== this.rollOverMesh)[0];
  }
  onClick({ intersects }: IClickParam) {
    const { point, face } = this._getRealIntersect(intersects);
    const cube = new Cube();
    if (face instanceof THREE.Face3) {
      cube.position.copy(point).add(face.normal.divideScalar(2));
      cube.position.floor().addScalar(0.5);
    } else {
      cube.position.copy(point.floor().addScalar(0.5));
    }
    this.scene.add(cube);
  }
  onHover({ intersects }: IHoverParam) {
    const { point, face } = this._getRealIntersect(intersects);
    if (face instanceof THREE.Face3) {
      this.rollOverMesh.position.copy(point).add(face.normal.divideScalar(2));
      this.rollOverMesh.position.floor().addScalar(0.5);
    } else {
      this.rollOverMesh.position.copy(point.floor().addScalar(0.5));
    }
  }
  onKeyDown({ type }: IKeyDownParam) {
    if (type === 'up') {
      this.camera.translateZ(-StepLength);
    } else if (type === 'down') {
      this.camera.translateZ(StepLength);
    } else if (type === 'left') {
      this.camera.translateX(-StepLength);
    } else if (type === 'right') {
      this.camera.translateX(StepLength);
    }
    this.camera.position.y = 2;
  }
}
export default engine;