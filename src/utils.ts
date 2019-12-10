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
export function distance(x: number, y: number, z?: number) {
  return Math.sqrt(x * x + y * y + z * z);
}