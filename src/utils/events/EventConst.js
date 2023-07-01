const EventConst = {};

// 通用事件
EventConst.SYSTEM_ERROR = 'system_error'; // 弹出错误页
EventConst.START_LOAD = 'startLoad'; // 监听预加载开始加载
EventConst.LOAD_PROGRESS = 'load_progress'; // 监听加载进度
EventConst.HIDE_LOADING = 'hide_loading'; // 隐藏加载页面
EventConst.EVT_SCENE_RES_READY = 'evt_scene_res_ready'; // 场景加载完成
EventConst.EVT_FILE_LOADED = 'evt_file_loaded'; // 监听单个文件加载完成
EventConst.EVT_GROUP_LOADED = 'evt_group_loaded'; // 监听资源组加载完成（resource内部用）
EventConst.RES_READY = 'res_ready'; // 监听资源组加载完成（外部用）
EventConst.DEBUG_INFO = 'debugInfo'; // 监听debug UI信息更新

// 业务事件


export default EventConst;
