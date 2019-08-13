
//state decorator
export default function SState(target?: any) {
	var targetKey = target;

	function create(obj: any, keySub: any) {
		if (typeof targetKey === 'string') {
			targetKey = targetKey.trim();

			var watcherData = {
				route: "",
				target: keySub,
				// parent: null,
				data: [],
			}

			var cwatcher = (obj["_*_cwatcher"] || (obj["_*_cwatcher"] = {}));
			var watcher = (cwatcher[keySub] || (cwatcher[keySub] = watcherData));

			watcher.route = targetKey;
		}
	};

	return create;
}
