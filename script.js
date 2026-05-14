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
// API KEY
// =========================

const apiKey = "d82dbhhr01qmgc0fme10d82dbhhr01qmgc0fme1g";


// =========================
// GOOGLE SHEETS API
// =========================

const sheetApiUrl =
  "https://script.google.com/macros/s/AKfycbwsYYBPENLGUXWWpFupIh6eXaO-vZQDT_Cp5QlPUDqWpVEwWjdQaxArKW4B0ydtkg2K/exec";


// =========================
// BITCOIN
// =========================

fetch(`https://finnhub.io/api/v1/quote?symbol=BINANCE:BTCUSDT&token=${apiKey}`)
  .then(response => response.json())
  .then(data => {

    document.getElementById("btc-price")
      .textContent =
      `$${Math.round(data.c).toLocaleString()}`;

  });


// =========================
// S&P 500
// =========================

fetch(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${apiKey}`)
  .then(response => response.json())
  .then(data => {

    const element =
      document.getElementById("sp500-price");

    const change =
      Number(data.dp).toFixed(2);

    const arrow =
      data.dp >= 0 ? "▲" : "▼";

    element.textContent =
      `${arrow} ${Math.abs(change)}%`;

    element.classList.add(
      data.dp >= 0 ? "green" : "red"
    );

  });


// =========================
// NASDAQ
// =========================

fetch(`https://finnhub.io/api/v1/quote?symbol=QQQ&token=${apiKey}`)
  .then(response => response.json())
  .then(data => {

    const element =
      document.getElementById("nasdaq-price");

    const change =
      Number(data.dp).toFixed(2);

    const arrow =
      data.dp >= 0 ? "▲" : "▼";

    element.textContent =
      `${arrow} ${Math.abs(change)}%`;

    element.classList.add(
      data.dp >= 0 ? "green" : "red"
    );

  });


// =========================
// OIL
// =========================

fetch(`https://finnhub.io/api/v1/quote?symbol=USO&token=${apiKey}`)
  .then(response => response.json())
  .then(data => {

    document.getElementById("oil-price")
      .textContent =
      `$${Number(data.c).toFixed(2)}`;

  });


// =========================
// HEADLINES
// =========================

fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`)
  .then(response => response.json())
  .then(data => {

    const container =
      document.getElementById("headlines-container");

    container.innerHTML = "";

    data.slice(0, 3).forEach(article => {

      container.innerHTML += `
        <div class="headline">

          <div class="headline-source">
            ${article.source}
          </div>

          <h3>${article.headline}</h3>

          <p>
            ${article.summary
              ? article.summary.substring(0, 140) + "..."
              : ""}
          </p>

        </div>
      `;

    });

  });


// =========================
// GOOGLE SHEETS DATA
// =========================

fetch(sheetApiUrl)
  .then(response => response.json())
  .then(data => {

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