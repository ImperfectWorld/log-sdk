/**
 * @requestUrl 接口地址
 * @historyLog history上报
 * @hashLog hash上报
 * @domLog 携带Tracker-key 点击事件上报
 * @sdkVersion sdkVersion sdk版本
 * @extra extra 透传字段
 * @jsError js 和 promise 报错异常上报
 */
export interface DefaultOptons {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyLog: boolean,
    hashLog: boolean,
    domLog: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError: boolean
}

// Partial给其他字段添加?非必传
export interface Options extends Partial<DefaultOptons> {
    requestUrl: string,
}


export enum LogConfig {
    version = '1.0.0'
}

export type reportLogrData = {
    [key: string]: any,
    event: string,
    targetKey: string
}