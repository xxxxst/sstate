"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Store
 */
class Store {
    constructor(_state) {
        this.state = null;
        this.watcher = {};
        Store.ins = this;
        this.state = _state;
        this.convert(this.state);
    }
    /**
     * bind watcher to component
     * @param route route of store
     * @param fun callback
     */
    bind(route, fun) {
        var arrFun = this.findBindFun(route);
        arrFun.push(fun);
    }
    /**
     * unbind watcher to component
     * @param route route of store
     * @param fun callback
     */
    unbind(route, fun) {
        var arrFun = this.findBindFun(route);
        for (var i = 0; i < arrFun.length; ++i) {
            if (arrFun[i].fun == fun) {
                arrFun.splice(i, 1);
                return;
            }
        }
    }
    findBindFun(route) {
        var arr = route.split(".");
        var tmp = this.state;
        var attr = arr[arr.length - 1];
        for (var i = 0; i < arr.length - 1; ++i) {
            tmp = tmp[arr[i]];
        }
        var watcher = (tmp["_*_watcher"] || (tmp["_*_watcher"] = {}));
        var data = (watcher[attr] || (watcher[attr] = {
            ignore: false,
            parent: null,
            fun: [],
        }));
        return data.fun;
    }
    convert(obj) {
        var watcher = (obj["_*_watcher"] || (obj["_*_watcher"] = {}));
        var watcherGlobal = (obj["_*_watcher_g"] || (obj["_*_watcher_g"] = {}));
        for (var key in obj) {
            this.convertOne(obj, key, watcher, watcherGlobal);
        }
    }
    convertOne(obj, key, watcher, watcherGlobal) {
        var local = this;
        var tmp = obj[key];
        if (key == "_*_watcher" || key == "_*_watcher_g") {
            return;
        }
        if (watcherGlobal[key] && watcherGlobal[key].ignore) {
            return;
        }
        if (typeof (tmp) == "object") {
            this.convert(tmp);
        }
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: () => { return tmp; },
            set: (value) => {
                var oldValue = tmp;
                if (typeof (value) == "object") {
                    local.convert(value);
                }
                tmp = value;
                // console.info("ccc", key, obj, watcher);
                if (watcher[key]) {
                    var arr = watcher[key].fun;
                    for (var i = 0; i < arr.length; ++i) {
                        arr[i](value, oldValue);
                    }
                }
            },
        });
    }
    /**
     * inject event when to bind/unbind, and how to update state
     * @param cTarget component instance
     * @param evtNameBind function name of bind
     * @param evtNameUnbind function name of unbind
     * @param funUpdateState function of update state
     */
    static injectEvent(cTarget, evtNameBind, evtNameUnbind, funUpdateState) {
        var targetSub = cTarget;
        var proto = targetSub.prototype;
        var oldBind = proto[evtNameBind];
        var oldUnbind = proto[evtNameUnbind];
        var bind = function () {
            var cw = proto["_*_cwatcher"];
            for (var key in cw) {
                bindOne(this, cw, key);
            }
            oldBind && oldBind.call(this);
        };
        var unbind = function () {
            oldUnbind && oldUnbind.call(this);
            var cw = proto["_*_cwatcher"];
            for (var key in cw) {
                unbindOne(this, cw, key);
            }
        };
        function bindOne(obj, cw, key) {
            // if(key == "hoverTab"){
            // 	console.info("bbb", obj);
            // }
            var map = (obj["_*_cwatcher_fun"] || (obj["_*_cwatcher_fun"] = {}));
            map[key] = function (value, oldValue) {
                funUpdateState(obj, key, value, oldValue);
                var arr = cw[key].data;
                // if(key == "winSize"){
                // 	console.info("aaa", key, cw[key].target, arr, obj, value.width);
                // }
                for (var i = 0; i < arr.length; ++i) {
                    arr[i].fun.call(obj);
                }
            };
            Store.ins.bind(cw[key].route, map[key]);
        }
        function unbindOne(obj, cw, key) {
            var map = (obj["_*_cwatcher_fun"] || (obj["_*_cwatcher_fun"] = {}));
            Store.ins.unbind(cw[key].route, map[key]);
        }
        Object.defineProperty(proto, evtNameBind, {
            enumerable: true,
            configurable: true,
            get: () => { return bind; },
            set: (value) => {
                oldBind = value;
            },
        });
        Object.defineProperty(proto, evtNameUnbind, {
            enumerable: true,
            configurable: true,
            get: () => { return unbind; },
            set: (value) => {
                oldUnbind = value;
            },
        });
    }
    /**
     * inject component
     * it need to change the constructor to inject each of component
     * @param cTarget component instance
     * @param funUpdateState function of update state
     */
    static injectClass(cTarget, funUpdateState) {
        var targetSub = cTarget;
        function createState(obj, watcher) {
            var targetKey = watcher.route.trim();
            var keySub = watcher.target;
            var arr = targetKey.split(".");
            var lastAttr = arr[arr.length - 1];
            var tmp = Store.ins.state;
            for (var i = 0; i < arr.length - 1; ++i) {
                tmp = tmp[arr[i]];
            }
            Object.defineProperty(obj, keySub, {
                enumerable: true,
                configurable: true,
                get: () => {
                    // return funGetState(obj, keySub);
                    return tmp[lastAttr];
                },
                set: (value) => {
                    if (typeof (value) != "object" && tmp[lastAttr] === value) {
                        return;
                    }
                    tmp[lastAttr] = value;
                },
            });
            funUpdateState(obj, keySub, tmp[lastAttr]);
        }
        // var oldc = targetSub.prototype.constructor;
        var newc = function () {
            var proto = targetSub.prototype;
            var c = new targetSub();
            if (proto["_*_cwatcher"]) {
                for (var key in proto["_*_cwatcher"]) {
                    // console.info("ddd", c, key);
                    createState(c, proto["_*_cwatcher"][key]);
                }
                for (var key in proto["_*_cwatcher"]) {
                    var data = proto["_*_cwatcher"][key].data;
                    for (var i = 0; i < data.length; ++i) {
                        if (data[i].option && data[i].option.immediate) {
                            data[i].fun.call(c);
                        }
                    }
                }
            }
            return c;
        };
        // newc.prototype["_*_pre_constructor"] = oldc;
        newc.prototype = targetSub.prototype;
        var tmp = targetSub.prototype.constructor;
        for (var keyTmp in tmp) {
            (function (key) {
                Object.defineProperty(newc, key, {
                    enumerable: true,
                    configurable: true,
                    get: () => { return tmp[key]; },
                    set: (value) => { tmp[key] = value; },
                });
            })(keyTmp);
        }
        return newc;
    }
}
Store.ins = null;
exports.default = Store;
