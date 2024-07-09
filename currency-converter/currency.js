document.addEventListener("DOMContentLoaded", () => {
  const rates = {
    timestamp: Date.now(),
    base: "EUR",
    date: new Date().toISOString().split("T")[0],
    rates: {
      USD: 1.23,
      GBP: 0.88,
      EUR: 1.82,
    },
  };

  const insertRateForm = document.getElementById("insertRateForm");
  const convertForm = document.getElementById("convertForm");
  const updateRateForm = document.getElementById("updateRateForm");
  const conversionResult = document.getElementById("conversionResult");
  const insertConfirmation = document.getElementById("insertConfirmation");
  const updateConfirmation = document.getElementById("updateConfirmation");

  insertRateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const baseCurrency = document
      .getElementById("baseCurrency")
      .value.toUpperCase.trim();
    const targetCurrency = document
      .getElementById("targetCurrency")
      .value.toUpperCase.trim();
    const rate = parseFloat(document.getElementById("rate").value);

    rates.base = baseCurrency;
    rates.rates[targetCurrency] = rate;

      console.log("Inserted new rate:", rates);
    insertConfirmation.textContent = `Inserted new rate: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
    insertConfirmation.style.color = "green";
  });

  convertForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document
      .getElementById("fromCurrency")
      .value.toUpperCase.trim();
    const toCurrency = document
      .getElementById("toCurrency")
      .value.toUpperCase.trim();

    if (rates.base === fromCurrency && rates.rates[toCurrency]) {
      const convertedAmount = amount * rates.rates[toCurrency];
      conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`;
    } else {
      conversionResult.textContent = "Conversion rate not available.";
    }
  });

  updateRateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const baseCurrency = document
      .getElementById("updateBaseCurrency")
      .value.toUpperCase.trim();
    const targetCurrency = document
      .getElementById("updateTargetCurrency")
      .value.toUpperCase.trim();
    const rate = parseFloat(document.getElementById("updateRate").value);

    if (rates.base === baseCurrency) {
      rates.rates[targetCurrency] = rate;
      console.log("Updated rate:", rates);
      updateConfirmation.textContent = `Updated rate: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
      updateConfirmation.style.color = "green";
    } else {
      alert(
        updateConfirmation.textContent = `Base currency does not match the existing base currency: ${rates.base}`;
      updateConfirmation.style.color = "black";
      );
    }
  });
});
