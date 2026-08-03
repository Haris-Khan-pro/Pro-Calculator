"use strict";

/* ==========================================
   DOM Elements
========================================== */

const displayHistory = document.querySelector(".display-history");
const displayResult = document.querySelector(".display-result");
const buttons = document.querySelectorAll(".btn");

/* ==========================================
   Calculator State
========================================== */

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;

/* ==========================================
   Helper Functions
========================================== */

function updateDisplay() {
  displayResult.textContent = currentInput;
}

function calculate() {
  const previous = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  let result;

  switch (operator) {
    case "+":
      result = previous + current;
      break;

    case "−":
      result = previous - current;
      break;

    case "×":
      result = previous * current;
      break;

    case "÷":
      if (current === 0) {
        alert("Cannot divide by zero.");
        return;
      }

      result = previous / current;
      break;

    default:
      return;
  }

  currentInput = result.toString();

  previousInput = "";
  operator = null;
  shouldResetDisplay = true;

  updateDisplay();
}

/* ==========================================
   Events
========================================== */

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    // Numbers
    if (!isNaN(value)) {
      if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
      } else if (currentInput === "0") {
        currentInput = value;
      } else {
        currentInput += value;
      }

      updateDisplay();
    }

    // Decimal
    else if (value === ".") {
      if (shouldResetDisplay) {
        currentInput = "0.";
        shouldResetDisplay = false;
      } else if (!currentInput.includes(".")) {
        currentInput += ".";
      }

      updateDisplay();
    }

    // Operators
    else if (
      value === "+" ||
      value === "−" ||
      value === "×" ||
      value === "÷"
    ) {
      if (previousInput !== "" && !shouldResetDisplay) {
        calculate();
      }

      previousInput = currentInput;
      operator = value;
      shouldResetDisplay = true;
    }

    // Equals
    else if (value === "=") {
      calculate();
    }

    // Clear
    else if (value === "C") {
      currentInput = "0";
      previousInput = "";
      operator = null;
      shouldResetDisplay = false;

      updateDisplay();
    }
  });
});

/* ==========================================
   Initialize Calculator
========================================== */

updateDisplay();