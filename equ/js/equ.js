var OPS = {
	PUSH_ARG: 0,
	PUSH_LIT: 1,
	ADD: 2,
	SUB: 3,
	MUL: 4,
	DIV: 5
};

var cachedParseRPN = [];

var digits = '0123456789';
var punctuation = '{}+-*/()';

function parseEquation() {
	var code = document.getElementById('equ').value;
	
	var tokens = [];
	for (var i = 0; i < code.length; i++) {
		var c = code.charAt(i);
		if (punctuation.indexOf(c) !== -1) {
			tokens.push(c);
		} else if (digits.indexOf(c) !== -1) {
			var val = 0;
			for (; i < code.length; i++) {
				c = code.charAt(i);
				var digit = digits.indexOf(c);
				if (digit === -1) {
					i--;
					break;
				} else {
					val = val * 10 + digit;
				}
			}
			
			tokens.push(val);
		}
	}
	
	console.log(tokens);
	
	cachedParseRPN = [];
	
// while there are tokens to be read:
	// read a token.
	// if the token is a number, then push it to the output queue.
	// if the token is an operator, then:
		// while ((there is an operator at the top of the operator stack with
			// greater precedence) or (the operator at the top of the operator stack has
                        // equal precedence and
                        // the operator is left associative)) and
                      // (the operator at the top of the stack is not a left bracket):
				// pop operators from the operator stack, onto the output queue.
		// push the read operator onto the operator stack.
	// if the token is a left bracket (i.e. "("), then:
		// push it onto the operator stack.
	// if the token is a right bracket (i.e. ")"), then:
		// while the operator at the top of the operator stack is not a left bracket:
			// pop operators from the operator stack onto the output queue.
		// pop the left bracket from the stack.
		// /* if the stack runs out without finding a left bracket, then there are
		// mismatched parentheses. */
// if there are no more tokens to read:
	// while there are still operator tokens on the stack:
		// /* if the operator token on the top of the stack is a bracket, then
		// there are mismatched parentheses. */
		// pop the operator onto the output queue.
// exit.
	
	{
		var tokToOpMap = {};
		tokToOpMap['+'] = OPS.ADD;
		tokToOpMap['-'] = OPS.SUB;
		tokToOpMap['*'] = OPS.MUL;
		tokToOpMap['/'] = OPS.DIV;
		var opToPrecMap = {};
		opToPrecMap[OPS.ADD] = 3;
		opToPrecMap[OPS.SUB] = 3;
		opToPrecMap[OPS.MUL] = 4;
		opToPrecMap[OPS.DIV] = 4;
		
		var opStack = [];
		for (var i = 0; i < tokens.length; i++) {
			var tok = tokens[i];
			if (typeof(tok) === 'number') {
				cachedParseRPN.push(OPS.PUSH_LIT);
				cachedParseRPN.push(tok);
			} else if (tok === '{') {
				if (i < tokens.length - 2) {
					if (typeof(tokens[i+1]) === 'number') {
						if (tokens[i+2] === '}') {
							cachedParseRPN.push(OPS.PUSH_ARG);
							cachedParseRPN.push(tokens[i+1]);
							i += 2;
						} else {
							console.log("BAD ARG IDX");
						}
					} else {
						console.log("BAD ARG IDX");
					}
				} else {
					console.log("BAD ARG IDX");
				}
			} else if (tok === '(') {
				opStack.push(tok);
			} else if (tok === ')') {
				while(opStack.length > 0) {
					if (opStack[opStack.length - 1] === '(') {
						opStack.pop();
						break;
					} else {
						cachedParseRPN.push(opStack.pop());
					}
				}
			} else {
				var op = tokToOpMap[tok];
				if (op === undefined) {
					console.log("BAD TOKEN: " + tok);
				} else {
					while (opStack.length > 0) {
						var topOp = opStack[opStack.length - 1];
						if (topOp === '(') {
							break;
						} else {
							if (opToPrecMap[topOp] >= opToPrecMap[op]) {
								cachedParseRPN.push(topOp);
							} else {
								break;
							}
						}
						
						opStack.pop();
					}
					
					opStack.push(op);
				}
			}
			
			console.log("opStack: " + JSON.stringify(opStack));
		}
		
		while (opStack.length > 0) {
			var topOp = opStack.pop();
			if (topOp === '(' || topOp === ')') {
				break;
			} else {
				cachedParseRPN.push(topOp);
			}
		}
	}
	
	for (var i = 0; i < cachedParseRPN.length; i++) {
		if (typeof(cachedParseRPN[i]) !== 'number') {
			console.log("BAD RPN OP: rpn[" + i + "] = " + cachedParseRPN[i]);
		}
	}
	
	console.log(cachedParseRPN);
	
	//cachedParseRPN = [OPS.PUSH_ARG, 0, OPS.PUSH_LIT, 5, OPS.MUL, OPS.PUSH_LIT, 2, OPS.ADD];
}

function updateDisplay() {
	var slid = document.getElementById("slid11");
	var slidVal = document.getElementById('slidVal1');
	var outVal = document.getElementById('output1');
	
	slidVal.innerHTML = slid.value;
	
	var stack = [];
	for (var idx = 0; idx < cachedParseRPN.length; idx++) {
		if (cachedParseRPN[idx] == OPS.PUSH_ARG) {
			if (idx < cachedParseRPN.length - 1) {
				stack.push(parseInt(slid.value));
				idx++;
			} else {
				console.log("BAD PUSH_ARG");
			}
		} else if (cachedParseRPN[idx] == OPS.PUSH_LIT) {
			if (idx < cachedParseRPN.length - 1) {
				stack.push(cachedParseRPN[idx + 1]);
				idx++;
			} else {
				console.log("BAD PUSH_LIT");
			}
		} else if (cachedParseRPN[idx] == OPS.ADD) {
			if (stack.length >= 2) {
				var a = stack.pop();
				var b = stack.pop();
				stack.push(b + a);
			} else {
				console.log("BAD ADD");
			}
		} else if (cachedParseRPN[idx] == OPS.SUB) {
			if (stack.length >= 2) {
				var a = stack.pop();
				var b = stack.pop();
				stack.push(b - a);
			} else {
				console.log("BAD ADD");
			}
		} else if (cachedParseRPN[idx] == OPS.MUL) {
			if (stack.length >= 2) {
				var a = stack.pop();
				var b = stack.pop();
				stack.push(b * a);
			} else {
				console.log("BAD MUL");
			}
		} else if (cachedParseRPN[idx] == OPS.DIV) {
			if (stack.length >= 2) {
				var a = stack.pop();
				var b = stack.pop();
				stack.push(b / a);
			} else {
				console.log("BAD DIV");
			}
		} else {
			console.log("Invalid op: " + cachedParseRPN[idx]);
		}
		
		//console.log("stack: " + JSON.stringify(stack));
	}
	
	if (stack.length != 1) {
		console.log("BAD STACK AFTER EQU");
	} else {
		outVal.innerHTML = stack.pop();
	}
}

window.onload = function(){
	parseEquation();
	updateDisplay();

	document.getElementById("slid11").oninput = updateDisplay;
	document.getElementById("equ").onchange = function() { parseEquation(); updateDisplay(); }
};



