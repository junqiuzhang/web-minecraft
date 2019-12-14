import * as THREE from 'three';
import Cube from '../geometry/cube';
import { StepLength } from '../constant';
import { isCrashed, fall, jump, getRealIntersect, filter } from '../utils';
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
  private blacklist1: THREE.Object3D[];
  private blacklist3: THREE.Object3D[];
  ground: THREE.Mesh;
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
    this.mountBlacklist();
  }
  private mountOverMesh() {
    const rollOverGeo = new THREE.BoxBufferGeometry(1, 1, 1);
    const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    this.overMesh = rollOverMesh;
    this.addMesh(rollOverMesh);
  }
  private mountBlacklist() {
    this.blacklist1 = [this.overMesh];
    this.blacklist3 = [this.overMesh, this.ground, this.grid];
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
    const realIntersect = getRealIntersect(intersects, this.blacklist1);
    if (!realIntersect) return;
    const { point, face } = realIntersect;
    const cube = new Cube();
    if (face instanceof THREE.Face3) {
      cube.position.copy(point).add(face.normal.divideScalar(2));
      cube.position.floor().addScalar(0.5);
    } else {
      cube.position.copy(point.floor().addScalar(0.5));
    }
    fall({
      target: cube, 
      objects: this.scene.children, 
      crashDistance: 0.5
    });
    this.addMesh(cube);
  }
  onRemove(intersects: THREE.Intersection[]) {
    const realIntersect = getRealIntersect(intersects, this.blacklist1);
    if (!realIntersect) return;
    const { object } = realIntersect;
    if (object !== this.ground && object !== this.grid && object instanceof THREE.Mesh) {
      this.removeMesh(object);
    }
  }
  onHover(intersects: THREE.Intersection[]) {
    const realIntersect = getRealIntersect(intersects, this.blacklist1);
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
    const objects = filter(this.scene.children, this.blacklist3);
    const direction = this.camera.getWorldDirection(new THREE.Vector3());
    const crashDistance = StepLength;
    const isCrash = isCrashed({
      objects,
      direction,
      crashDistance,
      position: this.camera.position,
    }) || isCrashed({
      objects,
      direction,
      crashDistance,
      position: new THREE.Vector3(this.camera.position.x, this.camera.position.y - 1, this.camera.position.z),
    })
    if (isCrash) return;
    if (type === 'up') {
      this.camera.translateZ(-StepLength);
    } else if (type === 'down') {
      this.camera.translateZ(StepLength);
    } else if (type === 'left') {
      this.camera.translateX(-StepLength);
    } else if (type === 'right') {
      this.camera.translateX(StepLength);
    }
    fall({
      target: this.camera, 
      objects: this.scene.children, 
      crashDistance: 1.5
    });
  }
  onJump() {
    const target = this.camera;
    const objects = this.scene.children
    jump({
      target, 
      objects, 
      crashDistance: 0.5
    }).then(() => {
      fall({
        target: this.camera, 
        objects: this.scene.children, 
        crashDistance: 1.5
      });
    })
  }
  onShiftChange(isShiftDown: boolean) {
    this.state.isShiftDown = isShiftDown;
  }
}
export default engine;