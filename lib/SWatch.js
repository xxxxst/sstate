"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//watch decorator
function SWatch(target, option) {
    var targetKey = target;
    function create(obj, keySub, descriptor) {
        var watcherData = {
            route: "",
            target: targetKey,
            // parent: null,
            // option: null,
            data: [],
        };
        var cwatcher = (obj["_*_cwatcher"] || (obj["_*_cwatcher"] = {}));
        var watcher = (cwatcher[targetKey] || (cwatcher[targetKey] = watcherData));
        watcher.data.push({
            funName: keySub,
            option: option,
            fun: descriptor.value,
        });
    }
    return create;
}
exports.default = SWatch;
