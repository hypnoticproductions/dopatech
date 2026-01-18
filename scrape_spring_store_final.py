import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_spring_store(store_url):
    """
    Scrapes Spring store by parsing the actual HTML structure.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print(f"--- Accessing Store: {store_url} ---\n")

    try:
        response = requests.get(store_url, headers=headers)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching the store: {e}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all product tiles using the data-testid attribute
    product_tiles = soup.find_all('div', attrs={"data-testid": "product-tile"})

    extracted_products = []
    seen_names = set()  # To avoid duplicates

    for idx, tile in enumerate(product_tiles):
        try:
            # Find the link element
            link_tag = tile.find('a', href=re.compile(r'/listing/'))
            if not link_tag:
                continue

            # Extract product name from sr-only span or img alt
            name_span = link_tag.find('span', class_='sr-only')
            name = name_span.get_text(strip=True) if name_span else None

            if not name:
                img_tag = link_tag.find('img')
                name = img_tag.get('alt', '').strip() if img_tag else None

            if not name or name in seen_names:
                continue

            seen_names.add(name)

            # Extract image URL
            img_tag = link_tag.find('img')
            image_url = img_tag.get('src', '') if img_tag else ""

            # Extract product link
            relative_link = link_tag.get('href', '')
            full_link = f"https://dopamine-flow-energy.creator-spring.com{relative_link}" if relative_link else ""

            # Try to find price (it might be in a sibling element or elsewhere in the tile)
            price_element = tile.find('p', class_=re.compile(r'price', re.I))
            price = price_element.get_text(strip=True) if price_element else "See store for pricing"

            # Determine category based on product name
            category = "Apparel"
            name_lower = name.lower()
            if any(word in name_lower for word in ['tee', 't-shirt', 'shirt', 'hoodie', 'sweatshirt']):
                category = "Apparel"
            elif any(word in name_lower for word in ['mug', 'cup', 'bottle']):
                category = "Drinkware"
            elif any(word in name_lower for word in ['hat', 'cap', 'beanie']):
                category = "Headwear"
            else:
                category = "Merch"

            extracted_products.append({
                "id": len(extracted_products) + 1,
                "name": name,
                "price": price,
                "category": category,
                "image": image_url,
                "link": full_link,
                "description": f"Official {name} from the Dopamine Flow Energy collection."
            })

        except Exception as e:
            continue

    return extracted_products

def display_results(products):
    """Display the scraped products in multiple formats."""
    if not products:
        print("No products found.")
        return

    print(f"✓ Successfully extracted {len(products)} products!\n")
    print("="*80)
    print("ITEMIZED PRODUCT LINKS")
    print("="*80)

    for product in products:
        print(f"\n{product['id']}. {product['name']}")
        print(f"   Category: {product['category']}")
        print(f"   Image: {product['image']}")
        print(f"   Link: {product['link']}")
        print(f"   Price: {product['price']}")

    print("\n" + "="*80)
    print("JSON FORMAT (for React storefront)")
    print("="*80)
    print("\nconst [products] = useState(")
    print(json.dumps(products, indent=2))
    print(");")

    # Save to file
    output_file = '/home/user/dopatech/spring_store_products.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)
    print(f"\n✓ Products saved to: {output_file}")

if __name__ == "__main__":
    store_link = "https://dopamine-flow-energy.creator-spring.com/"
    products = scrape_spring_store(store_link)
    display_results(products)
