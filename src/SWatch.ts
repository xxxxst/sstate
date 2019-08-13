
//watch decorator
export default function SWatch(target?: any, option?: any) {
	var targetKey = target;

	function create(obj: any, keySub: any, descriptor?: any) {
		var watcherData = {
			route: "",
			target: targetKey,
			// parent: null,
			// option: null,
			data: [],
		}

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
