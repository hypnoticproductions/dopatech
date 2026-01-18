import requests
from bs4 import BeautifulSoup
import json

def scrape_spring_store(store_url):
    """
    Scrapes a Spring (Teespring) store page to extract product details.
    Outputs a JSON-like format compatible with the React storefront.
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

    # Spring stores usually store their product data in a JSON object inside a <script> tag
    # or within specific product card classes. We'll target the common card structure.
    product_cards = soup.select('.product-card') # Common class for Spring widgets

    # If standard cards aren't found, we look for the grid items
    if not product_cards:
        product_cards = soup.find_all('div', attrs={"data-testid": "product-card"})

    extracted_products = []

    for idx, card in enumerate(product_cards):
        try:
            # Extract Name
            name_tag = card.find('h3') or card.find('p', class_='product-card__title')
            name = name_tag.get_text(strip=True) if name_tag else "Unknown Product"

            # Extract Price
            price_tag = card.find('span', class_='product-card__price') or card.find('p', class_='product-card__price')
            price = price_tag.get_text(strip=True) if price_tag else "Contact for Price"

            # Extract Image URL
            img_tag = card.find('img')
            # Look for src or data-src for lazy loading
            image_url = img_tag.get('src') or img_tag.get('data-src') if img_tag else ""

            # Extract Product Link
            link_tag = card.find('a')
            relative_link = link_tag.get('href') if link_tag else ""
            full_link = f"https://dopamine-flow-energy.creator-spring.com{relative_link}" if relative_link.startswith('/') else relative_link

            extracted_products.append({
                "id": idx + 1,
                "name": name,
                "price": price,
                "category": "Apparel" if "Tee" in name or "Hoodie" in name else "Merch",
                "image": image_url,
                "link": full_link,
                "description": f"Official {name} from the Dopamine Flow collection."
            })
        except Exception as e:
            continue

    if not extracted_products:
        print("No products found. Note: Some stores use heavy Javascript. If this returns empty, consider using a browser-based scraper like WebScraper.io.")
    else:
        print("\n--- COPY AND PASTE THE BLOCK BELOW INTO YOUR storefront.jsx ---\n")
        print("const [products] = useState(")
        print(json.dumps(extracted_products, indent=2))
        print(");")

# RUN THE SCRAPER
if __name__ == "__main__":
    store_link = "https://dopamine-flow-energy.creator-spring.com/"
    scrape_spring_store(store_link)
