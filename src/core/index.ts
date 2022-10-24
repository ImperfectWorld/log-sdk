import { DefaultOptons, LogConfig, Options } from "../types/index";
import { createHistoryEvent } from "../utils/pv";

const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']

export default class Log { 
    public data: Options;
    private version: string | undefined;

    constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options);
        this.installLog()
    }
    
    private initDef(): DefaultOptons { 
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        // this.version = LogConfig.version
        return <DefaultOptons>{
            sdkVersion: LogConfig.version,
            historyLog: false,
            hashLog: false,
            domLog: false,
            jsError: false
        }
    }

    public setUserId<T extends DefaultOptons['uuid']>(uuid: T) {
        this.data.uuid = uuid
    }

    public setExtra<T extends DefaultOptons['extra']>(extra: T) {
        this.data.extra = extra
    }

    public sendLog<T>(data: T) { 
        this.reportLog(data)
    }

    private targetKeyReport() { 
        MouseEventList.forEach(ev => { 
            window.addEventListener(ev, (e) => { 
                const target = e.target as HTMLElement;
                const targetKey = target.getAttribute('target-key')
                if (targetKey) { 
                    this.reportLog({
                        event: ev,
                        targetKey
                    })
                }
            })
        })
    }

    private captureEvents<T>(mouseEventList: string[], targetKey: string, data?: T) { 
        mouseEventList.forEach(event => { 
            window.addEventListener(event, () => { 
                this.reportLog({
                    event,
                    targetKey,
                    data
                })
            })
        })
    }

    private installLog() {
        if (this.data.historyLog) {
            this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv')
        }
        if (this.data.hashLog) {
            this.captureEvents(['hashChange'], 'hash-pv')
        }
        if (this.data.domLog) { 
            this.targetKeyReport()
        }
        if (this.data.jsError) {
            this.jsError()
        }
    }

    private jsError() { 
        this.errorEvent()
        this.promiseReject()
    }

    private errorEvent() { 
        window.addEventListener('error', (event) => { 
            // TODO:区分错误类型
            this.sendLog({
                event: 'error',
                targetKey: "message",
                message: event.message
            })
        }, true)
    }

    private promiseReject() { 
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => { 
                this.sendLog({
                    event: 'promise',
                    targetKey: "message",
                    message: error
                })
            })
        })
    }

    private reportLog<T>(data: T) { 
        const params = Object.assign(this.data, data, { time: new Date() })
        let headers = {
            type: 'application/x-www-form-urlencoded'
        }
        let blob = new Blob([JSON.stringify(params)], headers)
        navigator.sendBeacon(this.data.requestUrl, blob)
    }
}
