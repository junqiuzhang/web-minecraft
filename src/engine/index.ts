import * as THREE from 'three';
import Cube from '../geometry/cube';
import { StepLength } from '../constant';
type Direction = 'up' | 'down' | 'left' | 'right';
interface IEngine {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}
interface IState {
  isShiftDown: boolean;
}
interface IMoveParam {
  type: Direction;
}
class engine {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.Renderer;
  private state: IState;
  private mesh: THREE.Mesh;
  private grid: THREE.GridHelper;
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
      isShiftDown: false
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
  _add(target: THREE.Object3D) {
    this.scene.add(target);
  }
  addMesh(target: THREE.Mesh) {
    this.mesh = target;
    this._add(target);
  }
  addGrid(target: THREE.GridHelper) {
    this.grid = target;
    this._add(target);
  }
  _remove(target: THREE.Object3D) {
    this.scene.remove(target);
  }
  onClick(intersects: THREE.Intersection[]) {
    const { isShiftDown } = this.state;
    if (!isShiftDown) {
      this.onCreate(intersects);
    } else {
      this.onRemove(intersects);
    }
  }
  onCreate(intersects: THREE.Intersection[]) {
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
  onRemove(intersects: THREE.Intersection[]) {
    const { object } = this._getRealIntersect(intersects);
    if (object !== this.mesh && object !== this.grid) {
      this._remove(object);
    }
  }
  onHover(intersects: THREE.Intersection[]) {
    const { point, face } = this._getRealIntersect(intersects);
    if (face instanceof THREE.Face3) {
      this.rollOverMesh.position.copy(point).add(face.normal.divideScalar(2));
      this.rollOverMesh.position.floor().addScalar(0.5);
    } else {
      this.rollOverMesh.position.copy(point.floor().addScalar(0.5));
    }
  }
  onMove(type: Direction) {
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
  onShiftChange(isShiftDown: boolean) {
    this.state.isShiftDown = isShiftDown;
  }
}
export default engine;