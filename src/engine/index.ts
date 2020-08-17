import * as THREE from 'three';
import * as Constants from '../constant';
import * as Utils from '../utils';
import * as Interface from '../interface';
import Cube from '../geometry/cube';
import MoveEngine from './move';

class CubeEngine extends MoveEngine {
  protected cubeDB: IDBDatabase;
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
    this.setState({
      color: 0x00ff00,
      isShiftDown: false
    })
    this.mountOverCube();
    this.mountCubeDB();
  }
  protected mountOverCube() {
    const cube = new Cube({ color: 0x000000, opacity: 0.3, transparent: true });
    this.overCube = cube;
    this.add(cube);
  }
  protected mountCube(cursor: { key: string, cube: Cube }) {
    const cube = new Cube();
    cube.position.copy(Utils.getPosition(cursor.key));
    this.add(cube);
  }
  protected async mountCubeDB() {
    Utils.initDataBase({
      dbName: Constants.IndexedDBName,
      dbVersion: Constants.IndexedDBVersion,
      osName: Constants.IndexedDBObjectStoreName,
      osKey: Constants.IndexedDBObjectStoreKey
    }).then(({ target }: { target: Interface.IEventTarget }) => {
      this.cubeDB = target.result;
      Utils.read({
        db: this.cubeDB,
        name: Constants.IndexedDBObjectStoreName,
        callback: (event) => { // fix Promise bug
          /// @ts-ignore
          const cursor = event.target.result;
          if (cursor) {
            this.mountCube(cursor);
            cursor.continue();
          }
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
    const { color } = this.state;
    const { point, face } = intersect;
    const cube = new Cube({ color });
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
  onShiftChange(isShiftDown: boolean) {
    this.setState({
      isShiftDown
    });
  }
  onPressNumber(key: number) {
    const colorArray = [0x000000, 0x000080, 0x008000, 0xc0c0c0, 0x0000ff, 0x00ff00, 0x00ffff, 0xff0000, 0xff00ff, 0xffffff]
    this.setState({
      color: colorArray[key]
    })
  }
}
export default CubeEngine;