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
export function isCrashedTop(target: THREE.Object3D, objects: THREE.Object3D[]): boolean {
  const originPoint = target.position.clone();
  const ray = new THREE.Raycaster(originPoint, new THREE.Vector3(0, 1, 0));
  const intersects = ray.intersectObjects(objects, true);
  const firstIntersectObject = intersects[0];
  if (firstIntersectObject && firstIntersectObject.distance < CrashDistance + 0.5) {
    return true;
  }
  return false;
}
export function isCrashedBottom(target: THREE.Object3D, objects: THREE.Object3D[]): boolean {
  const originPoint = target.position.clone();
  const ray = new THREE.Raycaster(originPoint, new THREE.Vector3(0, -1, 0));
  const intersects = ray.intersectObjects(objects, true);
  const firstIntersectObject = intersects[0];
  if (firstIntersectObject && firstIntersectObject.distance < CrashDistance + 0.5) {
    return true;
  }
  return false;
}
export function fall(target: THREE.Object3D, objects: THREE.Object3D[]) {
  const pre = Date.now();
  function render() {
    const now = Date.now();
    if (!isCrashedBottom(target, objects)) {
      requestAnimationFrame(render);
      target.position.setY(target.position.y - (now - pre) * Gravity / 5000);
    } else {
      target.position.setY(Math.round(target.position.y * 2) / 2);
    }
  }
  render();
}
export function jump(target: THREE.Object3D, objects: THREE.Object3D[]) {
  const pre = Date.now();
  let loopTime = 500;
  function render() {
    const now = Date.now();
    if (now - pre <  loopTime && !isCrashedTop(target, objects)) {
      requestAnimationFrame(render);
      target.position.setY(target.position.y + loopTime * Gravity / 50000);
    }
  }
  render();
}
export function bindProperties(independentVec: Object, dependentVec: Object) {
  for (const key in independentVec) {
    if (typeof independentVec[key] === 'function') {
      independentVec[key] = new Proxy(independentVec[key], {        
        apply: function (target, thisArg, argArray) {
          target.apply(thisArg, argArray);
          dependentVec[key].apply(dependentVec, argArray);
        }
      })
    }
  }
}