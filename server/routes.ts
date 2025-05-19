import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeProduct } from "./scraper";
import { addProductSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Add a new product from URL
  app.post("/api/products", async (req, res) => {
    try {
      // Validate the request body
      const { url, category } = addProductSchema.parse(req.body);

      // Scrape product information from the URL
      const scrapedProduct = await scrapeProduct(url);

      console.log("loggggg")

      if (!scrapedProduct) {
        return res.status(400).json({
          message: "Failed to extract product information from the provided URL"
        });
      }

      // Add the product to storage
      const product = await storage.createProduct({
        ...scrapedProduct,
        category: category || "other",
        url,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error("Error adding product:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid input",
          errors: error.flatten().fieldErrors
        });
      }

      res.status(500).json({ message: "Failed to add product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
      const deleted = await storage.deleteProduct(id);
      if (deleted) {
        return res.status(200).json({ message: "Product deleted" });
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
