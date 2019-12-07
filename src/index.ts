import * as THREE from 'three';
import engine from './engine';
import render from './render';
import interact from './interact';
import init from './setting';
import { IWindow } from './interface';
import { Fov, Near, Far } from './constant';
import './index.css';
declare global {
  interface Window extends IWindow {}
}
function entry() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(Fov, window.innerWidth / window.innerHeight, Near, Far);
  const renderer = new THREE.WebGLRenderer();
  // 初始化
  init({ scene, camera, renderer });
  // 引擎
  engine({ scene, camera });
  // 渲染
  render({ scene, camera, renderer });
  // 交互
  interact({ scene, camera });
}
entry();