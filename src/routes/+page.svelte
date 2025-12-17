<script>
	import sample from '$lib/Sample Quiz.brf?raw';
	import { handleFileChange, downloadText } from '$lib/helper.js';
	import { parse } from '$lib/processFile.js';
	import { ascii2Braille, braille2Ascii } from '$lib/brailleMap.js';
	import liblouis from 'liblouis/easy-api';

	import { assets } from '$app/paths';

	// includes the following tables: unicode.dis, en-ueb-g2.ctb, en-ueb-g1.ctb, en-ueb-chardefs.uti, latinLetterDef8Dots.uti, en-ueb-math.ctb, braille-patterns.cti
	const capi_url = assets + 'liblouis/build-tables-embeded-root-utf16.js';
	const easyapi_url = assets + 'liblouis/easy-api.js'
	console.log(liblouis);

	console.log(capi_url);
	console.log(easyapi_url);

	const brailleTables = [
		{ value: 'en-ueb-g2.ctb', label: 'English UEB Grade 2' },
		{ value: 'en-ueb-g1.ctb', label: 'English UEB Grade 1' },
		{ value: 'en-ueb-math.ctb', label: 'English UEB Math' }
	];

	let text = $state(sample);
	let filename = $state('example_filename.tex');
	let selectedTable = $state(brailleTables[0].value);

	// Keep braille text as state, but sync with text
	let brailleText = $state(ascii2Braille(sample));
	let lastBrailleText = ascii2Braille(sample);
	
	// Check if a string contains braille characters (Unicode 0x2800-0x28FF range)
	function containsBraille(str) {
		return /[\u2800-\u28FF]/.test(str);
	}
	
	// Check if a string contains ASCII text (not just braille or whitespace)
	function containsAscii(str) {
		return /[^\u2800-\u28FF\s\n]/.test(str);
	}
	
	// Update both text representations when user types or pastes
	function handleBrailleInput(event) {
		const textarea = event.target;
		const inputValue = textarea.value;
		const cursorPos = textarea.selectionStart;
		
		const oldValue = lastBrailleText;
		
		// Determine if input contains ASCII or braille
		const hasAscii = containsAscii(inputValue);
		const hasBraille = containsBraille(inputValue);
		
		if (hasAscii && !hasBraille) {
			// Pure ASCII input - convert to braille for display, keep ASCII for processing
			text = inputValue;
			brailleText = ascii2Braille(inputValue);
			lastBrailleText = brailleText;
		} else if (hasBraille) {
			// Braille input (with or without ASCII) - convert to ASCII for processing
			text = braille2Ascii(inputValue);
			brailleText = inputValue;
			lastBrailleText = inputValue;
			
			// Restore cursor position after potential re-render
			requestAnimationFrame(() => {
				textarea.setSelectionRange(cursorPos, cursorPos);
			});
		} else {
			// Only whitespace or empty
			text = inputValue;
			brailleText = inputValue;
			lastBrailleText = inputValue;
		}
	}

	let latex = $derived.by(async () => {
		let evalstring = await parse(text, selectedTable);
		console.debug(evalstring);
		return evalstring;
	});

	const authorizedExtensions = ['.brf', '.blf'];

	const asyncLiblouis = new liblouis.EasyApiAsync({
		capi: capi_url,
		easyapi: easyapi_url
	});

	// comment out to turn of logs
	// asyncLiblouis.setLogLevel(0);

	asyncLiblouis.translateString(
		'unicode.dis,en-ueb-g2.ctb',
		'Hi, Mom! You owe me: $3.50.',
		e => {
			console.log(e)
		}
	);

	asyncLiblouis.backTranslateString(
		'en-ueb-g2.ctb',
		// '⠠⠓⠊⠂ ⠠⠍⠕⠍⠖ ⠠⠽ ⠪⠑ ⠍⠑⠒ ⠈⠎⠼⠉⠲⠑⠚⠲',
		',hi1 ,mom6 ,y {e me3 `s#c4ej4',
		e => {
			console.log(e)
		}
	);
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
							brailleText = ascii2Braille(result);
														lastBrailleText = ascii2Braille(result);
							filename = fname.split('.').slice(0, -1).join('.') + '.tex';
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
			<div class="pb-4 px-4">
				<label for="braille-table" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Braille table</label>
				<select
					id="braille-table"
					bind:value={selectedTable}
					class="block w-96 text-sm bg-gray-50 dark:bg-gray-950 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2"
				>
					{#each brailleTables as table}
						<option value={table.value}>{table.label}</option>
					{/each}
				</select>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-300">Used for back-translation during LaTeX conversion.</p>
			</div>
			<div class="flex flex-col lg:flex-row">
				<div class="p-4 flex-auto">
					<h3 class="text-3xl dark:text-gray-100 mb-2">Input (Braille)</h3>
					<textarea
						id="braille-text"
						value={brailleText}
						oninput={handleBrailleInput}
						class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5 whitespace-pre w-full h-96 resize-none overflow-y-auto"
						placeholder="Enter braille text here or upload a file..."
						aria-label="Braille input text"
					></textarea>
				</div>
				<div class="p-4 flex-auto">
					<h3 class="text-3xl dark:text-gray-100 mb-2">Output</h3>
					<div
						class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5 whitespace-pre-line max-h-96 overflow-y-auto"
					>
						{#await latex}
							<span class="text-gray-500">Processing...</span>
						{:then result}
							{result}
						{:catch error}
							<span class="text-red-500">Error: {error.message}</span>
						{/await}
					</div>
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
					onclick={() => {
						downloadText(latex, filename);
					}}
				>
					Download Input as File
				</button>
			</div>
		</div>
	</div>
</div>
