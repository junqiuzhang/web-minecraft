import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import { ICommonParam } from '../interface'
import { Origin } from '../constant';
interface ISetting extends ICommonParam {
  renderer: THREE.Renderer;
}
export default function initSetting({
  scene,
  camera,
  renderer
}: ISetting) {
  // 视角控制
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.update();
  // 背景色
  scene.background = new THREE.Color( 0xcce0ff );
  // 背景雾化
  scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
  // 摄像机位置
  camera.position.set(0, 0, 0.001);
  // 摄像机角度
  camera.lookAt(Origin);
  // 渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 渲染器挂载
  document.body.appendChild(renderer.domElement);
  // 参数初始化
  window.initMousePosition = new THREE.Vector2(0, 0);
  window.initCameraDirection = new THREE.Vector3(0, 0, -1);
}