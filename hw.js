// 0419 —— [getType]
console.log('------------ getType! ------------')
function getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

console.log(getType(null), getType(undefined), getType('123'), getType(123), getType(true), getType({}))

// 0419 —— [new]
console.log('------------ new! ------------')
function myNew(constructor, ...args) {
    if(typeof constructor !== 'function') {
        throw new TypeError(`${constructor} is not a function`);
    }
    const obj = Object.create(constructor.prototype || Object.prototype);
    const res = constructor.apply(obj, args);
    return (res && (typeof res === 'function' || typeof res === 'object')) ? res: obj;
}

function Test(params) {
    this.x = 1;
    return params;
}

Test.prototype = null;

console.log(new Test().__proto__, myNew(Test).__proto__)
console.log(new Test(null), myNew(Test, null))
console.log(new Test('123'), myNew(Test, '123'))
console.log(new Test({ b: 1 }), myNew(Test, { b: 1 }))
console.log(new Test(function q() { }), myNew(Test, function q() { }))
// console.log(new 'test', myNew('test'))

// 0419 —— [object.create]
console.log('------------ Object.create! ------------')
Object.defineProperty(Object, 'myCreate', {
    value: function (proto, protoProperties) {
        if(typeof proto !== 'function' && typeof proto !== 'object') {
            throw new TypeError(`Prototype may only be an Object or null: ${proto}`);
        }
        function F() {};
        F.prototype = proto;
        const obj = new F();
        if(proto === null) {
            Object.setPrototypeOf(obj, null);
        }
        if(protoProperties) {
            Object.defineProperties(obj, protoProperties);
        }
        return obj;
    },
    writable: true,
    configurable: true
})

let t = { a: 1, b: 2 }
console.log(Object.create(null), Object.myCreate(null))
console.log(Object.create(function () { }), Object.myCreate(function () { }))
console.log(Object.create(() => { }), Object.myCreate(() => { }))
console.log(Object.create(t, {
    'c': {
        value: 3,
        writable: true
    }
}), Object.myCreate(t, {
    'c': {
        value: 3,
        writable: true
    }
}))

// 0419 —— instanceof
console.log('------------ instanceof! ------------')
function myInstanceof(left, right) {
    if(left === null || (typeof left !== 'function' && typeof left !== 'object')) {
        return false;
    }
    let leftProto = Object.getPrototypeOf(left);
    const rightProto = right.prototype;
    while(leftProto !== rightProto) {
        if(leftProto === null) return false;
        leftProto = Object.getPrototypeOf(leftProto);
    }
    return true;
}

console.log(Function instanceof Object, myInstanceof(Function, Object));
console.log('aa' instanceof Object, myInstanceof('aa', Object));
console.log(null instanceof Object, myInstanceof(null, Object));

// 0419 —— call
console.log('------------ call! ------------')
Object.defineProperty(Function.prototype, 'call3', {
    value: function (context) {
        context = Object(context) || window;
        var key = 'myCallFn';
        context[key] = this;
        var args = [];
        for(var i = 1;i < arguments.length;i ++) {
            args.push('arguments[' + i + ']');
        }
        var res = eval('context[key](' + args + ')');
        delete context[key];
        return res;
    },
    writable: true,
    configurable: true
})

Object.defineProperty(Function.prototype, 'call6', {
    value: function (context, ...args) {
        context = Object(context) || window;
        const key = Symbol();
        context[key] = this;
        const res = context[key](...args);
        delete context[key];
        return res;
    },
    writable: true,
    configurable: true
})

var obj = {
    name: "objName"
};

function consoleInfo(sex, height) {
    console.log(this.name, sex, height);
}
var name = "globalName";
consoleInfo.call(obj, 'man', '180'); 
consoleInfo.call6(obj, 'man', '180');
consoleInfo.call3(obj, 'man', '180');

// 0419 —— apply
console.log('------------ apply! ------------')
Object.defineProperty(Function.prototype, 'apply3', {
    value: function (context, args) {
        context = Object(context) || window;
        var key = 'myApplyFn';
        context[key] = this;
        var res = null;
        if(!args || args.length === 0) {
            res = context[key]();
        } else {
            var arr = [];
            for(var i = 0;i < args.length;i ++) {
                arr.push('args[' + i + ']');
            }
            res = eval('context[key](' + arr + ')');
        }
        delete context[key];
        return res;
    },
    writable: true,
    configurable: true
})

