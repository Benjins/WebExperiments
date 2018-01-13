var OPS = {
	PUSH_ARG: 0,
	PUSH_LIT: 1,
	ADD: 2,
	SUB: 3,
	MULTIPLY: 4,
	DIVIDE: 5
};

var cachedParseRPN = [];

function parseEquation() {
	var code = document.getElementById('equ').value;
	
	cachedParseRPN = [OPS.PUSH_ARG, 0, OPS.PUSH_LIT, 5, OPS.MULTIPLY, OPS.PUSH_LIT, 2, OPS.ADD];
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
				stack.push(slid.value);
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
				stack.push(a + b);
			} else {
				console.log("BAD ADD");
			}
		} else if (cachedParseRPN[idx] == OPS.SUB) {
			if (stack.length >= 2) {
				var a = stack.pop();
				var b = stack.pop();
				stack.push(a - b);
			} else {
				console.log("BAD ADD");
			}
		} else if (cachedParseRPN[idx] == OPS.MULTIPLY) {
			if (stack.length >= 2) {
				var a = stack.pop();
				var b = stack.pop();
				stack.push(a * b);
			} else {
				console.log("BAD MULTIPLY");
			}
		} else if (cachedParseRPN[idx] == OPS.DIVIDE) {
			if (stack.length >= 2) {
				var a = stack.pop();
				var b = stack.pop();
				stack.push(a / b);
			} else {
				console.log("BAD DIVIDE");
			}
		} else {
			console.log("Invalid op: " + cachedParseRPN[idx]);
		}
		
		console.log("stack: " + stack);
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
};



