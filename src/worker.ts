import { expose, Remote } from "comlink";
// const sab = new SharedArrayBuffer(1024);

// ta[0] = 0;
const log = (...args: any[]) => console.log("[worker]", ...args);

let _sab: SharedArrayBuffer;
const api = {
  waitFor() {
    const ta = new Int32Array(_sab);
    const prev = Atomics.load(ta, 0);
    console.time("wait");
    log("wait start", Atomics.load(ta, 0));
    Atomics.wait(ta, 0, prev + 1);
    log("wait end");
    console.timeEnd("wait");
  },
  start(sab: SharedArrayBuffer) {
    _sab = sab;
    return 1;
  },
};

export type Api = Remote<typeof api>;

expose(api);