Object.defineProperty(Function.prototype, 'apply6', {
    value: function (context, args = []) {
        context = Object(context) || window;
        const key = Symbol();
        context[key] = this;
        const res = context[key](...args);
        delete context[key];
        return res;
    }, 
    writable: true,
    configurable: true
})

var obj = {
    name: "objName"
};

function consoleInfo(sex, height) {
    console.log(this.name, sex, height);
}
var name = "globalName";
consoleInfo.apply(obj, ['man', '180']);
consoleInfo.apply3(obj, ['man', '180']);
consoleInfo.apply6(obj, ['man', '180']);

// 0419 —— bind
console.log('------------ bind! ------------')
Object.defineProperty(Function.prototype, 'myBind', {
    value: function (context, ...args) {
        const self = this;
        const fBound = function(...bindArgs) {
            return self.apply(this instanceof fBound ? this: context, args.concat(bindArgs));
        }
        fBound.prototype = Object.create(self.prototype);
        return fBound;
    },
    writable: true,
    configurable: true
})

var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';


var bindFoo1 = bar.bind(foo, 'daisy');
console.log(new bindFoo1('18'), bindFoo1('18'));

console.log('-------- diff --------')

var bindFoo2 = bar.myBind(foo, 'daisy');
console.log(new bindFoo2('18'), bindFoo2('18'));

// 0417 —— [继承]
// console.log('------------ 继承! ------------')
// function Parent(name) {
//     this.name = name;
//     this.colors = ['red', 'blue', 'green'];
// }

// Parent.prototype.getName = function () {
//     console.log(this.name)
// }

// function Child(name, age) {
//     Parent.call(this, name);
//     this.age = age;

// }

// Child.prototype = Object.create(Parent.prototype);
// Child.prototype.constructor = Child;

// var child1 = new Child('kevin', '18');
// var child2 = new Child('daisy', '20');

// child1.colors.push('black');

// console.log(child1.name);
// console.log(child1.age);
// console.log(child1.colors);


// console.log(child2.name);
// console.log(child2.age);
// console.log(child2.colors);

// 0419 —— [数组去重]
console.log('------------ 数组去重! ------------')
// set
function uniqueArray1 (target) {
    return [... new Set(target)];
}

// reduce
function uniqueArray2 (target) {
    return target.reduce((res, curr) => res.indexOf(curr) === -1 ? [...res, curr]: res, []);
}

// filter
function uniqueArray3 (target) {
    return target.filter((curr, index, arr) => arr.indexOf(curr) === index);
}

// map
function uniqueArray4 (target) {
    const dic = new Map();
    let res = [];
    for(let t of target) {
        if(!dic.has(t)) {
            res.push(t);
            dic.set(t, true);
        }
    }
    return res;
}

// map + obj
function uniquArray5 (target, key) {
    const dic = new Map();
    return target.reduce((res, curr) => {
        if(dic.has(curr[key])) {
            return res;
        } else {
            dic.set(curr[key], true);
            return [...res, curr];
        }
    }, []);
}

let oldValue = [1, 2, 2, 3, 4, 6, 6, 3, 4];
let oldValue2 = [{ id: 1, value: 'a' }, { id: 1, value: 'b' }, { id: 3, value: 'c' }, { id: 2, value: 'b' }]
console.log(uniqueArray1(oldValue), uniqueArray2(oldValue), uniqueArray3(oldValue), uniqueArray4(oldValue));
console.log(uniquArray5(oldValue2, 'id'));

// 0419 —— [数组扁平化]
console.log('------------ 数组扁平化! ------------')
function flatDeep(arr, d = 1) {
    if(d > 0) {
        return arr.reduce((res, curr) => {
            return res.concat(Array.isArray(curr) ? flatDeep(curr, d - 1): curr);
        }, []);
    } else {
        return arr;
    }
}

value = [1, [2, [3, ,[4]], 5], 6]
console.log(value.flat(0), flatDeep(value, 0))
console.log(value.flat(), flatDeep(value))
console.log(value.flat(3), flatDeep(value, 3))

