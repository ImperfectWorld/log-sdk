/**
 * @requestUrl 接口地址
 * @historyLog history上报
 * @hashLog hash上报
 * @domLog 携带Tracker-key 点击事件上报
 * @sdkVersion sdkVersion sdk版本
 * @extra extra 透传字段
 * @jsError js 和 promise 报错异常上报
 */
interface DefaultOptons {
    uuid: string | undefined;
    requestUrl: string | undefined;
    historyLog: boolean;
    hashLog: boolean;
    domLog: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Options extends Partial<DefaultOptons> {
    requestUrl: string;
}

declare class Log {
    data: Options;
    private version;
    constructor(options: Options);
    private initDef;
    setUserId<T extends DefaultOptons['uuid']>(uuid: T): void;
    setExtra<T extends DefaultOptons['extra']>(extra: T): void;
    sendLog<T>(data: T): void;
    private targetKeyReport;
    private captureEvents;
    private installLog;
    private jsError;
    private errorEvent;
    private promiseReject;
    private reportLog;
}

export { Log as default };
