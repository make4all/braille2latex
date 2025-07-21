<script>
	import sample from '$lib/Sample Quiz.brf?raw';
	import { NEWLINESYM } from '$lib/brailleMap';
	import { handleFileChange, downloadText } from '$lib/helper.js';
	import { parse } from '$lib/processFile.js';
	import { onMount } from 'svelte';
	import * as ueb from 'ueb';
	
	onMount(async () => {
		await ueb.default();
		console.log(ueb.add(BigInt(2), BigInt(40)));
	});


	let text = $state(sample);
	let filename = $state("example_filename.tex");

	let latex = $derived.by(() => {
		let evalstring = parse(text);
		console.debug(evalstring);
		return evalstring;
	});

	const authorizedExtensions = ['.brf', '.blf'];
</script>

<!-- Styling is done with https://tailwindcss.com/, add a css class with whatever style you want -->
<div class="flex flex-row justify-center dark:bg-gray-900">
	<div class="h-screen flex-initial w-300 m-5">
		<div
			class="p-3 border border-gray-100 rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="pb-4 px-4">
				<h3 class="text-3xl dark:text-gray-100">File Upload</h3>

				<label
					id="braille-file-label"
					for="braille-file"
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label
				>
				<input
					accept={authorizedExtensions.join(',')}
					onchange={(event) => {
						handleFileChange(event, (result, fname) => {
							text = result;
							filename = fname.split('.').slice(0,-1).join('.') + '.tex'
						});
					}}
					id="braille-file"
					name="braille-file"
					type="file"
					aria-labelledby="braille-file-label"
					class="block w-96 text-sm bg-gray-50 dark:bg-gray-950 dark:text-gray-100 file:cursor-pointer cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 dark:file:bg-gray-600 file:hover:bg-gray-700 file:text-white font-light file:font-normal"
				/>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
					BRF or BRL. See syntax requirements <a
						href="https://github.com/make4all/braille2latex"
						class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
						>here</a
					>
				</p>
			</div>
			<div class="flex flex-col lg:flex-row">
				<div class="p-4 flex-auto">
					<h3 class="text-3xl dark:text-gray-100 mb-2">Input</h3>
					<p
						id="braile-text"
						class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5 whitespace-pre-line max-h-96 overflow-y-auto"
					>
						{text}
					</p>
				</div>
				<div class="p-4 flex-auto">
					<h3 class="text-3xl dark:text-gray-100 mb-2">Output</h3>
					<p
						class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5 whitespace-pre-line max-h-96 overflow-y-auto"
					>
						{latex}
					</p>
				</div>
			</div>
			<div class="p-4">
				<h3 class="text-3xl dark:text-gray-100">File Download</h3>
				<label id="latex-download-label" for="latex-download" class="dark:text-gray-100"
					>Download a Latex file:</label
				>

				<button
					id="latex-download"
					name="latex-download"
					class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
					onclick={() => {downloadText(latex, filename)}}
				>
					Download Input as File
				</button>
			</div>
		</div>
	</div>
</div>
