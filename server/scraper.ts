import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { InsertProduct } from "@shared/schema";
import { URL } from "url";

/**
 * Extract domain name from URL
 */
function extractDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    let domain = parsedUrl.hostname;
    if (domain.startsWith("www.")) domain = domain.substring(4);
    return domain;
  } catch (error) {
    console.error("Error extracting domain:", error);
    return "";
  }
}

/**
 * Get accurate product image from Amazon using Puppeteer
 */
async function scrapeAmazonProductImage(url: string): Promise<string | null> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("#imgTagWrapperId img", { timeout: 10000 });

    const imageUrl = await page.$eval("#imgTagWrapperId img", (img) =>
      (img as HTMLImageElement).src
    );

    return imageUrl;
  } catch (error) {
    console.error("Failed to scrape Amazon image:", error);
    return null;
  } finally {
    await browser.close();
  }
}

/**
 * Scrape product info from any URL
 */
export async function scrapeProduct(url: string): Promise<Omit<InsertProduct, "category"> | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    let title = $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().trim();

    let description = $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      "";

    let imageUrl = $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content');

    const priceSelectors = [
      '.price', '#price', '.product-price', '[itemprop="price"]',
      '.offer-price', '.sales-price', '.current-price',
    ];

    let price = "";
    for (const selector of priceSelectors) {
      const priceElement = $(selector).first();
      if (priceElement.length) {
        price = priceElement.text().trim();
        break;
      }
    }

    const domain = extractDomain(url);

    console.log("Extracted domain:", domain);

    if (domain.includes("amazon")) {
      console.log("Using Puppeteer for Amazon product image");
      const puppeteerImage = await scrapeAmazonProductImage(url);
      if (puppeteerImage) {
        imageUrl = puppeteerImage;
      }
    }


    // Ensure absolute image URL
    if (imageUrl && !imageUrl.startsWith("http")) {
      const baseUrl = new URL(url);
      imageUrl = new URL(imageUrl, baseUrl.origin).toString();
    }

    if (!imageUrl) {
      imageUrl = "https://via.placeholder.com/400x400?text=No+Image+Available";
    }

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
