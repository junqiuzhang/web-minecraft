import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import light from './light';
import ground from '../setting/ground';
import { ICommonParam } from '../interface'
import { Near, Origin } from '../constant';
interface ISetting extends ICommonParam {
  renderer: THREE.Renderer;
}
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
  camera.position.set(0, 0, 0);
  // 摄像机角度
  camera.lookAt(0, 0, -1);
  // 渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 渲染器挂载
  document.body.appendChild(renderer.domElement);
  // 光线设置
  light({ scene, camera });
  // 大地设置
  ground({ scene, camera });
  // 参数初始化
}