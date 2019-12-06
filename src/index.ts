import * as THREE from 'three';
import engine from './engine';
import render from './render';
import interact from './interact';
import { IWindow } from './interface';
import './index.css';
declare global {
  interface Window extends IWindow {}
}
function entry() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, document.body.clientWidth / document.body.clientHeight, 0.001, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(document.body.clientWidth, document.body.clientHeight);
  document.body.appendChild(renderer.domElement);
  // 引擎
  engine({ scene, camera });
  // 渲染
  render({ scene, camera, renderer });
  // 交互
  interact({ scene, camera });
}
entry();