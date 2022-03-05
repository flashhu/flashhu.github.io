var BASE_DEVICE_WIDTH = 750;
var isIOS = navigator.userAgent.match("iPhone");
var deviceWidth = window.screen.width || 375;
var deviceDPR = window.devicePixelRatio || 2;
var checkDeviceWidth =
  window.__checkDeviceWidth__ ||
  function () {
    var newDeviceWidth = window.screen.width || 375;
    var newDeviceDPR = window.devicePixelRatio || 2;
    var newDeviceHeight = window.screen.height || 375;
    if (
      window.screen.orientation &&
      /^landscape/.test(window.screen.orientation.type || "")
    )
      newDeviceWidth = newDeviceHeight;
    if (newDeviceWidth !== deviceWidth || newDeviceDPR !== deviceDPR) {
      deviceWidth = newDeviceWidth;
      deviceDPR = newDeviceDPR;
    }
  };
checkDeviceWidth();
var eps = 1e-4;
var transformRPX =
  window.__transformRpx__ ||
  function (number, newDeviceWidth) {
    if (number === 0) return 0;
    number = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth);
    number = Math.floor(number + eps);
    if (number === 0) {
      if (deviceDPR === 1 || !isIOS) {
        return 1;
      } else {
        return 0.5;
      }
    }
    return number;
  };
window.__rpxRecalculatingFuncs__ = window.__rpxRecalculatingFuncs__ || [];
var __COMMON_STYLESHEETS__ = __COMMON_STYLESHEETS__ || {} % s;
var setCssToHead = function (file, _xcInvalid, info) {
  var Ca = {};
  var css_id;
  var info = info || {};
  var _C = __COMMON_STYLESHEETS__;
  function makeup(file, opt) {
    var _n = typeof file === "string";
    if (_n && Ca.hasOwnProperty(file)) return "";
    if (_n) Ca[file] = 1;
    var ex = _n ? _C[file] : file;
    var res = "";
    for (var i = ex.length - 1; i >= 0; i--) {
      var content = ex[i];
      if (typeof content === "object") {
        var op = content[0];
        if (op == 0)
          res = transformRPX(content[1], opt.deviceWidth) + "px" + res;
        else if (op == 1) res = opt.suffix + res;
        else if (op == 2) res = makeup(content[1], opt) + res;
      } else res = content + res;
    }
    return res;
  }
  var styleSheetManager = window.__styleSheetManager2__;
  var rewritor = function (suffix, opt, style) {
    opt = opt || {};
    suffix = suffix || "";
    opt.suffix = suffix;
    if (opt.allowIllegalSelector != undefined && _xcInvalid != undefined) {
      if (opt.allowIllegalSelector) console.warn("For developer:" + _xcInvalid);
      else {
        console.error(_xcInvalid);
      }
    }
    Ca = {};
    css = makeup(file, opt);
    if (styleSheetManager) {
      var key = (info.path || Math.random()) + ":" + suffix;
      if (!style) {
        styleSheetManager.addItem(key, info.path);
        window.__rpxRecalculatingFuncs__.push(function (size) {
          opt.deviceWidth = size.width;
          rewritor(suffix, opt, true);
        });
      }
      styleSheetManager.setCss(key, css);
      return;
    }
    if (!style) {
      var head = document.head || document.getElementsByTagName("head")[0];
      style = document.createElement("style");
      style.type = "text/css";
      style.setAttribute("wxss:path", info.path);
      head.appendChild(style);
      window.__rpxRecalculatingFuncs__.push(function (size) {
        opt.deviceWidth = size.width;
        rewritor(suffix, opt, style);
      });
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      if (style.childNodes.length == 0)
        style.appendChild(document.createTextNode(css));
      else style.childNodes[0].nodeValue = css;
    }
  };
  return rewritor;
};
setCssToHead([
  "body { padding-top: ",
  [0, 54],
  "; background-color: #f6f6f6; padding-bottom: ",
  [0, 60],
  "; }\n.",
  [1],
  "title { font-family: PingFang SC; font-weight: 500; color: #000000; font-size: ",
  [0, 44],
  "; margin-bottom: ",
  [0, 40],
  "; }\n.",
  [1],
  "top_tip { font-size: ",
  [0, 28],
  "; font-family: PingFang SC; font-weight: 400; color: #888888; margin-bottom: ",
  [0, 28],
  "; }\n.",
  [1],
  "power { margin-top: ",
  [0, 30],
  "; border-radius: 5px; background-color: white; width: 93%; padding-bottom: ",
  [0, 1],
  "; }\n.",
  [1],
  "power_info { display: flex; padding: ",
  [0, 30],
  " ",
  [0, 25],
  "; align-items: center; justify-content: space-between; }\n.",
  [1],
  "power_info_more { width: ",
  [0, 30],
  "; height: ",
  [0, 30],
  "; transform: rotate(90deg); }\n.",
  [1],
  "power_info_less { width: ",
  [0, 30],
  "; height: ",
  [0, 30],
  "; transform: rotate(270deg); }\n.",
  [1],
  "power_info_text { display: flex; flex-direction: column; }\n.",
  [1],
  "power_info_text_title { margin-bottom: ",
  [0, 10],
  "; font-weight: 400; font-size: ",
  [0, 35],
  "; }\n.",
  [1],
  "power_info_text_tip { color: rgba(0, 0, 0, 0.4); font-size: ",
  [0, 25],
  "; }\n.",
  [1],
  "power_item { padding: ",
  [0, 30],
  " ",
  [0, 25],
  "; display: flex; justify-content: space-between; }\n.",
  [1],
  "power_item_title { font-size: ",
  [0, 30],
  "; }\n.",
  [1],
  "power_item_icon { width: ",
  [0, 30],
  "; height: ",
  [0, 30],
  "; }\n.",
  [1],
  "line { width: 95%; margin: 0 auto; height: ",
  [0, 2],
  "; background-color: rgba(0, 0, 0, 0.1); }\n.",
  [1],
  "environment { color: rgba(0, 0, 0, 0.4); font-size: ",
  [0, 24],
  "; margin-top: 25%; }\n",
])(typeof __wxAppSuffixCode__ == "undefined" ? undefined : __wxAppSuffixCode__);
