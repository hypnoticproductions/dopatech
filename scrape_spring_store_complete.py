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
        time.sleep(1)  # Be polite to the server
        return response.text
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None

def extract_products_from_html(html_content, base_url):
    """Extract product information from HTML."""
    soup = BeautifulSoup(html_content, 'html.parser')
    product_tiles = soup.find_all('div', attrs={"data-testid": "product-tile"})

    products = []
    seen_links = set()  # To avoid duplicates

    for tile in product_tiles:
        try:
            # Find the link element
            link_tag = tile.find('a', href=re.compile(r'/listing/'))
            if not link_tag:
                continue

            # Extract product link
            relative_link = link_tag.get('href', '')
            full_link = f"{base_url}{relative_link}" if relative_link else ""

            # Skip if we've already seen this exact product link
            if full_link in seen_links:
                continue
            seen_links.add(full_link)

            # Extract product name from sr-only span or img alt
            name_span = link_tag.find('span', class_='sr-only')
            name = name_span.get_text(strip=True) if name_span else None

            if not name:
                img_tag = link_tag.find('img')
                name = img_tag.get('alt', '').strip() if img_tag else None

            if not name:
                continue

            # Extract image URL
            img_tag = link_tag.find('img')
            image_url = img_tag.get('src', '') if img_tag else ""

            # Extract product type (Classic Tee, Hoodie, etc.)
            product_type_elem = tile.find('span', class_=re.compile(r'productType', re.I))
            product_type = product_type_elem.get_text(strip=True) if product_type_elem else ""

            # Extract price
            price_elem = tile.find('span', class_=re.compile(r'productPrice', re.I))
            if price_elem:
                price_span = price_elem.find('span')
                price = price_span.get_text(strip=True) if price_span else "See store for pricing"
            else:
                price = "See store for pricing"

            # Determine category
            category = "Merch"
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

def scrape_spring_store_complete():
    """Comprehensive scraper for all store pages."""
    base_url = "https://dopamine-flow-energy.creator-spring.com"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    # Define all pages to scrape
    pages_to_scrape = [
        {"url": "/", "name": "Main Store (Explore)"},
        {"url": "/apparel", "name": "Apparel"},
        {"url": "/unisex-men-s-t-shirts", "name": "Unisex / Men's T-Shirts"},
        {"url": "/hoodies-sweatshirts", "name": "Hoodies & Sweatshirts"},
        {"url": "/tank-tops", "name": "Tank Tops"},
        {"url": "/long-sleeve-tees", "name": "Long Sleeve Tees"},
        {"url": "/women-s-athletic", "name": "Women's Athletic"},
    ]

    all_products = []
    seen_product_keys = set()  # Track unique products by name + link

    print("="*80)
    print("COMPREHENSIVE SPRING STORE SCRAPER")
    print("="*80)

    for page in pages_to_scrape:
        full_url = f"{base_url}{page['url']}"
        print(f"\n[{page['name']}]")

        html = scrape_page(full_url, headers)
        if not html:
            continue

        products = extract_products_from_html(html, base_url)

        # Add only unique products
        new_products = 0
        for product in products:
            product_key = f"{product['name']}|{product['link']}"
            if product_key not in seen_product_keys:
                seen_product_keys.add(product_key)
                all_products.append(product)
                new_products += 1

        print(f"  Found {len(products)} products ({new_products} new)")

    # Assign IDs and descriptions
    for idx, product in enumerate(all_products):
        product['id'] = idx + 1
        product['description'] = f"Official {product['name']} from the Dopamine Flow Energy collection."

    return all_products

def display_complete_results(products):
    """Display comprehensive results."""
    if not products:
        print("\nNo products found.")
        return

    print("\n" + "="*80)
    print(f"COMPLETE PRODUCT CATALOG - {len(products)} TOTAL PRODUCTS")
    print("="*80)

    # Group by category
    by_category = {}
    for product in products:
        cat = product['category']
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(product)

    # Display by category
    for category, items in sorted(by_category.items()):
        print(f"\n{category} ({len(items)} items)")
        print("-" * 80)
        for product in items:
            print(f"  {product['id']:2d}. {product['name']}")
            if product['product_type']:
                print(f"      Type: {product['product_type']}")
            print(f"      Price: {product['price']}")
            print(f"      Link: {product['link']}")
            print()

    print("\n" + "="*80)
    print("JSON FORMAT (for React storefront)")
    print("="*80)
    print("\nconst [products] = useState(")
    print(json.dumps(products, indent=2))
    print(");")

    # Save to file
    output_file = '/home/user/dopatech/spring_store_products_complete.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

    print(f"\n✓ Complete product catalog saved to: {output_file}")

    # Create a summary
    summary = {
        "total_products": len(products),
        "by_category": {cat: len(items) for cat, items in by_category.items()},
        "last_updated": "2026-01-18"
    }

    summary_file = '/home/user/dopatech/spring_store_summary.json'
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)

    print(f"✓ Summary saved to: {summary_file}")

if __name__ == "__main__":
    products = scrape_spring_store_complete()
    display_complete_results(products)
