document.addEventListener("DOMContentLoaded", () => {
  const currencyRates = [
    {
      base: "EUR",
      rates: {
        USD: 1.23,
        GBP: 0.88,
        JPY: 133.45,
      },
    },
    {
      base: "USD",
      rates: {
        EUR: 0.81,
        GBP: 0.72,
        JPY: 108.42,
      },
    },
    {
      base: "GBP",
      rates: {
        EUR: 1.14,
        USD: 1.39,
        JPY: 150.87,
      },
    },
  ];

  displayRates(currencyRates);

  document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const fromCurrency = document
      .getElementById("searchFromCurrency")
      .value.toUpperCase()
      .trim();
    const toCurrency = document
      .getElementById("searchToCurrency")
      .value.toUpperCase()
      .trim();
    const searchResult = document.getElementById("searchResult");

    if (fromCurrency && toCurrency) {
      const rateObj = currencyRates.find((rate) => rate.base === fromCurrency);
      if (rateObj && rateObj.rates[toCurrency]) {
        const rate = rateObj.rates[toCurrency];
        searchResult.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
        searchResult.style.color = "black";
      } else {
        searchResult.textContent = "Currency rate not found.";
        searchResult.style.color = "red";
      }
    } else if (fromCurrency) {
      const rateObj = currencyRates.find((rate) => rate.base === fromCurrency);
      if (rateObj) {
        searchResult.innerHTML = `Rates for ${fromCurrency}:<br>`;
        for (const [targetCurrency, rate] of Object.entries(rateObj.rates)) {
          searchResult.innerHTML += `1 ${fromCurrency} = ${rate} ${targetCurrency}<br>`;
        }
        searchResult.style.color = "black";
      } else {
        searchResult.textContent = "Currency rates not found.";
        searchResult.style.color = "red";
      }
    } else if (toCurrency) {
      let ratesFound = false;
      searchResult.innerHTML = `Rates to ${toCurrency}:<br>`;
      currencyRates.forEach((rateObj) => {
        if (rateObj.rates[toCurrency]) {
          const rate = rateObj.rates[toCurrency];
          searchResult.innerHTML += `1 ${rateObj.base} = ${rate} ${toCurrency}<br>`;
          ratesFound = true;
        }
      });
      if (!ratesFound) {
        searchResult.textContent = "Currency rates not found.";
        searchResult.style.color = "red";
      } else {
        searchResult.style.color = "black";
      }
    } else {
      searchResult.textContent = "Please enter at least one currency.";
      searchResult.style.color = "red";
    }
  });

  document
    .getElementById("insertRateForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const baseCurrency = document
        .getElementById("baseCurrency")
        .value.toUpperCase()
        .trim();
      const targetCurrency = document
        .getElementById("targetCurrency")
        .value.toUpperCase()
        .trim();
      const rate = parseFloat(document.getElementById("rate").value);

      let rateObj = currencyRates.find((rate) => rate.base === baseCurrency);
      if (!rateObj) {
        rateObj = { base: baseCurrency, rates: {} };
        currencyRates.push(rateObj);
      }
      rateObj.rates[targetCurrency] = rate;

      console.log("Inserted new rate:", currencyRates);
      const insertConfirmation = document.getElementById("insertConfirmation");
      insertConfirmation.textContent = `Inserted new rate: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
      insertConfirmation.style.color = "black";
      displayRates(currencyRates);
    });

  document.getElementById("convertForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document
      .getElementById("fromCurrency")
      .value.toUpperCase()
      .trim();
    const toCurrency = document
      .getElementById("toCurrency")
      .value.toUpperCase()
      .trim();

    const rateObj = currencyRates.find((rate) => rate.base === fromCurrency);
    if (rateObj && rateObj.rates[toCurrency]) {
      const convertedAmount = amount * rateObj.rates[toCurrency];
      const conversionResult = document.getElementById("conversionResult");
      conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(
        2
      )} ${toCurrency}`;
    } else {
      const conversionResult = document.getElementById("conversionResult");
      conversionResult.textContent = "Conversion rate not available.";
    }
  });

  document
    .getElementById("updateRateForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const baseCurrency = document
        .getElementById("updateBaseCurrency")
        .value.toUpperCase()
        .trim();
      const targetCurrency = document
        .getElementById("updateTargetCurrency")
        .value.toUpperCase()
        .trim();
      const rate = parseFloat(document.getElementById("updateRate").value);

      const rateObj = currencyRates.find((rate) => rate.base === baseCurrency);
      if (rateObj) {
        rateObj.rates[targetCurrency] = rate;
        console.log("Updated rate:", currencyRates);
        const updateConfirmation =
          document.getElementById("updateConfirmation");
        updateConfirmation.textContent = `Updated rate: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
        updateConfirmation.style.color = "black";
        displayRates(currencyRates);
      } else {
        const updateConfirmation =
          document.getElementById("updateConfirmation");
        updateConfirmation.textContent = `Base currency does not match any existing base currency.`;
        updateConfirmation.style.color = "red";
      }
    });

  function displayRates(ratesArray) {
    const ratesTableBody = document.querySelector("#ratesTable tbody");
    ratesTableBody.innerHTML = "";

    ratesArray.forEach((rateObj) => {
      const baseCurrency = rateObj.base;
      for (const [targetCurrency, rate] of Object.entries(rateObj.rates)) {
        const rateRow = document.createElement("tr");

        const baseCurrencyCell = document.createElement("td");
        baseCurrencyCell.textContent = baseCurrency;
        rateRow.appendChild(baseCurrencyCell);

        const targetCurrencyCell = document.createElement("td");
        targetCurrencyCell.textContent = targetCurrency;
        rateRow.appendChild(targetCurrencyCell);

        const rateCell = document.createElement("td");
        rateCell.textContent = rate;
        rateRow.appendChild(rateCell);

        ratesTableBody.appendChild(rateRow);
      }
    });
  }
});
