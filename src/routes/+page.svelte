<script>
	import Abraham from '$lib/abraham.min.js';

	let text = $state('⠑⠰⠋⠘⠭⠘⠘⠆');
	let result = $derived(Abraham.nemethToLatex(text));
</script>

<!-- Styling is done with https://tailwindcss.com/, add a css class with whatever style you want -->
<div class="flex justify-center pt-10 dark:bg-gray-900">
	<div class="h-screen">
		<div
			class="p-7 w-xl border border-gray-100 rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<h3 class="text-3xl dark:text-gray-100">Input</h3>
			<input
				bind:value={text}
				type="text"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			/>
			<br />
			<h3 class="text-3xl pt-3 dark:text-gray-100">Output</h3>
			<p class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5">{result.value}</p>
		</div>
	</div>
</div>
