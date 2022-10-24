(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.log = factory());
})(this, (function () { 'use strict';

    var LogConfig;
    (function (LogConfig) {
        LogConfig["version"] = "1.0.0";
    })(LogConfig || (LogConfig = {}));

    // history 无法通过 popstate 监听 pushState replaceState  只能重写其函数dispatchEvent一个事件
    const createHistoryEvent = (type) => {
        const origin = history[type];
        return function () {
            const res = origin.apply(this, arguments);
            const e = new Event(type);
            window.dispatchEvent(e);
            return res;
        };
    };

    const MouseEventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
    class Log {
        constructor(options) {
            this.data = Object.assign(this.initDef(), options);
            this.installLog();
        }
        initDef() {
            window.history['pushState'] = createHistoryEvent('pushState');
            window.history['replaceState'] = createHistoryEvent('replaceState');
            // this.version = LogConfig.version
            return {
                sdkVersion: LogConfig.version,
                historyLog: false,
                hashLog: false,
                domLog: false,
                jsError: false
            };
        }
        setUserId(uuid) {
            this.data.uuid = uuid;
        }
        setExtra(extra) {
            this.data.extra = extra;
        }
        sendLog(data) {
            this.reportLog(data);
        }
        targetKeyReport() {
            MouseEventList.forEach(ev => {
                window.addEventListener(ev, (e) => {
                    const target = e.target;
                    const targetKey = target.getAttribute('target-key');
                    if (targetKey) {
                        this.reportLog({
                            event: ev,
                            targetKey
                        });
                    }
                });
            });
        }
        captureEvents(mouseEventList, targetKey, data) {
            mouseEventList.forEach(event => {
                window.addEventListener(event, () => {
                    this.reportLog({
                        event,
                        targetKey,
                        data
                    });
                });
            });
        }
        installLog() {
            if (this.data.historyLog) {
                this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv');
            }
            if (this.data.hashLog) {
                this.captureEvents(['hashChange'], 'hash-pv');
            }
            if (this.data.domLog) {
                this.targetKeyReport();
            }
            if (this.data.jsError) {
                this.jsError();
            }
        }
        jsError() {
            this.errorEvent();
            this.promiseReject();
        }
        errorEvent() {
            window.addEventListener('error', (event) => {
                // TODO:区分错误类型
                this.sendLog({
                    event: 'error',
                    targetKey: "message",
                    message: event.message
                });
            }, true);
        }
        promiseReject() {
            window.addEventListener('unhandledrejection', (event) => {
                event.promise.catch(error => {
                    this.sendLog({
                        event: 'promise',
                        targetKey: "message",
                        message: error
                    });
                });
            });
        }
        reportLog(data) {
            const params = Object.assign(this.data, data, { time: new Date() });
            let headers = {
                type: 'application/x-www-form-urlencoded'
            };
            let blob = new Blob([JSON.stringify(params)], headers);
            navigator.sendBeacon(this.data.requestUrl, blob);
        }
    }

    return Log;

}));
