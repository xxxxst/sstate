
/**
 * ignore convert get/set
 */
export default function SIgnore() {
	function create(obj: any, keySub: any) {
		var watcher = (obj["_*_watcher_g"] || (obj["_*_watcher_g"] = {}));

		var data = (watcher[keySub] || (watcher[keySub] = {
			ignore: false,
			parent: null,
			fun: [],
		}));
		data.ignore = true;
	};

	return create;
}