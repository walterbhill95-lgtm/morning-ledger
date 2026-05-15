const { chromium } = require('playwright');
const nodemailer = require('nodemailer');

(async () => {

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: {
      width: 1400,
      height: 1800
    }
  });

  await page.goto(
    'https://walterbhill95-lgtm.github.io/morning-ledger/',
    {
      waitUntil: 'networkidle'
    }
  );

  await page.screenshot({
    path: 'ledger.png',
    fullPage: false
  });

  await browser.close();


  // =========================
  // EMAIL
  // =========================

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: process.env.EMAIL_TO,

    subject: 'Morning Ledger',

    html: `
      <div style="background:#0f172a;padding:20px;">

        <img
          src="cid:ledger"
          style="width:100%;max-width:1200px;border-radius:20px;"
        />

      </div>
    `,

    attachments: [
      {
        filename: 'ledger.png',
        path: './ledger.png',
        cid: 'ledger'
      }
    ]

  });

})();