// 0427 —— [reduce]
console.log('------------ reduce! ------------')
Object.defineProperty(Array.prototype, 'myReduce', {
    value: function (callback) {
        if(this == null) {
            throw new TypeError(`Array.prototype.reduce called on null or undefined`);
        }
        if(typeof callback !== 'function') {
            throw new TypeError(`${callback} is not a function`);
        }
        const obj = Object(this);
        const len = obj.length >>> 0;
        let accumulator = null, currIndex = 0;
        if(arguments.length >= 0) {
            accumulator = arguments[1];
        } else {
            while (currIndex < len && !(currIndex in obj)) {
                currIndex ++;
            }
            accumulator = obj[currIndex ++];
        }
        while(currIndex < len) {
            if(currIndex in obj) {
                accumulator = callback(accumulator, obj[currIndex], currIndex, obj);
            }
            currIndex++;
        }
        return accumulator;
    },
    writable: true,
    configurable: true
})

var total1 = [0, 1, 2, 3].reduce(
    (acc, cur) => acc + cur,
    0
);
var total2 = [0, 1, 2, 3].myReduce(
    (acc, cur) => acc + cur,
    0
);
console.log(total1, total2)

// 0427 —— [forEach]
console.log('------------ forEach! ------------')
Object.defineProperty(Array.prototype, 'myForEach', {
    value: function (callback, thisArgs) {
        if(this == null) {
            throw new TypeError(`this is null or undefined`);
        }
        if(typeof callback !== 'function') {
            throw new TypeError(`${callback} is not a function`);
        }
        const obj = Object(this);
        const len = obj.length;
        const context = thisArgs ? thisArgs: this;
        let currIndex = 0;
        while (currIndex < len) {
            if(currIndex in obj) {
                callback.call(context, obj[currIndex], currIndex, obj);
            }
            currIndex ++;
        }
    },
    writable: true,
    configurable: true
})

var words1 = ['one', 'two', 'three', 'four'];
words1.forEach(function (word) {
    console.log(word);
    if (word === 'two') {
        words1.shift();
    }
});

var words2 = ['one', 'two', 'three', 'four'];
words2.myForEach(function (word) {
    console.log(word);
    if (word === 'two') {
        words2.shift();
    }
});

// 0427 —— [map]
console.log('------------ map! ------------')
Object.defineProperty(Array.prototype, 'myMap', {
    value: function (callback, thisArgs) {
        if(this == null) {
            throw new TypeError('this is null or undefined');
        }
        if(typeof callback !== 'function') {
            throw new TypeError(`${callback} is not a function`);
        }
        const obj = Object(this);
        const len = obj.length >>> 0;
        const context = thisArgs ? thisArgs: this;
        let currIndex = 0;
        let res = [];
        while (currIndex < len) {
            if(currIndex in obj) {
                res.push(callback.call(context, obj[currIndex], currIndex, obj));
            }
            currIndex ++;
        }
        return res;
    },
    writable: true,
    configurable: true
})

var numbers1 = [1, 4, 9];
var doubles1 = numbers1.map(function (num) {
    return num * 2;
});

var numbers2 = [1, 4, 9];
var doubles2 = numbers2.map(function (num) {
    return num * 2;
});

console.log(doubles1, doubles2);

// 0427 —— [filter]
console.log('------------ filter! ------------')
Object.defineProperty(Array.prototype, 'myFilter', {
    value: function (callback, thisArgs) {
        if(this == null) {
            throw new TypeError('this is null or undefined');
        }
        if(typeof constructor !== 'function') {
            throw new TypeError(`${constructor} is not a function`);
        }
        const obj = Object(this);
        const len = obj.length;
        const context = thisArgs ? thisArgs: this;
        let currIndex = 0;
        let res = [];
        while(currIndex < len) {
            if(currIndex in obj) {
                if (callback.call(context, obj[currIndex], currIndex, obj)) {
                    res.push(obj[currIndex]);
                }
            }
            currIndex ++;
        }
        return res;
    },
    writable: true,
    configurable: true
})

function isBigEnough(element) {
    return element >= 10;
}
var filtered1 = [12, 5, 8, 130, 44].filter(isBigEnough);
var filtered2 = [12, 5, 8, 130, 44].myFilter(isBigEnough);
console.log(filtered1, filtered2)

