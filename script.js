const today = new Date();

const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
};

document.getElementById('current-date').textContent =
  today.toLocaleDateString('en-US', options);


// =========================
// GOOGLE SHEETS API
// =========================

const sheetApiUrl =
  "https://script.google.com/macros/s/AKfycbwsYYBPENLGUXWWpFupIh6eXaO-vZQDT_Cp5QlPUDqWpVEwWjdQaxArKW4B0ydtkg2K/exec";


// =========================
// GOOGLE SHEETS DATA
// =========================

fetch(sheetApiUrl)
  .then(response => response.json())
  .then(data => {
// =========================
// MARKET DATA
// =========================

const sp500Element =
  document.getElementById("sp500-price");

const sp500Value =
  Number(data.market.sp500);

sp500Element.textContent =
  `${sp500Value >= 0 ? "▲" : "▼"} ${Math.abs(sp500Value).toFixed(2)}%`;

sp500Element.classList.add(
  sp500Value >= 0 ? "green" : "red"
);


// NASDAQ

const nasdaqElement =
  document.getElementById("nasdaq-price");

const nasdaqValue =
  Number(data.market.nasdaq);

nasdaqElement.textContent =
  `${nasdaqValue >= 0 ? "▲" : "▼"} ${Math.abs(nasdaqValue).toFixed(2)}%`;

nasdaqElement.classList.add(
  nasdaqValue >= 0 ? "green" : "red"
);


// BITCOIN

document.getElementById("btc-price")
  .textContent =
  `$${Math.round(data.market.bitcoin).toLocaleString()}`;


// OIL

document.getElementById("oil-price")
  .textContent =
  `$${Number(data.market.oil).toFixed(2)}`;
    // TOTAL PORTFOLIO

    document.querySelector(".hero-value")
      .textContent =
      `$${Number(data.portfolio.totalValue).toLocaleString()}`;


    // YTD RETURN

    document.getElementById("ytd-return")
      .textContent =
      `${(Number(data.portfolio.ytdReturn) * 100).toFixed(2)}%`;


    // YTD GROWTH

    document.getElementById("ytd-growth")
      .textContent =
      `$${Number(data.portfolio.ytdGrowth).toLocaleString()}`;


    // CONTRIBUTIONS

    document.getElementById("contributions")
      .textContent =
      `$${Number(data.portfolio.contributions).toLocaleString()}`;


    // CASH POSITION

    document.getElementById("cash-position")
      .textContent =
      `$${Number(data.portfolio.cashPosition).toLocaleString()}`;


    // =========================
    // DAILY GAINS
    // =========================

    const dailyDollar =
      Number(data.portfolio.dailyDollarGain);

    const dailyPercent =
      Number(data.portfolio.dailyPercentGain);

    const dollarElement =
      document.getElementById("daily-dollar-gain");

    const percentElement =
      document.getElementById("daily-percent-gain");

    const isPositive =
      dailyDollar >= 0;

    const arrow =
      isPositive ? "▲" : "▼";

    dollarElement.textContent =
      `${arrow} $${Math.abs(dailyDollar).toLocaleString()} Today`;

    percentElement.textContent =
      `${arrow} ${(Math.abs(dailyPercent) * 100).toFixed(2)}%`;

    dollarElement.classList.add(
      isPositive ? "green" : "red"
    );

    percentElement.classList.add(
      isPositive ? "green" : "red"
    );


    // =========================
    // BILLS
    // =========================

    const billsContainer =
      document.getElementById("bills-container");

    billsContainer.innerHTML = "";

    let totalBills = 0;

    data.bills.forEach(bill => {

      totalBills += Number(bill.amount);

      billsContainer.innerHTML += `
        <div class="bill-row">

          <div>
            <h4>${bill.description}</h4>
            <p>Due ${bill.date}</p>
          </div>

          <span>
            $${Number(bill.amount).toLocaleString()}
          </span>

        </div>
      `;

    });

    billsContainer.innerHTML += `
      <div class="cash-summary">

        <div>
          <span>Total Upcoming Bills</span>
          <h3>$${totalBills.toLocaleString()}</h3>
        </div>

        <div>
          <span>Bills Due</span>
          <h3 class="green">
            ${data.bills.length}
          </h3>
        </div>

      </div>
    `;

  })
  .catch(error => {

    console.error("Google Sheets Error:", error);

  });