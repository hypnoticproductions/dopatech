import requests
from bs4 import BeautifulSoup
import json
import re
import time

def scrape_page(url, headers):
    """Scrape a single page and return products."""
    try:
        print(f"  Fetching: {url}")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        time.sleep(1)
        return response.text
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None

def extract_products_from_html(html_content, base_url):
    """Extract product information from HTML."""
    soup = BeautifulSoup(html_content, 'html.parser')
    product_tiles = soup.find_all('div', attrs={"data-testid": "product-tile"})

    products = []
    seen_links = set()

    for tile in product_tiles:
        try:
            link_tag = tile.find('a', href=re.compile(r'/listing/'))
            if not link_tag:
                continue

            relative_link = link_tag.get('href', '')
            full_link = f"{base_url}{relative_link}" if relative_link else ""

            if full_link in seen_links:
                continue
            seen_links.add(full_link)

            name_span = link_tag.find('span', class_='sr-only')
            name = name_span.get_text(strip=True) if name_span else None

            if not name:
                img_tag = link_tag.find('img')
                name = img_tag.get('alt', '').strip() if img_tag else None

            if not name:
                continue

            img_tag = link_tag.find('img')
            image_url = img_tag.get('src', '') if img_tag else ""

            product_type_elem = tile.find('span', class_=re.compile(r'productType', re.I))
            product_type = product_type_elem.get_text(strip=True) if product_type_elem else ""

            price_elem = tile.find('span', class_=re.compile(r'productPrice', re.I))
            if price_elem:
                price_span = price_elem.find('span')
                price = price_span.get_text(strip=True) if price_span else "See store for pricing"
            else:
                price = "See store for pricing"

            category = "Apparel"
            name_lower = name.lower()
            type_lower = product_type.lower()

            if any(word in name_lower or word in type_lower for word in ['tee', 't-shirt', 'shirt']):
                category = "T-Shirts"
            elif any(word in name_lower or word in type_lower for word in ['hoodie', 'sweatshirt']):
                category = "Hoodies & Sweatshirts"
            elif any(word in name_lower or word in type_lower for word in ['tank']):
                category = "Tank Tops"
            elif any(word in name_lower or word in type_lower for word in ['long sleeve']):
                category = "Long Sleeve"
            elif any(word in name_lower or word in type_lower for word in ['mug', 'cup', 'bottle']):
                category = "Drinkware"
            elif any(word in name_lower or word in type_lower for word in ['hat', 'cap', 'beanie']):
                category = "Headwear"
            else:
                category = "Merch"

            products.append({
                "name": name,
                "price": price,
                "category": category,
                "product_type": product_type,
                "image": image_url,
                "link": full_link,
            })

        except Exception as e:
            continue

    return products

def scrape_nori_lamour_store():
    """Comprehensive scraper for Nori L'Amour store."""
    base_url = "https://nori-lamour.creator-spring.com"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    pages_to_scrape = [
        {"url": "/", "name": "Main Store"},
        {"url": "/apparel", "name": "Apparel"},
        {"url": "/unisex-men-s-t-shirts", "name": "Unisex / Men's T-Shirts"},
        {"url": "/hoodies-sweatshirts", "name": "Hoodies & Sweatshirts"},
        {"url": "/tank-tops", "name": "Tank Tops"},
        {"url": "/long-sleeve-tees", "name": "Long Sleeve Tees"},
        {"url": "/women-s-athletic", "name": "Women's Athletic"},
    ]

    all_products = []
    seen_product_keys = set()

    print("="*80)
    print("NORI L'AMOUR STORE SCRAPER")
    print("="*80)

    for page in pages_to_scrape:
        full_url = f"{base_url}{page['url']}"
        print(f"\n[{page['name']}]")

        html = scrape_page(full_url, headers)
        if not html:
            continue

        products = extract_products_from_html(html, base_url)

        new_products = 0
        for product in products:
            product_key = f"{product['name']}|{product['link']}"
            if product_key not in seen_product_keys:
                seen_product_keys.add(product_key)
                all_products.append(product)
                new_products += 1

        print(f"  Found {len(products)} products ({new_products} new)")

    for idx, product in enumerate(all_products):
        product['id'] = idx + 1
        product['description'] = f"Refined {product['name']} from the Nori L'Amour collection."

    return all_products

if __name__ == "__main__":
    products = scrape_nori_lamour_store()

    print(f"\n{'='*80}")
    print(f"TOTAL PRODUCTS EXTRACTED: {len(products)}")
    print(f"{'='*80}\n")

    output_file = '/home/user/dopatech/nori_lamour_products.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

    print(f"✓ Products saved to: {output_file}")

    # Display summary
    categories = {}
    for p in products:
        cat = p['category']
        categories[cat] = categories.get(cat, 0) + 1

    print("\nCategory Breakdown:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count} items")