// 0419 —— [柯里化]
console.log('------------ 函数柯里化! ------------')
function curry(func) {
    return function curried(...args1) {
        if (args1.length === func.length) {
            return func.apply(this, args1);
        } else {
            return function (...args2) {
                return curried.call(this, ...args1, ...args2);
            }
        }
    }
}

function add1(x, y, z) {
    return x + y + z;
}

const add3 = curry(add1);
console.log(add3(1)(2)(1));
console.log(add3(1)(1, 2));

// 0419 —— [偏函数]
console.log('------------ 偏函数! ------------')
function partial(func, ...args1) {
    return function (...args2) {
        return func.call(this, ...args1, ...args2);
    }
}

const add2 = partial(add1, 1);
const add4 = partial(add1, 1, 2);
console.log(add2(3, 5));
console.log(add4(4));

// 0419 —— [add(1)(2)(3)]
console.log('------------ add(1)(2)(3)! ------------')
function add() {
    let _args = [...arguments];

    const fn = function () {
        _args.push(...arguments);
        return fn;
    }

    fn.valueOf = function() {
        return _args.reduce((res, curr) => res + curr);
    }

    return fn;
}

console.log(add(1)(2)(3))
console.log(+add(1)(2)(3))
console.log(+add(1)(2, 3))
console.log(+add(1, 2)(3))

// 0427 —— [Object.is]
console.log('------------ Object.is! ------------')
Object.defineProperty(Object, 'myIs', {
    value: function (x, y) {
        if(x === y) {
            // +0 -0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            return x !== x && y !== y;
        }
    },
    writable: true,
    configurable: true
})

console.log(Object.is(+0, -0));
console.log(Object.is(NaN, NaN));
console.log(Object.is('aaa', 'aaa'));
console.log(Object.is(123, 456));

// 0419 —— [防抖/节流]
// codepen：https://codepen.io/flashhu/pen/dyNKErG

// 0419 —— [浅拷贝]
console.log('------------ 浅拷贝! ------------')
function shallowClone3(target) {
    if (target === null || (typeof target !== 'object' && typeof target !== 'function')) return;
    const res = Array.isArray(target) ? []: {};
    for(var key in target) {
        if(Object.hasOwnProperty.call(target, key)) {
            res[key] = target[key];
        }
    }
    return res;
}

function shallowClone5(target) {
    if(target === null || (typeof target !== 'object' && typeof target !== 'function')) return ;
    const res = Array.isArray(target)? []: {};
    Object.keys(target).map(k => {
        res[k] = target[k];
    })
    return res;
}

let obj1 = {
    a: 1, 
    b: []
}

let arr1 = [[1]]

let obj2 = shallowClone3(obj1);
obj2.b.push(1);
let obj3 = shallowClone5(obj1);
obj3.b.push(2);
// let obj4 = Object.assign({}, obj1);
// obj4.b.push(5);
// let obj5 = {...obj1};
// obj5.b.push(6);
console.log(obj2, obj3);
// let arr2 = arr1.concat();
// arr2[0].push(3);
// let arr3 = arr1.slice();
// arr3[0].push(4);
// let arr4 = [...arr1];
// arr4[0].push(5);
// console.log(arr2, arr3);

// 0417 - [Object.assign]
console.log('------------ Object.assign(浅拷贝)! ------------')
Object.defineProperty(Object, 'myAssign', {
    value: function (target) {
        if(target == null) {
            throw new TypeError('Cannot convert null or undefined to Object');
        }
        let res = Object(target);
        for(let i = 1;i < arguments.length;i ++) {
            const currObj = arguments[i];
            for(let key in currObj) {
                if(Object.hasOwnProperty.call(currObj, key)) {
                    res[key] = currObj[key];
                }
            }
        }
        return res;
    },
    writable: true,
    configurable: true
})

obj1 = { a: { c: 1 } }

obj2 = Object.assign({}, obj1, { b: 3 });
obj1.a.c = 3;
console.log(obj1.a === obj2.a);
obj3 = Object.myAssign({}, obj1, { b: 3 });
obj3.a.c = 10;
console.log(obj1.a === obj3.a);

// // 0419 —— [JOSN.stringfy]
// console.log('------------ JOSN.stringfy! ------------')
// function jsonStringify(data) {
//     let dataType = typeof data;

