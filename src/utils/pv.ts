// history 无法通过 popstate 监听 pushState replaceState  只能重写其函数dispatchEvent一个事件
export const createHistoryEvent = <T extends keyof History>(type: T) => { 
    const origin = history[type]

    return function (this: any) { 
        const res = origin.apply(this, arguments)

        const e = new Event(type)

        window.dispatchEvent(e)

        return res
    }
}

