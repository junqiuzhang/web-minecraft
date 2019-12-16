import * as THREE from 'three';
import { Gravity } from './constant';
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
export function isCrashed({
  objects,
  position,
  direction,
  crashDistance
}: {
  objects: THREE.Object3D[],
  position: THREE.Vector3,
  direction: THREE.Vector3,
  crashDistance: number
}): boolean {
  const ray = new THREE.Raycaster(position, direction);
  const intersects = ray.intersectObjects(objects);
  if (intersects[0] && intersects[0].distance <= crashDistance) {
    return true;
  }
  return false;
}
export function isCrashedAll({
  target,
  objects,
  crashDistance
}: {
  target: THREE.Mesh,
  objects: THREE.Object3D[],
  crashDistance: number
}): boolean {
  if (target.geometry instanceof THREE.Geometry) {
    for (let vertexIndex = 0; vertexIndex < target.geometry.vertices.length; vertexIndex++) {
      const localVertex = target.geometry.vertices[vertexIndex].clone();
      const globalVertex = localVertex.applyMatrix4(target.matrix);
      const position = target.position.clone();
      const direction = globalVertex.sub(target.position);
      return isCrashed({
        objects,
        position,
        direction,
        crashDistance
      });
    }
  }
  return false;
}
export function isCrashedTop({
  target,
  objects,
  crashDistance
}: {
  target: THREE.Object3D,
  objects: THREE.Object3D[],
  crashDistance: number
}): boolean {
  const position = target.position.clone();
  const direction = new THREE.Vector3(0, 1, 0);
  return isCrashed({
    objects,
    position,
    direction,
    crashDistance
  })
}
export function isCrashedBottom({
  target,
  objects,
  crashDistance
}: {
  target: THREE.Object3D,
  objects: THREE.Object3D[],
  crashDistance: number
}): boolean {
  const position = target.position.clone();
  const direction = new THREE.Vector3(0, -1, 0);
  return isCrashed({
    objects,
    position,
    direction,
    crashDistance
  })
}
export function fall({
  target,
  objects,
  crashDistance
}: {
  target: THREE.Object3D,
  objects: THREE.Object3D[],
  crashDistance: number
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const pre = Date.now();
    function render() {
      const now = Date.now();
      const isCrash = isCrashedBottom({
        target, 
        objects, 
        crashDistance
      });
      if (!isCrash) {
        requestAnimationFrame(render);
        target.position.setY(target.position.y - (now - pre) * Gravity / 50000);
      } else {
        target.position.setY(Math.round(target.position.y * 2) / 2);
        resolve(true);
      }
    }
    render();
  })
}
export function jump({
  target,
  objects,
  crashDistance
}: {
  target: THREE.Object3D,
  objects: THREE.Object3D[],
  crashDistance: number
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const pre = Date.now();
    let loopTime = 300;
    function render() {
      const now = Date.now();
      const isCrash = isCrashedTop({
        target, 
        objects, 
        crashDistance
      });
      if (now - pre < loopTime && !isCrash) {
        requestAnimationFrame(render);
        target.position.setY(target.position.y + loopTime * Gravity / 50000);
      } else {
        resolve(true);
      }
    }
    render();
  })
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
    } else {
      independentVec[key] = new Proxy(independentVec[key], {
        set: function (target, p, value, receiver) {
          dependentVec[key] = value;
          return true;
        }
      })
    }
  }
}
export function filter(objects: THREE.Object3D[], blacklist: THREE.Object3D[]): THREE.Object3D[] {
  return objects.filter(object => blacklist.reduce((pre, cur) => pre && cur !== object, true));
}
export function filterIntersect(intersects: THREE.Intersection[], blacklist: THREE.Object3D[]): THREE.Intersection[] {
  return intersects.filter(intersect => blacklist.reduce((pre, cur) => pre && cur !== intersect.object, true));
}
export function openIndexedDB(name: string, version?: number): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version);
    request.onsuccess = function (event) {
      resolve(request.result);
      console.log(event);
    };
    request.onerror = function (event) {
      console.log(event);
    };
  });
}
export function openObjectStore(db: IDBDatabase, name: string, key?: string): IDBObjectStore {
  let objectStore = db.transaction([name]).objectStore(name);
  if (!db.objectStoreNames.contains(name)) {
    objectStore = db.createObjectStore(name, { 
      keyPath: key,
      autoIncrement: !key
    })
  }
  return objectStore;
}
export function write(objectStore: IDBObjectStore, object: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = objectStore.get(object.key);
    request.onsuccess = function(event) {
      if (request.result) {
        objectStore.put(object);
      } else {
        objectStore.add(object);
      }
      console.log(event);
    };
    request.onerror = function(event) {
      console.log(event);
    };
  })
}
export function read(objectStore: IDBObjectStore, func: Function) {
  objectStore.openCursor().onsuccess = function (event) {
    ///@ts-ignore
    const cursor = event.target.result;
    if (cursor) {
      func(cursor);
      cursor.continue();
    } else {
      console.log(event);
    }
  };
}