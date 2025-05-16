import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { Product } from "@shared/schema";
import { useState, useEffect } from "react";

interface ProductsGridProps {
  products: Product[];
  searchTerm: string;
  categoryFilter: string;
}

export function ProductsGrid({ products, searchTerm, categoryFilter }: ProductsGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    // Filter products based on search term and category
    const filtered = products.filter(product => {
      const matchesSearch = !searchTerm 
        || product.title.toLowerCase().includes(searchTerm.toLowerCase())
        || (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  if (filteredProducts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
