const BASE_URL = "https://api.exchangerate.host/latest";
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const convertBtn = document.getElementById("convertBtn");
const resultText = document.getElementById("resultText");
const amountInput = document.getElementById("amount");
const voiceBtn = document.getElementById("voiceBtn");

// Populate currency dropdowns
/*async function populateCurrencies() {
  const res = await fetch("https://api.exchangerate.host/symbols");
  const data = await res.json();
  const currencies = Object.keys(data.symbols);

  currencies.forEach(code => {
    const option1 = new Option(code, code);
    const option2 = new Option(code, code);
    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  });

  fromCurrency.value = "USD";
  toCurrency.value = "INR";
}*/
async function populateCurrencies() {
  const apiUrl = "https://api.exchangerate.host/symbols";
  const res = await fetch(apiUrl + '/currencies');
  const data = await res.json();

  // Check if data and data.rates exist and are objects
  if (data && typeof data === 'object' && data.rates && typeof data.rates === 'object') {
    for (const currency in data.rates) { // This is line 15
      const option = document.createElement('option');
      option.value = currency;
      option.text = currency;
      dropdowns.forEach(dropdown => dropdown.add(option));
    }
  } else {
    console.error('Failed to fetch or process currency data:', data);
    // Handle the error appropriately, e.g., display a message to the user
  }
}

// Update flag
function updateFlag(code, element) {
  element.src = `https://flagsapi.com/${code.slice(0, 2)}/flat/64.png`;
}

// Convert
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    resultText.textContent = "Enter a valid amount.";
    return;
  }

  const res = await fetch(`${BASE_URL}?base=${from}&symbols=${to}`);
  const data = await res.json();
  const rate = data.rates[to];
  resultText.textContent = `${amount} ${from} = ${(amount * rate).toFixed(2)} ${to}`;
}

// Event listeners
[fromCurrency, toCurrency].forEach(select => {
  select.addEventListener("change", () => {
    updateFlag(fromCurrency.value, fromFlag);
    updateFlag(toCurrency.value, toFlag);
  });
});

document.querySelector(".swap-btn").addEventListener("click", () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  updateFlag(fromCurrency.value, fromFlag);
  updateFlag(toCurrency.value, toFlag);
});

convertBtn.addEventListener("click", (e) => {
  e.preventDefault();
  convertCurrency();
});

// Voice input
voiceBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = function (event) {
    const spoken = event.results[0][0].transcript;
    const number = spoken.replace(/[^\d.]/g, "");
    amountInput.value = number;
  };
});

// Init
populateCurrencies();
