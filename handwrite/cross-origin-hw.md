> 才不要背背佳

## 一、JSONP

### 1. 详细版

[webmodules / jsonp](https://github.com/webmodules/jsonp)

实现结果形如，`jsonp(url, opts, fn)` ，其中 `opts` 包含 `param`，`timeout`, `name`, `prefix`

`fn` 回调函数的第一个参数为 `err`，第二个参数为 `data`

**注意清空操作**

```javascript
/**
 * 回调计数，用于生成唯一的名称
 */

let count = 0;

/**
 * Noop function. 置为空函数
 */

function noop() { }

/**
 * JSONP handler
 *
 * Options:
 *  - param {Object} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`) 前缀用于未自定义名称时，自动生成不重复名称
 *  - name {String} qs parameter (`prefix` + incr) 自定义回调名称
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */
function jsonp(url, opts, fn) {
    // 1. 处理缺省值情况
    if ('function' === typeof opts) {
        fn = opts;
        opts = {};
    }
    if (!opts) opts = {};

    // 2. 设置参数值
    let prefix = opts.prefix || '__jp';
    let name = opts.name || (prefix + (count++));
    let params = { ...opts.param, callback: encodeURIComponent(name) };
    let timeout = typeof (opts.timeout) === 'number' && opts.timeout !== 0 ? opts.timeout : 60000;
    let target = document.getElementsByTagName('script')[0] || document.head;
    let script;
    let timer;

    if (timeout) {
        // 3. 如有 timeout 则设置定时器，到时间清空属性抛出错误
        timer = setTimeout(function () {
            cleanup();
            if (fn) fn(new Error('Timeout'));
        }, timeout);
    }

    function cleanup() {
        // 【清空操作】 清空 window 全局变量上对应的属性值；清除定时器；
        if (script.parentNode) script.parentNode.removeChild(script);
        window[name] = noop();
        if (timer) clearTimeout(timer);
    }

    function cancel() {
        // 【取消操作】 找到此时 JSONP 对应的全局变量属性，如还有值，表示此时未结束操作，故需要清空
        if (window[name]) {
            cleanup();
        }
    }

    // 4. 将回调函数置为全局变量上的属性
    // 如接口数据返回时，即为`name(data)`，会去全局上找声明
    window[name] = function (data) {
        // 4.1 此时成功取到值，故发起清除操作
        cleanup();
        // 4.2 返回数据
        if (fn) fn(null, data);
    };

    // 5. 处理得出 src 的属性值
    let arrs = []
    for (let key in params) {
        arrs.push(`${key}=${params[key]}`)
    }

    // 6. 插入对应的 script 标签，插入位置要尽可能前面
    script = document.createElement('script');
    script.src = `${url}?${arrs.join('&')}`;
    target.parentNode.insertBefore(script, target);

    // 7. 暴露取消请求的方法
    return cancel;
}

```

### 2. 简化版

```javascript
function jsonp(url, params, name) {
    return new Promise((resolve, reject) => {
        // 0. 处理缺省值
        name = name || 'time' + new Date().valueOf();
        // 1. 处理得出 src 的属性值
        params = { ...params, callback: encodeURIComponent(name) }
        let arrs = []
        for (let key in params) {
            arrs.push(`${key}=${params[key]}`)
        }
        // 2. 创建 script 节点
        let script = document.createElement('script')
        // 3. 将回调函数置为全局变量上的属性
        // 如接口数据返回时，即为`name(data)`，会去全局上找声明
        window[name] = function (data) {
            resolve(data)
            document.body.removeChild(script)
        }
        // 4. 设置属性值后，添加节点
        script.src = `${url}?${arrs.join('&')}`
        document.body.appendChild(script)
    })
}
```


