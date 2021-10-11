import Worker from "./worker?worker";
import { Api } from "./worker";
import { wrap } from "comlink";

const log = (...args: any[]) => console.log("[main]", ...args);

const api: Api = wrap(new Worker());

const sab = new SharedArrayBuffer(1024);
const ta = new Int32Array(sab);

log(Atomics.load(ta, 0));

async function main() {
  await api.start(sab);
  api.waitFor().then(log);
  // 即座に送ると workerの Atomics.wait() より先に Atomics.add() が走ってしまうので、ちょっと待つ
  setTimeout(() => {
    Atomics.add(ta, 0, 1);
  }, 0);
}

main();
