document.addEventListener("DOMContentLoaded", async () => {
  let currencyRates = [];

  async function fetchCurrencyRates() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/DennisAgyekum/DennisAgyekum.github.io/368fd5911e26f0dfeb91916f697293e1723f9aff/currency/currency-data.Json"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching currency rates:", error);
      return [];
    }
  }

  currencyRates = await fetchCurrencyRates();
  displayRates(currencyRates);
  watchCurrency();
  displayHottestRate();

  function getTimeRemaining(endTime) {
    const now = new Date();
    const timeUntilEvent = endTime - now;
    const hours = Math.floor(timeUntilEvent / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeUntilEvent % (1000 * 60)) / 1000);
    return { timeUntilEvent, hours, minutes, seconds };
  }

  function updateCountdownAndStatus(timeUntilEvent, status) {
    const countDown = document.getElementById("countdown");
    countDown.innerText = `Market is ${status} until next ${timeUntilEvent.hours}h : ${timeUntilEvent.minutes}m : ${timeUntilEvent.seconds}s`;
    countDown.style.color = status === "open" ? "green" : "red";
  }

  function getMarketTimes() {
    const now = new Date();
    const marketOpen = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9,
      0,
      0,
      0
    );
    const marketClose = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17,
      0,
      0,
      0
    );

    if (now > marketClose) {
      marketOpen.setDate(marketOpen.getDate() + 1);
    }
    if (now > marketClose || now < marketOpen) {
      marketClose.setDate(marketClose.getDate() + 1);
    }

    return { marketOpen, marketClose };
  }

  function initializeAnnouncements() {
    setInterval(() => {
      const now = new Date();
      const { marketOpen, marketClose } = getMarketTimes();

      if (now >= marketOpen && now < marketClose) {
        const timeRemaining = getTimeRemaining(marketClose);
        updateCountdownAndStatus(timeRemaining, "open");
      } else {
        const timeRemaining = getTimeRemaining(marketOpen);
        updateCountdownAndStatus(timeRemaining, "closed");
      }
    }, 1000);
  }

  initializeAnnouncements();

  function watchCurrency() {
    const watchBaseCurrency = "USD";
    const watchTargetCurrency = "JPY";
    const targetRate = 180;
    const watchInterval = 10000;

    setInterval(() => {
      const rateObj = currencyRates.find(
        (rate) => rate.base === watchBaseCurrency
      );
      if (rateObj && rateObj.rates[watchTargetCurrency]) {
        const currentRate = rateObj.rates[watchTargetCurrency];
        if (currentRate >= targetRate) {
          alert(
            `Alert! 1 ${watchBaseCurrency} = ${currentRate} ${watchTargetCurrency}`
          );
        }
      }
    }, watchInterval);
  }

  function displayHottestRate() {
    const hottestRateBanner = document.getElementById("hottestRateBanner");
    hottestRateBanner.style.color = "white";

    function updateHottestRate() {
      let hottestRate = 0;
      let hottestRateInfo = "";

      currencyRates.forEach((rateObj) => {
        const baseCurrency = rateObj.base;
        for (const [targetCurrency, rate] of Object.entries(rateObj.rates)) {
          if (rate > hottestRate) {
            hottestRate = rate;
            hottestRateInfo = `1 ${baseCurrency} = ${rate} ${targetCurrency}`;
          }
        }
      });

      hottestRateBanner.textContent = `Hottest Rate: ${hottestRateInfo}`;
    }

    setInterval(updateHottestRate, 10000);
  }

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