//     if (dataType !== 'object') {
//         // 一、处理除 null 外的基础数据类型及 function
//         if (Number.isNaN(data) || data === Infinity) {
//             // 1. NaN、Infinity 序列化返回 "null"
//             return "null";
//         } else if (dataType === 'function' || dataType === 'undefined' || dataType === 'symbol') {
//             // 2. function 、undefined 、symbol 序列化返回 undefined
//             return undefined;
//         } else if (dataType === 'string') {
//             // 3. string 序列化添加引号
//             return '"' + data + '"';
//         } else if (dataType === 'bigint') {
//             // 4. bigint 抛出错误
//             throw new TypeError('Do not know how to serialize a BigInt');
//         } else {
//             // 5. boolean、其他 number 返回 String()
//             return String(data);
//         }
//     } else if (dataType === 'object') {
//         // 二、处理 null 及对象类型
//         if (data === null) {
//             // 1. null 序列化返回 “null”
//             return "null"
//         } else if (data.toJSON && typeof data.toJSON === 'function') {
//             // 2. 包含 toJSON 则序列化 toJSON 结果
//             return jsonStringify(data.toJSON());
//         } else if (data instanceof Array) {
//             let result = [];
//             // 3. 如果是数组, toJSON 方法可以存在于原型链中
//             data.forEach((item, index) => {
//                 if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'symbol') {
//                     result[index] = "null";
//                 } else {
//                     result[index] = jsonStringify(item);
//                 }
//             });
//             result = "[" + result + "]";
//             return result.replace(/'/g, '"');

//         } else {
//             // 4. 普通对象
//             /**
//              * 循环引用抛错(暂未检测，循环引用时，堆栈溢出)
//              * symbol key 忽略
//              * undefined、函数、symbol 为属性值，被忽略
//              */
//             let result = [];
//             Object.keys(data).forEach((item, index) => {
//                 if (typeof item !== 'symbol') {
//                     //key 如果是symbol对象，忽略
//                     if (data[item] !== undefined && typeof data[item] !== 'function'
//                         && typeof data[item] !== 'symbol') {
//                         //键值如果是 undefined、函数、symbol 为属性值，忽略
//                         result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
//                     }
//                 }
//             });
//             return ("{" + result + "}").replace(/'/g, '"');
//         }
//     }
// }

// console.log(null, JSON.stringify(NaN), JSON.stringify(Infinity), JSON.stringify(null))
// console.log(null, jsonStringify(NaN), jsonStringify(Infinity), jsonStringify(null))
// console.log(JSON.stringify(function() {}), JSON.stringify(undefined), JSON.stringify(Symbol()))
// console.log(jsonStringify(function () { }), jsonStringify(undefined), jsonStringify(Symbol()))
// console.log(JSON.stringify('aaaa'), JSON.stringify(11))
// console.log(jsonStringify('aaaa'), jsonStringify(11))
// console.log(JSON.stringify(/test/), JSON.stringify(new Date()))
// console.log(jsonStringify(/test/), jsonStringify(new Date()))
// console.log(JSON.stringify([undefined, function(){}, Symbol(), null, 1, '1', NaN, Infinity, null, /test/, new Date()]))
// console.log(jsonStringify([undefined, function () { }, Symbol(), null, 1, '1', NaN, Infinity, null, /test/, new Date()]))
// console.log(JSON.stringify({[Symbol()]: 1, 'a': 2, 'b': undefined, 'c': function() {}, 'd': Symbol()}))
// console.log(jsonStringify({ [Symbol()]: 1, 'a': 2, 'b': undefined, 'c': function() {}, 'd': Symbol()}))

// // 0419 —— [JOSN.parse]
// console.log('------------ JOSN.parse! ------------')
// function jsonParse1(json) {
//     return eval('(' + json + ')');
// }

// function jsonParse2(json) {
//     return (new Function('return ' + json))();
// }

// let test1 = JSON.stringify({ 'a': 2 })
// console.log(JSON.parse(test1), jsonParse1(test1), jsonParse2(test1));

