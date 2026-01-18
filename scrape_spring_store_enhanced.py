import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_spring_store(store_url):
    """
    Enhanced scraper that looks for JavaScript-embedded product data.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print(f"--- Accessing Store: {store_url} ---")

    try:
        response = requests.get(store_url, headers=headers)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching the store: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # Method 1: Look for JSON data in script tags
    scripts = soup.find_all('script')
    extracted_products = []

    for script in scripts:
        script_text = script.string
        if script_text:
            # Look for common patterns in Spring stores
            # Pattern 1: window.__INITIAL_STATE__ or similar
            if 'products' in script_text.lower() or 'items' in script_text.lower():
                # Try to extract JSON objects
                try:
                    # Look for JSON-like structures
                    json_matches = re.findall(r'\{[^{}]*"(?:title|name|price)"[^{}]*\}', script_text)
                    for match in json_matches:
                        try:
                            data = json.loads(match)
                            print(f"Found potential product data: {data}")
                        except:
                            pass
                except Exception as e:
                    pass

    # Method 2: Try different selectors for Spring stores
    selectors = [
        'div[class*="product"]',
        'div[class*="item"]',
        'a[href*="/listing/"]',
        'div[data-testid*="product"]',
        '.grid-item',
        '[class*="ProductCard"]'
    ]

    for selector in selectors:
        cards = soup.select(selector)
        if cards:
            print(f"\nFound {len(cards)} elements with selector: {selector}")
            for idx, card in enumerate(cards[:3]):  # Print first 3 for debugging
                print(f"\nCard {idx + 1} HTML preview:")
                print(str(card)[:500])  # First 500 chars

    # Method 3: Save the raw HTML for inspection
    with open('/home/user/dopatech/spring_store_raw.html', 'w', encoding='utf-8') as f:
        f.write(response.text)
    print("\n--- Raw HTML saved to spring_store_raw.html for inspection ---")

    # Method 4: Look for specific Spring/Teespring patterns
    print("\n--- Searching for specific patterns ---")
    if 'creator-spring' in response.text:
        print("✓ Creator Spring platform detected")
    if 'product' in response.text.lower():
        product_count = response.text.lower().count('product')
        print(f"✓ Found {product_count} instances of 'product' in HTML")

    # Look for API endpoints or data URLs
    api_patterns = re.findall(r'https?://[^\s"\']+(?:api|products?|items?)[^\s"\']*', response.text)
    if api_patterns:
        print(f"\n--- Found potential API endpoints ---")
        for pattern in set(api_patterns[:10]):
            print(f"  - {pattern}")

if __name__ == "__main__":
    store_link = "https://dopamine-flow-energy.creator-spring.com/"
    scrape_spring_store(store_link)
