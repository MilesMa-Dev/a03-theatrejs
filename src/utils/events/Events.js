class Events {
    constructor() {
        if (!this.event_list) {
            this.event_list = {};
        }

        // 单个事件最多订阅者数量
        this.MaxEventListNum = this.MaxEventListNum || undefined;
        this.defaultMaxEventListNum = 10;
    }

    on(eventName, content) {
        if (eventName === undefined) return;
       
        let ctx;
        if (!this.event_list) {
            this.event_list = {};
        } else {
            ctx = this.event_list[eventName];
        }

        if (!ctx) {
            ctx = this.event_list[eventName] = content;
            ctx.ListenerCount = 1;
        } else if (typeof ctx === 'function') {
            // 判断此属性是否为函数（是函数则表示已经有且只有一个订阅者）
            // 将此eventName类型由函数转变为数组
            ctx = this.event_list[eventName] = [ctx, content];
            // 此时订阅者数量变为数组长度
            ctx.ListenerCount = ctx.length;
        } else if (Array.isArray(ctx)) {
            // 判断是否为数组，如果是数组则直接push
            ctx.push(content);
            ctx.ListenerCount = ctx.length;

            //只有在是数组的情况下才会做比较
            if (!ctx.maxed) {
                let len = ctx.length;
                if (len > (this.MaxEventListNum ? this.MaxEventListNum : this.defaultMaxEventListNum)) {
                    // 当超过最大限制，则会发除警告
                    ctx.maxed = true;
                    console.warn('events.MaxEventListNum || [ MaxEventListNum ] :The number of subscriptions exceeds the maximum, and if you do not set it, the default value is 10');
                } else {
                    ctx.maxed = false;
                }
            }
        }
    }

    once(eventName, content) {
        this.on(eventName, this.dealOnce(this, eventName, content));
    }

    // 包装函数
    dealOnce(target, type, content) {
        let flag = false;
        // 通过闭包特性（会将函数外部引用保存在作用域中）
        function packageFun() {
            // 当此监听回调被调用时，会先删除此回调方法
            this.off(type, packageFun);
            if (!flag) {
                flag = true;
                // 因为闭包，所以原监听回调还会保留，所以还会执行
                content.apply(target, arguments);
            }
            packageFun.content = content;
        }
        return packageFun;
    }

    emit(eventName, ...args) {
        if (eventName === undefined) return;

        let ctx;
        if (this.event_list) {
            ctx = this.event_list[eventName];
        }
        // 检测此监听类型的事件队列
        // 不存在则直接返回
        if (!ctx) {
            return false;
        } else if (typeof ctx === 'function') {
            // 是函数则直接执行，并将所有参数传递给此函数（回调函数）
            ctx.apply(this, args);
        } else if (Array.isArray(ctx)) {
            // 是数组则遍历调用
            for (let i = 0; i < ctx.length; i++) {
                ctx[i].apply(this, args);
            }
        }
    }

    off(eventName, content) {
        let ctx, index = 0;

        if (!this.event_list) {
            return this;
        } else {
            ctx = this.event_list[eventName];
        }

        if (!ctx) {
            return this;
        }

        // 如果是函数  直接delete
        if (typeof ctx === 'function') {
            if (ctx === content) {
                delete this.event_list[eventName];
            }
        } else if (Array.isArray(ctx)) {
            // 如果是数组 遍历
            for (let i = 0; i < ctx.length; i++) {
                if (ctx[i] === content) {
                    // 监听回调相等
                    // 从该监听回调的index开始，后面的回调依次覆盖掉前面的回调
                    // 将最后的回调删除
                    // 等价于直接将满足条件的监听回调删除
                    this.event_list[eventName].splice(i - index, 1);
                    ctx.ListenerCount = ctx.length;
                    if (this.event_list[eventName].length === 0) {
                        delete this.event_list[eventName]
                    }
                    index++;
                }
            }
        }
    }

    removeAllListeners(eventName = null) {
        let ctx;

        if (!this.event_list) {
            return this;
        }
        ctx = this.event_list[eventName];
        // 判断是否有参数
        if (!eventName) {
            // 无参数
            // 将key 转成 数组  并遍历
            // 依次删除所有的类型监听
            const keys = Object.keys(this.event_list);
            for (let i = 0, key; i < keys.length; i++) {
                key = keys[i];
                delete this.event_list[key];
            }
        }
        // 有参数 直接移除
        if (ctx) {
            delete this.event_list[eventName];
        } else {
            return this;
        }
    }

    getListenerCount() {
        return Object.keys(this.event_list).length;
    }
}

export default new Events();