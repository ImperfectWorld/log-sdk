# log-sdk

前端埋点 sdk，适用于 pv/uv/dom 操作/错误监控

# Installation

### NPM

```
npm i log-sdk-beacon
```

The npm package has a module field pointing to an ES module variant of the library, mainly to provide support for ES module aware bundlers, whereas its browser field points to an UMD module for full backward compatibility.

### Browser

```
<script src="./dist/index.js"></script>

```

# Basic Usage

```
import log from 'log-sdk-beacon'

new log({
    requestUrl: 'http://localhost:3000/log',
    historyLog: true,
    domLog: true,
    jsError: true,
});
```

### Params

-   requestUrl 接口地址
-   historyLog history 上报
-   hashLog hash 上报
-   domLog 携带 Tracker-key 点击事件上报
-   sdkVersion sdk 版本
-   extra 透传字段
-   jsError js 和 promise 报错异常上报
