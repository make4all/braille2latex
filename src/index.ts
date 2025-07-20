//@ts-ignore
import init, { add } from '../ueb/pkg/ueb.js';

init().then(() => {
  console.log('init wasm-pack');
  "result" + add(BigInt(5),BigInt(7));
});