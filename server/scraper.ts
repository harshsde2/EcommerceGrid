import axios from "axios";
import * as cheerio from "cheerio";
import { InsertProduct } from "@shared/schema";
import { URL } from "url";

/**
 * Extract domain name from URL
 */
function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    let domain = parsedUrl.hostname;
    
    // Remove www. prefix if present
    if (domain.startsWith("www.")) {
      domain = domain.substring(4);
    }
    
    return domain;
  } catch (error) {
    console.error("Error extracting domain:", error);
    return "";
  }
}

/**
 * Scrape product information from a given URL
 */
export async function scrapeProduct(url: string): Promise<Omit<InsertProduct, "category"> | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract page title
    let title = $('meta[property="og:title"]').attr('content') || 
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text().trim();

    // Extract meta description
    let description = $('meta[property="og:description"]').attr('content') ||
                      $('meta[name="description"]').attr('content') ||
                      $('meta[name="twitter:description"]').attr('content') ||
                      "";

    // Extract product image URL
    let imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('meta[property="twitter:image"]').attr('content');

    // Extract price (try common selectors used by e-commerce sites)
    let price = "";
    const priceSelectors = [
      '.price', '#price', '.product-price', '[itemprop="price"]',
      '.offer-price', '.sales-price', '.current-price',
    ];

    for (const selector of priceSelectors) {
      const priceElement = $(selector).first();
      if (priceElement.length) {
        price = priceElement.text().trim();
        break;
      }
    }

    // Extract domain for display
    const domain = extractDomain(url);

    // Sometimes image URLs are relative, convert to absolute if needed
    if (imageUrl && !imageUrl.startsWith('http')) {
      const baseUrl = new URL(url);
      imageUrl = new URL(imageUrl, baseUrl.origin).toString();
    }

    // Fallback image if no image is found
    if (!imageUrl) {
      imageUrl = "https://via.placeholder.com/400x400?text=No+Image+Available";
    }

    // Sanitize/truncate data as needed
    title = title?.substring(0, 255) || "Unknown Product";
    description = description?.substring(0, 500) || "";

    return {
      title,
      description,
      imageUrl,
      url,
      price,
      domain,
    };
  } catch (error) {
    console.error("Error scraping product:", error);
    return null;
  }
}
