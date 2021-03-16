> 才不要背背佳

## 一、JSONP

### 1. 简化版

[九种跨域方式实现原理（完整版）](https://juejin.cn/post/6844903767226351623#heading-9)

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

### 2. 详细版

[webmodules / jsonp - GitHub](https://github.com/webmodules/jsonp)

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

 

## 二、CORS

### 1. 简化版



### 2. 详细版

[expressjs / cors - GitHub](https://github.com/expressjs/cors)

```javascript
(function () {

  'use strict';

  var assign = require('object-assign');
  var vary = require('vary');

  var defaults = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

  function isString(s) {
    return typeof s === 'string' || s instanceof String;
  }

  function isOriginAllowed(origin, allowedOrigin) {
    if (Array.isArray(allowedOrigin)) {
      for (var i = 0; i < allowedOrigin.length; ++i) {
        if (isOriginAllowed(origin, allowedOrigin[i])) {
          return true;
        }
      }
      return false;
    } else if (isString(allowedOrigin)) {
      return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    } else {
      return !!allowedOrigin;
    }
  }

  function configureOrigin(options, req) {
    var requestOrigin = req.headers.origin,
      headers = [],
      isAllowed;

    if (!options.origin || options.origin === '*') {
      // allow any origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: '*'
      }]);
    } else if (isString(options.origin)) {
      // fixed origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: options.origin
      }]);
      headers.push([{
        key: 'Vary',
        value: 'Origin'
      }]);
    } else {
      isAllowed = isOriginAllowed(requestOrigin, options.origin);
      // reflect origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: isAllowed ? requestOrigin : false
      }]);
      headers.push([{
        key: 'Vary',
        value: 'Origin'
      }]);
    }

    return headers;
  }

  function configureMethods(options) {
    var methods = options.methods;
    if (methods.join) {
      methods = options.methods.join(','); // .methods is an array, so turn it into a string
    }
    return {
      key: 'Access-Control-Allow-Methods',
      value: methods
    };
  }

  function configureCredentials(options) {
    if (options.credentials === true) {
      return {
        key: 'Access-Control-Allow-Credentials',
        value: 'true'
      };
    }
    return null;
  }

  function configureAllowedHeaders(options, req) {
    var allowedHeaders = options.allowedHeaders || options.headers;
    var headers = [];

    if (!allowedHeaders) {
      allowedHeaders = req.headers['access-control-request-headers']; // .headers wasn't specified, so reflect the request headers
      headers.push([{
        key: 'Vary',
        value: 'Access-Control-Request-Headers'
      }]);
    } else if (allowedHeaders.join) {
      allowedHeaders = allowedHeaders.join(','); // .headers is an array, so turn it into a string
    }
    if (allowedHeaders && allowedHeaders.length) {
      headers.push([{
        key: 'Access-Control-Allow-Headers',
        value: allowedHeaders
      }]);
    }

    return headers;
  }

  function configureExposedHeaders(options) {
    var headers = options.exposedHeaders;
    if (!headers) {
      return null;
    } else if (headers.join) {
      headers = headers.join(','); // .headers is an array, so turn it into a string
    }
    if (headers && headers.length) {
      return {
        key: 'Access-Control-Expose-Headers',
        value: headers
      };
    }
    return null;
  }

  function configureMaxAge(options) {
    var maxAge = (typeof options.maxAge === 'number' || options.maxAge) && options.maxAge.toString()
    if (maxAge && maxAge.length) {
      return {
        key: 'Access-Control-Max-Age',
        value: maxAge
      };
    }
    return null;
  }

  function applyHeaders(headers, res) {
    for (var i = 0, n = headers.length; i < n; i++) {
      var header = headers[i];
      if (header) {
        if (Array.isArray(header)) {
          applyHeaders(header, res);
        } else if (header.key === 'Vary' && header.value) {
          vary(res, header.value);
        } else if (header.value) {
          res.setHeader(header.key, header.value);
        }
      }
    }
  }

  // 通常使用的入口函数
  function cors(options, req, res, next) {
    var headers = [],
      method = req.method && req.method.toUpperCase && req.method.toUpperCase();

    if (method === 'OPTIONS') {
      // preflight
      headers.push(configureOrigin(options, req));
      headers.push(configureCredentials(options, req));
      headers.push(configureMethods(options, req));
      headers.push(configureAllowedHeaders(options, req));
      headers.push(configureMaxAge(options, req));
      headers.push(configureExposedHeaders(options, req));
      applyHeaders(headers, res);

      if (options.preflightContinue) {
        next();
      } else {
        // Safari (and potentially other browsers) need content-length 0,
        //   for 204 or they just hang waiting for a body
        res.statusCode = options.optionsSuccessStatus;
        res.setHeader('Content-Length', '0');
        res.end();
      }
    } else {
      // actual response
      headers.push(configureOrigin(options, req));
      headers.push(configureCredentials(options, req));
      headers.push(configureExposedHeaders(options, req));
      applyHeaders(headers, res);
      next();
    }
  }

  function middlewareWrapper(o) {
    // if options are static (either via defaults or custom options passed in), wrap in a function
    var optionsCallback = null;
    if (typeof o === 'function') {
      optionsCallback = o;
    } else {
      optionsCallback = function (req, cb) {
        cb(null, o);
      };
    }

    return function corsMiddleware(req, res, next) {
      optionsCallback(req, function (err, options) {
        if (err) {
          next(err);
        } else {
          var corsOptions = assign({}, defaults, options);
          var originCallback = null;
          if (corsOptions.origin && typeof corsOptions.origin === 'function') {
            originCallback = corsOptions.origin;
          } else if (corsOptions.origin) {
            originCallback = function (origin, cb) {
              cb(null, corsOptions.origin);
            };
          }

          if (originCallback) {
            originCallback(req.headers.origin, function (err2, origin) {
              if (err2 || !origin) {
                next(err2);
              } else {
                corsOptions.origin = origin;
                cors(corsOptions, req, res, next);
              }
            });
          } else {
            next();
          }
        }
      });
    };
  }

  // can pass either an options hash, an options delegate, or nothing
  module.exports = middlewareWrapper;

}());
```

