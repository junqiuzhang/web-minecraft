import * as THREE from 'three';
import * as Constants from '../constant';
import * as Utils from '../utils';
import * as Interface from '../interface';
import Cube from '../geometry/cube';
type Direction = 'up' | 'down' | 'left' | 'right';

interface IEngine {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}
interface IState {
  color: number;
  isShiftDown: boolean;
}
class engine {
  private scene: THREE.Scene;
  private camera: Interface.ICamera;
  private renderer: THREE.Renderer;
  private state: IState;
  private overCube: THREE.Mesh;
  private cubeDB: IDBDatabase;
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
      color: 0x00ff00,
      isShiftDown: false
    }
    this.mountOverCube();
    this.mountCubeDB();
  }
  private mountOverCube() {
    const cube = new Cube({ color: 0x00ff00, opacity: 0.5, transparent: true });
    this.overCube = cube;
    this.add(cube);
  }
  private mountCube(cursor: { key: string, cube: Cube }) {
    const cube = new Cube();
    cube.position.copy(Utils.getPosition(cursor.key));
    this.add(cube);
  }
  private async mountCubeDB() {
    Utils.initDataBase({
      dbName: Constants.IndexedDBName,
      dbVersion: Constants.IndexedDBVersion,
      osName: Constants.IndexedDBObjectStoreName,
      osKey: Constants.IndexedDBObjectStoreKey
    }).then(({ target }: { target: Interface.IEventTarget }) => {
      this.cubeDB = target.result;
      Utils.read({
        db: this.cubeDB,
        name: Constants.IndexedDBObjectStoreName
      }).then((event) => {
        /// @ts-ignore
        const cursor = event.target.result;
        if (cursor) {
          this.mountCube(cursor);
          cursor.continue();
        }
      })
    })
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
      db: this.cubeDB,
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
        db: this.cubeDB,
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
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
export default engine;