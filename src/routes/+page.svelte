<script>
	import Abraham from '$lib/abraham.min.js';
	import * as ohm from 'ohm-js';
	import grammarFile from '$lib/grammar.ohm?raw';
	import text from '$lib/Sample Quiz.brf?raw';
	import operations from '$lib/operations.json?raw';
	import {ascii2Braille, NEWLINESYM} from '$lib/brailleMap';

	console.log(grammarFile);
	console.log(text);
	console.log(operations);
	const grammar = ohm.grammar(grammarFile);

	const s = grammar.createSemantics();
	s.addOperation('eval', {
		Braille(_spaces, paragraphs, _newlines) {
			console.log('Braille: eval paragraphs');
			return paragraphs.children.map((paragraph) => paragraph.eval()).join('\n\n');
		},

		InlineNemeth(_open, nemeth, _close) {
			console.log('InlineNemeth: eval text');
			let latex = Abraham.nemethToLatex(ascii2Braille(nemeth.eval())).value;
			console.log(latex);
			return '$' + latex + '$';
		},

		Equation(nemeth) {
			console.log('Equation: eval nemeth');
			return '$' + nemeth.eval() + '$';
		},

		EndLine(_) {
			console.log('EndLine');
			return '\n';
		},

		EndParagraph(_line, _space, _line2, _spaces) {
			console.log('EndParagraph');
			return '\n\n';
		},

		Text(txt) {
			console.log('Text');
			let latex = txt.sourceString;
			console.log(latex);
			return latex;
		},

		Paragraph(items1, items2) {
			console.log('Paragraph: eval children');
			let contents = items1.children.map((item1, i) => item1.eval() + items2.children[i].eval());
			console.log('paragraph: items1');
			console.log(items1.children.map((item1) => item1.eval()));
			console.log('paragraph: items2');
			console.log(items2.children.map((item2) => item2.eval()));
			console.log("paragraph: end")

			return contents.join(' ');
		},

		_iter(...children) {
			console.log('iter: eval children');
			return children.map((c) => c.eval());
		}
	});

	//let result = $derived.by(() => {
	let result = '';
	const matchResult = grammar.match(text.replaceAll('\r',"").replaceAll('\n', NEWLINESYM) + NEWLINESYM+NEWLINESYM);
	console.log(matchResult.toString());
	console.log(matchResult.message);
	const adapter = s(matchResult);
	console.log(adapter.eval().replaceAll(NEWLINESYM, '\n')); 
	//});

	const grammarExtension = ['.ohm'];
	const authorizedExtensions = ['.brf', '.blf'];

	function handleFileChange(event) {
		// 	const input = event.target;
		// 	const file = input?.files?.[0];
		// 	if (file) {
		// 		const reader = new FileReader();
		// 		reader.onload = () => {
		// 			text = reader.result;
		// 		};
		// 		reader.readAsText(file);
		// 	}
	}

	function downloadText() {
		// 	const blob = new Blob(latex, { type: 'text/plain' });
		// 	const url = URL.createObjectURL(blob);
		// 	const a = document.createElement('a');
		// 	a.href = url;
		// 	a.download = 'braille.tex'; // Set your desired filename
		// 	document.body.appendChild(a);
		// 	a.click();
		// 	document.body.removeChild(a);
		// 	URL.revokeObjectURL(url);
	}
</script>

<!-- Styling is done with https://tailwindcss.com/, add a css class with whatever style you want -->
<div class="flex justify-center pt-10 dark:bg-gray-900">
	<div class="h-screen">
		<div
			class="p-7 w-xl border border-gray-100 rounded-lg shadow-lg dark:border-gray-700 dark:bg-gray-800"
		>
			<h3 class="text-3xl dark:text-gray-100">File Upload</h3>
			<label id="braille-file-label" for="braille-file">Upload a BRF file:</label>

			<input
				accept={authorizedExtensions.join(',')}
				onchange={handleFileChange}
				id="braille-file"
				name="braille-file"
				type="file"
				aria-labelledby="braille-file-label"
			/>

			<h3 class="text-3xl dark:text-gray-100">Input</h3>
			<p id="braile-text">{text}</p>
			<br />
			<h3 class="text-3xl pt-3 dark:text-gray-100">Output</h3>
			<p class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5">{result}</p>

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
