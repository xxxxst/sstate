"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//state decorator
function SState(target) {
    var targetKey = target;
    function create(obj, keySub) {
        if (typeof targetKey === 'string') {
            targetKey = targetKey.trim();
            var watcherData = {
                route: "",
                target: keySub,
                // parent: null,
                data: [],
            };
            var cwatcher = (obj["_*_cwatcher"] || (obj["_*_cwatcher"] = {}));
            var watcher = (cwatcher[keySub] || (cwatcher[keySub] = watcherData));
            watcher.route = targetKey;
        }
    }
    ;
    return create;
}
exports.default = SState;
