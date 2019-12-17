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
export function read({
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
    .add(obj);
  return subscribe(request);
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
export function write(param: {
  db: IDBDatabase,
  name: string,
  key: string,
  obj: any
}): Promise<boolean> {
  return read(param)
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
export function readAll({
  db,
  name,
  func
}: {
  db: IDBDatabase,
  name: string,
  func: Function
}) {
  const request = db.transaction(name)
    .objectStore(name)
    .openCursor();
  request.onsuccess = function (event) {
    ///@ts-ignore
    const cursor = event.target.result;
    if (cursor) {
      func(cursor);
      cursor.continue();
    }
  };
}
export function getKey(position: THREE.Vector3) {
  return `${position.x},${position.y},${position.z}`;
}