// 0417 —— [发布订阅模式]
console.log('------------ 发布订阅模式! ------------')
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, listener) {
        if(typeof listener !== 'function') {
            throw new TypeError(`${listener} is not a function`);
        }
        if(!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(listener);
    }

    emit(type, ...args) {
        if (this.events[type]) {
            this.events[type].forEach(cb => cb(args));
        }
    }

    off(type, listener) {
        if (this.events[type]) {
            this.events[type].splice(this.events[type].indexOf(listener), 1);
        }
    }
}

const eventerCenter = new EventEmitter();

function listener1() {
    console.log('eat: listener1');
}

function listener2() {
    console.log('eat: listener2');
}

eventerCenter.on('eat', listener1);
eventerCenter.on('eat', listener2);
eventerCenter.emit('eat');
eventerCenter.off('eat', listener1);
eventerCenter.emit('eat');

// 0417 —— [观察者模式]
console.log('------------ 观察者模式! ------------')
class Publisher {
    constructor() {
        this.observers = [];
    }

    add(observer) {
        this.observers.push(observer);
    }

    remove(observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    notify(...args) {
        this.observers.forEach(o => {
            o.update(...args);
        })
    }
}

class Observer {
    update(...args) {
        console.log('Observer update:', args);
    }
}

var child1 = new Observer();
var child2 = new Observer();
var flower = new Publisher();
flower.add(child1);
flower.add(child2);
flower.notify('开花了');
flower.remove(child2);
flower.notify('花谢了');

// 0419 —— [解析 URL]
console.log('------------ 解析 URL! ------------')
function parseQuery(url) {
    const paramArray = /.+\?(.+)$/.exec(decodeURIComponent(url))[1].split('&');
    const params = {};
    paramArray.forEach(item => {
        if(/=/.test(item)) {
            const [key, value] = item.split('=');
            if(params[key]) {
                params[key] = [].concat(params[key], value);
            } else {
                params[key] = value;
            }
        } else {
            params[item] = true;
        }
    })
    return params;
}

let url = 'http://www.domain.com/?user=anonymous&id=123&id=456&id=789&city=%E5%8C%97%E4%BA%AC&enabled';
console.log(parseQuery(url));

// 0419 —— [对象数组转对象]
console.log('------------ 对象数组转对象! ------------')
const data = [{
    key: 'name',
    value: 'aaa'
}, {
    key: 'age',
    value: '111'
}, {
    key: 'from',
    value: 'win'
}]

const processFn1 = function (data) {
    const res = {};
    for(const {key, value} of data) {
        res[key] = value
    }
    return res;
}

const processFn2 = function (data) {
    return data.reduce((res, curr) => ({...res, [curr.key]: curr.value}), {});
}

console.log(processFn1(data));
console.log(processFn2(data));

// 0419 —— [键值对转树状结构]
console.log('------------ 键值对转树状结构! ------------')
function buildTree(input) {
    if (!input.length) return {};
    let sortedInput = input.sort((a, b) => { return a.parentId - b.parentId });
    const transfer = function (arr, index) {
        const output = {
            id: arr[index].id,
            value: arr[index].value,
            children: []
        }
        for (let i = index + 1; i < arr.length; i++) {
            if (arr[index].id === arr[i].parentId) {
                output.children.push(transfer(arr, i));
            }
        }
        return output;
    }
    return transfer(sortedInput, 0);
}

var input = [
    { id: 4, value: 'Student1', parentId: 2 },
    { id: 5, value: 'Student2', parentId: 2 },
    { id: 1, value: 'School', parentId: null },
    { id: 2, value: 'Class1', parentId: 1 },
    { id: 3, value: 'Class2', parentId: 1 },
    { id: 6, value: 'Student3', parentId: 3 },
]

console.log(buildTree(input));

// 0419 —— [渲染几万条数据]
// codepen：https://codepen.io/flashhu/pen/qBRMpeY

// 0419 —— [图片懒加载]
// codepen：https://codepen.io/flashhu/pen/KKaxQQq

// 0419 —— [Promise 封装 ajax]
console.log('------------ Promise 封装 ajax! ------------')
function getData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.responseText));
            }
        }
        xhr.send();
    })
}


// 0427 —— [模板引擎]
console.log('------------ 模板引擎! ------------')
function render(template, data) {
    const reg = /\{\{(\w+)\}\}/;
    let splitArray = reg.exec(template);
    while (splitArray && data[splitArray[1]]) {
        template = template.replace(reg, data[splitArray[1]]);
        splitArray = reg.exec(template);
    }
    return template;
}

