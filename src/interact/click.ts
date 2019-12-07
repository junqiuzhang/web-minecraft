import * as THREE from 'three';
import { IInteract } from './index';
function click({
  scene,
  camera
}: IInteract) {
  const raycaster = new THREE.Raycaster();
  function handleClick(this: HTMLElement, event: MouseEvent) {
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(window.mousePosition, camera);
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
  }
  return handleClick;
}
export default click;