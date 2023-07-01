import platform from 'platform';

let mobileFlag = null;
const ua = navigator.userAgent;

export const isMobile = () => {
  if (mobileFlag === null) {
    // IOS 13 safari 的 UA 中没有iPad标记，改用 platform 和 触点数量判断
    const isiPad = ua.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    mobileFlag = platform.os.family === 'iOS' || platform.os.family === 'Android' || platform.os.family === 'iPad' || isiPad;
  }
  return mobileFlag;
};

export const getIOSVersion = () => {
  if (!isIOS()) return -1;

  var str = ua.toLowerCase();
  var ver = str.match(/cpu iphone os (.*?) like mac os/);
  return ver ? ver[1].replace(/_/g, '.') : -1;
};

export const isIE = () => {
  return !!window.ActiveXObject || 'ActiveXObject' in window;
};

export const isIOS = () => {
  return platform.os.family === 'iOS';
};

export const isAndroid = () => {
  return platform.os.family === 'Android';
};

export const isSafari = () => {
  return /Safari/i.test(ua) && !/Chrome/i.test(ua);
};

export const isUC = () => {
  return /UCBrowser/i.test(ua);
};

export const isWechat = () => {
  return /MicroMessenger/i.test(ua);
};

export const isDouYin = () => {
  return !!window.tiktok.version != !!NaN && window.tiktok.version;
};

export const isQQBrowser = () => {
  return /MQQBrowser/i.test(ua) && !isWechat();
};

export const liveBlackList = () => {
  return isMobile() && /Firefox|HeyTapBrowser|Quark/i.test(ua);
};

export const videoBlackList = () => {
  return isMobile() && (/Firefox|HeyTapBrowser/i.test(ua) || isQQBrowser());
};

export const webglSupport = () => {
  try {
    if (window.localStorage.getItem('isSuppotWebgl') !== null) return window.localStorage.getItem('isSuppotWebgl');

    const canvas = document.createElement('canvas');
    const isSuppotWebgl = !!window.WebGLRenderingContext && !!(canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl'));

    window.localStorage.setItem('isSuppotWebgl', isSuppotWebgl);

    return isSuppotWebgl;
  } catch (e) {
    return false;
  }
};

export const checkBlacklist = () => {
  if (isUC() || isIE() || liveBlackList() || videoBlackList() || !webglSupport()) {
    // window.location.href = 'https://tstatic.ssl.jimingkeji.com.cn/virtualverse_meeting_demo/error/error.html';
    return true;
  }
  return false;
};

export const getGPU = () => {
  const canvas = document.createElement('canvas');
  if (canvas != null) {
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (context) {
      const info = context.getExtension('WEBGL_debug_renderer_info');
      if (info) {
        return context.getParameter(info.UNMASKED_RENDERER_WEBGL);
      }
    }
  }
  return '';
};

export const TouchEvent = {
  touchstart: 'touchstart',
  touchend: 'touchend',
  touchmove: 'touchmove',
  touchcancel: 'touchcancel',
  initTouchEvents: function () {
    if (!isMobile()) {
      this.touchstart = 'mousedown';
      this.touchend = 'mouseup';
      this.touchmove = 'mousemove';
      this.touchcancel = 'mouseout';
    }
  }
};
TouchEvent.initTouchEvents();

// getGPU();