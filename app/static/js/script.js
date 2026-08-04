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
let calculationFinished = false;

/* ==========================================
   Helper Functions
========================================== */

function formatNumber(number) {
  const value = Number(number);

  if (isNaN(value)) {
    return number;
  }

  if (Math.abs(value) >= 1e12) {
    return value.toExponential(6);
  }

  return value.toLocaleString();
}

function updateDisplay() {
  displayResult.textContent = formatNumber(currentInput);

  // Don't overwrite history after pressing =
  if (calculationFinished) {
    return;
  }

  if (previousInput && operator) {
    if (shouldResetDisplay) {
      displayHistory.textContent = `${formatNumber(previousInput)} ${operator}`;
    } else {
      displayHistory.textContent = `${formatNumber(previousInput)} ${operator} ${formatNumber(currentInput)}`;
    }
  } else {
    displayHistory.textContent = "";
  }
}

/* ==========================================
   Calculation
========================================== */

function calculate() {
  const previous = Number(previousInput);
  const current = Number(currentInput);

  if (isNaN(previous) || isNaN(current)) return;

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

  // Keep the completed calculation in history
  displayHistory.textContent = `${formatNumber(previousInput)} ${operator} ${formatNumber(currentInput)}`;

  currentInput = result.toString();

  previousInput = "";
  operator = null;

  shouldResetDisplay = true;
  calculationFinished = true;

  displayResult.textContent = formatNumber(currentInput);
}
/* ==========================================
   Button Events
========================================== */

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent.trim();

    /* ==========================
       Numbers
    ========================== */

    if (!isNaN(value) && value !== "") {
      if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
        calculationFinished = false;
      } else if (currentInput === "0") {
        currentInput = value;
      } else {
        currentInput += value;
      }

      updateDisplay();
    } else if (value === ".") {
      /* ==========================
       Decimal
    ========================== */
      if (shouldResetDisplay) {
        currentInput = "0.";
        shouldResetDisplay = false;
      } else if (!currentInput.includes(".")) {
        currentInput += ".";
      }

      updateDisplay();
    } else if (value === "⌫") {
      /* ==========================
       Backspace
    ========================== */
      if (shouldResetDisplay) {
        currentInput = "0";
        shouldResetDisplay = false;
      } else if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
      } else {
        currentInput = "0";
      }

      updateDisplay();
    } else if (value === "C") {
      /* ==========================
       Clear
    ========================== */
      currentInput = "0";
      previousInput = "";
      operator = null;
      shouldResetDisplay = false;
      calculationFinished = false;
      displayHistory.textContent = "";

      updateDisplay();
    } else if (value === "±") {
      /* ==========================
       Plus / Minus
    ========================== */
      currentInput = (-Number(currentInput)).toString();

      updateDisplay();
    } else if (value === "%") {
      /* ==========================
       Percentage
    ========================== */
      currentInput = (Number(currentInput) / 100).toString();

      updateDisplay();
    } else if (["+", "−", "×", "÷"].includes(value)) {
      /* ==========================
       Operators
    ========================== */
      if (previousInput !== "" && !shouldResetDisplay) {
        calculate();
      }

      previousInput = currentInput;
      operator = value;
      shouldResetDisplay = true;

      updateDisplay();
    } else if (value === "=") {
      /* ==========================
       Equals
    ========================== */
      if (previousInput === "" || operator === null) {
        return;
      }

      calculate();
    }
  });
});
/* ==========================================
   Keyboard Support
========================================== */

document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Numbers
  if (!isNaN(key) && key !== " ") {
    document
      .querySelector(
        `.btn:not(.btn-zero):not(.btn-operator):not(.btn-secondary):not(.btn-equals)`,
      )
      ?.blur();

    buttons.forEach((button) => {
      if (button.textContent.trim() === key) {
        button.click();
      }
    });
  }

  // Decimal
  else if (key === ".") {
    buttons.forEach((button) => {
      if (button.textContent.trim() === ".") {
        button.click();
      }
    });
  }

  // Operators
  else if (key === "+") {
    buttons.forEach((button) => {
      if (button.textContent.trim() === "+") {
        button.click();
      }
    });
  } else if (key === "-") {
    buttons.forEach((button) => {
      if (button.textContent.trim() === "−") {
        button.click();
      }
    });
  } else if (key === "*") {
    buttons.forEach((button) => {
      if (button.textContent.trim() === "×") {
        button.click();
      }
    });
  } else if (key === "/") {
    event.preventDefault();

    buttons.forEach((button) => {
      if (button.textContent.trim() === "÷") {
        button.click();
      }
    });
  }

  // Equals
  else if (key === "Enter" || key === "=") {
    event.preventDefault();

    buttons.forEach((button) => {
      if (button.textContent.trim() === "=") {
        button.click();
      }
    });
  }

  // Backspace
  else if (key === "Backspace") {
    event.preventDefault();

    buttons.forEach((button) => {
      if (button.textContent.trim() === "⌫") {
        button.click();
      }
    });
  }

  // Escape = Clear
  else if (key === "Escape") {
    buttons.forEach((button) => {
      if (button.textContent.trim() === "C") {
        button.click();
      }
    });
  }
});

/* ==========================================
   Initialize Calculator
========================================== */

updateDisplay();
