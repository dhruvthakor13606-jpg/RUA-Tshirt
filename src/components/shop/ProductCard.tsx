import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { useState } from "react";

/** Individual product card with hover effect and quick-add */
const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    setTimeout(() => {
      addItem(product);
      setAdding(false);
    }, 400);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-in"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.trending && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-foreground text-background rounded-md">
            Trending
          </span>
        )}
        {/* Quick-add button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 rounded-lg shadow-card"
          onClick={handleAdd}
          disabled={adding}
        >
          <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
          {adding ? "Adding…" : "Add"}
        </Button>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-0.5">
        <h3 className="text-sm font-medium text-foreground truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
