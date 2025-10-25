 
function showPage(page) {
    var tabs = document.querySelectorAll('.top-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    var tabMap = { 'home': 0, 'about': 1, 'info': 2, 'calc': 3 };
    if (tabMap[page] !== undefined) tabs[tabMap[page]].classList.add('active');

    let allPanels = [
        'home-panel', 'about-panel', 'info-panel', 'calc-panel'
    ];
    allPanels.forEach(function(id) {
        let el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    let target = document.getElementById(page + '-panel');
    if (target) target.classList.add('active');
}

function showCalc(which) {
    var tabs = document.querySelectorAll('.inner-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    var tabMap = { 'standard': 0, 'age': 1, 'bmi': 2, 'loan': 3 };
    if (tabMap[which] !== undefined) tabs[tabMap[which]].classList.add('active');
    let sections = ['standard-section', 'age-section', 'bmi-section', 'loan-section'];
    sections.forEach(function(id) {
        document.getElementById(id).classList.remove('active');
    });
    document.getElementById(which + '-section').classList.add('active');
     
    if (which === "age") {
        document.getElementById("currentdate").value = new Date().toISOString().split("T")[0];
    }
}

let currentInput = "";

function press(key) {
    currentInput += key;
    document.getElementById("display").value = currentInput;
}
function calculate() {
    try {
        let result = eval(currentInput);
        document.getElementById("display").value = result;
        addToHistory(currentInput, result);
        currentInput = result.toString();
    } catch {
        document.getElementById("display").value = "Error";
        currentInput = "";
    }
}
function clearDisplay() {
    currentInput = "";
    document.getElementById("display").value = "";
}
document.addEventListener("keydown", function(event) {
    if (event.key.match(/[0-9]/)) {
        press(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        press(event.key);
    } else if (event.key === ".") {
        press(".");
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
        event.preventDefault();
    } else if (event.key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        document.getElementById("display").value = currentInput;
    } else if (event.key.toLowerCase() === "c") {
        clearDisplay();
    }
});

function calculateAge() {
    var birth = document.getElementById("birthdate").value;
    var current = document.getElementById("currentdate").value;
    if (!birth || !current) {
        document.getElementById("age-result").innerText = "Please fill both dates.";
        return;
    }
    var birthDate = new Date(birth);
    var currentDate = new Date(current);
    var years = currentDate.getFullYear() - birthDate.getFullYear();
    var months = currentDate.getMonth() - birthDate.getMonth();
    var days = currentDate.getDate() - birthDate.getDate();
    if (days < 0) {
        months -= 1;
        days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    document.getElementById("age-result").innerText =
        "Age: " + years + " years, " + months + " months, " + days + " days";
}

function calculateBMI() {
    var height = parseFloat(document.getElementById("height").value);
    var weight = parseFloat(document.getElementById("weight").value);
    var units = document.getElementById("bmi-units").value;
    var resultDiv = document.getElementById("bmi-result");

    if (!height || !weight) {
        resultDiv.innerText = "Please enter both height and weight.";
        resultDiv.style.background = '';
        resultDiv.style.color = '';
        resultDiv.style.border = '';
        resultDiv.style.textShadow = '';
        return;
    }

    var bmi;
    if (units === "metric") {
        height = height / 100;
        bmi = weight / (height * height);
    } else {
        bmi = (weight / (height * height)) * 703;
    }
    bmi = Math.round(bmi * 10) / 10;

    var category, color, icon;
    if (bmi < 18.5) {
        category = "Underweight"; color = "#3498db"; icon = "🦴";
    } else if (bmi < 25) {
        category = "Normal"; color = "#27ae60"; icon = "💪";
    } else if (bmi < 30) {
        category = "Overweight"; color = "#f7ca18"; icon = "⚠️";
    } else {
        category = "Obese"; color = "#c0392b"; icon = "❗";
    }
    resultDiv.innerHTML = `BMI: <b>${bmi}</b> <span style="font-size:1.3em;">${icon}</span><br>${category}`;
    resultDiv.style.background = color;
    resultDiv.style.color = "#fff";
    resultDiv.style.border = "2px solid #444";
    resultDiv.style.textShadow = "1px 1px 3px #2224";
}

function calculateLoan() {
    var principal = parseFloat(document.getElementById("loan-principal").value);
    var rate = parseFloat(document.getElementById("loan-rate").value);
    var years = parseInt(document.getElementById("loan-years").value);

    if (!principal || !rate || !years) {
        document.getElementById("loan-result").innerText = "Please enter all loan details.";
        return;
    }

    var monthlyRate = rate / 100 / 12;
    var n = years * 12;
    var monthly;
    if (monthlyRate === 0) {
        monthly = principal / n;
    } else {
        monthly = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
    }
    monthly = monthly.toFixed(2);
    var totalPay = (monthly * n).toFixed(2);
    var totalInterest = (totalPay - principal).toFixed(2);

    document.getElementById("loan-result").innerHTML =
        "Monthly Payment: ₹" + monthly + "<br>" +
        "Total Payment: ₹" + totalPay + "<br>" +
        "Total Interest: ₹" + totalInterest;
}
 
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
    history.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function addToHistory(expression, result) {
    let history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
    history.push(expression + " = " + result);
    if (history.length > 10) history.shift();
    localStorage.setItem("calcHistory", JSON.stringify(history));
    loadHistory();
}
function clearHistory() {
    localStorage.removeItem("calcHistory");
    loadHistory();
}

window.onload = function() {
    loadHistory();
}
