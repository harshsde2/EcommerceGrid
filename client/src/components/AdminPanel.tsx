import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

export function AdminPanel() {
  const [productUrl, setProductUrl] = useState("");
  const [category, setCategory] = useState("");

  const addProductSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
    category: z.string().optional(),
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: { url: string; category?: string }) => {
      return await apiRequest("POST", "/api/products", data);
    },
    onSuccess: async () => {
      setProductUrl("");
      setCategory("");
      toast({
        title: "Product added",
        description: "The product has been successfully added",
      });
      // Invalidate cache to refetch products
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input data
      const validData = addProductSchema.parse({
        url: productUrl,
        category: category === "none" ? undefined : category,
      });

      // Submit data
      addProductMutation.mutate(validData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const errorMessage =
          Object.values(fieldErrors).flat()[0] || "Invalid input";
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="mb-8 bg-white rounded-lg shadow">
      <CardContent className="p-6">
        <h2 className="text-xl font-heading font-semibold mb-4">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="productUrl"
              className="text-sm font-medium text-gray-700"
            >
              Product URL
            </Label>
            <Input
              id="productUrl"
              type="url"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://example.com/product"
              className="mt-1 w-full"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the URL of an e-commerce product page
            </p>
          </div>

          <div>
            <Label
              htmlFor="productCategory"
              className="text-sm font-medium text-gray-700"
            >
              Category (optional)
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="productCategory" className="mt-1 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a category</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home & Kitchen</SelectItem>
                <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-2">
            <div className="text-sm text-gray-500 mb-3 sm:mb-0 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Product image and title will be automatically fetched
            </div>
            <Button
              type="submit"
              className="bg-primary-500   hover:bg-primary-600 font-bold py-2 px-6 rounded-md shadow-md"
              disabled={addProductMutation.isPending}
            >
              <span className="text-black">
                {addProductMutation.isPending ? "Adding..." : "Add Product"}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
