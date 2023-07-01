

class AudioManager {
    constructor() {
        this.bgm = null;
        this.bgmId = null;

        this.effectMap = {};
    }

    static AUDIO_TYPE = {
        BGM: 1,     // 背景音乐，同时只存在一个
        EFFECT: 2   // 音效，可同时播放
    }

    createBGM(id, src, isLoop = true) {
        if (this.bgm && this.bgmId !== id) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
        this.bgm = new Audio(src);
        this.bgm.loop = isLoop;
        this.bgmId = id;

        return this.bgm;
    }

    createEffect(id, src) {
        if (this.effectMap[id]) {
            return this.effectMap[id];
        }
        this.effectMap[id] = new Audio(src);

        return this.effectMap[id];
    }

    playEffect(id) {
        if (!this.effectMap[id]) {
            console.warn('音效不存在', id)
            return null;
        }

        this.effectMap[id].play();
    }

    stopEffect(id) {
        if (!this.effectMap[id]) {
            console.warn('音效不存在', id)
            return null;
        }
        this.effectMap[id].pause();
        this.effectMap[id].currentTime = 0;
    }

    getEffect(id) {
        if (!this.effectMap[id]) {
            console.warn('音效不存在', id)
            return null;
        }

        return this.effectMap[id];
    }

    getCurrentBgm() {
        if (!this.bgm) {
            console.warn('bgm不存在，请先调用createAudio创建bgm')
        }

        return this.bgm;
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.bgm = null;
        }
    }

    muteBGM(bool) {
        if (this.bgm) {

        }
    }

    disposeBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.bgm = null;
        }
    }

    disposeEffects() {
        for (let key in this.effectMap) {
            this.effectMap[key].pause();
            this.effectMap[key].currentTime = 0;
            delete this.effectMap[key];
        }
    }

    disposeAll() {
        this.disposeBGM();
        this.disposeEffects();
    }
}

export default new AudioManager();