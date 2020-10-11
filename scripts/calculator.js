function add (a, b) {
	return a + b;
}

function subtract (a, b) {
	return a - b;
}

function multiply (a, b) {
	return a * b;
}

function divide (a, b) {
	if (b === 0) {
		return "Error. Division by 0.";
	} else {
		return a / b;
	}
}

function operate(op, a, b) {
	switch (op) {
		case "+":
			return add(a, b);
		case "-":
			return subtract(a, b);
		case "*":
			return multiply(a, b);
		case "/":
			return divide(a, b);
		default:
			return `Error. No such operator (${ op }).`;
	}
}

const conversionTable = {
	add: "+",
	subtract: "-",
	multiply: "*",
	divide: "/",
	zero: "0",
	one: "1",
	two: "2",
	three: "3",
	four: "4",
	five: "5",
	six: "6",
	seven: "7",
	eight: "8",
	nine: "9",
	clear: "Delete",
	backspace: "Backspace",
	equal: "Enter",
	decimal: ".",
};

const decimalBtn = document.querySelector("#decimal");
const display = document.querySelector("#display");
const buttons = document.querySelectorAll(".button");

/*
	Display management functions
*/

function updateDisplay(t) {
	display.textContent = display.textContent + t;
}

function changeDisplay (t) {
	display.textContent = t;
}

function eraseDisplay() {
	display.textContent = "0";
	display.classList.add("result");
}

function removeLast() {
	display.textContent = display.textContent.slice(0, -1);
}

function processClick(elem) {
	// TODO: Saisie des signes + ou - non-opérateur
	switch (elem) {
		case "equal":
			allowDecimal();
			let formula = display.textContent;
			let result = evaluateFormula(formula);
			if (result !== "No Formula") {
				display.classList.add("result");
				changeDisplay(result);
			}
			break;
		case "clear":
			allowDecimal();
			eraseDisplay();
			break;
		case "backspace":
			if (displayResult() || display.textContent.length === 1) {
				eraseDisplay();
			} else {
				removeLast();
			}
			break;
		case "decimal":
			if (decimalAllowed()) {
				updateDisplay(".");
				toggleDecimal();
			}
			break;
		default:
			if (document.getElementById(elem).classList.contains("operator")) {
				if (displayResult()) {
					display.classList.remove("result");
				}
				// Try to evaluate the formula
				// (prevents evaluating more than one operation at a time)
				let formula = display.textContent;
				let result = evaluateFormula(formula);
				if (result !== "No Formula") {
					changeDisplay(result);
				}
				updateDisplay(conversionTable[elem]);
				allowDecimal();
			} else {
				if (displayResult()) {
					changeDisplay(conversionTable[elem]);
					display.classList.remove("result");
				} else {
					updateDisplay(conversionTable[elem]);
				}
			}
			break;
	}
}

function displayResult() {
	return display.classList.contains("result");
}

function allowDecimal() {
	if (!decimalAllowed()) {
		decimalBtn.classList.remove("disabled");
	}
}

function toggleDecimal() {
	decimalBtn.classList.toggle("disabled");
}

function decimalAllowed() {
	return !decimalBtn.classList.contains("disabled");
}

function simulateClick(elem) {
	let btnId = getBtnId(elem);
	if (btnId !== "Not Found") {
		processClick(btnId);
	}
}

function getBtnId(key) {
	for (const prop in conversionTable) {
		if (conversionTable[prop] === key) {
			return prop;
		}
	}
	return "Not Found";
}

function changeBackground(elem) {
	if (elem !== "Not Found") {
		document.getElementById(elem).classList.add("active");
	}
}

function restoreBackGround(elem) {
	if (elem !== "Not Found") {
		document.getElementById(elem).classList.remove("active");
	}
}

function evaluateFormula(formula) {
	// TODO: Gestion des nombres négatifs
	let operator = formula.match(/[^\d.]/);
	if (!operator) {
		return "No Formula";
	} else {
		let numbers = formula.split(operator).filter((elem) => elem);
		console.log(numbers);
		if (numbers.length < 2) {
			return "No Formula";
		} else {
			let result = operate(operator[0], Number(numbers[0]), Number(numbers[1]));
			if (/Error/i.test(result)) {
				return "No Formula";
			} else {
				return result;
			}
		}
	}
}

buttons.forEach((elem) => elem.addEventListener("mousedown", (e) => changeBackground(e.target.id)));
buttons.forEach((elem) => elem.addEventListener("mouseup", (e) => {
	restoreBackGround(e.target.id);
	processClick(e.target.id);
}));
document.addEventListener("keydown", (e) => changeBackground(getBtnId(e.key)));
document.addEventListener("keyup", (e) => {
	restoreBackGround(getBtnId(e.key));
	simulateClick(e.key);
});