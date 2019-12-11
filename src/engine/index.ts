import * as THREE from 'three';
import * as CANNON from 'cannon';
import Cube from '../geometry/cube';
import { StepLength, CrashDistance } from '../constant';
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
  private world: CANNON.World;
  private threeBindCannon: Array<{ three: THREE.Mesh, cannon: CANNON.Body }>
  public mesh: THREE.Mesh;
  public grid: THREE.GridHelper;
  private rollOverMesh: THREE.Mesh;
  private cameraMesh: THREE.Mesh;
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
    this._mountCannon();
    this._mountRollOverMesh();
    this._mountCameraMesh();
  }
  update() {
    requestAnimationFrame(this.update);
    this.update();
    this.world.step(1 / 60);
    this.threeBindCannon.map(obj => {
      const { x, y, z } = obj.cannon.position;
      const vec = new THREE.Vector3(x, y, z);
      obj.three.position.copy(vec);
    })
  }
  _mountCannon() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -10, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
  }
  _mountRollOverMesh() {
    const rollOverGeo = new THREE.BoxBufferGeometry(1, 1, 1);
    const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    this.rollOverMesh = rollOverMesh;
    this.add(rollOverMesh);
  }
  _mountCameraMesh() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x000000, opacity: 0, transparent: true });
    const cameraMesh = new THREE.Mesh(geometry, material);
    this.cameraMesh = cameraMesh;
    this.cameraMesh.position.addVectors(this.camera.position, new THREE.Vector3(0, -0.5, 0));
    this.add(cameraMesh);
  }
  _getRealIntersect(intersects: THREE.Intersection[]) {
    return intersects.filter(intersect => intersect.object !== this.rollOverMesh)[0];
  }
  add(target: THREE.Object3D) {
    this.scene.add(target);
  }
  remove(target: THREE.Object3D) {
    this.scene.remove(target);
  }
  addMesh(target: THREE.Mesh) {
    target.geometry.computeBoundingBox();
    const { x, y, z } = target.position;
    const diffX = target.geometry.boundingBox.max.x - target.geometry.boundingBox.min.x;
    const diffY = target.geometry.boundingBox.max.y - target.geometry.boundingBox.min.y;
    const diffZ = target.geometry.boundingBox.max.z - target.geometry.boundingBox.min.z;
    const object = new CANNON.Body({
      mass: diffX * diffY * diffZ, // kg
      position: new CANNON.Vec3(x, y, z), // m
      shape: new CANNON.Box(new CANNON.Vec3(diffX, diffY, diffZ)) // m
    })
    this.threeBindCannon.push({
      three: target,
      cannon: object
    })
    this.add(target);
  }
  removeMesh(target: THREE.Mesh) {
    this.threeBindCannon = this.threeBindCannon.filter(obj => obj.three !== target);
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
      this.remove(object);
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
    this.cameraMesh.position.addVectors(this.camera.position, new THREE.Vector3(0, -0.5, 0));
    if (this.isCrashed(this.cameraMesh, this.scene.children)) {
      this.camera.position.y = 1.5;
    }
  }
  onShiftChange(isShiftDown: boolean) {
    this.state.isShiftDown = isShiftDown;
  }
  isCrashed(target: THREE.Mesh, objects: THREE.Object3D[]) {
    //中心点坐标
    const originPoint = target.position.clone();
    if (target.geometry instanceof THREE.Geometry) {
      const originVertices = target.geometry.vertices;
      for (let vertexIndex = 0; vertexIndex < target.geometry.vertices.length; vertexIndex++) {
        //顶点原始坐标
        const localVertex = originVertices[vertexIndex].clone();
        //顶点变换坐标
        const globalVertex = localVertex.applyMatrix4(target.matrix);
        //中心指向顶点的方向向量
        const directionVector = globalVertex.sub(target.position);
        //顶点沿方向向量方向的射线
        const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        //检测射线与多个物体相交的情况
        const intersects = ray.intersectObjects(objects, true);
        //获取第一个物体
        const firstIntersectObject = this._getRealIntersect(intersects);
        //如果物体存在且交点至中心的距离小于顶点至中心的距离，则发生碰撞
        if (firstIntersectObject && firstIntersectObject.distance < directionVector.length() + CrashDistance) {
          return true;
        }
      }
    }
    return false;
  }
}
export default engine;