// ===============================
// STATE
// ===============================

let previousOperand = "";
let currentOperand = "0";
let operator = null;
let justEvaluated = false; // true right after "=" — next digit starts fresh

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const keys = document.querySelectorAll(".key");


// ===============================
// DISPLAY FORMATTING
// ===============================

function formatNumber(value) {

    if (value === "" || value === undefined) return "";

    const [intPart, decimalPart] = value.split(".");

    // Add thousands separators to the integer part only
    const formattedInt = intPart === "" || intPart === "-"
        ? intPart
        : Number(intPart).toLocaleString("en-IN");

    return decimalPart !== undefined
        ? `${formattedInt}.${decimalPart}`
        : formattedInt;
}

function updateDisplay() {

    resultEl.classList.remove("error");
    resultEl.textContent = formatNumber(currentOperand);

    expressionEl.textContent = operator
        ? `${formatNumber(previousOperand)} ${operator}`
        : "";

    // Highlight the active operator key
    keys.forEach(function (key) {
        if (key.dataset.action === "operator") {
            key.classList.toggle(
                "is-active",
                key.dataset.operator === operator
            );
        }
    });
}


// ===============================
// CORE ACTIONS
// ===============================

function inputNumber(digit) {

    if (justEvaluated) {
        currentOperand = "0";
        previousOperand = "";
        operator = null;
        justEvaluated = false;
    }

    if (currentOperand === "0") {
        currentOperand = digit;
    } else {
        // Keep numbers to a sane length so the display never overflows
        if (currentOperand.replace("-", "").replace(".", "").length >= 15) return;
        currentOperand += digit;
    }

    updateDisplay();
}

function inputDecimal() {

    if (justEvaluated) {
        currentOperand = "0";
        previousOperand = "";
        operator = null;
        justEvaluated = false;
    }

    if (!currentOperand.includes(".")) {
        currentOperand += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {

    if (currentOperand === "Error") return;

    justEvaluated = false;

    // Chain operations: if an operator was already pending, resolve it first
    if (operator && previousOperand !== "") {
        evaluate();
    }

    previousOperand = currentOperand;
    currentOperand = "0";
    operator = nextOperator;

    updateDisplay();
}

function evaluate() {

    if (operator === null || previousOperand === "") return;

    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);

    if (Number.isNaN(prev) || Number.isNaN(curr)) return;

    let value;

    switch (operator) {
        case "+":
            value = prev + curr;
            break;
        case "−":
            value = prev - curr;
            break;
        case "×":
            value = prev * curr;
            break;
        case "÷":
            if (curr === 0) {
                showError();
                return;
            }
            value = prev / curr;
            break;
        default:
            return;
    }

    // Avoid floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
    value = Math.round((value + Number.EPSILON) * 1e10) / 1e10;

    currentOperand = String(value);
    previousOperand = "";
    operator = null;
    justEvaluated = true;

    updateDisplay();
}

function clearAll() {
    previousOperand = "";
    currentOperand = "0";
    operator = null;
    justEvaluated = false;
    updateDisplay();
}

function deleteLast() {

    if (justEvaluated || currentOperand === "Error") {
        clearAll();
        return;
    }

    currentOperand = currentOperand.length > 1
        ? currentOperand.slice(0, -1)
        : "0";

    updateDisplay();
}

function applyPercent() {

    if (currentOperand === "Error") return;

    const value = parseFloat(currentOperand) / 100;
    currentOperand = String(value);
    updateDisplay();
}

function showError() {
    previousOperand = "";
    operator = null;
    currentOperand = "Error";
    justEvaluated = true;

    resultEl.textContent = "Error";
    resultEl.classList.add("error");
    expressionEl.textContent = "Can't divide by zero";
}


// ===============================
// BUTTON CLICKS
// ===============================

keys.forEach(function (key) {

    key.addEventListener("click", function () {

        const action = key.dataset.action;

        if (action === "number") {
            inputNumber(key.dataset.number);
        } else if (action === "decimal") {
            inputDecimal();
        } else if (action === "operator") {
            chooseOperator(key.dataset.operator);
        } else if (action === "equals") {
            evaluate();
        } else if (action === "clear") {
            clearAll();
        } else if (action === "delete") {
            deleteLast();
        } else if (action === "percent") {
            applyPercent();
        }

    });

});


// ===============================
// KEYBOARD SUPPORT
// ===============================

const keyOperatorMap = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
};

window.addEventListener("keydown", function (event) {

    const { key } = event;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }

    if (key === ".") {
        inputDecimal();
        return;
    }

    if (key in keyOperatorMap) {
        event.preventDefault(); // stop "/" from triggering browser quick-find
        chooseOperator(keyOperatorMap[key]);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        evaluate();
        return;
    }

    if (key === "Backspace") {
        deleteLast();
        return;
    }

    if (key === "Escape") {
        clearAll();
        return;
    }

    if (key === "%") {
        applyPercent();
    }

});


// ===============================
// INIT
// ===============================

updateDisplay();
