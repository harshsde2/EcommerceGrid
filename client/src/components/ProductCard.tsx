import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { title, imageUrl, url, description, price, domain, category } = product;

  // Mapping of categories to badge colors
  const categoryColors: Record<string, string> = {
    electronics: "bg-primary-100 text-primary-800",
    clothing: "bg-blue-100 text-blue-800",
    home: "bg-green-100 text-green-800",
    beauty: "bg-purple-100 text-purple-800",
    other: "bg-gray-100 text-gray-800",
  };

  const badgeClass = categoryColors[category || "other"] || categoryColors.other;

  return (
    <Card className="product-card overflow-hidden shadow-md hover:shadow-lg">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="overflow-hidden bg-gray-200">
          <AspectRatio ratio={1} className="h-64">
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
        <CardContent className="p-4">
          {category && (
            <Badge variant="outline" className={`${badgeClass} mb-2 font-medium`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{description}</p>
          )}
          <div className="flex justify-between items-center">
            {price && <span className="text-primary-500 font-semibold">{price}</span>}
            {domain && <span className="text-xs text-gray-500">{domain}</span>}
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