let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let person = {
    name: '布兰',
    age: 12
}
console.log(render(template, person)); 


// 0419 —— [深拷贝]
// console.log('------------ 深拷贝! ------------')
// // 递归版
// function isObject(value) {
//     return (typeof value === 'object') && value !== null;
// }

// function deepClone1(target) {
//     if (!isObject(target)) return target;
//     const res = Array.isArray(target) ? [] : {};
//     Object.keys(target).forEach(key => {
//         res[key] = isObject(target) ? deepClone1(target[key]): target[key];
//     })
//     return res;
// }

// function deepClone2(target) {
//     if (!isObject(target)) return target;
//     const root = Array.isArray(target) ? [] : {};
//     // 用于去重
//     const uniqueList = [];
//     const loopList = [
//         {
//             parent: root,
//             key: undefined,
//             data: target,
//         }
//     ];
//     while (loopList.length) {
//         const { parent, key, data } = loopList.pop();
//         // 如 key 为 undefined 则表示拷贝到父元素，否则就拷贝到子元素
//         let res = parent;
//         if (typeof key !== 'undefined') {
//             res = parent[key] = Array.isArray(data) ? [] : {};
//         }
//         // 检查当前处理的值，是否为包含引用关系的对象
//         const savedData = uniqueList.filter(v => v.source === data);
//         if(savedData.length) {
//             parent[key] = savedData[0].target;
//             continue;
//         }
//         // 记录源数据中的值与克隆后数据的对应关系
//         uniqueList.push({
//             source: data,
//             target: res
//         })
//         Object.keys(data).forEach(key => {
//             if(isObject(data[key])) {
//                 // 注意这里的 parent 是 res
//                 loopList.push({
//                     parent: res,
//                     key, 
//                     data: data[key]
//                 })
//             } else {
//                 res[key] = data[key];
//             }
//         })
//     }
//     return root;
// }

// a = {};
// const b = function test() {}
// arr1 = [[1, null, a], 2, a, b, /test/]
// arr2 = deepClone2(arr1);
// arr2[0].push(3);
// console.log(arr1, arr2);
// console.log(arr1[0][2] === arr1[2], arr2[0][2] === arr2[2], arr1[0][2] === arr2[0][2]);
// console.log(arr1[3] === arr2[3]);

// 0424 —— [特定格式取对象属性]
// 编写函数获得对象中的值666，必须使用到 str = 'a.b.c';
console.log('------------ 特定格式取对象属性! ------------');
const getData1 = function(str, obj) {
    return str.split('.').reduce((res, currKey) => {
        return res[currKey]
    }, obj);
}

const inputObj = {
    a: {
        b: {
            c: 666
        }
    }
}

console.log(getData1('a.b.c', inputObj));

// 0427 —— [JSONP]
console.log('------------ JSONP! ------------');
function jsonp(url, params, cbName) {
    return new Promise((resolve, reject) => {
        // 1. 得 url
        let dataSrc = `${url}?`;
        for(let key in params) {
            if(Object.hasOwnProperty.call(params, key)) {
                dataSrc += `${key}=${params[key]}&`;
            }
        }
        cbName = cbName || 't' + Date.now();
        dataSrc += `callback=${cbName}`;
        // 2. 建 dom
        let script = document.createElement('script');
        script.src = dataSrc;
        // 3. 设置监听
        window[cbName] = (data) => {
            resolve(data);
            document.body.removeChild(script);
        }
        // 4. 添加 dom
        document.body.appendChild(script)
    })
}

// [单例模式]
console.log('------------ 单例模式! ------------');
class Storage {
    data = new Map();

    static getInstance() {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }

    getItem(key) {
        // return localStorage.getItem(key);
        return this.data.get(key);
    }

    setItem(key, value) {
        // return localStorage.setItem(key, value);
        return this.data.set(key, value);
    }
}

const storage1 = Storage.getInstance();
const storage2 = Storage.getInstance();

storage1.setItem('name', 'lily');
console.log(storage1.getItem('name'));
console.log(storage2.getItem('name'));
console.log(storage1 === storage2)