<script>
	import Abraham from '$lib/abraham.min.js';

	let text = $state('⠑⠰⠋⠘⠭⠘⠘⠆');
	let result = $derived(Abraham.nemethToLatex(text));
	const authorizedExtensions = ['.brf', '.blf'];

	const mapping = {
		'\n':'\n',
		' ': '⠀',
		'!': '⠮',
		'"': '⠐',
		'#': '⠼',
		$: '⠫',
		'%': '⠩',
		'&': '⠯',
		'': '⠄',
		'(': '⠷',
		')': '⠾',
		'*': '⠡',
		'+': '⠬',
		',': '⠠',
		'-': '⠤',
		'.': '⠨',
		'/': '⠌',
		'0': '⠴',
		'1': '⠂',
		'2': '⠆',
		'3': '⠒',
		'4': '⠲',
		'5': '⠢',
		'6': '⠖',
		'7': '⠶',
		'8': '⠦',
		'9': '⠔',
		':': '⠱',
		';': '⠰',
		'<': '⠣',
		'=': '⠿',
		'>': '⠜',
		'?': '⠹',
		'@': '⠈',
		a: '⠁',
		b: '⠃',
		c: '⠉',
		d: '⠙',
		e: '⠑',
		f: '⠋',
		g: '⠛',
		h: '⠓',
		i: '⠊',
		j: '⠚',
		k: '⠅',
		l: '⠇',
		m: '⠍',
		n: '⠝',
		o: '⠕',
		p: '⠏',
		q: '⠟',
		r: '⠗',
		s: '⠎',
		t: '⠞',
		u: '⠥',
		v: '⠧',
		w: '⠺',
		x: '⠭',
		y: '⠽',
		z: '⠵',
		A: '⠁',
		B: '⠃',
		C: '⠉',
		D: '⠙',
		E: '⠑',
		F: '⠋',
		G: '⠛',
		H: '⠓',
		I: '⠊',
		J: '⠚',
		K: '⠅',
		L: '⠇',
		M: '⠍',
		N: '⠝',
		O: '⠕',
		P: '⠏',
		Q: '⠟',
		R: '⠗',
		S: '⠎',
		T: '⠞',
		U: '⠥',
		V: '⠧',
		W: '⠺',
		X: '⠭',
		Y: '⠽',
		Z: '⠵',
		'[': '⠪',
		'\\': '⠳',
		']': '⠻',
		'^': '⠘',
		_: '⠸'
	};

	function convertString(input_str) {
		let out = [];
		for (const input_char of input_str) {
				out += mapping[input_char] || '';
		}
		return out;
	}

	function handleFileChange(event) {
		const input = event.target;
		const file = input?.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				text = convertString(reader.result);
			};
			reader.readAsText(file);
		}
	}

	function downloadText() {
		let latex = []
		let current = '';
		for (const input_char of text) {
			if (input_char == '\n') {
				console.log(current)
				latex += Abraham.nemethToLatex(current);
				current = '';
			} else {
				current += input_char;
			}
		}	
		const blob = new Blob(latex, { type: 'text/plain' });
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
			<p class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5">{result.value}</p>
			<p class="font-mono bg-gray-900 text-gray-100 rounded-lg p-2.5">{result.isError}</p>

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
