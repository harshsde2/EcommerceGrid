import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;
}

// Database implementation using PostgreSQL and Drizzle ORM
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        title: insertProduct.title,
        description: insertProduct.description || null,
        imageUrl: insertProduct.imageUrl,
        url: insertProduct.url,
        price: insertProduct.price || null,
        domain: insertProduct.domain || null,
        category: insertProduct.category || null
      })
      .returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const dataToUpdate: Partial<Product> = {};
    
    if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description || null;
    if (updateData.imageUrl !== undefined) dataToUpdate.imageUrl = updateData.imageUrl;
    if (updateData.url !== undefined) dataToUpdate.url = updateData.url;
    if (updateData.price !== undefined) dataToUpdate.price = updateData.price || null;
    if (updateData.domain !== undefined) dataToUpdate.domain = updateData.domain || null;
    if (updateData.category !== undefined) dataToUpdate.category = updateData.category || null;
    
    const [updatedProduct] = await db
      .update(products)
      .set(dataToUpdate)
      .where(eq(products.id, id))
      .returning();
    
    if (!updatedProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    
    return result.length > 0;
  }
}

// Export an instance of DatabaseStorage for use throughout the application
export const storage = new DatabaseStorage();
