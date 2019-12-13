import * as THREE from 'three';
import Cube from '../geometry/cube';
import { StepLength } from '../constant';
import { bindProperties, isCrashed, isCrashedBottom, freeFall } from '../utils';
type Direction = 'up' | 'down' | 'left' | 'right';
interface IEngine {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}
interface IState {
  isShiftDown: boolean;
}
class engine {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.Renderer;
  private state: IState;
  private overMesh: THREE.Mesh;
  private cameraMesh: THREE.Mesh;
  mesh: THREE.Mesh;
  grid: THREE.GridHelper;
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
    this.mountOverMesh();
    this.mountCameraMesh();
  }
  private mountOverMesh() {
    const rollOverGeo = new THREE.BoxBufferGeometry(1, 1, 1);
    const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    this.overMesh = rollOverMesh;
    this.addMesh(rollOverMesh);
  }
  private mountCameraMesh() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0, transparent: true });
    const cameraMesh = new THREE.Mesh(geometry, material);
    this.cameraMesh = cameraMesh;
    bindProperties(this.cameraMesh.position, this.camera.position);
    this.cameraMesh.position.setY(this.camera.position.y - 0.5);
    this.addMesh(cameraMesh);
  }
  private getRealIntersect(intersects: THREE.Intersection[]) {
    return intersects.filter(intersect => intersect.object !== this.overMesh)[0];
  }
  add(target: THREE.Object3D) {
    this.scene.add(target);
  }
  remove(target: THREE.Object3D) {
    this.scene.remove(target);
  }
  addMesh(target: THREE.Mesh) {
    this.add(target);
  }
  removeMesh(target: THREE.Mesh) {
    this.remove(target);
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
    const realIntersect = this.getRealIntersect(intersects);
    if (!realIntersect) return;
    const { point, face } = realIntersect;
    const cube = new Cube();
    if (face instanceof THREE.Face3) {
      cube.position.copy(point).add(face.normal.divideScalar(2));
      cube.position.floor().addScalar(0.5);
    } else {
      cube.position.copy(point.floor().addScalar(0.5));
    }
    freeFall(cube, this.scene.children);
    this.addMesh(cube);
  }
  onRemove(intersects: THREE.Intersection[]) {
    const realIntersect = this.getRealIntersect(intersects);
    if (!realIntersect) return;
    const { object } = realIntersect;
    if (object !== this.mesh && object !== this.grid && object instanceof THREE.Mesh) {
      this.removeMesh(object);
    }
  }
  onHover(intersects: THREE.Intersection[]) {
    const realIntersect = this.getRealIntersect(intersects);
    if (!realIntersect) return;
    const { point, face } = realIntersect;
    if (face instanceof THREE.Face3) {
      this.overMesh.position.copy(point).add(face.normal.divideScalar(2));
      this.overMesh.position.floor().addScalar(0.5);
    } else {
      this.overMesh.position.copy(point.floor().addScalar(0.5));
    }
  }
  onMove(type: Direction) {
    if (type === 'up') {
      this.cameraMesh.translateZ(-StepLength);
    } else if (type === 'down') {
      this.cameraMesh.translateZ(StepLength);
    } else if (type === 'left') {
      this.cameraMesh.translateX(-StepLength);
    } else if (type === 'right') {
      this.cameraMesh.translateX(StepLength);
    }
    freeFall(this.cameraMesh, this.scene.children);
  }
  onShiftChange(isShiftDown: boolean) {
    this.state.isShiftDown = isShiftDown;
  }
}
export default engine;