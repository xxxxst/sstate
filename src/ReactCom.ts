import Store from './Store';

/**
 * React Component
 */
export default function ReactCom() {
	function create(targetSub: any): any {
		var oldBind = targetSub.prototype.componentDidMount;
		var oldUnbind = targetSub.prototype.componentWillUnmount;

		function bind(this:any) {
			this["_*_ismouted"] = true;
			oldBind && oldBind.call(this);
		}

		function unbind(this:any) {
			this["_*_ismouted"] = false;
			oldUnbind && oldUnbind.call(this);
		}

		Object.defineProperty(targetSub.prototype, "componentDidMount", {
			enumerable: true,
			configurable: true,
			get: () => { return bind; },
			set: (value: any) => {
				oldBind = value;
			},
		});

		Object.defineProperty(targetSub.prototype, "componentWillUnmount", {
			enumerable: true,
			configurable: true,
			get: () => { return unbind; },
			set: (value: any) => {
				oldUnbind = value;
			},
		});

		// var funGetState = function(obj, keySub) {
		// 	if (!obj.state) {
		// 		return null;
		// 	}
		// 	return obj.state[keySub];
		// }

		var funUpdateState = function(obj, keySub, value) {
			var data = {};
			data[keySub] = value;
			// console.info("aaa", keySub, obj);
			if (obj["_*_ismouted"]) {
				obj.setState(data);
			} else {
				var state = (obj.state || (obj.state = {}));
				state[keySub] = value;
			}
		}

		Store.injectEvent(targetSub, "componentWillMount", "componentWillUnmount", funUpdateState);

		return Store.injectClass(targetSub, funUpdateState);
	}
	return create;
}