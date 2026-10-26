import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectPages() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

  console.log('--- Testing Desktop Interactions ---');

  // 1. Test Home Page
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  
  // Inspect Bento grid layout heights and aspect ratios
  const bentoStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.bento-item, [data-bento]'));
    return { count: cards.length };
  });
  console.log('Bento items count:', bentoStats);

  // 2. Test Search in Navbar
  console.log('Testing Navbar Search...');
  const searchInput = await page.$('input[placeholder*="Tìm kiếm"]');
  if (searchInput) {
    await searchInput.type('Nhẫn');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
    console.log('Navigated URL after search:', page.url());
  }

  // 3. Test Products Page Filters
  await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle2' });
  const productCount = await page.evaluate(() => {
    return document.querySelectorAll('.MuiCard-root').length;
  });
  console.log('Products displayed count:', productCount);

  // 4. Test Product Detail Page
  await page.goto('http://localhost:5173/product/SP001', { waitUntil: 'networkidle2' });
  const detailInfo = await page.evaluate(() => {
    const title = document.querySelector('h1, h2, h3')?.textContent;
    const price = document.querySelector('[data-price], .MuiTypography-h4')?.textContent;
    const addToCartBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Thêm Vào Giỏ'));
    return { title, price, hasAddToCart: !!addToCartBtn };
  });
  console.log('Product Detail Info:', detailInfo);

  // Click Add to Cart
  const addToCartBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Thêm Vào Giỏ'));
  });
  if (addToCartBtn) {
    await addToCartBtn.click();
    await new Promise(r => setTimeout(r, 800));
    console.log('Clicked Add to Cart on Detail Page');
  }

  // 5. Test Cart Page
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2' });
  const cartInfo = await page.evaluate(() => {
    const rows = document.querySelectorAll('tbody tr, [data-cart-item]');
    const totalText = document.body.innerText;
    return {
      itemCount: rows.length,
      hasCheckoutBtn: Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Thanh Toán') || b.textContent.includes('Đặt Hàng'))
    };
  });
  console.log('Cart Page Info:', cartInfo);

  // 6. Test Mobile Viewport Home Page
  await page.setViewport({ width: 375, height: 667, isMobile: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  const mobileOverflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      isOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log('Mobile 375px Overflow Check:', mobileOverflow);

  // Check any elements causing overflow
  const overflowingElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const all = document.querySelectorAll('*');
    const offenders = [];
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 2) {
        offenders.push({
          tag: el.tagName,
          id: el.id,
          className: (el.className || '').toString().slice(0, 50),
          width: rect.width,
          right: rect.right
        });
      }
    }
    return offenders.slice(0, 5);
  });
  console.log('Overflowing elements on Mobile:', overflowingElements);

  await browser.close();
  console.log('\nAll Console Warnings/Errors:');
  consoleLogs.filter(l => l.type === 'warning' || l.type === 'error').forEach(l => console.log(`[${l.type}] ${l.text}`));
}

inspectPages().catch(console.error);
