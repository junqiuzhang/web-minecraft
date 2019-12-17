export * from './data-base';
export * from './engine';
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
export function cloneProperties(obj: Object) {
  let resObj = {};
  for (const key in obj) {
    if (typeof obj[key] !== 'function') {
      if (typeof obj[key] !== 'object') {
        resObj[key] = obj[key];
      }
    }
  }
  return resObj;
}