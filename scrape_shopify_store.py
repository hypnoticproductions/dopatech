import requests
from bs4 import BeautifulSoup
import json
import time

def scrape_shopify_json(base_url):
    """
    Try to scrape products using Shopify's JSON API endpoint.
    Most Shopify stores expose /products.json with product data.
    """
    products_url = f"{base_url}/products.json"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print(f"Attempting to fetch products from JSON API: {products_url}")

    try:
        all_products = []
        page = 1

        while True:
            # Shopify paginates with page parameter
            paginated_url = f"{products_url}?page={page}&limit=250"
            print(f"  Fetching page {page}...")

            response = requests.get(paginated_url, headers=headers)
            response.raise_for_status()

            data = response.json()
            products = data.get('products', [])

            if not products:
                break

            all_products.extend(products)
            print(f"  Found {len(products)} products on page {page}")

            # If we got fewer than 250 products, we're on the last page
            if len(products) < 250:
                break

            page += 1
            time.sleep(0.5)  # Be polite to the server

        return all_products

    except Exception as e:
        print(f"  Error fetching JSON API: {e}")
        return None

def scrape_shopify_html(base_url):
    """
    Scrape products by parsing HTML from the collections/all page.
    """
    collections_url = f"{base_url}/collections/all"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print(f"Attempting to scrape products from HTML: {collections_url}")

    try:
        response = requests.get(collections_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        products = []

        # Try different common Shopify HTML structures
        # Method 1: Look for product grid items
        product_items = soup.find_all(['div', 'li', 'article'], class_=lambda x: x and ('product' in x.lower() or 'item' in x.lower()))

        print(f"  Found {len(product_items)} potential product containers")

        for item in product_items:
            try:
                # Find product link
                link_tag = item.find('a', href=lambda x: x and '/products/' in x)
                if not link_tag:
                    continue

                product_url = link_tag.get('href', '')
                if not product_url.startswith('http'):
                    product_url = base_url + product_url

                # Find product name
                name = None
                for tag in ['h2', 'h3', 'h4', 'div', 'span']:
                    name_elem = item.find(tag, class_=lambda x: x and ('title' in x.lower() or 'name' in x.lower()))
                    if name_elem:
                        name = name_elem.get_text(strip=True)
                        break

                if not name:
                    # Try getting from link text or image alt
                    name = link_tag.get_text(strip=True) or link_tag.find('img', alt=True).get('alt', '') if link_tag.find('img', alt=True) else ''

                if not name:
                    continue

                # Find image
                img_tag = item.find('img')
                image_url = ''
                if img_tag:
                    image_url = img_tag.get('src', '') or img_tag.get('data-src', '')
                    # Handle Shopify's lazy loading
                    if image_url.startswith('//'):
                        image_url = 'https:' + image_url

                # Find price
                price = "See store for pricing"
                price_elem = item.find(['span', 'div'], class_=lambda x: x and 'price' in x.lower())
                if price_elem:
                    price = price_elem.get_text(strip=True)

                products.append({
                    'title': name,
                    'handle': product_url.split('/products/')[-1] if '/products/' in product_url else '',
                    'images': [{'src': image_url}] if image_url else [],
                    'variants': [{'price': price.replace('$', '')}],
                    'product_type': '',
                    'body_html': ''
                })

            except Exception as e:
                continue

        return products if products else None

    except Exception as e:
        print(f"  Error scraping HTML: {e}")
        return None

def transform_shopify_products(shopify_products, base_url):
    """
    Transform Shopify product data into our store format.
    """
    transformed_products = []

    for idx, product in enumerate(shopify_products):
        # Get the first variant for pricing (Shopify products have variants)
        variants = product.get('variants', [])
        first_variant = variants[0] if variants else {}

        # Get price (Shopify returns price as string like "25.00")
        price = first_variant.get('price', '0.00')
        if not price.startswith('$'):
            price_formatted = f"${price}"
        else:
            price_formatted = price

        # Get the first image
        images = product.get('images', [])
        image_url = images[0].get('src', '') if images else ''

        # Product link
        handle = product.get('handle', '')
        product_link = f"{base_url}/products/{handle}" if handle else ''

        # Determine category based on product type or tags
        product_type = product.get('product_type', '').lower()
        product_name = product.get('title', '').lower()

        category = "Merch"
        if 'tee' in product_type or 't-shirt' in product_type or 'shirt' in product_type or 'tee' in product_name or 't-shirt' in product_name:
            category = "T-Shirts"
        elif 'hoodie' in product_type or 'sweatshirt' in product_type or 'hoodie' in product_name:
            category = "Hoodies & Sweatshirts"
        elif 'tank' in product_type or 'tank' in product_name:
            category = "Tank Tops"
        elif 'long sleeve' in product_type or 'long sleeve' in product_name:
            category = "Long Sleeve"
        elif any(word in product_type or word in product_name for word in ['mug', 'cup', 'bottle']):
            category = "Drinkware"
        elif any(word in product_type or word in product_name for word in ['hat', 'cap', 'beanie']):
            category = "Headwear"

        transformed_products.append({
            "id": idx + 1,
            "name": product.get('title', 'Unknown Product'),
            "price": price_formatted,
            "category": category,
            "product_type": product.get('product_type', ''),
            "image": image_url,
            "link": product_link,
            "description": product.get('body_html', '').replace('<p>', '').replace('</p>', '').strip()[:200] or f"Official {product.get('title', '')} from the Dopamine Flow Energy collection."
        })

    return transformed_products

def scrape_shopify_store(base_url):
    """Main scraper function."""
    print("="*80)
    print("SHOPIFY STORE SCRAPER")
    print(f"Store: {base_url}")
    print("="*80)

    # Try JSON API first (fastest and most reliable)
    shopify_products = scrape_shopify_json(base_url)

    if shopify_products:
        print(f"\n✓ Successfully fetched {len(shopify_products)} products from JSON API")
        products = transform_shopify_products(shopify_products, base_url)
        return products

    # Fallback to HTML scraping
    print("\n✗ Could not fetch products from JSON API, trying HTML scraping...")
    shopify_products = scrape_shopify_html(base_url)

    if shopify_products:
        print(f"\n✓ Successfully scraped {len(shopify_products)} products from HTML")
        products = transform_shopify_products(shopify_products, base_url)
        return products
    else:
        print("\n✗ Could not scrape products from HTML either")
        return []

def display_results(products, base_url):
    """Display and save results."""
    if not products:
        print("\nNo products found.")
        return

    print("\n" + "="*80)
    print(f"PRODUCT CATALOG - {len(products)} TOTAL PRODUCTS")
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
        for product in items[:5]:  # Show first 5 in each category
            print(f"  {product['id']:2d}. {product['name']}")
            print(f"      Price: {product['price']}")
            print(f"      Link: {product['link']}")
        if len(items) > 5:
            print(f"  ... and {len(items) - 5} more")

    # Save to file
    output_file = '/home/user/dopatech/shopify_store_products.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

    print(f"\n✓ Product catalog saved to: {output_file}")

    # Create a summary
    summary = {
        "store_url": base_url,
        "total_products": len(products),
        "by_category": {cat: len(items) for cat, items in by_category.items()},
        "last_updated": "2026-01-19"
    }

    summary_file = '/home/user/dopatech/shopify_store_summary.json'
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)

    print(f"✓ Summary saved to: {summary_file}")

if __name__ == "__main__":
    store_url = "https://susq10-wy.myshopify.com"
    products = scrape_shopify_store(store_url)
    display_results(products, store_url)
