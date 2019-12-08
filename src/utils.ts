import * as THREE from 'three';
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
export function round(x: number) {
  return x >= 0 ? Math.floor(x) + 0.5 : Math.ceil(x) - 0.5;
}