"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ignore convert get/set
 */
function SIgnore() {
    function create(obj, keySub) {
        var watcher = (obj["_*_watcher_g"] || (obj["_*_watcher_g"] = {}));
        var data = (watcher[keySub] || (watcher[keySub] = {
            ignore: false,
            parent: null,
            fun: [],
        }));
        data.ignore = true;
    }
    ;
    return create;
}
exports.default = SIgnore;
