import * as THREE from 'three';
import { CrashDistance, Gravity } from './constant';
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
export function isCrashed(target: THREE.Mesh, objects: THREE.Object3D[]): boolean {
  const originPoint = target.position.clone();
  if (target.geometry instanceof THREE.Geometry) {
    const originVertices = target.geometry.vertices;
    for (let vertexIndex = 0; vertexIndex < target.geometry.vertices.length; vertexIndex++) {
      const localVertex = originVertices[vertexIndex].clone();
      const globalVertex = localVertex.applyMatrix4(target.matrix);
      const directionVector = globalVertex.sub(target.position);
      const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      const intersects = ray.intersectObjects(objects, true);
      const firstIntersectObject = intersects[0];
      if (firstIntersectObject && firstIntersectObject.distance < directionVector.length() + CrashDistance) {
        return true;
      }
    }
  }
  return false;
}
export function isCrashedBottom(target: THREE.Mesh, objects: THREE.Object3D[]): boolean {
  const originPoint = target.position.clone();
  if (target.geometry instanceof THREE.Geometry) {
    const ray = new THREE.Raycaster(originPoint, new THREE.Vector3(0, -1, 0));
    const intersects = ray.intersectObjects(objects, true);
    const firstIntersectObject = intersects[0];
    if (firstIntersectObject && firstIntersectObject.distance < CrashDistance + 0.5) {
      return true;
    }
  }
  return false;
}
export function freeFall(target: THREE.Mesh, objects: THREE.Object3D[]) {
  const pre = Date.now();
  function render() {
    if (!isCrashedBottom(target, objects)) {
      requestAnimationFrame(render);
      const now = Date.now();
      target.position.setY(target.position.y - (now - pre) * Gravity / 5000);
    }
  }
  render();
}
export function bindProperties(independentVec: Object, dependentVec: Object) {
  for (const key in independentVec) {
    if (typeof independentVec[key] === 'function') {
      independentVec[key] = new Proxy(independentVec[key], {
        apply: function (target, thisArg, argArray) {
          dependentVec[key].apply(dependentVec, argArray);
        }
      })
    }
  }
}