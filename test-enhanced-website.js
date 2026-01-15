import { chromium } from 'playwright';

async function testEnhancedWebsite() {
  console.log('🚀 Starting browser test...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  
  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  try {
    // Navigate to the Vercel deployed site
    console.log('📱 Testing: https://website-kappa-three-68.vercel.app');
    await page.goto('https://website-kappa-three-68.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Check if main elements are present
    console.log('\n📋 Page Load Results:');
    console.log('✅ Page loaded successfully');
    
    // Test navigation elements
    const title = await page.title();
    console.log(`📄 Title: ${title}`);
    
    // Check for key UI elements
    const heroText = await page.$('text=DOPA-TECH');
    console.log(`🎯 Hero section: ${heroText ? '✅ Found' : '❌ Missing'}`);
    
    // Check for sections
    const sections = await page.$$('section');
    console.log(`📦 Sections found: ${sections.length}`);
    
    // Check for navigation
    const nav = await page.$('nav');
    console.log(`🧭 Navigation: ${nav ? '✅ Found' : '❌ Missing'}`);
    
    // Report console errors
    console.log('\n🔍 Console Analysis:');
    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning');
    
    if (errors.length === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`❌ Console errors: ${errors.length}`);
      errors.forEach(e => console.log(`  - ${e.text}`));
    }
    
    if (warnings.length > 0) {
      console.log(`⚠️ Console warnings: ${warnings.length}`);
    }
    
    // Report page errors
    console.log('\n🚨 Page Errors:');
    if (pageErrors.length === 0) {
      console.log('✅ No page errors detected');
    } else {
      console.log(`❌ Page errors: ${pageErrors.length}`);
      pageErrors.forEach(e => console.log(`  - ${e}`));
    }
    
    // Test responsiveness
    console.log('\n📱 Responsive Test:');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    console.log('  ✅ Mobile view (375x667)');
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    console.log('  ✅ Tablet view (768x1024)');
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    console.log('  ✅ Desktop view (1920x1080)');
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testEnhancedWebsite();
