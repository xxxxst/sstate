/**
 * Store
 */
export default class Store {
    static ins: any;
    state: any;
    watcher: any;
    constructor(_state: any);
    /**
     * bind watcher to component
     * @param route route of store
     * @param fun callback
     */
    bind(route: string, fun: Function): void;
    /**
     * unbind watcher to component
     * @param route route of store
     * @param fun callback
     */
    unbind(route: string, fun: Function): void;
    private findBindFun;
    private convert;
    private convertOne;
    /**
     * inject event when to bind/unbind, and how to update state
     * @param cTarget component instance
     * @param evtNameBind function name of bind
     * @param evtNameUnbind function name of unbind
     * @param funUpdateState function of update state
     */
    static injectEvent(cTarget: any, evtNameBind: any, evtNameUnbind: any, funUpdateState: any): void;
    /**
     * inject component
     * it need to change the constructor to inject each of component
     * @param cTarget component instance
     * @param funUpdateState function of update state
     */
    static injectClass(cTarget: any, funUpdateState: any): () => any;
}
