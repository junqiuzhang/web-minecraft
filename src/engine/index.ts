import * as THREE from 'three';
import Cube from '../geometry/cube';
import * as Constants from '../constant';
import * as Utils from '../utils';
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
  private overCube: THREE.Mesh;
  private indexedDB: IDBDatabase;
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
    this.mountIndexedDB();
  }
  private mountOverMesh() {
    const cube = new Cube({ color: 0xff0000, opacity: 0.5, transparent: true });
    this.overCube = cube;
    this.add(cube);
  }
  private async mountIndexedDB() {
    Utils.initDataBase({
      dbName: Constants.IndexedDBName,
      dbVersion: Constants.IndexedDBVersion,
      osName: Constants.IndexedDBObjectStoreName,
      osKey: Constants.IndexedDBObjectStoreKey
    }).then((event) => {
      ///@ts-ignore
      this.indexedDB = event.target.result;
      Utils.read({
        db: this.indexedDB,
        name: Constants.IndexedDBObjectStoreName,
        func: this.mountMesh.bind(this)
      })
    })
  }
  private mountMesh(cursor: { key: string, cube: Cube }) {
    const cube = new Cube();
    cube.position.copy(Utils.getPosition(cursor.key));
    this.add(cube);
  }
  add(target: THREE.Object3D) {
    this.scene.add(target);
  }
  remove(target: THREE.Object3D) {
    this.scene.remove(target);
  }
  onClick(intersects: THREE.Intersection[]) {
    const realIntersect = Utils.filterIntersect(intersects, [this.overCube])[0];
    if (!realIntersect) return;
    const { isShiftDown } = this.state;
    if (!isShiftDown) {
      this.onCreate(realIntersect);
    } else {
      this.onRemove(realIntersect);
    }
  }
  onCreate(intersect: THREE.Intersection) {
    const { point, face } = intersect;
    const cube = new Cube();
    if (face instanceof THREE.Face3) {
      cube.position.copy(point).add(face.normal.divideScalar(2));
      cube.position.floor().addScalar(0.5);
    } else {
      cube.position.copy(point.floor().addScalar(0.5));
    }
    Utils.fall({
      target: cube, 
      objects: this.scene.children, 
      crashDistance: 0.5
    });
    this.add(cube);
    Utils.write({
      db: this.indexedDB,
      name: Constants.IndexedDBObjectStoreName,
      obj: {
        key: Utils.getKey(cube.position),
        cube: Utils.cloneProperties(cube)
      }
    })
  }
  onRemove(intersect: THREE.Intersection) {
    const { object } = intersect;
    if (object !== this.ground && object !== this.grid && object instanceof THREE.Mesh) {
      this.remove(object);
      Utils.remove({
        db: this.indexedDB,
        name: Constants.IndexedDBObjectStoreName,
        obj: {
          key: Utils.getKey(object.position),
          cube: object
        }
      })
    }
  }
  onHover(intersects: THREE.Intersection[]) {
    const realIntersect = Utils.filterIntersect(intersects, [this.overCube])[0];
    if (!realIntersect) return;
    const { point, face } = realIntersect;
    if (face instanceof THREE.Face3) {
      this.overCube.position.copy(point).add(face.normal.divideScalar(2));
      this.overCube.position.floor().addScalar(0.5);
    } else {
      this.overCube.position.copy(point.floor().addScalar(0.5));
    }
  }
  private isCameraCrashed(): boolean {
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
  onShiftChange(isShiftDown: boolean) {
    this.state.isShiftDown = isShiftDown;
  }
}
export default engine;