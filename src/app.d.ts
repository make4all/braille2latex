
//@ts-ignore
import init, { add } from '../ueb/pkg/ueb.js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

init().then(() => {
  console.log('init wasm-pack');
  "result" + add(BigInt(5),BigInt(7));
});

export {};
