// Parent journey in the mobile app (/): consult flow, booking, find flow, enquiry, profile, community, guides.
const path = require('path');
const { open } = require('./capture-lib.cjs');
const OUT = process.argv[2] || path.join(__dirname, '..', 'shots');
(async () => {
  const { browser, page, view, long, settle } = await open(OUT);
  const B = 'http://127.0.0.1:5173';
  const tap = async (sel, opts) => { await page.locator(sel, opts).first().click(); };
  const txt = (t) => page.getByRole('button', { name: t }).first().click();

  await page.goto(B + '/'); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await page.goto(B + '/');
  await view('p01-home', 1500, { live: ['.ba-choice-main'], find: ['.ba-choice-alt'] });
  await tap('.ba-choice-main'); await view('p02-q-age', 700, { age: ['.ba-opt', '5 to 11'] });
  await page.locator('.ba-screen.ba-on .ba-opt', { hasText: '5 to 11' }).click(); await view('p03-q-age-picked', 150);
  await settle(900); await view('p04-q-needs', 700, { speech: ['.ba-opt', 'Speech and communication'], sensory: ['.ba-opt', 'Sensory'], cont: ['.ba-btn-primary'] });
  await page.locator('.ba-screen.ba-on .ba-opt', { hasText: 'Speech and communication' }).click();
  await page.locator('.ba-screen.ba-on .ba-opt', { hasText: 'Sensory' }).click(); await view('p05-q-needs-picked', 300);
  await page.locator('.ba-screen.ba-on .ba-btn-primary').click(); await view('p06-q-help', 700, { talk: ['.ba-opt', 'Talk it through'] });
  await page.locator('.ba-screen.ba-on .ba-opt', { hasText: 'Talk it through' }).click(); await view('p07-q-help-picked', 150);
  await settle(1200); await long('p08-consult-results', 'app', { tom: ['.ba-spec', 'Tom Ellis'], tombook: ['.ba-spec:nth-of-type(2) .ba-btn'] });
  await page.locator('.ba-screen.ba-on .ba-spec', { hasText: 'Tom Ellis' }).locator('.ba-btn').click();
  await settle(900); await page.fill('#ba-childIn', 'Leo');
  const fixMsg = async () => { const v = await page.inputValue('#ba-msgIn'); await page.fill('#ba-msgIn', v.replace(/\bJames\b/g, 'Tom').replace(/\bHarbour Play OT\b/g, 'Brightsteps OT')); };
  await fixMsg(); await long('p09-booking', 'app', { share: ['.ba-consent'], req: ['.ba-btn-primary', 'Request booking'] });
  await page.locator('.ba-screen.ba-on .ba-consent input').first().check();
  await page.locator('.ba-screen.ba-on .ba-consent input').nth(1).check();
  await page.locator('.ba-screen.ba-on .ba-btn-primary', { hasText: 'Request booking' }).click(); await view('p10-booking-sent', 1200, { home: ['.ba-btn-primary', 'Back to home'] });

  // Find local support
  await page.locator('.ba-screen.ba-on .ba-btn-primary', { hasText: 'Back to home' }).click(); await settle(900);
  await tap('.ba-choice-alt'); await settle(900);
  await view('p11-find-map', 700, { sw: ['path[aria-label="South West"]'] });
  await page.locator('.ba-screen.ba-on [data-r="sw"], .ba-screen.ba-on path[aria-label*="South West"], .ba-screen.ba-on g[aria-label*="South West"]').first().click().catch(async () => {
    console.log('region selector fallback'); await page.evaluate(() => { const el = [...document.querySelectorAll('.ba-screen.ba-on [aria-label]')].find((e) => /South West/.test(e.getAttribute('aria-label'))); el && el.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  });
  await view('p12-find-region', 900);
  await page.locator('.ba-screen.ba-on .ba-more').click().catch(() => {}); await settle(1200);
  await view('p13-find-categories', 700, { therapy: ['.ba-cat'] });
  await page.locator('.ba-screen.ba-on .ba-cat').first().click(); await settle(1200);
  await long('p14-find-results', 'app', { enquire: ['.ba-btn-outline', 'Enquire'] });
  await page.locator('.ba-screen.ba-on .ba-btn-outline', { hasText: 'Enquire' }).first().click(); await settle(900);
  await page.fill('#ba-childIn', 'Leo'); await fixMsg();
  await long('p15-enquiry', 'app', { share: ['.ba-consent'], send: ['.ba-btn-primary', 'Send enquiry'] });
  await page.locator('.ba-screen.ba-on .ba-consent input').first().check();
  await page.locator('.ba-screen.ba-on .ba-btn-primary', { hasText: 'Send enquiry' }).click(); await view('p16-enquiry-sent', 1200, { profile: ['.ba-btn-ghost', 'profile'] });
  await page.locator('.ba-screen.ba-on .ba-btn-ghost', { hasText: 'profile' }).click(); await settle(1000);
  await long('p17-profile', 'app');

  // Community and guides (site pages)
  await page.goto(B + '/community'); await long('p18-community', 'site');
  await page.goto(B + '/guides'); await long('p19-guides', 'site');
  await browser.close();
})();
