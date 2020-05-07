import * as THREE from 'three';
export function subscribe(request: IDBRequest): Promise<Event> {
  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve(event);
    };
    request.onerror = function (event) {
      reject(event);
    }
  });
}
export function initDataBase({
  dbName,
  dbVersion,
  osName,
  osKey
}: {
  dbName: string,
  dbVersion: number,
  osName: string,
  osKey: string
}): Promise<Event> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onsuccess = function (event) {
      resolve(event);
    };
    request.onerror = function (event) {
      reject(event);
    };
    request.onupgradeneeded = function (event) {
      ///@ts-ignore
      event.target.result.createObjectStore(osName, { keyPath: osKey });
      resolve(event);
    };
  });
}
export function add({
  db,
  name,
  obj
}: {
  db: IDBDatabase,
  name: string,
  obj: any
}): Promise<Event> {
  const request = db.transaction([name], 'readwrite')
    .objectStore(name)
    .add(obj);
  return subscribe(request);
}
export function remove({
  db,
  name,
  obj
}: {
  db: IDBDatabase,
  name: string,
  obj: any
}): Promise<Event> {
  const request = db.transaction([name], 'readwrite')
    .objectStore(name)
    .delete(obj.key);
  return subscribe(request);
}
export function get({
  db,
  name,
  obj
}: {
  db: IDBDatabase,
  name: string,
  obj: any
}): Promise<Event> {
  const transaction = db.transaction([name]);
  const objectStore = transaction.objectStore(name);
  const request = objectStore.get(obj.key);
  return subscribe(request);
}
export function put({
  db,
  name,
  obj
}: {
  db: IDBDatabase,
  name: string,
  obj: any
}): Promise<Event> {
  const request = db.transaction([name], 'readwrite')
    .objectStore(name)
    .put(obj);
  return subscribe(request);
}
export function read({
  db,
  name
}: {
  db: IDBDatabase,
  name: string
}): Promise<Event> {
  const request = db.transaction(name)
    .objectStore(name)
    .openCursor();
  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve(event)
    };
  })
}
export function write(param: {
  db: IDBDatabase,
  name: string,
  obj: any
}): Promise<boolean> {
  return get(param)
    .then((event) => {
      if (event.type === 'success') {
        return put(param);
      } else {
        return add(param);
      }
    })
    .then((event) => {
      if (event.type === 'success') {
        return true;
      } else {
        return false;
      }
    })
}
export function getKey(position: THREE.Vector3): string {
  return `${position.x},${position.y},${position.z}`;
}
export function getPosition(str: string): THREE.Vector3 {
  const strArr = str.split(',');
  return new THREE.Vector3(Number(strArr[0]), Number(strArr[1]), Number(strArr[2]));
}