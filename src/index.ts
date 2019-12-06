import { IWindow } from './interface';
import entry from './entry';
import './index.css';
declare global {
  interface Window extends IWindow {}
}
entry();