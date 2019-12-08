import * as THREE from 'three';
import light from './light';
import ground from '../setting/ground';
import { ICommonParam } from '../interface'
interface ISetting extends ICommonParam {}
export default function initSetting({
  scene,
  camera,
  renderer
}: ISetting) {
  // 背景色
  scene.background = new THREE.Color(0xcce0ff);
  // 背景雾化
  scene.fog = new THREE.Fog(0xcce0ff, 20, 100);
  // 摄像机位置
  camera.position.set(0.5, 2, 0.5);
  // 摄像机角度
  camera.lookAt(0.5, 2, -0.5);
  // 渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 渲染器挂载
  document.body.appendChild(renderer.domElement);
  // 光线设置
  light({ scene, camera, renderer });
  // 大地设置
  ground({ scene, camera, renderer });
  // 参数初始化
}