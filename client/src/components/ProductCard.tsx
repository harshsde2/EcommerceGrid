import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
}

export function ProductCard({ product, isAdmin = false }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleVisitClick = () => {
  if (!product.url) {
    console.warn("No URL provided for this product");
    return;
  }
  window.open(product.url, "_blank", "noopener,noreferrer");
};
  const deleteProductMutation = useMutation({
   mutationFn: async () => {
    try {
      const res = await apiRequest("DELETE", `/api/products/${product.id}`);
      console.log("Delete response:", res);
      return res;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been successfully removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = () => {
    setIsDeleting(true);
    deleteProductMutation.mutate();
  };
  console.log("product.imageUrl", product.imageUrl);
  return (
    <Card onClick={handleVisitClick} className="overflow-hidden flex flex-col h-full bg-white hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.imageUrl && !imageError ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <CardContent className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            {product.category && (
              <Badge variant="outline" className="text-xs capitalize">
                {product.category}
              </Badge>
            )}
          </div>
          <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
            {new URL(product.url).hostname.replace('www.', '')}
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          {/* <Button 
            variant="default" 
            size="sm" 
            className="flex-grow bg-primary-500 hover:bg-primary-600"
            onClick={handleVisitClick}
          >
            <span className="text-black">View Product</span>
          </Button> */}
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={handleDeleteClick}
              disabled={isDeleting || deleteProductMutation.isPending}
            >
              {isDeleting ? "..." : "Delete"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}