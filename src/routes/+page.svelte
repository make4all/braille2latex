<script>
	import Abraham from '$lib/abraham.min.js';
	import * as ohm from 'ohm-js';
	import grammarFile from '$lib/grammar.ohm?raw';
	import sample from '$lib/Sample Quiz.brf?raw';
	import { ascii2Braille, NEWLINESYM } from '$lib/brailleMap';
	import { handleFileChange } from '$lib/helper.js';

	const grammar = ohm.grammar(grammarFile);

	const s = grammar.createSemantics();
	s.addOperation('eval', {
		Braille(_spaces, paragraphs, _newlines) {
			console.debug('Braille: eval paragraphs');
			return paragraphs.children.map((paragraph) => paragraph.eval()).join('\n\n');
		},

		InlineNemeth(_open, nemeth, _close) {
			console.debug('InlineNemeth: eval text');
			let latex = Abraham.nemethToLatex(ascii2Braille(nemeth.eval())).value;
			console.debug(latex);
			return '$' + latex + '$';
		},

		Equation(nemeth) {
			console.debug('Equation: eval nemeth');
			return '$' + nemeth.eval() + '$';
		},

		EndLine(_) {
			console.debug('EndLine');
			return '\n';
		},

		EndParagraph(_line, _space, _line2, _spaces) {
			console.debug('EndParagraph');
			return '\n\n';
		},

		Text(txt) {
			console.debug('Text');
			let latex = txt.sourceString;
			console.debug(latex);
			return latex;
		},

		Paragraph(items1, items2) {
			console.debug('Paragraph: eval children');
			let contents = items1.children.map((item1, i) => item1.eval() + items2.children[i].eval());
			console.debug('paragraph: items1');
			console.debug(items1.children.map((item1) => item1.eval()));
			console.debug('paragraph: items2');
			console.debug(items2.children.map((item2) => item2.eval()));
			console.debug('paragraph: end');

			return contents.join(' ');
		},

		_iter(...children) {
			console.debug('iter: eval children');
			return children.map((c) => c.eval());
		}
	});

	let text = $state(sample);

	let latex = $derived.by(() => {
		const matchResult = grammar.match(
			text.replaceAll('\r', '').replaceAll('\n', NEWLINESYM) + NEWLINESYM + NEWLINESYM
		);
		console.debug(matchResult.toString());
		console.debug(matchResult.message);
		const adapter = s(matchResult);
		const evalstring = adapter.eval().replaceAll(NEWLINESYM, '\n');
		console.debug(evalstring);
		return evalstring;
	});

	const authorizedExtensions = ['.brf', '.blf'];

	function downloadText() {
		const blob = new Blob([latex], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'braille.tex'; // Set your desired filename
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<!-- Styling is done with https://tailwindcss.com/, add a css class with whatever style you want -->
<div class="flex flex-row justify-center pt-10 dark:bg-gray-900">
	<div class="h-screen flex-initial w-300 m-7">
		<div
			class="p-7 border border-gray-100 rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<h3 class="text-3xl dark:text-gray-100">File Upload</h3>

			<label
				id="braille-file-label"
				for="braille-file"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label
			>
			<input
				accept={authorizedExtensions.join(',')}
				onchange={(event) => {
					handleFileChange(event, (result) => {text = result});
				}}
				id="braille-file"
				name="braille-file"
				type="file"
				aria-labelledby="braille-file-label"
				
				class="block w-96 text-sm bg-gray-50 file:cursor-pointer cursor-pointer rounded-lg border border-gray-300 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white"
			/>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
				BRF or BRL. See syntax requirements <a
					href="https://github.com/make4all/braille2latex"
					class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">here</a
				>
			</p>
			<br class="my-3" />
			<h3 class="text-3xl dark:text-gray-100 mb-2">Input</h3>
			<p
				id="braile-text"
				class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5 whitespace-pre-line max-h-96 overflow-y-auto"
			>
				{text}
			</p>
			<br class="my-3" />
			<h3 class="text-3xl pt-3 dark:text-gray-100 mb-2">Output</h3>
			<p
				class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5 whitespace-pre-line max-h-96 overflow-y-auto"
			>
				{latex}
			</p>

			<br class="my-3" />
			<h3 class="text-3xl dark:text-gray-100">File Download</h3>
			<label id="latex-download-label" for="latex-download">Download a Latex file:</label>

			<button
				id="latex-download"
				name="latex-download"
				class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				onclick={downloadText}
			>
				Download Input as File
			</button>
		</div>
	</div>
</div>
