import {
  DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';

import { CanvasTexture, ImageBitmapLoader, ObjectLoader, TextureLoader } from 'three';
import EventConst from '../events/EventConst';
import Events from '../events/Events';

export default class Loader {
  /**
   * Constructor
   */
  constructor() {

    // 当前组已加载文件数
    this.loaded = 0;
    // 当前组文件总数
    this.toLoad = 0;

    // 需要加载的资源组队列
    this.loadQueue = [];

    this.loadedGroup = [];

    this._setLoaders();
  }

  /**
   * 资源加载配置
   */
  _setLoaders() {
    this.loaders = [];

    const textureLoader = new TextureLoader();
    // Images
    this.loaders.push({
      extensions: ['jpg', 'jpeg', 'png'],
      action: _resource => {

        textureLoader.load(_resource.source, (env) => {
          this.fileLoadEnd({
            name: _resource.name,
            type: _resource.type
          }, env);
        }, err => {
          console.log('env error', err);
          Events.emit(EventConst.SYSTEM_ERROR);
        });
      }
    });

    // Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://static.ssl.jimingkeji.com.cn/libs/draco/');
    dracoLoader.setDecoderConfig({
      type: 'js'
    });
    this.loaders.push({
      extensions: ['drc'],
      action: (_resource) => {
        dracoLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);

          // DRACOLoader.releaseDecoderModule();
          dracoLoader.dispose();
        });
      }
    });

    // gltf glb
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.loaders.push({
      extensions: ['glb', 'gltf', 'bin', 'exe'],
      action: _resource => {
        gltfLoader.load(
          _resource.source,
          _data => {
            this.fileLoadEnd(_resource, _data);
          },
          () => { },
          err => {
            console.error('gltf error', _resource.name, err);
            Events.emit(EventConst.SYSTEM_ERROR);
          }
        );
      }
    });

    // obj
    const objLoader = new OBJLoader();
    this.loaders.push({
      extensions: ['obj'],
      action: _resource => {
        objLoader.load(
          _resource.source,
          _data => {
            this.fileLoadEnd(_resource, _data);
          },
          () => { },
          err => {
            console.log('obj error', err);
            Events.emit(EventConst.SYSTEM_ERROR);
          }
        );
      }
    });

    // json
    const objectLoader = new ObjectLoader();
    this.loaders.push({
      extensions: ['json'],
      action: _resource => {
        objectLoader.load(
          _resource.source,
          _data => {
            console.log(_data)
            this.fileLoadEnd(_resource, _data);
          },
          () => { },
          err => {
            console.log('json error', err);
            Events.emit(EventConst.SYSTEM_ERROR);
          }
        );
      }
    });
  }

  _loadNext() {
    const _resources = this.loadQueue[0].list;
    this.loaded = 0;
    this.toLoad = this.loadQueue[0].list.length;

    for (const _resource of _resources) {
      let source = _resource.source;
      if (_resource.source instanceof Array) {
        source = _resource.source[0];
      }
      const extensionMatch = source.match(/\.([a-z0-9]+)$/);
      if (extensionMatch && typeof extensionMatch[1] !== 'undefined') {
        const extension = extensionMatch[1];
        const loader = this.loaders.find(_loader =>
          _loader.extensions.find(_extension => _extension === extension)
        );

        if (loader) {
          loader.action(_resource);
        } else {
          console.warn(`Cannot found loader for ${_resource}`);
        }
      } else {
        console.log(source)
        console.warn(`Cannot found extension of ${_resource.name}`);
      }
    }
  }

  /**
   *
   * @param {*} _resources 资源列表
   * @param {*} name 资源组名, 用于标记加载的资源组
   */
  load(_resources = [], name) {
    this.loadedGroup.push(name);
    this.loadQueue.push({
      name: name,
      list: _resources
    });

    if (this.loadQueue.length == 1) {
      this._loadNext();
    }
  }

  fileLoadEnd(_resource, _data) {
    this.loaded++;

    Events.emit(EventConst.EVT_FILE_LOADED, _resource, _data);

    if (this.loaded === this.toLoad) {
      Events.emit(EventConst.EVT_GROUP_LOADED, this.loadQueue[0].name);
      this.loadQueue.shift();
      if (this.loadQueue.length > 0) {
        this._loadNext();
      }
    }
  }
}