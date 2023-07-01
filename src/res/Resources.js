import EventConst from '@/utils/events/EventConst.js';
import Events from '@/utils/events/Events.js';
import Loader from '@/utils/three/Loader';
import Assets from './Assets';
/**
 * 资源管理类
 * 单例 勿直接创建
 */
export default class Resources {
  static instance;

  constructor() {
    if (Resources.instance) {
      return Resources.instance;
    }
    Resources.instance = this;


    this.loader = new Loader();
    this.items = {};
    this.isInit = true;

    this.setEvent();
  }

  /**
   * 创建单例
   */
  static getInstance() {
    if (Resources.instance) {
      return Resources.instance;
    }
    return (Resources.instance = new Resources());
  }

  setEvent() {
    // 单个资源加载成功
    this.onFileLoadedHandler = this.onFileLoaded.bind(this);
    Events.on(EventConst.EVT_FILE_LOADED, this.onFileLoadedHandler);

    // 资源组加载成功
    Events.on(EventConst.EVT_GROUP_LOADED, name => {
      Events.emit(EventConst.EVT_SCENE_RES_READY); // 通知3D场景资源加载完成
      Events.emit(EventConst.RES_READY); // 通知loading页资源加载完成
    });
  }

  onFileLoaded(_resource, _data) {
    this.items[_resource.name] = _data;

    console.log('progress', this.loader.loaded, '/', this.loader.toLoad, _resource.name);
    Events.emit(EventConst.LOAD_PROGRESS, (this.loader.loaded / this.loader.toLoad).toFixed(2));
  }

  /**
   * 加载资源组
   * @param {*} groupName 
   */
  loadGroup(groupName) {
    let resGroup;
    if (this.isInit) {
      resGroup = Assets[groupName].concat(Assets['Common']);
      Events.emit(EventConst.START_LOAD);  // 首次场景开始加载
      this.isInit = false;
    } else {
      resGroup = Assets[groupName];
    }

    this.loader.load(resGroup, groupName);
  }

  /**
   * 主动加载
   * @param {*} arr - 资源组
   * @param {*} type - 资源组名称
   */
  load(arr, name) {
    this.loader.load(arr, name);
  }

  /**
   * 清除列表中的资源
   * @param {*} name - 资源组名称
   */
  deleteGroup(name) {
    let resGroup = Assets[name];

    if (!resGroup) {
      console.warn('cannot find resource group', name);
      return;
    }
    resGroup.forEach(cfg => {
      if (cfg.type == 'texture' || cfg.type == 'basis' || cfg.type == 'env') {
        this.items[cfg.name].dispose();
        delete this.items[cfg.name];
      } else if (cfg.type == 'model') {
        const scene = this.items[cfg.name].scene;
        while (scene.children.length) {
          const child = scene.children[0];
          child.geometry && child.geometry.dispose();
          child.material && child.material.dispose();
          scene.remove(child);
        }
      } else if (cfg.type == 'obj') {
        const scene = this.items[cfg.name];
        while (scene.children.length) {
          const child = scene.children[0];
          child.geometry && child.geometry.dispose();
          child.material && child.material.dispose();
          scene.remove(child);
        }
      } else {
      }
      this.items[cfg.name] && (delete this.items[cfg.name]);
    });
  }
}
