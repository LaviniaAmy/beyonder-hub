// Provider and admin screens on the site (mobile view).
const path = require('path');
const { open } = require('./capture-lib.cjs');
const OUT = process.argv[2] || path.join(__dirname, '..', 'shots');
const STEP = process.argv[3] || 'all';
(async () => {
  const { browser, page, view, long, login, settle } = await open(OUT);
  const B = 'http://127.0.0.1:5173';
  const describe = async () => console.log(await page.evaluate(() => [...document.querySelectorAll('select')].map((s) => [...s.options].map((o) => o.textContent).join('|')).join(' || ')));

  if (STEP === 'all' || STEP === 'pro') {
    await page.goto(B + '/for-providers'); await long('v01-for-providers', 'site');
    await page.goto(B + '/provider/1'); await long('v02-provider-page', 'site', { claim: ['!button', 'Claim this profile'] });
    await page.getByRole('button', { name: /Claim this profile/i }).first().click().catch((e) => console.log('no claim btn', e.message));
    await view('v03-claim', 1200); console.log('claim url', page.url());
    await login('Therapist'); await long('v04-pro-overview', 'site', { enq: ['!button', 'Enquiries'], listing: ['!button', 'Listing Details'], tiles: ['!div', 'Enquiries1'] });
    for (const [tab, name] of [['Enquiries', 'v05-pro-enquiries'], ['Listing Details', 'v06-pro-listing'], ['Profile', 'v07-pro-profile']]) {
      await page.getByRole('button', { name: tab, exact: true }).first().click().catch((e) => console.log('tab', tab, e.message));
      await long(name, 'site', { avail: ['!button', 'Availability Calendar'], status: ['!button', 'Availability Status'] });
    }
  }
  if (STEP === 'all' || STEP === 'admin') {
    await login('Admin'); await long('a01-admin-providers', 'site', { row1: ['!tr', 'Clearwater'], row2: ['!tr', 'Ripple'], row3: ['!tr', 'Brightsteps'], select: ['![role=combobox]'] });
    // The mobile admin panel switches sections with a dropdown (the first combobox on the page).
    for (const [opt, name] of [['Claim Requests', 'a02-admin-claims'], ['Import & Invites', 'a03-admin-invites'], ['Reviews', 'a04-admin-reviews'], ['Parents', 'a05-admin-parents']]) {
      await page.getByRole('combobox').first().click(); await settle(400);
      await page.getByRole('option', { name: new RegExp('^' + opt.replace('&', '&')) }).first().click().catch((e) => console.log('admin tab', opt, e.message));
      await long(name, 'site', { gen: ['!button', 'Generate Link'] });
    }
  }
  await browser.close();
})();
