/** 
* TODO: This constant is for a horrible embarassing hack to replace newlines with a character code 
* that is hopefully unique temporarily during parsing. To be fixed I HOPE!
*/
export const NEWLINESYM = "_*_";

/**
 * Mapping from ASCII characters to Braille Unicode characters.
 * This mapping is based on the Braille ASCII standard.
 */
const mapping = {
	' ': '⠀',
	'!': '⠮',
	'"': '⠐',
	'#': '⠼',
	'$': '⠫',
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
};

/**
 * Converts from ASCII characters to Braille Unicode characters.
 * @param {*} input_str 
 * @returns Braille Unicode string
 */
export function ascii2Braille(input_str) {
	let out = [];
	for (const input_char of input_str) {
		out += mapping[input_char] || ' '; // Default to space if character not found in mapping
	}
	return out;
}
