/* eslint-disable no-unused-vars */
import Abraham from '$lib/abraham.min.js'; // the Desmos Abraham library 
import { ascii2Braille } from './brailleMap'; // import the ASCII to Braille mapping function
import * as ohm from 'ohm-js'; // import the ohm-js library for parsing
import grammarBraille from '$lib/grammarBraille.ohm?raw'; // import the grammar file for parsing

/**
 * A parser is a tool that takes a text file or string and breaks it down into its
 * component parts, according to a set of rules defined in a grammar. This allows us
 * to analyze the structure of the text and extract meaningful information from it.
 * In this case, we are using the ohm-js library to create a parser from the grammar files.
 * The parser will be used to parse Braille text and convert it into LaTeX format.
 * 
 * @param {string} text
 */
export function parse_blocks(text) {
	//let blocks = parse_blocks_outer(text);
	//console.log(blocks);

	// 	blocks.map(block => {
	// 		if ((block.type = 'P')
	// 			|| (block.type = 'E')
	// 			|| (block.type = 'N')) {
	// 			console.log("parsing block", block);
	// 			let parse_result = parse_blocks_inner(block);
	// 			console.log("match", block);
	// 			return parse_result;
	// 		}
	// 		return block;
	// 	});
	// }

	// function parse_blocks_outer(text) {
	// 	console.log("parsing outer blocks", text);

	let parser = {}
	/**
	  * A grammar specifies how a text file or string is organized (such as
	  * the fact that two newlines before and after math should be interpreted as 
	  * an equation in latex). Using the grammar, we can parse a file or string
	  * into a syntax tree, which is a structured representation of the text.
	 */
	parser.grammar = ohm.grammar(grammarBraille); // create the grammar from the file
	parser.semantics = parser.grammar.createSemantics();
	/**
	  * Semantics define how to interpret the syntax tree. Specifically, they allow 
	  * us to walk through the syntax tree and produce a new string, which is 
	  * the LaTeX representation of the original text.
	  */
	parser.semantics.addOperation('eval', {
		Braille: (text) => {
			let res = text.children.map(c => c.eval()).join("");
			console.log("eval:braille: " + res);
			return res;
		},
		Block: (block) => {
			let res = block.eval();
			console.log("eval:block: " + res);
			return res;
		},
		Paragraph(children) {
			let res = children.children.map(c => c.eval()).join("");
			console.log("eval:paragraph: " + res);
			return res
		},
		Equation: (eqn) => {
			let res = "$" + eqn.eval() + "$"
			console.log("eval:equation: " + string);
			return res;
		},
		InlineNemeth(_1, a, _2) {
			const latex = Abraham.nemethToLatex(ascii2Braille(a.sourceString))
			if (latex.isError) throw new Error("Invalid Nemeth");
			console.log("eval:inline_nemeth: $" + latex.value + "$");
			return "$" + latex.value + "$";
		},
		InlineNemethL(nemeth, plain) {
			return nemeth.eval() + plain.eval();
		},
		InlineNemethR(plain, nemeth) {
			return plain.eval() + nemeth.eval();
		},

		Plain(text) {
			console.log("eval:plain: " + text.sourceString);
			return text.sourceString
		},
		Blank: (a, b) => {
			console.log("eval:blank");
			return "\n";
		},
		EndLine(_) {
			console.log("eval:endline");
			return "\n";
		},
		TextBlock(blocks) {
			let res = blocks.children.map(c => c.eval()).join("\\n");
			console.log("eval:textblock: " + res);
			return res;
		},
		End(_, a) {
			return "";
		},
		_iter(...children) {
			return children.map(c => c.eval()).join("");
		}
	});

	console.log("ready to parse");

	let match = parser.grammar.match(text);
	console.log(match)

	if (match.failed()) {
		console.log("match failed on text", text);
		return [text];
	} else {
		console.log("match succeeded on text", text);
		console.log("parsing text", match.toString());

		let evals = parser.semantics(match).eval();
		console.log("parsed blocks", evals);
		return evals;
	}
}

// function parse_blocks_inner(block) {
// 	console.log("parsing inner block", block);

// 	let parser = {};

// 	parser.grammar = ohm.grammar(grammarInner); // create the grammar from the file
// 	parser.semantics = parser.grammar.createSemantics(); // create the semantics for the grammar

// 	parser.semantics.addOperation('content', {
// 		_terminal() { return this.sourceString },
// 		Plain(a) { return a.content() },
// 		Bold(_1, a, _2) { return "\textbf{" + a.content() + "}" },
// 		Italic(_1, a, _2) { return "\textit{" + a.content() + "}" },
// 		InlineNemeth(_1, a, _2) {
// 			return "$" + Abraham.nemethToLatex(ascii2Braille(a.content())) + "$"
// 		},
// 	});

// 	let match = parser.grammar.match(block);
// 	console.log("parsing text", match);
// 	if (match.failed()) {
// 		console.log("match failed on block", block)
// 		block.content = block.content;
// 	} else {
// 		block.content = parser.semantics(match).content()
// 	}
// 	return block
// }



