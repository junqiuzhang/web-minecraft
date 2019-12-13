import * as THREE from 'three';
import { CrashDistance } from './constant';
export function throttle(func: Function, wait: number) {
  let pre = Date.now();
  return (...args) => {
    let now = Date.now();
    if (now - pre > wait) {
      pre = now;
      return func(...args);
    }
  }
}
export function distance(x: number, y: number, z?: number) {
  return Math.sqrt(x * x + y * y + z * z);
}
export function isCrashed(target: THREE.Mesh, objects: THREE.Object3D[]): boolean {
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
      const firstIntersectObject = this.getRealIntersect(intersects);
      //如果物体存在且交点至中心的距离小于顶点至中心的距离，则发生碰撞
      if (firstIntersectObject && firstIntersectObject.distance < directionVector.length() + CrashDistance) {
        return true;
      }
    }
  }
  return false;
}